import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { encryptImageBuffer } from "./imageCrypto";

/**
 * Returns an S3 client configured for Cloudflare R2
 */
export function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Cloudflare R2 configuration missing. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in .env.local"
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Upload an image to Cloudflare R2 encrypted with AES-256-GCM.
 * The raw data stored in Cloudflare is unreadable ciphertext.
 *
 * @param buffer Raw image buffer
 * @param mimeType MIME type of the original image (e.g. 'image/webp', 'image/jpeg')
 * @param originalFilename Optional original file name
 * @returns { url: string, key: string, isEncrypted: boolean }
 */
export async function uploadEncryptedImageToR2(
  buffer: Buffer,
  mimeType: string,
  originalFilename?: string
): Promise<{ url: string; key: string; isEncrypted: boolean }> {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("Missing R2_BUCKET_NAME in environment variables.");
  }

  // Determine extension
  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/heic": "heic",
  };
  let ext = extensionMap[mimeType.toLowerCase()] || "jpg";

  // Generate unique key for encrypted blob
  const randomKey = `photos/enc-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

  // Encrypt with AES-256-GCM
  const encryptedPayload = encryptImageBuffer(buffer);

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: randomKey,
    Body: encryptedPayload,
    ContentType: "application/octet-stream", // Raw encrypted binary
    Metadata: {
      "original-mime": mimeType,
    },
    CacheControl: "public, max-age=31536000, immutable",
  });

  await client.send(command);

  // Return local secure decryption streaming proxy URL
  return {
    url: `/api/media/${randomKey}`,
    key: randomKey,
    isEncrypted: true,
  };
}

/**
 * Fetch an object directly from Cloudflare R2 bucket as a Buffer
 */
export async function getObjectFromR2(
  key: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("Missing R2_BUCKET_NAME in environment variables.");
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await client.send(command);
  if (!response.Body) {
    throw new Error(`Object body for key ${key} is empty.`);
  }

  // Convert incoming stream to Buffer
  const byteArray = await response.Body.transformToByteArray();
  const buffer = Buffer.from(byteArray);
  const originalMime = response.Metadata?.["original-mime"] || "image/jpeg";

  return { buffer, mimeType: originalMime };
}
