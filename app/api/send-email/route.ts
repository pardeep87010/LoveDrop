import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getCreatorConfirmationEmailHtml,
  getPartnerSurpriseEmailHtml,
} from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      creatorEmail,
      recipientEmail,
      recipientName = "My Love",
      senderName = "Someone Special",
      siteUrl,
      passcode,
      customMessage,
    } = body;

    if (!creatorEmail && !recipientEmail) {
      return NextResponse.json(
        { success: false, error: "Please provide an email address." },
        { status: 400 }
      );
    }

    if (!siteUrl) {
      return NextResponse.json(
        { success: false, error: "Missing website URL." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log(
        "[RESEND SIMULATION]: RESEND_API_KEY is not defined. Email simulated."
      );
      return NextResponse.json({
        success: true,
        simulated: true,
        message:
          "Email delivery simulated. Add RESEND_API_KEY to your environment variables for live delivery.",
      });
    }

    const resend = new Resend(apiKey);
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "LoveDrop <support@lovedrop.online>";

    // 1. If creator email is provided, send confirmation & link to creator
    if (creatorEmail) {
      const creatorHtml = getCreatorConfirmationEmailHtml({
        senderName,
        recipientName,
        siteUrl,
        passcode,
      });

      const creatorRes = await resend.emails.send({
        from: fromEmail,
        to: [creatorEmail],
        subject: `💖 Your Love Surprise for ${recipientName} is Ready!`,
        html: creatorHtml,
      });

      if (creatorRes.error) {
        console.error("[Resend Creator Email Error]:", creatorRes.error);
        return NextResponse.json(
          { success: false, error: creatorRes.error.message },
          { status: 500 }
        );
      }
    }

    // 2. If partner/recipient email is provided, send surprise invitation to partner
    if (recipientEmail) {
      const recipientHtml = getPartnerSurpriseEmailHtml({
        senderName,
        recipientName,
        siteUrl,
        customMessage,
        passcode,
      });

      const recipientRes = await resend.emails.send({
        from: fromEmail,
        to: [recipientEmail],
        subject: `💌 ${senderName} made a special romantic surprise for you!`,
        html: recipientHtml,
      });

      if (recipientRes.error) {
        console.error("[Resend Recipient Email Error]:", recipientRes.error);
        return NextResponse.json(
          { success: false, error: recipientRes.error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully via Resend!",
    });
  } catch (err: any) {
    console.error("[Resend Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to send email via Resend" },
      { status: 500 }
    );
  }
}
