"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Search,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";

export type ThemeCategory = "all" | "birthday" | "romance" | "proposal" | "distance" | "apology";

export interface ThemeItem {
  id: string;
  category: "birthday" | "romance" | "proposal" | "distance" | "apology";
  title: string;
  tagline: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  accent: string;
  accentLight: string;
  route: string;
  emoji: string;
  previewArt?: string; // Optional image / svg path
  chaptersCount: string;
  buttonText: string;
  featured?: boolean;
}

const ALL_THEMES: ThemeItem[] = [
  {
    id: "birthday-party",
    category: "birthday",
    title: "Birthday Party",
    tagline: "The viral birthday surprise with interactive 3D cake, wishing star jar and candle blowing.",
    badge: "🎉 Popular",
    badgeBg: "rgba(255, 46, 99, 0.12)",
    badgeColor: "#FF2E63",
    accent: "#FF2E63",
    accentLight: "#FFF0F4",
    route: "/create/birthday",
    emoji: "🎂",
    chaptersCount: "10 Chapters",
    buttonText: "Create Birthday Surprise 🎂",
    featured: true,
  },

  {
    id: "classic-romance",
    category: "romance",
    title: "Classic Romance",
    tagline: "The viral love surprise with runaway NO button, wax-sealed letter & polaroids.",
    badge: "Most Popular",
    badgeBg: "rgba(255, 46, 99, 0.12)",
    badgeColor: "#FF2E63",
    accent: "#FF2E63",
    accentLight: "#FFF0F4",
    route: "/create/love?theme=classic-romance&occasion=proposal",
    emoji: "💌",
    chaptersCount: "8 Chapters",
    buttonText: "Create Classic Romance 💌",
    featured: true,
  },
  {
    id: "first-love",
    category: "romance",
    title: "First Love",
    tagline: "Fresh mint pastels with butterflies, sweet notes & washi-taped memories.",
    badge: "Fresh & Sweet",
    badgeBg: "rgba(0, 184, 148, 0.12)",
    badgeColor: "#00B894",
    accent: "#00B894",
    accentLight: "#E8F8F5",
    route: "/create/love?theme=first-love&occasion=love-note",
    emoji: "🌿",
    chaptersCount: "8 Chapters",
    buttonText: "Create First Love 🌿",
  },
  {
    id: "minimalist-love",
    category: "romance",
    title: "Minimalist Love",
    tagline: "Editorial typography, monochrome photo gallery & soothing lofi audio.",
    badge: "Modern Aesthetic",
    badgeBg: "rgba(108, 92, 231, 0.12)",
    badgeColor: "#6C5CE7",
    accent: "#6C5CE7",
    accentLight: "#F0F3FF",
    route: "/create/love?theme=minimalist-love&occasion=love-note",
    emoji: "💜",
    chaptersCount: "8 Chapters",
    buttonText: "Create Minimalist 💜",
  },
  {
    id: "eternal-vows",
    category: "proposal",
    title: "Eternal Vows",
    tagline: "Crimson & gold design crafted for proposals, wedding vows & anniversaries.",
    badge: "Grand Proposal",
    badgeBg: "rgba(214, 48, 49, 0.12)",
    badgeColor: "#D63031",
    accent: "#D63031",
    accentLight: "#FDE2E6",
    route: "/create/love?theme=eternal-vows&occasion=proposal",
    emoji: "💍",
    chaptersCount: "8 Chapters",
    buttonText: "Create Proposal 💍",
  },
  {
    id: "garden-of-love",
    category: "romance",
    title: "Garden of Love",
    tagline: "Floating rose petals, warm botanical sunlight & sweet memory milestones.",
    badge: "Botanical Bloom",
    badgeBg: "rgba(0, 168, 107, 0.12)",
    badgeColor: "#00A86B",
    accent: "#00A86B",
    accentLight: "#F0FFF4",
    route: "/create/love?theme=garden-of-love&occasion=love-note",
    emoji: "🌸",
    chaptersCount: "8 Chapters",
    buttonText: "Create Garden Love 🌸",
  },
  {
    id: "long-distance-love",
    category: "distance",
    title: "Long Distance",
    tagline: "Interactive two-cities map pins, countdown to next hug & reassurance letters.",
    badge: "Miles Apart",
    badgeBg: "rgba(9, 132, 227, 0.12)",
    badgeColor: "#0984E3",
    accent: "#0984E3",
    accentLight: "#F0F7FF",
    route: "/create/love?theme=long-distance-love&occasion=custom",
    emoji: "✈️",
    chaptersCount: "8 Chapters",
    buttonText: "Create Long Distance ✈️",
  },
  {
    id: "apology-peace",
    category: "apology",
    title: "Heartfelt Apology",
    tagline: "Gentle healing colors to say sorry sincerely, make up, and start fresh.",
    badge: "Healing & Peace",
    badgeBg: "rgba(225, 112, 85, 0.12)",
    badgeColor: "#E17055",
    accent: "#E17055",
    accentLight: "#FFF5F0",
    route: "/create/love?theme=classic-romance&occasion=apology",
    emoji: "🕊️",
    chaptersCount: "8 Chapters",
    buttonText: "Create Apology 🕊️",
  },
];

