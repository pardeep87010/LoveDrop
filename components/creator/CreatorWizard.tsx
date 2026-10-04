"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import {
  Heart,
  Palette,
  PenLine,
  Camera,
  Sparkles,
  Eye,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Download,
  Smartphone,
  Play,
  Pause,
  ImagePlus,
  X,
  Lightbulb,
  Music,
  Calendar,
  MessageCircle,
  ExternalLink,
  Share2,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";
import { LoveSurpriseData, OccasionType, DodgeIntensity, AudioTrackId } from "@/lib/types";
import { generateSecureSlug, hashPasscode, sanitizeInput } from "@/lib/security";
import { saveSurpriseData } from "@/lib/storage";

interface CreatorWizardProps {
  initialOccasion?: OccasionType;
  initialTheme?: string;
}

// 6 Beautiful Themes matching reference image 2
const THEMES = [
  {
    id: "classic",
    name: "Classic",
    cardBg: "bg-[#FFF0F3]",
    cardBorder: "border-pink-200",
    accent: "#FF2E63",
    iconBg: "bg-[#FF2E63]",
    badgeColor: "text-[#FF2E63]",
  },
  {
    id: "classic-romance",
    name: "Classic Romance",
    cardBg: "bg-[#FDE2E6]",
    cardBorder: "border-rose-200",
    accent: "#E0245E",
    iconBg: "bg-[#E0245E]",
    badgeColor: "text-[#E0245E]",
  },
  {
    id: "first-love",
    name: "First Love",
    cardBg: "bg-[#E8F8F5]",
    cardBorder: "border-emerald-200",
    accent: "#10B981",
    iconBg: "bg-[#10B981]",
    badgeColor: "text-[#10B981]",
  },
  {
    id: "minimalist-love",
    name: "Minimalist Love",
    cardBg: "bg-[#F0F3FF]",
    cardBorder: "border-indigo-200",
    accent: "#6366F1",
    iconBg: "bg-[#6366F1]",
    badgeColor: "text-[#6366F1]",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    cardBg: "bg-[#FFF8E7]",
    cardBorder: "border-amber-200",
    accent: "#F59E0B",
    iconBg: "bg-[#F59E0B]",
    badgeColor: "text-[#F59E0B]",
  },
  {
    id: "midnight-galaxy",
    name: "Midnight Galaxy",
    cardBg: "bg-[#1A1D36]",
    cardBorder: "border-purple-900",
    accent: "#8B5CF6",
    iconBg: "bg-[#8B5CF6]",
    badgeColor: "text-[#8B5CF6]",
    dark: true,
  },
];

const WRITING_TIPS = [
  "What made you fall in love with them?",
  "Mention your favorite little habit of theirs that always makes you smile.",
  "Share a memory only the two of you know about.",
  "Tell them what your ordinary days feel like since they entered your life.",
];

const QUICK_STARTERS = [
  "Every moment with you feels like magic.",
  "You make my heart skip a beat.",
  "I fall more in love with you every day.",
  "You are my favorite person in the world.",
  "Life is so much better with you in it.",
  "I can't imagine my life without you.",
];

const QUESTION_PRESETS = [
  "Do you love me?",
  "Will you be mine forever?",
  "Am I your favorite person?",
  "Do you miss me when I'm gone?",
  "Will you always love me?",
];

const SAMPLE_ROMANTIC_PHOTOS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80",
];

