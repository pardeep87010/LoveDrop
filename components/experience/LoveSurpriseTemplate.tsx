"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FastForward,
  Check,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";
import { LoveSurpriseData } from "@/lib/types";

interface LoveSurpriseTemplateProps {
  data?: Partial<LoveSurpriseData>;
  isEmbedded?: boolean;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const DEFAULT_MEMORIES = [
  {
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=80",
    caption: "Our first date at the coffee shop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1000&auto=format&fit=crop&q=80",
    caption: "That spontaneous weekend road trip",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1000&auto=format&fit=crop&q=80",
    caption: "The night we couldn't stop talking under the stars",
  },
];

const NINE_REASONS = [
  { id: 1, emoji: "😊", title: "Your smile" },
  { id: 2, emoji: "💕", title: "Your kindness" },
  { id: 3, emoji: "😂", title: "Your laugh" },
  { id: 4, emoji: "🙏", title: "Your patience" },
  { id: 5, emoji: "🤗", title: "Your hugs" },
  { id: 6, emoji: "👫", title: "Being my best friend" },
  { id: 7, emoji: "🌟", title: "Your support" },
  { id: 8, emoji: "✨", title: "Being you" },
  { id: 9, emoji: "🎨", title: "Your creativity" },
];

export default function LoveSurpriseTemplate({
  data,
  isEmbedded = false,
  onClose,
  onToggleFullscreen,
  isFullscreen = false,
}: LoveSurpriseTemplateProps) {
  const recipientName = data?.recipientName || "Sarah";
  const senderName = data?.senderName || "Your Love";
  const customQuestion = data?.question || "Do you love me?";

  const letterFullText =
    data?.letterContent ||
    data?.letterText ||
    `My dearest ${recipientName},\n\nFrom the moment I met you, my life changed in ways I never expected. Your smile has become my favorite sight, your laugh my favorite sound.\n\nEvery day with you feels like an adventure, and I can't imagine my life without you by my side. You make the ordinary extraordinary.\n\nI love you more than words could ever express, but I'm going to try anyway through this letter.\n\nForever yours,\n${senderName} 💕`;

  // Step state (1 to 5)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // -------------------------------------------------------------
  // PAGE 1: INTRO TYPING STATE
  // "Hello" -> erase -> "Yes, You" -> erase -> "Name" -> erase -> show card
  // -------------------------------------------------------------
  const [introPhase, setIntroPhase] = useState<
    | "typing-hello"
    | "erasing-hello"
    | "typing-yes-you"
    | "erasing-yes-you"
    | "typing-name"
    | "erasing-name"
    | "card-revealed"
  >("typing-hello");
  const [typedIntroText, setTypedIntroText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const helloWord = "Hello";
    const yesYouWord = "Yes, You";
    const nameWord = recipientName;

    if (introPhase === "typing-hello") {
      if (typedIntroText.length < helloWord.length) {
        timeout = setTimeout(() => {
          setTypedIntroText(helloWord.slice(0, typedIntroText.length + 1));
        }, 110);
      } else {
        timeout = setTimeout(() => setIntroPhase("erasing-hello"), 700);
      }
    } else if (introPhase === "erasing-hello") {
      if (typedIntroText.length > 0) {
        timeout = setTimeout(() => {
          setTypedIntroText(typedIntroText.slice(0, -1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIntroPhase("typing-yes-you"), 300);
      }
    } else if (introPhase === "typing-yes-you") {
      if (typedIntroText.length < yesYouWord.length) {
        timeout = setTimeout(() => {
          setTypedIntroText(yesYouWord.slice(0, typedIntroText.length + 1));
        }, 110);
      } else {
        timeout = setTimeout(() => setIntroPhase("erasing-yes-you"), 700);
      }
    } else if (introPhase === "erasing-yes-you") {
      if (typedIntroText.length > 0) {
        timeout = setTimeout(() => {
          setTypedIntroText(typedIntroText.slice(0, -1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIntroPhase("typing-name"), 300);
      }
    } else if (introPhase === "typing-name") {
      if (typedIntroText.length < nameWord.length) {
        timeout = setTimeout(() => {
          setTypedIntroText(nameWord.slice(0, typedIntroText.length + 1));
        }, 110);
      } else {
        timeout = setTimeout(() => setIntroPhase("erasing-name"), 800);
      }
    } else if (introPhase === "erasing-name") {
      if (typedIntroText.length > 0) {
        timeout = setTimeout(() => {
          setTypedIntroText(typedIntroText.slice(0, -1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIntroPhase("card-revealed"), 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [introPhase, typedIntroText, recipientName]);

  const skipIntro = () => {
    soundFx.playPop();
    setIntroPhase("card-revealed");
  };

  // -------------------------------------------------------------
  // PAGE 2: RUNAWAY "NO" BUTTON & PROGRESSIVE YES GROWTH
  // -------------------------------------------------------------
  const [noAttempts, setNoAttempts] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);

  const noPhrases = [
    "No 💔",
    "Really?! 😳",
    "Are you sure ? 🥺",
    `But ${recipientName}... 🥺`,
    "Think Again! 😜",
    "Don't do this to me! 😭",
    `${recipientName} please! 🥺`,
    "Come onnnn 😩",
    "Pretty please? 🥺",
    `I made this for you ${recipientName}! 🎁`,
    "With a cherry on top? 🍒",
    "You're breaking my heart! 💔",
    "I'll be sad forever! 😢",
    "Noooooo 😭",
    "Fine, I'll just cry 😭",
    `${recipientName} I'm begging! 🧎`,
    "My heart can't take this! 💔",
    "You wouldn't... right? 🥺🥺",
    "I'm literally shaking rn 🫨",
    `SAY YES ${recipientName.toUpperCase()}! 😤`,
    "Broken 💔💔💔",
    "I'll never recover 🥀",
    "This is fine.... 🥲🙃",
    "😭😭😭😭😭",
  ];

  const handleNoDodge = () => {
    soundFx.playPop();
    const nextAttempts = noAttempts + 1;
    setNoAttempts(nextAttempts);

    // Random displacement within card boundaries
    const maxOffset = 110;
    const rx = (Math.random() - 0.5) * (maxOffset * 2);
    const ry = (Math.random() - 0.5) * (maxOffset * 1.4);
    setNoButtonPos({ x: rx, y: ry });
  };

  const handleYesClick = () => {
    soundFx.playSuccessChime();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#FF2E63", "#FF6B8B", "#FFD166", "#FF007A"],
    });
    setStep3SubStep("transition");
    setStep(3);
  };

  // -------------------------------------------------------------
  // PAGE 3: CELEBRATION (3.1) & LOVE LETTER TYPEWRITER (3.2)
  // -------------------------------------------------------------
  const [step3SubStep, setStep3SubStep] = useState<"transition" | "letter">("transition");
  const [letterTypedLength, setLetterTypedLength] = useState(0);
  const [isTypingLetter, setIsTypingLetter] = useState(true);

  // Auto advance from 3.1 celebration to 3.2 love letter
  useEffect(() => {
    if (step === 3 && step3SubStep === "transition") {
      const timer = setTimeout(() => {
        setStep3SubStep("letter");
        setLetterTypedLength(0);
        setIsTypingLetter(true);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [step, step3SubStep]);

  // Letter typing interval
  useEffect(() => {
    if (step === 3 && step3SubStep === "letter" && isTypingLetter) {
      if (letterTypedLength < letterFullText.length) {
        const timer = setTimeout(() => {
          setLetterTypedLength((prev) => prev + 1);
        }, 22);
        return () => clearTimeout(timer);
      } else {
        setIsTypingLetter(false);
      }
    }
  }, [step, step3SubStep, isTypingLetter, letterTypedLength, letterFullText]);

  const handleSkipLetterTyping = () => {
    soundFx.playPop();
    setLetterTypedLength(letterFullText.length);
    setIsTypingLetter(false);
  };

  // -------------------------------------------------------------
  // PAGE 4: PHOTO MEMORIES CAROUSEL
  // -------------------------------------------------------------
  const memoryPhotos =
    data?.photos && data.photos.length > 0
      ? data.photos.map((p, idx) => ({
          image: p,
          caption: DEFAULT_MEMORIES[idx % DEFAULT_MEMORIES.length].caption,
        }))
      : DEFAULT_MEMORIES;

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  const prevPhoto = () => {
    soundFx.playPop();
    setCurrentPhotoIdx((prev) => (prev === 0 ? memoryPhotos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    soundFx.playPop();
    setCurrentPhotoIdx((prev) => (prev === memoryPhotos.length - 1 ? 0 : prev + 1));
  };

  // -------------------------------------------------------------
  // PAGE 5: 3D FLIP CARDS (9 REASONS)
  // -------------------------------------------------------------
  const [revealedReasons, setRevealedReasons] = useState<number[]>([]);

  const toggleReasonFlip = (id: number) => {
    soundFx.playPop();
    setRevealedReasons((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length === 5) {
        soundFx.playSuccessChime();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FF2E63", "#FFD166"],
        });
      }
      return next;
    });
  };

  // Restart handler
  const handleRestart = () => {
    soundFx.playPop();
    setStep(1);
    setIntroPhase("typing-hello");
    setTypedIntroText("");
    setNoAttempts(0);
    setNoButtonPos(null);
    setRevealedReasons([]);
    setCurrentPhotoIdx(0);
    setStep3SubStep("transition");
  };

  return (
    <div
      className={`relative w-full ${
        isEmbedded
          ? "min-h-[640px] sm:min-h-[700px] rounded-3xl overflow-hidden border border-pink-100 shadow-xl"
          : "min-h-screen"
      } bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] flex flex-col justify-between p-4 sm:p-6 selection:bg-pink-100 select-none font-sans`}
    >
      {/* Floating ambient hearts in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        <span className="absolute top-[18%] left-[8%] text-pink-300 text-lg opacity-60 animate-bounce duration-3000">
          💖
        </span>
        <span className="absolute top-[28%] right-[10%] text-pink-300 text-base opacity-50 animate-pulse duration-2500">
          💕
        </span>
        <span className="absolute top-[65%] left-[12%] text-rose-300 text-sm opacity-40">
          💗
        </span>
        <span className="absolute top-[52%] right-[14%] text-pink-400 text-lg opacity-50 animate-bounce duration-4000">
          💓
        </span>
        <span className="absolute top-[82%] right-[22%] text-rose-300 text-xs opacity-40">
          ✨
        </span>
      </div>

      {/* =============================================================== */}
      {/* TOP HEADER: 15-DOT PAGINATION + RESET + CLOSE ICONS */}
      {/* =============================================================== */}
      <div className="relative z-10 w-full flex items-center justify-between max-w-2xl mx-auto">
        <div className="w-16" />

        {/* 15 Pagination Dots matching reference screenshots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: 15 }).map((_, idx) => {
            const dotNum = idx + 1;
            const isCompleted = step > dotNum;
            const isCurrent = step === dotNum;

            return (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? "w-2.5 h-2.5 bg-[#FF2E63] scale-125 shadow-xs"
                    : isCompleted
                    ? "w-2 h-2 bg-[#FF2E63]/70"
                    : "w-1.5 h-1.5 bg-[#FCE9F4]"
                }`}
              />
            );
          })}
        </div>

        {/* Top Right Controls: Restart & Close (only 2 buttons, exactly matching media_1791135826504.png) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleRestart}
            title="Restart experience"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-pink-50 border border-pink-100/90 shadow-sm text-slate-600 hover:text-[#FF2E63] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-pink-50 border border-pink-100/90 shadow-sm text-slate-600 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =============================================================== */}
      {/* MAIN CARD STAGE CONTAINER */}
      {/* =============================================================== */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-4 sm:my-6">
        <AnimatePresence mode="wait">
          {/* =========================================================== */}
          {/* PAGE 1: WELCOME CARD & TYPING INTRO (media_1791134834458.png) */}
          {/* =========================================================== */}
          {step === 1 && (
            <div key="step-1" className="w-full max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 shadow-xl shadow-pink-900/5 border border-pink-100/70 text-center space-y-4"
              >
                {/* Top Golden Badge: Special! */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <span>🎉</span>
                  <span>Special!</span>
                  <span>🎉</span>
                </div>

                {/* Sparkling Heart Mascot */}
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-amber-400 text-base font-bold">✨</span>
                  <div className="w-12 h-12 rounded-2xl bg-pink-100/80 text-[#FF2E63] flex items-center justify-center shadow-inner">
                    <Heart className="w-7 h-7 fill-[#FF2E63] text-[#FF2E63]" />
                  </div>
                  <span className="text-amber-400 text-base font-bold">✨</span>
                </div>

                {introPhase !== "card-revealed" ? (
                  /* ======================================================= */
                  /* TYPEWRITER PHASE INSIDE WHITE CARD (media_1791134834458) */
                  /* ======================================================= */
                  <div className="py-4 space-y-3">
                    <div className="min-h-[50px] flex items-center justify-center">
                      <h1 className="text-3xl sm:text-4xl font-black text-[#FF2E63] tracking-tight">
                        {typedIntroText}
                        <span className="inline-block w-0.5 sm:w-1 h-7 sm:h-8 bg-[#FF2E63] ml-1 animate-pulse" />
                      </h1>
                    </div>

                    <div>
                      <button
                        id="skip-intro-btn"
                        type="button"
                        onClick={skipIntro}
                        className="text-xs font-semibold text-slate-400 hover:text-[#FF2E63] inline-flex items-center gap-1 transition-colors cursor-pointer pt-2"
                      >
                        <span>Skip intro</span>
                        <FastForward className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ======================================================= */
                  /* REVEALED CARD DETAILS & LET'S GO BUTTON                 */
                  /* ======================================================= */
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-4 pt-1"
                  >
                    {/* Title & Mini Hearts */}
                    <div className="space-y-1.5">
                      <h1 className="text-2xl sm:text-3xl font-black text-[#FF2E63] tracking-tight">
                        Hello, {recipientName}
                      </h1>
                      <div className="flex items-center justify-center gap-1.5 text-xs">
                        <span>💕</span>
                        <span>💖</span>
                        <span>💗</span>
                        <span>💖</span>
                        <span>💕</span>
                      </div>
                    </div>

                    {/* Body Paragraph */}
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xs mx-auto">
                      I&apos;ve been thinking about us a lot lately, and I wanted to create something
                      special just for you. This is my way of showing you how much you mean to me.
                    </p>

                    {/* Subdued Prompt Pill Box */}
                    <div className="py-2.5 px-4 rounded-xl bg-pink-50/50 border border-pink-100/60 text-xs font-medium text-slate-400 italic">
                      Let&apos;s begin...
                    </div>

                    {/* Let's Go Button */}
                    <button
                      id="lets-go-btn"
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setStep(2);
                      }}
                      className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                    >
                      <span>Let&apos;s Go</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}

          {/* =========================================================== */}
          {/* PAGE 2: DO YOU LOVE ME? (media_1791131484804.png) */}
          {/* =========================================================== */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md mx-auto bg-white rounded-[32px] p-8 sm:p-12 shadow-xl shadow-pink-900/5 border border-pink-100/70 text-center space-y-6"
            >
              {/* Center Pink Heart */}
              <div className="w-14 h-14 rounded-full bg-pink-50 text-[#FF2E63] flex items-center justify-center mx-auto shadow-xs">
                <Heart className="w-7 h-7 fill-[#FF2E63] text-[#FF2E63]" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {customQuestion}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {recipientName}, I need to know...
                </p>
              </div>

              {/* Buttons Row with Runaway No & Growing Yes */}
              <div className="relative min-h-[140px] flex items-center justify-center gap-4 pt-4">
                {/* YES Button (Grows with each attempt, stays in back layer) */}
                <motion.button
                  id="yes-btn"
                  type="button"
                  onClick={handleYesClick}
                  animate={{
                    scale: 1 + Math.min(noAttempts * 0.12, 1.8),
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  style={{ zIndex: 10 }}
                  className="px-7 py-3 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm sm:text-base shadow-md shadow-pink-500/25 cursor-pointer relative z-10 whitespace-nowrap active:scale-95"
                >
                  YES! 💖
                </motion.button>

                {/* NO Button (Dodges, cycles text, stays on top layer above YES) */}
                <motion.button
                  id="no-btn"
                  type="button"
                  onMouseEnter={handleNoDodge}
                  onClick={handleNoDodge}
                  animate={{
                    x: noButtonPos ? noButtonPos.x : 0,
                    y: noButtonPos ? noButtonPos.y : 0,
                    rotate: noAttempts >= 5 ? [0, -6, 6, -4, 4, 0] : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    rotate: { repeat: Infinity, duration: 0.3 },
                  }}
                  style={{ zIndex: 30 }}
                  className={`px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200/80 shadow-md cursor-pointer select-none whitespace-nowrap transition-colors relative z-30 ${
                    noAttempts >= 5 ? "ring-2 ring-rose-400" : ""
                  }`}
                >
                  {noPhrases[noAttempts % noPhrases.length]}
                </motion.button>
              </div>

              {noAttempts > 0 && (
                <p className="text-[11px] font-semibold text-rose-400 italic">
                  Hint: There is only one right answer! 😉
                </p>
              )}
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* PAGE 3: 3.1 TRANSITION & 3.2 LOVE LETTER (media_1791132358027.png) */}
          {/* =========================================================== */}
          {step === 3 && step3SubStep === "transition" && (
            <motion.div
              key="step-3-transition"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm mx-auto bg-white rounded-[32px] p-8 sm:p-10 shadow-xl shadow-pink-900/5 border border-pink-100 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-pink-100 text-[#FF2E63] flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8 fill-[#FF2E63]" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">I knew it! 🥰</h2>
              <p className="text-lg font-bold text-[#FF2E63]">You love me ❤️</p>
              <button
                id="open-letter-btn"
                type="button"
                onClick={() => setStep3SubStep("letter")}
                className="pt-2 text-xs font-bold text-slate-400 hover:text-[#FF2E63] underline cursor-pointer"
              >
                Opening your letter...
              </button>
            </motion.div>
          )}

          {step === 3 && step3SubStep === "letter" && (
            <motion.div
              key="step-3-letter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-lg mx-auto space-y-5"
            >
              {/* Vintage Stationery Letter Card */}
              <div className="relative bg-[#FFFEF7] rounded-[32px] p-7 sm:p-9 shadow-xl shadow-pink-900/5 border border-pink-200/60 text-left space-y-4">
                {/* Letter Header with Skip Typing Button */}
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF2E63] mx-auto sm:mx-0">
                    <span>💕</span>
                    <span>Love Letter</span>
                    <span>💕</span>
                  </div>

                  {isTypingLetter && (
                    <button
                      id="skip-typing-btn"
                      type="button"
                      onClick={handleSkipLetterTyping}
                      className="text-[11px] font-semibold text-slate-400 hover:text-[#FF2E63] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Skip typing</span>
                      <FastForward className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Typewritten Text Content */}
                <div className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed whitespace-pre-line min-h-[160px]">
                  {letterFullText.slice(0, letterTypedLength)}
                  {isTypingLetter && (
                    <span className="inline-block w-0.5 h-4 bg-[#FF2E63] ml-0.5 animate-pulse" />
                  )}
                </div>

                {/* Wax Seal Badge in Bottom Right Corner */}
                <div className="flex justify-end pt-2">
                  <div className="w-11 h-11 rounded-full bg-[#E02656] text-white flex items-center justify-center shadow-md shadow-rose-900/20 border-2 border-rose-300">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center pt-2">
                <button
                  id="continue-letter-btn"
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setStep(4);
                  }}
                  className="px-10 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Continue</span>
                  <span>💕</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* PAGE 4: OUR MEMORIES CAROUSEL (media_1791132434864.png) */}
          {/* =========================================================== */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl mx-auto space-y-4 text-center"
            >
              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#FF2E63] tracking-tight">
                  Our Memories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Swipe through our special moments
                </p>
              </div>

              {/* Photo Card Container with Arrows */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-pink-100 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memoryPhotos[currentPhotoIdx].image}
                  alt={memoryPhotos[currentPhotoIdx].caption}
                  className="w-full h-72 sm:h-96 object-cover"
                />

                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#FF2E63] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#FF2E63] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-left">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {memoryPhotos[currentPhotoIdx].caption}
                  </p>
                </div>
              </div>

              {/* Dots and Counter */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {memoryPhotos.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => {
                      soundFx.playPop();
                      setCurrentPhotoIdx(i);
                    }}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      i === currentPhotoIdx ? "w-6 bg-[#FF2E63]" : "w-2 bg-[#FCE9F4]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] font-semibold text-slate-400">
                {currentPhotoIdx + 1} / {memoryPhotos.length}
              </p>

              {/* Continue to Page 5 */}
              <div className="pt-2">
                <button
                  id="continue-memories-btn"
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setStep(5);
                  }}
                  className="px-9 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Why I Love You</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* PAGE 5: 3D FLIP CARDS (media_1791132483965.png) */}
          {/* =========================================================== */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl mx-auto space-y-4 text-center"
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 text-sm">
                  <span>✨</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#FF2E63] tracking-tight">
                    Why I Love You
                  </h2>
                  <span>✨</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Tap to reveal (at least 5 to continue)
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-pink-50 text-[11px] font-bold text-[#FF2E63]">
                  {revealedReasons.length} / 5 revealed
                </div>
              </div>

              {/* 3x3 Grid of 9 3D Flip Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md mx-auto pt-1">
                {NINE_REASONS.map((item) => {
                  const isFlipped = revealedReasons.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      id={`card-flip-${item.id}`}
                      onClick={() => toggleReasonFlip(item.id)}
                      className="aspect-square cursor-pointer"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="relative w-full h-full rounded-2xl shadow-xs transition-transform duration-500"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* FRONT FACE (Unrevealed: White card with pink heart outline) */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-white border border-pink-100 flex items-center justify-center shadow-xs"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <Heart className="w-6 h-6 text-pink-300 stroke-[1.8]" />
                        </div>

                        {/* BACK FACE (Revealed: Soft pink background with emoji and reason text) */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-[#FFF0F3] border border-pink-200 p-2 flex flex-col items-center justify-center text-center shadow-xs"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <span className="text-base sm:text-lg mb-1">{item.emoji}</span>
                          <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-800 leading-tight">
                            {item.title}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Revealed Reasons Tray */}
              <div className="p-3 rounded-2xl bg-white/90 border border-pink-100/70 text-left max-w-md mx-auto space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Reasons revealed:
                </span>
                {revealedReasons.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Tap any card above to reveal</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {revealedReasons.map((id) => {
                      const reason = NINE_REASONS.find((r) => r.id === id);
                      if (!reason) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[10px] font-bold text-[#FF2E63]"
                        >
                          <span>{reason.emoji}</span>
                          <span>{reason.title}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Action Button */}
              <div className="pt-2">
                {revealedReasons.length < 5 ? (
                  <button
                    type="button"
                    disabled
                    className="px-8 py-3 rounded-full bg-pink-100/70 text-pink-300 font-extrabold text-xs cursor-not-allowed"
                  >
                    Reveal {5 - revealedReasons.length} more to continue
                  </button>
                ) : (
                  <button
                    id="finish-flipcards-btn"
                    type="button"
                    onClick={() => {
                      soundFx.playSuccessChime();
                      confetti({
                        particleCount: 60,
                        spread: 70,
                        origin: { y: 0.7 },
                        colors: ["#FF2E63", "#FF6B8B"],
                      });
                      alert("🎉 You've completed the 5-page demo! More chapters unlocking soon!");
                    }}
                    className="px-9 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>All 5 Revealed! Complete</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =============================================================== */}
      {/* BOTTOM FOOTER: CURRENT STEP INDICATOR (e.g. "1 / 15") */}
      {/* =============================================================== */}
      <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 z-10 pointer-events-none">
        <span className="text-[11px] font-bold text-pink-400 bg-white/90 px-2.5 py-0.5 rounded-full border border-pink-100 shadow-2xs">
          {step} / 15
        </span>
      </div>
    </div>
  );
}
