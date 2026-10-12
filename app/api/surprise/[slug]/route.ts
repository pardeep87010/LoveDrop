import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
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
      console.warn("[MongoDB Connection Warning in GET]:", dbErr.message);
      return NextResponse.json(
        { success: false, dbOffline: true, error: "Database offline" },
        { status: 503 }
      );
    }

    // 1. High-speed lean read query (No DB write locking)
    const surprise = await Surprise.findOne(
      { slug },
      {
        passcodeHash: 0,
        creatorEmail: 0,
        recipientEmail: 0,
        __v: 0,
      }
    ).lean();

    if (!surprise) {
      return NextResponse.json(
        { success: false, notFound: true, error: "Surprise not found" },
        { status: 404 }
      );
    }

    // 2. Non-blocking asynchronous view count increment (Zero response delay)
    Surprise.updateOne({ slug }, { $inc: { viewsCount: 1 } })
      .exec()
      .catch((err) => console.warn("[Non-blocking view count update error]:", err?.message));

    // 3. High-performance Edge CDN caching (60s fresh, 5min stale-while-revalidate)
    return NextResponse.json(
      {
        success: true,
        data: surprise,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: any) {
    console.error("[Get Surprise Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to retrieve surprise" },
      { status: 500 }
    );
  }
}