export default function CreatorWizard({
  initialOccasion = "proposal",
  initialTheme = "classic",
}: CreatorWizardProps) {
  // Step 1 to 6
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Stage 1: Recipient
  const [recipientName, setRecipientName] = useState("My Love");
  const [senderName, setSenderName] = useState("Me");
  const [occasion, setOccasion] = useState<OccasionType>(initialOccasion);

  // Stage 2: Style / Theme
  const [theme, setTheme] = useState(initialTheme);

  // Stage 3: Message & The Big Question
  const [tipIndex, setTipIndex] = useState(0);
  const [letterText, setLetterText] = useState(
    "Some things deserve more than a quick text message.\n\nFrom the moment you entered my life, you turned ordinary days into unforgettable memories. Thank you for your warm smiles, your patient listening, and the way you always make me feel safe.\n\nI promise to love you, cherish every single moment with you, and never take you for granted. You mean the entire world to me! ❤️"
  );
  const [question, setQuestion] = useState("do you love me ??");

  // Stage 3 Live Preview Runaway Button State
  const [previewDodgePos, setPreviewDodgePos] = useState<{ x: number; y: number } | null>(null);
  const [previewDodgeCount, setPreviewDodgeCount] = useState(0);
  const [previewYesClicked, setPreviewYesClicked] = useState(false);

  // Stage 4: Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stage 5: Features
  const [bgMusic, setBgMusic] = useState<AudioTrackId>("romantic-lofi");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const [enableAnniversary, setEnableAnniversary] = useState(true);
  const [anniversaryDate, setAnniversaryDate] = useState("2023-02-14");

  const [enablePin, setEnablePin] = useState(false);
  const [secretPin, setSecretPin] = useState("1402");

  const [enableEnvelope, setEnableEnvelope] = useState(true);
  const [enableConfetti, setEnableConfetti] = useState(true);

  // Stage 6: Launch & Sharing
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Auto-save draft to localStorage
  useEffect(() => {
    try {
      const draft = {
        recipientName,
        senderName,
        theme,
        letterText,
        question,
        photos,
        bgMusic,
        anniversaryDate,
        enablePin,
        secretPin,
      };
      localStorage.setItem("lovelink_wizard_draft", JSON.stringify(draft));
    } catch {}
  }, [
    recipientName,
    senderName,
    theme,
    letterText,
    question,
    photos,
    bgMusic,
    anniversaryDate,
    enablePin,
    secretPin,
  ]);

  // Audio preview playback toggle
  const toggleAudioPreview = () => {
    soundFx.playPop();
    if (!audioPreviewRef.current) {
      const audio = new Audio(
        bgMusic === "summer-guitar" ? "/music/summer-gouyad-5.mp3" : "/music/love-bgm.mp3"
      );
      audio.loop = true;
      audioPreviewRef.current = audio;
    } else {
      audioPreviewRef.current.src =
        bgMusic === "summer-guitar" ? "/music/summer-gouyad-5.mp3" : "/music/love-bgm.mp3";
    }

    if (isAudioPlaying) {
      audioPreviewRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioPreviewRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => setIsAudioPlaying(false));
    }
  };

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  // Handle Dodge button in Live Preview
  const handleDodgeHover = () => {
    soundFx.playPop();
    setPreviewDodgeCount((prev) => prev + 1);
    const rx = (Math.random() - 0.5) * 160;
    const ry = (Math.random() - 0.5) * 80;
    setPreviewDodgePos({ x: rx, y: ry });
  };

  const handlePreviewYes = () => {
    soundFx.playSuccessChime();
    setPreviewYesClicked(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#FF2E63", "#FF6B8B", "#FFD166"],
    });
    setTimeout(() => setPreviewYesClicked(false), 3000);
  };

  // Runaway button funny phrases
  const getRunawayLabel = () => {
    const labels = [
      "Are you sure? 😅",
      "Wait...",
      "Think again! 😜",
      "Wrong button! 🏃",
      "Nice try! 😂",
      "Almost! 💖",
    ];
    return labels[previewDodgeCount % labels.length];
  };

  // Add sample photos
  const handleAddSamplePhotos = () => {
    soundFx.playPop();
    setPhotos([...SAMPLE_ROMANTIC_PHOTOS]);
  };

  // Handle local file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    soundFx.playPop();
    const files = Array.from(e.target.files).slice(0, 3 - photos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotos((prev) => [...prev, uploadEvent.target!.result as string].slice(0, 6));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    soundFx.playPop();
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Navigation handlers
  const goToStep = (targetStep: 1 | 2 | 3 | 4 | 5 | 6) => {
    soundFx.playPop();
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final payment & launch execution
  const handleExecutePayment = async () => {
    soundFx.playPop();
    setIsProcessingPay(true);

    let pinHash: string | undefined = undefined;
    if (enablePin && secretPin) {
      pinHash = await hashPasscode(secretPin);
    }

    const secureSlug = generateSecureSlug(recipientName || "My Love", senderName || "Me");

    setTimeout(() => {
      const siteData: LoveSurpriseData = {
        id: "love-" + Date.now(),
        slug: secureSlug,
        occasion: occasion,
        relation: "Partner",
        recipientName: sanitizeInput(recipientName.trim() || "My Love"),
        senderName: sanitizeInput(senderName.trim() || "Me"),
        question: sanitizeInput(question.trim() || "do you love me ??"),
        subheading: "A special romantic surprise made just for you",
        reasons: [
          "Your beautiful laugh that brightens my day ✨",
          "The way you always make me feel special ☕",
          "Being my safest home in this entire world 🏡",
        ],
        letterContent: letterText,
        photos: photos.length > 0 ? photos : SAMPLE_ROMANTIC_PHOTOS.slice(0, 2),
        theme: theme,
        anniversaryDate: enableAnniversary ? anniversaryDate : undefined,
        passcodeHash: pinHash,
        hasPasscode: enablePin && !!secretPin,
        dodgeIntensity: "savage",
        bgMusic: bgMusic,
        whatsappNumber: "+91 98765 43210",
        isPaid: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      saveSurpriseData(siteData);
      setCreatedSlug(secureSlug);
      setIsProcessingPay(false);
      setIsCreated(true);
      soundFx.playSuccessChime();

      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FF2E63", "#FF6B8B", "#FFD166", "#06D6A0"],
      });
    }, 1200);
  };

  // Word count helper
  const wordCount = letterText.trim() ? letterText.trim().split(/\s+/).length : 0;

  // Live URL
  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${createdSlug}`
      : `https://ourlove.in/p/${createdSlug}`;

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 pb-20 selection:bg-pink-100 selection:text-pink-600">
      {/* =================================================================== */}
      {/* TOP PROGRESS NAVIGATION BAR (Matching reference screenshots) */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 py-3 sm:py-4 px-4 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Progress Track */}
          <div className="w-full bg-pink-100/70 h-1.5 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF2E63] to-[#FF537A] rounded-full"
              initial={{ width: "16%" }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          {/* 6 Step Indicators */}
          <div className="flex items-center justify-between px-1">
            {[
              { num: 1, label: "Recipient", icon: Heart },
              { num: 2, label: "Style", icon: Palette },
              { num: 3, label: "Message", icon: PenLine },
              { num: 4, label: "Photos", icon: Camera },
              { num: 5, label: "Features", icon: Sparkles },
              { num: 6, label: "Preview", icon: Eye },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isCompleted = step > s.num;
              const isClickable = isCompleted || s.num === step;

              return (
                <button
                  key={s.num}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && goToStep(s.num as any)}
                  className={`flex flex-col items-center gap-1 group transition-all ${
                    isClickable ? "cursor-pointer" : "cursor-default opacity-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? "bg-[#FF2E63] text-white shadow-sm"
                        : isCurrent
                        ? "bg-[#FF2E63] text-white ring-4 ring-pink-100 shadow-md scale-105"
                        : "bg-pink-100 text-pink-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold tracking-tight transition-colors ${
                      isCurrent
                        ? "text-[#FF2E63] font-bold"
                        : isCompleted
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Saved indicator */}
          {step > 1 && (
            <div className="text-center text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1 pt-0.5">
              <span>✓ Saved — you can safely close this page</span>
            </div>
          )}
        </div>
      </header>

      {/* =================================================================== */}
      {/* MAIN CONTAINER */}
      {/* =================================================================== */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <AnimatePresence mode="wait" initial={false}>
          {/* =============================================================== */}
          {/* STAGE 1: RECIPIENT (Image 1: media_1791111523011.png) */}
          {/* =============================================================== */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 text-center"
            >
              {/* Floating Center Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Heart className="w-7 h-7 fill-white text-white" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Let&apos;s create something beautiful
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  A personalized love letter just for them
                </p>
              </div>

              {/* Input Form Card */}
              <div className="max-w-md mx-auto space-y-4 pt-2">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 text-left">
                  Who is this love letter for?
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Their name..."
                    className="w-full px-5 py-4 rounded-2xl border-2 border-pink-300 focus:border-[#FF2E63] focus:ring-4 focus:ring-pink-100 outline-none text-center font-bold text-lg text-slate-800 transition-all placeholder:text-slate-300 shadow-sm bg-white"
                  />
                </div>

                {/* Quick Presets Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {["My Love", "Babe", "Honey", "Sweetheart", "My Darling", "Love"].map(
                    (preset) => {
                      const isActive = recipientName === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            soundFx.playPop();
                            setRecipientName(preset);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:bg-pink-50/50"
                          }`}
                        >
                          {preset}
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="text-xs text-slate-400 font-medium text-center">
                  This name will appear throughout their experience
                </p>

                {/* Sender Name Option */}
                <div className="pt-2 text-left">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Your name (or nickname)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="From you..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none text-sm text-slate-700 bg-white"
                  />
                </div>

                {/* Primary Continue Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={!recipientName.trim()}
                    onClick={() => goToStep(2)}
                    className={`w-full py-4 rounded-full font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md ${
                      recipientName.trim()
                        ? "bg-[#FF2E63] hover:bg-[#E02656] text-white shadow-pink-500/25 active:scale-98 cursor-pointer"
                        : "bg-pink-200 text-white cursor-not-allowed"
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Mascot Pill */}
              <div className="pt-8 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-md mb-2">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-md text-xs font-bold text-slate-700">
                  Who&apos;s the lucky person?
                </div>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* STAGE 2: STYLE / THEME (Image 2: media_1791111560687.png) */}
          {/* =============================================================== */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              {/* Floating Center Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Palette className="w-7 h-7 text-white" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Pick a style for {recipientName || "My Love"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Choose a beautiful theme for their letter
                </p>
              </div>

              {/* Theme Grid matching screenshot 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-2">
                {THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setTheme(t.id);
                      }}
                      className={`relative rounded-3xl p-5 text-left transition-all duration-200 cursor-pointer overflow-hidden border-2 ${
                        isSelected
                          ? "border-[#FF2E63] shadow-lg shadow-pink-500/15 ring-2 ring-pink-200 scale-[1.02]"
                          : "border-slate-200/80 hover:border-pink-300 hover:shadow-md bg-white"
                      }`}
                    >
                      {/* Active Checkmark Pill */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF2E63] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Theme Preview Card Area */}
                      <div
                        className={`w-full h-28 rounded-2xl ${t.cardBg} flex flex-col items-center justify-center gap-2 mb-3.5 border ${t.cardBorder}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full ${t.iconBg} text-white flex items-center justify-center shadow-sm`}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        {/* Decorative pill bars mimicking mockup */}
                        <div className="w-12 h-1.5 bg-slate-300/40 rounded-full" />
                        <div className="w-8 h-1 bg-slate-300/30 rounded-full" />
                      </div>

                      {/* Theme Title */}
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between max-w-xl mx-auto pt-6">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-6 py-3.5 rounded-full border border-pink-200 text-pink-600 bg-white hover:bg-pink-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-8 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* STAGE 3: MESSAGE & BIG QUESTION (Images 3 & 4) */}
          {/* =============================================================== */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Floating Center Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <PenLine className="w-7 h-7 text-white" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5 text-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Write your letter to {recipientName || "My Love"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  This is the heart of your love letter
                </p>
              </div>

              {/* Tip Box with Lightbulb */}
              <div className="max-w-xl mx-auto p-3.5 sm:p-4 rounded-2xl border border-pink-200 bg-pink-50/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#FF2E63]">
                  <Lightbulb className="w-4 h-4 shrink-0 text-[#FF2E63]" />
                  <span>Tip: {WRITING_TIPS[tipIndex]}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setTipIndex((prev) => (prev + 1) % WRITING_TIPS.length);
                  }}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#FF2E63] shrink-0 underline"
                >
                  Next tip →
                </button>
              </div>

              {/* Quick Starters Pills */}
              <div className="max-w-xl mx-auto space-y-2 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick starters - tap to use:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {QUICK_STARTERS.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setLetterText((prev) =>
                          prev.trim() ? `${prev}\n\n${starter}` : starter
                        );
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/60 transition-all cursor-pointer shadow-2xs"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Letter Editor Card */}
              <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-2">
                <span className="font-bold text-slate-800 text-sm block">
                  Dear {recipientName || "My Love"},
                </span>
                <textarea
                  rows={6}
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  placeholder="Start writing your love letter here..."
                  className="w-full text-sm sm:text-base text-slate-700 leading-relaxed outline-none resize-none placeholder:text-slate-300"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>Heartfelt & Permanent</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{wordCount} words</span>
                  </div>
                </div>
              </div>

              {/* =========================================================== */}
              {/* THE BIG QUESTION 💕 CARD (Matching screenshot 4) */}
              {/* =========================================================== */}
              <div className="max-w-xl mx-auto rounded-3xl border border-pink-200 bg-[#FFF5F7] p-5 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF2E63] text-white flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                      The Big Question 💕
                    </h3>
                    <p className="text-xs text-[#FF2E63] font-medium">
                      This appears at the start - make it fun!
                    </p>
                  </div>
                </div>

                {/* Editable Question Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="do you love me ??"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-pink-300 focus:border-[#FF2E63] focus:ring-4 focus:ring-pink-100 outline-none text-center font-bold text-base text-slate-800 bg-white shadow-sm"
                  />
                  <Sparkles className="w-4 h-4 text-pink-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Question Presets */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {QUESTION_PRESETS.map((qp) => (
                    <button
                      key={qp}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setQuestion(qp);
                      }}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-pink-200 text-slate-700 hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer shadow-2xs"
                    >
                      {qp}
                    </button>
                  ))}
                </div>

                {/* LIVE PREVIEW BOX INSIDE CARD */}
                <div className="rounded-2xl bg-white p-5 sm:p-6 border border-pink-100 shadow-sm text-center space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#FF2E63]">
                      ▶ Live Preview
                    </span>
                    <span className="text-slate-400">How it looks</span>
                  </div>

                  <h4 className="font-extrabold text-lg sm:text-xl text-slate-800">
                    {question || "do you love me ??"}
                  </h4>

                  {/* Two Buttons: Yes and Runaway No */}
                  <div className="relative py-4 flex items-center justify-center gap-4 min-h-[90px]">
                    <button
                      type="button"
                      onClick={handlePreviewYes}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF2E63] to-[#FF4D79] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
                    >
                      {previewYesClicked ? "YAAAY! 💖🥰" : "YES! 💖"}
                    </button>

                    <motion.button
                      type="button"
                      onMouseEnter={handleDodgeHover}
                      onClick={handleDodgeHover}
                      animate={previewDodgePos ? { x: previewDodgePos.x, y: previewDodgePos.y } : {}}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-sm hover:border-pink-300 transition-colors cursor-pointer select-none"
                    >
                      {getRunawayLabel()}
                    </motion.button>
                  </div>

                  <p className="text-xs text-[#FF2E63] font-semibold">
                    👆 The &quot;No&quot; button keeps running away!
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {recipientName || "My Love"} will have to say &quot;Yes&quot; to continue! 😄
                  </p>
                </div>
              </div>

              {/* Bottom Mascot Pill */}
              <div className="pt-2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-md mb-2">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-md text-xs font-bold text-slate-700">
                  Pour your heart out...
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="max-w-xl mx-auto space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="px-6 py-3.5 rounded-full border border-pink-200 text-pink-600 bg-white hover:bg-pink-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    className="px-8 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium text-center">
                  You can always come back and edit this later
                </p>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* STAGE 4: PHOTOS (Image 5: media_1791111636496.png) */}
          {/* =============================================================== */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              {/* Floating Center Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Camera className="w-7 h-7 text-white" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Add your favorite memories
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Photos that mean something to you and {recipientName || "My Love"}
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* 3 Photo Upload Cards Grid matching Screenshot 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-2">
                {[0, 1, 2].map((idx) => {
                  const hasPhoto = photos[idx];
                  return (
                    <div
                      key={idx}
                      className="relative rounded-3xl border-2 border-dashed border-pink-200 bg-[#FFFBFC] p-4 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[210px] hover:border-pink-400 hover:bg-pink-50/40 transition-all overflow-hidden group shadow-2xs"
                    >
                      {hasPhoto ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={hasPhoto}
                            alt={`Memory ${idx + 1}`}
                            className="w-full h-full object-cover rounded-2xl absolute inset-0"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center shadow-md transition-colors z-10 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-pink-100/70 text-[#FF2E63] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImagePlus className="w-6 h-6 stroke-[2.2]" />
                          </div>
                          <span className="text-xs font-bold text-[#FF2E63] mt-2.5">Add</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-medium">
                  Drag & drop or click to upload photos
                </p>

                {/* Romantic Sample Photos Button */}
                <button
                  type="button"
                  onClick={handleAddSamplePhotos}
                  className="text-xs font-bold text-[#FF2E63] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Or use sample romantic photos for testing</span>
                </button>
              </div>

              {/* Bottom Mascot Pill */}
              <div className="pt-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-md mb-2">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-md text-xs font-bold text-slate-700">
                  Add your favorite memories together!
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between max-w-xl mx-auto pt-6">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-6 py-3.5 rounded-full border border-pink-200 text-pink-600 bg-white hover:bg-pink-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-3">
                  {photos.length === 0 && (
                    <button
                      type="button"
                      onClick={() => goToStep(5)}
                      className="text-xs font-bold text-[#FF2E63] hover:underline px-3 py-2 cursor-pointer"
                    >
                      Skip for now ▷|
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => goToStep(5)}
                    className="px-8 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* STAGE 5: FEATURES (Magical Touches) */}
          {/* =============================================================== */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Floating Center Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Sparkles className="w-7 h-7 text-white" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5 text-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Add magical features
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Extra interactive surprises for {recipientName || "My Love"}
                </p>
              </div>

              <div className="max-w-xl mx-auto space-y-4 pt-2">
                {/* 1. Background Music Toggle */}
                <div className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#FF2E63] flex items-center justify-center">
                        <Music className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">
                          Background Soundtrack 🎵
                        </h4>
                        <p className="text-xs text-slate-500">
                          Plays softly in the background when they open the letter
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleAudioPreview}
                      className="px-3.5 py-1.5 rounded-full border border-pink-200 text-xs font-bold text-[#FF2E63] hover:bg-pink-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isAudioPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Preview</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setBgMusic("romantic-lofi");
                      }}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        bgMusic === "romantic-lofi"
                          ? "border-[#FF2E63] bg-pink-50 text-[#FF2E63]"
                          : "border-slate-200 text-slate-700 bg-white hover:border-pink-200"
                      }`}
                    >
                      <span>Soft Piano & Lo-Fi 🎹</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setBgMusic("summer-guitar");
                      }}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        bgMusic === "summer-guitar"
                          ? "border-[#FF2E63] bg-pink-50 text-[#FF2E63]"
                          : "border-slate-200 text-slate-700 bg-white hover:border-pink-200"
                      }`}
                    >
                      <span>Acoustic Sunset Guitar 🎸</span>
                    </button>
                  </div>
                </div>

                {/* 2. Anniversary & Love Counter */}
                <div className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">
                          Love Journey Counter ⏳
                        </h4>
                        <p className="text-xs text-slate-500">
                          Shows live days, hours & minutes together
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableAnniversary}
                      onChange={(e) => setEnableAnniversary(e.target.checked)}
                      className="w-5 h-5 accent-[#FF2E63] cursor-pointer"
                    />
                  </div>

                  {enableAnniversary && (
                    <div className="pt-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        When did your story begin? (Anniversary or first date)
                      </label>
                      <input
                        type="date"
                        value={anniversaryDate}
                        onChange={(e) => setAnniversaryDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-pink-400"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Secret PIN Lock */}
                <div className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">
                          4-Digit Secret PIN Lock 🔒
                        </h4>
                        <p className="text-xs text-slate-500">
                          100% private. Only they can unlock with the passcode
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enablePin}
                      onChange={(e) => setEnablePin(e.target.checked)}
                      className="w-5 h-5 accent-[#FF2E63] cursor-pointer"
                    />
                  </div>

                  {enablePin && (
                    <div className="pt-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Set 4-Digit Passcode (e.g. your anniversary date or special number)
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={secretPin}
                        onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, ""))}
                        placeholder="1402"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 tracking-widest text-center outline-none focus:border-pink-400"
                      />
                    </div>
                  )}
                </div>

                {/* 4. Wax Seal & Confetti Toggles */}
                <div className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      ✉️ Interactive Wax Seal Opening
                    </span>
                    <input
                      type="checkbox"
                      checked={enableEnvelope}
                      onChange={(e) => setEnableEnvelope(e.target.checked)}
                      className="w-5 h-5 accent-[#FF2E63] cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-800">
                      💖 Romantic Confetti & Heart Particles
                    </span>
                    <input
                      type="checkbox"
                      checked={enableConfetti}
                      onChange={(e) => setEnableConfetti(e.target.checked)}
                      className="w-5 h-5 accent-[#FF2E63] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Mascot Pill */}
              <div className="pt-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-md mb-2">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-md text-xs font-bold text-slate-700">
                  Make it truly unforgettable!
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between max-w-xl mx-auto pt-6">
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="px-6 py-3.5 rounded-full border border-pink-200 text-pink-600 bg-white hover:bg-pink-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStep(6)}
                  className="px-8 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Continue to Preview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* STAGE 6: PREVIEW & LAUNCH / DELIVERY */}
          {/* =============================================================== */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              {/* Floating Center Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Eye className="w-7 h-7 text-white" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  {isCreated ? "Your LoveLink is ready!" : "Preview their surprise"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {isCreated
                    ? "Share this link or print the QR gift card"
                    : `See how ${recipientName || "My Love"} will experience their love letter`}
                </p>
              </div>

              {!isCreated ? (
                /* Pre-launch Preview Card */
                <div className="max-w-xl mx-auto space-y-6">
                  {/* Interactive Phone Simulation Frame */}
                  <div
                    className={`rounded-[38px] p-6 sm:p-8 border-4 border-slate-800 shadow-2xl text-center space-y-5 relative overflow-hidden ${currentTheme.cardBg}`}
                  >
                    {/* Simulated Notch */}
                    <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto -mt-3 mb-2" />

                    {/* Question Header */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-pink-500">
                        SURPRISE FOR {recipientName.toUpperCase()}
                      </span>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-slate-800">
                        {question}
                      </h3>
                    </div>

                    {/* Mini Runaway playground inside mockup */}
                    <div className="py-2 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handlePreviewYes}
                        className="px-5 py-2 rounded-full bg-[#FF2E63] text-white font-extrabold text-xs shadow-sm"
                      >
                        YES! 💖
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold"
                      >
                        Are you sure? 😅
                      </button>
                    </div>

                    {/* Simulated Letter Paper */}
                    <div className="rounded-2xl bg-white/95 p-5 text-left space-y-2 border border-pink-100 shadow-sm">
                      <p className="font-bold text-xs text-slate-800">
                        Dear {recipientName || "My Love"},
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed whitespace-pre-line">
                        {letterText}
                      </p>
                      <p className="text-[11px] font-semibold text-[#FF2E63] pt-1">
                        Always yours, {senderName || "Me"} ❤️
                      </p>
                    </div>

                    {/* Photos Preview inside mockup */}
                    {photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 pt-1 justify-center">
                        {photos.slice(0, 3).map((p, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={p}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm"
                          />
                        ))}
                      </div>
                    )}

                    {/* Security or Music Pill */}
                    <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-2">
                      {enablePin && <span>🔒 Passcode Protected</span>}
                      <span>🎵 Soundtrack Included</span>
                    </div>
                  </div>

                  {/* Launch / Checkout Banner */}
                  <div className="p-6 rounded-3xl bg-white border border-pink-200 shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF2E63]">
                          ONE-TIME PAYMENT
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-slate-900">₹99</span>
                          <span className="text-sm text-slate-400 line-through">₹499</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            Save 80%
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500 font-medium">
                        <span className="block">✓ Lifetime access</span>
                        <span className="block">✓ Ad-free & private</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessingPay}
                      onClick={handleExecutePayment}
                      className="w-full py-4 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-base shadow-lg shadow-pink-500/25 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                    >
                      {isProcessingPay ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Preparing your LoveLink...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Your LoveLink Website (₹99)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Back button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => goToStep(5)}
                      className="px-6 py-3 rounded-full border border-pink-200 text-pink-600 bg-white hover:bg-pink-50 font-bold text-xs transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to features</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Post-Launch Multi-Channel Delivery Dashboard */
                <div className="max-w-xl mx-auto space-y-6 text-center">
                  <div className="p-6 rounded-3xl bg-white border border-pink-200 shadow-lg space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                      Your LoveLink is Live! 💖
                    </h2>

                    {/* URL Display with Copy */}
                    <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700 truncate pl-2">
                        {siteUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(siteUrl);
                          setCopiedLink(true);
                          soundFx.playPop();
                          setTimeout(() => setCopiedLink(false), 2500);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-pink-100/50 border border-pink-200 text-xs font-bold text-[#FF2E63] shrink-0 transition-colors cursor-pointer"
                      >
                        {copiedLink ? "Copied! ✓" : "Copy Link"}
                      </button>
                    </div>

                    {/* 4 Multi-Channel Share Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* WhatsApp Share */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Hey ${recipientName}! ❤️ I made a special website just for you: ${siteUrl}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Send via WhatsApp</span>
                      </a>

                      {/* View Website */}
                      <Link
                        href={`/p/${createdSlug}`}
                        target="_blank"
                        className="py-3 px-4 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Website Now</span>
                      </Link>

                      {/* Printable QR Card Modal */}
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playPop();
                          setShowQrModal(true);
                        }}
                        className="py-3 px-4 rounded-2xl bg-white border border-pink-200 hover:bg-pink-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-[#FF2E63]" />
                        <span>Printable QR Polaroid</span>
                      </button>

                      {/* Native Web Share */}
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: `A surprise for ${recipientName} ❤️`,
                              url: siteUrl,
                            });
                          } else {
                            navigator.clipboard.writeText(siteUrl);
                            setCopiedLink(true);
                          }
                        }}
                        className="py-3 px-4 rounded-2xl bg-white border border-pink-200 hover:bg-pink-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-[#FF2E63]" />
                        <span>Share Sheet</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* =================================================================== */}
      {/* PRINTABLE QR POLAROID MODAL */}
      {/* =================================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-lg text-slate-900">
              Printable Polaroid Gift Card
            </h3>
            <p className="text-xs text-slate-500">
              Print this or save it to slip into a greeting card or gift box!
            </p>

            {/* Printable Polaroid Card */}
            <div className="p-6 rounded-2xl bg-[#FFF5F7] border border-pink-200 shadow-md space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E63] block">
                FOR {recipientName.toUpperCase()} 💕
              </span>

              <div className="p-3 bg-white rounded-xl shadow-xs inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    siteUrl
                  )}`}
                  alt="LoveLink QR Code"
                  className="w-36 h-36 object-contain mx-auto"
                />
              </div>

              <p className="text-xs font-medium text-slate-600">Scan to read your love letter</p>
              <span className="text-[10px] text-slate-400 font-mono block">{siteUrl}</span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print or Save as PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
