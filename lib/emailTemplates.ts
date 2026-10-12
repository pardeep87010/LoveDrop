/**
 * Premium, responsive HTML email templates for LoveDrop transactional emails.
 * Styled with inline CSS for universal email client compatibility (Gmail, Apple Mail, Outlook, Yahoo).
 */

interface CreatorEmailProps {
  creatorName?: string;
  senderName: string;
  recipientName: string;
  siteUrl: string;
  passcode?: string;
  whatsappShareUrl?: string;
}

interface PartnerEmailProps {
  senderName: string;
  recipientName: string;
  siteUrl: string;
  customMessage?: string;
  passcode?: string;
}

interface YesCelebrationProps {
  senderName: string;
  recipientName: string;
  siteUrl: string;
  timestamp?: string;
}

/**
 * 1. Template sent to Creator when surprise is created and published.
 */
export function getCreatorConfirmationEmailHtml({
  senderName,
  recipientName,
  siteUrl,
  passcode,
  whatsappShareUrl,
}: CreatorEmailProps): string {
  const shareLink =
    whatsappShareUrl ||
    `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Hey ${recipientName}! ❤️ I made a special romantic surprise just for you. Open it here: ${siteUrl}`
    )}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your LoveDrop Surprise is Live!</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FFF5F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3748; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #FFF5F8; padding: 36px 12px; }
    .main { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #FFE4EC; overflow: hidden; box-shadow: 0 14px 40px rgba(255, 46, 99, 0.08); }
    .header { background: linear-gradient(135deg, #FF2E63 0%, #FF6B8B 100%); padding: 36px 24px; text-align: center; color: #ffffff; }
    .content { padding: 36px 32px; text-align: center; }
    .btn-main { display: inline-block; background: linear-gradient(135deg, #FF2E63 0%, #FF527B 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 15px 36px; border-radius: 50px; box-shadow: 0 6px 20px rgba(255, 46, 99, 0.35); margin: 18px 0; letter-spacing: 0.3px; }
    .btn-whatsapp { display: inline-block; background: #25D366; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px 28px; border-radius: 50px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); margin-top: 10px; }
    .pin-box { background: #FFF0F4; border: 1.5px dashed #FFB6C6; border-radius: 16px; padding: 14px 20px; display: inline-block; margin: 18px auto; text-align: center; }
    .link-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 12px 16px; margin: 20px 0; word-break: break-all; font-family: monospace; font-size: 13px; color: #475569; }
    .footer { background: #FAF5F7; padding: 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #F3E8EC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <div style="font-size: 42px; margin-bottom: 8px;">💌✨</div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Your Love Surprise is Ready!</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">Created with Love for ${recipientName}</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2 style="font-size: 20px; color: #1E293B; margin: 0 0 12px 0;">Woohoo, ${senderName}! 🎉</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #64748B; margin: 0 0 20px 0;">
            Your handcrafted romantic website for <strong>${recipientName}</strong> is published and ready to make them smile, laugh, and blush.
          </p>

          <a href="${siteUrl}" class="btn-main" target="_blank">
            Preview Surprise Link 💖
          </a>

          ${
            passcode
              ? `
          <div>
            <div class="pin-box">
              <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #D6336C; letter-spacing: 1px; display: block;">Secret Passcode Lock</span>
              <span style="font-size: 26px; font-weight: 800; letter-spacing: 5px; color: #FF2E63; font-family: monospace;">${passcode}</span>
            </div>
          </div>
          `
              : ""
          }

          <div style="margin: 24px 0 10px 0;">
            <p style="font-size: 13px; font-weight: 700; color: #475569; margin: 0 0 8px 0;">Share directly with your partner:</p>
            <a href="${shareLink}" class="btn-whatsapp" target="_blank">
              💬 Send on WhatsApp Now
            </a>
          </div>

          <div class="link-box">
            ${siteUrl}
          </div>

          <p style="font-size: 12px; color: #94A3B8; margin-top: 18px;">
            💡 Pro-Tip: Remind them to keep their audio volume turned on for romantic music! 🎵
          </p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: #64748B;">LoveDrop • Handcrafted Romantic Surprises</p>
          <p style="margin: 0;">Delivered with all our love from <a href="https://lovedrop.online" style="color: #FF2E63; text-decoration: none;">lovedrop.online</a></p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 2. Template sent to the Partner / Recipient (Romantic invitation).
 */
export function getPartnerSurpriseEmailHtml({
  senderName,
  recipientName,
  siteUrl,
  customMessage,
  passcode,
}: PartnerEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A Special Surprise for You, ${recipientName}!</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FFF5F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3748; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #FFF5F8; padding: 36px 12px; }
    .main { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #FFE4EC; overflow: hidden; box-shadow: 0 14px 40px rgba(255, 46, 99, 0.08); }
    .header { background: linear-gradient(135deg, #FF2E63 0%, #FF6B8B 100%); padding: 42px 24px; text-align: center; color: #ffffff; }
    .content { padding: 36px 32px; text-align: center; }
    .btn-main { display: inline-block; background: linear-gradient(135deg, #FF2E63 0%, #FF527B 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 16px; padding: 16px 40px; border-radius: 50px; box-shadow: 0 8px 25px rgba(255, 46, 99, 0.35); margin: 20px 0; letter-spacing: 0.3px; }
    .quote-box { background: #FFF8FA; border-left: 4px solid #FF2E63; border-radius: 12px; padding: 16px 20px; margin: 20px 0; text-align: left; font-style: italic; color: #475569; font-size: 14px; line-height: 1.6; }
    .pin-badge { display: inline-block; background: #FFF0F4; border: 1px solid #FFD1DC; color: #D6336C; padding: 8px 18px; border-radius: 50px; font-weight: 800; font-size: 14px; margin-top: 8px; }
    .footer { background: #FAF5F7; padding: 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #F3E8EC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <div style="font-size: 48px; margin-bottom: 10px;">💖✨</div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">A Secret Surprise Has Arrived!</h1>
          <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.95;">Someone very special has sent you something heartfelt...</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2 style="font-size: 22px; color: #1E293B; margin: 0 0 10px 0;">Dear ${recipientName}, 💕</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #64748B; margin: 0 0 16px 0;">
            <strong>${senderName}</strong> made an interactive digital love experience crafted uniquely for you. Sealed with a digital envelope, memories, and playful surprises.
          </p>

          ${
            customMessage
              ? `
          <div class="quote-box">
            "${customMessage}"
            <div style="margin-top: 6px; font-weight: 700; color: #FF2E63; font-style: normal;">— ${senderName}</div>
          </div>
          `
              : ""
          }

          <a href="${siteUrl}" class="btn-main" target="_blank">
            Open Your Envelope 💌
          </a>

          ${
            passcode
              ? `
          <div style="margin: 12px 0 20px 0;">
            <div class="pin-badge">
              🔒 Secret PIN to Unlock: <strong>${passcode}</strong>
            </div>
          </div>
          `
              : ""
          }

          <p style="font-size: 13px; color: #94A3B8; margin-top: 24px; line-height: 1.5;">
            🎧 <strong>Turn your volume up</strong> — there is romantic music playing just for you!
          </p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: #64748B;">LoveDrop • Romantic surprises delivered with love</p>
          <p style="margin: 0;"><a href="https://lovedrop.online" style="color: #FF2E63; text-decoration: none;">lovedrop.online</a></p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 3. Celebration Template sent to Creator when partner clicks "YES"
 */
export function getYesCelebrationEmailHtml({
  senderName,
  recipientName,
  siteUrl,
  timestamp,
}: YesCelebrationProps): string {
  const timeString = timestamp || new Date().toLocaleString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${recipientName} Said YES! 🎉💖</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FFF5F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3748; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #FFF5F8; padding: 36px 12px; }
    .main { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #FFE4EC; overflow: hidden; box-shadow: 0 14px 40px rgba(255, 46, 99, 0.12); }
    .header { background: linear-gradient(135deg, #FF2E63 0%, #FF007A 100%); padding: 46px 24px; text-align: center; color: #ffffff; }
    .content { padding: 36px 32px; text-align: center; }
    .btn-main { display: inline-block; background: linear-gradient(135deg, #FF2E63 0%, #FF527B 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 15px 36px; border-radius: 50px; box-shadow: 0 6px 20px rgba(255, 46, 99, 0.35); margin: 20px 0; }
    .celebration-box { background: #FFF0F4; border: 2px dashed #FF6B8B; border-radius: 20px; padding: 20px; margin: 20px 0; }
    .footer { background: #FAF5F7; padding: 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #F3E8EC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <div style="font-size: 56px; margin-bottom: 8px;">💍🎉✨</div>
          <h1 style="margin: 0; font-size: 30px; font-weight: 900; letter-spacing: -0.5px;">SHE / HE SAID YES!</h1>
          <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.95;">A celebration to remember forever 💕</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2 style="font-size: 22px; color: #1E293B; margin: 0 0 12px 0;">Congratulations, ${senderName}! 🥂</h2>
          
          <div class="celebration-box">
            <p style="font-size: 16px; font-weight: 800; color: #FF2E63; margin: 0 0 6px 0;">
              "${recipientName} clicked YES to your proposal!"
            </p>
            <span style="font-size: 12px; color: #94A3B8; font-weight: 600;">Recorded at: ${timeString}</span>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #64748B; margin: 0 0 18px 0;">
            They conquered the runaway NO button and chose you! Go celebrate this unforgettable moment together.
          </p>

          <a href="${siteUrl}" class="btn-main" target="_blank">
            View Live Surprise Page 💌
          </a>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: #64748B;">LoveDrop • Celebrating love stories everywhere</p>
          <p style="margin: 0;"><a href="https://lovedrop.online" style="color: #FF2E63; text-decoration: none;">lovedrop.online</a></p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}
