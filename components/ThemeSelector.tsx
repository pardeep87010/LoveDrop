"use client";

import React, { useState, useMemo } from "react";
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
  Plane,
  HeartHandshake,
  Search,
  Filter,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";

export type ThemeCategory = "all" | "birthday" | "romance" | "proposal" | "distance" | "apology";

export interface ThemeItem {
  id: string;
  category: "birthday" | "romance" | "proposal" | "distance" | "apology";
  title: string;
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
  chaptersCount: string;
  highlights: string[];
  buttonText: string;
  featured?: boolean;
}

const ALL_THEMES: ThemeItem[] = [
  {
    id: "birthday-party",
    category: "birthday",
    title: "Birthday Party",
    tagline: "A 10-chapter birthday carnival with interactive 3D cake, claw machine, wishing jar, and candle blowing.",
    badge: "🎉 New & Trending",
    badgeGradient: "linear-gradient(135deg, #EC4899 0%, #A855F7 100%)",
    accent: "#9333EA",
    accentLight: "#FAF5FF",
    glowColor: "rgba(168, 85, 247, 0.3)",
    route: "/create/birthday",
    emoji: "🎂",
    previewDecorations: ["🎈", "🎁", "⭐", "🎊", "🎂"],
    audience: "Best Friend, Partner, Family",
    chaptersCount: "10 Interactive Chapters",
    highlights: [
      "Interactive 3D Spinning Cake",
      "Playable Arcade Claw Machine",
      "Wishes Jar with Glowing Stars",
      "Instant Retro Photo Booth",
      "Microphone Candle Blow Finale",
    ],
    buttonText: "Create Birthday Party 🎂",
    featured: true,
  },
  {
    id: "classic-romance",
    category: "romance",
    title: "Classic Romance",
    tagline: "The viral, deeply personal romantic experience with playful runaway buttons and wax-sealed love notes.",
    badge: "🔥 Most Popular",
    badgeGradient: "linear-gradient(135deg, #FF2E63 0%, #FF6B9D 100%)",
    accent: "#FF2E63",
    accentLight: "#FFF0F4",
    glowColor: "rgba(255, 46, 99, 0.3)",
    route: "/create/love?theme=classic-romance&occasion=proposal",
    emoji: "💌",
    previewDecorations: ["💖", "🌹", "💑", "✨", "💌"],
    audience: "Girlfriend, Boyfriend, Partner",
    chaptersCount: "8 Interactive Chapters",
    highlights: [
      "Runaway 'No' Button (9 Dodges)",
      "Digital Wax-Sealed Letter",
      "Polaroid Memories with Zoom",
      "9 Reasons Why I Love You",
      "Crack-Open Fortune Cookies",
    ],
    buttonText: "Create Love Surprise 💌",
    featured: true,
  },
  {
    id: "first-love",
    category: "romance",
    title: "First Love",
    tagline: "Fresh mint pastels capturing butterflies in the stomach, sweet inside jokes, and the magic of early dating.",
    badge: "🌱 Fresh & Sweet",
    badgeGradient: "linear-gradient(135deg, #00B894 0%, #00CEC9 100%)",
    accent: "#00B894",
    accentLight: "#E8F8F5",
    glowColor: "rgba(0, 184, 148, 0.25)",
    route: "/create/love?theme=first-love&occasion=love-note",
    emoji: "🌿",
    previewDecorations: ["🦋", "🌸", "💭", "✨", "🍃"],
    audience: "Crush, First Dates, Sweethearts",
    chaptersCount: "8 Interactive Chapters",
    highlights: [
      "Soft Pastel Aesthetic",
      "Washi-Taped Polaroid Memories",
      "Butterflies & Romance Animation",
      "Cursive Handwritten Note",
      "Playful Relationship Quiz",
    ],
    buttonText: "Choose First Love 🌿",
  },
  {
    id: "minimalist-love",
    category: "romance",
    title: "Minimalist Love",
    tagline: "Contemporary editorial typography, clean monochrome photo frames, and soft lavender lofi soundscapes.",
    badge: "✨ Modern Aesthetic",
    badgeGradient: "linear-gradient(135deg, #6C5CE7 0%, #8E44AD 100%)",
    accent: "#6C5CE7",
    accentLight: "#F0F3FF",
    glowColor: "rgba(108, 92, 231, 0.25)",
    route: "/create/love?theme=minimalist-love&occasion=love-note",
    emoji: "💜",
    previewDecorations: ["✨", "☕", "🎞️", "🎵", "🌙"],
    audience: "Modern Couples, Aesthetic Lovers",
    chaptersCount: "8 Interactive Chapters",
    highlights: [
      "Clean Editorial Typography",
      "Monochrome Polaroid Gallery",
      "Minimalist Digital Envelope",
      "Soft Ambient Lofi Audio",
      "Uncluttered Heartfelt Layout",
    ],
    buttonText: "Choose Minimalist 💜",
  },
  {
    id: "eternal-vows",
    category: "proposal",
    title: "Eternal Vows",
    tagline: "Deep crimson and gold romance crafted for proposals, wedding anniversaries, and lifelong commitments.",
    badge: "💍 Grand Proposal",
    badgeGradient: "linear-gradient(135deg, #D63031 0%, #E17055 100%)",
    accent: "#D63031",
    accentLight: "#FDE2E6",
    glowColor: "rgba(214, 48, 49, 0.25)",
    route: "/create/love?theme=eternal-vows&occasion=proposal",
    emoji: "💍",
    previewDecorations: ["💎", "🥂", "🌹", "✨", "👑"],
    audience: "Marriage Proposals, Anniversaries",
    chaptersCount: "8 Interactive Chapters",
    highlights: [
      "Grand Proposal 'Will You Say Yes?'",
      "Lifetime Promise Locks",
      "Golden Wax Seal Stamp",
      "Emotional Milestones Timeline",
      "WhatsApp 'She Said YES!' Ping",
    ],
    buttonText: "Choose Eternal Vows 💍",
  },
  {
    id: "garden-of-love",
    category: "romance",
    title: "Garden of Love",
    tagline: "Floating rose petals, soft sunlight bokeh, and botanical warmth celebrating memories that bloom together.",
    badge: "🌸 Botanical Bloom",
    badgeGradient: "linear-gradient(135deg, #00A86B 0%, #2ECC71 100%)",
    accent: "#00A86B",
    accentLight: "#F0FFF4",
    glowColor: "rgba(0, 168, 107, 0.25)",
    route: "/create/love?theme=garden-of-love&occasion=love-note",
    emoji: "🌸",
    previewDecorations: ["🌺", "🍃", "🌹", "☀️", "🦋"],
    audience: "Nature Lovers, Anniversaries",
    chaptersCount: "8 Interactive Chapters",
    highlights: [
      "Falling Petal Animations",
      "Storybook Milestone Journal",
      "Floral Framed Photo Grid",
      "Summer Acoustic Guitar Track",
      "Heartfelt Handwritten Letter",
    ],
    buttonText: "Choose Garden Love 🌸",
  },
  {
    id: "long-distance-love",
    category: "distance",
    title: "Long Distance Love",
    tagline: "Bridging the physical miles with interactive world map pins, days-together counters, and loving reassurance.",
    badge: "✈️ Miles Apart",
    badgeGradient: "linear-gradient(135deg, #0984E3 0%, #00CEC9 100%)",
    accent: "#0984E3",
    accentLight: "#F0F7FF",
    glowColor: "rgba(9, 132, 227, 0.25)",
    route: "/create/love?theme=long-distance-love&occasion=custom",
    emoji: "✈️",
    previewDecorations: ["🗺️", "☁️", "📍", "💌", "⏳"],
    audience: "Long Distance Couples",
    chaptersCount: "8 Interactive Chapters",
    highlights: [
      "Two-Cities Location Map Pins",
      "Countdown to Next Meetup",
      "Reassurance Love Letter",
      "Virtual Hugs & Coupons",
      "Distance-Proof Memories",
    ],
    buttonText: "Choose Long Distance ✈️",
  },
  {
    id: "apology-peace",
    category: "apology",
    title: "Heartfelt Apology",
    tagline: "Soft, gentle soothing design crafted to apologize sincerely, heal misunderstandings, and ask for a fresh start.",
    badge: "🕊️ Healing & Peace",
    badgeGradient: "linear-gradient(135deg, #E17055 0%, #F39C12 100%)",
    accent: "#E17055",
    accentLight: "#FFF5F0",
    glowColor: "rgba(225, 112, 85, 0.25)",
    route: "/create/love?theme=classic-romance&occasion=apology",
    emoji: "🥺",
    previewDecorations: ["🕊️", "🤍", "☕", "🕯️", "💌"],
    audience: "Saying Sorry, Healing Arguments",
    chaptersCount: "8 Interactive Chapters",
    highlights: [
      "Gentle 'Please Forgive Me' Opening",
      "Sincere Responsibility Letter",
      "Sweet Relationship Memories",
      "Calming Piano Soundtrack",
      "'Can We Start Fresh?' Action",
    ],
    buttonText: "Choose Apology 🕊️",
  },
];

