import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoveLink • Emotional Interactive Surprises",
  description: "Create unforgettable romantic websites with sealed digital envelopes, runaway buttons, and real-time WhatsApp alerts in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FDFBF7] selection:bg-rose-100 selection:text-rose-800">
        {children}
      </body>
    </html>
  );
}
