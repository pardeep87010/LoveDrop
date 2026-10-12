import crypto from "crypto";

/**
 * Retrieves the 32-byte encryption key from environment variables.
 */
function getEncryptionKey(): Buffer {
  const hexKey = process.env.IMAGE_ENCRYPTION_KEY;
  if (!hexKey) {
    throw new Error(
      "Missing IMAGE_ENCRYPTION_KEY in .env.local. Must be a 32-byte (64-character) hex string."
    );
  }
  const keyBuf = Buffer.from(hexKey, "hex");
  if (keyBuf.length !== 32) {
    throw new Error(
      `Invalid IMAGE_ENCRYPTION_KEY length: expected 32 bytes, got ${keyBuf.length} bytes.`
    );
  }
  return keyBuf;
}

/**
 * Encrypt an image buffer with AES-256-GCM
 * Output format: [12 bytes IV] + [16 bytes Auth Tag] + [Ciphertext]
 */
export function encryptImageBuffer(buffer: Buffer): Buffer {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96-bit IV standard for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag(); // 128-bit authentication tag

  // Pack IV (12) + Tag (16) + Encrypted Data into single buffer
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Decrypt an AES-256-GCM encrypted image buffer
 */
export function decryptImageBuffer(encryptedPayload: Buffer): Buffer {
  const key = getEncryptionKey();

  if (encryptedPayload.length < 28) {
    throw new Error("Invalid encrypted payload: buffer too short.");
  }

  const iv = encryptedPayload.subarray(0, 12);
  const authTag = encryptedPayload.subarray(12, 28);
  const ciphertext = encryptedPayload.subarray(28);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
