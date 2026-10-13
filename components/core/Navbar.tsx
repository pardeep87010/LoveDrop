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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="LoveDrop Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-1">
            <span className="font-black text-xl text-slate-900 tracking-tight leading-none">
              Love<span className="text-rose-600">Drop</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              .online
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
          <a
            href="/#how-it-works"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            How It Works
          </a>
          <a
            href="/#chapters"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            9 Chapters
          </a>
          <a
            href="/#themes"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            Themes &amp; Occasions
          </a>
          <a
            href="/#pricing"
            className="hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50/60"
          >
            Pricing
          </a>
          <a
            href="/#faq"
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
