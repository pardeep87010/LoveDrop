"use client";

import React from "react";
import { Heart, Sparkles, MessageCircleHeart, Clock, Cookie, HelpCircle, Check, Camera } from "lucide-react";

interface PagePreviewCardProps {
  step: number;
  recipientName: string;
  senderName: string;
  question: string;
  letterText: string;
  photos: { image: string; caption: string }[];
  reasons: { id: number; emoji: string; title: string }[];
  milestones: { icon: string; date: string; title: string; description: string }[];
  quizQuestions: { id: number; question: string; options: string[]; correct: string }[];
  fortuneQuotes: string[];
  themeColor?: string;
  themeBg?: string;
}

export default function PagePreviewCard({
  step,
  recipientName,
  senderName,
  question,
  letterText,
  photos,
  reasons,
  milestones,
  quizQuestions,
  fortuneQuotes,
  themeColor = "#FF2E63",
  themeBg = "#FFF0F4",
}: PagePreviewCardProps) {
  return (
    <div className="w-full max-w-[300px] mx-auto select-none">
      <div className="text-center mb-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-pink-500" />
        <span>Live Recipient Preview</span>
      </div>

      {/* Phone Hardware Mockup Frame */}
      <div className="relative w-full h-[400px] bg-[#141B26] rounded-[38px] p-2.5 shadow-xl border-4 border-[#1E2738] flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island Notch */}
        <div className="absolute top-3 inset-x-0 z-30 flex justify-center pointer-events-none">
          <div className="w-20 h-4 rounded-full bg-black flex items-center justify-end px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
        </div>

        {/* Screen Content Container */}
        <div
          className="relative w-full h-full rounded-[30px] overflow-hidden flex flex-col justify-between p-3.5 pt-8 pb-3 shadow-inner"
          style={{ backgroundColor: themeBg }}
        >
          {/* Ambient Hearts in top corners */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80">
            <span className="absolute top-5 left-4 text-pink-500 text-xs">💕</span>
            <span className="absolute top-6 right-4 text-rose-500 text-xs">💖✨</span>
          </div>

          {/* ========================================================= */}
          {/* STEP 1: WELCOME & INTRO PREVIEW                           */}
          {/* ========================================================= */}
          {step === 1 && (
            <div className="relative z-10 my-auto bg-white rounded-2xl p-4 shadow-md text-center space-y-2 border border-pink-100">
              <h4 className="text-base font-black text-slate-900 flex items-center justify-center gap-1">
                <span>Hello, {recipientName || "My Love"}</span>
                <span className="text-[#FF2E63]">💕</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                I made something special for you...
              </p>
              <p className="text-[10px] font-semibold text-pink-500 pt-0.5">Let&apos;s begin...</p>
              <div className="pt-1">
                <span
                  className="px-5 py-1.5 rounded-full text-white font-extrabold text-[11px] shadow-sm inline-block"
                  style={{ backgroundColor: themeColor }}
                >
                  Let&apos;s Go
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: THE BIG QUESTION PREVIEW                          */}
          {/* ========================================================= */}
          {step === 2 && (
            <div className="relative z-10 my-auto bg-white rounded-2xl p-4 shadow-md text-center space-y-3 border border-pink-100">
              <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto shadow-xs">
                <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
              </div>
              <h4 className="text-sm font-black text-slate-900 leading-tight">
                {question || "Do you love me??"}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">Think carefully before answering...</p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className="px-4 py-1.5 rounded-full text-white font-black text-xs shadow-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  YES! ❤️
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-400 font-semibold text-[10px] border border-slate-200">
                  No 💔
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: LOVE LETTER PREVIEW                               */}
          {/* ========================================================= */}
          {step === 3 && (
            <div className="relative z-10 my-auto bg-[#FFFDF8] rounded-2xl p-3.5 shadow-md border border-amber-100 text-left space-y-2 font-serif">
              <div className="flex items-center justify-between border-b border-amber-200/50 pb-1.5">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700">
                  A Letter For You
                </span>
                <span className="text-xs">💌</span>
              </div>
              <p className="text-[10px] font-sans text-slate-700 font-medium italic line-clamp-6 leading-relaxed">
                {letterText || "From the moment you entered my life..."}
              </p>
              <div className="text-right pt-1 font-sans text-[10px] font-bold text-rose-500">
                Forever yours, {senderName || "Me"} 💕
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: PHOTO MEMORIES PREVIEW                            */}
          {/* ========================================================= */}
          {step === 4 && (
            <div className="relative z-10 my-auto bg-white rounded-2xl p-2.5 shadow-md border border-pink-100 space-y-2 text-center">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[0]?.image || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600"}
                  alt="Memory preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-700 truncate px-1">
                {photos[0]?.caption || "Our favorite moments together"}
              </p>
              <span className="text-[9px] font-semibold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full inline-block">
                {photos.length} Memories Saved
              </span>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: REASONS I LOVE YOU PREVIEW                        */}
          {/* ========================================================= */}
          {step === 5 && (
            <div className="relative z-10 my-auto space-y-1.5">
              <p className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider text-center">
                Reasons I Love You
              </p>
              <div className="space-y-1">
                {reasons.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-2 rounded-xl bg-white/95 border border-pink-100 shadow-2xs flex items-center gap-2"
                  >
                    <span className="text-xs">{r.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-700 truncate">{r.title}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-pink-500 font-semibold text-center">+ {reasons.length - 3} more reasons</p>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 6: OUR STORY / TIMELINE PREVIEW                      */}
          {/* ========================================================= */}
          {step === 6 && (
            <div className="relative z-10 my-auto bg-white rounded-2xl p-3 shadow-md border border-pink-100 space-y-2">
              <div className="text-center space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-pink-500">Our Story</span>
                <h5 className="text-xs font-black text-slate-900">{milestones[0]?.title || "We Met"}</h5>
                <span className="text-[9px] text-slate-400 font-medium">{milestones[0]?.date || "June 2023"}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium text-center italic bg-pink-50/60 p-2 rounded-xl">
                &quot;{milestones[0]?.description || "At that coffee shop on Main Street"}&quot;
              </p>
              <div className="flex justify-center gap-1 pt-0.5">
                {milestones.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all ${i === 0 ? "w-4 bg-pink-500" : "w-1.5 bg-pink-200"}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 7: LOVE QUIZ PREVIEW                                 */}
          {step === 7 && (
            <div className="relative z-10 my-auto bg-white rounded-2xl p-3 shadow-md border border-pink-100 space-y-2">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                <span className="text-pink-500">Love Quiz</span>
                <span>Question 1 of {quizQuestions.length}</span>
              </div>
              <h5 className="text-[11px] font-black text-slate-900 leading-tight">
                {quizQuestions[0]?.question || "What's my favorite food?"}
              </h5>
              <div className="space-y-1">
                {quizQuestions[0]?.options.slice(0, 3).map((opt, i) => (
                  <div
                    key={i}
                    className={`p-1.5 rounded-lg text-[9px] font-bold flex items-center justify-between border ${
                      opt === quizQuestions[0]?.correct
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-600 border-slate-100"
                    }`}
                  >
                    <span>{opt}</span>
                    {opt === quizQuestions[0]?.correct && <Check className="w-3 h-3 text-emerald-600" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 8: FORTUNE COOKIES PREVIEW                           */}
          {step === 8 && (
            <div className="relative z-10 my-auto bg-white rounded-2xl p-3 shadow-md border border-pink-100 text-center space-y-2">
              <span className="text-xl inline-block animate-bounce">🥠</span>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-pink-500">
                Our Love Prophecy
              </p>
              <p className="text-[10px] font-bold text-slate-800 italic leading-relaxed px-1">
                &quot;{fortuneQuotes[0] || "A lifetime of happiness awaits you two"}&quot;
              </p>
              <div className="flex items-center justify-center gap-1 text-[9px] text-amber-500 font-bold">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 9: GRAND FINALE / LAUNCH PREVIEW                     */}
          {step === 9 && (
            <div className="relative z-10 my-auto bg-white rounded-2xl p-4 shadow-md border border-pink-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h5 className="text-xs font-black text-slate-900">Your LoveLink is Ready!</h5>
              <p className="text-[10px] text-slate-500 leading-tight">
                {recipientName || "Sarah"} will experience all chapters seamlessly!
              </p>
              <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 font-bold text-[9px] inline-block border border-pink-200">
                Interactive Link + Printable QR
              </span>
            </div>
          )}

          {/* Bottom Pagination Indicator */}
          <div className="relative z-10 flex items-center justify-center gap-1 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dot) => (
              <span
                key={dot}
                className={`rounded-full transition-all ${
                  dot === step ? "w-3 h-1.5 bg-[#FF2E63]" : "w-1 h-1 bg-pink-200/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