const CATEGORY_TABS: { id: ThemeCategory; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "✨" },
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "romance", label: "Romance", icon: "💖" },
  { id: "proposal", label: "Proposal", icon: "💍" },
  { id: "distance", label: "Distance", icon: "✈️" },
  { id: "apology", label: "Apology", icon: "🕊️" },
];

export default function ThemeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const occasionParam = searchParams.get("occasion");
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>(() => occasionParam === "birthday" ? "birthday" : "all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThemes = useMemo(() => {
    return ALL_THEMES.filter((theme) => {
      const matchesCategory =
        activeCategory === "all" || theme.category === activeCategory;
      const matchesSearch =
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSelectTheme = (theme: ThemeItem) => {
    soundFx.playPop();
    router.push(theme.route);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between selection:bg-pink-100 font-sans"
      style={{
        background: "linear-gradient(180deg, #FFF8F4 0%, #FDF1F5 50%, #FAF0F8 100%)",
      }}
    >
      {/* ── Top Header ─────────────────────────────────────────── */}
      <header className="w-full border-b border-pink-100/70 bg-white/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-rose-600 transition-colors py-2 px-3 rounded-full hover:bg-pink-50/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D1264F] flex items-center justify-center text-white text-sm shadow-sm">
              ✨
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              LoveDrop<span className="text-[#D1264F]">.online</span>
            </span>
          </Link>

          <div className="w-16" />
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 text-[#D1264F] text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Theme</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Choose an Experience
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            Pick a template to begin customizing your surprise website.
          </p>
        </div>

        {/* ── Filter Tabs & Search Bar ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-white/80 p-1.5 rounded-full border border-pink-200/60 shadow-xs flex-wrap justify-center">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playPop();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? "bg-[#D1264F] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-pink-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search theme..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-pink-200/70 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#D1264F] shadow-2xs"
            />
          </div>
        </div>

        {/* ── Clean Visual Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredThemes.map((theme, idx) => (
            <motion.div
              key={theme.id}
              onClick={() => handleSelectTheme(theme)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/70 hover:border-pink-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 select-none"
            >
              <div>
                {/* Visual Art Header */}
                <div
                  className="relative h-44 rounded-2xl flex items-center justify-center overflow-hidden mb-4 border transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{
                    background: theme.accentLight,
                    borderColor: `${theme.accent}20`,
                  }}
                >
                  {/* Top Badge on Art */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide"
                      style={{
                        backgroundColor: theme.badgeBg,
                        color: theme.badgeColor,
                      }}
                    >
                      {theme.badge}
                    </span>
                  </div>

                  {/* Chapters Count Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-700 shadow-2xs">
                      {theme.chaptersCount}
                    </span>
                  </div>

                  {/* Artwork Image or Center Emoji */}
                  {theme.previewArt ? (
                    <img
                      src={theme.previewArt}
                      alt={theme.title}
                      className="w-32 h-32 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {theme.emoji}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 mb-1.5">
                  <span>{theme.title}</span>
                  <span>{theme.emoji}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-4">
                  {theme.tagline}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-sm flex items-center justify-center gap-1.5 transition-all"
                style={{ backgroundColor: theme.accent }}
              >
                <span>Select Theme</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="w-full border-t border-pink-100/60 bg-white/70 py-6 text-center text-xs text-slate-400">
        <p>Lovedrop • Handcrafted interactive surprise experiences</p>
      </footer>
    </div>
  );
}
