"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Gift,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Cake,
  Music,
  Camera,
  Layers,
  Star,
  Compass,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";

interface ThemeOption {
  id: "love-surprise" | "birthday-party";
  title: "Love Surprise" | "Birthday Party";
  tagline: string;
  badge: string;
  badgeGradient: string;
  accent: string;
  accentLight: string;
  glowColor: string;
  route: string;
  emoji: string;
  previewDecorations: string[];
  audience: string;
  highlights: string[];
  scenesCount: string;
  primaryButtonText: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "love-surprise",
    title: "Love Surprise",
    tagline: "The viral, deeply personal romantic experience with playful runaway buttons and love notes.",
    badge: "🔥 Most Popular • Romantic",
    badgeGradient: "linear-gradient(135deg, #FF2E63 0%, #FF6B9D 100%)",
    accent: "#FF2E63",
    accentLight: "#FFF0F4",
    glowColor: "rgba(255, 46, 99, 0.25)",
    route: "/create/love?theme=classic-romance",
    emoji: "💌",
    previewDecorations: ["💖", "🌹", "💑", "✨", "💌"],
    audience: "Partner, Girlfriend, Boyfriend, Crush",
    highlights: [
      "Animated Typing Intro & Custom Words",
      "Playful Runaway 'No' Button with 9 Savage Dodges",
      "Digital Wax-Sealed Love Letter with Custom Seal",
      "Retro Polaroid Memories with Flip & Zoom",
      "9 Heartfelt Reasons Why I Love You",
      "Our Love Journey Timeline & Milestones",
      "Interactive Couple's Quiz with Score",
      "Crack-Open Fortune Cookies with Romantic Quotes",
    ],
    scenesCount: "8 Interactive Chapters",
    primaryButtonText: "Create Love Surprise 💌",
  },
  {
    id: "birthday-party",
    title: "Birthday Party",
    tagline: "A magical 10-chapter birthday party with spinning 3D cake, arcade claw machine, and candle blowing.",
    badge: "🎉 New Theme • Celebratory",
    badgeGradient: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
    accent: "#9333EA",
    accentLight: "#FAF5FF",
    glowColor: "rgba(168, 85, 247, 0.25)",
    route: "/create/birthday",
    emoji: "🎂",
    previewDecorations: ["🎈", "🎁", "⭐", "🎊", "🎂"],
    audience: "Best Friend, Partner, Sibling, Family",
    highlights: [
      "Interactive 3D Spinning Birthday Cake",
      "Heart-Stamped Envelope & Birthday Note",
      "Playable Arcade Claw Machine Game",
      "'Our Story' Chapter Book with Spiral Binding",
      "Magical Wishing Jar with Rising Glowing Stars",
      "Retro Photo Booth with Instant Photo Printing",
      "Interactive Places Map with Heart Pins",
      "Special Date Keepsake Calendar",
      "Spinning Vinyl Record Player with Tonearm",
      "Microphone Breath Blow / Hold to Blow Candles",
    ],
    scenesCount: "10 Interactive Chapters",
    primaryButtonText: "Create Birthday Party 🎂",
  },
];

