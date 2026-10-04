"use client";

import React from "react";
import Link from "next/link";
import { Heart, Sparkles, Zap, ArrowRight } from "lucide-react";
import { soundFx } from "@/lib/soundFx";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full mirror-matte border-b border-rose-100/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => soundFx.playPop()}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">
              Love<span className="text-rose-600">Link</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">
              PRO 2.0
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
          <a
            href="#how-it-works"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            How It Works
          </a>
          <a
            href="#chapters"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            5 Chapters
          </a>
          <a
            href="#themes"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            Themes &amp; Occasions
          </a>
          <a
            href="#pricing"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            FAQ
          </a>
        </nav>

        {/* Primary Action Button (Solid Color, No Gradient) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/create"
            onClick={() => soundFx.playPop()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>Create Website</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
