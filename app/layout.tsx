import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FF2E63",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://lovedrop.online"),
  title: {
    default: "LoveDrop™ Official Site • Handcrafted Interactive Romantic Surprises",
    template: "%s | LoveDrop™ Official",
  },
  description:
    "LoveDrop transforms your feelings into a personal interactive website with animated wax-seal love letters, runaway NO buttons, customizable photo memories, and instant WhatsApp alerts.",
  keywords: [
    "lovedrop",
    "love drop",
    "lovedrop online",
    "lovedrop.online",
    "love drop website",
    "romantic surprises",
    "love letter website",
    "proposal website",
    "runaway no button proposal",
    "valentine surprise",
    "interactive love quiz",
    "digital envelope",
  ],
  authors: [{ name: "LoveDrop Team" }],
  creator: "LoveDrop",
  alternates: {
    canonical: "https://lovedrop.online",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lovedrop.online",
    siteName: "LoveDrop",
    title: "LoveDrop™ Official Site • Handcrafted Interactive Romantic Surprises",
    description:
      "Surprise your partner with an interactive digital love experience: secret PIN locks, photo memories, playful runaway buttons, and love letters.",
    images: [
      {
        url: "https://lovedrop.online/logo.png",
        width: 1024,
        height: 1024,
        alt: "LoveDrop Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveDrop™ Official Site • Interactive Romantic Surprises",
    description: "Create unforgettable romantic websites in minutes.",
    images: ["https://lovedrop.online/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon link tags for Google Search & all browsers (Google requires multiples of 48px square) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Structured Data: WebSite, Organization, WebApp & FAQPage for Google Rich Snippets & Brand #1 Authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://lovedrop.online/#website",
                  "url": "https://lovedrop.online",
                  "name": "LoveDrop",
                  "alternateName": ["Love Drop", "LoveDrop Online", "lovedrop.online"],
                  "description": "LoveDrop — The Official Interactive Romantic Surprise & Love Letter Builder",
                  "inLanguage": "en-US",
                  "publisher": {
                    "@id": "https://lovedrop.online/#organization",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://lovedrop.online/#organization",
                  "name": "LoveDrop",
                  "url": "https://lovedrop.online",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://lovedrop.online/logo.png",
                    "width": 1024,
                    "height": 1024,
                  },
                  "image": "https://lovedrop.online/logo.png",
                  "description": "LoveDrop is the official interactive romantic surprise platform for couples to create digital wax-sealed love letters, runaway NO buttons, and photo memories.",
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://lovedrop.online/#webapp",
                  "name": "LoveDrop Interactive Surprise Maker",
                  "applicationCategory": "LifestyleApplication",
                  "operatingSystem": "All",
                  "url": "https://lovedrop.online",
                  "description": "Create unforgettable romantic websites with sealed digital envelopes, runaway buttons, quizzes, and secret PIN protection.",
                  "offers": {
                    "@type": "Offer",
                    "price": "149",
                    "priceCurrency": "INR",
                  },
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://lovedrop.online/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is LoveDrop?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "LoveDrop (lovedrop.online) is the official interactive digital romantic surprise platform where you can create personalized websites with wax-sealed letters, runaway NO buttons, quizzes, and real-time WhatsApp alerts.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "Kya mujhe coding aani chahiye?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Bilkul nahi! Aapko sirf apna aur unka naam enter karna hai. Saare emotional sparks, funny dialogues, polaroid templates aur animations 100% pre-written ready hote hain.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "WhatsApp alert kaise kaam karta hai?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Jab aapki partner website kholegi aur 'YES' dabayegi ya surprise pura karegi, usi second aapke WhatsApp number par real-time alert aayega: 'Unhone YES bol diya! 🎉'.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "Website link kab tak active rahega?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Aapka custom link poore 1 saal (365 days) tak active rehta hai unlimited views ke sath.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "Payment kaise hoti hai?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Instant 1-click UPI payments (Google Pay, PhonePe, Paytm, CRED) support karta hai. Payment hote hi 1 second me link screen par mil jata hai.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
        {/* Google Analytics GA4 (Placed directly in <head> for Google Search Console verification) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E6SFRKFCJL"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E6SFRKFCJL');
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] selection:bg-rose-100 selection:text-rose-800">
        {children}
      </body>
    </html>
  );
}
