"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Lock,
  Mail,
  Camera,
  CheckCircle2,
  PartyPopper,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { LoveSurpriseData } from "@/lib/types";
import { soundFx } from "@/lib/soundFx";
import { verifyPasscode } from "@/lib/security";

interface RecipientViewProps {
  data: LoveSurpriseData;
}

const THEME_STYLES: Record<string, { bg: string; btn: string; accent: string; badge: string }> = {
  classic: {
    bg: "bg-[#FFF0F3]",
    btn: "bg-[#FF2E63] hover:bg-[#E02656]",
    accent: "text-[#FF2E63]",
    badge: "bg-pink-50 text-[#FF2E63] border-pink-200",
  },
  "classic-romance": {
    bg: "bg-[#FDE2E6]",
    btn: "bg-rose-600 hover:bg-rose-700",
    accent: "text-rose-600",
    badge: "bg-rose-50 text-rose-600 border-rose-200",
  },
  "first-love": {
    bg: "bg-[#E8F8F5]",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    accent: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  "minimalist-love": {
    bg: "bg-[#F0F3FF]",
    btn: "bg-indigo-600 hover:bg-indigo-700",
    accent: "text-indigo-600",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
  "golden-hour": {
    bg: "bg-[#FFF8E7]",
    btn: "bg-amber-600 hover:bg-amber-700",
    accent: "text-amber-600",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
  },
  "midnight-galaxy": {
    bg: "bg-[#1A1D36]",
    btn: "bg-purple-600 hover:bg-purple-700",
    accent: "text-purple-400",
    badge: "bg-purple-900/50 text-purple-300 border-purple-800",
  },
};

export default function RecipientView({ data }: RecipientViewProps) {
  const activeTheme = THEME_STYLES[data.theme || "classic"] || THEME_STYLES.classic;

  // Passcode Gate State
  const [isUnlocked, setIsUnlocked] = useState(!data.hasPasscode);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);

  // Story Progression (1 to 5)
  const [currentChapter, setCurrentChapter] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Chapter 1: Envelope Unseal
  const [envelopeUnsealed, setEnvelopeUnsealed] = useState(false);

  // Chapter 2: Runaway Button Playground
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [yesAccepted, setYesAccepted] = useState(false);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  const handleVerifyPin = async () => {
    soundFx.playPop();
    if (pinAttempts >= 5) {
      alert("Too many incorrect attempts. Please ask whoever sent this surprise for the PIN!");
      return;
    }

    const isValid = await verifyPasscode(enteredPin, data.passcodeHash);
    if (isValid) {
      soundFx.playSuccessChime();
      setIsUnlocked(true);
      confetti({ particleCount: 60, spread: 60 });
    } else {
      setPinError(true);
      setPinAttempts((p) => p + 1);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleUnseal = () => {
    soundFx.playSuccessChime();
    setEnvelopeUnsealed(true);
  };

  const handleDodgeNo = () => {
    soundFx.playPop();
    setDodgeCount((p) => p + 1);
    const rx = (Math.random() - 0.5) * 180;
    const ry = (Math.random() - 0.5) * 110;
    setNoPos({ x: rx, y: ry });
  };

  const handleYes = () => {
    soundFx.playSuccessChime();
    setYesAccepted(true);
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#E11D48", "#FB7185", "#FDA4AF", "#FFFFFF"],
    });
  };

  const pleas = [
    "Are you really sure? 🥺",
    "Think again pookie... 💔",
    "Pakad ke dikhao! 😜",
    "Momos & chocolate treat guaranteed! 🥟",
    "You MUST click YES! 💖",
  ];

  return (
    <div className={`min-h-screen ${activeTheme.bg} text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-700 flex flex-col justify-between items-center py-6 px-4 relative overflow-hidden transition-colors duration-500`}>
      {/* Background Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [600, -80], opacity: [0, 0.45, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute left-[15%] text-rose-300 text-xl"
        >
          💖
        </motion.div>
        <motion.div
          animate={{ y: [650, -80], opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 7, delay: 2, ease: "linear" }}
          className="absolute right-[20%] text-rose-300 text-sm"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [700, -80], opacity: [0, 0.35, 0] }}
          transition={{ repeat: Infinity, duration: 8, delay: 3.5, ease: "linear" }}
          className="absolute left-[40%] text-rose-400 text-base"
        >
          🌸
        </motion.div>
      </div>

      {/* Top Floating Pill Header */}
      <header className="relative z-30 w-full max-w-md mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-rose-100 shadow-xs text-xs font-bold text-slate-800">
          <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
          <span>Surprise for {data.recipientName}</span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-white/90 backdrop-blur-md border border-rose-100 text-slate-600 hover:text-rose-600 shadow-xs transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-600" />}
        </button>
      </header>

      {/* Main Experience Body */}
      <main className="relative z-20 w-full max-w-md mx-auto my-auto flex flex-col justify-center items-center">
        {/* =================================================================== */}
        {/* PASSCODE LOCK GATE (IF PIN ENABLED) */}
        {/* =================================================================== */}
        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-lg text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
                Enter Secret Date Lock
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {data.senderName} set a secret passcode to unlock this surprise.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="••••"
                className={`w-40 mx-auto text-center tracking-[0.4em] text-2xl font-mono font-bold py-2.5 rounded-2xl border ${
                  pinError ? "border-rose-500 ring-2 ring-rose-200" : "border-slate-200 focus:border-rose-500"
                } outline-none`}
              />
              {pinError && (
                <p className="text-xs font-bold text-rose-600 animate-pulse">
                  Incorrect PIN. Please try again!
                </p>
              )}
            </div>

            <button
              onClick={handleVerifyPin}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer"
            >
              Unlock Surprise 💌
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {/* =============================================================== */}
            {/* CHAPTER 1: THE SEALED WAX ENVELOPE */}
            {/* =============================================================== */}
            {currentChapter === 1 && (
              <motion.div
                key="ch-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full bg-white rounded-3xl p-6 border border-rose-100 shadow-md text-center space-y-4"
              >
                {!envelopeUnsealed ? (
                  <div className="py-4 space-y-4 flex flex-col items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded-full">
                      A Secret Moment For You
                    </span>

                    <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">
                      Dear {data.recipientName} 💖
                    </h2>

                    <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
                      {data.senderName} has crafted something very heartfelt for you. Tap the wax seal to break the stamp.
                    </p>

                    <div
                      onClick={handleUnseal}
                      className="cursor-pointer group relative w-48 h-32 rounded-2xl bg-gradient-to-b from-rose-100 to-rose-200 border-2 border-rose-300 shadow-md flex items-center justify-center transition-transform hover:scale-105"
                    >
                      <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-rose-200 group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6 fill-white" />
                      </div>
                    </div>

                    <button
                      onClick={handleUnseal}
                      className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer"
                    >
                      Unseal It 💌 (Tap to Open)
                    </button>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#FFFBF8] border border-rose-100 text-left space-y-2 font-serif text-slate-800 text-xs">
                      <p className="font-sans font-bold text-rose-600">Dearest {data.recipientName},</p>
                      <p className="leading-relaxed whitespace-pre-line text-sm">{data.letterContent}</p>
                      <p className="text-right font-sans font-bold text-rose-600">— {data.senderName} ❤️</p>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playPop();
                        setCurrentChapter(2);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Next Chapter</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* =============================================================== */}
            {/* CHAPTER 2: RUNAWAY "NO" BUTTON PLAYGROUND */}
            {/* =============================================================== */}
            {currentChapter === 2 && (
              <motion.div
                key="ch-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full bg-white rounded-3xl p-6 border border-rose-100 shadow-md text-center space-y-4"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded-full">
                  Chapter 2 • The Question
                </span>

                <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-snug">
                  {data.question}
                </h2>

                <p className="text-xs text-slate-500 font-medium">
                  {data.subheading || "Answer honestly... if you can catch the button! 😜"}
                </p>

                <div className="relative min-h-[110px] flex items-center justify-center gap-3">
                  <button
                    onClick={handleYes}
                    style={{
                      transform: `scale(${Math.min(1 + dodgeCount * 0.12, 1.5)})`,
                    }}
                    className="z-10 px-7 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-sm transition-transform cursor-pointer shrink-0"
                  >
                    {yesAccepted ? "YES! 1000x YES! 💖" : "YES! 💖"}
                  </button>

                  <motion.button
                    onMouseEnter={handleDodgeNo}
                    onTouchStart={handleDodgeNo}
                    onClick={handleDodgeNo}
                    animate={noPos ? { x: noPos.x, y: noPos.y } : { x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs border border-slate-200 cursor-pointer"
                  >
                    No 💔
                  </motion.button>
                </div>

                {dodgeCount > 0 && (
                  <p className="text-xs font-bold text-rose-600 animate-pulse">
                    {pleas[Math.min(dodgeCount - 1, pleas.length - 1)]}
                  </p>
                )}

                {yesAccepted && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                    <button
                      onClick={() => {
                        soundFx.playPop();
                        setCurrentChapter(3);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View Our Scrapbook (Chapter 3)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* =============================================================== */}
            {/* CHAPTER 3: POLAROID SCRAPBOOK MEMORIES & 3 REASONS */}
            {/* =============================================================== */}
            {currentChapter === 3 && (
              <motion.div
                key="ch-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full bg-white rounded-3xl p-6 border border-rose-100 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                  <span className="text-xs font-extrabold text-rose-600 uppercase flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    Our Memories &amp; Reasons
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">Chapter 3 of 4</span>
                </div>

                {/* Polaroids */}
                {data.photos && data.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {data.photos.map((p, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-1.5 pb-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col items-center relative"
                      >
                        <div className="w-full aspect-square rounded-xl bg-slate-100 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p} alt="Memory" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-serif text-slate-700 mt-1.5 font-bold">
                          Moment #{idx + 1} ✨
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3 Reasons */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>3 Things That Make You Special</span>
                  </h4>
                  {data.reasons.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#FFFBF8] border border-rose-100 text-xs font-medium text-slate-800 flex items-start gap-2 shadow-xs"
                    >
                      <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    soundFx.playPop();
                    setCurrentChapter(4);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Grand Finale (Chapter 4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* =============================================================== */}
            {/* CHAPTER 4: CELEBRATION FINALE & REAL-TIME ALERT */}
            {/* =============================================================== */}
            {currentChapter === 4 && (
              <motion.div
                key="ch-4"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-lg text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <PartyPopper className="w-8 h-8" />
                </div>

                <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Locked In Forever! ❤️
                </h2>

                <p className="text-xs text-slate-500 font-medium">
                  {data.recipientName} + {data.senderName} = Eternal Story ✨
                </p>

                {/* WhatsApp Dispatch Toast */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7FD] border border-emerald-200 text-left flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <span>WhatsApp Alert Dispatched</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Notified {data.senderName}: &quot;{data.recipientName} completed your surprise and clicked YES! 🎉&quot;
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      soundFx.playSuccessChime();
                      confetti({ particleCount: 100, spread: 80 });
                    }}
                    className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Confetti Blast 🎊
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playPop();
                      setCurrentChapter(1);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                  >
                    Replay Surprise ↺
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer Viral Loop */}
      <footer className="relative z-20 pt-4 flex flex-col items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-rose-100 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors shadow-xs"
        >
          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
          <span>Want to surprise someone? <strong>Create your LoveLink</strong></span>
        </Link>
      </footer>
    </div>
  );
}
