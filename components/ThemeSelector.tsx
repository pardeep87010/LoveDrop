"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, Gift, ArrowRight, Check } from "lucide-react";
import { soundFx } from "@/lib/soundFx";

// ─── Theme Definitions ────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "love-surprise",
    name: "Love Surprise",
    tagline: "For your special someone 💕",
    emoji: "💌",
    scenes: ["Typing Intro", "Will you say YES?", "The Letter", "Polaroid Memories", "9 Reasons", "Our Story", "Quiz", "Fortune Cookies"],
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #FF2E63 100%)",
    bgGradient: "linear-gradient(180deg, #FFF0F8 0%, #FFD6EC 100%)",
    accentColor: "#FF2E63",
    lightBg: "#FFF5F9",
    border: "#FFB3CC",
    badge: "Most Popular 💖",
    badgeBg: "#FF2E63",
    previewEmojis: ["💌", "💖", "🌹", "💑", "🥂", "✨"],
    targetAudience: "Romantic Partner, Girlfriend, Boyfriend",
  },
  {
    id: "birthday-party",
    name: "Birthday Party",
    tagline: "Make their day unforgettable 🎂",
    emoji: "🎂",
    scenes: ["Birthday Cake", "The Letter", "Claw Machine", "Our Story", "Wishes Jar", "Photo Booth", "Our Places", "Our Date", "Our Song", "Blow Candles"],
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #C084FC 100%)",
    bgGradient: "linear-gradient(180deg, #FFF0F8 0%, #F5E6FF 100%)",
    accentColor: "#C084FC",
    lightBg: "#FFF5F9",
    border: "#DDB6FD",
    badge: "New 🎉",
    badgeBg: "#A855F7",
    previewEmojis: ["🎂", "🎈", "🎁", "⭐", "🎊", "💜"],
    targetAudience: "Best Friend, Partner, Family Member",
  },
];

// ─── Theme Card Component ─────────────────────────────────────────────────────
function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: (typeof THEMES)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      onClick={onSelect}
      className="relative rounded-3xl overflow-hidden cursor-pointer transition-all"
      style={{
        border: `2px solid ${isSelected ? theme.accentColor : theme.border}`,
        background: theme.bgGradient,
        boxShadow: isSelected ? `0 8px 32px ${theme.accentColor}40` : "0 2px 12px rgba(0,0,0,0.06)",
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white"
          style={{ background: theme.badgeBg }}>
          {theme.badge}
        </span>
      </div>

      {/* Selected indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-white"
            style={{ background: theme.accentColor }}
          >
            <Check className="w-4 h-4" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview area */}
      <div className="pt-10 pb-4 px-5 flex flex-col items-center">
        {/* Floating emoji animation */}
        <div className="relative h-28 w-full flex items-center justify-center mb-2">
          <motion.div
            className="text-[72px] leading-none drop-shadow-lg"
            animate={{ y: [-4, 4, -4], rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {theme.emoji}
          </motion.div>

          {/* Orbiting emojis */}
          {theme.previewEmojis.slice(1, 4).map((e, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{
                top: `${[10, 60, 20][i]}%`,
                left: `${[10, 75, 65][i]}%`,
                opacity: 0.7,
              }}
              animate={{
                y: [-3, 3, -3],
                rotate: [-8, 8, -8],
              }}
              transition={{
                duration: 2.5 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              {e}
            </motion.div>
          ))}
        </div>

        {/* Theme name & tagline */}
        <h3 className="text-xl font-black text-center" style={{ color: "#1E1B2E" }}>
          {theme.name}
        </h3>
        <p className="text-sm text-center mt-1" style={{ color: "#9B8FAB" }}>
          {theme.tagline}
        </p>

        {/* Target audience */}
        <p className="text-xs text-center mt-2 font-medium px-4" style={{ color: theme.accentColor }}>
          For: {theme.targetAudience}
        </p>

        {/* Scene chips */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {theme.scenes.slice(0, 5).map((scene, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: theme.lightBg, color: theme.accentColor, border: `1px solid ${theme.border}` }}
            >
              {scene}
            </span>
          ))}
          {theme.scenes.length > 5 && (
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: theme.lightBg, color: "#9B8FAB", border: `1px solid ${theme.border}` }}
            >
              +{theme.scenes.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-1.5 w-full" style={{ background: theme.gradient }} />
    </motion.div>
  );
}

// ─── Main ThemeSelector Component ────────────────────────────────────────────
export default function ThemeSelector() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleSelect = (themeId: string) => {
    soundFx.playPop();
    setSelectedTheme(themeId);
  };

  const handleContinue = () => {
    if (!selectedTheme) return;
    soundFx.playPop();
    if (selectedTheme === "birthday-party") {
      router.push("/create/birthday");
    } else {
      router.push("/create/love?theme=classic-romance");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F5 60%, #F5E0FF 100%)" }}
    >
      {/* Header */}
      <motion.div
        className="text-center px-6 pt-14 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF6B9D, #C084FC)" }}>
            💖
          </div>
          <span className="font-black text-xl" style={{ color: "#1E1B2E" }}>LoveDrop</span>
        </div>

        <h1 className="text-3xl font-black leading-tight" style={{ color: "#1E1B2E" }}>
          Choose your theme
        </h1>
        <p className="text-sm mt-2 font-medium" style={{ color: "#9B8FAB" }}>
          Pick the perfect style for your surprise 🎁
        </p>
      </motion.div>

      {/* Theme Cards */}
      <div className="flex-1 px-4 space-y-4 pb-36">
        {THEMES.map((theme, i) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.15 }}
          >
            <ThemeCard
              theme={theme}
              isSelected={selectedTheme === theme.id}
              onSelect={() => handleSelect(theme.id)}
            />
          </motion.div>
        ))}

        {/* Coming soon placeholder */}
        <motion.div
          className="rounded-3xl border-2 border-dashed p-6 text-center opacity-60"
          style={{ borderColor: "#E5E7EB" }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-3xl mb-2">🎪</p>
          <p className="font-bold text-sm text-gray-400">More themes coming soon...</p>
          <p className="text-xs text-gray-300 mt-1">Anniversary • Proposal • Apology</p>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-4"
        style={{ background: "linear-gradient(0deg, rgba(255,240,248,1) 70%, transparent 100%)" }}>
        <AnimatePresence>
          {selectedTheme && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <motion.button
                onClick={handleContinue}
                className="w-full py-4.5 rounded-2xl text-white font-extrabold text-lg shadow-xl flex items-center justify-center gap-3"
                style={{
                  background: selectedTheme === "birthday-party"
                    ? "linear-gradient(135deg, #FF6B9D 0%, #C084FC 100%)"
                    : "linear-gradient(135deg, #FF6B9D 0%, #FF2E63 100%)",
                  paddingTop: "1.125rem",
                  paddingBottom: "1.125rem",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>
                  {THEMES.find((t) => t.id === selectedTheme)?.emoji}{" "}
                  Create {THEMES.find((t) => t.id === selectedTheme)?.name}
                </span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedTheme && (
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#9B8FAB" }}>
              👆 Select a theme to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
