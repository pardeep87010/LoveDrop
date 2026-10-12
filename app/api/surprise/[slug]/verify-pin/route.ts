import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Surprise } from "@/models/Surprise";
import { verifyPasscode } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug?.toLowerCase().trim();
    const ip = getClientIp(req);

    // Rate limiting: strict 5 attempts per minute per IP to block brute-force PIN crackers
    const rateLimit = checkRateLimit(`pin:${slug}:${ip}`, 5, 60 * 1000);
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: `Too many failed attempts. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const { pin } = await req.json();

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, verified: false, error: "PIN is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const surprise = await Surprise.findOne({ slug }).select("hasPasscode passcodeHash").lean();

    if (!surprise) {
      return NextResponse.json(
        { success: false, error: "Surprise not found." },
        { status: 404 }
      );
    }

    if (!surprise.hasPasscode || !surprise.passcodeHash) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: "No PIN required for this surprise.",
      });
    }

    const isMatch = await verifyPasscode(pin, surprise.passcodeHash);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Incorrect PIN. Please try again! 🔒",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "PIN verified successfully! 💖",
    });
  } catch (err: any) {
    console.error("[Verify PIN Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to verify PIN." },
      { status: 500 }
    );
  }
}
