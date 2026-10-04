"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Share2,
  ExternalLink,
  Lock,
  Camera,
  Mail,
  Zap,
  CheckCircle2,
  QrCode,
  Download,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";
import { LoveSurpriseData, OccasionType, DodgeIntensity } from "@/lib/types";
import { generateSecureSlug, hashPasscode, sanitizeInput } from "@/lib/security";
import { saveSurpriseData } from "@/lib/storage";

interface CreatorWizardProps {
  initialOccasion?: OccasionType;
}

const EMOTIONAL_SPARKS = [
  { text: "Your laugh can rescue almost any day ✨", category: "Romantic" },
  { text: "Even boring days feel good when you are there ☕", category: "Romantic" },
  { text: "You remind me who I am when I forget 🤍", category: "Heartfelt" },
  { text: "Yeh kabhi nahi kaha, par tumne meri har version dekhi hai aur kabhi judge nahi kiya 💖", category: "Hinglish" },
  { text: "My worst days feel less heavy after talking to you 🌸", category: "Heartfelt" },
  { text: "You are the calm I did not know I needed in this chaotic world 🏡", category: "Romantic" },
  { text: "Loving you is not about never messing up — it is about always coming back. 🙏", category: "Apology" },
  { text: "You remember the small details I did not know mattered 💫", category: "Heartfelt" },
  { text: "Zyadatar cheezein tumhare saath hi sabse achi lagti hain 🥺", category: "Hinglish" },
  { text: "You still give me butterflies on the most random days 🦋", category: "Romantic" },
  { text: "Hum kitna bhi lad lein, din ke aakhir me tum hi chahiye ❤️", category: "Hinglish" },
];

const LETTER_SPARKS = [
  "I wanted to say this properly, here it goes... 💌",
  "Loving someone isn't about never messing up — it's about always coming back. 🙏",
  "Yeh likhna thoda ajeeb lag raha hai kyunki hum seedha bol dete hain, par is baar words mein daalna tha. ❤️",
  "Some things deserve more than a quick text. You mean the absolute world to me, and I wanted you to know that properly.",
];

