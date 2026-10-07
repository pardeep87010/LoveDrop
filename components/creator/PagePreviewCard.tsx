"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  Music,
  Star,
  FastForward,
  Play,
  Smartphone,
  Eye,
  Link2,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";

interface PagePreviewCardProps {
  step: number;
  recipientName: string;
  senderName: string;
  typingWord1?: string;
  typingWord2?: string;
  buttonText?: string;
  question: string;
  yesButtonText?: string;
  dodgePhrases?: string[];
  letterText: string;
  waxSealEmoji?: string;
  photos: { image: string; caption: string }[];
  reasons: { id: number; emoji: string; title: string }[];
  milestones: { icon: string; date: string; title: string; description: string }[];
  quizQuestions: { id: number; question: string; options: string[]; correct: string }[];
  fortuneQuotes: string[];
  themeColor?: string;
  themeBg?: string;
  enablePin?: boolean;
  secretPin?: string;
  bgMusic?: string;
  onStepChange?: (step: number) => void;
}

export default function PagePreviewCard({
  step,
  recipientName,
  senderName,
  typingWord1 = "Hello",
  typingWord2 = "Yes, You",
  buttonText = "Let's Go",
  question,
  yesButtonText = "YES! ❤️",
  dodgePhrases = [
    "Really?! 😳",
    "Are you sure ? 🥺",
    "Think Again! 😜",
    "Don't do this to me! 😭",
    "Come onnnn 😩",
    "Pretty please? 🥺",
  ],
  letterText,
  waxSealEmoji = "💌",
  photos,
  reasons,
  milestones,
  quizQuestions,
  fortuneQuotes,
  themeColor = "#FF2E63",
  themeBg = "#FFF0F4",
  enablePin = false,
  secretPin = "",
  bgMusic = "romantic-lofi",
  onStepChange,
}: PagePreviewCardProps) {
  // Sync preview step with wizard step
  const [previewStep, setPreviewStep] = useState(step);

  // ALWAYS sync previewStep whenever parent step changes (e.g. user clicks Continue to Page X)
  useEffect(() => {
    setPreviewStep(step);
  }, [step]);

  // Navigate to step in both phone preview and wizard
  const navigateToStep = (s: number) => {
    soundFx.playPop();
    setPreviewStep(s);
    if (onStepChange) {
      onStepChange(s);
    }
  };

  // ===================================================================
  // STEP 1: INTRO TYPING STATE
  // ===================================================================
  const [introPhase, setIntroPhase] = useState<"typing" | "revealed">("revealed");
  const [typedText, setTypedText] = useState(recipientName || "Sarah");

  // Re-run typing animation if triggered
  const triggerTypingReplay = () => {
    soundFx.playPop();
    setIntroPhase("typing");
    setTypedText("");

    const sequence = [typingWord1, typingWord2, recipientName || "Sarah"];
    let seqIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const interval = setInterval(() => {
      const currentWord = sequence[seqIdx] || "Sarah";
      if (!isDeleting) {
        if (charIdx <= currentWord.length) {
          setTypedText(currentWord.slice(0, charIdx));
          charIdx++;
        } else {
          if (seqIdx < sequence.length - 1) {
            isDeleting = true;
          } else {
            clearInterval(interval);
            setTimeout(() => setIntroPhase("revealed"), 500);
          }
        }
      } else {
        if (charIdx > 0) {
          charIdx--;
          setTypedText(currentWord.slice(0, charIdx));
        } else {
          isDeleting = false;
          seqIdx++;
        }
      }
    }, 90);
  };

  // ===================================================================
  // STEP 2: RUNAWAY "NO" BUTTON STATE
  // ===================================================================
  const [noEscapeCount, setNoEscapeCount] = useState(0);
  const [noButtonOffset, setNoButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleNoDodge = () => {
    soundFx.playPop();
    setNoEscapeCount((prev) => prev + 1);
    // Random position within phone screen bounds (-90px to +90px x, -80px to +80px y)
    const rx = (Math.random() - 0.5) * 160;
    const ry = (Math.random() - 0.5) * 120;
    setNoButtonOffset({ x: rx, y: ry });
  };

  const handleYesClick = () => {
    soundFx.playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: [themeColor, "#FF6B8B", "#FFD166"],
    });
    navigateToStep(3);
  };

  // Current dodge phrase based on escape count
  const currentDodgePhrase =
    dodgePhrases.length > 0
      ? dodgePhrases[(noEscapeCount - 1) % dodgePhrases.length] || "No 💔"
      : "No 💔";

  // ===================================================================
  // STEP 4: PHOTO MEMORIES CAROUSEL STATE
  // ===================================================================
  const [photoIndex, setPhotoIndex] = useState(0);

  const prevPhoto = () => {
    soundFx.playPop();
    setPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    soundFx.playPop();
    setPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // ===================================================================
  // STEP 5: REASONS I LOVE YOU FLIP STATE
  // ===================================================================
  const [flippedReasons, setFlippedReasons] = useState<number[]>([]);

  const toggleReasonFlip = (id: number) => {
    soundFx.playPop();
    setFlippedReasons((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ===================================================================
  // STEP 6: OUR STORY / MILESTONES STATE
  // ===================================================================
  const [milestoneIndex, setMilestoneIndex] = useState(0);

  // ===================================================================
  // STEP 7: QUIZ STATE
  // ===================================================================
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectQuizOption = (option: string) => {
    if (selectedQuizOption) return;
    setSelectedQuizOption(option);

    const currentQ = quizQuestions[quizIndex];
    const isCorrect = option === currentQ?.correct;

    if (isCorrect) {
      soundFx.playSuccessChime();
      setQuizScore((prev) => prev + 1);
    } else {
      soundFx.playPop();
    }

    setTimeout(() => {
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex((prev) => prev + 1);
        setSelectedQuizOption(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1100);
  };

  const resetQuiz = () => {
    soundFx.playPop();
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // ===================================================================
  // STEP 8: FORTUNE COOKIES STATE
  // ===================================================================
  const [openedCookieIdx, setOpenedCookieIdx] = useState<number | null>(null);

  const handleCrackCookie = (idx: number) => {
    soundFx.playSuccessChime();
    setOpenedCookieIdx(idx);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#FBBF24", "#F59E0B", themeColor],
    });
  };

  // ===================================================================
  // STEP 9: TEST PIN LOCK
  // ===================================================================
  const [enteredPin, setEnteredPin] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  const handlePinPress = (digit: string) => {
    soundFx.playPop();
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === secretPin) {
          soundFx.playSuccessChime();
          setPinSuccess(true);
        } else {
          setTimeout(() => setEnteredPin(""), 600);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* =============================================================== */}
      {/* TOP CONTROLS & STEP SELECTOR PILLS                              */}
      {/* =============================================================== */}
      <div className="w-full max-w-[380px] mb-3 px-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-tight">Live Phone Preview</span>
            <span className="text-[10px] text-pink-600 bg-pink-100/90 px-2 py-0.5 rounded-full font-black">
              Page {previewStep}/9
            </span>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-pink-600 border border-pink-200">
            <Link2 className="w-3 h-3" />
            <span>Synced</span>
          </div>
        </div>

        {/* 9 Quick Page Switcher Buttons */}
        <div className="flex items-center justify-between gap-1 p-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-2xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => {
            const isCurrent = previewStep === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => navigateToStep(s)}
                title={`Jump to Page ${s}`}
                className={`flex-1 py-1 text-[11px] font-black rounded-xl transition-all cursor-pointer relative ${
                  isCurrent
                    ? "bg-[#FF2E63] text-white shadow-xs scale-105"
                    : "text-slate-500 hover:text-pink-600 hover:bg-pink-50/60"
                }`}
              >
                <span>{s}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =============================================================== */}
      {/* REALISTIC FLAGSHIP SMARTPHONE HARDWARE MOCKUP                    */}
      {/* Dimensions: 370px width x 720px height (True 9:19.5 aspect ratio)*/}
      {/* =============================================================== */}
      <div className="relative w-[340px] sm:w-[370px] h-[680px] sm:h-[720px] bg-[#0E131C] rounded-[52px] p-2.5 sm:p-3 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5),0_0_35px_rgba(255,46,99,0.15)] border-[4px] border-[#222A3B] ring-1 ring-white/10 flex flex-col justify-between overflow-visible">
        {/* Hardware Side Buttons */}
        {/* Action Button (Left) */}
        <div className="absolute -left-[6px] top-24 w-[3px] h-6 bg-slate-700 rounded-l-xs" />
        {/* Volume Up (Left) */}
        <div className="absolute -left-[6px] top-36 w-[3px] h-11 bg-slate-700 rounded-l-xs" />
        {/* Volume Down (Left) */}
        <div className="absolute -left-[6px] top-52 w-[3px] h-11 bg-slate-700 rounded-l-xs" />
        {/* Power Button (Right) */}
        <div className="absolute -right-[6px] top-40 w-[3px] h-16 bg-slate-700 rounded-r-xs" />

        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 inset-x-0 z-40 flex justify-center pointer-events-none">
          <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-3 shadow-sm border border-slate-900/60">
            <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a1024]" />
          </div>
        </div>

        {/* Screen Display Container */}
        <div
          className="relative w-full h-full rounded-[42px] overflow-hidden flex flex-col justify-between shadow-inner"
          style={{ backgroundColor: themeBg }}
        >
          {/* iOS Top Status Bar */}
          <div className="relative z-30 pt-3 px-5 flex items-center justify-between text-[11px] font-bold text-slate-700 pointer-events-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>📶</span>
              <div className="flex items-center gap-0.5 border border-slate-400 rounded-xs px-1 py-0.2">
                <span className="w-2.5 h-1.5 bg-emerald-500 rounded-2xs inline-block" />
              </div>
            </div>
          </div>

          {/* Floating Ambient Sparkles & Hearts */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 z-0">
            <span className="absolute top-16 left-4 text-pink-400 text-xs">💕</span>
            <span className="absolute top-24 right-5 text-rose-400 text-xs">💖</span>
            <span className="absolute bottom-20 left-6 text-pink-300 text-xs">✨</span>
            <span className="absolute bottom-28 right-6 text-rose-300 text-xs">💗</span>
          </div>

          {/* ============================================================= */}
          {/* SCREEN CONTENT AREA (Scrollable & Responsive)                 */}
          {/* ============================================================= */}
          <div className="relative z-10 flex-1 overflow-y-auto px-3.5 py-2 flex flex-col justify-center scrollbar-none">
            <AnimatePresence mode="wait">
              {/* --------------------------------------------------------- */}
              {/* PAGE 1: WELCOME & INTRO CARD                              */}
              {/* --------------------------------------------------------- */}
              {previewStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[26px] p-5 shadow-lg border border-pink-100 text-center space-y-3.5 relative">
                    {/* Golden Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-black text-[9px] shadow-2xs whitespace-nowrap">
                      🎉 Special! 🎉
                    </div>

                    {/* Sparkling Heart Mascot */}
                    <div className="pt-1 flex items-center justify-center gap-1.5">
                      <span className="text-amber-400 text-xs">✨</span>
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: `${themeColor}15` }}
                      >
                        <Heart className="w-5 h-5 fill-current" style={{ color: themeColor }} />
                      </div>
                      <span className="text-amber-400 text-xs">✨</span>
                    </div>

                    {introPhase === "typing" ? (
                      <div className="py-3 space-y-2">
                        <h4 className="text-xl font-black tracking-tight" style={{ color: themeColor }}>
                          {typedText}
                          <span className="inline-block w-0.5 h-5 bg-current ml-0.5 animate-pulse" />
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">Typing intro...</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-0.5">
                        <h4 className="text-lg font-black tracking-tight text-slate-900">
                          Hello, <span style={{ color: themeColor }}>{recipientName || "Sarah"}</span> 💕
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-1">
                          I wanted to create something special just for you. This is my way of showing
                          you how much you mean to me.
                        </p>
                        <div className="py-1 px-3 rounded-xl bg-pink-50/70 text-[10px] text-slate-400 italic font-medium">
                          Let&apos;s begin...
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(2)}
                      className="w-full py-2.5 rounded-full text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span>{buttonText || "Let's Go"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Replay Typing Animation Link */}
                    {introPhase !== "typing" && (
                      <button
                        type="button"
                        onClick={triggerTypingReplay}
                        className="text-[9px] font-bold text-slate-400 hover:text-pink-600 transition-colors inline-flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Replay Animated Intro</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 2: THE RUNAWAY QUESTION & DODGE NO                   */}
              {/* --------------------------------------------------------- */}
              {previewStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[26px] p-5 shadow-lg border border-pink-100 text-center space-y-4 relative min-h-[280px] flex flex-col justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-inner"
                      style={{ backgroundColor: `${themeColor}15` }}
                    >
                      <Heart
                        className="w-6 h-6 fill-current animate-bounce"
                        style={{ color: themeColor }}
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-black text-slate-900 leading-snug">
                        {question || "do you love me ??"}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Think carefully before answering...
                      </p>
                    </div>

                    {/* Yes & Runaway No Buttons Container */}
                    <div className="relative pt-2 pb-3 min-h-[70px] flex items-center justify-center gap-3">
                      {/* YES BUTTON */}
                      <button
                        type="button"
                        onClick={handleYesClick}
                        className="px-6 py-2.5 rounded-full text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer relative z-10"
                        style={{ backgroundColor: themeColor }}
                      >
                        {yesButtonText || "YES! ❤️"}
                      </button>

                      {/* RUNAWAY "NO" BUTTON */}
                      <motion.button
                        type="button"
                        onMouseEnter={handleNoDodge}
                        onClick={handleNoDodge}
                        animate={{ x: noButtonOffset.x, y: noButtonOffset.y }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs border border-slate-300 shadow-sm cursor-pointer whitespace-nowrap z-20 select-none"
                      >
                        {noEscapeCount === 0 ? "No 💔" : currentDodgePhrase}
                      </motion.button>
                    </div>

                    {noEscapeCount > 0 && (
                      <p className="text-[10px] font-bold text-pink-500 animate-pulse">
                        Dodged {noEscapeCount} time{noEscapeCount > 1 ? "s" : ""}! You have to say YES! 😜
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 3: HEARTFELT LOVE LETTER                             */}
              {/* --------------------------------------------------------- */}
              {previewStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-[#FFFDF9] rounded-[24px] p-4 sm:p-5 shadow-lg border border-amber-200/80 text-left space-y-3 font-serif relative">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{waxSealEmoji || "💌"}</span>
                        <span className="text-[11px] font-sans font-black uppercase tracking-wider text-amber-800">
                          A Letter For You
                        </span>
                      </div>
                      <span className="text-[10px] font-sans text-slate-400 font-semibold">
                        Page 3/9
                      </span>
                    </div>

                    {/* Scrollable Letter Body */}
                    <div className="max-h-[220px] overflow-y-auto pr-1 text-slate-800 font-sans text-[11px] leading-relaxed space-y-2 whitespace-pre-wrap no-scrollbar">
                      {letterText || "My dearest Sarah..."}
                    </div>

                    {/* Sign-off */}
                    <div className="text-right pt-2 border-t border-amber-100 font-sans">
                      <span className="text-[11px] font-bold text-rose-600 block">
                        Forever yours,
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {senderName || "Michael"} 💕
                      </span>
                    </div>

                    {/* Next Page Arrow */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(4)}
                      className="w-full py-2 rounded-xl text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer font-sans"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span>Continue to Memories</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 4: PHOTO MEMORIES GALLERY                            */}
              {/* --------------------------------------------------------- */}
              {previewStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[24px] p-4 shadow-lg border border-pink-100 text-center space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="text-pink-500 font-extrabold uppercase">Our Memories</span>
                      <span>
                        {photoIndex + 1} of {photos.length || 1}
                      </span>
                    </div>

                    {/* Polaroid Photo Frame */}
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          photos[photoIndex]?.image ||
                          "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800"
                        }
                        alt="Memory preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Caption */}
                    <p className="text-[11px] font-bold text-slate-700 min-h-[32px] flex items-center justify-center px-1">
                      {photos[photoIndex]?.caption || "Our favorite moments together"}
                    </p>

                    {/* Carousel Controls */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={prevPhoto}
                        className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-700 text-xs font-bold cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex gap-1">
                        {photos.map((_, idx) => (
                          <span
                            key={idx}
                            onClick={() => setPhotoIndex(idx)}
                            className={`h-1.5 rounded-full cursor-pointer transition-all ${
                              idx === photoIndex
                                ? "w-4 bg-pink-500"
                                : "w-1.5 bg-pink-200 hover:bg-pink-300"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={nextPhoto}
                        className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-700 text-xs font-bold cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Next Step Button */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(5)}
                      className="w-full py-2 rounded-xl text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span>Continue to Reasons</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 5: REASONS I LOVE YOU                                */}
              {/* --------------------------------------------------------- */}
              {previewStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[24px] p-4 shadow-lg border border-pink-100 space-y-2.5">
                    <div className="text-center space-y-0.5">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Reasons I Love You 💕
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Tap each card to reveal: ({flippedReasons.length}/{reasons.length})
                      </p>
                    </div>

                    {/* 3x3 Interactive Grid of Reasons */}
                    <div className="grid grid-cols-3 gap-1.5 max-h-[240px] overflow-y-auto pr-0.5 no-scrollbar">
                      {reasons.map((r, i) => {
                        const isFlipped = flippedReasons.includes(r.id);
                        return (
                          <div
                            key={r.id || i}
                            onClick={() => toggleReasonFlip(r.id)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[60px] ${
                              isFlipped
                                ? "bg-pink-50/90 border-pink-200 shadow-2xs"
                                : "bg-slate-50 border-slate-100 hover:border-pink-200"
                            }`}
                          >
                            <span className="text-base">{r.emoji || "💖"}</span>
                            <span className="text-[9px] font-bold text-slate-700 leading-tight truncate w-full pt-0.5">
                              {r.title || `Reason ${i + 1}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Next Step Button */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(6)}
                      className="w-full py-2 rounded-xl text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span>Continue to Timeline</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 6: OUR STORY / TIMELINE                              */}
              {/* --------------------------------------------------------- */}
              {previewStep === 6 && (
                <motion.div
                  key="step-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[24px] p-4 shadow-lg border border-pink-100 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="text-pink-500 font-black uppercase">Our Love Story</span>
                      <span>
                        {milestoneIndex + 1} of {milestones.length || 1}
                      </span>
                    </div>

                    {/* Active Milestone Display */}
                    <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-center space-y-2">
                      <span className="text-2xl block">
                        {milestones[milestoneIndex]?.icon || "💖"}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {milestones[milestoneIndex]?.date || "Chapter Date"}
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          {milestones[milestoneIndex]?.title || "Our Milestone"}
                        </h4>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 italic bg-white p-2 rounded-xl shadow-2xs">
                        &quot;{milestones[milestoneIndex]?.description || "Special moment we shared"}&quot;
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={milestoneIndex === 0}
                        onClick={() => {
                          soundFx.playPop();
                          setMilestoneIndex((prev) => Math.max(0, prev - 1));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold disabled:opacity-30 cursor-pointer"
                      >
                        Prev
                      </button>

                      <div className="flex gap-1">
                        {milestones.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              i === milestoneIndex ? "w-3 bg-pink-500" : "w-1 bg-pink-200"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={milestoneIndex === milestones.length - 1}
                        onClick={() => {
                          soundFx.playPop();
                          setMilestoneIndex((prev) => Math.min(milestones.length - 1, prev + 1));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold disabled:opacity-30 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>

                    {/* Next Page Button */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(7)}
                      className="w-full py-2 rounded-xl text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span>Continue to Quiz</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 7: LOVE QUIZ                                         */}
              {/* --------------------------------------------------------- */}
              {previewStep === 7 && (
                <motion.div
                  key="step-7"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[24px] p-4 shadow-lg border border-pink-100 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="text-pink-500 font-black uppercase">Love Quiz</span>
                      <span>
                        Question {quizIndex + 1}/{quizQuestions.length}
                      </span>
                    </div>

                    {!quizCompleted ? (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-black text-slate-900 leading-snug">
                          {quizQuestions[quizIndex]?.question || "What's my favorite food?"}
                        </h4>

                        {/* Interactive Quiz Options */}
                        <div className="space-y-1.5">
                          {quizQuestions[quizIndex]?.options.map((opt, i) => {
                            const isSelected = selectedQuizOption === opt;
                            const isCorrect = opt === quizQuestions[quizIndex]?.correct;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleSelectQuizOption(opt)}
                                className={`w-full p-2 rounded-xl text-[10px] font-bold text-left flex items-center justify-between border transition-all cursor-pointer ${
                                  isSelected
                                    ? isCorrect
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400"
                                      : "bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400"
                                    : "bg-slate-50 text-slate-700 border-slate-100 hover:border-pink-200 hover:bg-pink-50/40"
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && (
                                  <span>
                                    {isCorrect ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <X className="w-3.5 h-3.5 text-rose-500" />
                                    )}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-pink-50 text-center space-y-2">
                        <span className="text-2xl">🏆</span>
                        <h4 className="text-xs font-black text-slate-900">Quiz Completed!</h4>
                        <p className="text-[10px] font-bold text-pink-600">
                          Score: {quizScore} / {quizQuestions.length} Correct
                        </p>
                        <button
                          type="button"
                          onClick={resetQuiz}
                          className="px-3 py-1 rounded-full bg-white border border-pink-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                        >
                          Try Again
                        </button>
                      </div>
                    )}

                    {/* Next Page Button */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(8)}
                      className="w-full py-2 rounded-xl text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span>Continue to Fortunes</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 8: FORTUNE COOKIES / PROPHECIES                      */}
              {/* --------------------------------------------------------- */}
              {previewStep === 8 && (
                <motion.div
                  key="step-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[24px] p-4 shadow-lg border border-pink-100 text-center space-y-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-pink-500">
                        Love Fortunes & Prophecies
                      </span>
                      <h4 className="text-xs font-black text-slate-900">
                        Tap a cookie to crack open:
                      </h4>
                    </div>

                    {/* Interactive Fortune Cookies Row */}
                    <div className="flex items-center justify-center gap-2 py-1">
                      {fortuneQuotes.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleCrackCookie(i)}
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                            openedCookieIdx === i
                              ? "bg-amber-100 ring-2 ring-amber-400 scale-110"
                              : "bg-slate-100 hover:bg-pink-50"
                          }`}
                        >
                          {openedCookieIdx === i ? "✨" : "🥠"}
                        </button>
                      ))}
                    </div>

                    {/* Active Quote Card */}
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1.5 min-h-[70px] flex flex-col justify-center">
                      <p className="text-[11px] font-bold text-slate-800 italic leading-snug">
                        &quot;
                        {openedCookieIdx !== null
                          ? fortuneQuotes[openedCookieIdx]
                          : fortuneQuotes[0] || "A lifetime of happiness awaits you two"}
                        &quot;
                      </p>
                      <div className="flex items-center justify-center gap-1 text-[9px] text-amber-500">
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                      </div>
                    </div>

                    {/* Next Page Button */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(9)}
                      className="w-full py-2 rounded-xl text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span>Final Surprise Preview</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --------------------------------------------------------- */}
              {/* PAGE 9: FINALE, PIN PASSCODE GATE & CELEBRATION           */}
              {/* --------------------------------------------------------- */}
              {previewStep === 9 && (
                <motion.div
                  key="step-9"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full my-auto"
                >
                  <div className="bg-white rounded-[24px] p-5 shadow-lg border border-pink-100 text-center space-y-3.5">
                    {enablePin && !pinSuccess ? (
                      /* Secret PIN Lock Test Gate */
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Secret PIN Protected</h4>
                          <p className="text-[10px] text-slate-400">
                            Recipient enters {secretPin ? "••••" : "4-digit PIN"} to open
                          </p>
                        </div>

                        {/* PIN Dots */}
                        <div className="flex justify-center gap-2 py-1">
                          {[0, 1, 2, 3].map((idx) => (
                            <span
                              key={idx}
                              className={`w-3 h-3 rounded-full border ${
                                enteredPin.length > idx
                                  ? "bg-pink-500 border-pink-500"
                                  : "bg-slate-100 border-slate-300"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Mini Keypad to test */}
                        <div className="grid grid-cols-3 gap-1.5 max-w-[160px] mx-auto">
                          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => handlePinPress(d)}
                              className="py-1 rounded-lg bg-slate-50 hover:bg-pink-50 text-xs font-bold text-slate-700 cursor-pointer border border-slate-100"
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Finale Celebration Envelope */
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-pink-100 text-[#FF2E63] flex items-center justify-center mx-auto shadow-inner">
                          <Heart className="w-6 h-6 fill-current animate-pulse" />
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-900">
                            Ready for {recipientName || "Sarah"}! 💖
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-tight">
                            They will experience your love story across all 8 chapters.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-pink-500" />
                          <span>Soundtrack: {bgMusic}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigateToStep(1)}
                          className="w-full py-2 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          style={{ backgroundColor: themeColor }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Replay From Beginning</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ============================================================= */}
          {/* BOTTOM HOME INDICATOR & STEP TRACK                           */}
          {/* ============================================================= */}
          <div className="relative z-20 pb-2 pt-1 flex flex-col items-center gap-1.5">
            {/* Step navigation dots */}
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dot) => (
                <span
                  key={dot}
                  onClick={() => navigateToStep(dot)}
                  className={`rounded-full transition-all cursor-pointer ${
                    dot === previewStep
                      ? "w-3 h-1 bg-[#FF2E63]"
                      : "w-1 h-1 bg-slate-300 hover:bg-pink-300"
                  }`}
                />
              ))}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="w-28 h-1 bg-slate-900/30 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
