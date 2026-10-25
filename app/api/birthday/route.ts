import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Birthday } from "@/models/Birthday";
import { Surprise } from "@/models/Surprise";
import { cleanUserInput, hashPasscode, isValidEmail } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`create-birthday:${ip}`, 20, 60 * 1000);
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
      rawSlug = `${recipientName.toLowerCase().replace(/[^a-z0-9]/g, "")}-bday-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 4. Secure PIN handling
    let passcodeHash: string | undefined = undefined;
    const hasPasscode = Boolean(body.hasPasscode && body.passcode);
    if (hasPasscode && body.passcode) {
      passcodeHash = await hashPasscode(String(body.passcode));
    }

    // 5. Connect to MongoDB and save
    let isDbConnected = false;
    let savedBirthday: any = null;

    try {
      await connectToDatabase();
      isDbConnected = true;

      // Ensure slug uniqueness across Birthday & Surprise collections
      let finalSlug = rawSlug;
      let counter = 1;
      while (
        (await Birthday.findOne({ slug: finalSlug }).lean()) ||
        (await Surprise.findOne({ slug: finalSlug }).lean())
      ) {
        finalSlug = `${rawSlug}-${counter}`;
        counter++;
      }

      const newBirthday = new Birthday({
        id: body.id || `bday-${Date.now()}`,
        slug: finalSlug,
        templateType: "birthday-party",
        recipientName,
        senderName,
        birthdayAge: body.birthdayAge ? Number(body.birthdayAge) : undefined,
        birthdayDate: body.birthdayDate || undefined,
        letterText: cleanUserInput(body.letterText || "", 10000),
        letterTitle: cleanUserInput(body.letterTitle || "", 200),
        buttonText: cleanUserInput(body.buttonText || "Open my gift", 100),
        photos: Array.isArray(body.photos) ? body.photos.slice(0, 10) : [],
        ourStory: cleanUserInput(body.ourStory || "", 5000),
        loveReasons: Array.isArray(body.loveReasons)
          ? body.loveReasons.map((r: any) => cleanUserInput(r, 500)).slice(0, 9)
          : [],
        wishes: Array.isArray(body.wishes)
          ? body.wishes.map((w: any) => cleanUserInput(w, 500)).slice(0, 9)
          : [],
        ourPlaces: Array.isArray(body.ourPlaces)
          ? body.ourPlaces
              .map((p: any) => ({
                name: cleanUserInput(p?.name || "", 100),
                emoji: cleanUserInput(p?.emoji || "📍", 10),
              }))
              .slice(0, 6)
          : [],
        ourDate: body.ourDate || undefined,
        ourSong: cleanUserInput(body.ourSong || "Happy Birthday Melodies", 200),
        bgMusic: body.bgMusic || "romantic-lofi",
        whatsappNumber: body.whatsappNumber ? cleanUserInput(body.whatsappNumber, 30) : undefined,
        whatsappMessage: body.whatsappMessage ? cleanUserInput(body.whatsappMessage, 500) : undefined,
        hasPasscode,
        passcodeHash,
        creatorEmail: isValidEmail(body.creatorEmail) ? body.creatorEmail.trim() : undefined,
        recipientEmail: isValidEmail(body.recipientEmail) ? body.recipientEmail.trim() : undefined,
        isPaid: true,
        viewsCount: 0,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });

      savedBirthday = await newBirthday.save();
    } catch (dbErr: any) {
      console.warn("[MongoDB Birthday Save Warning]:", dbErr.message);
    }

    const finalSlug = savedBirthday?.slug || rawSlug;
    const origin = req.headers.get("origin") || "https://lovedrop.online";
    const siteUrl = `${origin}/birthday/${finalSlug}`;

    // 6. Send transactional emails via Resend if credentials are present
    const creatorEmail = isValidEmail(body.creatorEmail) ? body.creatorEmail.trim() : undefined;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && creatorEmail) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "LoveDrop <support@lovedrop.online>";

        await resend.emails.send({
          from: fromEmail,
          to: [creatorEmail],
          subject: `🎂 Your Birthday Surprise for ${recipientName} is Ready!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFF8F1; border-radius: 16px;">
              <h1 style="color: #D1264F; font-size: 24px; margin-bottom: 8px;">Your Birthday Surprise is Live! 🎉</h1>
              <p style="color: #3A2340; font-size: 15px; line-height: 1.5;">
                Hey ${senderName}, you've created a magical birthday website for <strong>${recipientName}</strong>.
              </p>
              <div style="background: white; border: 1px solid rgba(209,38,79,0.2); border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #6E5869;">Share this private link:</p>
                <a href="${siteUrl}" style="display: inline-block; background: #D1264F; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">Open Birthday Website 🎂</a>
                <p style="margin: 12px 0 0 0; font-size: 12px; color: #888;">${siteUrl}</p>
              </div>
              ${
                hasPasscode && body.passcode
                  ? `<p style="color: #6E5869; font-size: 13px;">🔒 <strong>Secret PIN:</strong> ${body.passcode}</p>`
                  : ""
              }
              <p style="color: #888; font-size: 12px; margin-top: 24px; text-align: center;">
                Made with love on LoveDrop.online
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("[Birthday Email Delivery Warning]:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      url: siteUrl,
      dbSaved: isDbConnected,
      data: savedBirthday?.toObject ? savedBirthday.toObject() : body,
    });
  } catch (err: any) {
    console.error("[Create Birthday API Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create birthday surprise." },
      { status: 500 }
    );
  }
}
