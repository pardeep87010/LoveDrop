"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  Camera,
  Mail,
  Zap,
  CheckCircle2,
  PartyPopper,
  Volume2,
  MessageCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { soundFx } from "@/lib/soundFx";

export default function HeroInteractivePhone() {
  // Active Interactive Chapter inside Phone:
  // 1: The Sealed Wax Envelope
  // 2: The Runaway "NO" Button Playground
  // 3: Polaroid Memory Scrapbook
  // 4: Grand Finale & WhatsApp Dispatch Alert
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  // Chapter 1: Envelope unsealed state
  const [envelopeUnsealed, setEnvelopeUnsealed] = useState(false);

  // Chapter 2: Runaway "NO" dodge physics state
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [yesAccepted, setYesAccepted] = useState(false);

  const handleUnsealEnvelope = () => {
    soundFx.playSuccessChime();
    setEnvelopeUnsealed(true);
  };

  const handleDodgeNo = () => {
    soundFx.playPop();
    setDodgeCount((prev) => prev + 1);
    const rx = (Math.random() - 0.5) * 140;
    const ry = (Math.random() - 0.5) * 80;
    setNoPos({ x: rx, y: ry });
  };

  const handleYesClick = () => {
    soundFx.playSuccessChime();
    setYesAccepted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E11D48", "#FB7185", "#FDA4AF", "#FFFFFF"],
    });
  };

  const pleas = [
    "Are you really sure? 🥺",
    "Think again pookie... 💔",
    "Pakad ke dikhao! 😜",
    "Momos treat guaranteed! 🥟",
    "She MUST click YES! 💖",
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center select-none">
      {/* =================================================================== */}
      {/* FLOATING CONTEXTUAL FEATURE CALLOUT BADGES (Like Image, but Elevated) */}
      {/* =================================================================== */}

      {/* Badge 1: Top-Left (Photo Scrapbook) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -top-4 -left-6 sm:-left-12 z-30 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-md flex items-center gap-2.5 max-w-[170px]"
      >
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Camera className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-extrabold text-slate-900 leading-tight">Polaroid Scrapbook</p>
          <p className="text-[9px] text-slate-400 font-semibold leading-tight">With washi tape</p>
        </div>
      </motion.div>

      {/* Badge 2: Right-Middle (Wax Seal Envelope) */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, delay: 0.6, ease: "easeInOut" }}
        className="absolute top-28 -right-6 sm:-right-12 z-30 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-md flex items-center gap-2.5 max-w-[175px]"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-extrabold text-slate-900 leading-tight">Wax Seal Letter</p>
          <p className="text-[9px] text-slate-400 font-semibold leading-tight">Unseal to reveal</p>
        </div>
      </motion.div>

      {/* Badge 3: Bottom-Left (Runaway Button) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.8, delay: 1, ease: "easeInOut" }}
        className="absolute bottom-20 -left-6 sm:-left-10 z-30 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-md flex items-center gap-2.5 max-w-[175px]"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-extrabold text-slate-900 leading-tight">Runaway &quot;NO&quot; Button</p>
          <p className="text-[9px] text-slate-400 font-semibold leading-tight">Guaranteed &quot;YES!&quot;</p>
        </div>
      </motion.div>

      {/* =================================================================== */}
      {/* HIGH-END IPHONE HARDWARE FRAME */}
      {/* =================================================================== */}
      <div className="relative w-[285px] sm:w-[310px] h-[580px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/50 flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island Pill */}
        <div className="absolute top-4 inset-x-0 z-40 flex justify-center pointer-events-none">
          <div className="w-24 h-5 rounded-full bg-black flex items-center justify-end px-2.5">
            <span className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          </div>
        </div>

        {/* Ambient Floating Hearts in Phone Background */}
        <div className="absolute inset-0 bg-[#FDFBF7] overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [350, -40], opacity: [0, 0.4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeOut" }}
            className="absolute left-8 text-rose-300 text-sm"
          >
            💖
          </motion.div>
          <motion.div
            animate={{ y: [420, -40], opacity: [0, 0.4, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1.5, ease: "easeOut" }}
            className="absolute right-10 text-rose-400 text-xs"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [380, -40], opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, delay: 0.8, ease: "easeOut" }}
            className="absolute left-24 text-rose-300 text-sm"
          >
            🌸
          </motion.div>
        </div>

        {/* Phone Top Status Header */}
        <div className="relative z-20 pt-6 px-4 flex items-center justify-between text-[11px] font-bold text-slate-700">
          <span className="text-[10px] font-extrabold text-slate-800">9:41</span>
          <div className="flex items-center gap-1.5 text-rose-600">
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[9px] font-extrabold uppercase tracking-wide">Audio ON</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* PHONE INTERNAL SCREEN CONTENT (SWITCHABLE VIA TABS) */}
        {/* =================================================================== */}
        <div className="relative z-20 flex-1 flex flex-col justify-center px-4 py-2 text-center">
          <AnimatePresence mode="wait">
            {/* ------------------------------------------------------------- */}
            {/* CHAPTER 1: THE SEALED WAX ENVELOPE */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 1 && (
              <motion.div
                key="phone-tab-1"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="space-y-3"
              >
                {!envelopeUnsealed ? (
                  <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full">
                      Secret Surprise
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                      Hello, Sarah 💖
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Aman crafted something very special for you.
                    </p>

                    {/* Sealed Envelope Graphic */}
                    <div
                      onClick={handleUnsealEnvelope}
                      className="cursor-pointer group relative w-36 h-24 rounded-2xl bg-gradient-to-b from-rose-100 to-rose-200 border-2 border-rose-300 shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                    >
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md border-2 border-white ring-2 ring-rose-200 group-hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4 fill-white" />
                      </div>
                    </div>

                    <button
                      onClick={handleUnsealEnvelope}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      Unseal It 💌 (Tap to Open)
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-3xl bg-[#FFFBF8] border border-rose-200 shadow-sm text-left space-y-2 font-serif text-slate-700 text-xs"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-rose-100 text-[10px]">
                      <span className="font-bold text-rose-600">Wax Seal Letter</span>
                      <button
                        onClick={() => setEnvelopeUnsealed(false)}
                        className="text-slate-400 hover:text-rose-600 text-[9px] font-sans font-bold"
                      >
                        Reseal
                      </button>
                    </div>
                    <p className="font-bold text-rose-600 font-sans text-xs">My Dearest Sarah,</p>
                    <p className="leading-relaxed text-[11px]">
                      Some things deserve more than a text. You are my safest home in this entire world...
                    </p>
                    <p className="text-right font-bold text-rose-600 font-sans text-[11px]">
                      — Forever Yours, Aman ❤️
                    </p>
                    <button
                      onClick={() => setActiveTab(2)}
                      className="w-full py-2 mt-1 rounded-xl bg-rose-600 text-white font-sans font-extrabold text-[11px] flex items-center justify-center gap-1"
                    >
                      <span>Continue to Next Chapter</span>
                      <span>→</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* CHAPTER 2: RUNAWAY NO BUTTON PLAYGROUND */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 2 && (
              <motion.div
                key="phone-tab-2"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3"
              >
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Interactive Test
                </span>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  Do you love me? 🥺
                </h3>

                <p className="text-[11px] text-slate-500 font-medium">
                  Try clicking &quot;No&quot; if you dare!
                </p>

                {/* The Dodging Button Area */}
                <div className="relative min-h-[90px] flex items-center justify-center gap-2.5">
                  <button
                    onClick={handleYesClick}
                    style={{
                      transform: `scale(${Math.min(1 + dodgeCount * 0.12, 1.45)})`,
                      zIndex: 10,
                    }}
                    className="relative z-10 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                  >
                    {yesAccepted ? "YES! 1000x YES! 💖" : "YES! 💖"}
                  </button>

                  <motion.button
                    onMouseEnter={handleDodgeNo}
                    onTouchStart={handleDodgeNo}
                    onClick={handleDodgeNo}
                    animate={noPos ? { x: noPos.x, y: noPos.y } : { x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    style={{ zIndex: 30 }}
                    className="relative z-30 px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 font-bold text-xs border border-slate-200 shadow-xs cursor-pointer select-none"
                  >
                    No 💔
                  </motion.button>
                </div>

                {dodgeCount > 0 && (
                  <p className="text-[10px] font-bold text-rose-600 animate-pulse">
                    {pleas[Math.min(dodgeCount - 1, pleas.length - 1)]}
                  </p>
                )}

                {yesAccepted && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>WhatsApp alert sent to Aman! 🎉</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* CHAPTER 3: POLAROID SCRAPBOOK MEMORIES */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 3 && (
              <motion.div
                key="phone-tab-3"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="p-3.5 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-2 text-left"
              >
                <div className="flex items-center justify-between pb-1 border-b border-rose-100">
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase">
                    Scrapbook Memories
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">2 Photos</span>
                </div>

                {/* Polaroids Mini Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-1 pb-3 rounded-xl border border-rose-100 shadow-xs flex flex-col items-center">
                    <div className="w-full aspect-square rounded-lg bg-rose-50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80"
                        alt="Memory 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] font-serif text-slate-700 mt-1">Chai Date ✨</span>
                  </div>

                  <div className="bg-white p-1 pb-3 rounded-xl border border-rose-100 shadow-xs flex flex-col items-center">
                    <div className="w-full aspect-square rounded-lg bg-rose-50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&auto=format&fit=crop&q=80"
                        alt="Memory 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] font-serif text-slate-700 mt-1">Our Sunset 🌅</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-100 text-[10px] text-slate-700 font-medium">
                  <strong>3 Reasons:</strong> Your laugh fixes my worst days, your late night chai dates, and being my home.
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* CHAPTER 4: FINALE & LIVE WHATSAPP DISPATCH */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 4 && (
              <motion.div
                key="phone-tab-4"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <PartyPopper className="w-6 h-6" />
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  She Said YES! 🎉
                </h3>

                <p className="text-[11px] text-slate-500 font-medium">
                  Aman + Sarah = Locked in Forever ✨
                </p>

                {/* Simulated WhatsApp Notification Toast */}
                <div className="w-full p-2.5 rounded-xl bg-[#FAF7FD] border border-emerald-200 text-left flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-800">WhatsApp Alert Triggered</p>
                    <p className="text-[9px] text-slate-500 leading-tight">
                      &quot;Sarah completed the surprise and clicked YES!&quot;
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playSuccessChime();
                    confetti({ particleCount: 70, spread: 80 });
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Blast Confetti 🎊
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE CHAPTER SWITCHER DOTS / PILLS AT BOTTOM OF PHONE */}
        {/* =================================================================== */}
        <div className="relative z-20 pb-2 px-2 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50">
            {[
              { id: 1, label: "1. Envelope" },
              { id: 2, label: "2. Runaway NO" },
              { id: 3, label: "3. Scrapbook" },
              { id: 4, label: "4. Finale" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  soundFx.playPop();
                  setActiveTab(t.id as any);
                }}
                className={`px-2 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                  activeTab === t.id
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="text-[9px] text-slate-400 font-semibold">
            👆 Tap tabs to test live recipient chapters
          </p>
        </div>
      </div>
    </div>
  );
}
