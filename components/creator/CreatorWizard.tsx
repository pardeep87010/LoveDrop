"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Sparkles,
  Plus,
  Trash2,
  Lock,
  Smartphone,
  MessageCircle,
  ExternalLink,
  Share2,
  Clock,
  HelpCircle,
  Cookie,
  Play,
  Pause,
  Music,
  Camera,
  RotateCcw,
  Zap,
  Mail,
  Send,
  Upload,
  Image as ImageIcon,
  Globe,
  Copy,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";
import { LoveSurpriseData, OccasionType, AudioTrackId } from "@/lib/types";
import { generateSecureSlug, hashPasscode, sanitizeInput } from "@/lib/security";
import { saveSurpriseData } from "@/lib/storage";
import { usePricing } from "@/lib/pricing";
import PagePreviewCard from "@/components/creator/PagePreviewCard";
import { compressImageToBlob } from "@/lib/imageCompress";

export const MAX_LIMITS = {
  PHOTOS: 10,
  QUIZ_QUESTIONS: 5,
  MILESTONES: 6,
  REASONS: 9,
  FORTUNES: 5,
} as const;

interface CreatorWizardProps {
  initialOccasion?: OccasionType;
  initialTheme?: string;
}

// 6 Available Themes
const THEMES = [
  {
    id: "classic-romance",
    name: "Classic Romance",
    cardBg: "#FFF0F4",
    accent: "#FF2E63",
    badgeColor: "bg-[#FF2E63]",
  },
  {
    id: "first-love",
    name: "First Love",
    cardBg: "#E8F8F5",
    accent: "#00B894",
    badgeColor: "bg-[#00B894]",
  },
  {
    id: "minimalist-love",
    name: "Minimalist Love",
    cardBg: "#F0F3FF",
    accent: "#6C5CE7",
    badgeColor: "bg-[#6C5CE7]",
  },
  {
    id: "eternal-vows",
    name: "Eternal Vows",
    cardBg: "#FDE2E6",
    accent: "#D63031",
    badgeColor: "bg-[#D63031]",
  },
  {
    id: "garden-of-love",
    name: "Garden of Love",
    cardBg: "#F0FFF4",
    accent: "#00A86B",
    badgeColor: "bg-[#00A86B]",
  },
  {
    id: "long-distance-love",
    name: "Long Distance Love",
    cardBg: "#F0F7FF",
    accent: "#0984E3",
    badgeColor: "bg-[#0984E3]",
  },
];

// Official Default Runaway NO Button Sequence
const DEFAULT_DODGE_PHRASES = [
  "Really?! 😳",
  "Are you sure ? 🥺",
  "Please........... 🥺",
  "Think Again! 😜",
  "Don't do this to me! 😭",
  "Come onnnn 😩",
  "So you wanna play with me 😏",
  "I'm ready! 👀",
  "Do you think you can win against me? 😈",
];

