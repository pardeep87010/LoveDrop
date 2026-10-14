import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Surprise } from "@/models/Surprise";
import { cleanUserInput, hashPasscode, isValidEmail } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { Resend } from "resend";
import {
  getCreatorConfirmationEmailHtml,
  getPartnerSurpriseEmailHtml,
} from "@/lib/emailTemplates";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting (max 15 creation requests per min per IP)
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`create:${ip}`, 15, 60 * 1000);
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Please wait ${rateLimit.resetInSeconds}s before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Validate essential fields
    const recipientName = cleanUserInput(body.recipientName || "", 100);
    const senderName = cleanUserInput(body.senderName || "", 100);
    const question = cleanUserInput(body.question || "Will you be my Valentine?", 300);

    if (!recipientName || !senderName) {
      return NextResponse.json(
        { success: false, error: "Recipient Name and Sender Name are required." },
        { status: 400 }
      );
    }

    // 3. Generate or sanitize unique slug
    let rawSlug = (body.slug || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!rawSlug) {
      rawSlug = `${recipientName.toLowerCase().replace(/[^a-z0-9]/g, "")}-${senderName.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 4. Secure PIN handling
    let passcodeHash: string | undefined = undefined;
    const hasPasscode = Boolean(body.hasPasscode && body.passcode);
    if (hasPasscode && body.passcode) {
      passcodeHash = await hashPasscode(String(body.passcode));
    }

    // 5. Connect to MongoDB and save
    let isDbConnected = false;
    let savedSurprise: any = null;

    try {
      await connectToDatabase();
      isDbConnected = true;

      // Ensure slug uniqueness in MongoDB
      let finalSlug = rawSlug;
      let counter = 1;
      while (await Surprise.findOne({ slug: finalSlug }).lean()) {
        finalSlug = `${rawSlug}-${counter}`;
        counter++;
      }

      const newSurprise = new Surprise({
        id: body.id || `love-${Date.now()}`,
        slug: finalSlug,
        occasion: body.occasion || "proposal",
        relation: body.relation || "Partner",
        recipientName,
        senderName,
        question,
        subheading: cleanUserInput(body.subheading || "", 300),
        reasons: Array.isArray(body.reasons) ? body.reasons.map((r: any) => cleanUserInput(r, 500)) : [],
        letterContent: cleanUserInput(body.letterContent || "", 10000),
        letterText: cleanUserInput(body.letterText || "", 10000),
        photos: Array.isArray(body.photos) ? body.photos.slice(0, 10) : [],
        theme: body.theme || "classic",
        anniversaryDate: body.anniversaryDate,
        selectedFeatures: Array.isArray(body.selectedFeatures) ? body.selectedFeatures : [],
        timeline: Array.isArray(body.timeline) ? body.timeline.slice(0, 6) : [],
        promises: Array.isArray(body.promises) ? body.promises : [],
        loveReasons: Array.isArray(body.loveReasons) ? body.loveReasons.slice(0, 9) : [],
        quizQuestions: Array.isArray(body.quizQuestions) ? body.quizQuestions.slice(0, 5) : [],
        compliments: Array.isArray(body.compliments) ? body.compliments : [],
        fortuneCookies: Array.isArray(body.fortuneCookies) ? body.fortuneCookies.slice(0, 5) : [],
        scratchCards: Array.isArray(body.scratchCards) ? body.scratchCards : [],
        wheelItems: Array.isArray(body.wheelItems) ? body.wheelItems : [],
        bucketList: Array.isArray(body.bucketList) ? body.bucketList : [],
        enabledPages: body.enabledPages || {},
        typingIntroWords: Array.isArray(body.typingIntroWords) ? body.typingIntroWords : [],
        buttonText: cleanUserInput(body.buttonText || "", 100),
        yesButtonText: cleanUserInput(body.yesButtonText || "", 100),
        dodgePhrases: Array.isArray(body.dodgePhrases) ? body.dodgePhrases : [],
        letterTitle: cleanUserInput(body.letterTitle || "", 200),
        waxSealEmoji: body.waxSealEmoji || "💌",
        photoMemories: Array.isArray(body.photoMemories) ? body.photoMemories.slice(0, 10) : [],
        nineReasons: Array.isArray(body.nineReasons) ? body.nineReasons.slice(0, 9) : [],
        storyMilestones: Array.isArray(body.storyMilestones) ? body.storyMilestones.slice(0, 6) : [],
        quizList: Array.isArray(body.quizList) ? body.quizList.slice(0, 5) : [],
        fortuneQuotes: Array.isArray(body.fortuneQuotes) ? body.fortuneQuotes.slice(0, 5) : [],
        pricingPlan: body.pricingPlan || "lifetime",
        passcodeHash,
        hasPasscode,
        dodgeIntensity: body.dodgeIntensity || "savage",
        bgMusic: body.bgMusic || "summer-guitar",
        whatsappNumber: body.whatsappNumber,
        whatsappMessage: cleanUserInput(body.whatsappMessage || "", 500),
        creatorEmail: isValidEmail(body.creatorEmail) ? body.creatorEmail.trim() : undefined,
        recipientEmail: isValidEmail(body.recipientEmail) ? body.recipientEmail.trim() : undefined,
        isPaid: true,
        viewsCount: 0,
        yesClicked: false,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });

      savedSurprise = await newSurprise.save();
    } catch (dbErr: any) {
      console.warn("[MongoDB Save Warning]:", dbErr.message);
      // If MongoDB URI is not set up yet in .env.local, we notify the caller while still allowing a successful slug
    }

    const finalSlug = savedSurprise?.slug || rawSlug;
    const origin = req.headers.get("origin") || "https://lovedrop.online";
    const siteUrl = `${origin}/p/${finalSlug}`;

    // 6. Send transactional emails via Resend if credentials are present
    const creatorEmail = isValidEmail(body.creatorEmail) ? body.creatorEmail.trim() : undefined;
    const recipientEmail = isValidEmail(body.recipientEmail) ? body.recipientEmail.trim() : undefined;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && (creatorEmail || recipientEmail)) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "LoveDrop <support@lovedrop.online>";

        if (creatorEmail) {
          await resend.emails.send({
            from: fromEmail,
            to: [creatorEmail],
            subject: `💖 Your Love Surprise for ${recipientName} is Ready!`,
            html: getCreatorConfirmationEmailHtml({
              senderName,
              recipientName,
              siteUrl,
              passcode: hasPasscode && body.passcode ? String(body.passcode) : undefined,
            }),
          });
        }

        if (recipientEmail) {
          await resend.emails.send({
            from: fromEmail,
            to: [recipientEmail],
            subject: `💌 ${senderName} made a special romantic surprise for you!`,
            html: getPartnerSurpriseEmailHtml({
              senderName,
              recipientName,
              siteUrl,
              customMessage: body.customMessage,
              passcode: hasPasscode && body.passcode ? String(body.passcode) : undefined,
            }),
          });
        }
      } catch (emailErr) {
        console.error("[Email Delivery Warning]:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      url: siteUrl,
      dbSaved: isDbConnected,
    });
  } catch (err: any) {
    console.error("[Create Surprise API Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create surprise." },
      { status: 500 }
    );
  }
}
