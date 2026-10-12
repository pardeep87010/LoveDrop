import { NextRequest, NextResponse } from "next/server";
import { getObjectFromR2 } from "@/lib/cloudflareR2";
import { decryptImageBuffer } from "@/lib/imageCrypto";

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string[] } }
) {
  try {
    const keyArray = params.key;
    if (!keyArray || keyArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image key is required." },
        { status: 400 }
      );
    }

    const fullKey = keyArray.join("/");

    // 1. Fetch encrypted blob from Cloudflare R2
    const { buffer: encryptedBuffer, mimeType } = await getObjectFromR2(fullKey);

    // 2. Decrypt AES-256-GCM ciphertext in memory
    const decryptedBuffer = decryptImageBuffer(encryptedBuffer);

    // 3. Return decrypted image stream with aggressive immutable caching
    return new NextResponse(new Uint8Array(decryptedBuffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    console.error("[Media Decryption Stream Error]:", err?.message);
    return NextResponse.json(
      { success: false, error: "Image could not be retrieved or decrypted." },
      { status: 404 }
    );
  }
}
