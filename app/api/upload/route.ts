import { NextRequest, NextResponse } from "next/server";
import { uploadEncryptedImageToR2 } from "@/lib/cloudflareR2";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Strict Allowed MIME types - ONLY images
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
]);

// Single image maximum size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check (max 30 uploads per min per IP)
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`upload:${ip}`, 30, 60 * 1000);
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Upload rate limit exceeded. Please wait ${rateLimit.resetInSeconds}s before trying again.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided in request." },
        { status: 400 }
      );
    }

    // 3. Strict Image-Only Validation
    const mimeType = (file.type || "").toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type. Only image files (JPEG, PNG, WEBP, GIF, HEIC) are allowed.`,
        },
        { status: 400 }
      );
    }

    // 4. Strict 20MB File Size Limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds the 20MB limit. Single image maximum allowed size is 20MB.",
        },
        { status: 400 }
      );
    }

    // 5. Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Check if Cloudflare R2 is configured
    const isR2Configured = Boolean(
      process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY &&
        process.env.R2_BUCKET_NAME
    );

    if (!isR2Configured) {
      // Fallback if R2 credentials missing
      const base64Data = buffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        storage: "inline_fallback",
      });
    }

    // 7. Encrypt image buffer with AES-256-GCM and upload ciphertext to Cloudflare R2
    const result = await uploadEncryptedImageToR2(buffer, mimeType, file.name);

    return NextResponse.json({
      success: true,
      url: result.url,
      storage: "cloudflare_r2_encrypted",
      key: result.key,
      sizeBytes: buffer.length,
    });
  } catch (err: any) {
    console.error("[Upload API Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to upload and encrypt image.",
      },
      { status: 500 }
    );
  }
}
