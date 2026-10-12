"use client";

import React from "react";
import { Camera, Sparkles, MessageCircleHeart } from "lucide-react";

export default function HeroInteractivePhone() {
  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center select-none">
      {/* =================================================================== */}
      {/* 3 HARDWARE-ACCELERATED CALLOUT BADGES (60FPS Pure CSS)             */}
      {/* =================================================================== */}

      {/* Badge 1: Top-Left (Photo Gallery) */}
      <div
        className="absolute -top-3 -left-6 sm:-left-12 z-30 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 flex items-center gap-2.5 max-w-[170px] will-change-transform pointer-events-none"
        style={{ animation: "badgeFloat1 4s ease-in-out infinite" }}
      >
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Camera className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-left">
          <p className="text-xs font-extrabold text-slate-900 leading-tight">Photo Gallery</p>
          <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">Your memories</p>
        </div>
      </div>

      {/* Badge 2: Top-Right (Animations) */}
      <div
        className="absolute top-36 -right-6 sm:-right-12 z-30 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 flex items-center gap-2.5 max-w-[175px] will-change-transform pointer-events-none"
        style={{ animation: "badgeFloat2 4.5s ease-in-out infinite 0.6s" }}
      >
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-left">
          <p className="text-xs font-extrabold text-slate-900 leading-tight">Animations</p>
          <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">Beautiful effects</p>
        </div>
      </div>

      {/* Badge 3: Bottom-Left (Love Quiz) */}
      <div
        className="absolute bottom-24 -left-6 sm:-left-12 z-30 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 flex items-center gap-2.5 max-w-[180px] will-change-transform pointer-events-none"
        style={{ animation: "badgeFloat1 3.8s ease-in-out infinite 1s" }}
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <MessageCircleHeart className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-left">
          <p className="text-xs font-extrabold text-slate-900 leading-tight">Love Quiz</p>
          <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">Test their knowledge</p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* STATIC IPHONE HARDWARE FRAME (Matching media_1791140351860.png)    */}
      {/* =================================================================== */}
      <div className="relative w-[285px] sm:w-[315px] h-[570px] sm:h-[610px] bg-[#141B26] rounded-[48px] p-3 shadow-2xl border-4 border-[#1E2738] ring-1 ring-slate-900/40 flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island Notch Pill */}
        <div className="absolute top-4 inset-x-0 z-40 flex justify-center pointer-events-none">
          <div className="w-24 h-5 rounded-full bg-black flex items-center justify-end px-2.5">
            <span className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          </div>
        </div>

        {/* Static Screen View */}
        <div className="relative w-full h-full rounded-[38px] bg-gradient-to-b from-[#FFF2F5] via-[#FFF0F4] to-[#FDF0F4] overflow-hidden flex flex-col justify-between p-5 pt-12 pb-6 text-center shadow-inner">
          {/* Ambient Hearts in Background (Matching screenshot) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span className="absolute top-7 left-6 text-pink-500 text-lg opacity-90 drop-shadow-xs">
              💕
            </span>
            <span className="absolute top-12 right-7 text-rose-500 text-base opacity-90 drop-shadow-xs">
              💖✨
            </span>
            <span className="absolute bottom-16 left-8 text-pink-400 text-base opacity-80">
              💗
            </span>
          </div>

          {/* Centered White Greeting Card (media_1791140351860.png) */}
          <div className="relative z-10 w-full max-w-[230px] sm:max-w-[245px] mx-auto bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-pink-900/5 text-center border border-pink-100/70 my-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>Hello, Sarah</span>
              <span className="text-[#FF2E63]">💕</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              I made something special for you...
            </p>

            <p className="text-xs font-semibold text-pink-500 pt-1">
              Let&apos;s begin...
            </p>

            <div className="pt-1.5">
              <span className="px-7 py-2.5 rounded-full bg-[#FF2E63] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 inline-block">
                Let&apos;s Go
              </span>
            </div>
          </div>

          {/* 9 Pagination Dots Preview (Matching media_1791140351860.png) */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-[#FF2E63] shadow-xs" />
            {[...Array(8)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-pink-200/70" />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes badgeFloat1 {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -6px, 0); }
        }
        @keyframes badgeFloat2 {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 6px, 0); }
        }
      `}</style>
    </div>
  );
}