const CATEGORY_TABS: { id: ThemeCategory; label: string; icon: string }[] = [
  { id: "all", label: "All Themes", icon: "✨" },
  { id: "birthday", label: "Birthday (New)", icon: "🎂" },
  { id: "romance", label: "Romance & Love", icon: "💖" },
  { id: "proposal", label: "Proposal & Vows", icon: "💍" },
  { id: "distance", label: "Long Distance", icon: "✈️" },
  { id: "apology", label: "Apology & Peace", icon: "🕊️" },
];

export default function ThemeSelector() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const filteredThemes = useMemo(() => {
    return ALL_THEMES.filter((theme) => {
      const matchesCategory =
        activeCategory === "all" || theme.category === activeCategory;
      const matchesSearch =
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.audience.toLowerCase().includes(searchQuery.toLowerCase());
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
        background:
          "radial-gradient(circle at 50% 0%, #FFF5F9 0%, #FDF0F6 40%, #FAF0FB 100%)",
      }}
    >
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      <header className="w-full border-b border-pink-100/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100/70 text-pink-700 hidden sm:block">
            Step 1: Choose Theme
          </div>
        </div>
      </header>

      {/* ── Main Content Container ────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
        {/* Title & Description */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200/60 mb-3 text-pink-700 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> 8 Handcrafted Interactive Themes
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Choose Your Experience Theme
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            Pick the perfect theme for your surprise. Each experience includes custom interactive games,
            animated scenes, background soundtrack, and instant WhatsApp alerts.
          </p>
        </motion.div>

        {/* ── Category Filters & Search Bar ─────────────────────────────────── */}
        <div className="w-full max-w-5xl mb-8 sm:mb-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Scrollable category pills on mobile, wrap on desktop */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playPop();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md scale-105"
                      : "bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-slate-200/90 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* ── Fully Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop, 4 on wide screen ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredThemes.map((theme, idx) => {
            const isHovered = hoveredTheme === theme.id;

            return (
              <motion.div
                key={theme.id}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                onClick={() => handleSelectTheme(theme)}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative rounded-3xl bg-white border border-slate-200/90 hover:border-pink-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                style={{
                  boxShadow: isHovered
                    ? `0 16px 32px -10px ${theme.glowColor}`
                    : undefined,
                }}
              >
                <div className="p-5 sm:p-6 pb-4">
                  {/* Badge & Chapters Count Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white shadow-2xs"
                      style={{ background: theme.badgeGradient }}
                    >
                      {theme.badge}
                    </span>

                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {theme.chaptersCount}
                    </span>
                  </div>

                  {/* Animated Visual Preview Box */}
                  <div
                    className="relative h-36 sm:h-40 rounded-2xl flex items-center justify-center overflow-hidden mb-4 border transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{
                      background: theme.accentLight,
                      borderColor: `${theme.accent}30`,
                    }}
                  >
                    {/* Floating ambient emojis */}
                    {theme.previewDecorations.map((deco, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-lg sm:text-xl select-none pointer-events-none opacity-40"
                        style={{
                          top: `${[15, 65, 20, 70, 40][i]}%`,
                          left: `${[12, 18, 80, 82, 6][i]}%`,
                        }}
                        animate={{
                          y: [-4, 4, -4],
                          rotate: [-6, 6, -6],
                        }}
                        transition={{
                          duration: 2.8 + i * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2,
                        }}
                      >
                        {deco}
                      </motion.div>
                    ))}

                    {/* Central Hero Emoji / Illustration */}
                    <motion.div
                      className="relative z-10 text-6xl select-none drop-shadow-md"
                      animate={
                        theme.id === "birthday-party"
                          ? { rotateY: [0, 360] }
                          : { scale: [1, 1.08, 1] }
                      }
                      transition={
                        theme.id === "birthday-party"
                          ? { duration: 12, repeat: Infinity, ease: "linear" }
                          : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                      }
                    >
                      {theme.emoji}
                    </motion.div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1 mb-3">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{theme.title}</span>
                      <span className="text-lg">{theme.emoji}</span>
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                      {theme.tagline}
                    </p>
                  </div>

                  {/* Audience Chip */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Ideal for: <strong className="text-slate-900">{theme.audience}</strong>
                    </span>
                  </div>

                  {/* Feature Highlights List */}
                  <div className="border-t border-slate-100 pt-3 space-y-1.5">
                    {theme.highlights.slice(0, 4).map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2 text-[11px] text-slate-700"
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white shrink-0"
                          style={{ background: theme.accent }}
                        >
                          <Check className="w-2 h-2" strokeWidth={3} />
                        </div>
                        <span className="font-medium truncate">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action Button */}
                <div className="p-5 sm:p-6 pt-0 mt-auto">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTheme(theme);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group-hover:shadow-md"
                    style={{ background: theme.badgeGradient }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{theme.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state if search has no results */}
        {filteredThemes.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-4xl">🔍</p>
            <h3 className="text-base font-bold text-slate-800">No themes found</h3>
            <p className="text-xs text-slate-500">
              Try searching with another keyword or pick &quot;All Themes&quot; tab.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="w-full py-6 border-t border-pink-100/80 bg-white/60 text-center mt-12">
        <p className="text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} LoveDrop™ • Handcrafted with love
        </p>
      </footer>
    </div>
  );
}
