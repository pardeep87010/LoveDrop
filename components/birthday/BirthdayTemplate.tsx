"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  X,
  Heart,
  Star,
  Mic,
  Wind,
  RotateCcw,
  Download,
  Award,
  Sparkles,
  Play,
  Pause,
  MapPin,
  Calendar as CalendarIcon,
  Camera,
  Check,
  ChevronUp,
  Maximize2,
  ArrowRight,
} from "lucide-react";
import { BirthdayData } from "@/lib/types";
import { soundFx } from "@/lib/soundFx";

// ─── Design Tokens & CSS Variables (from DESIGN.md) ──────────────────────────
const BD = {
  primary: "#D1264F",
  primaryDark: "#AA254B",
  text: "#3A2340",
  textMuted: "#6E5869",
  bgGradient: "linear-gradient(180deg, #FFF8F1 0%, #FCEFE5 100%)",
  bgCream: "#FFF8F1",
  cardBg: "#FFFFFF",
  cardBorder: "rgba(58, 35, 64, 0.12)",
  cardShadow: "0px 10px 24px -18px rgba(60, 30, 50, 0.32), 0px 4px 16px rgba(58, 35, 64, 0.06)",
  pillBorder: "rgba(58, 35, 64, 0.15)",
};

// ─── Floating Confetti Sprinkles ──────────────────────────────────────────────
function FloatingSprinkles() {
  const sprinkles = [
    { color: "#FF9AA2", rotate: 25, left: "6%", top: "12%", size: 10 },
    { color: "#B5EAD7", rotate: -35, left: "88%", top: "8%", size: 8 },
    { color: "#C7CEEA", rotate: 45, left: "15%", top: "38%", size: 12 },
    { color: "#FFDAC1", rotate: -15, left: "92%", top: "44%", size: 9 },
    { color: "#E2F0CB", rotate: 70, left: "4%", top: "72%", size: 11 },
    { color: "#FFB7B2", rotate: -40, left: "82%", top: "80%", size: 10 },
    { color: "#D1264F", rotate: 30, left: "48%", top: "24%", size: 8 },
    { color: "#C084FC", rotate: -60, left: "32%", top: "86%", size: 11 },
    { color: "#FFDAC1", rotate: 15, left: "70%", top: "18%", size: 7 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sprinkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size * 2.2,
            backgroundColor: s.color,
            borderRadius: s.size,
            transform: `rotate(${s.rotate}deg)`,
            opacity: 0.75,
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [s.rotate - 10, s.rotate + 10, s.rotate - 10],
          }}
          transition={{
            duration: 4 + (i % 3) * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Cover / Welcome Screen (1st page theam.png) ──────────────────────────────
function SceneLanding({
  data,
  onOpen,
}: {
  data: BirthdayData;
  onOpen: () => void;
}) {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between py-10 px-4 text-center z-10 select-none">
      {/* Top Heading */}
      <motion.div
        className="max-w-md pt-4"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p
          className="text-xs font-bold tracking-[0.22em] uppercase mb-3"
          style={{ color: BD.primary }}
        >
          A GIFT FOR YOU
        </p>
        <h1
          className="text-5xl sm:text-6xl font-normal leading-[1.05] tracking-tight font-serif"
          style={{ color: BD.text }}
        >
          Happy birthday!
        </h1>
        <div className="mb-3">
          <span
            className="text-2xl sm:text-3xl font-serif font-bold px-4 py-1.5 rounded-full inline-block shadow-xs"
            style={{ backgroundColor: "#FDE68A", color: BD.primary }}
          >
            {data.recipientName || "Birthday Star"}
          </span>
        </div>
        <p
          className="text-sm sm:text-base mt-3.5 font-normal"
          style={{ color: BD.textMuted }}
        >
          {data.senderName ? `${data.senderName} threw a little party just for you.` : "Someone threw a little party just for you."}
        </p>
      </motion.div>

      {/* Center Cake Video with seamless multiply blend */}
      <motion.div
        className="my-auto py-4 flex flex-col items-center justify-center max-w-sm sm:max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <div className="relative group flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-[280px] sm:w-[380px] max-h-[380px] object-contain pointer-events-none select-none"
            style={{
              mixBlendMode: "multiply",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 72%, transparent 96%)",
              maskImage: "radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 72%, transparent 96%)",
            }}
          >
            <source src="/themes/birthday/cover/cake-video.mp4" type="video/mp4" />
            <source src="/themes/birthday/cover/cake-video.webm" type="video/webm" />
            {/* Fallback image */}
            <img
              src="/themes/birthday/cover/cake-wide.webp"
              alt="Birthday Cake on Pedestal"
              className="w-[280px] sm:w-[360px] object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </video>
        </div>
      </motion.div>

      {/* Bottom CTA Button */}
      <motion.div
        className="w-full max-w-xs pb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.button
          onClick={onOpen}
          className="w-full py-4 px-8 rounded-full font-semibold text-base sm:text-lg text-white shadow-xl flex items-center justify-center gap-2.5 transition-all"
          style={{
            backgroundColor: BD.primary,
            boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
          }}
          whileHover={{ scale: 1.03, boxShadow: "0 14px 28px -5px rgba(209, 38, 79, 0.5)" }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-xl">🎁</span>
          <span>{data.buttonText || "Open my gift"}</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Chapter 1: The Letter (2nd page theam.png) ──────────────────────────────
function SceneLetter({
  data,
  onNext,
}: {
  data: BirthdayData;
  onNext?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const fullLetterText =
    data.letterText ||
    `Dear ${data.recipientName || "Friend"},\n\nEvery single day with you is a blessing, but today is extra special because the world was gifted your beautiful soul.\n\nMay this year bring you as much laughter, joy, and peace as you bring to everyone around you. Keep shining bright!\n\nWith all my love,\n${data.senderName || "With Love"} 💖`;

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#D1264F", "#FFB3C6", "#FFD166", "#C084FC"],
    });
  };

  // Start typewriter effect after letter slides upwards
  useEffect(() => {
    if (!isOpen) {
      setTypedLength(0);
      setIsTyping(false);
      return;
    }
    // Delay slightly to let the card slide out first
    const delayTimer = setTimeout(() => {
      setIsTyping(true);
      let currentLen = 0;
      const interval = setInterval(() => {
        currentLen += 2;
        if (currentLen >= fullLetterText.length) {
          setTypedLength(fullLetterText.length);
          setIsTyping(false);
          clearInterval(interval);
        } else {
          setTypedLength(currentLen);
        }
      }, 25);
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [isOpen, fullLetterText]);

  const handleSkipTyping = () => {
    setTypedLength(fullLetterText.length);
    setIsTyping(false);
  };

  const handleCloseEnvelope = () => {
    setIsOpen(false);
    setIsExpanded(false);
    setTypedLength(0);
    setIsTyping(false);
  };

  return (
    <div className="relative min-h-[calc(100dvh-180px)] flex flex-col items-center justify-center px-4 pt-8 sm:pt-12 pb-16 select-none">
      <motion.div
        className="w-full max-w-lg z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Envelope & Letter Stacking Container */}
        <div className="relative flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px]">
          {/* Layer 1: Sliding Letter Card */}
          <motion.div
            className="w-[92%] sm:w-[94%] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all z-10"
            style={{
              borderColor: BD.cardBorder,
              boxShadow: BD.cardShadow,
            }}
            initial={{ y: 50, opacity: 0, scale: 0.94 }}
            animate={
              isOpen
                ? isExpanded
                  ? { y: -80, opacity: 1, scale: 1.02, pointerEvents: "auto" }
                  : { y: -130, opacity: 1, scale: 1, pointerEvents: "auto" }
                : { y: 90, opacity: 0, scale: 0.94, pointerEvents: "none" }
            }
            transition={{ type: "spring", damping: 22, stiffness: 180 }}
          >
            {/* Letter Header */}
            <div
              className="flex items-start justify-between border-b pb-3 mb-4"
              style={{ borderColor: "rgba(58,35,64,0.08)" }}
            >
              <div>
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
                  style={{ color: BD.primary }}
                >
                  OPEN THE ENVELOPE
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-normal font-serif"
                  style={{ color: BD.text }}
                >
                  {data.letterTitle || "A letter for you"}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                {isTyping && (
                  <button
                    onClick={handleSkipTyping}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-50 hover:bg-pink-100 text-[#D1264F] border border-pink-200 transition-colors"
                  >
                    Skip typing ⏩
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-slate-50 transition-colors"
                  style={{ borderColor: "rgba(58,35,64,0.15)", color: BD.text }}
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  <ChevronUp
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={handleCloseEnvelope}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-slate-50 transition-colors"
                  style={{ borderColor: "rgba(58,35,64,0.15)", color: BD.text }}
                  title="Close envelope"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Letter Content with Smooth Typewriter Effect */}
            <div
              onClick={isTyping ? handleSkipTyping : undefined}
              className={`max-h-[280px] sm:max-h-[340px] overflow-y-auto pr-1 ${
                isTyping ? "cursor-pointer" : ""
              }`}
            >
              <p
                className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans"
                style={{ color: BD.text }}
              >
                {fullLetterText.slice(0, typedLength)}
                {isTyping && (
                  <span
                    className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
                    style={{ backgroundColor: BD.primary }}
                  />
                )}
              </p>
            </div>

            {/* Signature fades in once typing finishes */}
            <motion.div
              className="mt-6 pt-3 border-t flex justify-end"
              style={{ borderColor: "rgba(58,35,64,0.08)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLength >= fullLetterText.length ? 1 : 0.2 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-cursive text-2xl" style={{ color: BD.primary }}>
                ~ {data.senderName || "With Love"} 💖
              </p>
            </motion.div>
          </motion.div>

          {/* Layer 2: Authentic Envelope Packet with Centered Wax Seal */}
          <div
            className={`relative w-full max-w-[440px] h-[240px] sm:h-[260px] z-20 transition-all ${
              isOpen ? "mt-6 sm:mt-8 opacity-90 scale-95" : "my-auto shadow-2xl"
            }`}
          >
            {/* Envelope Back Base */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #F8B4C8 0%, #F49EB8 50%, #EE8DAE 100%)",
                border: "1px solid rgba(209, 38, 79, 0.25)",
              }}
            >
              {/* Envelope Triangular Diagonal Fold SVGs (all meeting at EXACT 50% 50% = 200, 130) */}
              <svg
                viewBox="0 0 400 260"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                {/* Left Flap */}
                <path
                  d="M0 0 L200 130 L0 260 Z"
                  fill="rgba(247, 169, 194, 0.85)"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.5"
                />
                {/* Right Flap */}
                <path
                  d="M400 0 L200 130 L400 260 Z"
                  fill="rgba(247, 169, 194, 0.85)"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.5"
                />
                {/* Bottom Flap */}
                <path
                  d="M0 260 L200 130 L400 260 Z"
                  fill="rgba(238, 141, 174, 0.95)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="2"
                />

                {/* Top Flap (Closed state pointing down to exact center 200, 130) */}
                {!isOpen && (
                  <path
                    d="M0 0 L200 130 L400 0 Z"
                    fill="rgba(252, 198, 214, 0.96)"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="2"
                    filter="drop-shadow(0 4px 6px rgba(116, 12, 36, 0.15))"
                  />
                )}
              </svg>

              {/* Red Wax Seal Button in DEAD CENTER (50% X, 50% Y) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <motion.button
                  onClick={isOpen ? handleCloseEnvelope : handleOpenEnvelope}
                  className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-xl relative group focus:outline-none"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #E63956 0%, #A51A3C 55%, #6C0E20 100%)",
                    boxShadow:
                      "0 8px 24px rgba(108, 14, 32, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  animate={
                    !isOpen
                      ? {
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 8px 24px rgba(108, 14, 32, 0.45)",
                            "0 12px 30px rgba(209, 38, 79, 0.6)",
                            "0 8px 24px rgba(108, 14, 32, 0.45)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  title={isOpen ? "Click to close envelope" : "Click to open letter"}
                >
                  {/* Outer Wax Rim */}
                  <div className="w-11 h-11 rounded-full border-2 border-red-200/50 flex items-center justify-center shadow-inner">
                    <Heart className="w-6 h-6 text-white fill-white drop-shadow-md" />
                  </div>
                </motion.button>
              </div>

              {/* Bottom Instruction Hint */}
              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none z-20">
                <p className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white/90 drop-shadow flex items-center justify-center gap-1.5">
                  <ChevronUp
                    className={`w-3.5 h-3.5 ${isOpen ? "rotate-180" : "animate-bounce"}`}
                  />
                  <span>{isOpen ? "TAP SEAL TO CLOSE" : "TAP SEAL TO OPEN LETTER"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue to Reasons Button */}
        {onNext && (
          <motion.div
            className="w-full max-w-xs mt-6 flex justify-center z-30 mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{
                backgroundColor: BD.primary,
                boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Continue to Reasons 🎈</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Chapter 2: Colorful Balloons (Reasons Why) ──────────────────────────────
function SceneBalloons({
  data,
  onNext,
}: {
  data: BirthdayData;
  onNext?: () => void;
}) {
  const reasons = data.loveReasons?.length
    ? data.loveReasons
    : [
        "Your contagious smile that brightens any room",
        "How you always make time for the people you care about",
        "Your unique sense of humor and warmth",
        "The kindness you show even in the small moments",
        "Your big dreams and your brave spirit",
        "Just being your wonderful authentic self",
      ];

  const balloonThemes = [
    {
      bg: "radial-gradient(circle at 35% 30%, #FF85A2 0%, #E83A64 65%, #9E1035 100%)",
      border: "#E83A64",
      light: "#FFF0F4",
      stringColor: "#F472B6",
    },
    {
      bg: "radial-gradient(circle at 35% 30%, #FFB085 0%, #F36844 65%, #B83416 100%)",
      border: "#F36844",
      light: "#FFF3EE",
      stringColor: "#FB923C",
    },
    {
      bg: "radial-gradient(circle at 35% 30%, #FFE285 0%, #E5A824 65%, #A36F0A 100%)",
      border: "#E5A824",
      light: "#FFFDF0",
      stringColor: "#FBBF24",
    },
    {
      bg: "radial-gradient(circle at 35% 30%, #85E8C8 0%, #22C55E 65%, #15803D 100%)",
      border: "#22C55E",
      light: "#F0FDF4",
      stringColor: "#4ADE80",
    },
    {
      bg: "radial-gradient(circle at 35% 30%, #CFA5FA 0%, #8B5CF6 65%, #5B21B6 100%)",
      border: "#8B5CF6",
      light: "#F5F3FF",
      stringColor: "#A78BFA",
    },
    {
      bg: "radial-gradient(circle at 35% 30%, #93C5FD 0%, #3B82F6 65%, #1D4ED8 100%)",
      border: "#3B82F6",
      light: "#EFF6FF",
      stringColor: "#60A5FA",
    },
  ];

  const [popped, setPopped] = useState<number[]>([]);

  const popBalloon = (index: number) => {
    if (!popped.includes(index)) {
      setPopped([...popped, index]);
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.6 },
      });
    } else {
      // Reinflate on tap
      setPopped(popped.filter((idx) => idx !== index));
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-130px)] flex flex-col items-center justify-between px-4 py-8 select-none">
      {/* Header */}
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
          style={{ color: BD.primary }}
        >
          WHAT I LOVE
        </p>
        <h2
          className="text-3xl sm:text-4xl font-normal font-serif"
          style={{ color: BD.text }}
        >
          Reasons you&apos;re special
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: BD.textMuted }}>
          Tap each floating balloon to pop it &amp; reveal a reason! 🎈
        </p>
      </motion.div>

      {/* Floating 3D Balloons Cluster */}
      <div className="w-full max-w-3xl my-auto py-6 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
        {reasons.slice(0, 6).map((reason, i) => {
          const isPopped = popped.includes(i);
          const theme = balloonThemes[i % balloonThemes.length];

          return (
            <motion.div
              key={i}
              className="relative flex flex-col items-center cursor-pointer min-h-[160px] sm:min-h-[180px] justify-center"
              animate={
                isPopped
                  ? { scale: 1 }
                  : {
                      y: i % 2 === 0 ? [-6, 6, -6] : [6, -6, 6],
                      rotate: i % 2 === 0 ? [-3, 3, -3] : [3, -3, 3],
                    }
              }
              transition={
                isPopped
                  ? { duration: 0.3 }
                  : { duration: 3 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut" }
              }
              onClick={() => popBalloon(i)}
            >
              {isPopped ? (
                // Revealed Note Card
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="w-36 sm:w-44 h-40 sm:h-44 rounded-3xl p-3.5 flex flex-col items-center justify-between text-center shadow-xl border-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: theme.border,
                  }}
                >
                  <div className="w-full flex items-center justify-between">
                    <span
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: theme.border }}
                    >
                      #{i + 1}
                    </span>
                    <span className="text-sm">💖</span>
                  </div>
                  <p
                    className="text-xs sm:text-sm font-semibold leading-snug line-clamp-4 my-1"
                    style={{ color: BD.text }}
                  >
                    {reason}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Tap to reinflate
                  </span>
                </motion.div>
              ) : (
                // Real 3D Organic Balloon with Tied Knot & Wavy Hanging String
                <div className="flex flex-col items-center group">
                  <motion.div
                    className="w-24 sm:w-28 h-32 sm:h-36 rounded-full relative shadow-xl flex flex-col items-center justify-center cursor-pointer"
                    style={{
                      background: theme.bg,
                      borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                      boxShadow:
                        "0 12px 24px -6px rgba(0,0,0,0.25), inset -4px -4px 8px rgba(0,0,0,0.2), inset 4px 4px 8px rgba(255,255,255,0.45)",
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    {/* Glossy specular highlight curve */}
                    <div className="absolute top-3.5 left-3.5 w-4 h-8 rounded-full bg-white/45 -rotate-35 filter blur-[0.4px]" />
                    <div className="absolute top-3 left-8 w-2 h-2 rounded-full bg-white/60" />

                    <span className="text-xs font-black text-white drop-shadow-md tracking-wide">
                      Pop me! ✨
                    </span>
                  </motion.div>

                  {/* Tied Knot */}
                  <div
                    className="w-3 h-2 -mt-0.5 rounded-xs shadow-xs"
                    style={{ backgroundColor: theme.border }}
                  />

                  {/* Wavy Hanging String SVG */}
                  <svg
                    width="14"
                    height="24"
                    viewBox="0 0 14 24"
                    className="opacity-75 pointer-events-none"
                  >
                    <path
                      d="M7 0 Q11 8, 7 14 T7 24"
                      fill="none"
                      stroke={theme.stringColor}
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Pop Status & Reset */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold" style={{ color: BD.textMuted }}>
          {popped.length} of {Math.min(reasons.length, 6)} balloons popped ✨
        </p>
      </div>

      {/* Continue to Our Story Button */}
      {onNext && (
        <motion.div
          className="w-full max-w-xs mt-4 flex justify-center z-30 mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              backgroundColor: BD.primary,
              boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Continue to Our Story 📖</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Chapter 3: Our Story (3rd page theam.png) ────────────────────────────────
function SceneOurStory({
  data,
  onNext,
}: {
  data: BirthdayData;
  onNext?: () => void;
}) {
  return (
    <div className="relative min-h-[calc(100dvh-130px)] flex flex-col items-center justify-between px-4 py-8 select-none">
      {/* Header */}
      <motion.div
        className="text-center max-w-md mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
          style={{ color: BD.primary }}
        >
          CHAPTER BY CHAPTER
        </p>
        <h2
          className="text-3xl sm:text-4xl font-normal font-serif"
          style={{ color: BD.text }}
        >
          Our story
        </h2>
      </motion.div>

      {/* Open Book Journal */}
      <motion.div
        className="relative w-full max-w-4xl rounded-[28px] p-2.5 sm:p-4 shadow-2xl overflow-hidden my-auto"
        style={{
          background: "radial-gradient(circle, #FFA4BD 0%, #F48AA9 100%)",
          border: "4px solid rgba(255, 255, 255, 0.7)",
        }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Dangling Ribbon Bookmark at Bottom */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-10 bg-[#D1264F] rounded-b-md shadow-md z-30" />

        {/* Polka-dot pattern border simulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#FFFDF9] rounded-2xl p-4 sm:p-8 shadow-inner relative">
          {/* Left Page (Gifts Badge & Decorative Confetti) */}
          <div
            className="flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r relative min-h-[260px] sm:min-h-[340px]"
            style={{
              borderColor: "rgba(58,35,64,0.12)",
              backgroundImage: "radial-gradient(#3A234015 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            {/* Mint Circular Badge with Gift Boxes */}
            <div className="relative w-48 sm:w-56 h-48 sm:h-56 rounded-full bg-[#E2F7F0] flex items-center justify-center shadow-lg border-4 border-white">
              <motion.img
                src="/themes/birthday/story/gift-boxes.webp"
                alt="Stacked Gift Boxes"
                className="w-36 sm:w-44 object-contain drop-shadow-md"
                animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Right Page (Dotted paper with handwritten story) */}
          <div
            className="flex flex-col justify-center p-6 sm:p-8 min-h-[260px] sm:min-h-[340px]"
            style={{
              backgroundImage: "radial-gradient(#3A234015 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            <p
              className="text-xl sm:text-2xl font-light font-cursive leading-relaxed whitespace-pre-wrap"
              style={{ color: BD.text }}
            >
              {data.ourStory ||
                `Every chapter of our journey has been an unforgettable adventure.\n\nFrom the laughs we shared to the memories we made — thank you for being the most precious part of my story.\n\nHere's to writing a hundred more beautiful pages together! 📖✨`}
            </p>
            <p className="mt-6 text-right font-cursive text-lg" style={{ color: BD.primary }}>
              ~ {data.senderName}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Continue to Wishes Jar Button */}
      {onNext && (
        <motion.div
          className="w-full max-w-xs mt-6 flex justify-center z-30 mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              backgroundColor: BD.primary,
              boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Make a Wish Jar ⭐</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Chapter 4: Wishes Jar (4th page theam.png) ───────────────────────────────
function SceneWishesJar({
  data,
  onNext,
}: {
  data: BirthdayData;
  onNext?: () => void;
}) {
  const wishes = data.wishes?.length
    ? data.wishes
    : [
        "May all your wildest dreams take flight this year 🌟",
        "Abundant health, boundless energy, and peace 🌸",
        "Unforgettable journeys and spontaneous adventures 🌍",
        "Deep love and genuine laughter every day 💖",
        "Success in everything you pour your heart into ✨",
      ];

  const [revealed, setRevealed] = useState<number[]>([]);
  const allWishesRevealed = revealed.length >= wishes.length;

  const handleJarClick = () => {
    if (revealed.length < wishes.length) {
      setRevealed([...revealed, revealed.length]);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF69B4", "#7B68EE", "#34D399"],
      });
    }
  };

  const wishPillColors = [
    { bg: "rgba(255, 249, 196, 0.95)", border: "#FBC02D", text: "#B45309" },
    { bg: "rgba(255, 235, 238, 0.95)", border: "#F06292", text: "#BE123C" },
    { bg: "rgba(243, 229, 245, 0.95)", border: "#BA68C8", text: "#7E22CE" },
    { bg: "rgba(232, 245, 233, 0.95)", border: "#81C784", text: "#15803D" },
    { bg: "rgba(224, 247, 250, 0.95)", border: "#4DD0E1", text: "#0369A1" },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-180px)] flex flex-col items-center justify-between px-4 pt-6 pb-12 select-none overflow-hidden">
      {/* Top Header */}
      <motion.div
        className="text-center max-w-lg z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
          style={{ color: BD.primary }}
        >
          A JAR FULL OF DREAMS
        </p>
        <h2
          className="text-3xl sm:text-5xl font-normal font-serif leading-tight"
          style={{ color: BD.text }}
        >
          Heartfelt Birthday Wishes
        </h2>
        <p className="text-sm sm:text-base font-light font-cursive mt-1" style={{ color: BD.primary }}>
          {allWishesRevealed
            ? "All wishes have been released into the world! ✨"
            : "Tap the magical star jar to release each wish! ⭐"}
        </p>
      </motion.div>

      {/* NON-OVERLAPPING WISHES CONTAINER */}
      <div className="w-full max-w-2xl mx-auto my-3 min-h-[140px] flex flex-col items-center justify-center z-20">
        <div className="w-full flex flex-col gap-2.5 sm:grid sm:grid-cols-2">
          <AnimatePresence>
            {revealed.map((idx) => {
              const col = wishPillColors[idx % wishPillColors.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.88, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 220 }}
                  className="p-3 sm:p-3.5 rounded-2xl shadow-md border text-left flex items-start gap-2.5 backdrop-blur-sm"
                  style={{ backgroundColor: col.bg, borderColor: col.border }}
                >
                  <span className="text-lg shrink-0">⭐</span>
                  <div className="min-w-0">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider block"
                      style={{ color: col.text }}
                    >
                      Wish #{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold leading-snug text-[#3A2340] mt-0.5">
                      {wishes[idx]}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Center 3D Star Jar */}
      <motion.div
        className={`my-2 flex flex-col items-center justify-center relative z-20 ${
          allWishesRevealed ? "cursor-default" : "cursor-pointer group"
        }`}
        onClick={handleJarClick}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={!allWishesRevealed ? { scale: 1.05 } : {}}
        whileTap={!allWishesRevealed ? { scale: 0.95 } : {}}
      >
        <div className="relative">
          <motion.img
            src="/themes/birthday/wishes/star-jar.avif"
            alt="Star Jar"
            className="w-[190px] sm:w-[260px] object-contain drop-shadow-[0_20px_35px_rgba(58,35,64,0.22)]"
            animate={
              allWishesRevealed
                ? { scale: [1, 1.02, 1] }
                : { y: [-4, 4, -4] }
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute -top-3 -right-3 text-2xl pointer-events-none"
            animate={{ rotate: 360, scale: [1, 1.25, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.div>
        </div>

        {/* Jar Button Status Badge */}
        <div className="mt-3">
          <span
            className={`text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-2 rounded-full border shadow-sm inline-block transition-all ${
              allWishesRevealed
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-white/95 text-[#D1264F] border-pink-200 group-hover:scale-105"
            }`}
          >
            {allWishesRevealed
              ? "✨ All wishes released! ✨"
              : `Tap jar to release wish (${revealed.length}/${wishes.length}) ⭐`}
          </span>
        </div>
      </motion.div>

      {/* Bottom Continue to Moments Button */}
      {onNext && (
        <div className="w-full max-w-xs z-30 mx-auto mt-3 min-h-[48px] flex items-center justify-center">
          {allWishesRevealed ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
              style={{
                backgroundColor: BD.primary,
                boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Continue to Moments 📸</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <button
              onClick={onNext}
              className="text-xs font-semibold text-slate-400 hover:text-[#D1264F] transition-colors py-2 flex items-center gap-1 cursor-pointer"
            >
              <span>Skip to Moments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Chapter 5: Photobooth / Moments (5th page theam.png) ─────────────────────
function ScenePhotobooth({
  data,
  onNext,
}: {
  data: BirthdayData;
  onNext?: () => void;
}) {
  const photos = data.photos?.length
    ? data.photos
    : [
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80",
      ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  const snapPhoto = () => {
    setIsFlashing(true);
    soundFx.playPop();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setIsFlashing(false);
      setActiveIdx((prev) => (prev + 1) % photos.length);
    }, 350);
  };

  const safeIdx = activeIdx % photos.length;
  const currentPhoto = photos[safeIdx];

  return (
    <div className="relative min-h-[calc(100dvh-180px)] flex flex-col items-center justify-between px-4 pt-6 pb-12 select-none">
      {/* Top Header */}
      <motion.div
        className="text-center max-w-md mx-auto mb-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
          style={{ color: BD.primary }}
        >
          SAY CHEESE!
        </p>
        <h2
          className="text-3xl sm:text-5xl font-normal font-serif leading-tight"
          style={{ color: BD.text }}
        >
          Our moments
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: BD.textMuted }}>
          Memories frozen in time 📸
        </p>
      </motion.div>

      {/* Main Responsive Area */}
      <div className="w-full max-w-4xl mx-auto my-auto flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10">
        {/* Large Polaroid Showcase (Hero on Mobile and Desktop) */}
        <motion.div
          className="flex flex-col items-center w-full max-w-[340px] sm:max-w-[400px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border relative"
            style={{
              borderColor: BD.cardBorder,
              boxShadow: "0 20px 45px -15px rgba(58, 35, 64, 0.25)",
            }}
          >
            {/* Washi Tape Accent */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 rounded-sm shadow-sm z-20 -rotate-2"
              style={{
                backgroundColor: "rgba(254, 240, 138, 0.9)",
                border: "1px dashed rgba(202, 138, 4, 0.4)",
              }}
            />

            {/* Photo Window */}
            <div className="relative w-full h-[260px] sm:h-[320px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center group">
              {isFlashing && (
                <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />
              )}
              <AnimatePresence mode="wait">
                <motion.img
                  key={safeIdx}
                  src={currentPhoto}
                  alt={`Memory ${safeIdx + 1}`}
                  className="w-full h-full object-cover select-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Prev / Next Overlay Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer z-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveIdx((prev) => (prev + 1) % photos.length)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer z-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs font-bold z-30">
                {safeIdx + 1} / {photos.length}
              </div>
            </div>

            {/* Polaroid Handwritten Caption */}
            <div className="pt-3 pb-1 text-center">
              <p className="font-cursive text-xl sm:text-2xl" style={{ color: BD.primary }}>
                Unforgettable memories with you 💕
              </p>
            </div>

            {/* Thumbnail Filmstrip */}
            {photos.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2 border-t mt-2 border-pink-100">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      i === safeIdx
                        ? "border-[#D1264F] scale-110 shadow-md ring-2 ring-pink-300"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Snap Shutter Button */}
          <div className="w-full mt-3">
            <motion.button
              onClick={snapPhoto}
              className="w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{ backgroundColor: BD.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-4 h-4" />
              <span>Next Memory Photo ({safeIdx + 1}/{photos.length})</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Continue to Calendar Button */}
      {onNext && (
        <motion.div
          className="w-full max-w-xs mt-4 flex justify-center z-30 mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              backgroundColor: BD.primary,
              boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Continue to Special Date 📅</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Chapter 6: Special Date / Calendar (7th page theam.png) ───────────────────
function SceneCalendar({
  data,
  onNext,
}: {
  data: BirthdayData;
  onNext?: () => void;
}) {
  const dateStr = data.birthdayDate || data.ourDate || new Date().toISOString();
  let dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) dateObj = new Date();

  const monthName = dateObj.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const dayNum = dateObj.getDate();
  const yearNum = dateObj.getFullYear();
  const weekDay = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  const celebrateDate = () => {
    soundFx.playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF69B4", "#7B68EE", "#34D399"],
    });
  };

  return (
    <div className="relative min-h-[calc(100dvh-180px)] flex flex-col items-center justify-between px-4 pt-6 pb-12 select-none">
      {/* Top Header Tag */}
      <motion.div
        className="text-center max-w-md mx-auto mb-2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] px-3.5 py-1 rounded-full text-amber-800 bg-amber-100 border border-amber-300 shadow-2xs inline-block mb-1.5">
          ✦ GOLDEN BIRTHDAY MILESTONE ✦
        </span>
        <h2
          className="text-3xl sm:text-5xl font-normal font-serif leading-tight"
          style={{ color: BD.text }}
        >
          A date to keep
        </h2>
        <p className="text-sm font-cursive mt-1" style={{ color: BD.primary }}>
          The world became infinitely more joyful on this day ✨
        </p>
      </motion.div>

      {/* Main Beautiful 2-Column Milestone Display */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center my-auto z-20">
        {/* Left: 3D Calendar with Glow & Confetti Tap */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className="relative flex items-center justify-center cursor-pointer group"
            onClick={celebrateDate}
          >
            {/* Glowing Backdrop Ring */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-300/40 via-amber-200/40 to-pink-200/40 blur-2xl group-hover:scale-110 transition-all" />

            <motion.img
              src="/themes/birthday/calendar/calendar-3d.avif"
              alt="3D Calendar"
              className="w-[280px] sm:w-[360px] object-contain drop-shadow-[0_20px_35px_rgba(58,35,64,0.25)] relative z-10"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            />

            {/* Date Center Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 text-center pointer-events-none z-20">
              <p className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-[#D1264F]">
                {monthName}
              </p>
              <h3 className="text-5xl sm:text-7xl font-black font-serif leading-none my-1 text-[#3A2340]">
                {dayNum}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#6E5869]">
                {weekDay} • {yearNum}
              </p>
            </div>

            {/* Tap to celebrate pill */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30">
              <span className="px-3 py-1 rounded-full bg-white/95 border border-pink-200 text-[11px] font-bold text-[#D1264F] shadow-md flex items-center gap-1 group-hover:scale-105 transition-all">
                <span>🎉 Tap to Celebrate</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Luxury Milestone Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border w-full max-w-md mx-auto md:mx-0 relative overflow-hidden"
          style={{ borderColor: "rgba(209, 38, 79, 0.2)", boxShadow: BD.cardShadow }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Decorative Corner Ribbon */}
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
            <div className="bg-[#D1264F] text-white text-[9px] font-extrabold uppercase py-1 text-center rotate-45 translate-x-7 translate-y-4 w-28 shadow-sm">
              MILESTONE
            </div>
          </div>

          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1 text-[#D1264F]">
            CELEBRATING YOU
          </p>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A2340] mb-3">
            A Day Written in the Stars ✨
          </h3>
          <p className="text-sm leading-relaxed text-[#6E5869] mb-5">
            Every day with you is special, but this date will always hold a royal place in our hearts. A reminder of joy, laughter, and the brightest smiles you bring!
          </p>

          {/* Age Milestone Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-amber-50/70 to-pink-50 border border-pink-200/80 flex items-center gap-3.5 shadow-2xs mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-pink-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
              🎂
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#D1264F]">
                {data.birthdayAge
                  ? `Celebrating ${data.birthdayAge} Wonderfully Bright Years`
                  : "Celebrating Another Joyful Year"}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                May your upcoming year be overflowing with dreams fulfilled!
              </p>
            </div>
          </div>

          {/* 3 Milestone Badges */}
          <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#3A2340]">
            <div className="flex-1 p-2 rounded-xl bg-pink-50/60 border border-pink-100 text-center">
              <span>🌟 Infinite Joy</span>
            </div>
            <div className="flex-1 p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
              <span>💖 Pure Love</span>
            </div>
            <div className="flex-1 p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-center">
              <span>🚀 Big Dreams</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continue to Vinyl / Song Button */}
      {onNext && (
        <motion.div
          className="w-full max-w-xs mt-6 flex justify-center z-30 mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              backgroundColor: BD.primary,
              boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Listen to Song 🎵</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Chapter 7: Our Song / Vinyl Turntable (8th page theam.png) ───────────────
function SceneVinylPlayer({
  data,
  isPlaying,
  onTogglePlay,
  onNext,
}: {
  data: BirthdayData;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext?: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Auto-start music if not yet playing
  useEffect(() => {
    if (!isPlaying && onTogglePlay) {
      onTogglePlay();
    }
  }, []);

  // 4-second auto-advance timer: Scene appears for 4s, plays song, then disappears into Candles!
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onNext) onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="relative min-h-[calc(100dvh-180px)] flex flex-col items-center justify-between px-4 pt-6 pb-12 select-none">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-auto z-20">
        {/* Left: Song Info & Auto-Advance Notice */}
        <motion.div
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border w-full max-w-md mx-auto md:mx-0 order-2 md:order-1 text-center md:text-left"
          style={{ borderColor: BD.cardBorder, boxShadow: BD.cardShadow }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#D1264F]">
              NOW PLAYING OUR ANTHEM
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal font-serif mb-2 text-[#3A2340]">
            Our Birthday Song 🎶
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#6E5869] mb-4">
            {data.ourSong || "Celebration Melody Dedicated Just for You"}
          </p>

          {/* Equalizer animation */}
          <div className="flex items-center justify-center md:justify-start gap-1.5 h-8 my-4">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full"
                style={{ backgroundColor: BD.primary }}
                animate={{ height: [6, 26 + ((i * 5) % 14), 10, 30, 6] }}
                transition={{
                  duration: 0.7 + (i % 4) * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Auto-Advance Pill Indicator (4 seconds count) */}
          <div className="mt-4 p-3 rounded-2xl bg-pink-50 border border-pink-200 text-center">
            <p className="text-xs font-bold text-[#D1264F]">
              🕯️ Advancing to Birthday Candles in {secondsLeft}s...
            </p>
            <div className="w-full bg-pink-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <motion.div
                className="bg-[#D1264F] h-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Right: Pink Turntable Deck with Spinning Vinyl & Floating Notes */}
        <motion.div
          className="flex flex-col items-center justify-center order-1 md:order-2 relative"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Floating Music Notes */}
          <div className="absolute -top-8 inset-x-0 flex justify-around pointer-events-none z-20">
            <motion.span
              className="text-lg text-pink-500"
              animate={{ y: [-5, -25, -5], opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              🎵
            </motion.span>
            <motion.span
              className="text-xl text-purple-500"
              animate={{ y: [-10, -35, -10], opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: 0.4 }}
            >
              🎶
            </motion.span>
            <motion.span
              className="text-lg text-amber-500"
              animate={{ y: [-6, -28, -6], opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 0.8 }}
            >
              ✨
            </motion.span>
          </div>

          <div
            className="relative w-[290px] sm:w-[360px] h-[270px] sm:h-[330px] rounded-[36px] p-6 shadow-2xl flex items-center justify-center cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #FDE6EE 0%, #FBCFDF 100%)",
              boxShadow: "0 20px 40px -15px rgba(209, 38, 79, 0.35)",
            }}
          >
            {/* Spinning Vinyl Record */}
            <motion.div
              className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-slate-900 shadow-2xl flex items-center justify-center relative border-4 border-slate-800"
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            >
              {/* Vinyl Grooves */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-slate-700/60 flex items-center justify-center">
                <div className="w-28 h-28 sm:w-34 sm:h-34 rounded-full border border-slate-800/80 flex items-center justify-center">
                  {/* Center Label */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D1264F] flex flex-col items-center justify-center text-white p-1 text-center shadow-inner">
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
                      LoveDrop
                    </span>
                    <span className="text-xs sm:text-sm">🎂</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Skip / Next Button */}
      {onNext && (
        <motion.div
          className="w-full max-w-xs mt-4 flex justify-center z-30 mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              backgroundColor: BD.primary,
              boxShadow: "0 10px 25px -5px rgba(209, 38, 79, 0.4)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Blow Candles Now 🕯️</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Chapter 9: Blow Out Candles (9th page theam.png) ─────────────────────────
function SceneBlowCandles({
  data,
  onBlown,
  onNext,
}: {
  data: BirthdayData;
  onBlown: () => void;
  onNext?: () => void;
}) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerBlow = useCallback(() => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#D1264F", "#FFB3C6", "#FFD166", "#C084FC", "#34D399"],
    });
    setTimeout(() => {
      onBlown();
    }, 2200);
  }, [candlesBlown, onBlown]);

  // Spacebar hold support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !candlesBlown && !holdInterval.current) {
        e.preventDefault();
        startHold();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        stopHold();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [candlesBlown]);

  const startHold = () => {
    let p = 0;
    holdInterval.current = setInterval(() => {
      p += 8;
      setHoldProgress(p);
      if (p >= 100) {
        clearInterval(holdInterval.current!);
        holdInterval.current = null;
        triggerBlow();
      }
    }, 80);
  };

  const stopHold = () => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
      setHoldProgress(0);
    }
  };

  // Microphone breath detection
  const handleMicClick = async () => {
    setIsListeningMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 512;
      const buffer = new Uint8Array(analyser.fftSize);

      let loudCount = 0;
      const interval = setInterval(() => {
        analyser.getByteTimeDomainData(buffer);
        const maxDelta = Math.max(...Array.from(buffer).map((v) => Math.abs(v - 128)));
        if (maxDelta > 28) loudCount++;
        if (loudCount > 3) {
          clearInterval(interval);
          stream.getTracks().forEach((t) => t.stop());
          setIsListeningMic(false);
          triggerBlow();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        stream.getTracks().forEach((t) => t.stop());
        setIsListeningMic(false);
      }, 9000);
    } catch {
      setIsListeningMic(false);
      alert("Microphone not available. Please use the 'Hold to blow' button!");
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-130px)] flex flex-col items-center justify-center px-4 py-8 select-none">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: 3D Cake with Lit Candles */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative flex items-center justify-center">
            <motion.img
              key={candlesBlown ? "cake-unlit" : "cake-lit"}
              src={
                candlesBlown
                  ? "/themes/birthday/cover/cake-wide.webp"
                  : "/themes/birthday/candles/cake-lit-wide.webp"
              }
              alt={candlesBlown ? "Birthday Cake Extinguished" : "Birthday Cake with Lit Candles"}
              className="w-[290px] sm:w-[420px] max-h-[380px] object-contain select-none pointer-events-none"
              style={{
                mixBlendMode: "multiply",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 50% 50%, black 55%, rgba(0,0,0,0.85) 75%, transparent 97%)",
                maskImage:
                  "radial-gradient(ellipse at 50% 50%, black 55%, rgba(0,0,0,0.85) 75%, transparent 97%)",
              }}
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Subtle warm candlelight ambient glow (eliminates crude floating pill stickers) */}
            {!candlesBlown && (
              <motion.div
                className="absolute top-[22%] sm:top-[20%] left-1/2 -translate-x-1/2 w-44 sm:w-56 h-16 sm:h-20 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(255, 210, 110, 0.5) 0%, rgba(255, 140, 50, 0.18) 55%, transparent 80%)",
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: [0.75, 1, 0.8, 0.95, 0.75],
                  scale: [0.98, 1.05, 0.99, 1.03, 0.98],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Smoke Puff when blown out */}
            {candlesBlown && (
              <motion.div
                className="absolute top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0.9, 0], y: -70, scale: 1.4 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
              >
                <span className="text-4xl filter drop-shadow">💨</span>
                <span className="text-xs font-bold text-stone-500 italic mt-1 bg-white/70 px-2.5 py-0.5 rounded-full shadow-xs">
                  Wish made... ✨
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Right: Blow Out Control Card */}
        <motion.div
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border w-full max-w-md mx-auto md:mx-0"
          style={{ borderColor: BD.cardBorder, boxShadow: BD.cardShadow }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: BD.primary }}
            >
              MAKE A WISH
            </p>
            {/* 5 Candle Icons */}
            <div className="flex gap-1 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={candlesBlown ? "opacity-30" : "opacity-100"}>
                  🕯️
                </span>
              ))}
            </div>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-normal font-serif mb-3"
            style={{ color: BD.text }}
          >
            Blow out the candles
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: BD.textMuted }}>
            Close your eyes, make a wish and blow into the microphone, or hold the button and blow.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Quick Tap to Blow Candles */}
            <motion.button
              onClick={triggerBlow}
              disabled={candlesBlown}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{
                backgroundColor: candlesBlown ? "#6B7280" : BD.primary,
                boxShadow: candlesBlown ? "none" : "0 8px 24px -4px rgba(209, 38, 79, 0.45)",
              }}
              whileHover={!candlesBlown ? { scale: 1.02 } : {}}
              whileTap={!candlesBlown ? { scale: 0.96 } : {}}
            >
              <Wind className="w-5 h-5" />
              <span>{candlesBlown ? "Candles Extinguished! ✨" : "Blow Candles 🌬️"}</span>
            </motion.button>

            {/* Hold to blow */}
            <motion.button
              onPointerDown={startHold}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              disabled={candlesBlown}
              className="w-full py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider border flex items-center justify-center gap-2 relative overflow-hidden"
              style={{ borderColor: BD.cardBorder, color: BD.text }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Progress bar background fill */}
              {holdProgress > 0 && (
                <div
                  className="absolute inset-0 bg-pink-100 transition-all pointer-events-none"
                  style={{ width: `${holdProgress}%` }}
                />
              )}
              <Wind className="w-4 h-4 z-10" />
              <span className="z-10">{holdProgress > 0 ? "Keep holding..." : "Hold to blow"}</span>
            </motion.button>

            {/* Microphone Option */}
            <motion.button
              onClick={handleMicClick}
              disabled={candlesBlown}
              className="w-full py-2.5 px-6 rounded-full font-semibold text-xs border flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors"
              style={{ borderColor: "rgba(58,35,64,0.12)" }}
              whileTap={{ scale: 0.96 }}
            >
              <Mic className="w-3.5 h-3.5 text-[#D1264F]" />
              <span>{isListeningMic ? "Listening for your breath... 🌬️" : "Or blow into microphone"}</span>
            </motion.button>

            {/* Celebrate Button */}
            {candlesBlown && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                onClick={onNext || onBlown}
                className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
                style={{
                  backgroundColor: "#10B981",
                  boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Celebrate Birthday 🎉</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Key shortcut hint */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: BD.textMuted }}>
            <span className="px-2 py-0.5 rounded border bg-slate-50 font-mono text-[10px]">
              Space
            </span>
            <span>hold to blow</span>
          </div>

          <p className="text-[10px] mt-4 text-center leading-normal" style={{ color: BD.textMuted }}>
            The microphone only listens for your breath, right here on your device. Nothing is recorded.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Chapter 10: Finale Celebration (10th page theam.png) ─────────────────────
function SceneFinale({
  data,
  onWatchAgain,
  onJumpTo,
}: {
  data: BirthdayData;
  onWatchAgain: () => void;
  onJumpTo: (chapter: number) => void;
}) {
  const recipient = data.recipientName || "You";
  const sender = data.senderName || "With Love";
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  const shareSurprise = () => {
    const text = `🎉 Happy Birthday ${recipient}! A special birthday surprise was made for you! Open it here: ${
      typeof window !== "undefined" ? window.location.href : ""
    }`;
    if (navigator.share) {
      navigator.share({ title: `Happy Birthday ${recipient}!`, text, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  // High-Resolution Official Birthday Certificate Generator (1200x1060 Luxury Canvas)
  const handleDownloadCertificate = async () => {
    if (isGeneratingCert) return;
    setIsGeneratingCert(true);
    soundFx.playSuccessChime();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });

    // Helper: Safely load image for canvas with CORS fallback
    const loadCanvasImage = (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => {
          const fallback = new Image();
          fallback.onload = () => resolve(fallback);
          fallback.onerror = () => resolve(null);
          fallback.src = src;
        };
        img.src = src;
      });
    };

    // Candidate photos from birthday surprise
    const candidatePhotos: string[] = [];
    if (Array.isArray(data?.photos) && data.photos.length > 0) {
      candidatePhotos.push(...data.photos.filter((p): p is string => Boolean(p && typeof p === "string")));
    }
    if (candidatePhotos.length === 0) {
      candidatePhotos.push(
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80"
      );
    }

    const uniquePool = Array.from(new Set(candidatePhotos));
    const shuffled = [...uniquePool].sort(() => Math.random() - 0.5);
    const chosen3Urls: string[] = [];
    for (let i = 0; i < 3; i++) {
      chosen3Urls.push(shuffled[i % shuffled.length]);
    }

    let loadedImgs: (HTMLImageElement | null)[] = [];
    try {
      loadedImgs = await Promise.all(chosen3Urls.map((url) => loadCanvasImage(url)));
    } catch {
      loadedImgs = [null, null, null];
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1060;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsGeneratingCert(false);
      return;
    }

    // 1. Rich Vintage Birthday Parchment Background
    const bgGrad = ctx.createRadialGradient(600, 530, 100, 600, 530, 850);
    bgGrad.addColorStop(0, "#FFFFFF");
    bgGrad.addColorStop(0.5, "#FFFDF7");
    bgGrad.addColorStop(0.85, "#FFF5F8");
    bgGrad.addColorStop(1, "#FAECF2");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1060);

    // Subtle luxury gold vignette tint
    ctx.fillStyle = "rgba(212, 175, 55, 0.03)";
    ctx.fillRect(0, 0, 1200, 1060);

    // 2. Outer Ornate Gold Foil Border
    const goldGrad = ctx.createLinearGradient(0, 0, 1200, 1060);
    goldGrad.addColorStop(0, "#B8860B");
    goldGrad.addColorStop(0.2, "#E5C158");
    goldGrad.addColorStop(0.4, "#FDF3D0");
    goldGrad.addColorStop(0.6, "#D4AF37");
    goldGrad.addColorStop(0.8, "#AA771C");
    goldGrad.addColorStop(1, "#C59B27");

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 14;
    ctx.strokeRect(28, 28, 1144, 1004);

    // Inner fine gold hairline
    ctx.strokeStyle = "#C5A059";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, 1116, 976);

    // Inner Festive Rose Accent Border
    ctx.strokeStyle = "#D1264F";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(52, 52, 1096, 956);

    // 3. Baroque Corner Filigree Flourishes
    const drawCornerFlourish = (cx: number, cy: number, flipX: number, flipY: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(flipX, flipY);
      ctx.strokeStyle = "#B8860B";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 35);
      ctx.bezierCurveTo(10, 15, 15, 10, 35, 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(18, 45);
      ctx.bezierCurveTo(18, 22, 22, 18, 45, 18);
      ctx.stroke();

      ctx.fillStyle = "#D1264F";
      ctx.font = "bold 16px serif";
      ctx.textAlign = "center";
      ctx.fillText("✦", 22, 26);
      ctx.restore();
    };

    drawCornerFlourish(52, 52, 1, 1);
    drawCornerFlourish(1148, 52, -1, 1);
    drawCornerFlourish(52, 1008, 1, -1);
    drawCornerFlourish(1148, 1008, -1, -1);

    // 4. Header Top Crest Emblem
    ctx.textAlign = "center";
    ctx.fillStyle = "#D4AF37";
    ctx.font = "26px serif";
    ctx.fillText("👑   ✦   🎂   ✦   👑", 600, 92);

    // Grand Title
    ctx.fillStyle = "#3A2340";
    ctx.font = "bold 38px 'Playfair Display', Georgia, serif";
    ctx.fillText("OFFICIAL BIRTHDAY CERTIFICATE", 600, 138);

    // Subheader Ribbon Badge
    ctx.fillStyle = "#D1264F";
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillText("✦  RECOGNITION OF EXCEPTIONAL AWESOMENESS & PURE JOY  ✦", 600, 170);

    // Ornate Divider Line
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(340, 190);
    ctx.lineTo(540, 190);
    ctx.moveTo(660, 190);
    ctx.lineTo(860, 190);
    ctx.stroke();

    ctx.fillStyle = "#B8860B";
    ctx.font = "bold 18px serif";
    ctx.fillText("❦", 600, 196);

    // 5. Body Presentation Text
    ctx.fillStyle = "#64748B";
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillText("This official decree solemnly & joyfully certifies that", 600, 228);

    // Recipient Name
    ctx.fillStyle = "#D1264F";
    ctx.font = "bold 46px 'Playfair Display', Georgia, serif";
    ctx.fillText(recipient, 600, 280);

    // Golden Accent Line below recipient name
    const nameWidth = ctx.measureText(recipient).width;
    const lineHalf = Math.max(nameWidth / 2 + 30, 120);
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600 - lineHalf, 292);
    ctx.lineTo(600 + lineHalf, 292);
    ctx.stroke();

    ctx.fillStyle = "#64748B";
    ctx.font = "italic 17px Georgia, serif";
    ctx.fillText("is hereby crowned the Most Loved & Incomparable Birthday Star, presented by", 600, 326);

    // Sender Name
    ctx.fillStyle = "#3A2340";
    ctx.font = "bold 36px 'Playfair Display', Georgia, serif";
    ctx.fillText(sender, 600, 370);

    // 6. THE 3 TILTED POLAROID PHOTOS
    const drawPolaroidCard = (
      cx: number,
      cy: number,
      angleRad: number,
      img: HTMLImageElement | null,
      isTop: boolean
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRad);

      const cardW = 216;
      const cardH = 236;
      const borderSide = 10;
      const borderBottom = 26;

      ctx.shadowColor = isTop ? "rgba(0, 0, 0, 0.30)" : "rgba(0, 0, 0, 0.18)";
      ctx.shadowBlur = isTop ? 24 : 16;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = isTop ? 12 : 8;

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 4);
      ctx.fill();

      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const imgX = -cardW / 2 + borderSide;
      const imgY = -cardH / 2 + borderSide;
      const imgW = cardW - borderSide * 2;
      const imgH = cardH - borderSide - borderBottom;

      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 2);
        ctx.clip();

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = imgW / imgH;
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (imgRatio > targetRatio) {
          sw = img.naturalHeight * targetRatio;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / targetRatio;
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, imgX, imgY, imgW, imgH);
        ctx.restore();

        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
        ctx.lineWidth = 1;
        ctx.strokeRect(imgX, imgY, imgW, imgH);
      } else {
        ctx.fillStyle = "#FFF0F4";
        ctx.fillRect(imgX, imgY, imgW, imgH);
        ctx.fillStyle = "#D1264F";
        ctx.font = "32px serif";
        ctx.textAlign = "center";
        ctx.fillText("🎂", 0, imgY + imgH / 2 + 10);
      }

      ctx.fillStyle = "rgba(209, 38, 79, 0.6)";
      ctx.font = "bold 9px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("♥ BIRTHDAY MEMORY ♥", 0, cardH / 2 - 9);

      ctx.restore();
    };

    // Draw Left photo (-6.5° tilt)
    drawPolaroidCard(405, 520, -0.11, loadedImgs[0], false);
    // Draw Right photo (+5.5° tilt)
    drawPolaroidCard(795, 520, 0.10, loadedImgs[1], false);
    // Draw Center photo (straight, sits in front)
    drawPolaroidCard(600, 505, -0.015, loadedImgs[2], true);

    // 7. Middle Celebration Statement
    ctx.textAlign = "center";
    ctx.fillStyle = "#4A364D";
    ctx.font = "italic 15px Georgia, serif";
    ctx.fillText(
      "May every chapter ahead overflow with laughter, dreams fulfilled, radiant health, and boundless joy.",
      600,
      675
    );

    // 4 Official Attribute Badges
    const drawBadge = (x: number, y: number, text: string) => {
      ctx.save();
      ctx.font = "bold 11px 'Inter', sans-serif";
      const w = ctx.measureText(text).width + 24;
      ctx.fillStyle = "#FFF7EC";
      ctx.strokeStyle = "#FDBA74";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - 12, w, 24, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#9A3412";
      ctx.textAlign = "center";
      ctx.fillText(text, x, y + 4);
      ctx.restore();
    };
    drawBadge(360, 715, "⭐ 100% Guaranteed Smiles");
    drawBadge(530, 715, "💖 Lifetime Pure Love");
    drawBadge(690, 715, "🚀 Unstoppable Success");
    drawBadge(845, 715, "🎂 Cake & Confetti");

    // 8. Seal of Authenticity (Center Bottom)
    const sealX = 600, sealY = 825, sealR = 50;
    // Seal Ribbon tails
    ctx.fillStyle = "#9F1239";
    ctx.beginPath();
    ctx.moveTo(sealX - 16, sealY + sealR - 10);
    ctx.lineTo(sealX - 32, sealY + sealR + 42);
    ctx.lineTo(sealX - 16, sealY + sealR + 32);
    ctx.lineTo(sealX, sealY + sealR + 42);
    ctx.lineTo(sealX - 2, sealY + sealR - 10);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sealX + 2, sealY + sealR - 10);
    ctx.lineTo(sealX, sealY + sealR + 42);
    ctx.lineTo(sealX + 16, sealY + sealR + 32);
    ctx.lineTo(sealX + 32, sealY + sealR + 42);
    ctx.lineTo(sealX + 16, sealY + sealR - 10);
    ctx.fill();

    // Wax seal circle
    const sealGrad = ctx.createRadialGradient(sealX - 12, sealY - 12, 10, sealX, sealY, sealR);
    sealGrad.addColorStop(0, "#F59E0B");
    sealGrad.addColorStop(0.5, "#D97706");
    sealGrad.addColorStop(0.85, "#B45309");
    sealGrad.addColorStop(1, "#78350F");

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Seal inner ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR - 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 9px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFIED", sealX, sealY - 14);
    ctx.font = "20px serif";
    ctx.fillText("★ 100% ★", sealX, sealY + 7);
    ctx.font = "bold 8px 'Inter', sans-serif";
    ctx.fillText("PURE HAPPINESS", sealX, sealY + 22);

    // 9. Signatures (Left: Giver, Right: LoveDrop Registry)
    ctx.textAlign = "left";
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(170, 875);
    ctx.lineTo(390, 875);
    ctx.stroke();

    ctx.fillStyle = "#D1264F";
    ctx.font = "italic 28px 'Caveat', cursive, Georgia";
    ctx.fillText(`~ ${sender}`, 180, 860);

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.fillText("CONFERRED WITH LOVE BY (GIVER)", 170, 895);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "9px 'Inter', sans-serif";
    const bdayDateText = data.birthdayDate || data.ourDate || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    ctx.fillText(`Date: ${bdayDateText}`, 170, 912);

    // Right: Registry Stamp
    ctx.textAlign = "right";
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(810, 875);
    ctx.lineTo(1030, 875);
    ctx.stroke();

    ctx.fillStyle = "#B8860B";
    ctx.font = "bold 14px 'Playfair Display', serif";
    ctx.fillText("LoveDrop Birthday Registry", 1030, 860);

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.fillText("OFFICIAL STAMP & VERIFICATION", 1030, 895);

    const certSlug = data.slug ? data.slug.slice(0, 8).toUpperCase() : "ROYAL";
    ctx.fillStyle = "#94A3B8";
    ctx.font = "9px 'Inter', sans-serif";
    ctx.fillText(`Certificate ID: BDAY-2026-${certSlug}`, 1030, 912);

    // 10. Footer Bottom Note
    ctx.textAlign = "center";
    ctx.fillStyle = "#94A3B8";
    ctx.font = "italic 11px Georgia, serif";
    ctx.fillText(
      `Registry No: BDAY-2026-${certSlug}  •  Official Certificate of Birthday Excellence  •  LoveDrop`,
      600,
      978
    );

    // Trigger PNG Download
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeRecipient = recipient.replace(/[^a-zA-Z0-9_-]/g, "_");
      const safeSender = sender.replace(/[^a-zA-Z0-9_-]/g, "_");
      link.download = `Birthday_Certificate_${safeRecipient}_from_${safeSender}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Certificate download error:", e);
    } finally {
      setIsGeneratingCert(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-180px)] flex flex-col items-center justify-center px-4 pt-4 sm:pt-6 pb-12 select-none">
      <motion.div
        className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border text-center relative z-10"
        style={{ borderColor: BD.cardBorder, boxShadow: BD.cardShadow }}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Top Tag */}
        <p
          className="text-xs font-bold tracking-[0.22em] uppercase mb-1.5"
          style={{ color: BD.primary }}
        >
          WISH MADE &amp; CELEBRATED
        </p>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-normal font-serif leading-tight mb-1"
          style={{ color: BD.text }}
        >
          Happy birthday, {recipient}!
        </h1>

        {/* Cursive Subtitle */}
        <p className="text-2xl sm:text-3xl font-light font-cursive mb-4" style={{ color: BD.primary }}>
          With all my love ~ {sender} 💖
        </p>

        {/* Centered Cake Illustration with Multiply Blend */}
        <div className="relative my-2 flex items-center justify-center">
          <motion.img
            src="/themes/birthday/cover/cake-wide.webp"
            alt="Celebration Cake"
            className="w-[200px] sm:w-[260px] max-h-[220px] object-contain select-none pointer-events-none"
            style={{
              mixBlendMode: "multiply",
              WebkitMaskImage:
                "radial-gradient(ellipse at 50% 50%, black 55%, rgba(0,0,0,0.85) 75%, transparent 97%)",
              maskImage:
                "radial-gradient(ellipse at 50% 50%, black 55%, rgba(0,0,0,0.85) 75%, transparent 97%)",
            }}
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Birthday Blessing Card */}
        <div
          className="rounded-2xl p-4 my-3 border text-center"
          style={{
            backgroundColor: "rgba(255, 248, 241, 0.7)",
            borderColor: "rgba(209, 38, 79, 0.15)",
          }}
        >
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: BD.text }}>
            May every single day ahead bring you endless joy, radiant health, unforgettable smiles, and dreams fulfilled. Keep shining as bright as you always do!
          </p>
        </div>

        {/* 4 Celebration Attribute Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {[
            { emoji: "🎂", text: "Sweet Cake" },
            { emoji: "🎈", text: "Big Smiles" },
            { emoji: "⭐", text: "Dreams Fulfilled" },
            { emoji: "💖", text: "Endless Love" },
          ].map((b, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 shadow-xs"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: BD.cardBorder,
                color: BD.text,
              }}
            >
              <span>{b.emoji}</span>
              <span>{b.text}</span>
            </span>
          ))}
        </div>

        {/* 📜 Official Birthday Certificate of Awesomeness Card */}
        <div
          className="rounded-2xl p-4 sm:p-5 my-4 border relative overflow-hidden text-center shadow-md"
          style={{
            background: "linear-gradient(135deg, #FFFBF5 0%, #FFF0F4 50%, #FDF2F8 100%)",
            borderColor: "rgba(209, 38, 79, 0.28)",
          }}
        >
          {/* Top Gold Ribbon Tag */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full text-amber-800 bg-amber-100/90 border border-amber-300 shadow-2xs">
              📜 Official Birthday Certificate
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif mb-1" style={{ color: BD.text }}>
            Certificate of Awesomeness
          </h3>
          <p className="text-xs text-slate-600 mb-3 max-w-sm mx-auto leading-relaxed">
            An official royal decree honoring <strong className="text-[#D1264F]">{recipient}</strong> on this special birthday, presented with infinite love by <strong className="text-slate-800">{sender}</strong>.
          </p>

          {/* Certificate Mini Preview Box */}
          <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-white/80 mb-3.5 flex flex-col items-center gap-1.5 text-xs">
            <div className="flex items-center justify-between w-full text-[11px] text-slate-500 font-mono border-b pb-1">
              <span>REG: BDAY-ROYAL-{data.slug ? data.slug.slice(0, 6).toUpperCase() : "2026"}</span>
              <span className="text-emerald-600 font-bold">✓ 100% VERIFIED</span>
            </div>
            <p className="font-serif text-base font-bold text-[#D1264F] mt-0.5">
              {recipient} • Certified Birthday Star 🌟
            </p>
            <p className="text-[11px] text-slate-500 italic">
              Conferred &amp; Sealed with all our heart by ~ <span className="font-semibold text-slate-700">{sender}</span>
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-800 font-semibold flex-wrap justify-center">
              <span>⭐ Infinite Joy</span>
              <span>•</span>
              <span>💖 Lifetime Hugs</span>
              <span>•</span>
              <span>🎂 Sweet Memories</span>
            </div>
          </div>

          {/* Download Certificate Button */}
          <motion.button
            onClick={handleDownloadCertificate}
            disabled={isGeneratingCert}
            className="w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #D1264F 0%, #E11D48 60%, #BE123C 100%)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span>
              {isGeneratingCert ? "Rendering High-Res Certificate..." : "Download Birthday Certificate 📜"}
            </span>
          </motion.button>
          <p className="text-[10px] text-slate-500 mt-2">
            Includes high-resolution keepsake, 3 photo memories, gold wax seal &amp; signatures!
          </p>
        </div>

        {/* Revisit Chapters Row */}
        <div className="border-t pt-3 pb-2 mb-4" style={{ borderColor: "rgba(58,35,64,0.08)" }}>
          <p className="text-[11px] font-bold tracking-wider uppercase mb-2.5" style={{ color: BD.textMuted }}>
            Revisit any memory
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: 1, icon: "/themes/birthday/icons/1-envelope.webp", label: "Letter" },
              { id: 2, icon: "/themes/birthday/icons/2-balloons.svg", label: "Balloons" },
              { id: 3, icon: "/themes/birthday/icons/3-story.webp", label: "Story" },
              { id: 4, icon: "/themes/birthday/icons/4-wishes.webp", label: "Wishes" },
              { id: 5, icon: "/themes/birthday/icons/5-photos.webp", label: "Moments" },
              { id: 6, icon: "/themes/birthday/icons/6-places.webp", label: "Places" },
              { id: 7, icon: "/themes/birthday/icons/7-calendar.webp", label: "Calendar" },
              { id: 8, icon: "/themes/birthday/icons/8-music.webp", label: "Song" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onJumpTo(item.id)}
                className="w-9 h-9 rounded-full bg-stone-50 border p-1.5 shadow-xs hover:scale-110 hover:bg-pink-50 transition-all flex items-center justify-center"
                style={{ borderColor: BD.cardBorder }}
                title={item.label}
              >
                <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Row: Watch Again & Share */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <motion.button
            onClick={onWatchAgain}
            className="w-full sm:w-auto py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border shadow-sm transition-all"
            style={{
              borderColor: BD.cardBorder,
              color: BD.text,
              backgroundColor: "#FFF8F1",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Watch again</span>
          </motion.button>

          <motion.button
            onClick={shareSurprise}
            className="w-full sm:w-auto py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md transition-all"
            style={{
              backgroundColor: BD.primary,
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Share Surprise</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Floating Pill Bottom Navigation Bar ─────────────────────────────────────
const CHAPTER_ICONS = [
  { id: 1, label: "Letter", icon: "/themes/birthday/icons/1-envelope.webp" },
  { id: 2, label: "Balloons", icon: "/themes/birthday/icons/2-balloons.svg" },
  { id: 3, label: "Story", icon: "/themes/birthday/icons/3-story.webp" },
  { id: 4, label: "Wishes", icon: "/themes/birthday/icons/4-wishes.webp" },
  { id: 5, label: "Moments", icon: "/themes/birthday/icons/5-photos.webp" },
  { id: 6, label: "Calendar", icon: "/themes/birthday/icons/7-calendar.webp" },
  { id: 7, label: "Song", icon: "/themes/birthday/icons/8-music.webp" },
  { id: 8, label: "Candles", icon: "/themes/birthday/icons/9-candles.svg" },
  { id: 9, label: "Celebration", icon: "/themes/birthday/icons/10-celebration.webp" },
];

function BottomNavigation({
  currentChapter,
  onNavigate,
}: {
  currentChapter: number;
  onNavigate: (step: number) => void;
}) {
  const canGoPrev = currentChapter > 1;
  const canGoNext = currentChapter < 10;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[96vw] select-none">
      <div
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl backdrop-blur-md border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          borderColor: "rgba(58, 35, 64, 0.15)",
          boxShadow: "0 10px 30px rgba(58, 35, 64, 0.18)",
        }}
      >
        {/* Prev Button */}
        <button
          onClick={() => onNavigate(currentChapter - 1)}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30 hover:bg-slate-100"
          style={{ color: BD.text }}
          title="Previous Chapter"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 10 Chapter Icons with Indicator */}
        <div className="flex items-center gap-1 sm:gap-2 px-1 overflow-x-auto no-scrollbar">
          {CHAPTER_ICONS.map((ch) => {
            const isActive = ch.id === currentChapter;
            return (
              <button
                key={ch.id}
                onClick={() => onNavigate(ch.id)}
                className="group flex flex-col items-center justify-center p-1 relative transition-transform"
                title={ch.label}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? "scale-110 drop-shadow-md" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={ch.icon}
                    alt={ch.label}
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain pointer-events-none"
                  />
                </div>
                {/* Active Indicator Bar / Dot */}
                <div
                  className={`mt-1 transition-all rounded-full ${
                    isActive
                      ? "w-4 h-1 bg-[#D1264F]"
                      : "w-1 h-1 bg-gray-300 group-hover:bg-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <span
          className="text-xs font-semibold px-1 min-w-[36px] text-center"
          style={{ color: BD.text }}
        >
          {currentChapter}/10
        </span>

        {/* Next Button */}
        <button
          onClick={() => onNavigate(currentChapter + 1)}
          disabled={!canGoNext}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40"
          style={{
            backgroundColor: BD.primary,
          }}
          title="Next Chapter"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main BirthdayTemplate Export ───────────────────────────────────────────
interface BirthdayTemplateProps {
  data: BirthdayData;
}

export default function BirthdayTemplate({ data }: BirthdayTemplateProps) {
  const [started, setStarted] = useState(false);
  const [chapter, setChapter] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background Audio Controller
  useEffect(() => {
    const audioTrack = data.bgMusic === "summer-guitar" ? "/music/summer-gouyad-5.mp3" : "/music/love-bgm.mp3";
    const audio = new Audio(audioTrack);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const tryAutoPlay = () => {
      audio.play().catch(() => {});
    };

    document.addEventListener("click", tryAutoPlay, { once: true });
    document.addEventListener("touchstart", tryAutoPlay, { once: true });

    return () => {
      audio.pause();
      audioRef.current = null;
      document.removeEventListener("click", tryAutoPlay);
    };
  }, [data.bgMusic]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isAudioMuted) {
      audioRef.current.play().catch(() => {});
      setIsAudioMuted(false);
    } else {
      audioRef.current.pause();
      setIsAudioMuted(true);
    }
  };

  const toggleTurntablePlay = () => {
    if (!audioRef.current) return;
    if (isPlayingSong) {
      audioRef.current.pause();
      setIsPlayingSong(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingSong(true);
      setIsAudioMuted(false);
    }
  };

  const handleOpenGift = () => {
    setStarted(true);
    setChapter(1);
    if (audioRef.current && !isAudioMuted) {
      audioRef.current.play().catch(() => {});
    }
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.8 } });
  };

  const handleWatchAgain = () => {
    setChapter(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render Scene by chapter
  const renderCurrentScene = () => {
    const handleNext = () => {
      setChapter((prev) => Math.min(9, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    switch (chapter) {
      case 1:
        return <SceneLetter data={data} onNext={handleNext} />;
      case 2:
        return <SceneBalloons data={data} onNext={handleNext} />;
      case 3:
        return <SceneOurStory data={data} onNext={handleNext} />;
      case 4:
        return <SceneWishesJar data={data} onNext={handleNext} />;
      case 5:
        return <ScenePhotobooth data={data} onNext={handleNext} />;
      case 6:
        return <SceneCalendar data={data} onNext={handleNext} />;
      case 7:
        return (
          <SceneVinylPlayer
            data={data}
            isPlaying={isPlayingSong}
            onTogglePlay={toggleTurntablePlay}
            onNext={handleNext}
          />
        );
      case 8:
        return (
          <SceneBlowCandles
            data={data}
            onBlown={() => setChapter(9)}
            onNext={handleNext}
          />
        );
      case 9:
        return (
          <SceneFinale
            data={data}
            onWatchAgain={handleWatchAgain}
            onJumpTo={(ch) => setChapter(ch)}
          />
        );
      default:
        return <SceneLetter data={data} onNext={handleNext} />;
    }
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden font-sans"
      style={{
        background: BD.bgGradient,
        color: BD.text,
      }}
    >
      {/* Import Serif and Cursive Fonts for authentic typography */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Caveat:wght@400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-serif {
          font-family: 'Playfair Display', 'Abril Fatface', Georgia, serif;
        }
        .font-cursive {
          font-family: 'Caveat', 'Segoe Script', cursive;
        }
        .font-sans {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        /* Hide scrollbars for pill nav */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Floating Confetti Sprinkles */}
      <FloatingSprinkles />

      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-3.5 pointer-events-none">
        {/* Left: Brand Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: BD.primary }}
          >
            🎂
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: BD.text }}>
            Birthday Party
          </span>
        </div>

        {/* Right: Sound / Equalizer Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-sm border flex items-center justify-center hover:scale-105 transition-all"
            style={{ borderColor: "rgba(58, 35, 64, 0.12)", color: BD.text }}
            title={isAudioMuted ? "Unmute music" : "Mute music"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-gray-400" />
            ) : (
              <Volume2 className="w-4 h-4" style={{ color: BD.primary }} />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {!started ? (
        <SceneLanding data={data} onOpen={handleOpenGift} />
      ) : (
        <main className="relative pt-20 sm:pt-24 pb-32 min-h-[100dvh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {renderCurrentScene()}
            </motion.div>
          </AnimatePresence>

          {/* Floating Pill Bottom Navigation Bar */}
          <BottomNavigation
            currentChapter={chapter}
            onNavigate={(newChapter) => {
              if (newChapter >= 1 && newChapter <= 9) {
                setChapter(newChapter);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          />
        </main>
      )}
    </div>
  );
}
