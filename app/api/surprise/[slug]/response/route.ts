import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Surprise } from "@/models/Surprise";
import { Resend } from "resend";
import { getYesCelebrationEmailHtml } from "@/lib/emailTemplates";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug?.toLowerCase().trim();

    await connectToDatabase();

    const surprise = await Surprise.findOneAndUpdate(
      { slug },
      {
        yesClicked: true,
        yesClickedAt: new Date(),
      },
      { new: true }
    );

    if (!surprise) {
      return NextResponse.json(
        { success: false, error: "Surprise not found" },
        { status: 404 }
      );
    }

    // If creator configured an email, send them a happy celebration notification!
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && surprise.creatorEmail) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "LoveDrop <support@lovedrop.online>";
        const origin = req.headers.get("origin") || "https://lovedrop.online";
        const siteUrl = `${origin}/p/${surprise.slug}`;

        await resend.emails.send({
          from: fromEmail,
          to: [surprise.creatorEmail],
          subject: `💍🎉 ${surprise.recipientName} Clicked YES! 💖`,
          html: getYesCelebrationEmailHtml({
            senderName: surprise.senderName,
            recipientName: surprise.recipientName,
            siteUrl,
            timestamp: new Date().toLocaleString(),
          }),
        });
      } catch (emailErr) {
        console.error("[Yes Notification Email Warning]:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Response recorded! 🎉",
    });
  } catch (err: any) {
    console.error("[Surprise Response Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to record response." },
      { status: 500 }
    );
  }
}