export default function ThemeSelector() {
  const router = useRouter();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("birthday-party");

  const handleSelectAndGo = (theme: ThemeOption) => {
    soundFx.playPop();
    setSelectedTheme(theme.id);
    router.push(theme.route);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between selection:bg-pink-100 font-sans"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #FFF5F9 0%, #FDF0F6 40%, #FAF0FB 100%)",
      }}
    >
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      <header className="w-full border-b border-pink-100/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-rose-600 transition-colors py-2 px-3 rounded-full hover:bg-pink-50/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-base shadow-sm"
              style={{
                background: "linear-gradient(135deg, #FF2E63 0%, #A855F7 100%)",
              }}
            >
              💖
            </div>
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              LoveDrop
            </span>
          </Link>

          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100/60 text-pink-700 hidden sm:block">
            Step 1: Choose Theme
          </div>
        </div>
      </header>

      {/* ── Main Content Container ────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
        {/* Title & Description */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/70 border border-pink-200/50 mb-3 text-pink-600 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Interactive Experiences
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Choose Your Surprise Theme
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            Select a template below to build an unforgettable interactive website.
            Each theme includes its own games, scenes, animations, and background music.
          </p>
        </motion.div>

        {/* ── 2-Column Responsive Grid (1 col on mobile, 2 col on tablet/desktop) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
          {THEME_OPTIONS.map((theme, idx) => {
            const isHovered = hoveredTheme === theme.id;
            const isSelected = selectedTheme === theme.id;

            return (
              <motion.div
                key={theme.id}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                onClick={() => setSelectedTheme(theme.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-3xl bg-white border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected
                    ? "border-pink-500 shadow-2xl"
                    : "border-slate-200/80 hover:border-pink-300 shadow-lg hover:shadow-xl"
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 20px 40px -15px ${theme.glowColor}`
                    : undefined,
                }}
              >
                {/* Top Badge */}
                <div className="p-6 sm:p-7 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-xs"
                      style={{ background: theme.badgeGradient }}
                    >
                      {theme.badge}
                    </span>

                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {theme.scenesCount}
                    </span>
                  </div>

                  {/* Visual Preview Box */}
                  <div
                    className="relative h-44 sm:h-52 rounded-2xl flex items-center justify-center overflow-hidden mb-6 border"
                    style={{
                      background:
                        theme.id === "birthday-party"
                          ? "linear-gradient(135deg, #FFF0F8 0%, #F5E8FF 50%, #EDE9FE 100%)"
                          : "linear-gradient(135deg, #FFF0F4 0%, #FFE4E8 50%, #FED7E2 100%)",
                      borderColor:
                        theme.id === "birthday-party" ? "#E9D5FF" : "#FECDD3",
                    }}
                  >
                    {/* Floating ambient emojis */}
                    {theme.previewDecorations.map((deco, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xl sm:text-2xl select-none pointer-events-none opacity-40"
                        style={{
                          top: `${[15, 65, 20, 70, 45][i]}%`,
                          left: `${[12, 18, 80, 82, 5][i]}%`,
                        }}
                        animate={{
                          y: [-5, 5, -5],
                          rotate: [-8, 8, -8],
                        }}
                        transition={{
                          duration: 3 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.3,
                        }}
                      >
                        {deco}
                      </motion.div>
                    ))}

                    {/* Central Hero Emoji / Illustration */}
                    <motion.div
                      className="relative z-10 text-7xl sm:text-8xl select-none drop-shadow-xl"
                      animate={
                        theme.id === "birthday-party"
                          ? { rotateY: [0, 360], scale: isHovered ? 1.08 : 1 }
                          : { scale: [1, 1.08, 1] }
                      }
                      transition={
                        theme.id === "birthday-party"
                          ? {
                              rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                              scale: { duration: 0.3 },
                            }
                          : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }
                    >
                      {theme.emoji}
                    </motion.div>

                    {/* Pill label on preview */}
                    <div className="absolute bottom-3 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[11px] font-bold text-slate-700 shadow-xs">
                      {theme.id === "birthday-party"
                        ? "Interactive 3D Cake & Games"
                        : "Runaway NO Button & Polaroids"}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1 mb-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{theme.title}</span>
                      <span className="text-xl sm:text-2xl">{theme.emoji}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {theme.tagline}
                    </p>
                  </div>

                  {/* Audience Chip */}
                  <div className="mb-5 inline-block">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      Ideal for:{" "}
                      <strong className="text-slate-900">{theme.audience}</strong>
                    </span>
                  </div>

                  {/* Highlights Checklist (2 columns on tablet/desktop) */}
                  <div className="border-t border-slate-100 pt-4 mb-4">
                    <p className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 mb-2.5">
                      Included Chapters & Games
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {theme.highlights.map((highlight, hIdx) => (
                        <div
                          key={hIdx}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                            style={{
                              background:
                                theme.id === "birthday-party" ? "#A855F7" : "#FF2E63",
                            }}
                          >
                            <Check className="w-2.5 h-2.5" strokeWidth={3} />
                          </div>
                          <span className="font-medium leading-tight">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Action Button */}
                <div className="p-6 sm:p-7 pt-0 mt-auto">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAndGo(theme);
                    }}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    style={{
                      background: theme.badgeGradient,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{theme.primaryButtonText}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon Footer Note */}
        <div className="mt-10 sm:mt-14 text-center">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Looking for something else? More themes (Anniversary, Apology & Long Distance) are coming soon!
          </p>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="w-full py-6 border-t border-pink-100/80 bg-white/50 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} LoveDrop™ • Handcrafted with love
        </p>
      </footer>
    </div>
  );
}
