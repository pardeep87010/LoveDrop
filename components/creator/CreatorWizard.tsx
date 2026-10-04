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
  Clock,
  HelpCircle,
  Cookie,
  Ticket,
  Disc,
  Gift,
  Compass,
  Plus,
  Trash2,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";
import { LoveSurpriseData, OccasionType, DodgeIntensity, AudioTrackId } from "@/lib/types";
import { generateSecureSlug, hashPasscode, sanitizeInput } from "@/lib/security";
import { saveSurpriseData } from "@/lib/storage";

interface CreatorWizardProps {
  initialOccasion?: OccasionType;
  initialTheme?: string;
}

// 6 Themes matching screenshot 2
const THEMES = [
  {
    id: "classic",
    name: "Classic",
    cardBg: "bg-[#FFF0F3]",
    cardBorder: "border-pink-200",
    accent: "#FF2E63",
    iconBg: "bg-[#FF2E63]",
  },
  {
    id: "classic-romance",
    name: "Classic Romance",
    cardBg: "bg-[#FDE2E6]",
    cardBorder: "border-rose-200",
    accent: "#E0245E",
    iconBg: "bg-[#E0245E]",
  },
  {
    id: "first-love",
    name: "First Love",
    cardBg: "bg-[#E8F8F5]",
    cardBorder: "border-emerald-200",
    accent: "#10B981",
    iconBg: "bg-[#10B981]",
  },
  {
    id: "minimalist-love",
    name: "Minimalist Love",
    cardBg: "bg-[#F0F3FF]",
    cardBorder: "border-indigo-200",
    accent: "#6366F1",
    iconBg: "bg-[#6366F1]",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    cardBg: "bg-[#FFF8E7]",
    cardBorder: "border-amber-200",
    accent: "#F59E0B",
    iconBg: "bg-[#F59E0B]",
  },
  {
    id: "midnight-galaxy",
    name: "Midnight Galaxy",
    cardBg: "bg-[#1A1D36]",
    cardBorder: "border-purple-900",
    accent: "#8B5CF6",
    iconBg: "bg-[#8B5CF6]",
    dark: true,
  },
];

// Writing tips for Stage 3
const WRITING_TIPS = [
  "What made you fall in love with them?",
  "Mention your favorite little habit of theirs that always makes you smile.",
  "Share a memory only the two of you know about.",
  "Tell them what your ordinary days feel like since they entered your life.",
];

// Quick letter starters for Stage 3
const QUICK_STARTERS = [
  "Every moment with you feels like magic.",
  "You make my heart skip a beat.",
  "I fall more in love with you every day.",
  "You are my favorite person in the world.",
  "Life is so much better with you in it.",
  "I can't imagine my life without you.",
];

// Question presets for Stage 3
const QUESTION_PRESETS = [
  "Do you love me?",
  "Will you be mine forever?",
  "Am I your favorite person?",
  "Do you miss me when I'm gone?",
  "Will you always love me?",
];

// Sample photos for Stage 4
const SAMPLE_ROMANTIC_PHOTOS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80",
];

// 9 Interactive Feature Items for Stage 5 matching reference screenshots
interface FeatureDef {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  maxCount: number;
  inputPlaceholder: string;
  quickAdd: string[];
}

