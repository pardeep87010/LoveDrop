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
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icon.png", sizes: "512x512" },
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
        {/* Google Analytics GA4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-E6SFRKFCJL"}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-E6SFRKFCJL"}', {
                page_path: window.location.pathname,
              });
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
