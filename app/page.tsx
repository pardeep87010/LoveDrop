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
  Gift,
  PartyPopper,
  Globe,
  Calendar,
  Ticket,
  HeartHandshake,
  Gamepad2,
  Compass,
  Printer,
  Download,
  QrCode,
  Palette,
  Share2,
} from "lucide-react";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import HeroInteractivePhone from "@/components/experience/HeroInteractivePhone";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Active stage for 15 Magical Stages
  const [activeStage, setActiveStage] = useState<number>(2);

  // Selected style for Choose Your Style
  const [selectedStyle, setSelectedStyle] = useState<string>("classic-romance");

  // Every Special Occasion (Image 2)
  const occasions = [
    {
      id: "anniversary",
      title: "Anniversaries",
      subtitle: "Celebrate your journey together",
      icon: Heart,
      link: "/create?occasion=anniversary",
    },
    {
      id: "valentines",
      title: "Valentine's Day",
      subtitle: "The perfect romantic surprise",
      icon: PartyPopper,
      link: "/create?occasion=valentines",
    },
    {
      id: "birthday",
      title: "Birthdays",
      subtitle: "A gift they'll never forget",
      icon: Gift,
      link: "/create?occasion=birthday",
    },
    {
      id: "just-because",
      title: "Just Because",
      subtitle: "Show love any day",
      icon: Smile,
      link: "/create?occasion=just-because",
    },
    {
      id: "long-distance",
      title: "Long Distance",
      subtitle: "Bridge the miles with love",
      icon: Globe,
      link: "/create?occasion=long-distance",
    },
    {
      id: "proposal",
      title: "Proposals",
      subtitle: "Pop the question memorably",
      icon: Sparkles,
      link: "/create?occasion=proposal",
    },
  ];

  // 15 Magical Stages (Image 1)
  const stages = [
    { id: 1, title: "Welcome", emoji: "👏", desc: "Personalized animated entry gate with romantic background music & glowing envelope" },
    { id: 2, title: "Love Question", emoji: "💕", desc: "The viral runaway 'NO' button that teleports across screen until she taps YES" },
    { id: 3, title: "Your Letter", emoji: "✉️", desc: "Wax-sealed digital parchment in romantic cursive handwriting with audio opening sound" },
    { id: 4, title: "Photo Memories", emoji: "📷", desc: "Vintage polaroid memories framed with authentic washi tape and date timestamps" },
    { id: 5, title: "Reasons I Love You", emoji: "💝", desc: "Heartfelt bullet cards that detail the 3 sweetest reasons you adore them" },
    { id: 6, title: "Our Timeline", emoji: "📅", desc: "Interactive chronological story of every major milestone in your relationship" },
    { id: 7, title: "Love Quiz", emoji: "🎯", desc: "Playful couple trivia to see how well they remember your firsts and inside jokes" },
    { id: 8, title: "Compliments", emoji: "🎰", desc: "Slot-machine tap to reveal adorable compliments and heartwarming messages" },
    { id: 9, title: "Fortune Cookies", emoji: "🥠", desc: "Crack open an adorable love prophecy crafted especially for your future together" },
    { id: 10, title: "Scratch Cards", emoji: "🎫", desc: "Interactive scratch-off coupon for late night ice cream or free massage favors" },
    { id: 11, title: "Promise Wall", emoji: "🤝", desc: "Forever promises & cute relationship vows locked in wax for eternity" },
    { id: 12, title: "Love Catcher", emoji: "🎮", desc: "Playful mini-game to catch falling hearts before time runs out" },
    { id: 13, title: "Future Adventures", emoji: "🗺️", desc: "Shared bucket list of places you'll visit and bucket-list trips to take" },
    { id: 14, title: "Spin Wheel", emoji: "🎡", desc: "Interactive spin-the-wheel for dinner dates, cozy movie nights, and warm cuddles" },
    { id: 15, title: "Declaration", emoji: "🎉", desc: "Celebration confetti blast and instant real-time WhatsApp alert ping to your phone" },
  ];

  // Choose Your Style (Image 5)
  const styles = [
    {
      id: "classic-romance",
      title: "Classic Romance",
      bgColor: "bg-[#FFF0F3]",
      borderColor: "border-rose-200",
      badgeColor: "bg-[#FF3366]",
      textColor: "text-[#FF3366]",
      tag: "Romantic & Elegant",
      previewText: "Will you be mine forever? 💖",
    },
    {
      id: "first-love",
      title: "First Love",
      bgColor: "bg-[#F0FAF7]",
      borderColor: "border-emerald-200",
      badgeColor: "bg-[#00B894]",
      textColor: "text-[#00B894]",
      tag: "Fresh & Sweet",
      previewText: "Remember our first late-night chai? ☕",
    },
    {
      id: "minimalist-love",
      title: "Minimalist Love",
      bgColor: "bg-[#F3F0FF]",
      borderColor: "border-purple-200",
      badgeColor: "bg-[#6C5CE7]",
      textColor: "text-[#6C5CE7]",
      tag: "Modern & Clean",
      previewText: "Simple. Pure. Forever. ✨",
    },
    {
      id: "eternal-vows",
      title: "Eternal Vows",
      bgColor: "bg-[#FFF0F6]",
      borderColor: "border-pink-200",
      badgeColor: "bg-[#D63031]",
      textColor: "text-[#D63031]",
      tag: "Deep & Passionate",
      previewText: "In every lifetime, I'd choose you. 💍",
    },
    {
      id: "garden-of-love",
      title: "Garden of Love",
      bgColor: "bg-[#F0FFF4]",
      borderColor: "border-green-200",
      badgeColor: "bg-[#00A86B]",
      textColor: "text-[#00A86B]",
      tag: "Serene & Blooming",
      previewText: "You make my whole world bloom. 🌸",
    },
    {
      id: "long-distance-love",
      title: "Long Distance Love",
      bgColor: "bg-[#F0F7FF]",
      borderColor: "border-blue-200",
      badgeColor: "bg-[#0984E3]",
      textColor: "text-[#0984E3]",
      tag: "Connected Hearts",
      previewText: "Miles apart, never in heart. 🌍",
    },
  ];

  // Sharing Channels (Image 4)
  const sharingChannels = [
    {
      icon: Printer,
      title: "Print & Frame",
      subtitle: "Put it on a card or canvas",
    },
    {
      icon: MessageCircle,
      title: "Text It",
      subtitle: "Share the link instantly on WhatsApp",
    },
    {
      icon: Mail,
      title: "Email",
      subtitle: "Send directly to their inbox",
    },
    {
      icon: Download,
      title: "Download",
      subtitle: "Save as high-res 300 DPI PNG",
    },
  ];

  // 3 Steps (Image 3)
  const threeSteps = [
    {
      num: "1",
      title: "Write Your Heart Out",
      desc: "Add your love letter, upload photos, create quizzes, and personalize every detail. Our editor makes it easy.",
    },
    {
      num: "2",
      title: "Preview & Perfect",
      desc: "See exactly what they'll experience. Edit anything until it's just right. Auto-saves as you go.",
    },
    {
      num: "3",
      title: "Share the Love",
      desc: "Get your unique link or QR code. Send it however you like - text, email, or print the QR code!",
    },
  ];

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
        <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#FDE2E6] via-[#FFF0F3] to-[#FDFBF7]">
          {/* Ambient romantic radial glow matching reference image */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-[#FEC6CF]/60 via-[#FEDAE0]/30 to-transparent blur-3xl pointer-events-none -z-0" />

          <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20 z-10">
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
        </div>

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
        {/* 2.1 EVERY SPECIAL OCCASION (MATCHING REFERENCE IMAGE 2) */}
        {/* =================================================================== */}
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6 bg-[#FDFBF7]">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header with pill tag */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-extrabold uppercase tracking-wider">
                PERFECT FOR
              </span>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Every Special Occasion
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Whether near or far, make your loved ones feel extra special
              </p>
            </div>

            {/* 6 Occasion Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {occasions.map((occ) => {
                const IconComponent = occ.icon;
                return (
                  <Link
                    key={occ.id}
                    href={occ.link}
                    onClick={() => soundFx.playPop()}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-rose-100 hover:border-rose-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-start space-y-3 cursor-pointer group active:scale-95"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                        {occ.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {occ.subtitle}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2.2 15 MAGICAL STAGES INCLUDE (MATCHING REFERENCE IMAGE 1) */}
        {/* =================================================================== */}
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6 bg-white border-y border-rose-100/80">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-extrabold uppercase tracking-wider">
                INTERACTIVE SURPRISE ENGINE
              </span>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                15 Magical Stages Include
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Every LoveLink surprise is packed with delightful micro-interactions designed to make them smile, blush, and say yes.
              </p>
            </div>

            {/* 15 Cards Grid: 3 rows of 5 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {stages.map((stg) => {
                const isActive = activeStage === stg.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => {
                      soundFx.playPop();
                      setActiveStage(stg.id);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group relative ${
                      isActive
                        ? "bg-[#FFF0F3] border-2 border-rose-500 shadow-sm scale-[1.02]"
                        : "bg-white border border-rose-100 hover:border-rose-300 hover:shadow-xs hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl select-none group-hover:scale-110 transition-transform">
                      {stg.emoji}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-600 transition-colors">
                      {stg.title}
                    </span>
                    {isActive && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-rose-600 text-[9px] font-extrabold text-white uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stage Detail Spotlight Box (Our unique interactive touch!) */}
            {activeStage && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FDFBF7] border border-rose-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-rose-100 text-3xl flex items-center justify-center shrink-0 shadow-xs">
                    {stages.find((s) => s.id === activeStage)?.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                        Stage {activeStage} of 15
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {stages.find((s) => s.id === activeStage)?.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      {stages.find((s) => s.id === activeStage)?.desc}
                    </p>
                  </div>
                </div>

                <Link
                  href="/create"
                  onClick={() => soundFx.playPop()}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                >
                  <span>Build This Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
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
        {/* 4. CHOOSE YOUR STYLE / TEMPLATES (MATCHING REFERENCE IMAGE 5) */}
        {/* =================================================================== */}
        <section id="styles" className="w-full bg-[#FDFBF7] py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header with pill tag */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-600 text-xs font-extrabold uppercase tracking-wider">
                <Palette className="w-3.5 h-3.5" />
                BEAUTIFUL TEMPLATES
              </span>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Choose Your Style
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                From classic romance to modern minimalist, find the perfect theme for your love story
              </p>
            </div>

            {/* 6 Template Cards (Matching Image 5) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {styles.map((stl) => {
                const isSelected = selectedStyle === stl.id;
                return (
                  <div
                    key={stl.id}
                    onClick={() => {
                      soundFx.playPop();
                      setSelectedStyle(stl.id);
                    }}
                    className={`h-72 rounded-3xl ${stl.bgColor} border transition-all flex flex-col justify-between p-4 cursor-pointer relative group overflow-hidden ${
                      isSelected
                        ? "border-rose-500 shadow-md ring-2 ring-rose-500/50 scale-[1.02]"
                        : "border-slate-200/80 hover:border-rose-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Top status indicator if selected */}
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </span>
                    )}

                    {/* Central Glowing Icon Emblem with decorative lines */}
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                      <div
                        className={`w-14 h-14 rounded-full ${stl.badgeColor} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <Sparkles className="w-7 h-7" />
                      </div>
                      {/* Subtle decorative horizontal bars */}
                      <div className="space-y-1 w-12 flex flex-col items-center opacity-40">
                        <div className="w-10 h-1 rounded-full bg-slate-400" />
                        <div className="w-6 h-1 rounded-full bg-slate-300" />
                      </div>
                    </div>

                    {/* Bottom Title Pill */}
                    <div className="bg-white/95 backdrop-blur-xs py-2.5 px-3 rounded-2xl border border-white text-center shadow-xs">
                      <p className="font-extrabold text-xs text-slate-800 leading-tight">
                        {stl.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action & Template Count */}
            <div className="text-center space-y-2 pt-2">
              <Link
                href={`/create?theme=${selectedStyle}`}
                onClick={() => soundFx.playPop()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer group"
              >
                <span>Create Your Letter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs font-semibold text-slate-400">
                11 beautiful templates available • Instant preview &amp; switch anytime
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. A QR CODE WORTH FRAMING (MATCHING REFERENCE IMAGE 4) */}
        {/* =================================================================== */}
        <section className="w-full bg-white border-y border-rose-100/80 py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* LEFT COLUMN: REALISTIC POLAROID QR GIFT CARD */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group">
                  {/* Floating decorative mini hearts */}
                  <div className="absolute -top-3 -left-3 text-rose-500 text-lg select-none animate-bounce">❤️</div>
                  <div className="absolute top-1/2 -right-4 text-pink-400 text-xl select-none">💖</div>
                  <div className="absolute -bottom-2 left-6 text-rose-400 text-base select-none">✨</div>

                  {/* Printable Polaroid Card */}
                  <div className="w-72 sm:w-80 rounded-3xl bg-white p-6 shadow-2xl border border-rose-100/90 text-center space-y-4 hover:-rotate-1 transition-transform">
                    {/* Card Header */}
                    <div className="space-y-1">
                      <p className="font-extrabold text-sm text-slate-800 flex items-center justify-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>Scan to read my letter</span>
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        ourlove.in/p/sarah-love
                      </p>
                    </div>

                    {/* QR Code Container with Centered Heart Emblem */}
                    <div className="relative mx-auto w-48 h-48 bg-[#FDFBF7] p-3 rounded-2xl border border-slate-100 flex items-center justify-center shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fourlove.in%2Fcreate"
                        alt="LoveLink QR Code"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center">
                          <div className="w-full h-full rounded-lg bg-rose-600 flex items-center justify-center">
                            <Heart className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-1 border-t border-slate-100 space-y-0.5">
                      <p className="font-extrabold text-sm text-slate-900">
                        For Sarah 💕
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        From Michael
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: HEADLINE, 4 CHANNELS & CREATIVE IDEAS BOX */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Eyebrow */}
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-extrabold uppercase tracking-wider">
                  SHARE BEAUTIFULLY
                </span>

                {/* Headline */}
                <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                  A QR Code Worth{" "}
                  <span className="text-rose-600">Framing</span>
                </h2>

                {/* Description */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  Every letter comes with a gorgeous QR code you can print, frame, or add to a gift. Watch their face light up when they scan it and your interactive love story begins.
                </p>

                {/* 4 Sharing Channels (2x2 Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {sharingChannels.map((channel, i) => {
                    const IconComponent = channel.icon;
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-rose-100 flex items-center gap-3.5 shadow-xs hover:border-rose-300 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-slate-900">
                            {channel.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {channel.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Creative Ideas Box (Matching Reference Image 4) */}
                <div className="p-5 rounded-2xl bg-[#FFF5F6] border border-rose-200/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Creative Ideas
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs font-medium text-slate-700">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Slip it in a birthday card or gift box</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Frame it as a permanent bedside keepsake</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Add to a scrapbook or physical photo album</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Hide it for a scavenger hunt surprise</span>
                    </li>
                  </ul>
                </div>
              </div>
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
        {/* 6. CREATE MAGIC IN 3 STEPS (MATCHING REFERENCE IMAGE 3) */}
        {/* =================================================================== */}
        <section id="how-it-works" className="w-full bg-[#FDFBF7] py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Header with pill tag */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-extrabold uppercase tracking-wider">
                SIMPLE PROCESS
              </span>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Create Magic in 3 Steps
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                No design skills needed. Just your love and 5 minutes.
              </p>
            </div>

            {/* 3 Step Nodes Connected by Line (Matching Image 3) */}
            <div className="relative">
              {/* Connecting Horizontal Line (desktop) */}
              <div className="hidden md:block absolute top-6 left-24 right-24 h-0.5 bg-rose-200 -z-0" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative z-10">
                {threeSteps.map((step) => (
                  <div key={step.num} className="text-center space-y-4">
                    {/* Pink Number Circle Badge */}
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-rose-500/30 mx-auto">
                      {step.num}
                    </div>

                    <div className="space-y-2 max-w-xs mx-auto">
                      <h3 className="font-extrabold text-lg text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Centered Pill Button CTA (Matching Image 3) */}
            <div className="pt-4 flex justify-center">
              <Link
                href="/create"
                onClick={() => soundFx.playPop()}
                className="px-9 py-4 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Start Creating Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
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
          <div
            className="max-w-4xl mx-auto p-8 sm:p-14 rounded-[38px] text-white text-center space-y-6 shadow-2xl shadow-rose-500/25 relative overflow-hidden bg-cover bg-top bg-[#FF5369]"
            style={{ backgroundImage: "url('/images/grand-cta-bg.jpg')" }}
          >
            {/* Top spacing to display the 3D heart balloon baked into the background image */}
            <div className="h-20 sm:h-28 pointer-events-none" />

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
