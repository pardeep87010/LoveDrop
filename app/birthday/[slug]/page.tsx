"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BirthdayData } from "@/lib/types";
import dynamic from "next/dynamic";

const BirthdayTemplate = dynamic(
  () => import("@/components/birthday/BirthdayTemplate"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center space-y-4"
        style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F5 100%)" }}>
        <div className="text-6xl" style={{ animation: "bounce 1s infinite" }}>🎂</div>
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-pink-500 animate-pulse tracking-wide uppercase">
          Unwrapping your birthday surprise... 🎉
        </p>
      </div>
    ),
  }
);

// Default demo birthday data
const DEMO_BIRTHDAY: BirthdayData = {
  id: "bday-demo",
  slug: "demo-birthday",
  templateType: "birthday-party",
  recipientName: "Priya",
  senderName: "Your Best Friend",
  birthdayAge: 21,
  birthdayDate: new Date().toISOString().split("T")[0],
  letterText: `Dear Priya,\n\nOn your very special day, I want you to know just how much you mean to me. Every moment with you is a gift.\n\nHappy Birthday! You deserve all the love and joy in the world. 🎂\n\nWith all my love,\nYour Best Friend 💖`,
  letterTitle: "To my sunshine ☀️",
  photos: [
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&auto=format&fit=crop&q=80",
  ],
  ourStory: "From the day we met to all the crazy adventures we've had — every chapter has been magical. Thank you for being the best part of my story! 🎁",
  loveReasons: [
    "Your infectious laugh that lights up every room",
    "How you always know exactly what to say",
    "Your beautiful soul and kind heart",
    "The way you make ordinary days extraordinary",
    "Your incredible strength and resilience",
    "How you always show up for the people you love",
  ],
  wishes: [
    "May all your dreams come true this year 🌟",
    "Endless happiness and laughter 😄",
    "Adventures that take your breath away 🌍",
    "Love that grows stronger every day 💖",
    "Success in everything you pursue ✨",
  ],
  ourPlaces: [
    { name: "Where we first met", emoji: "☕" },
    { name: "Our favourite hangout", emoji: "🌅" },
    { name: "That epic road trip", emoji: "🚗" },
  ],
  ourDate: new Date().toISOString().split("T")[0],
  ourSong: "Happy Birthday to You 🎵",
  bgMusic: "romantic-lofi",
  hasPasscode: false,
  isPaid: true,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function BirthdayPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "demo";
  const [data, setData] = useState<BirthdayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const storageKey = `birthday_v1_${slug}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        setIsLoading(false);
        return;
      }
    } catch { /* ignore */ }

    // Demo fallback
    if (slug === "demo" || slug === "demo-birthday") {
      setData(DEMO_BIRTHDAY);
      setIsLoading(false);
      return;
    }

    // Try API
    fetch(`/api/birthday/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setData({ ...DEMO_BIRTHDAY, slug, recipientName: slug.split("-")[0] || "You" });
        }
      })
      .catch(() => {
        setData({ ...DEMO_BIRTHDAY, slug });
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading || !data) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center space-y-4"
        style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F5 100%)" }}>
        <div className="text-6xl animate-bounce">🎂</div>
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-pink-500 animate-pulse tracking-wide uppercase">
          Unwrapping your birthday surprise... 🎉
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] w-full">
      <BirthdayTemplate data={data} />
    </main>
  );
}
