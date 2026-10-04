"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star,
  Lock,
  MessageCircle,
  Eye,
  Camera,
  Mail,
  Smile,
  Check,
} from "lucide-react";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import HeroInteractivePhone from "@/components/experience/HeroInteractivePhone";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  // Theme filter state
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Love" | "Apology" | "Birthday">("All");

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const themes = [
    {
      id: "sorry-apology",
      title: "Heartfelt Apology (Maan Jao)",
      tagline: 'When she is mad at you: runaway "Abhi bhi gussa hu" button with funny apologies',
      emoji: "🥺",
      badge: "🕊️ Peace Maker",
      category: "Apology",
      question: "Maan Jao Na Baby? 🥺",
      buttonText: "Create Apology Card",
      link: "/create?theme=sorry-apology",
    },
    {
      id: "cat-proposal",
      title: "Cute Cat Proposal",
      tagline: 'The viral runaway "NO" button with adorable animated kittens & momos treat',
      emoji: "🐱",
      badge: "🔥 Most Viral",
      category: "Love",
      question: "Will you be mine forever? 💖",
      buttonText: "Create Proposal",
      link: "/create?theme=cat-proposal",
    },
    {
      id: "birthday-queen",
      title: "Happy Birthday My Queen",
      tagline: "Interactive virtual birthday cake with candles to blow out & heartfelt wishes",
      emoji: "🎂",
      badge: "🎉 Celebration",
      category: "Birthday",
      question: "Happy Birthday My Love! 🎂👑",
      buttonText: "Create Birthday Wish",
      link: "/create?theme=birthday-queen",
    },
    {
      id: "bubu-dudu-hugs",
      title: "Bubu & Dudu Squishy Hugs",
      tagline: "Squishy interactive hug-o-meter sending 1,000 warm virtual cuddles",
      emoji: "🧸",
      badge: "💕 Pure Comfort",
      category: "Love",
      question: "Sending you 1,000 Squishy Hugs! 💖",
      buttonText: "Create Hug Surprise",
      link: "/create?theme=bubu-dudu-hugs",
    },
    {
      id: "anniversary-memories",
      title: "Anniversary Love Journey",
      tagline: "Vintage wax-seal envelope with polaroid memories of your sweetest milestones",
      emoji: "💌",
      badge: "💍 Eternal Love",
      category: "Love",
      question: "365 Days of Loving You ✨",
      buttonText: "Create Love Note",
      link: "/create?theme=anniversary-memories",
    },
    {
      id: "coffee-date",
      title: "Late Night Chai & Coffee Date",
      tagline: "Cozy warm aesthetic celebrating your ordinary everyday conversations",
      emoji: "☕",
      badge: "✨ Cozy Vibes",
      category: "Love",
      question: "Chai date with me this evening? ☕",
      buttonText: "Create Chai Date",
      link: "/create?theme=coffee-date",
    },
  ];

  const filteredThemes =
    selectedCategory === "All"
      ? themes
      : themes.filter((t) => t.category === selectedCategory);

  const faqs = [
    {
      q: "Kya mujhe coding aani chahiye?",
      a: "Bilkul nahi! Aapko sirf apna aur unka naam enter karna hai. Saare emotional sparks, funny dialogues, polaroid templates aur animations 100% pre-written ready hote hain.",
    },
    {
      q: "WhatsApp alert kaise kaam karta hai?",
      a: "Jab aapki partner website kholegi aur 'YES' dabayegi ya surprise pura karegi, usi second aapke WhatsApp number par real-time alert aayega: 'Unhone YES bol diya! 🎉'.",
    },
    {
      q: "Kya koi screen-record karke free me chori kar sakta hai?",
      a: "Nahi! Preview mode me screen recording protect karne ke liye watermarks aur interactive lock laga hota hai. Payment ke baad hi clean custom link unlock hota hai.",
    },
    {
      q: "Website link kab tak active rahega?",
      a: "Aapka custom link poore 1 saal (365 days) tak active rehta hai unlimited views ke sath. Wo jab chahe ise kholkar dekh sakti hain.",
    },
    {
      q: "Payment kaise hoti hai?",
      a: "Instant 1-click UPI payments (Google Pay, PhonePe, Paytm, CRED) support karta hai. Payment hote hi 1 second me link screen par mil jata hai.",
    },
    {
      q: "Kya payment ke baad photos change kar sakte hain?",
      a: "Haan! KoiKoi ki tarah aap link unlock karne ke baad bhi photos aur letter text anytime update kar sakte hain.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 selection:bg-rose-100 selection:text-rose-700 font-sans flex flex-col justify-between">
      {/* Sticky Mirror-Matte Header */}
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        {/* =================================================================== */}
        {/* 1. HIGH-CONVERSION HERO SECTION (IN EYE-CATCHING 2-COLUMN GRID) */}
        {/* =================================================================== */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* --------------------------------------------------------------- */}
            {/* LEFT COLUMN: PUNCHY COPY & HIGH-IMPACT CTAS */}
            {/* --------------------------------------------------------------- */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Trust Tag (From Reference Image Style) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Made to be opened, not scrolled past • 14,800+ Hearts Melted</span>
              </div>

              {/* Bold Main Headline */}
              <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.12]">
                Turn Your Love Into an{" "}
                <span className="text-rose-600 block sm:inline">
                  Unforgettable Experience
                </span>
              </h1>

              {/* Subheading & Description */}
              <div className="space-y-2 max-w-xl text-slate-600 text-sm sm:text-base leading-relaxed">
                <p className="font-semibold text-slate-800">
                  LoveLink transforms your words into a magical interactive journey.
                </p>
                <p className="text-slate-500 font-medium text-xs sm:text-sm">
                  Create a personalized digital experience with animated wax-seal love letters,
                  polaroid memories, runaway &quot;NO&quot; buttons, and real-time WhatsApp alerts.
                  Share a secret link, and watch them smile all over again.
                </p>
              </div>

              {/* Action Buttons (Solid Single Color, No Gradients) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/create"
                  onClick={() => soundFx.playPop()}
                  className="px-7 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Create Your Surprise (₹99)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#chapters"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base rounded-full border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-rose-500" />
                  <span>See How It Works</span>
                </a>
              </div>

              {/* 3 Core Trust Checkmarks (Matching Image) */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  Ready in 2 minutes
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  Works on any phone
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  Instant WhatsApp alert
                </span>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* RIGHT COLUMN: INTERACTIVE SMARTPHONE WITH RUNNABLE CHAPTERS */}
            {/* --------------------------------------------------------------- */}
            <div className="lg:col-span-5 flex justify-center relative">
              <HeroInteractivePhone />
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. PROOF BAR / METRIC HIGHLIGHTS */}
        {/* =================================================================== */}
        <section className="w-full bg-white border-y border-rose-100/80 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <p className="font-extrabold text-2xl sm:text-3xl text-slate-900">14,800+</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Surprises Delivered
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-extrabold text-2xl sm:text-3xl text-rose-600">99.4%</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  She Said YES!
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-extrabold text-2xl sm:text-3xl text-slate-900">4.9 / 5.0</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Couples Rating ⭐
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-extrabold text-2xl sm:text-3xl text-emerald-600">₹99</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Transparent One-Time
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 3. THE 5-CHAPTER EXPERIENCE SHOWCASE */}
        {/* =================================================================== */}
        <section id="chapters" className="w-full py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                Interactive Journey
              </span>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Not Just a Message. A 5-Chapter Experience.
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Here is the exact journey your partner experiences when they click your secret link:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col justify-between hover:border-rose-300 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                    Chapter 1
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                    The Sealed Wax Envelope
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    She arrives at a personal sealed digital envelope with your names. Tapping the wax stamp physically unseals the letter with sound.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col justify-between hover:border-rose-300 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                    Chapter 2
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                    The Runaway &quot;NO&quot; Button
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    The viral game! If she tries to click &quot;No&quot;, the button teleports away with cute dialogues (&quot;Pakad ke dikhao! 😜&quot;) until she taps YES.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col justify-between hover:border-rose-300 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">
                    Chapter 3
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                    Polaroids &amp; 3 Sweet Reasons
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Couple memories framed as vintage Polaroids taped with washi tape, followed by the 3 specific reasons why you adore her.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col justify-between hover:border-rose-300 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                    Chapter 4
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                    The Handwritten Letter
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    A heartfelt message in cursive handwriting style that says what a plain text message never could.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col justify-between hover:border-rose-300 transition-colors md:col-span-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                    Chapter 5
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                    Celebration &amp; Real-Time WhatsApp Alert
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    As soon as she completes the experience, confetti explodes across her screen, and an instant notification pings your WhatsApp: &quot;She said YES! 🎉&quot;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. OCCASIONS & THEMES SHOWCASE */}
        {/* =================================================================== */}
        <section id="themes" className="w-full bg-white border-y border-rose-100/80 py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                  Curated Presets
                </span>
                <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                  Tailored For Every Romantic Moment
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Whether she is upset, it is her birthday, or you want to ask her out:
                </p>
              </div>

              {/* Category Filter Pills (Solid Color) */}
              <div className="flex flex-wrap gap-2">
                {(["All", "Love", "Apology", "Birthday"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundFx.playPop();
                      setSelectedCategory(cat);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredThemes.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-3xl bg-[#FDFBF7] border border-rose-100 shadow-sm flex flex-col justify-between hover:border-rose-400 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{t.emoji}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        {t.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        {t.tagline}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-rose-100 text-xs text-slate-700 font-semibold italic">
                      &quot;{t.question}&quot;
                    </div>
                  </div>

                  <Link
                    href={t.link}
                    onClick={() => soundFx.playPop()}
                    className="mt-4 w-full py-2.5 rounded-xl bg-white hover:bg-rose-600 text-slate-800 hover:text-white border border-slate-200 hover:border-rose-600 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{t.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. WHY LOVELINK BEATS BORING GIFTS (COMPARISON TABLE) */}
        {/* =================================================================== */}
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                The Real Difference
              </span>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Why LoveLink Beats Boring Gifts
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Most gifts are forgotten in 48 hours. An interactive digital surprise lasts forever.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 text-xs sm:text-sm font-bold border-b border-rose-100 bg-rose-50/50 p-4">
                <span className="text-slate-500">Feature</span>
                <span className="text-slate-500 text-center">Boring WhatsApp Text / Flowers</span>
                <span className="text-rose-600 text-center font-extrabold">LoveLink 2.0 Website</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <div className="grid grid-cols-3 p-4 items-center">
                  <span className="font-bold text-slate-800">Emotional Impact</span>
                  <span className="text-center text-slate-400">Gets lost in 100 other chats</span>
                  <span className="text-center font-extrabold text-rose-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Makes her cry happy tears 🥹
                  </span>
                </div>

                <div className="grid grid-cols-3 p-4 items-center">
                  <span className="font-bold text-slate-800">Interactive Fun</span>
                  <span className="text-center text-slate-400">Passive text / flowers wilt</span>
                  <span className="text-center font-extrabold text-rose-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Runaway &quot;NO&quot; button &amp; seal
                  </span>
                </div>

                <div className="grid grid-cols-3 p-4 items-center">
                  <span className="font-bold text-slate-800">Know Her Reaction</span>
                  <span className="text-center text-slate-400">Guessing if she opened it</span>
                  <span className="text-center font-extrabold text-rose-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Instant WhatsApp alert ping
                  </span>
                </div>

                <div className="grid grid-cols-3 p-4 items-center">
                  <span className="font-bold text-slate-800">Cost &amp; Value</span>
                  <span className="text-center text-slate-400">₹1,500+ for flowers that die</span>
                  <span className="text-center font-black text-slate-900 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Only ₹99 (1 full year access)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 6. HOW IT WORKS (3 SIMPLE STEPS) */}
        {/* =================================================================== */}
        <section id="how-it-works" className="w-full bg-white border-y border-rose-100/80 py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                Simple 3-Step Setup
              </span>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Ready in Less Than 2 Minutes
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                No design skills, no coding. We provide the emotional sparks, you provide the love.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-rose-100 shadow-sm space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  1
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Enter Names &amp; Sparks
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Enter her name and tap our curated emotional sparks to fill in sweet memories and inside jokes in seconds.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-rose-100 shadow-sm space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  2
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Unseal &amp; Test Live Preview
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Unseal the wax envelope right on your screen, test the dodging &quot;NO&quot; button, and unlock your link for ₹99.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-rose-100 shadow-sm space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  3
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Send Secret Link on WhatsApp
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  1-Tap send on WhatsApp. As soon as she opens it and clicks YES, you get an immediate alert on your phone!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 7. TRANSPARENT PRICING CARD (SOLID ROBUST STYLING) */}
        {/* =================================================================== */}
        <section id="pricing" className="w-full py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-500 shadow-md space-y-6 text-center">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider">
                Limited Time Special • 80% Off
              </span>

              <div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-400 line-through text-lg font-bold">₹499</span>
                  <span className="text-5xl font-black text-slate-900">₹99</span>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  One-time payment • No recurring charges
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 text-left text-xs font-semibold text-slate-700 py-3 border-y border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>100% Watermark-Free</strong> clean experience</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Real-Time WhatsApp Alert</strong> when she says YES</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>1 Full Year Active Link</strong> on mobile &amp; desktop</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Background romantic ambient audio included</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Add or edit photos anytime after unlocking</span>
                </div>
              </div>

              <Link
                href="/create"
                onClick={() => soundFx.playPop()}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>Create Website Now (₹99)</span>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Instant delivery via UPI (GPay, PhonePe, Paytm, QR)</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 8. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        {/* =================================================================== */}
        <section id="faq" className="w-full bg-white border-t border-rose-100/80 py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                Got Questions?
              </span>
              <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-rose-100/90 overflow-hidden bg-[#FDFBF7] transition-colors"
                  >
                    <button
                      onClick={() => {
                        soundFx.playPop();
                        setOpenFaq(isOpen ? null : idx);
                      }}
                      className="w-full p-4 sm:p-5 text-left font-extrabold text-sm text-slate-800 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 9. GRAND FINALE HIGH-CONVERSION CTA (VIBRANT CORAL-ROSE BANNER) */}
        {/* =================================================================== */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-6 bg-[#FDFBF7]">
          <div className="max-w-4xl mx-auto p-8 sm:p-14 rounded-[38px] bg-[#FF5369] text-white text-center space-y-6 shadow-2xl shadow-rose-500/25 relative overflow-hidden">
            {/* Background subtle decorative hearts */}
            <div className="absolute top-8 left-10 text-white/20 text-2xl select-none pointer-events-none">❤️</div>
            <div className="absolute top-20 right-14 text-white/20 text-3xl select-none pointer-events-none">💖</div>
            <div className="absolute bottom-10 left-16 text-white/20 text-xl select-none pointer-events-none">✨</div>
            <div className="absolute bottom-8 right-20 text-white/20 text-2xl select-none pointer-events-none">❤️</div>

            {/* 3D Glossy Floating Heart Balloon with Concentric Circles */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute -inset-4 rounded-full border border-white/20 bg-white/5" />
              <div className="absolute -inset-8 rounded-full border border-white/10" />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-300 flex items-center justify-center shadow-lg relative">
                  <div className="absolute top-1.5 left-2 w-3 h-1.5 rounded-full bg-white/70 blur-[0.4px] -rotate-45" />
                  <Heart className="w-6 h-6 fill-white text-white drop-shadow-sm" />
                </div>
                {/* Knot and string */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-700 rounded-full" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/50" />
              </motion.div>
            </div>

            {/* Headline matching image */}
            <h2 className="font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-[1.15] max-w-2xl mx-auto">
              Their reaction will be worth every second.
            </h2>

            {/* Subheading matching image */}
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed font-medium">
              You&apos;ve already imagined the moment. Now make it real. LoveLink takes your photos, your music, and your story and turns them into something they&apos;ll scan, share, and keep forever.
            </p>

            {/* Pill tag */}
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
              READY IN 2 MINUTES • 100% PRIVATE • ₹99 ONE-TIME
            </p>

            {/* Action Buttons & QR Code Matching Reference Image */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
              <Link
                href="/create"
                onClick={() => soundFx.playPop()}
                className="px-8 py-4 rounded-full bg-white hover:bg-rose-50 text-[#FF4D63] font-extrabold text-sm sm:text-base shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer group"
              >
                <span>Create Your LoveLink Website (₹99)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Scannable Phone QR Code */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 rounded-2xl bg-white shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fourlove.in%2Fcreate"
                    alt="Scan with phone"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold text-white/85">Or scan with your phone</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
