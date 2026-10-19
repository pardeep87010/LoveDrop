"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Camera,
  MapPin,
  Calendar as CalendarIcon,
  Music,
  Wind,
  RotateCcw,
  Sparkles,
  ChevronUp,
  Link2,
  ArrowRight,
  Play,
  Pause,
  MessageCircle,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { BirthdayData } from "@/lib/types";

interface BirthdayPreviewCardProps {
  currentStep: number;
  data: BirthdayData;
  onStepChange?: (step: number) => void;
}

export default function BirthdayPreviewCard({
  currentStep,
  data,
  onStepChange,
}: BirthdayPreviewCardProps) {
  // Preview chapter (1 to 10). Syncs with wizard step.
  const [activePreviewChapter, setActivePreviewChapter] = useState(currentStep);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [balloonPopped, setBalloonPopped] = useState<number[]>([]);
  const [revealedWishes, setRevealedWishes] = useState<number[]>([]);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isVinylSpinning, setIsVinylSpinning] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0);

  // Auto-sync when parent wizard step changes
  useEffect(() => {
    setActivePreviewChapter(currentStep);
    if (currentStep === 2) setEnvelopeOpen(true);
    if (currentStep === 8 || currentStep === 9) setIsVinylSpinning(true);
  }, [currentStep]);

  const goToChapter = (ch: number) => {
    if (ch >= 1 && ch <= 10) {
      setActivePreviewChapter(ch);
      if (onStepChange) onStepChange(ch);
    }
  };

  // ── Render Phone Screen Content by Chapter ──────────────────────────────
  const renderPhoneScene = () => {
    switch (activePreviewChapter) {
      // Step 1: Welcome / Landing Cover Screen
      case 1:
        return (
          <div className="h-full flex flex-col items-center justify-between p-4 text-center select-none">
            <div className="pt-2">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#D1264F] mb-1">
                A GIFT FOR YOU
              </p>
              <h1 className="text-2xl font-serif text-[#3A2340] leading-tight">
                Happy birthday!
              </h1>
              <p className="text-sm font-cursive text-[#3A2340] mt-0.5">
                for being so{" "}
                <span className="font-semibold px-1 rounded bg-amber-100 text-[#D1264F]">
                  {data.recipientName ? data.recipientName : "amazing"}
                </span>
              </p>
              <p className="text-[10px] text-[#6E5869] mt-1">
                Someone threw a little party just for you.
              </p>
            </div>

            <div className="my-auto py-2 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-40 max-h-48 object-contain pointer-events-none select-none"
                style={{
                  mixBlendMode: "multiply",
                  WebkitMaskImage:
                    "radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 75%, transparent 97%)",
                  maskImage:
                    "radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 75%, transparent 97%)",
                }}
              >
                <source src="/themes/birthday/cover/cake-video.mp4" type="video/mp4" />
                <source src="/themes/birthday/cover/cake-video.webm" type="video/webm" />
                <img
                  src="/themes/birthday/cover/cake-wide.webp"
                  alt="Cake"
                  className="w-40 object-contain"
                  style={{ mixBlendMode: "multiply" }}
                />
              </video>
            </div>

            <div className="w-full pb-1">
              <div
                onClick={() => goToChapter(2)}
                className="w-full py-2.5 rounded-full bg-[#D1264F] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:scale-102 transition-transform"
              >
                <span>🎁 {data.buttonText || "Open my gift"}</span>
              </div>
            </div>
          </div>
        );

      // Step 2: The Letter
      case 2:
        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none relative">
            <div className="w-full">
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">OPEN THE ENVELOPE</p>
              <h3 className="text-xs font-serif font-bold text-[#3A2340]">
                {data.letterTitle || "A letter for you"}
              </h3>
            </div>

            <div className="relative w-full flex flex-col items-center justify-center my-auto min-h-[270px]">
              {/* Sliding Letter Card */}
              <motion.div
                className="w-full bg-white rounded-2xl p-3.5 shadow-lg border border-[#3A2340]/10 text-left transition-all z-10"
                animate={
                  envelopeOpen
                    ? { y: -25, opacity: 1, scale: 1 }
                    : { y: 25, opacity: 0, scale: 0.95 }
                }
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
              >
                <div className="flex items-center justify-between border-b pb-1 mb-1.5">
                  <span className="text-[9px] font-bold text-[#D1264F]">💌 Personal Message</span>
                  <span className="text-[9px] text-slate-400">✨</span>
                </div>
                <p className="text-[10px] leading-relaxed text-[#3A2340] line-clamp-5 font-sans whitespace-pre-wrap">
                  {data.letterText ||
                    `Dear ${data.recipientName || "Friend"},\n\nEvery day with you is a gift! Wishing you the happiest birthday filled with joy, laughter, and endless blessings.\n\nWith all my love,\n${data.senderName || "Best Friend"} 💖`}
                </p>
                <div className="mt-1.5 text-right border-t pt-1 border-pink-50">
                  <span className="font-cursive text-xs text-[#D1264F]">~ {data.senderName || "With Love"}</span>
                </div>
              </motion.div>

              {/* Envelope Packet with Centered Wax Seal */}
              <div
                onClick={() => setEnvelopeOpen(!envelopeOpen)}
                className={`relative w-full h-28 rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all z-20 ${
                  envelopeOpen ? "mt-1 opacity-95" : "my-auto"
                }`}
                style={{
                  background: "linear-gradient(135deg, #F8B4C8 0%, #EE8DAE 100%)",
                }}
              >
                {/* Triangular Folds */}
                <svg
                  viewBox="0 0 300 160"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <path d="M0 0 L150 80 L0 160 Z" fill="rgba(247, 169, 194, 0.85)" />
                  <path d="M300 0 L150 80 L300 160 Z" fill="rgba(247, 169, 194, 0.85)" />
                  <path d="M0 160 L150 80 L300 160 Z" fill="rgba(238, 141, 174, 0.95)" />
                  {!envelopeOpen && (
                    <path
                      d="M0 0 L150 80 L300 0 Z"
                      fill="rgba(252, 198, 214, 0.98)"
                      stroke="rgba(255, 255, 255, 0.5)"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>

                {/* Wax Seal at Dead Center (50%, 50%) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 35%, #E63956 0%, #A51A3C 60%, #6C0E20 100%)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </motion.div>
                </div>

                <span className="absolute bottom-1 left-0 right-0 text-[8px] font-bold text-white uppercase tracking-wider text-center pointer-events-none">
                  {envelopeOpen ? "Tap seal to close" : "Tap seal to open letter"}
                </span>
              </div>
            </div>

            <div className="w-full pt-1">
              <button
                type="button"
                onClick={() => goToChapter(3)}
                className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Continue to Reasons 🎈</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );

      // Step 3: What I Love / Real 3D Organic Balloons
      case 3:
        const reasonsList = data.loveReasons?.length
          ? data.loveReasons
          : [
              "Your contagious smile that brightens any room",
              "How you always make time for the people you care about",
              "Your unique sense of humor and warmth",
              "The kindness you show even in the small moments",
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
            bg: "radial-gradient(circle at 35% 30%, #CFA5FA 0%, #8B5CF6 65%, #5B21B6 100%)",
            border: "#8B5CF6",
            light: "#F5F3FF",
            stringColor: "#A78BFA",
          },
        ];

        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none">
            <div>
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">WHAT I LOVE</p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">Reasons you&apos;re special</h3>
              <p className="text-[9px] text-[#6E5869]">Tap each floating balloon to pop &amp; reveal! 🎈</p>
            </div>

            {/* Organic Floating Balloons Cluster */}
            <div className="grid grid-cols-2 gap-3 w-full my-auto py-2 px-1">
              {reasonsList.slice(0, 4).map((r, i) => {
                const isPopped = balloonPopped.includes(i);
                const bTheme = balloonThemes[i % balloonThemes.length];

                return (
                  <div key={i} className="flex flex-col items-center justify-center min-h-[105px]">
                    {isPopped ? (
                      // Revealed Note Card
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onClick={() =>
                          setBalloonPopped(balloonPopped.filter((idx) => idx !== i))
                        }
                        className="w-full h-full min-h-[105px] rounded-2xl p-2.5 flex flex-col items-center justify-between text-center border-2 shadow-sm cursor-pointer"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: bTheme.border,
                        }}
                      >
                        <div className="w-full flex items-center justify-between">
                          <span
                            className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: bTheme.border }}
                          >
                            #{i + 1}
                          </span>
                          <span className="text-xs">💖</span>
                        </div>
                        <p className="text-[10px] font-semibold text-[#3A2340] line-clamp-3 leading-tight my-1">
                          {r}
                        </p>
                        <span className="text-[8px] text-slate-400 font-medium">Tap to reinflate</span>
                      </motion.div>
                    ) : (
                      // Real 3D Balloon Shape with String
                      <motion.div
                        onClick={() => {
                          setBalloonPopped([...balloonPopped, i]);
                          confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
                        }}
                        className="relative flex flex-col items-center cursor-pointer group"
                        animate={{
                          y: i % 2 === 0 ? [-3, 3, -3] : [3, -3, 3],
                          rotate: i % 2 === 0 ? [-2, 2, -2] : [2, -2, 2],
                        }}
                        transition={{
                          duration: 2.5 + i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                      >
                        {/* 3D Oval Balloon Body */}
                        <div
                          className="w-20 h-24 rounded-full relative shadow-md flex flex-col items-center justify-center"
                          style={{
                            background: bTheme.bg,
                            borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                            boxShadow:
                              "0 8px 18px -4px rgba(0,0,0,0.25), inset -3px -3px 6px rgba(0,0,0,0.2), inset 3px 3px 6px rgba(255,255,255,0.4)",
                          }}
                        >
                          {/* Glossy Specular Highlight Curve */}
                          <div className="absolute top-2.5 left-2.5 w-3.5 h-6 rounded-full bg-white/45 -rotate-35 filter blur-[0.4px]" />
                          <div className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full bg-white/60" />

                          {/* Center Tap Prompt */}
                          <span className="text-[9px] font-black text-white drop-shadow-md tracking-wide">
                            Pop me! ✨
                          </span>
                        </div>

                        {/* Balloon Tie Knot */}
                        <div
                          className="w-2.5 h-1.5 -mt-0.5 rounded-xs shadow-xs"
                          style={{ backgroundColor: bTheme.border }}
                        />

                        {/* Balloon Hanging String (Wavy SVG) */}
                        <svg
                          width="12"
                          height="18"
                          viewBox="0 0 12 18"
                          className="opacity-70 pointer-events-none"
                        >
                          <path
                            d="M6 0 Q9 6, 6 10 T6 18"
                            fill="none"
                            stroke={bTheme.stringColor}
                            strokeWidth="1.5"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Next Page Button */}
            <div className="w-full pt-1">
              <button
                type="button"
                onClick={() => goToChapter(4)}
                className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Continue to Our Story 📖</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );

      // Step 4: Our Story
      case 4:
        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none">
            <div>
              <p className="text-[8px] font-bold uppercase text-[#D1264F] mb-0.5">CHAPTER BY CHAPTER</p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">Our story</h3>
            </div>

            <div className="w-full bg-[#FFFDF9] rounded-2xl p-3.5 border-2 border-pink-200 shadow-md relative text-left my-auto">
              <div className="w-16 h-16 rounded-full bg-[#E2F7F0] flex items-center justify-center mx-auto mb-2 border-2 border-white shadow-xs">
                <img
                  src="/themes/birthday/story/gift-boxes.webp"
                  alt="Gifts"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <p className="text-[11px] font-cursive leading-relaxed text-[#3A2340] line-clamp-6">
                {data.ourStory ||
                  `Every chapter with you is magical. From the memories we made to the laughter we shared — thank you for being the sweetest part of my story! 🎁`}
              </p>
              <p className="text-[10px] font-cursive text-right text-[#D1264F] mt-2">
                ~ {data.senderName || "With Love"} 💖
              </p>
            </div>

            <div className="w-full pt-1">
              <button
                type="button"
                onClick={() => goToChapter(5)}
                className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Make a Wish Jar ⭐</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );

      // Step 5: Wishes Jar (Upper Floating Wishes & Exact Tap Logic)
      case 5:
        const wishesList = data.wishes?.length
          ? data.wishes
          : [
              "May all your wildest dreams take flight this year! 🌟",
              "Endless laughter, joyful adventures, and true peace 😄",
              "Great health, vibrant energy, and unforgettable memories 💖",
            ];

        const allWishesRevealed = revealedWishes.length >= wishesList.length;

        const handleJarTap = () => {
          if (revealedWishes.length < wishesList.length) {
            setRevealedWishes([...revealedWishes, revealedWishes.length]);
            confetti({
              particleCount: 25,
              spread: 50,
              origin: { y: 0.6 },
              colors: ["#FFD700", "#FF69B4", "#7B68EE"],
            });
          }
          // If already >= wishesList.length, DO NOTHING!
        };

        // Positions for revealed wishes in the upper area around the jar:
        const wishFloatingPositions = [
          { top: "11%", left: "4%", rotate: "-3deg", bg: "rgba(255, 249, 196, 0.95)", border: "#FBC02D" },
          { top: "23%", right: "4%", rotate: "2deg", bg: "rgba(255, 235, 238, 0.95)", border: "#F06292" },
          { top: "35%", left: "5%", rotate: "1deg", bg: "rgba(243, 229, 245, 0.95)", border: "#BA68C8" },
          { top: "47%", right: "5%", rotate: "-2deg", bg: "rgba(232, 245, 233, 0.95)", border: "#81C784" },
        ];

        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none relative overflow-hidden">
            <div className="z-20">
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">MAKE A WISH</p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">Wishes for your new year</h3>
              <p className="text-[9px] text-[#6E5869]">
                {allWishesRevealed
                  ? "All wishes have been released! ✨"
                  : "Tap the magical jar to release your wishes ⭐"}
              </p>
            </div>

            {/* UPPER FLOATING WISHES (Floating in different places above/around jar) */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <AnimatePresence>
                {revealedWishes.map((idx) => {
                  const pos = wishFloatingPositions[idx % wishFloatingPositions.length];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, opacity: 0, y: 30 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        y: [-2, 2, -2],
                      }}
                      transition={{
                        y: { duration: 2.5 + idx * 0.4, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 0.4, type: "spring" },
                      }}
                      className="absolute max-w-[210px] p-2 rounded-2xl shadow-md border pointer-events-auto text-left"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        right: pos.right,
                        transform: `rotate(${pos.rotate})`,
                        backgroundColor: pos.bg,
                        borderColor: pos.border,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">⭐</span>
                        <p className="text-[9px] font-bold text-[#3A2340] leading-tight">
                          {wishesList[idx]}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Magical Star Jar (Lower Center) */}
            <div
              onClick={handleJarTap}
              className={`mt-auto mb-2 relative z-20 transition-all ${
                allWishesRevealed ? "cursor-default" : "cursor-pointer group"
              }`}
            >
              <motion.div
                animate={
                  allWishesRevealed
                    ? { scale: [1, 1.02, 1] }
                    : { y: [-3, 3, -3] }
                }
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                whileTap={!allWishesRevealed ? { scale: 0.94 } : {}}
              >
                <img
                  src="/themes/birthday/wishes/star-jar.avif"
                  alt="Star Jar"
                  className="w-32 h-34 object-contain drop-shadow-lg mx-auto"
                />
              </motion.div>

              <div className="mt-1">
                <span
                  className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border shadow-xs inline-block ${
                    allWishesRevealed
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-white text-[#D1264F] border-pink-200 group-hover:scale-105"
                  }`}
                >
                  {allWishesRevealed
                    ? "✨ All wishes released! ✨"
                    : `Tap jar to release wish (${revealedWishes.length}/${wishesList.length}) ⭐`}
                </span>
              </div>
            </div>

            {/* Bottom Next Page Option: Always accessible or highlighted when all wishes revealed */}
            <div className="w-full pt-1 z-20 min-h-[36px]">
              {allWishesRevealed ? (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="button"
                  onClick={() => goToChapter(6)}
                  className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all animate-pulse"
                >
                  <span>Continue to Moments 📸</span>
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              ) : (
                <button
                  type="button"
                  onClick={() => goToChapter(6)}
                  className="w-full py-1 text-slate-400 text-[10px] font-medium hover:text-[#D1264F] transition-colors"
                >
                  Skip to Moments ➔
                </button>
              )}
            </div>
          </div>
        );

      // Step 6: Moments / Photobooth (Large Polaroid Display)
      case 6:
        const photosList = data.photos?.filter(Boolean).length
          ? data.photos.filter(Boolean)
          : [
              "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
              "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
              "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
            ];

        const safePhotoIdx = activePhotoIndex % photosList.length;
        const currentPhoto = photosList[safePhotoIdx];

        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none">
            <div>
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">SAY CHEESE!</p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">Our moments</h3>
              <p className="text-[9px] text-[#6E5869]">Memories frozen in time 📸</p>
            </div>

            {/* Large High-Impact Polaroid Card */}
            <div className="w-full max-w-[250px] bg-white rounded-2xl p-2.5 shadow-xl border border-pink-100 relative my-auto">
              {/* Washi Tape on Top Center */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-xs bg-amber-100/90 border border-amber-200/70 shadow-2xs -rotate-2 z-10" />

              {/* Large Photo Frame */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 shadow-inner group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={safePhotoIdx}
                    src={currentPhoto}
                    alt="Birthday memory"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  />
                </AnimatePresence>

                {/* Left / Right Navigation Overlay Arrows */}
                {photosList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photosList.length - 1))
                      }
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePhotoIndex((prev) => (prev + 1) % photosList.length)
                      }
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Photo Counter Pill */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold backdrop-blur-xs">
                  {safePhotoIdx + 1} / {photosList.length}
                </div>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div className="pt-2 pb-0.5 text-center">
                <p className="font-cursive text-sm text-[#3A2340]">
                  Unforgettable memories with you 💕
                </p>
                <div className="flex justify-center gap-1 mt-1">
                  {photosList.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === safePhotoIdx ? "w-4 bg-[#D1264F]" : "w-1.5 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full pt-1">
              <button
                type="button"
                onClick={() => goToChapter(7)}
                className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>See Our Places 📍</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );

      // Step 7: Our Places (Interactive Travel Journey)
      case 7:
        const placesList = data.ourPlaces?.length
          ? data.ourPlaces
          : [
              { name: "Where we first met", emoji: "☕" },
              { name: "Our favorite late-night hangout", emoji: "🍕" },
              { name: "The secret sunset viewpoint", emoji: "🌅" },
            ];

        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none">
            <div>
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">WHERE WE HAVE BEEN</p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">Our places</h3>
              <p className="text-[9px] text-[#6E5869]">A roadmap of our favorite spots 📍</p>
            </div>

            {/* Interactive Travel Journey Card */}
            <div className="w-full my-auto py-1 space-y-2">
              {/* 3D Map Banner */}
              <div className="relative w-full h-24 rounded-2xl overflow-hidden bg-gradient-to-r from-teal-50 via-pink-50 to-amber-50 border border-pink-200 shadow-sm flex items-center justify-center p-2">
                <img
                  src="/themes/birthday/places/map-3d.avif"
                  alt="Map"
                  className="w-28 object-contain drop-shadow-md"
                />
                <motion.div
                  className="absolute top-3 right-8 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full shadow-xs border border-pink-200"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className="w-3 h-3 text-[#D1264F] fill-[#D1264F]" />
                  <span className="text-[8px] font-bold text-[#D1264F]">Special Moments</span>
                </motion.div>
              </div>

              {/* Dotted Route Stops */}
              <div className="space-y-1.5 text-left">
                {placesList.slice(0, 3).map((p, i) => {
                  const isSelected = selectedPlaceIndex === i;
                  return (
                    <motion.div
                      key={i}
                      onClick={() => {
                        setSelectedPlaceIndex(i);
                        confetti({ particleCount: 15, spread: 35, origin: { y: 0.7 } });
                      }}
                      className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 shadow-2xs ${
                        isSelected
                          ? "bg-white border-[#D1264F] ring-1 ring-[#D1264F]/30 shadow-xs"
                          : "bg-white/70 border-pink-100 hover:border-pink-200"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-7 h-7 rounded-xl bg-pink-100/70 text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {p.emoji || "📍"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-extrabold text-[#D1264F] uppercase tracking-wider">
                            Stop #{i + 1}
                          </span>
                          {isSelected && (
                            <span className="text-[8px] text-pink-500 font-bold">✨ Favorite</span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-[#3A2340] truncate leading-tight">
                          {p.name}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="w-full pt-1">
              <button
                type="button"
                onClick={() => goToChapter(8)}
                className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Mark the Date 🗓️</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );

      // Step 8: Special Date / Calendar (Rich Interactive 3D Date)
      case 8:
        const bDateStr = data.birthdayDate || data.ourDate || new Date().toISOString();
        let bDateObj = new Date(bDateStr);
        if (isNaN(bDateObj.getTime())) bDateObj = new Date();
        const bMonth = bDateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
        const bDay = bDateObj.getDate();
        const bYear = bDateObj.getFullYear();
        const bWeekday = bDateObj.toLocaleDateString("en-US", { weekday: "long" });

        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none">
            <div>
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">MARK THE CALENDAR</p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">A date to keep</h3>
              <p className="text-[9px] text-[#6E5869]">The day the world got a lot brighter ✨</p>
            </div>

            {/* 3D Calendar Card with Golden Ribbon */}
            <div className="relative my-auto flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => confetti({ particleCount: 30, spread: 60 })}
              >
                <img
                  src="/themes/birthday/calendar/calendar-3d.avif"
                  alt="Calendar"
                  className="w-40 object-contain drop-shadow-xl mx-auto"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 pointer-events-none">
                  <span className="text-[9px] font-black tracking-widest text-[#D1264F]">
                    {bMonth}
                  </span>
                  <span className="text-3xl font-black font-serif text-[#3A2340] leading-none my-0.5">
                    {bDay}
                  </span>
                  <span className="text-[9px] font-bold text-[#6E5869]">{bYear}</span>
                </div>
              </div>

              {/* Celebrating Banner */}
              <div className="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200 text-center shadow-xs max-w-[240px]">
                <p className="text-[10px] font-black text-[#D1264F] flex items-center justify-center gap-1">
                  <span>🎉</span>
                  <span>{bWeekday} Celebration</span>
                  <span>🎉</span>
                </p>
                {data.birthdayAge && (
                  <p className="text-[9px] text-slate-600 font-semibold mt-0.5">
                    Turning {data.birthdayAge} years of pure awesomeness!
                  </p>
                )}
              </div>
            </div>

            <div className="w-full pt-1">
              <button
                type="button"
                onClick={() => goToChapter(9)}
                className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Listen to Our Song 🎵</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );

      // Step 9: Our Song / Interactive Vinyl Record Turntable
      case 9:
        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none">
            <div>
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">PRESS PLAY</p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">Our song</h3>
              <p className="text-[10px] text-[#6E5869] font-medium truncate max-w-[200px] mx-auto mt-0.5">
                {data.ourSong || "Romantic Lo-Fi Melodies"}
              </p>
            </div>

            {/* Turntable Console with Spinning Vinyl & Equalizer */}
            <div className="relative my-auto flex flex-col items-center">
              {/* Floating Music Notes */}
              <div className="absolute -top-6 inset-x-0 flex justify-around pointer-events-none">
                <motion.span
                  className="text-xs text-pink-500"
                  animate={{ y: [-5, -15, -5], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎵
                </motion.span>
                <motion.span
                  className="text-xs text-purple-500"
                  animate={{ y: [-8, -20, -8], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: 0.5 }}
                >
                  🎶
                </motion.span>
                <motion.span
                  className="text-xs text-amber-500"
                  animate={{ y: [-4, -16, -4], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
                >
                  ✨
                </motion.span>
              </div>

              {/* Turntable Body */}
              <div
                onClick={() => setIsVinylSpinning(!isVinylSpinning)}
                className="w-44 h-40 rounded-3xl bg-gradient-to-br from-[#FFF5F8] to-[#FFE8EF] border-2 border-white shadow-xl p-3 relative flex items-center justify-center cursor-pointer group"
              >
                {/* Vinyl Record */}
                <motion.div
                  className="w-28 h-28 rounded-full shadow-2xl relative flex items-center justify-center overflow-hidden border border-black/80"
                  style={{
                    background:
                      "radial-gradient(circle, #2C2C2C 15%, #111111 50%, #222222 75%, #0A0A0A 100%)",
                  }}
                  animate={isVinylSpinning ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    isVinylSpinning
                      ? { duration: 3.5, repeat: Infinity, ease: "linear" }
                      : { duration: 0.5 }
                  }
                >
                  {/* Subtle Vinyl Grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/10" />
                  <div className="absolute inset-4 rounded-full border border-white/10" />
                  <div className="absolute inset-6 rounded-full border border-white/10" />

                  {/* Center Label */}
                  <div className="w-10 h-10 rounded-full bg-[#D1264F] flex items-center justify-center shadow-inner text-white text-[9px] font-bold">
                    <span>❤️</span>
                  </div>
                </motion.div>

                {/* Turntable Tonearm Needle */}
                <motion.div
                  className="absolute top-2 right-2 w-9 h-22 pointer-events-none origin-top-right"
                  animate={isVinylSpinning ? { rotate: 18 } : { rotate: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src="/themes/birthday/music/turntable-arm.svg"
                    alt="Tonearm"
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </motion.div>
              </div>

              {/* Sound Equalizer Waves */}
              <div className="flex items-center gap-1 mt-2.5 h-4">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <motion.span
                    key={bar}
                    className="w-1 rounded-full bg-[#D1264F]"
                    animate={
                      isVinylSpinning
                        ? { height: ["4px", `${8 + (bar % 3) * 6}px`, "4px"] }
                        : { height: "4px" }
                    }
                    transition={{
                      duration: 0.5 + bar * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Play / Pause Toggle Pill */}
              <button
                type="button"
                onClick={() => setIsVinylSpinning(!isVinylSpinning)}
                className="mt-1 px-3 py-1 rounded-full bg-white border border-pink-200 text-[#D1264F] font-bold text-[10px] shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                {isVinylSpinning ? (
                  <Pause className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current" />
                )}
                <span>{isVinylSpinning ? "Now Playing" : "Tap to Play"}</span>
              </button>
            </div>

            <div className="w-full pt-1">
              <button
                type="button"
                onClick={() => goToChapter(10)}
                className="w-full py-2 px-3 rounded-full bg-[#D1264F] hover:bg-[#AA254B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Blow Birthday Candles 🎂</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );

      // Step 10: Blow Candles & Grand Finale Celebration
      case 10:
        return (
          <div className="h-full flex flex-col items-center justify-between p-3 text-center select-none overflow-y-auto no-scrollbar">
            <div>
              <p className="text-[8px] font-bold uppercase text-[#D1264F]">
                {candlesBlown ? "SURPRISE COMPLETE 🎉" : "MAKE A WISH"}
              </p>
              <h3 className="text-base font-serif font-bold text-[#3A2340]">
                {candlesBlown
                  ? `Happy birthday, ${data.recipientName || "Friend"}!`
                  : "Blow out the candles"}
              </h3>
            </div>

            {!candlesBlown ? (
              /* State A: Lit Cake Ready to Blow */
              <div className="relative my-auto py-2 flex flex-col items-center justify-center">
                <div className="relative">
                  <motion.img
                    src="/themes/birthday/candles/cake-lit-wide.webp"
                    alt="Cake Lit"
                    className="w-40 object-contain mx-auto"
                    style={{
                      mixBlendMode: "multiply",
                      WebkitMaskImage:
                        "radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 75%, transparent 97%)",
                      maskImage:
                        "radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 75%, transparent 97%)",
                    }}
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Warm Breathing Candle Glow */}
                  <motion.div
                    className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-10 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 50%, rgba(255, 210, 110, 0.45) 0%, rgba(255, 140, 50, 0.15) 55%, transparent 80%)",
                      filter: "blur(6px)",
                    }}
                    animate={{
                      opacity: [0.75, 1, 0.75],
                      scale: [0.98, 1.05, 0.98],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>

                <div className="w-full mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCandlesBlown(true);
                      confetti({
                        particleCount: 80,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ["#D1264F", "#FFD700", "#FF69B4", "#00B894"],
                      });
                    }}
                    className="w-full py-2.5 rounded-full font-bold text-xs text-white shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-102 active:scale-98"
                    style={{ backgroundColor: "#D1264F" }}
                  >
                    <Wind className="w-4 h-4" />
                    <span>Blow Candles 🌬️</span>
                  </button>
                </div>
              </div>
            ) : (
              /* State B: Grand Celebration Card Unwrapped */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full my-auto py-1 flex flex-col items-center space-y-2.5"
              >
                {/* 3D Cake / Trophy with Ribbon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200 flex items-center justify-center shadow-md">
                  <span className="text-2xl animate-bounce">🎁</span>
                </div>

                {/* Celebration Message */}
                <div className="bg-white rounded-2xl p-3 border border-pink-100 shadow-md w-full space-y-1.5">
                  <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-[8px] inline-flex items-center gap-1 mx-auto">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Wish Sent to the Stars! ✨</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    Happy Birthday, {data.recipientName || "Friend"}! 🎂
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    May this year bring you endless sunshine, laughter, and your wildest dreams come true!
                  </p>
                  <p className="text-[9px] font-cursive text-right text-[#D1264F]">
                    Forever cheering for you, {data.senderName || "Me"} 💖
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Hey ${data.senderName || "there"}! Thank you so much for the birthday surprise website! Loved every chapter! ❤️🎂`
                      );
                      window.open(`https://wa.me/?text=${text}`, "_blank");
                    }}
                    className="w-full py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-[11px] shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp 💬</span>
                  </button>

                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => setCandlesBlown(false)}
                      className="flex-1 py-1.5 rounded-xl bg-pink-50 text-[#D1264F] font-bold text-[10px] border border-pink-200 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Relight 🕯️</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToChapter(1)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Replay 🔁</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
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
            <span className="text-[10px] text-[#D1264F] bg-rose-100/90 px-2 py-0.5 rounded-full font-black">
              Page {activePreviewChapter}/10
            </span>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-[#D1264F] border border-rose-200">
            <Link2 className="w-3 h-3" />
            <span>Synced</span>
          </div>
        </div>

        {/* 10 Quick Page Switcher Buttons */}
        <div className="flex items-center justify-between gap-1 p-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-2xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => {
            const isCurrent = activePreviewChapter === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => goToChapter(s)}
                title={`Jump to Page ${s}`}
                className={`flex-1 py-1 text-[11px] font-black rounded-xl transition-all cursor-pointer relative ${
                  isCurrent
                    ? "bg-[#D1264F] text-white shadow-xs scale-105"
                    : "text-slate-500 hover:text-rose-600 hover:bg-rose-50/60"
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
      <div className="relative w-[340px] sm:w-[370px] h-[680px] sm:h-[720px] bg-[#0E131C] rounded-[52px] p-2.5 sm:p-3 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5),0_0_35px_rgba(209,38,79,0.15)] border-[4px] border-[#222A3B] ring-1 ring-white/10 flex flex-col justify-between overflow-visible">
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
          style={{
            background: "linear-gradient(180deg, #FFF8F1 0%, #FCEFE5 100%)",
          }}
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

          {/* Floating Ambient Sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
            <span className="absolute top-16 left-4 text-pink-400 text-xs">✨</span>
            <span className="absolute top-24 right-5 text-amber-400 text-xs">🎈</span>
            <span className="absolute bottom-20 left-6 text-pink-300 text-xs">🎉</span>
            <span className="absolute bottom-28 right-6 text-rose-300 text-xs">✨</span>
          </div>

          {/* SCREEN CONTENT AREA (Scrollable & Responsive) */}
          <div className="relative z-10 flex-1 overflow-y-auto px-3.5 py-2 flex flex-col justify-center scrollbar-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePreviewChapter}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col justify-center"
              >
                {renderPhoneScene()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM HOME INDICATOR & STEP TRACK */}
          <div className="relative z-20 pb-2 pt-1 flex flex-col items-center gap-1.5">
            {/* Step navigation dots */}
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
                <span
                  key={dot}
                  onClick={() => goToChapter(dot)}
                  className={`rounded-full transition-all cursor-pointer ${
                    dot === activePreviewChapter
                      ? "w-3 h-1 bg-[#D1264F]"
                      : "w-1 h-1 bg-slate-300 hover:bg-rose-300"
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
