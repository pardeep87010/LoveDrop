import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Birthday } from "@/models/Birthday";
import { Surprise } from "@/models/Surprise";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug?.toLowerCase().trim();

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
    } catch (dbErr: any) {
      console.warn("[MongoDB Connection Warning in Birthday GET]:", dbErr.message);
      return NextResponse.json(
        { success: false, dbOffline: true, error: "Database offline" },
        { status: 503 }
      );
    }

    // 1. High-speed lean query on Birthday model
    let birthday = await Birthday.findOne(
      { slug },
      {
        passcodeHash: 0,
        creatorEmail: 0,
        recipientEmail: 0,
        __v: 0,
      }
    ).lean();

    // 2. Fallback check on Surprise collection in case it was saved there
    if (!birthday) {
      const surprise = await Surprise.findOne(
        { slug },
        {
          passcodeHash: 0,
          creatorEmail: 0,
          recipientEmail: 0,
          __v: 0,
        }
      ).lean();

      if (surprise) {
        birthday = {
          id: surprise.id,
          slug: surprise.slug,
          templateType: "birthday-party",
          recipientName: surprise.recipientName,
          senderName: surprise.senderName,
          letterText: surprise.letterText || surprise.letterContent || "",
          letterTitle: surprise.letterTitle,
          buttonText: surprise.buttonText || "Open my gift",
          photos: surprise.photos || [],
          loveReasons: surprise.loveReasons || surprise.reasons || [],
          bgMusic: (surprise.bgMusic as any) || "romantic-lofi",
          hasPasscode: surprise.hasPasscode || false,
          isPaid: surprise.isPaid || true,
          createdAt: surprise.createdAt?.toISOString?.() || new Date().toISOString(),
          expiresAt: surprise.expiresAt?.toISOString?.() || new Date().toISOString(),
          viewsCount: surprise.viewsCount || 0,
        } as any;
      }
    }

    if (!birthday) {
      return NextResponse.json(
        { success: false, notFound: true, error: "Birthday surprise not found" },
        { status: 404 }
      );
    }

    // 3. Non-blocking asynchronous view count increment
    Birthday.updateOne({ slug }, { $inc: { viewsCount: 1 } })
      .exec()
      .catch((err) => console.warn("[Birthday view count update error]:", err?.message));

    // 4. Return response with caching headers
    return NextResponse.json(
      {
        success: true,
        data: birthday,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=180",
        },
      }
    );
  } catch (err: any) {
    console.error("[Get Birthday Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to retrieve birthday surprise" },
      { status: 500 }
    );
  }
}
