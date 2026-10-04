"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import LoveSurpriseTemplate from "./LoveSurpriseTemplate";
import { soundFx } from "@/lib/soundFx";

interface ExperienceTheMagicSectionProps {
  recipientName?: string;
}

export default function ExperienceTheMagicSection({
  recipientName = "Sarah",
}: ExperienceTheMagicSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Sync fullscreen state if user exits via ESC or browser controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleStartPlay = () => {
    soundFx.playPop();
    setIsPlaying(true);
  };

  const handleToggleFullscreen = async () => {
    soundFx.playPop();
    try {
      if (!document.fullscreenElement) {
        if (playerContainerRef.current?.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          window.open("/demo", "_blank");
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      window.open("/demo", "_blank");
    }
  };

  return (
    <section
      id="demo-experience"
      className="w-full py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#FFFDFE] via-[#FDF3F8]/50 to-[#FFFDFE] border-b border-pink-100/60 relative"
    >
      <div className="max-w-4xl mx-auto space-y-7 text-center">
        {/* Header Tag / Pill */}
        <div className="flex justify-center">
          <span className="inline-block px-4 py-1 rounded-full bg-[#FCE7F3] text-[#FF2E63] text-xs font-black tracking-wider uppercase shadow-2xs">
            TRY IT NOW
          </span>
        </div>

        {/* Heading & Subtitle (media_1791134490359.png) */}
        <div className="space-y-2.5 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Experience the Magic
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Click play to see exactly what your recipient will experience - all 15 interactive stages!
          </p>
        </div>

        {/* Video / Interactive Player Card Frame */}
        <div
          ref={playerContainerRef}
          className={`relative w-full max-w-4xl mx-auto rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white shadow-2xl shadow-pink-900/10 border border-slate-200/80 transition-all text-left ${
            isFullscreen
              ? "fixed inset-0 z-50 rounded-none max-w-none h-screen flex flex-col justify-between bg-white"
              : ""
          }`}
        >
          {/* Main Stage Screen: Preview Cover or Live Interactive Template */}
          <div className="relative min-h-[360px] sm:min-h-[440px] flex-1 flex flex-col bg-[#FDFBF7]">
            <AnimatePresence mode="wait">
              {!isPlaying ? (
                /* ======================================================= */
                /* PREVIEW COVER STATE (matching reference mockup)         */
                /* ======================================================= */
                <motion.div
                  key="cover-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex-1 w-full min-h-[360px] sm:min-h-[440px] flex flex-col items-center justify-center p-6 sm:p-10 select-none overflow-hidden"
                  style={{
                    backgroundColor: "#CBC0C2",
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, rgba(245,238,241,0.55) 0%, rgba(203,192,194,0.95) 85%)",
                  }}
                >
                  {/* Floating Ambient Sparkles and Hearts (Matching Reference) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="absolute top-10 left-12 text-pink-400 text-lg opacity-80">
                      💕
                    </span>
                    <span className="absolute top-8 right-20 text-amber-300 text-base opacity-90">
                      ✨
                    </span>
                    <span className="absolute top-1/2 left-10 -translate-y-4 text-amber-300 text-sm opacity-90">
                      ✨
                    </span>
                    <span className="absolute top-1/2 right-12 -translate-y-2 text-pink-400 text-lg opacity-80">
                      💕
                    </span>
                    <span className="absolute bottom-12 right-28 text-pink-400 text-sm opacity-75">
                      💖
                    </span>
                    <span className="absolute bottom-10 left-20 text-pink-400 text-sm opacity-75">
                      💗
                    </span>
                  </div>

                  {/* Center Content Mockup */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    {/* Clustered 3 Hearts */}
                    <div className="flex items-center justify-center -space-x-1 mb-1.5">
                      <span className="text-xl transform -rotate-12">💖</span>
                      <span className="text-2xl transform -translate-y-1">❤️</span>
                      <span className="text-xl transform rotate-12">💕</span>
                    </div>

                    {/* Recipient Title (With Play Button layered directly in center) */}
                    <div className="relative flex items-center justify-center min-h-[70px] sm:min-h-[80px]">
                      <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Hello, Sarah
                      </h3>

                      {/* Centered Large Circular Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          id="play-demo-btn"
                          type="button"
                          onClick={handleStartPlay}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-2xl hover:shadow-pink-500/30 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all group border border-white/90"
                          title="Play Experience"
                        >
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#FF2E63] text-[#FF2E63] ml-1 group-hover:scale-105 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Subdued text under play button */}
                    <p className="text-xs sm:text-sm text-slate-700/75 font-medium mt-2">
                      I made something special for you...
                    </p>

                    {/* White/cream Try Experience prompt matching image */}
                    <p className="text-xs sm:text-sm font-extrabold text-white/90 drop-shadow-xs mt-1">
                      Try the Experience
                    </p>

                    {/* Pagination Dots Preview */}
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63]" />
                      {[...Array(7)].map((_, i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/40"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ======================================================= */
                /* LIVE INTERACTIVE TEMPLATE (when playing)                */
                /* ======================================================= */
                <motion.div
                  key="active-template"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 w-full flex flex-col"
                >
                  <LoveSurpriseTemplate
                    isEmbedded={true}
                    onClose={() => setIsPlaying(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player Bottom Control Bar (media_1791134490359.png) */}
          <div className="bg-white border-t border-slate-100 px-5 sm:px-7 py-3.5 sm:py-4 flex items-center justify-between z-20">
            {/* Left Info */}
            <div className="text-left space-y-0.5">
              <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                Live Interactive Demo
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Tap through the full experience
              </p>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {isPlaying && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Return to preview cover"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cover</span>
                </button>
              )}

              <button
                id="fullscreen-demo-btn"
                type="button"
                onClick={handleToggleFullscreen}
                className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-pink-200 hover:border-pink-300 bg-white hover:bg-pink-50/60 text-[#FF2E63] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                title={isFullscreen ? "Exit Fullscreen" : "View in Fullscreen"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