export default function CreatorWizard({
  initialOccasion = "proposal",
  initialTheme = "classic-romance",
}: CreatorWizardProps) {
  // Step state: 1 to 9 (Pages 1 to 8 + Launch Step 9)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(1);

  // Geo-Pricing hook
  const { region, setRegion, plans } = usePricing();
  const [selectedPlanId, setSelectedPlanId] = useState<"month" | "year" | "lifetime">("year");
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[1] || plans[0];

  // Enabled / Disabled Pages map (Every optional page can be excluded/deleted)
  const [enabledPages, setEnabledPages] = useState<Record<string, boolean>>({
    page2_question: true,
    page3_letter: true,
    page4_photos: true,
    page5_reasons: true,
    page6_story: true,
    page7_quiz: true,
    page8_fortunes: true,
  });

  const togglePageEnabled = (pageKey: string) => {
    soundFx.playPop();
    setEnabledPages((prev) => ({
      ...prev,
      [pageKey]: !prev[pageKey],
    }));
  };

  // ===================================================================
  // STAGE 1 (PAGE 1): WELCOME & INTRO TYPING
  // ===================================================================
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [typingWord1, setTypingWord1] = useState("Hello");
  const [typingWord2, setTypingWord2] = useState("Yes, You");
  const [buttonText, setButtonText] = useState("Let's Go");
  const [theme, setTheme] = useState(initialTheme);

  // Helper to dynamically sync recipient name into love letter
  const handleRecipientNameChange = (newName: string) => {
    const oldName = recipientName.trim();
    setRecipientName(newName);
    setLetterText((prev) => {
      if (oldName && prev.includes(`My dearest ${oldName}`)) {
        return prev.replace(`My dearest ${oldName}`, `My dearest ${newName.trim() || "My Love"}`);
      }
      return prev.replace(/^My dearest (?:Sarah|Love|My Love|[^\n,]+)/, `My dearest ${newName.trim() || "My Love"}`);
    });
  };

  // Helper to dynamically sync sender name into love letter
  const handleSenderNameChange = (newName: string) => {
    const oldName = senderName.trim();
    setSenderName(newName);
    setLetterText((prev) => {
      if (oldName && prev.includes(oldName)) {
        return prev.replace(new RegExp(`Forever yours,\\s*${oldName}`, "i"), `Forever yours,\n${newName.trim() || "Always"}`);
      }
      return prev.replace(/Forever yours,\s*(?:Michael|Always|[^\n💕]+)/i, `Forever yours,\n${newName.trim() || "Always"}`);
    });
  };

  // ===================================================================
  // STAGE 2 (PAGE 2): THE QUESTION & RUNAWAY NO
  // ===================================================================
  const [question, setQuestion] = useState("do you love me ??");
  const [yesButtonText, setYesButtonText] = useState("YES! ❤️");
  const [dodgePhrases, setDodgePhrases] = useState<string[]>([
    "Really?! 😳",
    "Are you sure ? 🥺",
    "Please........... 🥺",
    "Think Again! 😜",
    "Don't do this to me! 😭",
    "Come onnnn 😩",
    "So you wanna play with me 😏",
    "I'm ready! 👀",
    "Do you think you can win against me? 😈",
  ]);
  const [newDodgeInput, setNewDodgeInput] = useState("");

  // ===================================================================
  // STAGE 3 (PAGE 3): HEARTFELT LOVE LETTER
  // ===================================================================
  const [letterText, setLetterText] = useState(
    "My dearest Love,\n\nFrom the moment I met you, my life changed in ways I never expected. Your smile has become my favorite sight, your laugh my favorite sound.\n\nEvery day with you feels like an adventure, and I can't imagine my life without you by my side. You make the ordinary extraordinary.\n\nI love you more than words could ever express, but I'm going to try anyway through this letter.\n\nForever yours,\nAlways 💕"
  );
  const [waxSealEmoji, setWaxSealEmoji] = useState("💌");

  // ===================================================================
  // STAGE 4 (PAGE 4): PHOTO MEMORIES
  // ===================================================================
  const [photos, setPhotos] = useState<{ image: string; caption: string }[]>([
    {
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=80",
      caption: "Our first date at the coffee shop",
    },
    {
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1000&auto=format&fit=crop&q=80",
      caption: "That spontaneous weekend road trip",
    },
    {
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1000&auto=format&fit=crop&q=80",
      caption: "The night we couldn't stop talking under the stars",
    },
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= MAX_LIMITS.PHOTOS) {
      alert(`Maximum ${MAX_LIMITS.PHOTOS} photos allowed! Please remove an existing photo first.`);
      if (photoFileInputRef.current) photoFileInputRef.current.value = "";
      return;
    }

    // 1. Strict Image Type Validation
    if (!file.type.startsWith("image/")) {
      alert("Only image files (JPEG, PNG, WEBP, GIF, HEIC) are allowed!");
      if (photoFileInputRef.current) photoFileInputRef.current.value = "";
      return;
    }

    // 2. Strict 20MB Max File Size Validation
    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 20MB limit. Single image maximum allowed size is 20MB.");
      if (photoFileInputRef.current) photoFileInputRef.current.value = "";
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // 3. Smart Compression: Compress up to 20MB photos to ~150KB-300KB WebP
      const { blob } = await compressImageToBlob(file, 1600, 0.82);

      // 4. Send compressed image to /api/upload (which encrypts via AES-256-GCM and stores in Cloudflare R2)
      const formData = new FormData();
      formData.append("file", blob, file.name.replace(/\.[^/.]+$/, ".webp"));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await res.json();
      if (uploadResult.success && uploadResult.url) {
        soundFx.playPop();
        confetti({ particleCount: 30, spread: 50 });
        setPhotos((prev) => [
          ...prev,
          {
            image: uploadResult.url,
            caption: newPhotoCaption.trim() || `Our sweet memory #${prev.length + 1} 💕`,
          },
        ]);
        setNewPhotoCaption("");
        setNewPhotoUrl("");
      } else {
        alert(uploadResult.error || "Failed to upload image.");
      }
    } catch (uploadErr: any) {
      console.warn("Upload error:", uploadErr);
      alert(uploadErr?.message || "Error processing photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
      if (photoFileInputRef.current) photoFileInputRef.current.value = "";
    }
  };

  const handleAddPhotoSubmit = () => {
    if (photos.length >= MAX_LIMITS.PHOTOS) {
      alert(`Maximum ${MAX_LIMITS.PHOTOS} photos allowed! Please remove an existing photo first.`);
      return;
    }
    if (newPhotoUrl.trim()) {
      soundFx.playPop();
      confetti({ particleCount: 25, spread: 45 });
      setPhotos((prev) => [
        ...prev,
        {
          image: newPhotoUrl.trim(),
          caption: newPhotoCaption.trim() || `Our sweet memory #${prev.length + 1} 💕`,
        },
      ]);
      setNewPhotoUrl("");
      setNewPhotoCaption("");
    } else {
      // If URL is empty, automatically open device photo file dialog!
      photoFileInputRef.current?.click();
    }
  };

  // ===================================================================
  // STAGE 5 (PAGE 5): REASONS I LOVE YOU
  // ===================================================================
  const [reasons, setReasons] = useState<{ id: number; emoji: string; title: string }[]>([
    { id: 1, emoji: "😊", title: "Your smile" },
    { id: 2, emoji: "💕", title: "Your kindness" },
    { id: 3, emoji: "😂", title: "Your laugh" },
    { id: 4, emoji: "🙏", title: "Your patience" },
    { id: 5, emoji: "🤗", title: "Your hugs" },
    { id: 6, emoji: "👫", title: "Being my best friend" },
    { id: 7, emoji: "🌟", title: "Your support" },
    { id: 8, emoji: "✨", title: "Being you" },
    { id: 9, emoji: "🎨", title: "Your creativity" },
  ]);
  const [newReasonTitle, setNewReasonTitle] = useState("");
  const [newReasonEmoji, setNewReasonEmoji] = useState("💖");

  // ===================================================================
  // STAGE 6 (PAGE 6): OUR STORY / MILESTONES
  // ===================================================================
  const [milestones, setMilestones] = useState<
    { icon: string; date: string; title: string; description: string }[]
  >([
    {
      icon: "☕",
      date: "2023 • June",
      title: "We Met",
      description: "At that coffee shop on Main Street",
    },
    {
      icon: "🍽️",
      date: "2023 • July",
      title: "First Date",
      description: "Dinner and a walk in the park",
    },
    {
      icon: "✨",
      date: "2023 • August",
      title: "First Kiss",
      description: "Under the stars",
    },
    {
      icon: "💖",
      date: "2023 • October",
      title: "Said 'I Love You'",
      description: "The best moment",
    },
  ]);
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestoneIcon, setNewMilestoneIcon] = useState("💖");

  // ===================================================================
  // STAGE 7 (PAGE 7): LOVE QUIZ
  // ===================================================================
  const [quizQuestions, setQuizQuestions] = useState<
    { id: number; question: string; options: string[]; correct: string }[]
  >([
    {
      id: 1,
      question: "What's my favorite food?",
      options: ["Pizza", "Sushi", "Tacos", "Italian"],
      correct: "Sushi",
    },
    {
      id: 2,
      question: "What do I love doing most with you?",
      options: ["Watching movies", "Traveling", "Cooking", "All of the above"],
      correct: "All of the above",
    },
  ]);
  const [newQuizQ, setNewQuizQ] = useState("");
  const [newQuizOpts, setNewQuizOpts] = useState(["", "", "", ""]);
  const [newQuizCorrect, setNewQuizCorrect] = useState("");
  const [newQuizCorrectIdx, setNewQuizCorrectIdx] = useState(0);
  const [quizValidationError, setQuizValidationError] = useState("");

  const handleAddQuizQuestion = () => {
    if (quizQuestions.length >= MAX_LIMITS.QUIZ_QUESTIONS) {
      soundFx.playPop();
      setQuizValidationError(`Maximum ${MAX_LIMITS.QUIZ_QUESTIONS} quiz questions allowed!`);
      return;
    }

    const validOptions = newQuizOpts.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      soundFx.playPop();
      setQuizValidationError("Please enter at least 2 options for your question!");
      return;
    }

    const finalQuestion =
      newQuizQ.trim() || `Love Quiz Question #${quizQuestions.length + 1}`;
    const selectedCorrect =
      newQuizOpts[newQuizCorrectIdx]?.trim() || validOptions[0];

    soundFx.playPop();
    confetti({ particleCount: 35, spread: 55 });
    setQuizQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: finalQuestion,
        options: validOptions,
        correct: selectedCorrect,
      },
    ]);
    setNewQuizQ("");
    setNewQuizOpts(["", "", "", ""]);
    setNewQuizCorrectIdx(0);
    setQuizValidationError("");
  };

  // ===================================================================
  // STAGE 8 (PAGE 8): FORTUNE COOKIES / PROPHECIES
  // ===================================================================
  const [fortuneQuotes, setFortuneQuotes] = useState<string[]>([
    "A lifetime of happiness awaits you two",
    "Your love story is just beginning",
    "Every moment together is a treasure",
    "Your soulmate is closer than you think... actually, they made this for you!",
    "Love is the answer to every question",
  ]);
  const [newFortuneInput, setNewFortuneInput] = useState("");

  // ===================================================================
  // STAGE 9: FINAL REVIEW, AUDIO, PASSCODE & LAUNCH
  // ===================================================================
  const [bgMusic, setBgMusic] = useState<AudioTrackId>("romantic-lofi");
  const [enablePin, setEnablePin] = useState(false);
  const [secretPin, setSecretPin] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("0000000000");
  // Resend Email States
  const [creatorEmail, setCreatorEmail] = useState("");
  const [sendToPartnerEmail, setSendToPartnerEmail] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [customEmailNote, setCustomEmailNote] = useState("");
  const [emailSendStatus, setEmailSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const [resendDirectEmail, setResendDirectEmail] = useState("");
  const [isSendingDirectEmail, setIsSendingDirectEmail] = useState(false);
  const [directEmailStatus, setDirectEmailStatus] = useState<string | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Hey! I just opened your special love website and I loved it so much! You made my day! ❤️"
  );
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isCustomSlugEdited, setIsCustomSlugEdited] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);

  // Audio preview playback
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleAudio = () => {
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

  // Step Navigation Helper
  const goToStep = (targetStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => {
    soundFx.playPop();
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Publish Handler
  const handlePublish = async () => {
    soundFx.playPop();
    setIsProcessingPay(true);

    let pinHash: string | undefined = undefined;
    if (enablePin && secretPin) {
      pinHash = await hashPasscode(secretPin);
    }

    const rawCandidateSlug = (
      (isCustomSlugEdited && customSlug.trim() ? customSlug.trim() : "") ||
      generateSecureSlug(recipientName || "My Love", senderName || "Me")
    );
    const finalSlug = rawCandidateSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "my-love";

    setTimeout(() => {
      const siteData: LoveSurpriseData = {
        id: "love-" + Date.now(),
        slug: finalSlug,
        occasion: initialOccasion,
        relation: "Partner",
        recipientName: sanitizeInput(recipientName.trim() || "My Love"),
        senderName: sanitizeInput(senderName.trim() || "Me"),
        question: sanitizeInput(question.trim() || "do you love me ??"),
        subheading: "A special romantic surprise made just for you",
        reasons: reasons.slice(0, 3).map((r) => r.title),
        letterContent: letterText
          .replace(/\bSarah\b/g, recipientName.trim() || "My Love")
          .replace(/\bMichael\b/g, senderName.trim() || "Me"),
        photos: photos.map((p) => p.image),
        theme: theme,
        enabledPages: enabledPages,
        typingIntroWords: [typingWord1, typingWord2, recipientName.trim() || "My Love"],
        buttonText: buttonText,
        yesButtonText: yesButtonText,
        dodgePhrases: dodgePhrases,
        photoMemories: photos,
        nineReasons: reasons,
        storyMilestones: milestones,
        quizList: quizQuestions,
        fortuneQuotes: fortuneQuotes,
        pricingPlan: selectedPlanId,
        passcodeHash: pinHash,
        hasPasscode: enablePin && !!secretPin,
        dodgeIntensity: "savage",
        bgMusic: bgMusic,
        whatsappNumber: whatsappNumber,
        whatsappMessage: whatsappMessage,
        creatorEmail: creatorEmail.trim() || undefined,
        recipientEmail: (sendToPartnerEmail && partnerEmail.trim()) ? partnerEmail.trim() : undefined,
        isPaid: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      saveSurpriseData(siteData);
      setCreatedSlug(finalSlug);
      setIsProcessingPay(false);
      setIsCreated(true);
      soundFx.playSuccessChime();

      // Persist to MongoDB backend and dispatch transactional emails
      const targetSiteUrl = `${typeof window !== "undefined" ? window.location.origin : "https://lovedrop.online"}/p/${finalSlug}`;
      if (creatorEmail.trim() || (sendToPartnerEmail && partnerEmail.trim())) {
        setEmailSendStatus("sending");
      }

      fetch("/api/surprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...siteData,
          passcode: enablePin ? secretPin : undefined,
          customMessage: customEmailNote.trim() || undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.slug && data.slug !== finalSlug) {
              setCreatedSlug(data.slug);
            }
            if (creatorEmail.trim() || (sendToPartnerEmail && partnerEmail.trim())) {
              setEmailSendStatus("sent");
              setEmailStatusMessage("💌 Love surprise saved & sent via Resend successfully!");
            }
          } else {
            console.warn("MongoDB API response warning:", data.error);
          }
        })
        .catch((err) => {
          console.warn("MongoDB sync warning (offline mode):", err);
        });

      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#FF2E63", "#FF6B8B", "#FFD166", "#06D6A0"],
      });
    }, 1200);
  };

  const handleSendDirectEmail = async () => {
    if (!resendDirectEmail.trim()) return;
    setIsSendingDirectEmail(true);
    setDirectEmailStatus(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorEmail: resendDirectEmail.trim(),
          recipientName: recipientName.trim() || "My Love",
          senderName: senderName.trim() || "Someone Special",
          siteUrl: siteUrl,
          passcode: enablePin ? secretPin : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDirectEmailStatus(
          data.simulated
            ? "✨ Simulated email sent! (Add your RESEND_API_KEY in .env.local for live delivery)"
            : "✅ Email sent successfully via Resend!"
        );
      } else {
        setDirectEmailStatus(`❌ ${data.error || "Failed to send email"}`);
      }
    } catch (err: any) {
      setDirectEmailStatus(`❌ ${err.message || "Network error"}`);
    } finally {
      setIsSendingDirectEmail(false);
    }
  };

  const selectedThemeObj = THEMES.find((t) => t.id === theme) || THEMES[0];
  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${createdSlug}`
      : `https://lovedrop.online/p/${createdSlug}`;

  const stepTitles = [
    "Welcome",
    "Photo Gallery",
    "Reasons I Love You",
    "Our Timeline",
    "Love Quiz",
    "Fortune Cookies",
    "The Question",
    "Love Letter",
    "Launch & Publish",
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] text-slate-800 ${isCreated ? "pb-8" : "pb-28"} selection:bg-pink-100 selection:text-pink-600`}>
      {/* =================================================================== */}
      {/* TOP NAVIGATION BAR: BACK & CLOSE BUTTONS (Matches user request)     */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100/80 px-4 py-2.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            onClick={() => soundFx.playPop()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 border border-pink-200 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FF2E63]" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF2E63] block">
              {isCreated ? "SURPRISE READY 🎉" : `PAGE ${step} OF 9`}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {isCreated ? "Website Created Successfully" : stepTitles[step - 1]}
            </span>
          </div>

          <Link
            href="/"
            onClick={() => soundFx.playPop()}
            title="Close and exit to home"
            className="w-8 h-8 rounded-full bg-white hover:bg-pink-50 text-slate-400 hover:text-slate-700 border border-pink-200 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* 9-Step Progress Dots Track - only while creating */}
        {!isCreated && (
          <div className="max-w-2xl mx-auto pt-2 pb-0.5">
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => {
                const isCurrent = step === s;
                const isCompleted = step > s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => goToStep(s as any)}
                    className="flex-1 py-1 group flex flex-col items-center cursor-pointer"
                  >
                    <div
                      className={`w-full h-1.5 rounded-full transition-all ${
                        isCurrent
                          ? "bg-[#FF2E63] shadow-xs"
                          : isCompleted
                          ? "bg-pink-400"
                          : "bg-pink-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 ${isCreated ? "flex items-center justify-center min-h-[calc(100vh-140px)]" : ""}`}>
        <div className={isCreated ? "w-full max-w-xl mx-auto" : "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"}>
          {/* =============================================================== */}
          {/* LEFT / TOP FORM CONTROLS (Mobile First)                         */}
          {/* =============================================================== */}
          <div className={isCreated ? "w-full" : "lg:col-span-7 xl:col-span-7 space-y-6"}>
            <AnimatePresence mode="wait">
              {/* ----------------------------------------------------------- */}
              {/* STEP 1: PAGE 1 (WELCOME & TYPING INTRO)                     */}
              {/* ----------------------------------------------------------- */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 1 • Intro Screen
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Who is this surprise for?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      They will see their name appear in an animated greeting with romantic music.
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                    {/* Recipient Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Their Name or Sweet Nickname
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => handleRecipientNameChange(e.target.value)}
                        placeholder="e.g. My Love, Priya, Alex, Babe..."
                        className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                      />
                      {/* Quick Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {["My Love", "Babe", "Honey", "Sweetheart", "Darling"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              soundFx.playPop();
                              handleRecipientNameChange(p);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                              recipientName === p
                                ? "bg-[#FF2E63] text-white border-[#FF2E63]"
                                : "bg-white text-slate-600 border-slate-200 hover:border-pink-300"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sender Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Name (From)
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => handleSenderNameChange(e.target.value)}
                        placeholder="e.g. Michael, Naveen, Alex, Your Soulmate..."
                        className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                      />
                    </div>

                    {/* Button Text */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Button Label on Greeting Card
                      </label>
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                      />
                    </div>

                    {/* Theme Style Picker */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Choose Visual Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {THEMES.map((thm) => (
                          <button
                            key={thm.id}
                            type="button"
                            onClick={() => {
                              soundFx.playPop();
                              setTheme(thm.id);
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                              theme === thm.id
                                ? "border-[#FF2E63] bg-pink-50/60 shadow-xs ring-2 ring-[#FF2E63]/20"
                                : "border-slate-200 hover:border-pink-300 bg-white"
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                              style={{ backgroundColor: thm.accent }}
                            />
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {thm.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 2: PAGE 2 (PHOTO MEMORIES GALLERY)                     */}
              {/* ----------------------------------------------------------- */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 2 • Photos
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Photo Memories &amp; Polaroids
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Framed with authentic polaroid washi-tape and romantic captions.
                    </p>
                  </div>

                  {/* Page Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          enabledPages.page4_photos
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Include Photos Gallery</p>
                        <p className="text-[10px] text-slate-400">
                          {enabledPages.page4_photos ? "Active in surprise" : "Skipped by recipient"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePageEnabled("page4_photos")}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        enabledPages.page4_photos ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                          enabledPages.page4_photos ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {enabledPages.page4_photos ? (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                      {/* Photo List */}
                      <div className="space-y-3">
                        {photos.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl border border-pink-100 bg-pink-50/20 flex items-center gap-3"
                          >
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-pink-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image}
                                alt="Memory"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <input
                                type="text"
                                value={item.caption}
                                onChange={(e) => {
                                  const updated = [...photos];
                                  updated[idx].caption = e.target.value;
                                  setPhotos(updated);
                                }}
                                placeholder="Add caption..."
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-pink-400 bg-white"
                              />
                              <input
                                type="text"
                                value={item.image}
                                onChange={(e) => {
                                  const updated = [...photos];
                                  updated[idx].image = e.target.value;
                                  setPhotos(updated);
                                }}
                                placeholder="Image URL..."
                                className="w-full px-3 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500 outline-none focus:border-pink-400 bg-white"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setPhotos(photos.filter((_, i) => i !== idx));
                              }}
                              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new photo input */}
                      <div className="pt-2 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Add Another Memory</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            photos.length >= MAX_LIMITS.PHOTOS
                              ? "bg-amber-100 text-amber-700 font-bold"
                              : "bg-pink-50 text-pink-600"
                          }`}>
                            {photos.length} / {MAX_LIMITS.PHOTOS} Max Photos
                          </span>
                        </div>

                        {photos.length >= MAX_LIMITS.PHOTOS ? (
                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                            <p className="text-xs font-bold text-amber-800">
                              📸 Maximum limit of {MAX_LIMITS.PHOTOS} photos reached!
                            </p>
                            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                              Please delete any existing photo above if you want to upload a new one. (On certificate, 3 random photos will be stylishly showcased).
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Hidden File Picker Input */}
                            <input
                              ref={photoFileInputRef}
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/heic"
                              onChange={handlePhotoFileSelect}
                              className="hidden"
                            />

                            {/* Direct Device Upload Button */}
                            <button
                              type="button"
                              disabled={isUploadingPhoto || photos.length >= MAX_LIMITS.PHOTOS}
                              onClick={() => photoFileInputRef.current?.click()}
                              className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-pink-300 hover:border-[#FF2E63] bg-pink-50/50 hover:bg-pink-50 text-pink-700 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer group shadow-2xs active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="w-8 h-8 rounded-full bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center text-pink-600 transition-colors">
                                <Upload className="w-4 h-4" />
                              </div>
                              <span>
                                {isUploadingPhoto
                                  ? "Compressing & Encrypting Photo..."
                                  : "📁 Choose Photo from Device (Max 20MB • Auto-Compressed)"}
                              </span>
                            </button>

                            <div className="text-[10px] text-slate-400 font-semibold text-center flex items-center gap-2">
                              <span className="h-[1px] flex-1 bg-slate-100" />
                              <span>OR PASTE IMAGE URL WITH CAPTION</span>
                              <span className="h-[1px] flex-1 bg-slate-100" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                placeholder="Image URL (optional if uploading)..."
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400 bg-white"
                              />
                              <input
                                type="text"
                                value={newPhotoCaption}
                                onChange={(e) => setNewPhotoCaption(e.target.value)}
                                placeholder="Caption (e.g. That magical evening...)"
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400 bg-white"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleAddPhotoSubmit}
                              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{newPhotoUrl.trim() ? "Add Photo from URL" : "Open File Picker to Add Photo"}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
                      <button
                        type="button"
                        onClick={() => togglePageEnabled("page4_photos")}
                        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Restore Page
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 3: PAGE 3 (REASONS I LOVE YOU)                         */}
              {/* ----------------------------------------------------------- */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 3 • Reasons
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Reasons I Love You
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Cute reasons why they mean the world to you.
                    </p>
                  </div>

                  {/* Page Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          enabledPages.page5_reasons
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Include Reasons Page</p>
                        <p className="text-[10px] text-slate-400">
                          {enabledPages.page5_reasons ? "Active in surprise" : "Skipped by recipient"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePageEnabled("page5_reasons")}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        enabledPages.page5_reasons ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                          enabledPages.page5_reasons ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {enabledPages.page5_reasons ? (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                      {/* Reasons Grid / List */}
                      <div className="space-y-2">
                        {reasons.map((r, idx) => (
                          <div
                            key={r.id}
                            className="p-2.5 rounded-xl border border-pink-100 bg-pink-50/20 flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={r.emoji}
                              onChange={(e) => {
                                const updated = [...reasons];
                                updated[idx].emoji = e.target.value;
                                setReasons(updated);
                              }}
                              className="w-9 h-9 rounded-lg border border-slate-200 text-center text-base outline-none bg-white"
                            />
                            <input
                              type="text"
                              value={r.title}
                              onChange={(e) => {
                                const updated = [...reasons];
                                updated[idx].title = e.target.value;
                                setReasons(updated);
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-pink-400 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setReasons(reasons.filter((_, i) => i !== idx));
                              }}
                              className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Reason */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Add Another Reason</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            reasons.length >= MAX_LIMITS.REASONS
                              ? "bg-amber-100 text-amber-700 font-bold"
                              : "bg-pink-50 text-pink-600"
                          }`}>
                            {reasons.length} / {MAX_LIMITS.REASONS} Max Reasons
                          </span>
                        </div>
                        {reasons.length >= MAX_LIMITS.REASONS ? (
                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                            <p className="text-xs font-bold text-amber-800">
                              💖 Maximum limit of {MAX_LIMITS.REASONS} reasons reached!
                            </p>
                            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                              The 9 reasons match perfectly with the 3×3 interactive flip card grid.
                            </p>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newReasonEmoji}
                              onChange={(e) => setNewReasonEmoji(e.target.value)}
                              className="w-10 h-10 rounded-xl border border-slate-200 text-center text-lg outline-none"
                            />
                            <input
                              type="text"
                              value={newReasonTitle}
                              onChange={(e) => setNewReasonTitle(e.target.value)}
                              placeholder="Add new reason..."
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (reasons.length >= MAX_LIMITS.REASONS) {
                                  alert(`Maximum ${MAX_LIMITS.REASONS} reasons allowed!`);
                                  return;
                                }
                                if (newReasonTitle.trim()) {
                                  soundFx.playPop();
                                  setReasons([
                                    ...reasons,
                                    {
                                      id: Date.now(),
                                      emoji: newReasonEmoji || "💖",
                                      title: newReasonTitle.trim(),
                                    },
                                  ]);
                                  setNewReasonTitle("");
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
                      <button
                        type="button"
                        onClick={() => togglePageEnabled("page5_reasons")}
                        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Restore Page
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 4: PAGE 4 (OUR STORY / MILESTONES TIMELINE)            */}
              {/* ----------------------------------------------------------- */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 4 • Our Timeline
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Our Story &amp; Major Milestones
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      From the day you first met to your sweetest moments together.
                    </p>
                  </div>

                  {/* Page Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          enabledPages.page6_story
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Include Timeline Page</p>
                        <p className="text-[10px] text-slate-400">
                          {enabledPages.page6_story ? "Active in surprise" : "Skipped by recipient"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePageEnabled("page6_story")}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        enabledPages.page6_story ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                          enabledPages.page6_story ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {enabledPages.page6_story ? (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                      {/* Milestones List */}
                      <div className="space-y-3">
                        {milestones.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl border border-pink-100 bg-pink-50/20 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={m.icon}
                                  onChange={(e) => {
                                    const updated = [...milestones];
                                    updated[idx].icon = e.target.value;
                                    setMilestones(updated);
                                  }}
                                  className="w-8 h-8 rounded-lg border border-slate-200 text-center text-sm outline-none bg-white"
                                />
                                <input
                                  type="text"
                                  value={m.title}
                                  onChange={(e) => {
                                    const updated = [...milestones];
                                    updated[idx].title = e.target.value;
                                    setMilestones(updated);
                                  }}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-pink-400 bg-white"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={m.date}
                                  onChange={(e) => {
                                    const updated = [...milestones];
                                    updated[idx].date = e.target.value;
                                    setMilestones(updated);
                                  }}
                                  placeholder="e.g. 2023 • June"
                                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-500 outline-none focus:border-pink-400 bg-white w-28"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundFx.playPop();
                                    setMilestones(milestones.filter((_, i) => i !== idx));
                                  }}
                                  className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center shrink-0 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={m.description}
                              onChange={(e) => {
                                const updated = [...milestones];
                                updated[idx].description = e.target.value;
                                setMilestones(updated);
                              }}
                              placeholder="Description..."
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 outline-none focus:border-pink-400 bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Add new milestone */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Add Milestone</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            milestones.length >= MAX_LIMITS.MILESTONES
                              ? "bg-amber-100 text-amber-700 font-bold"
                              : "bg-pink-50 text-pink-600"
                          }`}>
                            {milestones.length} / {MAX_LIMITS.MILESTONES} Max Milestones
                          </span>
                        </div>
                        {milestones.length >= MAX_LIMITS.MILESTONES ? (
                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                            <p className="text-xs font-bold text-amber-800">
                              ⏳ Maximum limit of {MAX_LIMITS.MILESTONES} milestones reached!
                            </p>
                            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                              Please remove any milestone above to add a new chapter to your love journey.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={newMilestoneIcon}
                                onChange={(e) => setNewMilestoneIcon(e.target.value)}
                                placeholder="Icon"
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-center outline-none"
                              />
                              <input
                                type="text"
                                value={newMilestoneTitle}
                                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                                placeholder="Title (e.g. First Trip)"
                                className="col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={newMilestoneDate}
                                onChange={(e) => setNewMilestoneDate(e.target.value)}
                                placeholder="Date (e.g. 2024 • Jan)"
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400"
                              />
                              <input
                                type="text"
                                value={newMilestoneDesc}
                                onChange={(e) => setNewMilestoneDesc(e.target.value)}
                                placeholder="Description..."
                                className="col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (milestones.length >= MAX_LIMITS.MILESTONES) {
                                  alert(`Maximum ${MAX_LIMITS.MILESTONES} milestones allowed!`);
                                  return;
                                }
                                if (newMilestoneTitle.trim()) {
                                  soundFx.playPop();
                                  setMilestones([
                                    ...milestones,
                                    {
                                      icon: newMilestoneIcon || "💖",
                                      title: newMilestoneTitle.trim(),
                                      date: newMilestoneDate.trim() || "2024",
                                      description: newMilestoneDesc.trim() || "A wonderful memory",
                                    },
                                  ]);
                                  setNewMilestoneTitle("");
                                  setNewMilestoneDesc("");
                                  setNewMilestoneDate("");
                                }
                              }}
                              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Milestone</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
                      <button
                        type="button"
                        onClick={() => togglePageEnabled("page6_story")}
                        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Restore Page
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 5: PAGE 5 (LOVE QUIZ)                                  */}
              {/* ----------------------------------------------------------- */}
              {step === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 5 • Trivia
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Couple Love Quiz
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Test how well they remember your inside jokes and first favorites!
                    </p>
                  </div>

                  {/* Page Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          enabledPages.page7_quiz
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Include Love Quiz Page</p>
                        <p className="text-[10px] text-slate-400">
                          {enabledPages.page7_quiz ? "Active in surprise" : "Skipped by recipient"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePageEnabled("page7_quiz")}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        enabledPages.page7_quiz ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                          enabledPages.page7_quiz ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {enabledPages.page7_quiz ? (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                      {/* Questions List */}
                      <div className="space-y-4">
                        {quizQuestions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl border border-pink-100 bg-pink-50/20 space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-extrabold text-pink-600">
                                Question {idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  soundFx.playPop();
                                  setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
                                }}
                                className="w-6 h-6 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => {
                                const updated = [...quizQuestions];
                                updated[idx].question = e.target.value;
                                setQuizQuestions(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-pink-400 bg-white"
                            />

                            {/* 4 Options Grid */}
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Options (Tap circle to mark correct answer):
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, oIdx) => {
                                  const isCorrect = q.correct === opt;
                                  return (
                                    <div
                                      key={oIdx}
                                      className={`p-2 rounded-xl border flex items-center gap-2 ${
                                        isCorrect
                                          ? "bg-emerald-50/80 border-emerald-300 text-emerald-800"
                                          : "bg-white border-slate-200 text-slate-700"
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          soundFx.playPop();
                                          const updated = [...quizQuestions];
                                          updated[idx].correct = opt;
                                          setQuizQuestions(updated);
                                        }}
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                                          isCorrect
                                            ? "border-emerald-600 bg-emerald-600 text-white"
                                            : "border-slate-300"
                                        }`}
                                      >
                                        {isCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                                      </button>
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const updated = [...quizQuestions];
                                          const wasCorrect = updated[idx].correct === updated[idx].options[oIdx];
                                          updated[idx].options[oIdx] = e.target.value;
                                          if (wasCorrect) updated[idx].correct = e.target.value;
                                          setQuizQuestions(updated);
                                        }}
                                        className="w-full text-xs font-semibold bg-transparent outline-none"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Question */}
                      <div className="pt-2 border-t border-slate-100 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Add New Quiz Question</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            quizQuestions.length >= MAX_LIMITS.QUIZ_QUESTIONS
                              ? "bg-amber-100 text-amber-700 font-bold"
                              : "bg-pink-50 text-pink-600"
                          }`}>
                            {quizQuestions.length} / {MAX_LIMITS.QUIZ_QUESTIONS} Max Questions
                          </span>
                        </div>
                        {quizQuestions.length >= MAX_LIMITS.QUIZ_QUESTIONS ? (
                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                            <p className="text-xs font-bold text-amber-800">
                              🎯 Maximum limit of {MAX_LIMITS.QUIZ_QUESTIONS} quiz questions reached!
                            </p>
                            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                              5 questions keep the quiz engaging, fun and quick for your partner!
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-[10px] text-slate-400">
                              Tap the circle to mark correct answer
                            </p>
                            <input
                              type="text"
                              value={newQuizQ}
                              onChange={(e) => {
                                setNewQuizQ(e.target.value);
                                if (quizValidationError) setQuizValidationError("");
                              }}
                              placeholder={`Question #${quizQuestions.length + 1} (e.g. Where did we first travel together?)`}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400 bg-white placeholder:text-slate-400 font-medium"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {[0, 1, 2, 3].map((i) => {
                                const isSelectedCorrect = newQuizCorrectIdx === i;
                                return (
                                  <div
                                    key={i}
                                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                      isSelectedCorrect
                                        ? "bg-emerald-50/80 border-emerald-300 text-emerald-800"
                                        : "bg-white border-slate-200 text-slate-700"
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        soundFx.playPop();
                                        setNewQuizCorrectIdx(i);
                                      }}
                                      title="Click to mark this option as correct answer"
                                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                                        isSelectedCorrect
                                          ? "border-emerald-600 bg-emerald-600 text-white"
                                          : "border-slate-300 hover:border-emerald-400"
                                      }`}
                                    >
                                      {isSelectedCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                    <input
                                      type="text"
                                      value={newQuizOpts[i]}
                                      onChange={(e) => {
                                        const updated = [...newQuizOpts];
                                        updated[i] = e.target.value;
                                        setNewQuizOpts(updated);
                                        if (quizValidationError) setQuizValidationError("");
                                      }}
                                      placeholder={`Option ${i + 1}${i === 0 ? " (Correct by default)" : ""}`}
                                      className="w-full text-xs font-semibold bg-transparent outline-none placeholder:text-slate-400"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            {quizValidationError && (
                              <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 rounded-lg py-1 px-2.5 text-center">
                                ⚠️ {quizValidationError}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={handleAddQuizQuestion}
                              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Quiz Question</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
                      <button
                        type="button"
                        onClick={() => togglePageEnabled("page7_quiz")}
                        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Restore Page
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 6: PAGE 6 (FORTUNE COOKIES & PROPHECIES)               */}
              {/* ----------------------------------------------------------- */}
              {step === 6 && (
                <motion.div
                  key="step-6"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 6 • Destiny
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Fortune Cookies &amp; Love Prophecies
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Crack each golden cookie open to reveal romantic quotes about your future together.
                    </p>
                  </div>

                  {/* Page Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          enabledPages.page8_fortunes
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Include Fortune Cookies Page</p>
                        <p className="text-[10px] text-slate-400">
                          {enabledPages.page8_fortunes ? "Active in surprise" : "Skipped by recipient"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePageEnabled("page8_fortunes")}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        enabledPages.page8_fortunes ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                          enabledPages.page8_fortunes ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {enabledPages.page8_fortunes ? (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                      {/* Quotes List */}
                      <div className="space-y-2">
                        {fortuneQuotes.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl border border-pink-100 bg-pink-50/20 flex items-center gap-2.5"
                          >
                            <span className="text-lg shrink-0">🥠</span>
                            <input
                              type="text"
                              value={q}
                              onChange={(e) => {
                                const updated = [...fortuneQuotes];
                                updated[idx] = e.target.value;
                                setFortuneQuotes(updated);
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-pink-400 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setFortuneQuotes(fortuneQuotes.filter((_, i) => i !== idx));
                              }}
                              className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new quote */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Add Love Prophecy</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            fortuneQuotes.length >= MAX_LIMITS.FORTUNES
                              ? "bg-amber-100 text-amber-700 font-bold"
                              : "bg-pink-50 text-pink-600"
                          }`}>
                            {fortuneQuotes.length} / {MAX_LIMITS.FORTUNES} Max Fortunes
                          </span>
                        </div>
                        {fortuneQuotes.length >= MAX_LIMITS.FORTUNES ? (
                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                            <p className="text-xs font-bold text-amber-800">
                              🥠 Maximum limit of {MAX_LIMITS.FORTUNES} fortune cookies reached!
                            </p>
                            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                              Matches the 5 interactive crackable fortune cookies perfectly.
                            </p>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFortuneInput}
                              onChange={(e) => setNewFortuneInput(e.target.value)}
                              placeholder="Add new love prophecy..."
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-400"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (fortuneQuotes.length >= MAX_LIMITS.FORTUNES) {
                                  alert(`Maximum ${MAX_LIMITS.FORTUNES} fortune quotes allowed!`);
                                  return;
                                }
                                if (newFortuneInput.trim()) {
                                  soundFx.playPop();
                                  setFortuneQuotes([...fortuneQuotes, newFortuneInput.trim()]);
                                  setNewFortuneInput("");
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
                      <button
                        type="button"
                        onClick={() => togglePageEnabled("page8_fortunes")}
                        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Restore Page
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 7: PAGE 7 (THE QUESTION & RUNAWAY NO)                  */}
              {/* ----------------------------------------------------------- */}
              {step === 7 && (
                <motion.div
                  key="step-7"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 7 • The Question
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      The Big Question &amp; Runaway Button
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      The famous runaway &quot;No&quot; button that dodges their fingers until they say YES!
                    </p>
                  </div>

                  {/* Page Enable/Disable Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          enabledPages.page2_question
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Include Question Page</p>
                        <p className="text-[10px] text-slate-400">
                          {enabledPages.page2_question ? "Active in surprise" : "Skipped by recipient"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePageEnabled("page2_question")}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        enabledPages.page2_question ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                          enabledPages.page2_question ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {enabledPages.page2_question ? (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                      {/* Question Text */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Your Question
                        </label>
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                        />
                        {/* Question Presets */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {[
                            "do you love me ??",
                            "Will you be mine forever?",
                            "Am I your favorite person in the world?",
                            "Will you go out with me?",
                          ].map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setQuestion(q);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                                question === q
                                  ? "bg-[#FF2E63] text-white border-[#FF2E63]"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-pink-300"
                              }`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Yes Button Text */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          &quot;YES&quot; Button Label
                        </label>
                        <input
                          type="text"
                          value={yesButtonText}
                          onChange={(e) => setYesButtonText(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                        />
                      </div>

                      {/* Dodge Phrases */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="block text-xs font-bold text-slate-700">
                            Dodging &quot;NO&quot; Button Phrases (In Exact Sequence)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playPop();
                              setDodgePhrases([...DEFAULT_DODGE_PHRASES]);
                            }}
                            className="text-[11px] font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset to Default 9 Messages</span>
                          </button>
                        </div>

                        {/* Phrases Sequence Chips */}
                        <div className="flex flex-wrap gap-1.5 pb-1">
                          {dodgePhrases.map((phrase, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all ${
                                idx === 7
                                  ? "bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400/40"
                                  : idx === 8
                                  ? "bg-rose-50 text-rose-900 border-rose-300 ring-1 ring-rose-400/40"
                                  : "bg-pink-50/80 text-pink-700 border-pink-200"
                              }`}
                            >
                              <span className="text-[10px] font-black opacity-60">#{idx + 1}</span>
                              <span>{phrase}</span>
                              {idx === 7 && (
                                <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-full">
                                  🏃 Dodge Starts
                                </span>
                              )}
                              {idx === 8 && (
                                <span className="text-[9px] bg-rose-200 text-rose-900 font-extrabold px-1.5 py-0.5 rounded-full">
                                  🔒 Last Lock
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  soundFx.playPop();
                                  setDodgePhrases(dodgePhrases.filter((_, i) => i !== idx));
                                }}
                                className="text-pink-400 hover:text-pink-700 ml-0.5 cursor-pointer text-sm font-bold leading-none"
                                title="Remove phrase"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Interactive Timing Guidance Banner */}
                        <div className="p-2.5 rounded-xl bg-pink-50/60 border border-pink-100 text-[11px] text-slate-600 space-y-1">
                          <p className="font-bold text-pink-700 flex items-center gap-1">
                            <span>💡</span> <span>How this sequence works for recipient:</span>
                          </p>
                          <p className="text-[10.5px]">
                            • <strong>#1 to #7:</strong> NO button stays in position while showing these reactions.
                          </p>
                          <p className="text-[10.5px]">
                            • <strong>#8 (&quot;I&apos;m ready! 👀&quot;):</strong> NO button begins running away on hover/click and YES button starts scaling up!
                          </p>
                          <p className="text-[10.5px]">
                            • <strong>#9 (&quot;Do you think you can win against me? 😈&quot;):</strong> Displays permanently while button dodges until YES is clicked.
                          </p>
                        </div>

                        {/* Quick Presets if any removed */}
                        {DEFAULT_DODGE_PHRASES.some((p) => !dodgePhrases.includes(p)) && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Add:</span>
                            {DEFAULT_DODGE_PHRASES.filter((p) => !dodgePhrases.includes(p)).map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                  soundFx.playPop();
                                  setDodgePhrases([...dodgePhrases, preset]);
                                }}
                                className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-pink-100 text-[10px] font-bold text-slate-600 hover:text-pink-700 transition-colors cursor-pointer"
                              >
                                + {preset}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Add custom phrase */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={newDodgeInput}
                            onChange={(e) => setNewDodgeInput(e.target.value)}
                            placeholder="Add custom reaction message..."
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:border-pink-400 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newDodgeInput.trim()) {
                                soundFx.playPop();
                                setDodgePhrases([...dodgePhrases, newDodgeInput.trim()]);
                                setNewDodgeInput("");
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-xs"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
                      <p className="text-xs text-amber-600 font-medium">
                        The recipient will proceed straight to the next chapter.
                      </p>
                      <button
                        type="button"
                        onClick={() => togglePageEnabled("page2_question")}
                        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Restore Page
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 8: PAGE 8 (HEARTFELT LOVE LETTER)                      */}
              {/* ----------------------------------------------------------- */}
              {step === 8 && (
                <motion.div
                  key="step-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                      Chapter 8 • Your Letter
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Write From Your Heart
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Rendered in authentic cursive typewriter handwriting with a wax seal opening animation.
                    </p>
                  </div>

                  {/* Page Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          enabledPages.page3_letter
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Include Love Letter Page</p>
                        <p className="text-[10px] text-slate-400">
                          {enabledPages.page3_letter ? "Active in surprise" : "Skipped by recipient"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePageEnabled("page3_letter")}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        enabledPages.page3_letter ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                          enabledPages.page3_letter ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {enabledPages.page3_letter ? (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                      {/* Wax Seal Emoji */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Wax Seal Emblem
                        </label>
                        <div className="flex gap-2">
                          {["💌", "💖", "🌹", "✨", "💍", "🕊️"].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setWaxSealEmoji(em);
                              }}
                              className={`w-10 h-10 rounded-xl border text-lg flex items-center justify-center cursor-pointer transition-all ${
                                waxSealEmoji === em
                                  ? "border-[#FF2E63] bg-pink-50 ring-2 ring-[#FF2E63]/20"
                                  : "border-slate-200 hover:border-pink-300"
                              }`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Letter Textarea */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Letter Message
                          </label>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {letterText.split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                        <textarea
                          rows={8}
                          value={letterText}
                          onChange={(e) => setLetterText(e.target.value)}
                          className="w-full p-4 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-medium text-slate-800 bg-pink-50/20 leading-relaxed font-sans no-scrollbar"
                        />
                      </div>

                      {/* Inspiration Starters */}
                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Quick Romantic Starters (Tap to insert):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Every moment with you feels like magic.",
                            "You make my heart skip a beat every time you look at me.",
                            "I fall more in love with you every single day.",
                            "Life is so much sweeter with you in it.",
                          ].map((str, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setLetterText((prev) => prev + "\n\n" + str);
                              }}
                              className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-pink-50 text-[11px] text-slate-600 hover:text-pink-600 border border-slate-200 transition-colors cursor-pointer"
                            >
                              + &quot;{str.slice(0, 30)}...&quot;
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
                      <button
                        type="button"
                        onClick={() => togglePageEnabled("page3_letter")}
                        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Restore Page
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 9: FINAL REVIEW, GEO-PRICING & LAUNCH                  */}
              {/* ----------------------------------------------------------- */}
              {step === 9 && (
                <motion.div
                  key="step-9"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {!isCreated && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                        Step 9 • Publish
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Ready to Publish &amp; Send? 💖
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Select your access duration and get an instant private link &amp; printable QR card.
                      </p>
                    </div>
                  )}

                  {!isCreated ? (
                    <div className="space-y-6">
                      {/* Audio & Security Settings */}
                      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-4">
                        {/* Custom Surprise Web Link */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 to-rose-50/60 border border-pink-200/90 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-[#FF2E63]" />
                              <span>Your Personalized Surprise Link</span>
                            </label>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-white px-2 py-0.5 rounded-full border border-pink-200 shadow-2xs">
                              Custom Link
                            </span>
                          </div>

                          <div className="flex items-center bg-white rounded-xl border border-pink-200 focus-within:border-[#FF2E63] focus-within:ring-2 focus-within:ring-pink-100 overflow-hidden shadow-2xs transition-all">
                            <span className="px-3 py-2.5 bg-slate-50 border-r border-pink-100 text-xs font-semibold text-slate-500 select-none shrink-0">
                              lovedrop.online/p/
                            </span>
                            <input
                              type="text"
                              value={
                                isCustomSlugEdited
                                  ? customSlug
                                  : generateSecureSlug(recipientName || "My Love", senderName || "Me")
                              }
                              onChange={(e) => {
                                setIsCustomSlugEdited(true);
                                setCustomSlug(
                                  e.target.value
                                    .toLowerCase()
                                    .replace(/[^a-z0-9-]/g, "-")
                                    .replace(/-+/g, "-")
                                );
                              }}
                              placeholder="pardeep-kumar"
                              className="w-full px-3 py-2.5 text-xs font-bold text-[#FF2E63] outline-none bg-transparent"
                            />
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Your recipient will open this exact private web link. You can customize the name above!
                          </p>
                        </div>

                        {/* Audio track selector */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Music className="w-3.5 h-3.5 text-[#FF2E63]" />
                              <span>Background Music</span>
                            </span>
                            <button
                              type="button"
                              onClick={toggleAudio}
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
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "romantic-lofi", name: "Soft Piano 🎹" },
                              { id: "summer-guitar", name: "Sunset Guitar 🎸" },
                            ].map((track) => (
                              <button
                                key={track.id}
                                type="button"
                                onClick={() => {
                                  soundFx.playPop();
                                  setBgMusic(track.id as AudioTrackId);
                                }}
                                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                  bgMusic === track.id
                                    ? "border-[#FF2E63] bg-pink-50 text-[#FF2E63]"
                                    : "border-slate-200 text-slate-600 bg-white hover:border-pink-200"
                                }`}
                              >
                                {track.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* WhatsApp Alert Phone & Predefined Response Message */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Your WhatsApp Number (For instant alert & reply button on Page 9)
                            </label>
                            <input
                              type="text"
                              value={whatsappNumber}
                              onChange={(e) => setWhatsappNumber(e.target.value)}
                              placeholder="0000000000"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-pink-400 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Predefined WhatsApp Message (Auto-fills when recipient taps WhatsApp button on Page 9)
                            </label>
                            <input
                              type="text"
                              value={whatsappMessage}
                              onChange={(e) => setWhatsappMessage(e.target.value)}
                              placeholder="e.g. Hey! I just opened your special love website and I loved it so much! ❤️"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-pink-400 bg-white"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                              When your recipient reaches Page 9 and clicks &quot;Reply on WhatsApp&quot;, this exact message will pre-fill in their WhatsApp text box automatically!
                            </p>
                          </div>
                        </div>

                        {/* Optional PIN Protection */}
                        <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100/90 space-y-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="text-xs font-bold text-slate-800">
                                  Secret Passcode Protection
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                  Optional • Default OFF
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">
                                By default, your partner can open the link directly with 1 tap (no PIN). Turn this ON only if you want secret date/PIN protection.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setEnablePin(!enablePin);
                              }}
                              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                                enablePin ? "bg-[#FF2E63]" : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform shadow-xs ${
                                  enablePin ? "translate-x-5" : ""
                                }`}
                              />
                            </button>
                          </div>
                          {enablePin && (
                            <div className="pt-2 border-t border-pink-100/80 space-y-1.5 animate-fadeIn">
                              <label className="block text-[11px] font-bold text-slate-700">
                                Set 4-Digit Secret PIN:
                              </label>
                              <input
                                type="password"
                                maxLength={4}
                                value={secretPin}
                                onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, ""))}
                                placeholder="e.g. 1402 (Anniversary Date)"
                                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-mono font-bold tracking-widest text-slate-800 outline-none focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 bg-white"
                              />
                              <p className="text-[10px] text-slate-400">
                                Recipient will need to enter this 4-digit PIN to open the surprise envelope.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Resend Email Delivery Settings */}
                        <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-pink-100/90 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Mail className="w-3.5 h-3.5 text-[#FF2E63] shrink-0" />
                              <span className="text-xs font-bold text-slate-800">
                                Email Delivery &amp; Backup (Resend)
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-[#FF2E63]">
                                Recommended
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            Receive your private Lovedrop link, secret PIN, and website backup directly in your inbox.
                          </p>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Your Email Address:
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={creatorEmail}
                                onChange={(e) => setCreatorEmail(e.target.value)}
                                placeholder="youremail@example.com"
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-pink-400 bg-white"
                              />
                              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                            </div>
                          </div>

                          {/* Toggle to also email partner */}
                          <div className="pt-2 border-t border-pink-100/70">
                            <div className="flex items-center justify-between gap-3">
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold text-slate-800">
                                  Also email surprise directly to {recipientName || "partner"} 💌
                                </span>
                                <p className="text-[10px] text-slate-500">
                                  Send a romantic envelope invitation email to their inbox.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  soundFx.playPop();
                                  setSendToPartnerEmail(!sendToPartnerEmail);
                                }}
                                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                                  sendToPartnerEmail ? "bg-[#FF2E63]" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform shadow-xs ${
                                    sendToPartnerEmail ? "translate-x-5" : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {sendToPartnerEmail && (
                              <div className="mt-3 space-y-2.5">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Partner&apos;s Email Address:
                                  </label>
                                  <input
                                    type="email"
                                    value={partnerEmail}
                                    onChange={(e) => setPartnerEmail(e.target.value)}
                                    placeholder="partner@example.com"
                                    className="w-full px-4 py-2 rounded-xl border border-pink-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#FF2E63] bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Custom Note in Email (Optional):
                                  </label>
                                  <input
                                    type="text"
                                    value={customEmailNote}
                                    onChange={(e) => setCustomEmailNote(e.target.value)}
                                    placeholder="e.g. Open this when you are alone with headphones on ❤️"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-300 bg-white"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Access Duration & Geo-Pricing */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                            Select Access Duration:
                          </span>
                          {/* Geo-Currency Switcher Pill */}
                          <div className="inline-flex items-center p-0.5 rounded-full bg-pink-100/70 border border-pink-200 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setRegion("IN");
                              }}
                              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                                region === "IN"
                                  ? "bg-white text-pink-600 shadow-2xs font-extrabold"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              🇮🇳 INR (₹)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                setRegion("GLOBAL");
                              }}
                              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                                region === "GLOBAL"
                                  ? "bg-white text-pink-600 shadow-2xs font-extrabold"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              🌐 USD ($)
                            </button>
                          </div>
                        </div>

                        {/* 3 Tier Selector Buttons */}
                        <div className="grid grid-cols-3 gap-2.5">
                          {plans.map((p) => {
                            const isSelected = selectedPlanId === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  soundFx.playPop();
                                  setSelectedPlanId(p.id);
                                }}
                                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative flex flex-col justify-between ${
                                  isSelected
                                    ? "bg-white border-[#FF2E63] shadow-md ring-2 ring-[#FF2E63]/30 scale-[1.02]"
                                    : "bg-white/70 border-pink-100 hover:border-pink-300 hover:bg-white"
                                }`}
                              >
                                {p.badge && (
                                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FF2E63] text-white text-[9px] font-black tracking-wider uppercase shadow-xs whitespace-nowrap">
                                    {p.badge}
                                  </span>
                                )}
                                <div className="pt-1">
                                  <p className="text-xs font-bold text-slate-800">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{p.duration}</p>
                                </div>
                                <div className="mt-2">
                                  <span className="text-lg font-black text-slate-900">
                                    {p.priceFormatted}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Tier Banner */}
                        <div className="rounded-3xl overflow-hidden shadow-xl border border-pink-100 bg-white">
                          <div className="bg-gradient-to-r from-[#FF007A] via-[#FF2E63] to-[#FF4D79] text-white p-6 sm:p-7 text-center space-y-1">
                            <p className="text-xs font-semibold text-white/95">
                              Imagine {recipientName ? `${recipientName}'s` : "their"} face when they open this
                            </p>
                            <h3 className="text-4xl font-black text-white">
                              {currentPlan.priceFormatted}
                            </h3>
                            <p className="text-xs text-white/80 font-medium">
                              {currentPlan.periodText} • One-time payment
                            </p>
                          </div>

                          <div className="p-5 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                              {currentPlan.features.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>

                            {/* Publish CTA Button */}
                            <button
                              type="button"
                              disabled={isProcessingPay}
                              onClick={handlePublish}
                              className="w-full py-4 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-base shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                            >
                              {isProcessingPay ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Publishing your Lovedrop surprise...</span>
                                </>
                              ) : (
                                <>
                                  <Heart className="w-5 h-5 fill-white text-white shrink-0" />
                                  <span>Send My Love Letter — {currentPlan.priceFormatted}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Published Celebration Screen */
                    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-200 shadow-xl text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Your Lovedrop is Ready to Send! 💖
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Send the link directly to {recipientName || "them"} or surprise them with a printable QR
                        gift card.
                      </p>

                      {/* Ultra-Clear Romantic Link Card */}
                      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-pink-50/90 via-white to-rose-50/70 border-2 border-pink-200/90 text-left space-y-3.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF2E63] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Your Private Love Website Link</span>
                          </span>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active &amp; Ready</span>
                          </span>
                        </div>

                        {/* High-Clarity URL Display */}
                        <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-pink-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF2E63] flex items-center justify-center shrink-0 border border-pink-100">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div className="text-xs sm:text-sm font-semibold truncate leading-tight select-all">
                              <span className="text-slate-400 font-medium">lovedrop.online/p/</span>
                              <span className="text-[#FF2E63] font-black">{createdSlug}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(siteUrl);
                              setCopiedLink(true);
                              soundFx.playPop();
                              setTimeout(() => setCopiedLink(false), 2500);
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
                              copiedLink
                                ? "bg-emerald-500 text-white"
                                : "bg-[#FF2E63] hover:bg-[#E02656] text-white"
                            }`}
                          >
                            {copiedLink ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Copied! ✓</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-500 text-center font-medium">
                          Share this private link with <strong className="text-slate-700 font-bold">{recipientName || "them"}</strong> via WhatsApp or Instagram!
                        </p>
                      </div>

                      {/* Sharing buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `Hey ${recipientName}! ❤️ I made a special website just for you: ${siteUrl}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>Share on WhatsApp</span>
                        </a>

                        <Link
                          href={`/p/${createdSlug}`}
                          target="_blank"
                          className="py-3 px-4 rounded-2xl bg-white hover:bg-pink-50 text-slate-800 border border-pink-200 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-transform active:scale-95"
                        >
                          <ExternalLink className="w-4 h-4 text-[#FF2E63]" />
                          <span>Open &amp; Test Website</span>
                        </Link>
                      </div>

                      {/* Email Delivery Card (Powered by Resend) */}
                      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-rose-50/80 border border-pink-200/90 text-left space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-[#FF2E63]" />
                            <span>Send or Resend via Email (Resend)</span>
                          </span>
                          {emailSendStatus === "sent" && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Email Sent ✓
                            </span>
                          )}
                          {emailSendStatus === "sending" && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 animate-pulse">
                              Sending...
                            </span>
                          )}
                        </div>

                        {emailStatusMessage && (
                          <div className={`p-2.5 rounded-xl text-xs font-semibold ${
                            emailSendStatus === "error"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {emailStatusMessage}
                          </div>
                        )}

                        <p className="text-[11px] text-slate-500">
                          Need to send this link to another email address or backup inbox? Enter any email address below:
                        </p>

                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={resendDirectEmail}
                            onChange={(e) => setResendDirectEmail(e.target.value)}
                            placeholder="recipient@example.com"
                            className="flex-1 px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#FF2E63] bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleSendDirectEmail}
                            disabled={isSendingDirectEmail || !resendDirectEmail.trim()}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            {isSendingDirectEmail ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Send</span>
                          </button>
                        </div>

                        {directEmailStatus && (
                          <p className="text-[11px] font-semibold text-slate-700">
                            {directEmailStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =============================================================== */}
          {/* RIGHT / SIDEBAR: REALISTIC LIVE PHONE PREVIEW                    */}
          {/* =============================================================== */}
          {!isCreated && (
            <div className="lg:col-span-5 xl:col-span-5 flex justify-center sticky top-20">
              <PagePreviewCard
                step={step}
                recipientName={recipientName}
                senderName={senderName}
                typingWord1={typingWord1}
                typingWord2={typingWord2}
                buttonText={buttonText}
                question={question}
                yesButtonText={yesButtonText}
                dodgePhrases={dodgePhrases}
                letterText={letterText}
                waxSealEmoji={waxSealEmoji}
                photos={photos}
                reasons={reasons}
                milestones={milestones}
                quizQuestions={quizQuestions}
                fortuneQuotes={fortuneQuotes}
                themeColor={selectedThemeObj.accent}
                themeBg={selectedThemeObj.cardBg}
                enablePin={enablePin}
                secretPin={secretPin}
                bgMusic={bgMusic}
                onStepChange={(s) => goToStep(s as any)}
              />
            </div>
          )}
        </div>
      </main>

      {/* =================================================================== */}
      {/* MOBILE FLOATING PREVIEW BUTTON (< lg)                               */}
      {/* =================================================================== */}
      {!isCreated && (
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            setShowMobilePreviewModal(true);
          }}
          className="lg:hidden fixed bottom-20 right-4 z-40 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-black text-white font-black text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md border border-slate-700/80 active:scale-95 cursor-pointer ring-2 ring-pink-500/30"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Smartphone className="w-4 h-4 text-pink-400" />
          <span>Live Preview</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#FF2E63] text-[10px] text-white font-black">
            {step}/9
          </span>
        </button>
      )}

      {/* =================================================================== */}
      {/* MOBILE PREVIEW MODAL (< lg)                                         */}
      {/* =================================================================== */}
      <AnimatePresence>
        {!isCreated && showMobilePreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto flex flex-col items-center justify-start pt-6"
          >
            {/* Modal Header */}
            <div className="w-full max-w-[380px] flex items-center justify-between pb-3 text-white">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-black">Live Mobile Preview</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setShowMobilePreviewModal(false);
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer border border-white/20"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>

            {/* Centered Phone Preview */}
            <div className="w-full flex justify-center pb-8">
              <PagePreviewCard
                step={step}
                recipientName={recipientName}
                senderName={senderName}
                typingWord1={typingWord1}
                typingWord2={typingWord2}
                buttonText={buttonText}
                question={question}
                yesButtonText={yesButtonText}
                dodgePhrases={dodgePhrases}
                letterText={letterText}
                waxSealEmoji={waxSealEmoji}
                photos={photos}
                reasons={reasons}
                milestones={milestones}
                quizQuestions={quizQuestions}
                fortuneQuotes={fortuneQuotes}
                themeColor={selectedThemeObj.accent}
                themeBg={selectedThemeObj.cardBg}
                enablePin={enablePin}
                secretPin={secretPin}
                bgMusic={bgMusic}
                onStepChange={(s) => goToStep(s as any)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* STICKY BOTTOM NAVIGATION BAR (Mobile First)                        */}
      {/* =================================================================== */}
      {!isCreated && (
        <footer className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 p-3 sm:p-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => goToStep((step - 1) as any)}
                className="px-5 py-3 rounded-full border border-pink-200 text-slate-700 bg-white hover:bg-pink-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-pink-500" />
                <span>Previous</span>
              </button>
            ) : (
              <Link
                href="/"
                className="px-5 py-3 rounded-full border border-pink-200 text-slate-700 bg-white hover:bg-pink-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-pink-500" />
                <span>Back to Home</span>
              </Link>
            )}

            <div className="text-center hidden sm:block">
              <span className="text-[11px] font-semibold text-slate-400">
                Step {step} of 9 • All changes auto-saved
              </span>
            </div>

            {step < 9 ? (
              <button
                type="button"
                onClick={() => goToStep((step + 1) as any)}
                className="px-7 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Continue to Page {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessingPay}
                onClick={handlePublish}
                className="px-8 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Launch My Website</span>
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