export default function CreatorWizard({ initialOccasion = "proposal" }: CreatorWizardProps) {
  // Step 1 to 5
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Details
  const [occasion, setOccasion] = useState<OccasionType>(initialOccasion);
  const [relation, setRelation] = useState("Partner");
  const [recipientName, setRecipientName] = useState("Simran");
  const [senderName, setSenderName] = useState("Aman");
  const [whatsapp, setWhatsapp] = useState("+91 98765 43210");

  // Step 2: Emotional Sparks & 3 Reasons
  const [sparkFilter, setSparkFilter] = useState("All");
  const [reasons, setReasons] = useState<string[]>([
    "Your cute laugh that instantly melts my stress away ✨",
    "How special our late night talks and chai dates feel ☕",
    "Being my safest, warmest home in this entire world 🏡",
  ]);
  const [dodgeIntensity, setDodgeIntensity] = useState<DodgeIntensity>("savage");

  // Step 3: Letter & Photos & PIN
  const [letterText, setLetterText] = useState(
    "Dear Simran,\n\nSome things deserve more than a text. From the moment you entered my life, you've made ordinary days feel special.\n\nThank you for choosing me, for understanding my silly moods, and for being my biggest comfort. I promise to always listen, make you smile, and never take you for granted.\n\nAlways yours,\nAman ❤️"
  );
  const [photos] = useState<string[]>([
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=80",
  ]);
  const [enablePin, setEnablePin] = useState(false);
  const [secretPin, setSecretPin] = useState("1402");

  // Step 4: Preview State
  const [isEnvelopeUnsealed, setIsEnvelopeUnsealed] = useState(false);
  const [previewDodgePos, setPreviewDodgePos] = useState<{ x: number; y: number } | null>(null);
  const [previewDodgeCount, setPreviewDodgeCount] = useState(0);
  const [previewYesAccepted, setPreviewYesAccepted] = useState(false);
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Step 5: Multi-Channel Share State
  const [createdSlug, setCreatedSlug] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCard, setShowQrCard] = useState(false);

  const handleApplySpark = (text: string) => {
    soundFx.playPop();
    const emptyIndex = reasons.findIndex((r) => !r.trim());
    if (emptyIndex !== -1) {
      const copy = [...reasons];
      copy[emptyIndex] = text;
      setReasons(copy);
    } else {
      const copy = [...reasons];
      copy[0] = text;
      setReasons(copy);
    }
  };

  const handleNextToSparks = () => {
    soundFx.playPop();
    if (!recipientName.trim() || !senderName.trim()) {
      alert("Please enter both names to personalize the surprise ❤️");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextToLetter = () => {
    soundFx.playPop();
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextToPreview = () => {
    soundFx.playPop();
    const secureSlug = generateSecureSlug(recipientName, senderName);
    setCreatedSlug(secureSlug);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDodgeNo = () => {
    soundFx.playPop();
    setPreviewDodgeCount((prev) => prev + 1);
    const rx = (Math.random() - 0.5) * 160;
    const ry = (Math.random() - 0.5) * 80;
    setPreviewDodgePos({ x: rx, y: ry });
  };

  const handlePreviewYes = () => {
    soundFx.playSuccessChime();
    setPreviewYesAccepted(true);
  };

  const handleExecutePayment = async () => {
    soundFx.playPop();
    setIsProcessingPay(true);

    // Hash the passcode if enabled
    let pinHash: string | undefined = undefined;
    if (enablePin && secretPin) {
      pinHash = await hashPasscode(secretPin);
    }

    setTimeout(() => {
      setIsProcessingPay(false);
      soundFx.playSuccessChime();

      // Save to secure persistent storage
      const payload: LoveSurpriseData = {
        id: "site_" + Date.now(),
        slug: createdSlug,
        occasion,
        relation,
        recipientName: sanitizeInput(recipientName),
        senderName: sanitizeInput(senderName),
        question:
          occasion === "apology"
            ? "Maan Jao Na Baby? 🥺"
            : occasion === "birthday"
            ? "Happy Birthday My Love! 🎂👑"
            : `Will you be mine forever, ${recipientName}? 💖`,
        reasons: reasons.map(sanitizeInput),
        letterContent: sanitizeInput(letterText),
        photos,
        hasPasscode: enablePin,
        passcodeHash: pinHash,
        dodgeIntensity,
        bgMusic: "summer-guitar",
        whatsappNumber: whatsapp,
        isPaid: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      saveSurpriseData(payload);

      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#E11D48", "#FB7185", "#FDA4AF", "#FFFFFF"],
      });

      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  const liveUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${createdSlug || "simran-aman-demo"}`
      : `https://ourlove.in/p/${createdSlug || "simran-aman-demo"}`;

  // Delivery Channel 1: WhatsApp
  const handleShareWhatsApp = () => {
    soundFx.playPop();
    const msg = encodeURIComponent(
      `Hey ${recipientName}, I made something very special for you ❤️ Open your surprise here: ${liveUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  // Delivery Channel 2: 1-Click Copy Link
  const handleCopyLink = () => {
    soundFx.playPop();
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  // Delivery Channel 3: Native Web Share API
  const handleNativeShare = async () => {
    soundFx.playPop();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `A Secret Surprise For ${recipientName}`,
          text: `Hey ${recipientName}, I made something very special for you ❤️`,
          url: liveUrl,
        });
      } catch {
        // User dismissed share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  const filteredSparks =
    sparkFilter === "All"
      ? EMOTIONAL_SPARKS
      : EMOTIONAL_SPARKS.filter((s) => s.category === sparkFilter);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col justify-between font-sans selection:bg-rose-100 selection:text-rose-700 pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-xs">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
              LoveLink <span className="text-rose-600">Studio</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold leading-tight">Interactive Moments</p>
          </div>
        </Link>

        {/* Step Indicator Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-600">
          <span>Step {step} of 5</span>
        </div>
      </header>

      {/* Segmented Progress Bar */}
      <div className="w-full bg-rose-100/70 h-1">
        <div
          className="bg-rose-600 h-1 transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Main Wizard Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {/* ================================================================= */}
          {/* STEP 1: MAKE IT YOURS */}
          {/* ================================================================= */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Make It Yours
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Who is this surprise for?
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  We will transform your feelings into an unforgettable interactive website.
                </p>
              </div>

              {/* Relationship Pills */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-3">
                <label className="block text-xs font-bold text-slate-700">Their Relation to You</label>
                <div className="flex flex-wrap gap-2">
                  {["Partner 💖", "Girlfriend 🌸", "Boyfriend 💫", "Best Friend 👯", "Crush 🙈", "Spouse 💍"].map(
                    (rel) => {
                      const clean = rel.split(" ")[0];
                      const isSelected = relation === clean;
                      return (
                        <button
                          key={rel}
                          type="button"
                          onClick={() => {
                            soundFx.playPop();
                            setRelation(clean);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                              : "bg-rose-50/50 text-slate-600 border-rose-100 hover:border-rose-200"
                          }`}
                        >
                          {rel}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Names Input Box */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Their Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Simran, Jaan, a nickname..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-semibold text-slate-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Aman"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-semibold text-slate-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>WhatsApp Number (For YES Alert)</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Real-time Alert
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-semibold text-slate-800 outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    You will get an instant WhatsApp message the moment she opens and answers!
                  </p>
                </div>
              </div>

              {/* Occasion Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Choose Story Occasion</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "proposal" as OccasionType, title: "Romantic Proposal", emoji: "💖", desc: "Will You Be Mine?" },
                    { id: "apology" as OccasionType, title: "Heartfelt Apology", emoji: "🥺", desc: "Maan Jao Na Baby" },
                    { id: "birthday" as OccasionType, title: "Birthday Queen", emoji: "🎂", desc: "Blow Virtual Candles" },
                    { id: "love-note" as OccasionType, title: "Sweet Love Note", emoji: "💌", desc: "Everyday Appreciation" },
                  ].map((occ) => {
                    const isSelected = occasion === occ.id;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => {
                          soundFx.playPop();
                          setOccasion(occ.id);
                        }}
                        className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-rose-50/90 border-2 border-rose-600 shadow-xs"
                            : "bg-white border-slate-200 hover:border-rose-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xl">{occ.emoji}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">{occ.title}</h4>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                            {occ.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextToSparks}
                className="w-full py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue to Reasons &amp; Sparks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: THE REASONS & EMOTIONAL SPARKS */}
          {/* ================================================================= */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                  Step 2 • Emotional Sparks
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  What makes them special?
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Tap any spark below to autofill, or write your own heartfelt words.
                </p>
              </div>

              {/* Sparks Selector */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Emotional Sparks (Tap to Add)</span>
                  </label>
                  <div className="flex gap-1">
                    {["All", "Romantic", "Hinglish", "Apology"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSparkFilter(cat)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                          sparkFilter === cat
                            ? "bg-rose-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                  {filteredSparks.map((spark, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySpark(spark.text)}
                      className="text-left p-2.5 rounded-xl border border-rose-100 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50 text-xs text-slate-800 font-medium transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="flex-1 pr-2">{spark.text}</span>
                      <span className="text-[10px] text-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        + Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Reason Slots */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">3 Reasons Included in Scrapbook</label>
                  <span className="text-[10px] text-rose-500 font-semibold">Editable</span>
                </div>

                {reasons.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-2">
                      {idx + 1}
                    </span>
                    <textarea
                      rows={2}
                      value={r}
                      onChange={(e) => {
                        const copy = [...reasons];
                        copy[idx] = e.target.value;
                        setReasons(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-rose-500 resize-none"
                    />
                  </div>
                ))}
              </div>

              {/* Runaway Button Intensity */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Runaway &quot;NO&quot; Button Difficulty</label>
                  <span className="text-[10px] font-bold uppercase text-rose-600">{dodgeIntensity}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["gentle", "savage", "impossible"] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setDodgeIntensity(diff);
                      }}
                      className={`py-2 px-2 text-center rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        dodgeIntensity === diff
                          ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextToLetter}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue to Letter &amp; Photos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: THE HEARTFELT LETTER & PHOTOS */}
          {/* ================================================================= */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                  Step 3 • Heartfelt Letter
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Your Personal Note
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Placed inside the digital sealed envelope for {recipientName} to unseal.
                </p>
              </div>

              {/* Letter Sparks */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-2.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  <span>Letter Starters (Tap to Append)</span>
                </label>
                <div className="flex flex-col gap-1.5">
                  {LETTER_SPARKS.map((spark, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setLetterText((prev) => `${prev}\n\n${spark}`);
                      }}
                      className="text-left p-2 rounded-lg bg-rose-50/50 hover:bg-rose-50 text-[11px] text-slate-700 font-medium border border-rose-100 hover:border-rose-300 transition-all cursor-pointer"
                    >
                      {spark}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Card */}
              <div className="bg-[#FFFBF8] rounded-3xl p-5 border border-rose-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                    Wax Seal Letter
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {letterText.length} characters
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  className="w-full bg-transparent text-sm leading-relaxed text-slate-800 outline-none font-serif resize-none"
                  placeholder="Write whatever is in your heart..."
                />

                <div className="flex items-center justify-between pt-2 border-t border-rose-100">
                  <span className="text-xs italic text-slate-400">Forever Yours,</span>
                  <span className="text-sm font-bold text-rose-600">{senderName} ❤️</span>
                </div>
              </div>

              {/* Photo Reassurance */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-rose-500" />
                    <span>Memory Photos (Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">2 Photos Loaded</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {photos.map((p, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="Memory" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Add photos after payment:</strong> You can also update or change photos anytime after unlocking your link!
                  </span>
                </div>
              </div>

              {/* Secret Passcode */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-xs font-bold text-slate-700">Secret Date Lock (PIN)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enablePin}
                    onChange={(e) => setEnablePin(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                </div>
                {enablePin && (
                  <div className="pt-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={secretPin}
                      onChange={(e) => setSecretPin(e.target.value)}
                      placeholder="e.g. 1402 (Anniversary Date)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 outline-none focus:border-rose-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      They must enter this secret date to open the surprise!
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextToPreview}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue to Envelope Preview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: ENVELOPE PREVIEW & PAYWALL */}
          {/* ================================================================= */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                  Step 4 • Interactive Preview &amp; Seal
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Unseal Your Surprise
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Tap the wax seal below to test how {recipientName} will experience your website.
                </p>
              </div>

              {/* Envelope Preview */}
              <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-sm space-y-4">
                {!isEnvelopeUnsealed ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    <div
                      onClick={() => {
                        soundFx.playSuccessChime();
                        setIsEnvelopeUnsealed(true);
                      }}
                      className="cursor-pointer group flex flex-col items-center"
                    >
                      <div className="relative w-48 h-32 rounded-2xl bg-gradient-to-b from-rose-100 to-rose-200 border-2 border-rose-300 shadow-md flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-rose-200 group-hover:scale-110 transition-transform">
                          <Heart className="w-6 h-6 fill-white" />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs shadow-xs animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Unseal It 💌 (Tap to Open)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Made with love for {recipientName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-100 text-xs">
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                        <span>Envelope Unsealed!</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEnvelopeUnsealed(false)}
                        className="text-[10px] text-slate-400 hover:text-rose-600 font-bold"
                      >
                        Reseal
                      </button>
                    </div>

                    <div className="bg-[#FFFBF8] p-4 rounded-2xl border border-rose-100 text-xs space-y-2 font-serif text-slate-700 max-h-36 overflow-y-auto">
                      <p className="font-bold text-rose-600">Dear {recipientName},</p>
                      <p className="whitespace-pre-line leading-relaxed">{letterText}</p>
                      <p className="text-right font-bold text-rose-600">— {senderName} ❤️</p>
                    </div>

                    {/* Runaway Button Test */}
                    <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl text-center space-y-2">
                      <p className="text-xs font-extrabold text-slate-800">
                        {occasion === "apology" ? "Maan Jao Na Baby? 🥺" : "Will you be mine forever? 💖"}
                      </p>

                      <div className="relative min-h-[65px] flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handlePreviewYes}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          {previewYesAccepted ? "Accepted! 💖" : "YES! 💖"}
                        </button>

                        <motion.button
                          type="button"
                          onMouseEnter={handleDodgeNo}
                          onTouchStart={handleDodgeNo}
                          onClick={handleDodgeNo}
                          animate={previewDodgePos ? { x: previewDodgePos.x, y: previewDodgePos.y } : { x: 0, y: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          className="px-4 py-2 rounded-xl bg-white text-slate-500 font-bold text-xs border border-slate-200 cursor-pointer"
                        >
                          No 💔
                        </motion.button>
                      </div>

                      {previewDodgeCount > 0 && (
                        <p className="text-[10px] font-bold text-rose-600 animate-pulse">
                          {previewDodgeCount >= 3 ? "Pakad ke dikhao! 😜 Teleporting away!" : "Dodging! She can only click YES! 🎉"}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Paywall Card */}
              <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {recipientName} &amp; {senderName}
                    </h3>
                    <p className="text-xs text-rose-600 font-semibold capitalize">{occasion} Story</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">₹99</span>
                    <span className="block text-[10px] text-slate-400 line-through">₹499 (80% OFF)</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>100% Watermark-Free</strong> clean experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Instant WhatsApp Alert</strong> when she says YES 🎉</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>1 Year Unlimited Views</strong> on mobile &amp; desktop</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    disabled={isProcessingPay}
                    onClick={handleExecutePayment}
                    className="flex-1 py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isProcessingPay ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₹99 &amp; Unlock Live Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* STEP 5: MULTI-CHANNEL DELIVERY (WHATSAPP, QR, SHARE API, COPY) */}
          {/* ================================================================= */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1.5 pt-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Your Surprise Link is Ready! 🎉
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Deliver this secret website to <strong className="text-rose-600">{recipientName}</strong> using any method below:
                </p>
              </div>

              {/* Link Container */}
              <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-sm space-y-3.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Official Cryptographic Live Link
                </label>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs font-mono font-bold text-slate-800 break-all select-all">
                  <span>{liveUrl}</span>
                </div>

                {/* 4 MULTI-CHANNEL DELIVERY BUTTONS */}
                <div className="space-y-2 pt-1">
                  {/* Delivery 1: WhatsApp 1-Tap */}
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Send on WhatsApp</span>
                  </button>

                  {/* Delivery 2: 1-Click Copy */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Link Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Secret Link</span>
                      </>
                    )}
                  </button>

                  {/* Delivery 3: QR Code Card Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setShowQrCard(!showQrCard);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-rose-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-rose-600" />
                    <span>{showQrCard ? "Hide QR Gift Card" : "Generate Printable QR Gift Card"}</span>
                  </button>

                  {/* Delivery 4: Native Mobile Share Sheet */}
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span>More Share Options (Instagram, AirDrop, etc.)</span>
                  </button>
                </div>

                {/* Printable Aesthetic QR Card Preview */}
                {showQrCard && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-3 border-t border-slate-100 flex flex-col items-center text-center space-y-3"
                  >
                    <div className="p-4 rounded-3xl bg-[#FFFBF8] border border-rose-200 shadow-md max-w-xs w-full flex flex-col items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 mb-1">
                        Digital Gift Card
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mb-2">
                        For {recipientName} ❤️
                      </h4>
                      <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xs mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                            liveUrl
                          )}`}
                          alt="QR Code"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight">
                        Scan with any phone camera to unseal your surprise.
                      </p>
                      <p className="text-[9px] font-serif italic text-slate-400 mt-1">
                        From {senderName} with all my love
                      </p>
                    </div>

                    <a
                      href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                        liveUrl
                      )}`}
                      download={`LoveLink-${recipientName}-QR.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download High-Res QR Image</span>
                    </a>
                  </motion.div>
                )}
              </div>

              {/* Real-Time WhatsApp Alert Guarantee */}
              <div className="p-3.5 bg-white border border-rose-100 rounded-2xl text-center space-y-1">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Real-Time WhatsApp Alert Active
                </span>
                <p className="text-[11px] text-slate-400">
                  You will receive an alert at <strong>{whatsapp}</strong> as soon as {recipientName} opens the link and presses YES!
                </p>
              </div>

              {/* View Live Surprise */}
              <Link
                href={`/p/${createdSlug || "simran-aman-demo"}`}
                target="_blank"
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Recipient Surprise Website</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center text-[10px] text-slate-400 font-semibold px-4">
        © 2026 LoveLink Studio • 100% Confidential &amp; Secure
      </footer>
    </div>
  );
}
