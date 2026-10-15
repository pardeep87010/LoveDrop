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
    default: "LoveDrop • Handcrafted Interactive Romantic Surprises",
    template: "%s | LoveDrop",
  },
  description:
    "Create unforgettable romantic websites with sealed digital envelopes, runaway playful NO buttons, customizable photo galleries, love quizzes, and secret PIN protection.",
  keywords: [
    "romantic surprises",
    "love letter website",
    "proposal website",
    "valentine surprise",
    "interactive love quiz",
    "digital envelope",
  ],
  authors: [{ name: "LoveDrop Team" }],
  creator: "LoveDrop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lovedrop.online",
    siteName: "LoveDrop",
    title: "LoveDrop • Handcrafted Interactive Romantic Surprises",
    description:
      "Surprise your partner with an interactive digital love experience: secret PIN locks, photo memories, playful runaway buttons, and love letters.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveDrop • Interactive Romantic Surprises",
    description: "Create unforgettable romantic websites in minutes.",
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "LoveDrop",
              url: "https://lovedrop.online",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "All",
              description:
                "Create unforgettable romantic websites with sealed digital envelopes, runaway buttons, quizzes, and secret PIN protection.",
              offers: {
                "@type": "Offer",
                price: "149",
                priceCurrency: "INR",
              },
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
