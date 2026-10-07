"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FastForward,
  Check,
  Maximize2,
  Minimize2,
  Trophy,
  Sparkles,
  Star,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";
import { LoveSurpriseData } from "@/lib/types";

interface LoveSurpriseTemplateProps {
  data?: Partial<LoveSurpriseData>;
  isEmbedded?: boolean;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const DEFAULT_MEMORIES = [
  {
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=80",
    caption: "Our first date at the coffee shop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1000&auto=format&fit=crop&q=80",
    caption: "That spontaneous weekend road trip",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1000&auto=format&fit=crop&q=80",
    caption: "The night we couldn't stop talking under the stars",
  },
];

const NINE_REASONS = [
  { id: 1, emoji: "😊", title: "Your smile" },
  { id: 2, emoji: "💕", title: "Your kindness" },
  { id: 3, emoji: "😂", title: "Your laugh" },
  { id: 4, emoji: "🙏", title: "Your patience" },
  { id: 5, emoji: "🤗", title: "Your hugs" },
  { id: 6, emoji: "👫", title: "Being my best friend" },
  { id: 7, emoji: "🌟", title: "Your support" },
  { id: 8, emoji: "✨", title: "Being you" },
  { id: 9, emoji: "🎨", title: "Your creativity" },
];

// Page 6: Our Story Milestones (media_1791139908028.png)
const DEFAULT_STORY_MILESTONES = [
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
];

// Page 7: Love Quiz Questions (media_1791140007486.png & media_1791140043616.png)
const DEFAULT_QUIZ_QUESTIONS = [
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
];

// Page 8: Fortune Cookie Quotes (media_1791140088198.png)
const DEFAULT_FORTUNE_QUOTES = [
  "A lifetime of happiness awaits you two",
  "Your love story is just beginning",
  "Every moment together is a treasure",
  "Your soulmate is closer than you think... actually, they made this for you!",
  "Love is the answer to every question",
];

export default function LoveSurpriseTemplate({
  data,
  isEmbedded = false,
  onClose,
  onToggleFullscreen,
  isFullscreen = false,
}: LoveSurpriseTemplateProps) {
  const recipientName = data?.recipientName || "Sarah";
  const senderName = data?.senderName || "Your Love";
  const customQuestion = data?.question || "Do you love me?";

  const letterFullText =
    data?.letterContent ||
    data?.letterText ||
    `My dearest ${recipientName},\n\nFrom the moment I met you, my life changed in ways I never expected. Your smile has become my favorite sight, your laugh my favorite sound.\n\nEvery day with you feels like an adventure, and I can't imagine my life without you by my side. You make the ordinary extraordinary.\n\nI love you more than words could ever express, but I'm going to try anyway through this letter.\n\nForever yours,\n${senderName} 💕`;

  // Step state (1 to 9 complete experience)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(1);

  // Dynamic Data & Enabled Pages from Creator
  const enabledPages = data?.enabledPages || {
    page2_question: true,
    page3_letter: true,
    page4_photos: true,
    page5_reasons: true,
    page6_story: true,
    page7_quiz: true,
    page8_fortunes: true,
  };

  const getNextStep = (current: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 => {
    const pageKeys: Record<number, string> = {
      2: "page2_question",
      3: "page3_letter",
      4: "page4_photos",
      5: "page5_reasons",
      6: "page6_story",
      7: "page7_quiz",
      8: "page8_fortunes",
    };

    for (let s = current + 1; s <= 9; s++) {
      if (s === 9) return 9;
      const key = pageKeys[s];
      if (!key || enabledPages[key] !== false) {
        return s as any;
      }
    }
    return 9;
  };

  const dynamicReasons = data?.nineReasons && data.nineReasons.length > 0 ? data.nineReasons : NINE_REASONS;
  const dynamicMilestones = data?.storyMilestones && data.storyMilestones.length > 0 ? data.storyMilestones : DEFAULT_STORY_MILESTONES;
  const dynamicQuiz = data?.quizList && data.quizList.length > 0 ? data.quizList : DEFAULT_QUIZ_QUESTIONS;
  const dynamicFortunes = data?.fortuneQuotes && data.fortuneQuotes.length > 0 ? data.fortuneQuotes : DEFAULT_FORTUNE_QUOTES;
  const customButtonLabel = data?.buttonText || "Let's Go";
  const customYesLabel = data?.yesButtonText || "YES! ❤️";

  // Page 6: Our Story Milestone State
  const [storyMilestoneIdx, setStoryMilestoneIdx] = useState(0);

  // Page 7: Love Quiz State
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizIsLocked, setQuizIsLocked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizShowComplete, setQuizShowComplete] = useState(false);

  // Page 8: Fortune Cookies State
  const [openedCookies, setOpenedCookies] = useState<number[]>([]);
  const [activeCookieQuote, setActiveCookieQuote] = useState<string | null>(null);

  // -------------------------------------------------------------
  // PAGE 1: INTRO TYPING STATE
  // "Hello" -> erase -> "Yes, You" -> erase -> "Name" -> erase -> show card
  // -------------------------------------------------------------
  const [introPhase, setIntroPhase] = useState<
    | "typing-hello"
    | "erasing-hello"
    | "typing-yes-you"
    | "erasing-yes-you"
    | "typing-name"
    | "erasing-name"
    | "card-revealed"
  >("typing-hello");
  const [typedIntroText, setTypedIntroText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const helloWord = "Hello";
    const yesYouWord = "Yes, You";
    const nameWord = recipientName;

    if (introPhase === "typing-hello") {
      if (typedIntroText.length < helloWord.length) {
        timeout = setTimeout(() => {
          setTypedIntroText(helloWord.slice(0, typedIntroText.length + 1));
        }, 110);
      } else {
        timeout = setTimeout(() => setIntroPhase("erasing-hello"), 700);
      }
    } else if (introPhase === "erasing-hello") {
      if (typedIntroText.length > 0) {
        timeout = setTimeout(() => {
          setTypedIntroText(typedIntroText.slice(0, -1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIntroPhase("typing-yes-you"), 300);
      }
    } else if (introPhase === "typing-yes-you") {
      if (typedIntroText.length < yesYouWord.length) {
        timeout = setTimeout(() => {
          setTypedIntroText(yesYouWord.slice(0, typedIntroText.length + 1));
        }, 110);
      } else {
        timeout = setTimeout(() => setIntroPhase("erasing-yes-you"), 700);
      }
    } else if (introPhase === "erasing-yes-you") {
      if (typedIntroText.length > 0) {
        timeout = setTimeout(() => {
          setTypedIntroText(typedIntroText.slice(0, -1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIntroPhase("typing-name"), 300);
      }
    } else if (introPhase === "typing-name") {
      if (typedIntroText.length < nameWord.length) {
        timeout = setTimeout(() => {
          setTypedIntroText(nameWord.slice(0, typedIntroText.length + 1));
        }, 110);
      } else {
        timeout = setTimeout(() => setIntroPhase("erasing-name"), 800);
      }
    } else if (introPhase === "erasing-name") {
      if (typedIntroText.length > 0) {
        timeout = setTimeout(() => {
          setTypedIntroText(typedIntroText.slice(0, -1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIntroPhase("card-revealed"), 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [introPhase, typedIntroText, recipientName]);

  const skipIntro = () => {
    soundFx.playPop();
    setIntroPhase("card-revealed");
  };

  // -------------------------------------------------------------
  // PAGE 2: RUNAWAY "NO" BUTTON & PROGRESSIVE YES GROWTH
  // -------------------------------------------------------------
  const [noAttempts, setNoAttempts] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);

  const noPhrases = [
    "No 💔",
    "Really?! 😳",
    "Are you sure ? 🥺",
    `But ${recipientName}... 🥺`,
    "Think Again! 😜",
    "Don't do this to me! 😭",
    `${recipientName} please! 🥺`,
    "Come onnnn 😩",
    "Pretty please? 🥺",
    `I made this for you ${recipientName}! 🎁`,
    "With a cherry on top? 🍒",
    "You're breaking my heart! 💔",
    "I'll be sad forever! 😢",
    "Noooooo 😭",
    "Fine, I'll just cry 😭",
    `${recipientName} I'm begging! 🧎`,
    "My heart can't take this! 💔",
    "You wouldn't... right? 🥺🥺",
    "I'm literally shaking rn 🫨",
    `SAY YES ${recipientName.toUpperCase()}! 😤`,
    "Broken 💔💔💔",
    "I'll never recover 🥀",
    "This is fine.... 🥲🙃",
    "😭😭😭😭😭",
  ];

  const handleNoDodge = () => {
    soundFx.playPop();
    const nextAttempts = noAttempts + 1;
    setNoAttempts(nextAttempts);

    // Random displacement within card boundaries
    const maxOffset = 110;
    const rx = (Math.random() - 0.5) * (maxOffset * 2);
    const ry = (Math.random() - 0.5) * (maxOffset * 1.4);
    setNoButtonPos({ x: rx, y: ry });
  };

  const handleYesClick = () => {
    soundFx.playSuccessChime();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#FF2E63", "#FF6B8B", "#FFD166", "#FF007A"],
    });
    setStep3SubStep("transition");
    setStep(getNextStep(2));
  };

  // -------------------------------------------------------------
  // PAGE 3: CELEBRATION (3.1) & LOVE LETTER TYPEWRITER (3.2)
  // -------------------------------------------------------------
  const [step3SubStep, setStep3SubStep] = useState<"transition" | "letter">("transition");
  const [letterTypedLength, setLetterTypedLength] = useState(0);
  const [isTypingLetter, setIsTypingLetter] = useState(true);

  // Auto advance from 3.1 celebration to 3.2 love letter
  useEffect(() => {
    if (step === 3 && step3SubStep === "transition") {
      const timer = setTimeout(() => {
        setStep3SubStep("letter");
        setLetterTypedLength(0);
        setIsTypingLetter(true);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [step, step3SubStep]);

  // Letter typing interval
  useEffect(() => {
    if (step === 3 && step3SubStep === "letter" && isTypingLetter) {
      if (letterTypedLength < letterFullText.length) {
        const timer = setTimeout(() => {
          setLetterTypedLength((prev) => prev + 1);
        }, 22);
        return () => clearTimeout(timer);
      } else {
        setIsTypingLetter(false);
      }
    }
  }, [step, step3SubStep, isTypingLetter, letterTypedLength, letterFullText]);

  const handleSkipLetterTyping = () => {
    soundFx.playPop();
    setLetterTypedLength(letterFullText.length);
    setIsTypingLetter(false);
  };

  // -------------------------------------------------------------
  // PAGE 4: PHOTO MEMORIES CAROUSEL
  // -------------------------------------------------------------
  const memoryPhotos =
    data?.photoMemories && data.photoMemories.length > 0
      ? data.photoMemories
      : (data?.photos && data.photos.length > 0
          ? data.photos.map((p, idx) => ({
              image: p,
              caption: DEFAULT_MEMORIES[idx % DEFAULT_MEMORIES.length].caption,
            }))
          : DEFAULT_MEMORIES);

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  const prevPhoto = () => {
    soundFx.playPop();
    setCurrentPhotoIdx((prev) => (prev === 0 ? memoryPhotos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    soundFx.playPop();
    setCurrentPhotoIdx((prev) => (prev === memoryPhotos.length - 1 ? 0 : prev + 1));
  };

  // -------------------------------------------------------------
  // PAGE 5: 3D FLIP CARDS (9 REASONS)
  // -------------------------------------------------------------
  const [revealedReasons, setRevealedReasons] = useState<number[]>([]);

  const toggleReasonFlip = (id: number) => {
    soundFx.playPop();
    setRevealedReasons((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length === 5) {
        soundFx.playSuccessChime();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FF2E63", "#FFD166"],
        });
      }
      return next;
    });
  };

  // -------------------------------------------------------------
  // PAGE 7: QUIZ HANDLER
  // -------------------------------------------------------------
  const handleQuizOptionSelect = (opt: string) => {
    if (quizIsLocked) return;
    setQuizSelectedOption(opt);
    setQuizIsLocked(true);

    const isCorrect = opt === dynamicQuiz[quizQuestionIdx].correct;
    if (isCorrect) {
      soundFx.playSuccessChime();
      setQuizScore((prev) => prev + 1);
    } else {
      soundFx.playPop();
    }

    setTimeout(() => {
      if (quizQuestionIdx < dynamicQuiz.length - 1) {
        setQuizQuestionIdx((prev) => prev + 1);
        setQuizSelectedOption(null);
        setQuizIsLocked(false);
      } else {
        setQuizShowComplete(true);
      }
    }, 1200);
  };

  // -------------------------------------------------------------
  // PAGE 8: FORTUNE COOKIES HANDLER
  // -------------------------------------------------------------
  const handleCookieClick = (idx: number) => {
    soundFx.playPop();
    if (!openedCookies.includes(idx)) {
      setOpenedCookies((prev) => [...prev, idx]);
    }
    setActiveCookieQuote(dynamicFortunes[idx]);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#FBBF24", "#F59E0B", "#FF2E63"],
    });
  };

  // -------------------------------------------------------------
  // PAGE 9: FINALE CELEBRATION EFFECT
  // -------------------------------------------------------------
  useEffect(() => {
    if (step === 9) {
      soundFx.playSuccessChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF2E63", "#FF6B8B", "#FFD166", "#FDA4AF"],
      });
      const t = setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 100,
          origin: { y: 0.5 },
        });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Restart handler
  const handleRestart = () => {
    soundFx.playPop();
    setStep(1);
    setIntroPhase("typing-hello");
    setTypedIntroText("");
    setNoAttempts(0);
    setNoButtonPos(null);
    setRevealedReasons([]);
    setCurrentPhotoIdx(0);
    setStep3SubStep("transition");
    setStoryMilestoneIdx(0);
    setQuizQuestionIdx(0);
    setQuizSelectedOption(null);
    setQuizIsLocked(false);
    setQuizScore(0);
    setQuizShowComplete(false);
    setOpenedCookies([]);
    setActiveCookieQuote(null);
  };

  return (
    <div
      className={`relative w-full ${
        isEmbedded
          ? "min-h-[480px] sm:min-h-[540px] h-full rounded-[24px] sm:rounded-[28px] overflow-y-auto overscroll-contain p-4 sm:p-6"
          : "min-h-[100dvh] flex-1 overflow-y-auto overscroll-none px-3 py-3 sm:px-6 sm:py-4"
      } bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] flex flex-col justify-between selection:bg-pink-100 select-none font-sans`}
    >
      {/* Floating ambient hearts in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        <span className="absolute top-[18%] left-[8%] text-pink-300 text-lg opacity-60 animate-bounce duration-3000">
          💖
        </span>
        <span className="absolute top-[28%] right-[10%] text-pink-300 text-base opacity-50 animate-pulse duration-2500">
          💕
        </span>
        <span className="absolute top-[65%] left-[12%] text-rose-300 text-sm opacity-40">
          💗
        </span>
        <span className="absolute top-[52%] right-[14%] text-pink-400 text-lg opacity-50 animate-bounce duration-4000">
          💓
        </span>
        <span className="absolute top-[82%] right-[22%] text-rose-300 text-xs opacity-40">
          ✨
        </span>
      </div>

      {/* =============================================================== */}
      {/* TOP HEADER: 9-DOT PAGINATION + RESET + FULLSCREEN + CLOSE ICONS */}
      {/* =============================================================== */}
      <div className={`${isEmbedded ? "relative" : "sticky top-0"} z-20 w-full flex items-center justify-between max-w-xl mx-auto py-1`}>
        <div className="w-24 sm:w-28" />

        {/* 9 Pagination Dots (Total 9 Stages) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: 9 }).map((_, idx) => {
            const dotNum = idx + 1;
            const isCompleted = step > dotNum;
            const isCurrent = step === dotNum;

            return (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? "w-2.5 h-2.5 bg-[#FF2E63] scale-125 shadow-xs"
                    : isCompleted
                    ? "w-2 h-2 bg-[#FF2E63]/70"
                    : "w-1.5 h-1.5 bg-[#FCE9F4]"
                }`}
              />
            );
          })}
        </div>

        {/* Top Right Controls: Restart, Fullscreen (media_1791139618461.png), Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="template-restart-btn"
            type="button"
            onClick={handleRestart}
            title="Restart experience"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-pink-50 border border-pink-100/90 shadow-sm text-slate-600 hover:text-[#FF2E63] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          {onToggleFullscreen && (
            <button
              id="template-fullscreen-btn"
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-pink-50 border border-pink-100/90 shadow-sm text-slate-600 hover:text-[#FF2E63] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          )}
          {onClose && (
            <button
              id="template-close-btn"
              type="button"
              onClick={onClose}
              title="Close"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-pink-50 border border-pink-100/90 shadow-sm text-slate-600 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =============================================================== */}
      {/* MAIN CARD STAGE CONTAINER */}
      {/* =============================================================== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto my-auto py-2 sm:py-4">
        <AnimatePresence mode="wait">
          {/* =========================================================== */}
          {/* PAGE 1: WELCOME CARD & TYPING INTRO (media_1791134834458.png) */}
          {/* =========================================================== */}
          {step === 1 && (
            <div key="step-1" className="w-full max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 shadow-xl shadow-pink-900/5 border border-pink-100/70 text-center space-y-4 min-h-[440px] flex flex-col justify-center"
              >
                {/* Top Golden Badge: Special! */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <span>🎉</span>
                  <span>Special!</span>
                  <span>🎉</span>
                </div>

                {/* Sparkling Heart Mascot */}
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-amber-400 text-base font-bold">✨</span>
                  <div className="w-12 h-12 rounded-2xl bg-pink-100/80 text-[#FF2E63] flex items-center justify-center shadow-inner">
                    <Heart className="w-7 h-7 fill-[#FF2E63] text-[#FF2E63]" />
                  </div>
                  <span className="text-amber-400 text-base font-bold">✨</span>
                </div>

                {introPhase !== "card-revealed" ? (
                  /* ======================================================= */
                  /* TYPEWRITER PHASE INSIDE WHITE CARD (media_1791134834458) */
                  /* ======================================================= */
                  <div className="py-4 space-y-3">
                    <div className="min-h-[50px] flex items-center justify-center">
                      <h1 className="text-3xl sm:text-4xl font-black text-[#FF2E63] tracking-tight">
                        {typedIntroText}
                        <span className="inline-block w-0.5 sm:w-1 h-7 sm:h-8 bg-[#FF2E63] ml-1 animate-pulse" />
                      </h1>
                    </div>

                    <div>
                      <button
                        id="skip-intro-btn"
                        type="button"
                        onClick={skipIntro}
                        className="text-xs font-semibold text-slate-400 hover:text-[#FF2E63] inline-flex items-center gap-1 transition-colors cursor-pointer pt-2"
                      >
                        <span>Skip intro</span>
                        <FastForward className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ======================================================= */
                  /* REVEALED CARD DETAILS & LET'S GO BUTTON                 */
                  /* ======================================================= */
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-4 pt-1"
                  >
                    {/* Title & Mini Hearts */}
                    <div className="space-y-1.5">
                      <h1 className="text-2xl sm:text-3xl font-black text-[#FF2E63] tracking-tight">
                        Hello, {recipientName}
                      </h1>
                      <div className="flex items-center justify-center gap-1.5 text-xs">
                        <span>💕</span>
                        <span>💖</span>
                        <span>💗</span>
                        <span>💖</span>
                        <span>💕</span>
                      </div>
                    </div>

                    {/* Body Paragraph */}
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xs mx-auto">
                      I&apos;ve been thinking about us a lot lately, and I wanted to create something
                      special just for you. This is my way of showing you how much you mean to me.
                    </p>

                    {/* Subdued Prompt Pill Box */}
                    <div className="py-2.5 px-4 rounded-xl bg-pink-50/50 border border-pink-100/60 text-xs font-medium text-slate-400 italic">
                      Let&apos;s begin...
                    </div>

                    {/* Let's Go Button */}
                    <button
                      id="lets-go-btn"
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setStep(getNextStep(1));
                      }}
                      className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                    >
                      <span>Let&apos;s Go</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>

              {/* Watermark matching media_1791139618461.png */}
              {isEmbedded && (
                <p className="text-[10px] sm:text-[11px] font-semibold text-pink-400/80 text-center pt-3 tracking-wide select-none">
                  ♥ Made with LoveLink ♥
                </p>
              )}
            </div>
          )}

          {/* =========================================================== */}
          {/* PAGE 2: DO YOU LOVE ME? (media_1791131484804.png) */}
          {/* =========================================================== */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md mx-auto bg-white rounded-[32px] p-8 sm:p-12 shadow-xl shadow-pink-900/5 border border-pink-100/70 text-center space-y-6 min-h-[440px] flex flex-col justify-center"
            >
              {/* Center Pink Heart */}
              <div className="w-14 h-14 rounded-full bg-pink-50 text-[#FF2E63] flex items-center justify-center mx-auto shadow-xs">
                <Heart className="w-7 h-7 fill-[#FF2E63] text-[#FF2E63]" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {customQuestion}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {recipientName}, I need to know...
                </p>
              </div>

              {/* Buttons Row with Runaway No & Growing Yes */}
              <div className="relative min-h-[140px] flex items-center justify-center gap-4 pt-4">
                {/* YES Button (Grows with each attempt, stays in back layer) */}
                <motion.button
                  id="yes-btn"
                  type="button"
                  onClick={handleYesClick}
                  animate={{
                    scale: 1 + Math.min(noAttempts * 0.12, 1.8),
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  style={{ zIndex: 10 }}
                  className="px-7 py-3 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm sm:text-base shadow-md shadow-pink-500/25 cursor-pointer relative z-10 whitespace-nowrap active:scale-95"
                >
                  YES! 💖
                </motion.button>

                {/* NO Button (Dodges, cycles text, stays on top layer above YES) */}
                <motion.button
                  id="no-btn"
                  type="button"
                  onMouseEnter={handleNoDodge}
                  onClick={handleNoDodge}
                  animate={{
                    x: noButtonPos ? noButtonPos.x : 0,
                    y: noButtonPos ? noButtonPos.y : 0,
                    rotate: noAttempts >= 5 ? [0, -6, 6, -4, 4, 0] : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    rotate: { repeat: Infinity, duration: 0.3 },
                  }}
                  style={{ zIndex: 30 }}
                  className={`px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200/80 shadow-md cursor-pointer select-none whitespace-nowrap transition-colors relative z-30 ${
                    noAttempts >= 5 ? "ring-2 ring-rose-400" : ""
                  }`}
                >
                  {noPhrases[noAttempts % noPhrases.length]}
                </motion.button>
              </div>

              {noAttempts > 0 && (
                <p className="text-[11px] font-semibold text-rose-400 italic">
                  Hint: There is only one right answer! 😉
                </p>
              )}
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* PAGE 3: 3.1 TRANSITION & 3.2 LOVE LETTER (media_1791132358027.png) */}
          {/* =========================================================== */}
          {step === 3 && step3SubStep === "transition" && (
            <motion.div
              key="step-3-transition"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm mx-auto bg-white rounded-[32px] p-8 sm:p-10 shadow-xl shadow-pink-900/5 border border-pink-100 text-center space-y-4 min-h-[360px] flex flex-col justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-pink-100 text-[#FF2E63] flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8 fill-[#FF2E63]" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">I knew it! 🥰</h2>
              <p className="text-lg font-bold text-[#FF2E63]">You love me ❤️</p>
              <button
                id="open-letter-btn"
                type="button"
                onClick={() => setStep3SubStep("letter")}
                className="pt-2 text-xs font-bold text-slate-400 hover:text-[#FF2E63] underline cursor-pointer"
              >
                Opening your letter...
              </button>
            </motion.div>
          )}

          {step === 3 && step3SubStep === "letter" && (
            <motion.div
              key="step-3-letter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-lg mx-auto space-y-5"
            >
              {/* Vintage Stationery Letter Card */}
              <div className="relative bg-[#FFFEF7] rounded-[32px] p-7 sm:p-9 shadow-xl shadow-pink-900/5 border border-pink-200/60 text-left space-y-4">
                {/* Letter Header with Skip Typing Button */}
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF2E63] mx-auto sm:mx-0">
                    <span>💕</span>
                    <span>Love Letter</span>
                    <span>💕</span>
                  </div>

                  {isTypingLetter && (
                    <button
                      id="skip-typing-btn"
                      type="button"
                      onClick={handleSkipLetterTyping}
                      className="text-[11px] font-semibold text-slate-400 hover:text-[#FF2E63] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Skip typing</span>
                      <FastForward className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Typewritten Text Content */}
                <div className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed whitespace-pre-line min-h-[160px]">
                  {letterFullText.slice(0, letterTypedLength)}
                  {isTypingLetter && (
                    <span className="inline-block w-0.5 h-4 bg-[#FF2E63] ml-0.5 animate-pulse" />
                  )}
                </div>

                {/* Wax Seal Badge in Bottom Right Corner */}
                <div className="flex justify-end pt-2">
                  <div className="w-11 h-11 rounded-full bg-[#E02656] text-white flex items-center justify-center shadow-md shadow-rose-900/20 border-2 border-rose-300">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center pt-2">
                <button
                  id="continue-letter-btn"
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setStep(getNextStep(3));
                  }}
                  className="px-10 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Continue</span>
                  <span>💕</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* PAGE 4: OUR MEMORIES CAROUSEL (media_1791132434864.png) */}
          {/* =========================================================== */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl mx-auto space-y-4 text-center"
            >
              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#FF2E63] tracking-tight">
                  Our Memories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Swipe through our special moments
                </p>
              </div>

              {/* Photo Card Container with Arrows */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-pink-100 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memoryPhotos[currentPhotoIdx].image}
                  alt={memoryPhotos[currentPhotoIdx].caption}
                  className="w-full h-72 sm:h-96 object-cover"
                />

                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#FF2E63] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#FF2E63] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-left">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {memoryPhotos[currentPhotoIdx].caption}
                  </p>
                </div>
              </div>

              {/* Dots and Counter */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {memoryPhotos.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => {
                      soundFx.playPop();
                      setCurrentPhotoIdx(i);
                    }}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      i === currentPhotoIdx ? "w-6 bg-[#FF2E63]" : "w-2 bg-[#FCE9F4]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] font-semibold text-slate-400">
                {currentPhotoIdx + 1} / {memoryPhotos.length}
              </p>

              {/* Continue to Page 5 */}
              <div className="pt-2">
                <button
                  id="continue-memories-btn"
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setStep(getNextStep(4));
                  }}
                  className="px-9 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Why I Love You</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* PAGE 5: 3D FLIP CARDS (media_1791132483965.png) */}
          {/* =========================================================== */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl mx-auto space-y-4 text-center"
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 text-sm">
                  <span>✨</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#FF2E63] tracking-tight">
                    Why I Love You
                  </h2>
                  <span>✨</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Tap to reveal (at least 5 to continue)
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-pink-50 text-[11px] font-bold text-[#FF2E63]">
                  {revealedReasons.length} / 5 revealed
                </div>
              </div>

              {/* 3x3 Grid of 9 3D Flip Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md mx-auto pt-1">
                {dynamicReasons.map((item) => {
                  const isFlipped = revealedReasons.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      id={`card-flip-${item.id}`}
                      onClick={() => toggleReasonFlip(item.id)}
                      className="aspect-square cursor-pointer"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="relative w-full h-full rounded-2xl shadow-xs transition-transform duration-500"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* FRONT FACE (Unrevealed: White card with pink heart outline) */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-white border border-pink-100 flex items-center justify-center shadow-xs"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <Heart className="w-6 h-6 text-pink-300 stroke-[1.8]" />
                        </div>

                        {/* BACK FACE (Revealed: Soft pink background with emoji and reason text) */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-[#FFF0F3] border border-pink-200 p-2 flex flex-col items-center justify-center text-center shadow-xs"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <span className="text-base sm:text-lg mb-1">{item.emoji}</span>
                          <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-800 leading-tight">
                            {item.title}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Revealed Reasons Tray */}
              <div className="p-3 rounded-2xl bg-white/90 border border-pink-100/70 text-left max-w-md mx-auto space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Reasons revealed:
                </span>
                {revealedReasons.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Tap any card above to reveal</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {revealedReasons.map((id) => {
                      const reason = NINE_REASONS.find((r) => r.id === id);
                      if (!reason) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[10px] font-bold text-[#FF2E63]"
                        >
                          <span>{reason.emoji}</span>
                          <span>{reason.title}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Action Button */}
              <div className="pt-2">
                {revealedReasons.length < 5 ? (
                  <button
                    type="button"
                    disabled
                    className="px-8 py-3 rounded-full bg-pink-100/70 text-pink-300 font-extrabold text-xs cursor-not-allowed"
                  >
                    Reveal {5 - revealedReasons.length} more to continue
                  </button>
                ) : (
                  <button
                    id="finish-flipcards-btn"
                    type="button"
                    onClick={() => {
                      soundFx.playSuccessChime();
                      confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.7 },
                        colors: ["#FF2E63", "#FF6B8B"],
                      });
                      setStep(getNextStep(5));
                    }}
                    className="px-9 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Continue to Our Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* STEP 6: OUR STORY (media_1791139908028.png) */}
          {/* =========================================================== */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-5"
            >
              {/* Header Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#FF2E63] flex items-center justify-center gap-2 tracking-tight">
                  <span>📅</span>
                  <span>Our Story</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center justify-center gap-1.5">
                  <span className="text-pink-500">💖</span>
                  <span>Our journey through time</span>
                </p>
              </div>

              {/* Progress Stepper Line (4 Milestones) */}
              <div className="w-full max-w-xs flex items-center justify-between relative px-4 py-2">
                {/* Background line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-pink-100" />
                {/* Active progress bar */}
                <div
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#FF2E63] transition-all duration-300"
                  style={{
                    width: `${(storyMilestoneIdx / (dynamicMilestones.length - 1)) * 82}%`,
                  }}
                />
                {dynamicMilestones.map((_: any, idx: number) => {
                  const isCurrent = idx === storyMilestoneIdx;
                  const isPast = idx < storyMilestoneIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setStoryMilestoneIdx(idx);
                      }}
                      className={`relative z-10 rounded-full transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? "w-3.5 h-3.5 bg-[#FF2E63] ring-4 ring-pink-200"
                          : isPast
                          ? "w-2.5 h-2.5 bg-[#FF2E63]"
                          : "w-2.5 h-2.5 bg-pink-100 hover:bg-pink-200"
                      }`}
                      aria-label={`Milestone ${idx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Milestone Card */}
              <motion.div
                key={storyMilestoneIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-950/5 border border-pink-100/70 flex flex-col items-center text-center space-y-4"
              >
                {/* Milestone Icon */}
                <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-3xl shadow-inner">
                  {dynamicMilestones[storyMilestoneIdx].icon}
                </div>

                {/* Date Badge */}
                <span className="px-3.5 py-1 rounded-full bg-pink-100/70 text-[#FF2E63] text-xs font-bold tracking-wide">
                  {dynamicMilestones[storyMilestoneIdx].date}
                </span>

                {/* Title & Description */}
                <div className="space-y-1.5 pt-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {dynamicMilestones[storyMilestoneIdx].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xs">
                    {dynamicMilestones[storyMilestoneIdx].description}
                  </p>
                </div>
              </motion.div>

              {/* Navigation Controls: < Previous & Next > / Continue to Quiz > */}
              <div className="flex items-center justify-center gap-3 pt-1 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setStoryMilestoneIdx((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={storyMilestoneIdx === 0}
                  className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all ${
                    storyMilestoneIdx === 0
                      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-white/50"
                      : "border-pink-200 text-pink-600 bg-white hover:bg-pink-50 cursor-pointer shadow-2xs active:scale-95"
                  }`}
                >
                  &lt; Previous
                </button>

                {storyMilestoneIdx < dynamicMilestones.length - 1 ? (
                  <button
                    id="story-next-btn"
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setStoryMilestoneIdx((prev) => prev + 1);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white text-xs font-extrabold shadow-md shadow-pink-500/20 cursor-pointer active:scale-95 transition-all"
                  >
                    Next &gt;
                  </button>
                ) : (
                  <button
                    id="continue-to-quiz-btn"
                    type="button"
                    onClick={() => {
                      soundFx.playSuccessChime();
                      confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.6 },
                        colors: ["#FF2E63", "#FF6B8B"],
                      });
                      setStep(getNextStep(6));
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white text-xs font-extrabold shadow-md shadow-pink-500/20 cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Continue to Quiz</span>
                    <span>&gt;</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* STEP 7: LOVE QUIZ (media_1791140007486.png & media_1791140043616.png) */}
          {/* =========================================================== */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-4"
            >
              {!quizShowComplete ? (
                <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-950/5 border border-pink-100/70 flex flex-col items-center text-center space-y-5">
                  {/* Question Counter */}
                  <span className="text-xs font-bold text-pink-500 tracking-wide uppercase">
                    Question {quizQuestionIdx + 1} of {dynamicQuiz.length}
                  </span>

                  {/* Question Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {dynamicQuiz[quizQuestionIdx].question}
                  </h3>

                  {/* Options List */}
                  <div className="w-full space-y-2.5 pt-1">
                    {dynamicQuiz[quizQuestionIdx].options.map((opt: string) => {
                      const currentQ = dynamicQuiz[quizQuestionIdx];
                      const isSelected = quizSelectedOption === opt;
                      const isCorrect = opt === currentQ.correct;

                      let btnStyle =
                        "border-slate-200/90 bg-white hover:border-pink-300 hover:bg-pink-50/30 text-slate-800";

                      if (quizSelectedOption !== null) {
                        if (isCorrect) {
                          // Correct answer glows green
                          btnStyle =
                            "bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-bold shadow-xs";
                        } else if (isSelected && !isCorrect) {
                          // Wrong selected answer glows red
                          btnStyle =
                            "bg-rose-100 border-2 border-rose-400 text-rose-900 font-bold shadow-xs";
                        } else {
                          btnStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={opt}
                          id={`quiz-opt-${opt.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          type="button"
                          disabled={quizIsLocked}
                          onClick={() => handleQuizOptionSelect(opt)}
                          className={`w-full py-3 sm:py-3.5 px-5 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-center justify-between text-left cursor-pointer active:scale-[0.99] ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSelectedOption !== null && isCorrect && (
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                          {quizSelectedOption !== null && isSelected && !isCorrect && (
                            <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Quiz Complete Card (media_1791140043616.png) */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl shadow-pink-950/5 border border-pink-100/70 flex flex-col items-center text-center space-y-4"
                >
                  {/* Golden Trophy */}
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500">
                    <Trophy className="w-8 h-8 fill-amber-400 text-amber-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Quiz Complete!
                  </h3>

                  {/* Big Score */}
                  <div className="text-4xl font-black text-[#FF2E63] tracking-tight">
                    {quizScore}/{dynamicQuiz.length}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm font-medium text-slate-600 flex items-center justify-center gap-1.5">
                    <span>
                      {quizScore === dynamicQuiz.length
                        ? "You know me so well!"
                        : quizScore === 1
                        ? "Let's spend more time together!"
                        : "We'll make even more memories together!"}
                    </span>
                    <span>💖</span>
                  </p>

                  {/* Continue Button */}
                  <div className="pt-2">
                    <button
                      id="finish-quiz-btn"
                      type="button"
                      onClick={() => {
                        soundFx.playSuccessChime();
                        confetti({
                          particleCount: 50,
                          spread: 60,
                          origin: { y: 0.6 },
                          colors: ["#FF2E63", "#FF6B8B"],
                        });
                        setStep(getNextStep(7));
                      }}
                      className="px-8 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Continue</span>
                      <Heart className="w-4 h-4 fill-white text-white" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* STEP 8: FORTUNE COOKIES OF LOVE (media_1791140088198.png) */}
          {/* =========================================================== */}
          {step === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-4"
            >
              {/* Header Title & Subtitle */}
              <div className="space-y-1">
                <div className="text-3xl flex items-center justify-center gap-1">
                  <span>🥠</span>
                  <span className="text-lg">✨</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Fortune Cookies of Love
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Crack open your fortune cookies, {recipientName}!
                </p>
              </div>

              {/* 5 Fortune Cookies Grid: 3 on Top Row, 2 on Bottom Row */}
              <div className="flex flex-col items-center gap-2.5 pt-1">
                {/* Row 1: 3 Cookies */}
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  {[0, 1, 2].map((idx) => {
                    const isOpened = openedCookies.includes(idx);
                    return (
                      <button
                        key={idx}
                        id={`cookie-btn-${idx}`}
                        type="button"
                        onClick={() => handleCookieClick(idx)}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-md shadow-amber-900/15 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 group ${
                          isOpened ? "ring-4 ring-pink-300 ring-offset-2" : ""
                        }`}
                        title={`Cookie ${idx + 1}`}
                      >
                        {/* Crease line in cookie */}
                        <div className="w-6 sm:w-7 h-1 bg-amber-600/35 rounded-full transform -rotate-12 group-hover:rotate-0 transition-transform" />

                        {/* Top-right sparkle */}
                        <span className="absolute -top-1 -right-1 text-amber-200 text-xs sm:text-sm group-hover:scale-125 transition-transform">
                          ✨
                        </span>

                        {isOpened && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Row 2: 2 Cookies */}
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  {[3, 4].map((idx) => {
                    const isOpened = openedCookies.includes(idx);
                    return (
                      <button
                        key={idx}
                        id={`cookie-btn-${idx}`}
                        type="button"
                        onClick={() => handleCookieClick(idx)}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-md shadow-amber-900/15 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 group ${
                          isOpened ? "ring-4 ring-pink-300 ring-offset-2" : ""
                        }`}
                        title={`Cookie ${idx + 1}`}
                      >
                        {/* Crease line in cookie */}
                        <div className="w-6 sm:w-7 h-1 bg-amber-600/35 rounded-full transform -rotate-12 group-hover:rotate-0 transition-transform" />

                        {/* Top-right sparkle */}
                        <span className="absolute -top-1 -right-1 text-amber-200 text-xs sm:text-sm group-hover:scale-125 transition-transform">
                          ✨
                        </span>

                        {isOpened && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Counter */}
              <p className="text-xs font-semibold text-slate-500">
                {openedCookies.length} of 5 cookies opened
              </p>

              {/* Revealed Fortune Quote Card with 3 Vertical Stars */}
              <AnimatePresence mode="wait">
                {activeCookieQuote && (
                  <motion.div
                    key={activeCookieQuote}
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="w-full bg-white rounded-2xl p-3.5 sm:p-4 shadow-lg shadow-pink-950/5 border border-pink-100 flex flex-col items-center text-center space-y-2 max-w-xs sm:max-w-sm"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 italic leading-relaxed">
                      &ldquo;{activeCookieQuote}&rdquo;
                    </p>
                    {/* 3 Stars as requested in prompt */}
                    <div className="flex flex-col items-center justify-center gap-0.5 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button: Continue to Finale */}
              <div className="pt-1">
                {openedCookies.length < 5 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = [0, 1, 2, 3, 4].filter((i) => !openedCookies.includes(i));
                      if (remaining.length > 0) {
                        handleCookieClick(remaining[0]);
                      }
                    }}
                    className="px-6 py-2.5 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200/80 font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Tap cookies to reveal fortunes ({openedCookies.length}/5)</span>
                  </button>
                ) : (
                  <button
                    id="finish-fortune-btn"
                    type="button"
                    onClick={() => {
                      soundFx.playSuccessChime();
                      confetti({
                        particleCount: 70,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#FF2E63", "#FFD166"],
                      });
                      setStep(getNextStep(8));
                    }}
                    className="px-8 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Continue to Finale</span>
                    <Heart className="w-4 h-4 fill-white text-white" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* STEP 9: GRAND FINALE (media_1791140228471.png) */}
          {/* =========================================================== */}
          {step === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-3 sm:space-y-4 my-auto py-2"
            >
              {/* Recipient Name in Hot Pink */}
              <h1 className="text-3xl sm:text-4xl font-black text-[#FF2E63] tracking-tight">
                {recipientName}
              </h1>

              {/* Clustered 5 Animated Hearts */}
              <div className="flex items-center justify-center gap-1.5 text-lg sm:text-xl animate-pulse">
                <span>💖</span>
                <span>💗</span>
                <span>💓</span>
                <span>💗</span>
                <span>💖</span>
              </div>

              {/* Romantic Pledge Paragraph */}
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed max-w-sm px-2">
                I love you with all my heart, {recipientName}. You are my everything, my best friend,
                my soulmate. Here&apos;s to forever together. 💕
              </p>

              {/* 9 Reason Tags Cloud (3 Rows) */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm mx-auto pt-0.5">
                {dynamicReasons.map((reason) => (
                  <span
                    key={reason.id}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 border border-pink-200/80 text-[10px] sm:text-xs font-semibold text-slate-700 shadow-2xs inline-flex items-center gap-1"
                  >
                    <span>{reason.emoji}</span>
                    <span>{reason.title}</span>
                  </span>
                ))}
              </div>

              {/* Action: View Again Button */}
              <div className="pt-1">
                <button
                  id="finale-view-again-btn"
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-2 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-pink-600 font-bold text-xs shadow-2xs cursor-pointer inline-flex items-center gap-2 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-pink-500" />
                  <span>View Again</span>
                </button>
              </div>

              {/* Watermark Card: Made with LoveLink - only when embedded */}
              {isEmbedded && (
                <div className="rounded-2xl bg-white/80 border border-pink-100/80 px-4 py-2 shadow-2xs max-w-[240px] mx-auto text-center space-y-0.5">
                  <p className="text-xs font-extrabold text-[#FF2E63] flex items-center justify-center gap-1">
                    <span>💖</span>
                    <span>Made with LoveLink</span>
                    <span>💖</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Create your own free love surprise
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =============================================================== */}
      {/* BOTTOM FOOTER: CURRENT STEP INDICATOR & BRANDING */}
      {/* =============================================================== */}
      {isEmbedded ? (
        <div className="absolute bottom-3 right-4 z-20 pointer-events-none">
          <span className="text-[11px] font-bold text-pink-400 bg-white/90 px-2.5 py-0.5 rounded-full border border-pink-100 shadow-2xs">
            {step} / 9
          </span>
        </div>
      ) : (
        <footer className="relative z-20 w-full max-w-xl mx-auto flex items-center justify-between px-3 py-1.5 text-[11px] text-pink-400/80 font-medium">
          <span className="select-none font-semibold tracking-wide flex items-center gap-1 text-pink-400">
            <span>♥</span> Made with LoveLink
          </span>
          <span className="font-bold text-pink-500 bg-white/90 px-2.5 py-0.5 rounded-full border border-pink-100 shadow-2xs">
            {step} / 9
          </span>
        </footer>
      )}
    </div>
  );
}