const FEATURE_DEFINITIONS: FeatureDef[] = [
  {
    id: "reasons",
    name: "Reasons I Love You",
    icon: Heart,
    maxCount: 10,
    inputPlaceholder: "A reason why I love you...",
    quickAdd: [
      "The way your eyes crinkle when you laugh ✨",
      "How safe I feel whenever I hold your hand 🤍",
      "You always know how to cheer me up ☕",
      "Your endless kindness and pure heart 🌸",
    ],
  },
  {
    id: "timeline",
    name: "Our Timeline",
    icon: Clock,
    maxCount: 10,
    inputPlaceholder: "What happened on this date?",
    quickAdd: [
      "The day we first met",
      "Our first date",
      "Our first kiss",
      "The day we made it official",
    ],
  },
  {
    id: "quiz",
    name: "Love Quiz",
    icon: HelpCircle,
    maxCount: 5,
    inputPlaceholder: "Ask a cute quiz question about us...",
    quickAdd: [
      "Who said 'I love you' first?",
      "Where was our first vacation?",
      "What is my favorite nickname for you?",
    ],
  },
  {
    id: "compliments",
    name: "Compliment Spinner",
    icon: MessageCircle,
    maxCount: 8,
    inputPlaceholder: "Add a sweet compliment...",
    quickAdd: [
      "You have the most contagious, warm smile 😊",
      "You are the smartest and most thoughtful person 🌟",
      "You look breathtaking in everything you wear 💕",
    ],
  },
  {
    id: "fortune",
    name: "Fortune Cookies",
    icon: Cookie,
    maxCount: 6,
    inputPlaceholder: "A sweet romantic fortune...",
    quickAdd: [
      "Endless cuddles and warm hugs in your near future 🥠",
      "Someone loves you more than words can express ❤️",
      "A surprise sweet treat awaits you soon 🍫",
    ],
  },
  {
    id: "scratch",
    name: "Scratch Cards",
    icon: Ticket,
    maxCount: 5,
    inputPlaceholder: "Coupon / reward revealed on scratch...",
    quickAdd: [
      "Free 30-minute massage coupon 💆",
      "Late-night ice cream & movie date 🍦",
      "100 endless hugs anytime anywhere 🤗",
    ],
  },
  {
    id: "wheel",
    name: "Spin the Wheel",
    icon: Disc,
    maxCount: 8,
    inputPlaceholder: "Wheel action / dare / romantic prize...",
    quickAdd: [
      "10-second passionate kiss 💋",
      "Sing our favorite love song together 🎶",
      "Tell me 3 things you love about me 💖",
    ],
  },
  {
    id: "promise",
    name: "Promise Wall",
    icon: Gift,
    maxCount: 10,
    inputPlaceholder: "I promise to...",
    quickAdd: [
      "I promise to always make you laugh when you're sad",
      "I promise to be your biggest cheerleader in life",
      "I promise to cook your favorite meal anytime",
      "I promise to always hold your hand through everything",
    ],
  },
  {
    id: "bucket",
    name: "Bucket List",
    icon: Compass,
    maxCount: 10,
    inputPlaceholder: "A dream adventure together...",
    quickAdd: [
      "Watch the Northern Lights together in Norway 🌌",
      "Road trip with no GPS or destination 🚗",
      "Cozy mountain cabin stay during snowfall ❄️",
    ],
  },
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

  // Stage 5: 9 Interactive Features State
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Feature specific data
  const [timelineEvents, setTimelineEvents] = useState<{ date: string; event: string }[]>([]);
  const [tempTimelineDate, setTempTimelineDate] = useState("");
  const [tempTimelineText, setTempTimelineText] = useState("");

  const [promises, setPromises] = useState<string[]>([]);
  const [tempPromiseText, setTempPromiseText] = useState("");

  const [reasonsList, setReasonsList] = useState<string[]>([
    "The way your eyes crinkle when you laugh ✨",
    "How safe I feel whenever I hold your hand 🤍",
  ]);
  const [tempReasonText, setTempReasonText] = useState("");

  const [quizList, setQuizList] = useState<{ question: string; answer: string }[]>([
    { question: "Who said 'I love you' first?", answer: "Me ❤️" },
  ]);
  const [tempQuizQ, setTempQuizQ] = useState("");

  const [complimentsList, setComplimentsList] = useState<string[]>([
    "You have the most contagious, warm smile 😊",
  ]);
  const [tempComplimentText, setTempComplimentText] = useState("");

  const [fortunesList, setFortunesList] = useState<string[]>([
    "Endless cuddles and warm hugs in your near future 🥠",
  ]);
  const [tempFortuneText, setTempFortuneText] = useState("");

  const [scratchList, setScratchList] = useState<string[]>([
    "Free 30-minute massage coupon 💆",
    "Late-night ice cream & movie date 🍦",
  ]);
  const [tempScratchText, setTempScratchText] = useState("");

  const [wheelList, setWheelList] = useState<string[]>([
    "10-second passionate kiss 💋",
    "Sing our favorite love song together 🎶",
  ]);
  const [tempWheelText, setTempWheelText] = useState("");

  const [bucketList, setBucketList] = useState<string[]>([
    "Watch the Northern Lights together in Norway 🌌",
  ]);
  const [tempBucketText, setTempBucketText] = useState("");

  // Stage 5 Ambient options: Music & PIN
  const [bgMusic, setBgMusic] = useState<AudioTrackId>("romantic-lofi");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const [enablePin, setEnablePin] = useState(false);
  const [secretPin, setSecretPin] = useState("1402");

  // Stage 6: Publish / Checkout & Preview Modal
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
        selectedFeatures,
        timelineEvents,
        promises,
        bgMusic,
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
    selectedFeatures,
    timelineEvents,
    promises,
    bgMusic,
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

  // Toggle features in Stage 5
  const toggleFeature = (featId: string) => {
    soundFx.playPop();
    setSelectedFeatures((prev) =>
      prev.includes(featId) ? prev.filter((id) => id !== featId) : [...prev, featId]
    );
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
        reasons:
          reasonsList.length > 0
            ? reasonsList
            : [
                "Your beautiful laugh that brightens my day ✨",
                "The way you always make me feel special ☕",
                "Being my safest home in this entire world 🏡",
              ],
        letterContent: letterText,
        photos: photos.length > 0 ? photos : SAMPLE_ROMANTIC_PHOTOS.slice(0, 2),
        theme: theme,
        selectedFeatures: selectedFeatures,
        timeline: timelineEvents,
        promises: promises,
        loveReasons: reasonsList,
        quizQuestions: quizList,
        compliments: complimentsList,
        fortuneCookies: fortunesList,
        scratchCards: scratchList,
        wheelItems: wheelList,
        bucketList: bucketList,
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
        particleCount: 140,
        spread: 110,
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
    <div className="min-h-screen bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] text-slate-800 pb-20 selection:bg-pink-100 selection:text-pink-600">
      {/* =================================================================== */}
      {/* TOP PROGRESS NAVIGATION BAR (Matching media_1791116072759.png) */}
      {/* =================================================================== */}
      <header className="w-full pt-4 sm:pt-6 pb-2 px-4">
        <div className="max-w-xl mx-auto space-y-2.5">
          {/* Progress Track */}
          <div className="w-full bg-[#FCE9F4] h-1.5 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-[#F6339A] rounded-full"
              initial={{ width: "16%" }}
              animate={{
                width: `${Math.min(100, Math.max(16, (step / 6) * 100))}%`,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          {/* 6 Step Indicators */}
          <div className="flex items-center justify-between px-1">
            {[
              { num: 1, label: "Recipient" },
              { num: 2, label: "Style" },
              { num: 3, label: "Message" },
              { num: 4, label: "Photos" },
              { num: 5, label: "Features" },
              { num: 6, label: "Preview" },
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
                    isClickable ? "cursor-pointer" : "cursor-default opacity-60"
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-all ${
                      isCompleted
                        ? "bg-[#F6339A] text-white"
                        : isCurrent
                        ? "bg-[#F6339A] text-white shadow-xs ring-4 ring-[#FCE9F4] scale-105"
                        : "bg-[#FCE9F4] text-[#F6339A]"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-medium tracking-tight transition-colors ${
                      isCurrent
                        ? "text-[#F6339A] font-bold"
                        : isCompleted
                        ? "text-slate-500"
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
          <div className="text-center text-[11px] font-normal text-slate-400 flex items-center justify-center gap-1 pt-0.5">
            <span>✓ Saved — you can safely close this page</span>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* MAIN CONTAINER */}
      {/* =================================================================== */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <AnimatePresence mode="wait" initial={false}>
          {/* =============================================================== */}
          {/* STAGE 1: RECIPIENT */}
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Heart className="w-7 h-7 fill-white text-white" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Let&apos;s create something beautiful
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  A personalized love letter just for them
                </p>
              </div>

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
          {/* STAGE 2: STYLE / THEME */}
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Palette className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Pick a style for {recipientName || "My Love"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Choose a beautiful theme for their letter
                </p>
              </div>

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
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF2E63] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      <div
                        className={`w-full h-28 rounded-2xl ${t.cardBg} flex flex-col items-center justify-center gap-2 mb-3.5 border ${t.cardBorder}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full ${t.iconBg} text-white flex items-center justify-center shadow-sm`}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-12 h-1.5 bg-slate-300/40 rounded-full" />
                        <div className="w-8 h-1 bg-slate-300/30 rounded-full" />
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>

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
          {/* STAGE 3: MESSAGE & BIG QUESTION */}
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <PenLine className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-1.5 text-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Write your letter to {recipientName || "My Love"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  This is the heart of your love letter
                </p>
              </div>

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
                  className="text-[11px] font-bold text-slate-500 hover:text-[#FF2E63] shrink-0 underline cursor-pointer"
                >
                  Next tip →
                </button>
              </div>

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

              {/* The Big Question Card */}
              <div className="max-w-xl mx-auto rounded-3xl border border-pink-200 bg-[#FFF5F7] p-5 sm:p-6 space-y-4">
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

              <div className="pt-2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-md mb-2">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-md text-xs font-bold text-slate-700">
                  Pour your heart out...
                </div>
              </div>

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
          {/* STAGE 4: PHOTOS */}
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 mx-auto">
                <Camera className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Add your favorite memories
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Photos that mean something to you and {recipientName || "My Love"}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

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

                <button
                  type="button"
                  onClick={handleAddSamplePhotos}
                  className="text-xs font-bold text-[#FF2E63] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Or use sample romantic photos for testing</span>
                </button>
              </div>

              <div className="pt-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF2E63] to-[#FF537A] text-white flex items-center justify-center shadow-md mb-2">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-md text-xs font-bold text-slate-700">
                  Add your favorite memories together!
                </div>
              </div>

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
          {/* STAGE 5: FEATURES ("Make it extra special" - 9 Features) */}
          {/* Matches media_1791115656816.png & media_1791115678588.png */}
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
                  Make it extra special
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Select features and add your content
                </p>
              </div>

              {/* 9 Feature Pills 3x3 Grid matching Screenshot 1 & 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
                {FEATURE_DEFINITIONS.map((feat) => {
                  const isSelected = selectedFeatures.includes(feat.id);
                  const Icon = feat.icon;

                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleFeature(feat.id)}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "border-[#FF2E63] bg-[#FFF5F7] text-slate-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:bg-pink-50/40"
                      }`}
                    >
                      {/* Checkmark badge when selected */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF2E63] text-white flex items-center justify-center shadow-2xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#FF2E63] text-white"
                            : "bg-pink-50 text-[#FF2E63]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <span className="text-xs font-bold leading-tight truncate">
                        {feat.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Helper text if none selected */}
              {selectedFeatures.length === 0 && (
                <p className="text-xs text-slate-400 font-medium text-center pt-2">
                  Select features above to add your content
                </p>
              )}

              {/* =========================================================== */}
              {/* EXPANDABLE CONFIGURATION CARDS FOR SELECTED FEATURES */}
              {/* Matches media_1791115678588.png */}
              {/* =========================================================== */}
              <div className="max-w-xl mx-auto space-y-4 pt-2">
                {/* 1. OUR TIMELINE */}
                {selectedFeatures.includes("timeline") && (
                  <div className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-pink-100 text-[#FF2E63] flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800">Our Timeline</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {timelineEvents.length}/10
                      </span>
                    </div>

                    {/* Input Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative w-full sm:w-44 shrink-0">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Pick a date"
                          value={tempTimelineDate}
                          onFocus={(e) => {
                            e.target.type = "date";
                          }}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                          onChange={(e) => setTempTimelineDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-pink-400 bg-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={tempTimelineText}
                        onChange={(e) => setTempTimelineText(e.target.value)}
                        placeholder="What happened?"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:border-pink-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempTimelineText.trim()) {
                            soundFx.playPop();
                            setTimelineEvents((prev) => [
                              ...prev,
                              {
                                date: tempTimelineDate || "2023-02-14",
                                event: tempTimelineText.trim(),
                              },
                            ]);
                            setTempTimelineText("");
                          }
                        }}
                        className="w-full sm:w-auto p-2.5 rounded-xl bg-[#FF2E63] hover:bg-[#E02656] text-white flex items-center justify-center cursor-pointer shadow-sm shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Add Chips */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Quick add:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "The day we first met",
                          "Our first date",
                          "Our first kiss",
                          "When we made it official",
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              soundFx.playPop();
                              setTimelineEvents((prev) => [
                                ...prev,
                                { date: "2023-02-14", event: chip },
                              ]);
                            }}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Added Events List */}
                    {timelineEvents.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {timelineEvents.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-slate-700"
                          >
                            <span className="font-mono text-[11px] font-bold text-[#FF2E63]">
                              {item.date}:
                            </span>
                            <span className="truncate flex-1 px-2 font-medium">{item.event}</span>
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setTimelineEvents((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. PROMISE WALL */}
                {selectedFeatures.includes("promise") && (
                  <div className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-pink-100 text-[#FF2E63] flex items-center justify-center">
                          <Gift className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800">Promise Wall</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {promises.length}/10
                      </span>
                    </div>

                    {/* Input Row */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempPromiseText}
                        onChange={(e) => setTempPromiseText(e.target.value)}
                        placeholder="I promise to..."
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:border-pink-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempPromiseText.trim()) {
                            soundFx.playPop();
                            setPromises((prev) => [...prev, tempPromiseText.trim()]);
                            setTempPromiseText("");
                          }
                        }}
                        className="p-2.5 rounded-xl bg-[#FF2E63] hover:bg-[#E02656] text-white flex items-center justify-center cursor-pointer shadow-sm shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Add Chips */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Quick add:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "I promise to always make you laugh",
                          "I promise to be your biggest cheerleader",
                          "I promise to cook your favorite meal",
                          "I promise to always hold your hand",
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              soundFx.playPop();
                              setPromises((prev) => [...prev, chip]);
                            }}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer"
                          >
                            + {chip.length > 25 ? chip.substring(0, 25) + "..." : chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Added Promises List */}
                    {promises.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {promises.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-slate-700"
                          >
                            <span className="truncate flex-1 font-medium">💍 {p}</span>
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setPromises((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. REASONS I LOVE YOU */}
                {selectedFeatures.includes("reasons") && (
                  <div className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-pink-100 text-[#FF2E63] flex items-center justify-center">
                          <Heart className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800">
                          Reasons I Love You
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {reasonsList.length}/10
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempReasonText}
                        onChange={(e) => setTempReasonText(e.target.value)}
                        placeholder="A reason why I love you..."
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:border-pink-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempReasonText.trim()) {
                            soundFx.playPop();
                            setReasonsList((prev) => [...prev, tempReasonText.trim()]);
                            setTempReasonText("");
                          }
                        }}
                        className="p-2.5 rounded-xl bg-[#FF2E63] hover:bg-[#E02656] text-white flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {reasonsList.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {reasonsList.map((r, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-slate-700"
                          >
                            <span className="truncate flex-1 font-medium">💖 {r}</span>
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setReasonsList((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. OTHER FEATURES (QUIZ, COMPLIMENTS, FORTUNE, SCRATCH, WHEEL, BUCKET) */}
                {selectedFeatures.filter(
                  (f) => !["timeline", "promise", "reasons"].includes(f)
                ).map((featId) => {
                  const feat = FEATURE_DEFINITIONS.find((f) => f.id === featId);
                  if (!feat) return null;
                  const Icon = feat.icon;

                  return (
                    <div
                      key={feat.id}
                      className="p-5 rounded-3xl border border-pink-200 bg-white shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-pink-100 text-[#FF2E63] flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-800">{feat.name}</h4>
                        </div>
                        <span className="text-xs font-bold text-slate-400">Ready</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {feat.quickAdd.map((item, i) => (
                          <div
                            key={i}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-pink-50/60 border border-pink-100 text-slate-700"
                          >
                            ✓ {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Ambient Options: Soundtrack & PIN Lock */}
                <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Music className="w-4 h-4 text-[#FF2E63]" />
                    <span className="font-bold">Soundtrack:</span>
                    <span>
                      {bgMusic === "romantic-lofi" ? "Soft Piano 🎹" : "Sunset Guitar 🎸"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAudioPreview}
                    className="px-3 py-1 rounded-full border border-pink-200 text-[#FF2E63] font-bold text-[11px] hover:bg-pink-50 flex items-center gap-1 cursor-pointer"
                  >
                    {isAudioPlaying ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Preview Music</span>
                      </>
                    )}
                  </button>
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

                <div className="flex items-center gap-3">
                  {selectedFeatures.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => goToStep(6)}
                      className="text-xs font-bold text-[#FF2E63] hover:underline px-3 py-2 cursor-pointer"
                    >
                      Skip for now ▷|
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goToStep(6)}
                      className="px-8 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* STAGE 6: PUBLISH / CHECKOUT */}
          {/* Matches media_1791115745309.png */}
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
                  {isCreated ? "Your LoveLink is Live! 💖" : "Ready to publish?"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {isCreated
                    ? "Share this link or print the QR gift card"
                    : `Let's get this letter to ${recipientName || "My Love"}`}
                </p>
              </div>

              {!isCreated ? (
                <div className="max-w-xl mx-auto space-y-6">
                  {/* HERO PRICING CARD MATCHING SCREENSHOT 3 */}
                  <div className="rounded-[32px] overflow-hidden shadow-xl border border-pink-100 bg-white">
                    {/* Top vibrant pink gradient header */}
                    <div className="bg-gradient-to-r from-[#FF007A] via-[#FF2E63] to-[#FF4D79] text-white p-7 sm:p-9 text-center space-y-1 shadow-inner">
                      <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/95">
                        Imagine {recipientName || "My Love"}&apos;s face when they open this
                      </p>
                      <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white py-1">
                        $2.85
                      </h2>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-8 space-y-6 text-left">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
                          EVERYTHING INCLUDED:
                        </span>

                        {/* 2-Column Checklist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                            <span>{recipientName || "My Love"}&apos;s letter forever</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                            <span>All your features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                            <span>All 3 photos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                            <span>Printable QR code</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                            <span>No watermark</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                            <span>Unlimited revisits</span>
                          </div>
                        </div>
                      </div>

                      {/* Primary Send Button with solid single-color styling */}
                      <button
                        type="button"
                        disabled={isProcessingPay}
                        onClick={handleExecutePayment}
                        className="w-full py-4 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-base shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                      >
                        {isProcessingPay ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Publishing your LoveLink...</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5 fill-white text-white shrink-0" />
                            <span>Send My Love Letter — $2.85</span>
                          </>
                        )}
                      </button>

                      {/* Trust badges row */}
                      <div className="flex items-center justify-center gap-6 text-[11px] font-semibold text-slate-400">
                        <span className="flex items-center gap-1">🔒 Secure checkout</span>
                        <span className="flex items-center gap-1">🔄 Money-back guarantee</span>
                      </div>

                      <p className="text-xs text-slate-400 font-medium text-center italic">
                        Less than a milk tea — but {recipientName || "My Love"} will remember it forever
                      </p>

                      <p className="text-[10px] text-slate-300 font-medium text-center">
                        Made in Norway by HoltenSys Holding AS
                      </p>
                    </div>
                  </div>

                  {/* Value props below card matching Screenshot 3 */}
                  <div className="space-y-2 text-left max-w-lg mx-auto text-xs sm:text-sm text-slate-600 font-medium">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                      <span>
                        Stored with no expiry date — {recipientName || "My Love"} can reopen the letter whenever
                        they like.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                      <span>
                        Opens straight in their browser from a link or QR code — there is nothing
                        for them to install.
                      </span>
                    </div>
                  </div>

                  {/* Preview Letter Again Trigger */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setShowPreviewModal(true);
                      }}
                      className="text-xs sm:text-sm font-bold text-[#FF2E63] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Preview your letter again</span>
                    </button>
                  </div>

                  {/* Trust Footer matching screenshot */}
                  <div className="text-[11px] text-slate-400 space-y-1 pt-6 border-t border-slate-200/60">
                    <p>
                      Secure payments powered by Stripe. Your payment details are never
                      stored on our servers.
                    </p>
                    <p>Made with love by HoltenSys Holding AS, Norway</p>
                    <p className="text-slate-400">✉️ ole@holtensys.no</p>
                  </div>
                </div>
              ) : (
                /* Post-Launch Celebration & Multi-Channel Delivery */
                <div className="max-w-xl mx-auto space-y-6 text-center">
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-200 shadow-xl space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      Your LoveLink is Ready to Send! 💖
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Send the link directly to {recipientName} or surprise them with a printable QR
                      gift card.
                    </p>

                    {/* URL Display with Copy */}
                    <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-center justify-between gap-2">
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
                        className="px-4 py-2 rounded-xl bg-white hover:bg-pink-100/50 border border-pink-200 text-xs font-bold text-[#FF2E63] shrink-0 transition-colors cursor-pointer"
                      >
                        {copiedLink ? "Copied! ✓" : "Copy Link"}
                      </button>
                    </div>

                    {/* 4 Share Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Hey ${recipientName}! ❤️ I made a special website just for you: ${siteUrl}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Send via WhatsApp</span>
                      </a>

                      <Link
                        href={`/p/${createdSlug}`}
                        target="_blank"
                        className="py-3.5 px-4 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Website Now</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playPop();
                          setShowQrModal(true);
                        }}
                        className="py-3.5 px-4 rounded-2xl bg-white border border-pink-200 hover:bg-pink-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-[#FF2E63]" />
                        <span>Printable QR Polaroid</span>
                      </button>

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
                        className="py-3.5 px-4 rounded-2xl bg-white border border-pink-200 hover:bg-pink-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
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
      {/* FULL DEVICE PREVIEW MODAL ("Preview your letter again") */}
      {/* =================================================================== */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-lg text-slate-900">
              Surprise Preview for {recipientName}
            </h3>

            {/* Interactive Phone Simulation Frame */}
            <div
              className={`rounded-[32px] p-6 border-4 border-slate-800 shadow-xl text-center space-y-4 relative overflow-hidden ${currentTheme.cardBg}`}
            >
              <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto -mt-2 mb-2" />

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
                  SURPRISE FOR {recipientName.toUpperCase()}
                </span>
                <h4 className="font-extrabold text-lg text-slate-800">{question}</h4>
              </div>

              {/* Runaway button preview */}
              <div className="py-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePreviewYes}
                  className="px-4 py-2 rounded-full bg-[#FF2E63] text-white font-extrabold text-xs shadow-sm"
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

              {/* Letter Preview */}
              <div className="rounded-2xl bg-white/95 p-4 text-left space-y-2 border border-pink-100 shadow-xs">
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

              {/* Photos Carousel */}
              {photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 pt-1 justify-center">
                  {photos.slice(0, 3).map((p, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={p}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover border border-white shadow-xs"
                    />
                  ))}
                </div>
              )}

              {/* Selected Features Count */}
              <div className="text-[10px] font-bold text-slate-500">
                ✨ {selectedFeatures.length} interactive magical features included
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="w-full py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

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
