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

    // Atomically increment viewsCount and fetch document
    const surprise = await Surprise.findOneAndUpdate(
      { slug },
      { $inc: { viewsCount: 1 } },
      {
        new: true,
        // Exclude sensitive fields from public response
        projection: {
          passcodeHash: 0,
          creatorEmail: 0,
          recipientEmail: 0,
          __v: 0,
        },
      }
    ).lean();

    if (!surprise) {
      return NextResponse.json(
        { success: false, notFound: true, error: "Surprise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: surprise,
    });
  } catch (err: any) {
    console.error("[Get Surprise Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to retrieve surprise" },
      { status: 500 }
    );
  }
}
