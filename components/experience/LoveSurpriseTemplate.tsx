"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  Music,
  VolumeX,
  Download,
  MessageCircle,
  Disc,
} from "lucide-react";
import { soundFx } from "@/lib/soundFx";
import { LoveSurpriseData, AudioTrackId } from "@/lib/types";
import RomanticBackground from "@/components/experience/RomanticBackground";

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

// Natural slight rotation angles for authentic fortune paper notes
const COOKIE_TILT_ANGLES = [-2.2, 1.8, -1.6, 2.4, -1.9];

// Realistic 3D Baked Fortune Cookie SVG Illustration
function FortuneCookieIllustration({
  isOpened,
  isSelected,
  index,
  size = 72,
}: {
  isOpened: boolean;
  isSelected?: boolean;
  index: number;
  size?: number;
}) {
  const uniqueId = `fc-${index}`;
  return (
    <div
      className={`relative flex items-center justify-center transition-transform duration-300 ${
        isSelected ? "scale-105" : ""
      }`}
      style={{ width: size, height: Math.round(size * 0.82) }}
    >
      <svg
        viewBox="0 0 84 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full filter ${
          isSelected
            ? "drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]"
            : "drop-shadow-[0_4px_6px_rgba(146,64,14,0.18)]"
        }`}
      >
        <defs>
          <linearGradient id={`baked-${uniqueId}`} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <radialGradient id={`glow-${uniqueId}`} cx="42" cy="18" r="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#FDE68A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`crease-${uniqueId}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#92400E" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#78350F" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {!isOpened ? (
          // UNOPENED WHOLE COOKIE
          <g>
            {/* Main body: folded crescent lobes */}
            <path
              d="M 42,19 C 28,10 14,14 7,27 C -0.5,40 4,56 16,60 C 26,63 36,51 42,39 C 48,51 58,63 68,60 C 80,56 84.5,40 77,27 C 70,14 56,10 42,19 Z"
              fill={`url(#baked-${uniqueId})`}
            />

            {/* Specular highlight crest */}
            <path
              d="M 42,20 C 30,12 18,16 11,28 C 8,33 9,40 14,42 C 21,31 32,23 42,23 C 52,23 63,31 70,42 C 75,40 76,33 73,28 C 66,16 54,12 42,20 Z"
              fill={`url(#glow-${uniqueId})`}
            />

            {/* Front folded belly flap */}
            <path
              d="M 18,45 C 24,56 33,62 42,62 C 51,62 60,56 66,45 C 58,49 50,51 42,51 C 34,51 26,49 18,45 Z"
              fill="#D97706"
              opacity="0.85"
            />
            <path
              d="M 21,47 C 27,55 34,59 42,59 C 50,59 57,55 63,47 C 56,50 49,52 42,52 C 35,52 28,50 21,47 Z"
              fill="#B45309"
              opacity="0.55"
            />

            {/* Center indent crease shadow */}
            <path
              d="M 40.5,21 C 41,29 40.5,39 42,47 C 43.5,39 43,29 43.5,21 Z"
              fill={`url(#crease-${uniqueId})`}
            />

            {/* Baked rim shadows */}
            <path d="M 7,27 C 4,40 8,54 16,59 C 13,52 10,40 12,30 Z" fill="#92400E" opacity="0.35" />
            <path d="M 77,27 C 80,40 76,54 68,59 C 71,52 74,40 72,30 Z" fill="#92400E" opacity="0.35" />

            {/* Sparkle on upper right */}
            <path
              d="M 67,13 Q 71,13 71,9 Q 71,13 75,13 Q 71,13 71,17 Q 71,13 67,13 Z"
              fill="#FEF08A"
            />
          </g>
        ) : (
          // CRACKED OPEN COOKIE WITH EMERGING FORTUNE SLIP
          <g>
            {/* Emerging Fortune Paper Slip */}
            <g transform="translate(42, 33) rotate(-5)">
              <rect
                x="-22"
                y="-10"
                width="44"
                height="19"
                rx="2.5"
                fill="#FFFDF8"
                stroke="#FDA4AF"
                strokeWidth="1.2"
              />
              <rect
                x="-19"
                y="-7.5"
                width="38"
                height="14"
                rx="1.5"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="0.7"
                strokeDasharray="2 1.5"
                opacity="0.75"
              />
              <circle cx="-11" cy="-0.5" r="2.2" fill="#E11D48" />
              <line
                x1="-6"
                y1="-2"
                x2="14"
                y2="-2"
                stroke="#E11D48"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <line
                x1="-6"
                y1="2"
                x2="11"
                y2="2"
                stroke="#FB7185"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </g>

            {/* Left cracked half */}
            <g transform="translate(18, 33) rotate(-14) translate(-18, -33)">
              <path
                d="M 36,19 C 23,11 11,15 5,28 C -2,41 2,56 14,60 C 23,63 33,52 37,41 L 35,35 L 38,30 L 35,24 Z"
                fill={`url(#baked-${uniqueId})`}
              />
              <path
                d="M 36,19 L 35,24 L 38,30 L 35,35 L 37,41"
                stroke="#FEF08A"
                strokeWidth="1.4"
                fill="none"
              />
              <path
                d="M 31,25 C 28,31 28,37 32,39 L 34,35 L 32,30 L 34,24 Z"
                fill="#78350F"
                opacity="0.45"
              />
            </g>

            {/* Right cracked half */}
            <g transform="translate(66, 33) rotate(14) translate(-66, -33)">
              <path
                d="M 48,19 C 61,11 73,15 79,28 C 86,41 82,56 70,60 C 61,63 51,52 47,41 L 49,35 L 46,30 L 49,24 Z"
                fill={`url(#baked-${uniqueId})`}
              />
              <path
                d="M 48,19 L 49,24 L 46,30 L 49,35 L 47,41"
                stroke="#FEF08A"
                strokeWidth="1.4"
                fill="none"
              />
              <path
                d="M 53,25 C 56,31 56,37 52,39 L 50,35 L 52,30 L 50,24 Z"
                fill="#78350F"
                opacity="0.45"
              />
            </g>

            {/* Golden crumbs */}
            <circle cx="32" cy="17" r="1.4" fill="#F59E0B" />
            <circle cx="52" cy="15" r="1.2" fill="#FBBF24" />
            <circle cx="42" cy="11" r="1.6" fill="#FEF08A" />
            <circle cx="34" cy="53" r="1.2" fill="#D97706" />
            <circle cx="50" cy="55" r="1.3" fill="#F59E0B" />
          </g>
        )}
      </svg>

      {/* Opened indicator check badge */}
      {isOpened && (
        <span
          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transition-all ${
            isSelected
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white ring-2 ring-white scale-110"
              : "bg-emerald-500 text-white"
          }`}
        >
          ✓
        </span>
      )}

      {/* Active ring indicator on the cookie */}
      {isSelected && (
        <span className="absolute -top-1 -left-1 text-xs animate-bounce select-none">
          ✨
        </span>
      )}
    </div>
  );
}

export default function LoveSurpriseTemplate({
  data,
  isEmbedded = false,
  onClose,
  onToggleFullscreen,
  isFullscreen = false,
}: LoveSurpriseTemplateProps) {
  const recipientName = data?.recipientName || "My Love";
  const senderName = data?.senderName || "Your Love";
  const customQuestion = data?.question || "Do you love me?";

  const rawLetter =
    data?.letterContent ||
    data?.letterText ||
    `My dearest ${recipientName},\n\nFrom the moment I met you, my life changed in ways I never expected. Your smile has become my favorite sight, your laugh my favorite sound.\n\nEvery day with you feels like an adventure, and I can't imagine my life without you by my side. You make the ordinary extraordinary.\n\nI love you more than words could ever express, but I'm going to try anyway through this letter.\n\nForever yours,\n${senderName} 💕`;

  const letterFullText = rawLetter
    .replace(/\bSarah\b/g, recipientName)
    .replace(/\bMichael\b/g, senderName);

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
      2: "page4_photos",
      3: "page5_reasons",
      4: "page6_story",
      5: "page7_quiz",
      6: "page8_fortunes",
      7: "page2_question",
      8: "page3_letter",
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
  const [activeCookieIdx, setActiveCookieIdx] = useState<number | null>(null);

  // Background Romantic Music Playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AudioTrackId>(
    (data?.bgMusic as AudioTrackId) || "romantic-lofi"
  );
  const [showSongPicker, setShowSongPicker] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  // Audio sources helper (Primary format M4A for iOS/Safari + MP3 fallback)
  const isSummer = selectedTrack === "summer-guitar";
  const m4aTrackSrc = isSummer ? "/music/summer-gouyad-5.m4a" : "/music/love-bgm.m4a";
  const mp3TrackSrc = isSummer ? "/music/summer-gouyad-5.mp3" : "/music/love-bgm.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.65;

    // Detect format preference (iOS Safari natively prefers audio/mp4 for hardware AAC)
    const canPlayM4A = audio.canPlayType("audio/mp4") || audio.canPlayType("audio/x-m4a");
    const activeSrc = canPlayM4A ? m4aTrackSrc : mp3TrackSrc;

    if (!audio.src.endsWith(activeSrc)) {
      audio.src = activeSrc;
      audio.load();
    }

    const tryStartMusic = () => {
      const el = audioRef.current;
      if (!el) return;
      const promise = el.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlayingMusic(true);
            setMusicBlocked(false);
          })
          .catch(() => {
            // Browser autoplay policy requires user gesture (iOS/Chrome)
            setMusicBlocked(true);
          });
      }
    };

    // 1. Attempt immediate autoplay
    tryStartMusic();

    // 2. Universal gesture listeners: First touch/click/scroll anywhere immediately starts music!
    const handleGesture = () => {
      tryStartMusic();
      removeGestureListeners();
    };

    const gestureEvents = ["click", "touchstart", "touchend", "pointerdown", "keydown"];
    const removeGestureListeners = () => {
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleGesture);
      });
    };

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { passive: true, once: true });
    });

    return () => {
      removeGestureListeners();
    };
  }, [selectedTrack, m4aTrackSrc, mp3TrackSrc]);

  const toggleMusic = () => {
    soundFx.playPop();
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlayingMusic) {
      audio.pause();
      setIsPlayingMusic(false);
    } else {
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlayingMusic(true);
            setMusicBlocked(false);
          })
          .catch(() => {
            setMusicBlocked(true);
          });
      }
    }
  };

  const changeTrack = (trackId: AudioTrackId) => {
    soundFx.playPop();
    setSelectedTrack(trackId);
    setShowSongPicker(false);
  };

  // Certificate Download Handler (Luxury Royal Premium Design with 3 Tilted Polaroid Photos)
  const handleDownloadCertificate = async () => {
    if (isGeneratingCert) return;
    setIsGeneratingCert(true);
    soundFx.playSuccessChime();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });

    // Helper: Safely load image for canvas with CORS fallback
    const loadCanvasImage = (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Retry without crossOrigin (for data URIs or local assets)
          const fallback = new Image();
          fallback.onload = () => resolve(fallback);
          fallback.onerror = () => resolve(null);
          fallback.src = src;
        };
        img.src = src;
      });
    };

    // 1. Collect all candidate photos from user's surprise
    const candidatePhotos: string[] = [];
    if (Array.isArray(data?.photos) && data.photos.length > 0) {
      candidatePhotos.push(...data.photos.filter((p): p is string => Boolean(p && typeof p === "string")));
    }
    if (Array.isArray(data?.photoMemories) && data.photoMemories.length > 0) {
      candidatePhotos.push(
        ...data.photoMemories
          .map((m) => m?.image)
          .filter((p): p is string => Boolean(p && typeof p === "string"))
      );
    }
    if (candidatePhotos.length === 0) {
      candidatePhotos.push(
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80"
      );
    }

    // Pick 3 random photos (User request: "jitnni bhi photo user dale lekin show only random 3 photo")
    const uniquePool = Array.from(new Set(candidatePhotos));
    const shuffled = [...uniquePool].sort(() => Math.random() - 0.5);
    const chosen3Urls: string[] = [];
    for (let i = 0; i < 3; i++) {
      chosen3Urls.push(shuffled[i % shuffled.length]);
    }

    // Pre-load all 3 images asynchronously
    let loadedImgs: (HTMLImageElement | null)[] = [];
    try {
      loadedImgs = await Promise.all(chosen3Urls.map((url) => loadCanvasImage(url)));
    } catch {
      loadedImgs = [null, null, null];
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1060;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsGeneratingCert(false);
      return;
    }

    // 1. Rich Vintage Parchment Background
    const bgGrad = ctx.createRadialGradient(600, 530, 100, 600, 530, 850);
    bgGrad.addColorStop(0, "#FFFFFF");
    bgGrad.addColorStop(0.5, "#FFFBF7");
    bgGrad.addColorStop(0.85, "#FFF5F7");
    bgGrad.addColorStop(1, "#FAECF2");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1060);

    // Subtle luxury vignette tint at corners
    ctx.fillStyle = "rgba(212, 175, 55, 0.03)";
    ctx.fillRect(0, 0, 1200, 1060);

    // 2. Outer Ornate Gold Foil Border (Gradient Stroke)
    const goldGrad = ctx.createLinearGradient(0, 0, 1200, 1060);
    goldGrad.addColorStop(0, "#B8860B");
    goldGrad.addColorStop(0.2, "#E5C158");
    goldGrad.addColorStop(0.4, "#FDF3D0");
    goldGrad.addColorStop(0.6, "#D4AF37");
    goldGrad.addColorStop(0.8, "#AA771C");
    goldGrad.addColorStop(1, "#C59B27");

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 14;
    ctx.strokeRect(28, 28, 1144, 1004);

    // Inner fine gold hairline
    ctx.strokeStyle = "#C5A059";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, 1116, 976);

    // Inner Royal Rose Accent Border
    ctx.strokeStyle = "#9F1239";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(52, 52, 1096, 956);

    // 3. Baroque Corner Filigree Flourishes
    const drawCornerFlourish = (cx: number, cy: number, flipX: number, flipY: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(flipX, flipY);
      ctx.strokeStyle = "#B8860B";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 35);
      ctx.bezierCurveTo(10, 15, 15, 10, 35, 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(18, 45);
      ctx.bezierCurveTo(18, 22, 22, 18, 45, 18);
      ctx.stroke();

      // Small sparkling diamond in corner
      ctx.fillStyle = "#E11D48";
      ctx.font = "bold 16px serif";
      ctx.textAlign = "center";
      ctx.fillText("✦", 22, 26);
      ctx.restore();
    };

    drawCornerFlourish(52, 52, 1, 1);
    drawCornerFlourish(1148, 52, -1, 1);
    drawCornerFlourish(52, 1008, 1, -1);
    drawCornerFlourish(1148, 1008, -1, -1);

    // 4. Header Top Crest Emblem
    ctx.textAlign = "center";
    ctx.fillStyle = "#D4AF37";
    ctx.font = "26px serif";
    ctx.fillText("👑   ✦   💖   ✦   👑", 600, 92);

    // Grand Title
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 38px 'Playfair Display', 'Cinzel', Georgia, serif";
    ctx.fillText("CERTIFICATE OF ETERNAL LOVE", 600, 138);

    // Subheader Ribbon Badge
    ctx.fillStyle = "#BE123C";
    ctx.font = "bold 13px 'Montserrat', sans-serif";
    ctx.fillText("✦  OFFICIAL & UNBREAKABLE BOND OF DEVOTION  ✦", 600, 170);

    // Ornate Divider Line
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(340, 190);
    ctx.lineTo(540, 190);
    ctx.moveTo(660, 190);
    ctx.lineTo(860, 190);
    ctx.stroke();

    ctx.fillStyle = "#B8860B";
    ctx.font = "bold 18px serif";
    ctx.fillText("❦", 600, 196);

    // 5. Body Presentation Text
    ctx.fillStyle = "#64748B";
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillText("This is to proudly & solemnly certify that", 600, 228);

    // Recipient Name
    ctx.fillStyle = "#E11D48";
    ctx.font = "bold 46px 'Playfair Display', Georgia, serif";
    ctx.fillText(recipientName, 600, 280);

    // Golden Accent Line below recipient name
    const nameWidth = ctx.measureText(recipientName).width;
    const lineHalf = Math.max(nameWidth / 2 + 30, 120);
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600 - lineHalf, 292);
    ctx.lineTo(600 + lineHalf, 292);
    ctx.stroke();

    ctx.fillStyle = "#64748B";
    ctx.font = "italic 17px Georgia, serif";
    ctx.fillText("holds the eternal key to the heart & soul of", 600, 326);

    // Sender Name
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 38px 'Playfair Display', Georgia, serif";
    ctx.fillText(senderName, 600, 370);

    // 6. THE 3 TILTED POLAROID PHOTOS (Exact match to user's reference image!)
    const drawPolaroidCard = (
      cx: number,
      cy: number,
      angleRad: number,
      img: HTMLImageElement | null,
      isTop: boolean
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRad);

      const cardW = 216;
      const cardH = 236;
      const borderSide = 10;
      const borderBottom = 26;

      // Realistic soft shadow
      ctx.shadowColor = isTop ? "rgba(0, 0, 0, 0.32)" : "rgba(0, 0, 0, 0.20)";
      ctx.shadowBlur = isTop ? 26 : 18;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = isTop ? 12 : 8;

      // White Polaroid frame
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 4);
      ctx.fill();

      // Reset shadow for crisp inner photo
      ctx.shadowColor = "transparent";

      // Subtle hairline stroke around card
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner Photo
      const imgX = -cardW / 2 + borderSide;
      const imgY = -cardH / 2 + borderSide;
      const imgW = cardW - borderSide * 2;
      const imgH = cardH - borderSide - borderBottom;

      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 2);
        ctx.clip();

        // Object-fit: cover
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = imgW / imgH;
        let sx = 0,
          sy = 0,
          sw = img.naturalWidth,
          sh = img.naturalHeight;

        if (imgRatio > targetRatio) {
          sw = img.naturalHeight * targetRatio;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / targetRatio;
          sy = (img.naturalHeight - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, imgX, imgY, imgW, imgH);
        ctx.restore();

        // Photo inner border
        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
        ctx.lineWidth = 1;
        ctx.strokeRect(imgX, imgY, imgW, imgH);
      } else {
        // Fallback placeholder
        ctx.fillStyle = "#FFF0F4";
        ctx.fillRect(imgX, imgY, imgW, imgH);
        ctx.fillStyle = "#FF2E63";
        ctx.font = "32px serif";
        ctx.textAlign = "center";
        ctx.fillText("💖", 0, imgY + imgH / 2 + 10);
      }

      // Polaroid bottom caption badge
      ctx.fillStyle = "rgba(225, 29, 72, 0.35)";
      ctx.font = "bold 9px 'Montserrat', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("♥ FOREVER MEMORY ♥", 0, cardH / 2 - 9);

      ctx.restore();
    };

    // Draw Left photo (-6.5° tilt)
    drawPolaroidCard(405, 520, -0.11, loadedImgs[0], false);
    // Draw Right photo (+5.5° tilt)
    drawPolaroidCard(795, 520, 0.09, loadedImgs[2], false);
    // Draw Center photo (drawn LAST so it overlaps both left & right on top!)
    drawPolaroidCard(600, 505, 0.035, loadedImgs[1], true);

    // 7. The Vows Quote Plaque Box
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFF7FA";
    ctx.strokeStyle = "#FCE7F3";
    ctx.lineWidth = 1.5;
    const qx = 210;
    const qy = 670;
    const qw = 780;
    const qh = 80;
    ctx.beginPath();
    ctx.roundRect(qx, qy, qw, qh, 16);
    ctx.fill();
    ctx.stroke();

    // Decorative Quote text
    ctx.fillStyle = "#BE123C";
    ctx.font = "bold 30px serif";
    ctx.fillText("“", qx + 35, qy + 36);
    ctx.fillText("”", qx + qw - 35, qy + 62);

    ctx.fillStyle = "#334155";
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillText(
      "Love is not about how many days, months, or years you have been together.",
      600,
      qy + 33
    );
    ctx.fillText(
      "Love is about how much you love each other every single day.",
      600,
      qy + 59
    );

    // 8. BOTTOM SECTION: NO COLLISIONS (100% Separated Columns)
    const sealX = 600;
    const sealY = 865;

    // Silk Ribbon Tails
    ctx.fillStyle = "#9F1239";
    ctx.beginPath();
    ctx.moveTo(sealX - 18, sealY + 25);
    ctx.lineTo(sealX - 34, sealY + 76);
    ctx.lineTo(sealX - 22, sealY + 70);
    ctx.lineTo(sealX - 10, sealY + 76);
    ctx.lineTo(sealX - 6, sealY + 25);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sealX + 6, sealY + 25);
    ctx.lineTo(sealX + 10, sealY + 76);
    ctx.lineTo(sealX + 22, sealY + 70);
    ctx.lineTo(sealX + 34, sealY + 76);
    ctx.lineTo(sealX + 18, sealY + 25);
    ctx.closePath();
    ctx.fill();

    // Outer Scalloped Gold Medallion
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
    ctx.fill();

    // Inner Ruby Wax Circle
    ctx.fillStyle = "#BE123C";
    ctx.beginPath();
    ctx.arc(sealX, sealY, 34, 0, Math.PI * 2);
    ctx.fill();

    // Inner Gold Beaded Ring
    ctx.strokeStyle = "#FDF0CD";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 30, 0, Math.PI * 2);
    ctx.stroke();

    // Center Gold Monogram & Text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px serif";
    ctx.fillText("❤", sealX, sealY + 7);

    ctx.fillStyle = "#FDF0CD";
    ctx.font = "bold 8px 'Montserrat', sans-serif";
    ctx.fillText("★ SEALED WITH LOVE ★", sealX, sealY + 24);

    // Left Box: Date of Issuance
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    ctx.textAlign = "left";
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(110, 880);
    ctx.lineTo(370, 880);
    ctx.stroke();

    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("DATE OF ISSUANCE", 110, 904);

    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 16px Georgia, serif";
    ctx.fillText(dateStr, 110, 928);

    // Right Box: Solemn Signature
    ctx.textAlign = "right";
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(830, 880);
    ctx.lineTo(1090, 880);
    ctx.stroke();

    ctx.fillStyle = "#BE123C";
    ctx.font = "italic bold 22px 'Brush Script MT', 'Playfair Display', cursive";
    ctx.fillText(senderName, 1090, 870);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("PLEDGED & SIGNED WITH LOVE", 1090, 904);

    ctx.fillStyle = "#E11D48";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`By: ${senderName} ❤️`, 1090, 928);

    // 9. Bottom Serial Verification
    ctx.textAlign = "center";
    ctx.fillStyle = "#94A3B8";
    ctx.font = "11px sans-serif";
    ctx.fillText(
      `Registry No: LOVE-8842-FOREVER  •  Official Certificate of Endless Devotion`,
      600,
      1020
    );

    // Trigger Download
    try {
      const link = document.createElement("a");
      link.download = `Certificate_of_Love_${recipientName}_and_${senderName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (exportErr) {
      console.warn("Canvas export fallback:", exportErr);
    } finally {
      setIsGeneratingCert(false);
    }
  };

  // WhatsApp Reply Action Handler
  const handleWhatsAppClick = () => {
    soundFx.playPop();
    confetti({ particleCount: 50, spread: 60 });

    const rawPhone = data?.whatsappNumber || "0000000000";
    const cleanPhone = rawPhone.replace(/\D/g, "");

    const predefinedMsg =
      data?.whatsappMessage ||
      `Hey ${senderName}! I just opened your special love website and I loved it so much! You made my day! ❤️`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(predefinedMsg)}`;
    window.open(waUrl, "_blank");
  };


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
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setMusicBlocked(false);
        })
        .catch(() => {});
    }
    setIntroPhase("card-revealed");
  };

  // -------------------------------------------------------------
  // PAGE 2: RUNAWAY "NO" BUTTON & PROGRESSIVE YES GROWTH
  // -------------------------------------------------------------
  const [noAttempts, setNoAttempts] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);

  const noPhrases =
    data?.dodgePhrases && data.dodgePhrases.length > 0
      ? data.dodgePhrases
      : [
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

  // List of 12 stickers for runaway NO button reactions (Optimized WebP)
  const NO_STICKERS = [
    "/stickers/no1_sticker.webp", // 1. Kitty Sticker
    "/stickers/no2_sticker.webp", // 2. Cute Pinch
    "/stickers/no10_sticker.webp",// 3. Couple Cat
    "/stickers/no6_sticker.webp", // 4. Bubu Dudu Sseeyall
    "/stickers/no7_sticker.webp", // 5. Cat Flowers Cat Rose
    "/stickers/no9_sticker.webp", // 6. Peach And Goma White Cat
    "/stickers/no8_sticker.webp", // 7. Goma Peach Bubu
    "/stickers/no6.webp",         // 8. no6
    "/stickers/no3_sticker.webp", // 9. Valgal696
    "/stickers/no5.webp",         // 10. no5
    "/stickers/no11_sticker.webp",// 11. Flag
    "/stickers/no4.webp",         // 12. Last
  ];

  // Preload all reaction and celebration stickers into memory for instant transitions with 0ms delay
  useEffect(() => {
    const allStickers = [
      "/stickers/intro_sticker.webp",
      ...NO_STICKERS,
      "/stickers/yes1.webp",
      "/stickers/yes2.webp",
    ];
    allStickers.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const lastDodgeTimeRef = useRef<number>(0);

  // Generate safe random position within card bounds (never overflowing or overlapping YES)
  const getNextRandomNoPos = (currentPos: { x: number; y: number } | null) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxX = isMobile ? 80 : 130;
    const maxY = isMobile ? 60 : 95;

    let newX = 0;
    let newY = 0;
    let tries = 0;

    do {
      newX = Math.floor(Math.random() * (maxX * 2 + 1)) - maxX;
      newY = Math.floor(Math.random() * (maxY * 2 + 1)) - maxY;
      tries++;
      const overlapsYes = newX < -50 && Math.abs(newY) < 38;
      const isTooClose = currentPos && Math.hypot(newX - currentPos.x, newY - currentPos.y) < 55;
      if (!overlapsYes && (!isTooClose || tries > 12)) {
        break;
      }
    } while (tries < 20);

    return { x: newX, y: newY };
  };

  const handleNoInteraction = (type: "hover" | "click") => {
    // Before 8th message sequence (attempts 0 to 6):
    // The button does NOT move randomly. Only clicks advance sequence.
    if (noAttempts < 7) {
      if (type === "click") {
        soundFx.playPop();
        setNoAttempts((prev) => prev + 1);
      }
      return;
    }

    // Starting at 8th message sequence ("Okay watch then me 😎") and onwards:
    // When user hovers or clicks, move the button randomly away until user clicks yes!
    const now = Date.now();
    if (now - lastDodgeTimeRef.current < 180) {
      return;
    }
    lastDodgeTimeRef.current = now;

    soundFx.playPop();
    setNoAttempts((prev) => prev + 1);
    setNoButtonPos((prev) => getNextRandomNoPos(prev));
  };

  const handleYesClick = () => {
    soundFx.playSuccessChime();
    setNoButtonPos(null);
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#FF2E63", "#FF6B8B", "#FFD166", "#FF007A"],
    });

    // Notify backend and creator via email that partner clicked YES
    if (data?.slug) {
      fetch(`/api/surprise/${data.slug}/response`, { method: "POST" }).catch(() => {});
    }

    // In Love BGM: start song at 02:00 min (120 seconds) on YES click
    if (audioRef.current) {
      if (selectedTrack === "romantic-lofi") {
        try {
          audioRef.current.currentTime = 120;
        } catch {
          // ignore seek error if audio metadata not yet buffered
        }
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setMusicBlocked(false);
        })
        .catch(() => {});
    }

    setStep3SubStep("yes1");
    setStep(getNextStep(7));
  };

  // -------------------------------------------------------------
  // PAGE 8: CELEBRATION (8.1 YES1 for 3s -> 8.2 YES2 -> 8.3 LETTER)
  // -------------------------------------------------------------
  const [step3SubStep, setStep3SubStep] = useState<"yes1" | "yes2" | "letter">("yes1");
  const [letterTypedLength, setLetterTypedLength] = useState(0);
  const [isTypingLetter, setIsTypingLetter] = useState(true);

  // Auto advance from yes1 (3 seconds) to yes2
  useEffect(() => {
    if (step === 8 && step3SubStep === "yes1") {
      const timer = setTimeout(() => {
        setStep3SubStep("yes2");
        soundFx.playSuccessChime();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#FF2E63", "#FFD166"],
        });
      }, 3000); // exactly 3 sec as requested
      return () => clearTimeout(timer);
    }
  }, [step, step3SubStep]);

  // Auto advance from yes2 to letter after 4.5 seconds if user hasn't clicked
  useEffect(() => {
    if (step === 8 && step3SubStep === "yes2") {
      const timer = setTimeout(() => {
        setStep3SubStep("letter");
        setLetterTypedLength(0);
        setIsTypingLetter(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [step, step3SubStep]);

  // Letter typing interval
  useEffect(() => {
    if (step === 8 && step3SubStep === "letter" && isTypingLetter) {
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
      setOpenedCookies((prev) => {
        const next = [...prev, idx];
        if (next.length === 5) {
          soundFx.playSuccessChime();
          confetti({
            particleCount: 65,
            spread: 75,
            origin: { y: 0.6 },
            colors: ["#FF2E63", "#FBBF24", "#FF6B8B", "#FFD166"],
          });
        }
        return next;
      });
    }
    setActiveCookieIdx(idx);
    setActiveCookieQuote(
      dynamicFortunes[idx] || DEFAULT_FORTUNE_QUOTES[idx % DEFAULT_FORTUNE_QUOTES.length]
    );
    confetti({
      particleCount: 30,
      spread: 55,
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
    setStep3SubStep("yes1");
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
          : "min-h-[100dvh] h-full flex-1 overflow-y-auto overscroll-contain px-3 py-2 sm:px-6 sm:py-4"
      } bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] flex flex-col justify-between selection:bg-pink-100 select-none font-sans`}
    >
      {/* RICH ANIMATED ROMANTIC BACKGROUND (Floating Hearts, Petals, Glowing Bokeh Orbs) */}
      <RomanticBackground />

      {/* Hidden Native Audio Element with Dual Sources (M4A Apple AAC + MP3) */}
      <audio
        ref={audioRef}
        loop
        playsInline
        preload="auto"
        className="hidden"
        onPlay={() => {
          setIsPlayingMusic(true);
          setMusicBlocked(false);
        }}
        onPause={() => {
          setIsPlayingMusic(false);
        }}
      >
        <source src={m4aTrackSrc} type="audio/mp4" />
        <source src={mp3TrackSrc} type="audio/mpeg" />
      </audio>

      {/* Autoplay Helper Banner (Disappears when music starts) */}
      <AnimatePresence>
        {musicBlocked && !isPlayingMusic && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={toggleMusic}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-white/95 border border-pink-200 shadow-xl text-[#FF2E63] font-black text-xs flex items-center gap-2 cursor-pointer hover:bg-pink-50 backdrop-blur-md active:scale-95"
          >
            <Music className="w-3.5 h-3.5 text-[#FF2E63] animate-bounce" />
            <span>🎵 Tap here to start romantic music</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =============================================================== */}
      {/* TOP HEADER: 9-DOT PAGINATION + MUSIC + RESET + FULLSCREEN + CLOSE */}
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

        {/* Top Right Controls: Music Toggle, Restart, Fullscreen, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Music Audio Toggle Button */}
          <button
            id="template-music-btn"
            type="button"
            onClick={toggleMusic}
            title={isPlayingMusic ? "Pause romantic song" : "Play romantic song"}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-full border shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              isPlayingMusic
                ? "bg-gradient-to-r from-[#FF2E63] to-rose-500 text-white border-pink-400 shadow-pink-500/25"
                : "bg-white hover:bg-pink-50 text-slate-600 border-pink-100"
            }`}
          >
            {isPlayingMusic ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <Music className="w-3.5 h-3.5 text-white animate-bounce" />
                <span className="text-[10px] sm:text-[11px] font-black hidden xs:inline">Song On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Play Song</span>
              </>
            )}
          </button>

          {/* Interactive Song Track Switcher Button */}
          <div className="relative">
            <button
              id="template-change-song-btn"
              type="button"
              onClick={() => {
                soundFx.playPop();
                setShowSongPicker(!showSongPicker);
              }}
              title="Change Background Song"
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-white hover:bg-pink-50 border border-pink-100/90 shadow-sm text-slate-700 hover:text-[#FF2E63] flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 text-[10px] sm:text-[11px] font-extrabold"
            >
              <Disc className="w-3.5 h-3.5 text-pink-500" />
              <span className="hidden xs:inline">
                {selectedTrack === "summer-guitar" ? "Guitar 🎸" : "BGM 🎹"}
              </span>
            </button>

            {/* Song Picker Dropdown Menu */}
            <AnimatePresence>
              {showSongPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 6 }}
                  className="absolute right-0 top-10 z-50 w-52 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-2xl space-y-1 text-left"
                >
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1">
                    Change Music Track:
                  </p>
                  <button
                    type="button"
                    onClick={() => changeTrack("romantic-lofi")}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedTrack === "romantic-lofi"
                        ? "bg-pink-50 text-[#FF2E63]"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>🎹 Love BGM (Piano)</span>
                    {selectedTrack === "romantic-lofi" && <Check className="w-3.5 h-3.5 text-[#FF2E63]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeTrack("summer-guitar")}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedTrack === "summer-guitar"
                        ? "bg-pink-50 text-[#FF2E63]"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>🎸 Sunset Guitar (Acoustic)</span>
                    {selectedTrack === "summer-guitar" && <Check className="w-3.5 h-3.5 text-[#FF2E63]" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto py-2 sm:py-4 my-auto">
        <AnimatePresence mode="wait">
          {/* =========================================================== */}
          {/* PAGE 1: WELCOME CARD & TYPING INTRO (media_1791134834458.png) */}
          {/* =========================================================== */}
          {step === 1 && (
            <div key="step-1" className="w-full max-w-md mx-auto my-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 shadow-xl shadow-pink-900/5 border border-pink-100/70 text-center space-y-4 min-h-[390px] sm:min-h-[440px] flex flex-col justify-center"
              >
                {/* Top Golden Badge: Special! */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <span>🎉</span>
                  <span>Special!</span>
                  <span>🎉</span>
                </div>

                {/* Siyatech Animated Sticker */}
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-amber-400 text-base font-bold animate-pulse">✨</span>
                  <div className="flex items-center justify-center min-h-[105px] sm:min-h-[125px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/stickers/intro_sticker.webp"
                      alt="Siyatech Sticker"
                      className="max-h-28 sm:max-h-36 max-w-[190px] w-auto h-auto object-contain pointer-events-none select-none mix-blend-multiply"
                      loading="eager"
                    />
                  </div>
                  <span className="text-amber-400 text-base font-bold animate-pulse">✨</span>
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
                        if (audioRef.current && audioRef.current.paused) {
                          audioRef.current
                            .play()
                            .then(() => {
                              setIsPlayingMusic(true);
                              setMusicBlocked(false);
                            })
                            .catch(() => {});
                        }
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
                  ♥ Made with Lovedrop.online ♥
                </p>
              )}
            </div>
          )}

          {/* =========================================================== */}
          {/* PAGE 2: OUR MEMORIES CAROUSEL (media_1791132434864.png) */}
          {/* =========================================================== */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl mx-auto space-y-4 text-center my-auto py-2"
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
                    setStep(getNextStep(2));
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
          {/* PAGE 3: 3D FLIP CARDS (media_1791132483965.png) */}
          {/* =========================================================== */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl mx-auto space-y-2.5 text-center my-auto py-2"
            >
              {/* Header */}
              <div className="space-y-0.5">
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
                <div className="inline-block px-3 py-0.5 rounded-full bg-pink-50 text-[11px] font-bold text-[#FF2E63]">
                  {revealedReasons.length} / 5 revealed
                </div>
              </div>

              {/* 3x3 Grid of 9 3D Flip Cards (Enlarged & Comfortable on Mobile) */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 max-w-[340px] sm:max-w-[380px] mx-auto pt-1">
                {dynamicReasons.map((item) => {
                  const isFlipped = revealedReasons.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      id={`card-flip-${item.id}`}
                      onClick={() => toggleReasonFlip(item.id)}
                      className="aspect-square cursor-pointer group"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="relative w-full h-full rounded-2xl sm:rounded-3xl shadow-xs transition-transform duration-500"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* FRONT FACE (Unrevealed: Crisp white card with generous pink heart outline) */}
                        <div
                          className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white border border-pink-100 flex items-center justify-center shadow-xs hover:border-pink-300 transition-colors group-hover:scale-[1.02]"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-pink-300 stroke-[1.8] group-hover:text-pink-400 transition-colors" />
                        </div>

                        {/* BACK FACE (Revealed: Soft pink background with large emoji and clear reason text) */}
                        <div
                          className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFF5F8] to-[#FFEBF0] border-2 border-pink-200/90 p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-xs"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <span className="text-xl sm:text-2xl mb-1 select-none">{item.emoji}</span>
                          <span className="text-[11px] sm:text-xs font-black text-slate-800 leading-snug px-0.5">
                            {item.title}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Revealed Reasons Tray (Spacious and clear) */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/95 border border-pink-100/80 text-left max-w-[340px] sm:max-w-[380px] mx-auto space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Reasons revealed:
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-[#FF2E63]">
                    {revealedReasons.length}/9
                  </span>
                </div>
                {revealedReasons.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">Tap any card above to reveal</p>
                ) : (
                  <div className="flex flex-wrap gap-1 max-h-14 overflow-y-auto no-scrollbar">
                    {revealedReasons.map((id) => {
                      const reason = NINE_REASONS.find((r) => r.id === id);
                      if (!reason) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-[10px] sm:text-[11px] font-bold text-[#FF2E63]"
                        >
                          <span>{reason.emoji}</span>
                          <span>{reason.title}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Action Button (Directly visible) */}
              <div className="pt-1.5">
                {revealedReasons.length < 5 ? (
                  <button
                    type="button"
                    disabled
                    className="px-6 py-2.5 rounded-full bg-pink-100/70 text-pink-300 font-extrabold text-xs cursor-not-allowed"
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
                      setStep(getNextStep(3));
                    }}
                    className="px-9 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm sm:text-base shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Continue to Our Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* STEP 4: OUR STORY (media_1791139908028.png) */}
          {/* =========================================================== */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-4 my-auto py-2"
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
                      setStep(getNextStep(4));
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white text-xs font-extrabold shadow-md shadow-pink-500/20 cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Play Our Love Quiz</span>
                    <span>&gt;</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* STEP 5: LOVE QUIZ (media_1791140007486.png & media_1791140043616.png) */}
          {/* =========================================================== */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-4 my-auto py-2"
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
                        setStep(getNextStep(5));
                      }}
                      className="px-8 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Open Fortune Cookies</span> <Heart className="w-4 h-4 fill-white text-white" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* STEP 6: FORTUNE COOKIES OF LOVE                            */}
          {/* =========================================================== */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-4 my-auto py-2"
            >
              {/* Header Title & Subtitle */}
              <div className="space-y-1">
                <div className="text-3xl flex items-center justify-center gap-1.5 animate-pulse">
                  <span>🥠</span>
                  <span className="text-xl">✨</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Fortune Cookies of Love
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Crack open your love fortunes, {recipientName}!
                </p>
              </div>

              {/* 5 Realistic Fortune Cookies Grid: 3 on Top Row, 2 on Bottom Row (Enlarged size={84}) */}
              <div className="flex flex-col items-center gap-2.5 pt-1 w-full">
                {/* Row 1: 3 Cookies */}
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  {[0, 1, 2].map((idx) => {
                    const isOpened = openedCookies.includes(idx);
                    const isSelected = activeCookieIdx === idx;
                    return (
                      <button
                        key={idx}
                        id={`cookie-btn-${idx}`}
                        type="button"
                        onClick={() => handleCookieClick(idx)}
                        className={`p-1.5 sm:p-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 relative group focus:outline-none ${
                          isSelected
                            ? "bg-amber-100/90 ring-2 ring-rose-400 ring-offset-2 ring-offset-pink-50 shadow-md"
                            : isOpened
                            ? "bg-amber-50/50 hover:bg-amber-100/60 shadow-xs"
                            : "bg-white/40 hover:bg-white/80 shadow-xs hover:shadow-md"
                        }`}
                        title={isOpened ? `Fortune #${idx + 1} (Tap to view)` : `Cookie #${idx + 1} (Tap to crack!)`}
                      >
                        <FortuneCookieIllustration
                          index={idx}
                          isOpened={isOpened}
                          isSelected={isSelected}
                          size={84}
                        />
                        <span
                          className={`text-[11px] font-bold tracking-tight mt-1 transition-colors ${
                            isSelected
                              ? "text-rose-600 font-black"
                              : isOpened
                              ? "text-amber-800"
                              : "text-slate-500 group-hover:text-amber-700"
                          }`}
                        >
                          {isOpened ? `Fortune #${idx + 1} ✓` : `Cookie #${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Row 2: 2 Cookies */}
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  {[3, 4].map((idx) => {
                    const isOpened = openedCookies.includes(idx);
                    const isSelected = activeCookieIdx === idx;
                    return (
                      <button
                        key={idx}
                        id={`cookie-btn-${idx}`}
                        type="button"
                        onClick={() => handleCookieClick(idx)}
                        className={`p-1.5 sm:p-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 relative group focus:outline-none ${
                          isSelected
                            ? "bg-amber-100/90 ring-2 ring-rose-400 ring-offset-2 ring-offset-pink-50 shadow-md"
                            : isOpened
                            ? "bg-amber-50/50 hover:bg-amber-100/60 shadow-xs"
                            : "bg-white/40 hover:bg-white/80 shadow-xs hover:shadow-md"
                        }`}
                        title={isOpened ? `Fortune #${idx + 1} (Tap to view)` : `Cookie #${idx + 1} (Tap to crack!)`}
                      >
                        <FortuneCookieIllustration
                          index={idx}
                          isOpened={isOpened}
                          isSelected={isSelected}
                          size={84}
                        />
                        <span
                          className={`text-[11px] font-bold tracking-tight mt-1 transition-colors ${
                            isSelected
                              ? "text-rose-600 font-black"
                              : isOpened
                              ? "text-amber-800"
                              : "text-slate-500 group-hover:text-amber-700"
                          }`}
                        >
                          {isOpened ? `Fortune #${idx + 1} ✓` : `Cookie #${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Counter & Interactive Fortune Dots */}
              <div className="flex items-center justify-center gap-2 pt-0.5">
                <span className="text-xs font-semibold text-slate-500">
                  {openedCookies.length} of 5 fortunes revealed
                </span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const isOpened = openedCookies.includes(idx);
                    const isCur = activeCookieIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (isOpened) {
                            soundFx.playPop();
                            setActiveCookieIdx(idx);
                            setActiveCookieQuote(
                              dynamicFortunes[idx] || DEFAULT_FORTUNE_QUOTES[idx % DEFAULT_FORTUNE_QUOTES.length]
                            );
                          } else {
                            handleCookieClick(idx);
                          }
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isCur
                            ? "w-6 bg-rose-500"
                            : isOpened
                            ? "w-2.5 bg-rose-300 hover:bg-rose-400"
                            : "w-2 bg-slate-200 hover:bg-amber-300"
                        }`}
                        title={isOpened ? `Fortune #${idx + 1}` : `Crack cookie #${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* All Cracked Fortune Slips Stacked Vertically with Individual Tilt Angles */}
              {openedCookies.length > 0 ? (
                <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-3.5 pt-2">
                  {openedCookies.map((idx) => {
                    const quote =
                      dynamicFortunes[idx] || DEFAULT_FORTUNE_QUOTES[idx % DEFAULT_FORTUNE_QUOTES.length];
                    const tilt = COOKIE_TILT_ANGLES[idx % COOKIE_TILT_ANGLES.length];
                    const isLatest = activeCookieIdx === idx;

                    return (
                      <motion.div
                        key={`fortune-slip-${idx}`}
                        initial={{ opacity: 0, scale: 0.88, y: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        }}
                        className={`w-full relative rounded-2xl bg-[#FFFDF9] p-4 sm:p-5 text-center transition-all ${
                          isLatest
                            ? "border-2 border-rose-400 ring-4 ring-rose-400/15 shadow-md shadow-rose-950/5"
                            : "border border-amber-200/80 shadow-xs"
                        }`}
                        style={{
                          transform: `rotate(${tilt}deg)`,
                        }}
                      >
                        {/* Washi tape pin accent */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-9 h-3.5 bg-rose-200/70 border border-rose-300/40 rounded-xs -rotate-1 shadow-2xs" />

                        {/* Fortune Header */}
                        <div className="flex items-center justify-between text-xs font-bold text-rose-500 mb-1.5">
                          <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-rose-600">
                            <span>🥠</span>
                            <span>Fortune #{idx + 1}</span>
                          </span>
                          <span className="text-amber-400 text-xs">✨</span>
                        </div>

                        {/* Romantic Quote in Serif Italic */}
                        <p className="font-serif italic text-sm sm:text-base text-slate-800 leading-relaxed font-semibold px-2 py-1">
                          &ldquo;{quote}&rdquo;
                        </p>

                        {/* Clean Romantic Footer without lucky numbers */}
                        <div className="mt-2 pt-2 border-t border-dashed border-rose-200/70 flex items-center justify-center text-[10px] sm:text-[11px] text-pink-500 font-semibold">
                          <span>💕 Destined for {recipientName}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-sm sm:max-w-md mx-auto p-4 rounded-2xl bg-white/80 border border-pink-100/90 shadow-2xs text-center space-y-1.5"
                >
                  <div className="text-2xl animate-bounce">🥠</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    Tap any golden cookie to crack open your fortunes!
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    5 sweet love prophecies are hidden inside just for you, {recipientName} 💕
                  </p>
                </motion.div>
              )}

              {/* Action Button: Continue to Finale */}
              <div className="pt-2.5">
                {openedCookies.length < 5 ? (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const remaining = [0, 1, 2, 3, 4].filter((i) => !openedCookies.includes(i));
                        if (remaining.length > 0) {
                          handleCookieClick(remaining[0]);
                        }
                      }}
                      className="px-7 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-2 shadow-md shadow-pink-500/25 active:scale-95"
                    >
                      <span>Crack Next Fortune ({openedCookies.length}/5)</span>
                      <span>✨</span>
                    </button>
                    {openedCookies.length >= 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playSuccessChime();
                          setStep(getNextStep(6));
                        }}
                        className="text-[11px] font-bold text-pink-500 hover:text-pink-600 underline cursor-pointer"
                      >
                        Continue to The Big Question ❤️
                      </button>
                    )}
                  </div>
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
                      setStep(getNextStep(6));
                    }}
                    className="px-9 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm sm:text-base shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 animate-pulse"
                  >
                    <span>The Big Question... ❤️</span>
                    <Heart className="w-4 h-4 fill-white text-white" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* =========================================================== */}
          {/* PAGE 7: DO YOU LOVE ME? (media_1791131484804.png) */}
          {/* =========================================================== */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md mx-auto bg-white rounded-[32px] p-6 sm:p-10 shadow-xl shadow-pink-900/5 border border-pink-100/70 text-center space-y-4 min-h-[420px] sm:min-h-[460px] flex flex-col justify-center my-auto py-2"
            >
              {/* Sticker Reaction Display (Cycles through 12 stickers on NO click/dodge) */}
              <div className="flex items-center justify-center min-h-[148px] sm:min-h-[160px] pt-1">
                <motion.div
                  key={noAttempts > 0 ? NO_STICKERS[Math.min(noAttempts - 1, NO_STICKERS.length - 1)] : "initial-heart"}
                  initial={{ scale: 0.94 }}
                  animate={{ scale: [0.94, 1.05, 1] }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="relative flex items-center justify-center"
                >
                  {noAttempts > 0 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={NO_STICKERS[Math.min(noAttempts - 1, NO_STICKERS.length - 1)]}
                      alt={`Reaction sticker ${noAttempts}`}
                      className="max-h-36 sm:max-h-40 max-w-[190px] w-auto h-auto object-contain select-none pointer-events-none mix-blend-multiply"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#FF2E63] flex items-center justify-center mx-auto shadow-sm border border-pink-100/80">
                      <Heart className="w-10 h-10 fill-[#FF2E63] text-[#FF2E63] animate-pulse" />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {customQuestion}
                </h2>
              </div>

              {/* Reaction Message in upper area of buttons */}
              <div className="min-h-[40px] flex items-center justify-center">
                {noAttempts > 0 && (
                  <motion.div
                    key={Math.min(noAttempts, noPhrases.length)}
                    initial={{ opacity: 0.85, scale: 0.96 }}
                    animate={{ opacity: 1, scale: [0.96, 1.03, 1] }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-[#FF2E63] font-black text-xs sm:text-sm shadow-xs tracking-wide">
                      {noPhrases[Math.min(noAttempts - 1, noPhrases.length - 1)]}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Buttons Row with Growing Yes & Clean No Button */}
              <div className="relative min-h-[90px] flex items-center justify-center gap-4 pt-1">
                {/* YES Button (Grows only starting after 8th message 'I'm ready! 👀') */}
                <motion.button
                  id="yes-btn"
                  type="button"
                  onClick={handleYesClick}
                  animate={{
                    scale: noAttempts < 8 ? 1 : 1 + Math.min((noAttempts - 7) * 0.16, 1.6),
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  style={{ zIndex: 10 }}
                  className="px-7 py-3 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm sm:text-base shadow-md shadow-pink-500/25 cursor-pointer relative z-10 whitespace-nowrap active:scale-95"
                >
                  YES! 💖
                </motion.button>

                {/* NO Button (Fixed clean label, starts random move on 8th message sequence upon hover/click) */}
                <motion.button
                  id="no-btn"
                  type="button"
                  animate={
                    noButtonPos
                      ? { x: noButtonPos.x, y: noButtonPos.y }
                      : { x: 0, y: 0 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 26,
                  }}
                  onMouseEnter={() => handleNoInteraction("hover")}
                  onClick={() => handleNoInteraction("click")}
                  style={{ zIndex: 30 }}
                  className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200/80 shadow-md cursor-pointer select-none whitespace-nowrap transition-colors relative z-30 active:scale-95"
                >
                  No 💔
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
          {/* PAGE 8: CELEBRATION (yes1 for 3s -> yes2 -> LOVE LETTER)     */}
          {/* =========================================================== */}
          {step === 8 && step3SubStep === "yes1" && (
            <motion.div
              key="step-8-yes1"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm mx-auto bg-white rounded-[32px] p-6 sm:p-8 shadow-xl shadow-pink-900/5 border border-pink-100 text-center space-y-4 min-h-[420px] flex flex-col justify-center items-center my-auto py-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/stickers/yes1.webp"
                alt="Yes Celebration 1"
                className="max-h-44 sm:max-h-48 max-w-[220px] w-auto h-auto object-contain select-none pointer-events-none mix-blend-multiply"
                loading="eager"
              />
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  YAAAY! I knew it! 🥰
                </h2>
                <p className="text-base font-extrabold text-[#FF2E63]">
                  You love me too ❤️
                </p>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 italic">
                Hang on... something special is coming... ✨
              </p>
            </motion.div>
          )}

          {step === 8 && (step3SubStep === "yes2" || step3SubStep === "letter") && (
            <motion.div
              key="step-8-celebration-letter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-lg mx-auto my-auto py-2"
            >
              {/* VINTAGE STATIONERY LETTER CARD (Always rendered in background once yes2 is reached) */}
              <div
                className={`relative bg-[#FFFEF7] rounded-[32px] p-6 sm:p-9 shadow-xl shadow-pink-900/5 border border-pink-200/60 text-left space-y-4 transition-all duration-500 ${
                  step3SubStep === "yes2"
                    ? "opacity-40 blur-[2px] pointer-events-none select-none scale-95"
                    : "opacity-100 blur-0 scale-100"
                }`}
              >
                {/* Letter Header with Skip Typing Button */}
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF2E63] mx-auto sm:mx-0">
                    <span>💕</span>
                    <span>Love Letter for {recipientName}</span>
                    <span>💕</span>
                  </div>

                  {isTypingLetter && step3SubStep === "letter" && (
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

                {/* 2nd Sticker (yes2) Featured Sweetly on the Letter */}
                <div className="flex items-center justify-center pt-1 pb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/stickers/yes2.webp"
                    alt="Yes Celebration 2"
                    className="max-h-24 sm:max-h-28 max-w-[160px] w-auto h-auto object-contain select-none pointer-events-none mix-blend-multiply"
                    loading="eager"
                  />
                </div>

                {/* Typewritten Text Content */}
                <div className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed whitespace-pre-line min-h-[160px]">
                  {step3SubStep === "yes2"
                    ? letterFullText.slice(0, 200) + "..."
                    : letterFullText.slice(0, letterTypedLength)}
                  {isTypingLetter && step3SubStep === "letter" && (
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

              {/* 2ND STICKER OVERLAY MODAL (Foreground Card with 'Continue with Next Page' button) */}
              <AnimatePresence>
                {step3SubStep === "yes2" && (
                  <motion.div
                    key="step-8-yes2-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute inset-0 z-20 flex items-center justify-center p-3"
                  >
                    <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-7 shadow-2xl border border-pink-200/80 text-center space-y-4 flex flex-col justify-center items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/stickers/yes2.webp"
                        alt="Yes Celebration 2"
                        className="max-h-40 sm:max-h-44 max-w-[200px] w-auto h-auto object-contain select-none pointer-events-none mix-blend-multiply"
                        loading="eager"
                      />
                      <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                          Forever &amp; Always ❤️
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold text-slate-600">
                          I wrote a special love letter just for you, {recipientName}
                        </p>
                      </div>
                      <button
                        id="open-letter-btn"
                        type="button"
                        onClick={() => {
                          soundFx.playPop();
                          setStep3SubStep("letter");
                          setLetterTypedLength(0);
                          setIsTypingLetter(true);
                        }}
                        className="px-8 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <span>Continue with Next Page 💌</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue Button to Next Page (Shown once letter is active) */}
              {step3SubStep === "letter" && (
                <div className="text-center pt-3">
                  <button
                    id="continue-letter-btn"
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setStep(getNextStep(8));
                    }}
                    className="px-10 py-3.5 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Continue to Finale 🎉</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
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

              {/* Certificate of Eternal Love Card */}
              <div className="w-full max-w-sm mx-auto p-4 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FFF5F8] to-[#FDF2F7] border border-amber-300/80 shadow-md space-y-2.5 text-center relative overflow-hidden my-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                  <span className="flex items-center gap-1">📜 Certificate of Love</span>
                  <span className="text-[10px] bg-amber-100/80 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-full font-black uppercase">
                    Official &amp; Sealed
                  </span>
                </div>
                <div className="py-2.5 px-3 rounded-2xl bg-white/95 border border-pink-100 shadow-2xs space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Unbreakable Bond
                  </p>
                  <p className="text-base sm:text-lg font-black text-slate-900">
                    {recipientName} &amp; {senderName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    &quot;Sealed with endless love, passion &amp; trust&quot;
                  </p>
                </div>
                <button
                  id="download-certificate-btn"
                  type="button"
                  disabled={isGeneratingCert}
                  onClick={handleDownloadCertificate}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 disabled:opacity-75 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className={`w-4 h-4 text-white ${isGeneratingCert ? "animate-bounce" : ""}`} />
                  <span>{isGeneratingCert ? "Styling & Rendering 3 Photos..." : "Download Certificate of Love 📜"}</span>
                </button>
              </div>

              {/* Predefined WhatsApp Action Button */}
              <div className="w-full max-w-sm mx-auto space-y-1">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <MessageCircle className="w-4 h-4 text-white fill-white" />
                  <span>Reply to {senderName} on WhatsApp 💬</span>
                </button>
                <p className="text-[10px] text-slate-500 font-medium text-center truncate px-2">
                  Auto-fills message in WhatsApp automatically
                </p>
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

              {/* Viral Loop CTA: Surprise them back */}
              {!isEmbedded && (
                <div className="pt-2 text-center">
                  <Link
                    href="/create"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/10 hover:from-pink-500/20 hover:to-rose-500/20 border border-pink-200 text-pink-700 text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95"
                  >
                    <span>✨</span>
                    <span>Want to surprise someone special? Create Yours</span>
                    <span>→</span>
                  </Link>
                </div>
              )}

              {/* Watermark Card: Made with Lovedrop.online - only when embedded */}
              {isEmbedded && (
                <div className="rounded-2xl bg-white/80 border border-pink-100/80 px-4 py-2 shadow-2xs max-w-[240px] mx-auto text-center space-y-0.5">
                  <p className="text-xs font-extrabold text-[#FF2E63] flex items-center justify-center gap-1">
                    <span>💖</span>
                    <span>Made with Lovedrop.online</span>
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
          <Link
            href="/"
            target="_blank"
            className="font-semibold tracking-wide flex items-center gap-1 text-pink-400 hover:text-[#FF2E63] transition-colors"
          >
            <span>♥</span> Made with Lovedrop.online • Make Yours ✨
          </Link>
          <span className="font-bold text-pink-500 bg-white/90 px-2.5 py-0.5 rounded-full border border-pink-100 shadow-2xs">
            {step} / 9
          </span>
        </footer>
      )}
    </div>
  );
}
