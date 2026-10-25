"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Trash2,
  Plus,
  Check,
  Copy,
  ExternalLink,
  Music,
  Pause,
  Play,
  Lock,
  Heart,
  Star,
  MapPin,
  Calendar,
  Camera,
  X,
  Smartphone,
  Mail,
  Send,
  MessageCircle,
  Sparkles,
  Globe,
  Zap,
} from "lucide-react";
import { BirthdayData, AudioTrackId } from "@/lib/types";
import { compressImageToBlob } from "@/lib/imageCompress";
import { generateSecureSlug, hashPasscode, sanitizeInput } from "@/lib/security";
import { soundFx } from "@/lib/soundFx";
import { usePricing } from "@/lib/pricing";
import BirthdayPreviewCard from "@/components/birthday/BirthdayPreviewCard";

// ─── Design Tokens (Matches CreatorWizard.tsx 1:1) ────────────────────────────
const THEME_ACCENT = "#FF2E63";
const THEME_ACCENT_HOVER = "#E02656";

export const MAX_LIMITS = {
  PHOTOS: 10,
  REASONS: 9,
  WISHES: 9,
  PLACES: 6,
} as const;

const AUDIO_TRACKS: { id: AudioTrackId; name: string; emoji: string; src: string }[] = [
  { id: "romantic-lofi", name: "Romantic Lofi", emoji: "🎵", src: "/music/love-bgm.mp3?v=2" },
  { id: "summer-guitar", name: "Summer Guitar", emoji: "🎸", src: "/music/summer-gouyad-5.mp3?v=2" },
];

const STEP_TITLES = [
  "Welcome",
  "The Letter",
  "What I Love",
  "Our Story",
  "Wishes Jar",
  "Moments",
  "Our Places",
  "Special Date",
  "Candles & Cake",
  "Launch & Publish",
];

// ─── Photo Upload Component (Matches CreatorWizard.tsx 1:1) ───────────────────
function PhotoUploader({
  photos,
  onChange,
  max = MAX_LIMITS.PHOTOS,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || photos.length >= max) return;
    setIsUploading(true);
    soundFx.playPop();

    const slots = max - photos.length;
    const toProcess = Array.from(files).slice(0, slots);
    const results: string[] = [];

    for (const file of toProcess) {
      try {
        const compressed = await compressImageToBlob(file, 900, 0.82);
        const reader = new FileReader();
        await new Promise<void>((res) => {
          reader.onload = () => {
            results.push(reader.result as string);
            res();
          };
          reader.readAsDataURL(compressed.blob);
        });
      } catch {
        const reader = new FileReader();
        await new Promise<void>((res) => {
          reader.onload = () => {
            results.push(reader.result as string);
            res();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    onChange([...photos, ...results]);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddUrl = () => {
    if (!newPhotoUrl.trim() || photos.length >= max) return;
    onChange([...photos, newPhotoUrl.trim()]);
    setNewPhotoUrl("");
    soundFx.playPop();
  };

  return (
    <div className="space-y-4">
      {/* Existing Photo List */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 rounded-2xl border border-pink-100 bg-pink-50/20 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-pink-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={`Memory ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Memory Photo {idx + 1}</p>
                  <p className="text-[10px] text-slate-400 truncate">Polaroid memory frame</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  onChange(photos.filter((_, i) => i !== idx));
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-pink-100 flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add New Photo Upload Zone */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Add Another Memory</span>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              photos.length >= max
                ? "bg-amber-100 text-amber-700 font-bold"
                : "bg-pink-50 text-pink-600 border border-pink-100"
            }`}
          >
            {photos.length} / {max} Max Photos
          </span>
        </div>

        {photos.length >= max ? (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-xs font-bold text-amber-800">
              📸 Maximum limit of {max} photos reached!
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              Please delete any existing photo above if you want to upload a new one.
            </p>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading || photos.length >= max}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-pink-300 hover:border-[#FF2E63] bg-pink-50/50 hover:bg-pink-50 text-pink-700 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer group shadow-2xs active:scale-[0.99] disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center text-pink-600 transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <span>
                {isUploading
                  ? "Compressing & Processing Photo..."
                  : "📁 Choose Photos from Device (Auto-Compressed)"}
              </span>
            </button>

            <div className="text-[10px] text-slate-400 font-semibold text-center flex items-center gap-2">
              <span className="h-[1px] flex-1 bg-slate-100" />
              <span>OR PASTE IMAGE URL</span>
              <span className="h-[1px] flex-1 bg-slate-100" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste direct image URL..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-pink-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 bg-pink-50/20"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!newPhotoUrl.trim() || photos.length >= max}
                className="px-5 py-2.5 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add URL</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── List Editor Component (Matches CreatorWizard.tsx 1:1) ────────────────────
function ListEditor({
  items,
  onChange,
  placeholder,
  max,
  emoji,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  max: number;
  emoji: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || items.length >= max) return;
    onChange([...items, trimmed]);
    setInput("");
    soundFx.playPop();
  };

  return (
    <div className="space-y-3.5">
      {/* Existing Items */}
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 rounded-2xl border border-pink-100 bg-pink-50/20 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl shrink-0">{emoji}</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx] = e.target.value;
                    onChange(updated);
                  }}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-[#FF2E63]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  onChange(items.filter((_, i) => i !== idx));
                }}
                className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-pink-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add New Item */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Add New Entry</span>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              items.length >= max
                ? "bg-amber-100 text-amber-700 font-bold"
                : "bg-pink-50 text-pink-600 border border-pink-100"
            }`}
          >
            {items.length} / {max} Max
          </span>
        </div>

        {items.length < max && (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder={placeholder}
              maxLength={120}
              className="flex-1 px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm font-semibold text-slate-800 bg-pink-50/20"
            />
            <button
              type="button"
              onClick={add}
              disabled={!input.trim()}
              className="px-5 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable Page Toggle & Skipped Components (Matches CreatorWizard.tsx 1:1) ─
function PageToggleBanner({
  title,
  isEnabled,
  onToggle,
}: {
  title: string;
  isEnabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-100 shadow-2xs">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isEnabled
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800">Include {title} Page</p>
          <p className="text-[10px] text-slate-400">
            {isEnabled ? "Active in surprise" : "Skipped by recipient"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
          isEnabled ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
            isEnabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}

function PageSkippedCard({ onRestore }: { onRestore: () => void }) {
  return (
    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
      <p className="text-xs font-bold text-amber-800">This page will be skipped</p>
      <button
        type="button"
        onClick={onRestore}
        className="px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs cursor-pointer hover:bg-amber-100 transition-colors"
      >
        Restore Page
      </button>
    </div>
  );
}

// ─── Main Birthday Creator Wizard ─────────────────────────────────────────────
export default function BirthdayCreatorWizard() {
  const [step, setStep] = useState(1);

  // Enabled / Disabled Pages map (Matches CreatorWizard.tsx)
  const [enabledPages, setEnabledPages] = useState<Record<string, boolean>>({
    chapter2_letter: true,
    chapter3_reasons: true,
    chapter4_story: true,
    chapter5_wishes: true,
    chapter6_photos: true,
    chapter7_places: true,
    chapter8_date: true,
    chapter9_song: true,
  });

  const togglePageEnabled = (pageKey: string) => {
    soundFx.playPop();
    setEnabledPages((prev) => ({
      ...prev,
      [pageKey]: !prev[pageKey],
    }));
  };

  // Geo-Pricing hook
  const { region, setRegion, plans } = usePricing();
  const [selectedPlanId, setSelectedPlanId] = useState<"month" | "year" | "lifetime">("year");
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[1] || plans[0];

  // Step 1: Basic Info
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [buttonText, setButtonText] = useState("Open my gift");
  const [birthdayAge, setBirthdayAge] = useState<string>("");
  const [birthdayDate, setBirthdayDate] = useState("");

  // Step 2: Letter
  const [letterTitle, setLetterTitle] = useState("");
  const [letterText, setLetterText] = useState(
    "Dear Birthday Star,\n\nEvery single day with you is a blessing, but today is extra special because the world was gifted your beautiful soul.\n\nMay this year bring you as much laughter, joy, and peace as you bring to everyone around you. Keep shining bright!\n\nWith all my love,\nYour Bestie 💖"
  );

  // Helper to dynamically sync recipient name into birthday letter
  const handleRecipientNameChange = (newName: string) => {
    const oldName = recipientName.trim();
    setRecipientName(newName);
    setLetterText((prev) => {
      const fallbackTarget = newName.trim() || "Birthday Star";
      if (oldName && prev.includes(`Dear ${oldName}`)) {
        return prev.replace(`Dear ${oldName}`, `Dear ${fallbackTarget}`);
      }
      return prev.replace(/^Dear (?:Birthday Star|[^\n,]+)/, `Dear ${fallbackTarget}`);
    });
  };

  // Helper to dynamically sync sender name into birthday letter
  const handleSenderNameChange = (newName: string) => {
    const oldName = senderName.trim();
    setSenderName(newName);
    setLetterText((prev) => {
      const fallbackSender = newName.trim() || "Your Bestie";
      if (oldName && prev.includes(oldName)) {
        return prev.replace(new RegExp(`With all my love,\\s*${oldName}`, "i"), `With all my love,\n${fallbackSender} 💖`);
      }
      return prev.replace(/With all my love,\s*(?:Your Bestie|[^\n💖]+)\s*💖?/i, `With all my love,\n${fallbackSender} 💖`);
    });
  };

  // Step 3: Love Reasons / Balloons
  const [loveReasons, setLoveReasons] = useState<string[]>([
    "Your contagious smile that brightens any room",
    "How you always make time for the people you care about",
    "Your unique sense of humor and warmth",
    "The kindness you show even in the small moments",
  ]);

  // Step 4: Our Story
  const [ourStory, setOurStory] = useState("");

  // Step 5: Wishes Jar
  const [wishes, setWishes] = useState<string[]>([
    "May all your wildest dreams take flight this year! 🌟",
    "Endless laughter, joyful adventures, and true peace 😄",
    "Great health, vibrant energy, and unforgettable memories 💖",
  ]);

  // Step 6: Photos
  const [photos, setPhotos] = useState<string[]>([]);

  // Step 7: Places
  const [places, setPlaces] = useState<{ name: string; emoji: string }[]>([
    { name: "Where we first met", emoji: "☕" },
    { name: "Our favorite late-night hangout", emoji: "🍕" },
  ]);
  const [placeInput, setPlaceInput] = useState("");
  const [placeEmoji, setPlaceEmoji] = useState("📍");

  // Step 8: Date
  const [ourDate, setOurDate] = useState("");

  // Step 9: Song
  const [ourSong, setOurSong] = useState("Happy Birthday Melodies");

  // Step 10: Launch, Music, PIN & Email
  const [bgMusic, setBgMusic] = useState<AudioTrackId>("romantic-lofi");
  const [enablePin, setEnablePin] = useState(false);
  const [secretPin, setSecretPin] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [sendToPartnerEmail, setSendToPartnerEmail] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [customEmailNote, setCustomEmailNote] = useState("");
  const [emailSendStatus, setEmailSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const [resendDirectEmail, setResendDirectEmail] = useState("");
  const [isSendingDirectEmail, setIsSendingDirectEmail] = useState(false);
  const [directEmailStatus, setDirectEmailStatus] = useState<string | null>(null);
  const [customSlug, setCustomSlug] = useState("");

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);

  // Audio preview playback
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleAudio = () => {
    soundFx.playPop();
    const track = AUDIO_TRACKS.find((t) => t.id === bgMusic);
    const trackSrc = track?.src || AUDIO_TRACKS[0].src;

    if (!audioPreviewRef.current) {
      const audio = new Audio(trackSrc);
      audio.loop = true;
      audioPreviewRef.current = audio;
    } else {
      audioPreviewRef.current.src = trackSrc;
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
      audioPreviewRef.current?.pause();
    };
  }, []);

  // Live Data synchronizing dynamically with every input in wizard
  const liveData: BirthdayData = useMemo(
    () => ({
      id: "live-preview",
      slug: customSlug || "preview",
      templateType: "birthday-party",
      recipientName: recipientName.trim() || "Birthday Star",
      senderName: senderName.trim() || "Your Bestie",
      buttonText: buttonText.trim() || "Open my gift",
      birthdayAge: birthdayAge ? Number(birthdayAge) : undefined,
      birthdayDate: birthdayDate || undefined,
      letterText: enabledPages.chapter2_letter
        ? letterText.trim() ||
          `Dear ${recipientName.trim() || "Birthday Star"},\n\nEvery single day with you is a blessing, but today is extra special because the world was gifted your beautiful soul.\n\nMay this year bring you as much laughter, joy, and peace as you bring to everyone around you. Keep shining bright!\n\nWith all my love,\n${senderName.trim() || "Your Bestie"} 💖`
        : "",
      letterTitle: enabledPages.chapter2_letter ? (letterTitle.trim() || undefined) : undefined,
      photos: enabledPages.chapter6_photos ? photos : [],
      ourStory: enabledPages.chapter4_story
        ? ourStory.trim() ||
          "Every chapter with you is magical...\n\nFrom the memories we made to the laughter we shared — thank you for being the sweetest part of my story! 🎁"
        : undefined,
      loveReasons: enabledPages.chapter3_reasons
        ? loveReasons.length > 0
          ? loveReasons
          : [
              "Your contagious smile that brightens any room",
              "How you always make time for the people you care about",
              "Your unique sense of humor and warmth",
              "The kindness you show even in the small moments",
            ]
        : [],
      wishes: enabledPages.chapter5_wishes
        ? wishes.length > 0
          ? wishes
          : [
              "May all your wildest dreams take flight this year! 🌟",
              "Endless laughter, joyful adventures, and true peace 😄",
              "Great health, vibrant energy, and unforgettable memories 💖",
            ]
        : [],
      ourPlaces: enabledPages.chapter7_places
        ? places.length > 0
          ? places
          : [
              { name: "Where we first met", emoji: "☕" },
              { name: "Our favorite late-night hangout", emoji: "🍕" },
            ]
        : [],
      ourDate: enabledPages.chapter8_date ? (ourDate || undefined) : undefined,
      ourSong: enabledPages.chapter9_song ? (ourSong.trim() || "Happy Birthday Melodies") : undefined,
      bgMusic,
      hasPasscode: enablePin && !!secretPin,
      passcodeHash: secretPin,
      isPaid: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    }),
    [
      customSlug,
      recipientName,
      senderName,
      buttonText,
      birthdayAge,
      birthdayDate,
      letterText,
      letterTitle,
      photos,
      ourStory,
      loveReasons,
      wishes,
      places,
      ourDate,
      ourSong,
      bgMusic,
      enablePin,
      secretPin,
      enabledPages,
    ]
  );

  const goToStep = (s: number) => {
    soundFx.playPop();
    setStep(Math.max(1, Math.min(s, 10)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    goToStep(step + 1);
  };

  const goPrev = () => {
    goToStep(step - 1);
  };

  const siteUrl = `${
    typeof window !== "undefined" ? window.location.origin : "https://lovedrop.online"
  }/birthday/${createdSlug}`;

  const handlePublish = async () => {
    setIsPublishing(true);
    soundFx.playPop();

    let pinHash: string | undefined;
    if (enablePin && secretPin) {
      pinHash = await hashPasscode(secretPin);
    }

    const finalSlug = customSlug.trim()
      ? customSlug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/, "")
      : generateSecureSlug(recipientName || "Birthday", senderName || "Party");

    const finalRecipient = sanitizeInput(recipientName.trim()) || "Birthday Star";
    const finalSender = sanitizeInput(senderName.trim()) || "Your Bestie";
    const finalLetter =
      sanitizeInput(letterText.trim()) ||
      `Dear ${finalRecipient},\n\nEvery single day with you is a blessing, but today is extra special because the world was gifted your beautiful soul.\n\nMay this year bring you as much laughter, joy, and peace as you bring to everyone around you. Keep shining bright!\n\nWith all my love,\n${finalSender} 💖`;

    const birthdayPayload: BirthdayData = {
      id: "bday-" + Date.now(),
      slug: finalSlug,
      templateType: "birthday-party",
      recipientName: finalRecipient,
      senderName: finalSender,
      buttonText: sanitizeInput(buttonText.trim()) || "Open my gift",
      birthdayAge: birthdayAge ? Number(birthdayAge) : undefined,
      birthdayDate: birthdayDate || undefined,
      letterText: finalLetter,
      letterTitle: letterTitle.trim() || undefined,
      photos: photos.slice(0, MAX_LIMITS.PHOTOS),
      ourStory: ourStory.trim() || undefined,
      loveReasons:
        loveReasons.length > 0
          ? loveReasons.slice(0, MAX_LIMITS.REASONS)
          : [
              "Your contagious smile that brightens any room",
              "How you always make time for the people you care about",
              "Your unique sense of humor and warmth",
              "The kindness you show even in the small moments",
            ],
      wishes:
        wishes.length > 0
          ? wishes.slice(0, MAX_LIMITS.WISHES)
          : [
              "May all your wildest dreams take flight this year! 🌟",
              "Endless laughter, joyful adventures, and true peace 😄",
              "Great health, vibrant energy, and unforgettable memories 💖",
            ],
      ourPlaces:
        places.length > 0
          ? places.slice(0, MAX_LIMITS.PLACES)
          : [
              { name: "Where we first met", emoji: "☕" },
              { name: "Our favorite late-night hangout", emoji: "🍕" },
            ],
      ourDate: ourDate || undefined,
      ourSong: ourSong.trim() || "Happy Birthday Melodies",
      bgMusic,
      hasPasscode: enablePin && !!secretPin,
      passcodeHash: pinHash,
      creatorEmail: creatorEmail.trim() || undefined,
      isPaid: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Save to localStorage
    const storageKey = `birthday_v1_${finalSlug}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(birthdayPayload));
    } catch {
      /* ignore */
    }

    // Persist to API backend & dispatch Resend email if provided
    if (creatorEmail.trim() || (sendToPartnerEmail && partnerEmail.trim())) {
      setEmailSendStatus("sending");
    }

    let savedSlug = finalSlug;
    try {
      const res = await fetch("/api/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...birthdayPayload,
          passcode: enablePin ? secretPin : undefined,
          customMessage: customEmailNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        if (data.slug) {
          savedSlug = data.slug;
          try {
            localStorage.setItem(`birthday_v1_${savedSlug}`, JSON.stringify({ ...birthdayPayload, slug: savedSlug }));
          } catch { /* ignore */ }
        }
        if (creatorEmail.trim() || (sendToPartnerEmail && partnerEmail.trim())) {
          setEmailSendStatus("sent");
          setEmailStatusMessage("💌 Birthday surprise saved & sent via Resend successfully!");
        }
      }
    } catch {
      /* API might be offline, localStorage fallback works reliably */
    }

    setCreatedSlug(savedSlug);
    setIsCreated(true);
    setIsPublishing(false);
    soundFx.playSuccessChime();

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#FF2E63", "#FFB3C6", "#FFD166", "#C084FC", "#34D399"],
    });
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
          recipientName: recipientName.trim() || "Birthday Star",
          senderName: senderName.trim() || "Someone Special",
          siteUrl: siteUrl,
          passcode: enablePin ? secretPin : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDirectEmailStatus("✅ Email sent successfully via Resend!");
      } else {
        setDirectEmailStatus(`❌ ${data.error || "Failed to send email"}`);
      }
    } catch (err: any) {
      setDirectEmailStatus(`❌ ${err.message || "Network error"}`);
    } finally {
      setIsSendingDirectEmail(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] text-slate-800 ${
        isCreated ? "pb-8" : "pb-28"
      } selection:bg-pink-100 selection:text-pink-600`}
    >
      {/* =================================================================== */}
      {/* TOP NAVIGATION BAR (Identical to Classic Romance)                   */}
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
              {isCreated ? "SURPRISE READY 🎉" : `PAGE ${step} OF 10`}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {isCreated ? "Birthday Website Created Successfully" : STEP_TITLES[step - 1]}
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

        {/* 10-Step Progress Track with Clickable Segment Pills */}
        {!isCreated && (
          <div className="max-w-2xl mx-auto pt-2 pb-0.5">
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => {
                const isCurrent = step === s;
                const isCompleted = step > s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => goToStep(s)}
                    className="flex-1 py-1 group flex flex-col items-center cursor-pointer"
                    title={`Jump to Page ${s}: ${STEP_TITLES[s - 1]}`}
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

      {/* =================================================================== */}
      {/* MAIN CONTENT AREA: 2-COLUMN (FORM ON LEFT, STICKY PHONE ON RIGHT)   */}
      {/* =================================================================== */}
      <main
        className={`max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 ${
          isCreated ? "flex items-center justify-center min-h-[calc(100vh-140px)]" : ""
        }`}
      >
        <div
          className={
            isCreated
              ? "w-full max-w-xl mx-auto"
              : "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          }
        >
          {/* =============================================================== */}
          {/* LEFT COLUMN: FORM CONTROLS                                      */}
          {/* =============================================================== */}
          <div className={isCreated ? "w-full" : "lg:col-span-7 xl:col-span-7 space-y-6"}>
            <AnimatePresence mode="wait">
              {/* Published Success Screen */}
              {isCreated ? (
                <motion.div
                  key="created-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-200 shadow-xl text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Your Birthday Surprise is Ready to Send! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Send the link directly to {recipientName || "the birthday star"} via WhatsApp
                    or Instagram.
                  </p>

                  {/* URL Display Card */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-pink-50/90 via-white to-rose-50/70 border-2 border-pink-200/90 text-left space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF2E63] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Private Birthday Website Link</span>
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active &amp; Ready</span>
                      </span>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-pink-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF2E63] flex items-center justify-center shrink-0 border border-pink-100">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="text-xs sm:text-sm font-semibold truncate leading-tight select-all">
                          <span className="text-slate-400 font-medium">lovedrop.online/birthday/</span>
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
                      Share this private link with{" "}
                      <strong className="text-slate-700 font-bold">{recipientName || "them"}</strong>!
                    </p>
                  </div>

                  {/* Share buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Hey ${recipientName}! 🎂 I made a special birthday website just for you: ${siteUrl}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Share on WhatsApp</span>
                    </a>

                    <Link
                      href={`/birthday/${createdSlug}`}
                      target="_blank"
                      className="py-3 px-4 rounded-2xl bg-white hover:bg-pink-50 text-slate-800 border border-pink-200 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-transform active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4 text-[#FF2E63]" />
                      <span>Open &amp; Test Website</span>
                    </Link>
                  </div>

                  {/* Email Delivery Card */}
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-rose-50/80 border border-pink-200/90 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-[#FF2E63]" />
                        <span>Send or Resend via Email</span>
                      </span>
                      {emailSendStatus === "sent" && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Email Sent ✓
                        </span>
                      )}
                    </div>

                    {emailStatusMessage && (
                      <div className="p-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {emailStatusMessage}
                      </div>
                    )}

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
                </motion.div>
              ) : (
                /* Step Form Content */
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {/* Step 1: Basic Info */}
                  {step === 1 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 1 • Intro Screen
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Who is this surprise for?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          They will see their name appear in an animated greeting with festive birthday music & 3D cake.
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
                            {["Birthday Star", "Bestie", "My Love", "Babe", "Buddy", "Sweetheart"].map((p) => (
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

                        {/* Button Label on Greeting Card */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Button Label on Greeting Card
                          </label>
                          <input
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="e.g. Let's Go"
                            className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                          />
                        </div>

                        {/* Visual Theme Picker (2x3 Grid) */}
                        <div className="pt-2">
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            Choose Visual Theme
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { id: "birthday-party", name: "Birthday Party", accent: "#FF2E63", isCurrent: true },
                              { id: "classic-romance", name: "Classic Romance", accent: "#FF2E63", href: "/create" },
                              { id: "first-love", name: "First Love", accent: "#00B894", href: "/create?theme=first-love" },
                              { id: "minimalist-love", name: "Minimalist Love", accent: "#6C5CE7", href: "/create?theme=minimalist-love" },
                              { id: "eternal-vows", name: "Eternal Vows", accent: "#D63031", href: "/create?theme=eternal-vows" },
                              { id: "garden-of-love", name: "Garden of Love", accent: "#00A86B", href: "/create?theme=garden-of-love" },
                            ].map((thm) =>
                              thm.isCurrent ? (
                                <div
                                  key={thm.id}
                                  className="p-3 rounded-2xl border text-left flex items-center gap-2.5 border-[#FF2E63] bg-pink-50/60 shadow-xs ring-2 ring-[#FF2E63]/20 cursor-default"
                                >
                                  <span
                                    className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                                    style={{ backgroundColor: thm.accent }}
                                  />
                                  <span className="text-xs font-bold text-slate-800 truncate">
                                    {thm.name}
                                  </span>
                                </div>
                              ) : (
                                <Link
                                  key={thm.id}
                                  href={thm.href || "/create"}
                                  onClick={() => soundFx.playPop()}
                                  className="p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 border-slate-200 hover:border-pink-300 bg-white"
                                >
                                  <span
                                    className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                                    style={{ backgroundColor: thm.accent }}
                                  />
                                  <span className="text-xs font-bold text-slate-800 truncate">
                                    {thm.name}
                                  </span>
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: The Letter */}
                  {step === 2 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 2 • Wax-Sealed Letter
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Write a Heartfelt Birthday Letter
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Tucked inside a realistic envelope with a dead-center wax seal that pops
                          open with a typewriter animation.
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="Wax-Sealed Letter"
                        isEnabled={enabledPages.chapter2_letter}
                        onToggle={() => togglePageEnabled("chapter2_letter")}
                      />

                      {enabledPages.chapter2_letter ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Letter Heading (Optional)
                            </label>
                            <input
                              type="text"
                              value={letterTitle}
                              onChange={(e) => setLetterTitle(e.target.value)}
                              placeholder="e.g. A letter for you, Happy 21st Birthday Sunshine!"
                              maxLength={80}
                              className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Your Message *
                            </label>
                            <textarea
                              value={letterText}
                              onChange={(e) => setLetterText(e.target.value)}
                              placeholder="Write your heartfelt birthday wishes..."
                              rows={8}
                              maxLength={2500}
                              className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-medium text-slate-800 bg-pink-50/20 resize-none leading-relaxed"
                            />
                            <p className="text-[11px] text-right text-slate-400 mt-1 font-semibold">
                              {letterText.length}/2500 characters
                            </p>
                          </div>
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter2_letter")} />
                      )}
                    </>
                  )}

                  {/* Step 3: What I Love / Balloons */}
                  {step === 3 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 3 • Colorful Balloons
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Reasons You&apos;re Special
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Add things you adore about them. Each balloon pops interactively to reveal
                          your compliment!
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="Balloons & Reasons"
                        isEnabled={enabledPages.chapter3_reasons}
                        onToggle={() => togglePageEnabled("chapter3_reasons")}
                      />

                      {enabledPages.chapter3_reasons ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <ListEditor
                            items={loveReasons}
                            onChange={setLoveReasons}
                            placeholder="e.g. Your bright smile, Your warm heart..."
                            max={MAX_LIMITS.REASONS}
                            emoji="🎈"
                          />
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter3_reasons")} />
                      )}
                    </>
                  )}

                  {/* Step 4: Our Story */}
                  {step === 4 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 4 • Storybook
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Our Shared Memories &amp; Story
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Share your journey, adventures, inside jokes, and how your bond grew over
                          time.
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="Storybook"
                        isEnabled={enabledPages.chapter4_story}
                        onToggle={() => togglePageEnabled("chapter4_story")}
                      />

                      {enabledPages.chapter4_story ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <textarea
                            value={ourStory}
                            onChange={(e) => setOurStory(e.target.value)}
                            placeholder={`Every chapter with you is magical...\n\nFrom the memories we made to the laughter we shared — thank you for being the sweetest part of my story! 🎁`}
                            rows={8}
                            maxLength={2000}
                            className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-medium text-slate-800 bg-pink-50/20 resize-none leading-relaxed"
                          />
                          <p className="text-[11px] text-right text-slate-400 mt-1 font-semibold">
                            {ourStory.length}/2000 characters
                          </p>
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter4_story")} />
                      )}
                    </>
                  )}

                  {/* Step 5: Wishes Jar */}
                  {step === 5 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 5 • Magical Star Jar
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Wishes for the New Year
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Each tap on the star jar releases a glowing golden wish for their year
                          ahead.
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="Magical Star Jar"
                        isEnabled={enabledPages.chapter5_wishes}
                        onToggle={() => togglePageEnabled("chapter5_wishes")}
                      />

                      {enabledPages.chapter5_wishes ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <ListEditor
                            items={wishes}
                            onChange={setWishes}
                            placeholder="e.g. Endless laughter and peace..."
                            max={MAX_LIMITS.WISHES}
                            emoji="⭐"
                          />
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter5_wishes")} />
                      )}
                    </>
                  )}

                  {/* Step 6: Moments / Photo Gallery */}
                  {step === 6 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 6 • Photo Booth
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Photo Booth Memories
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Upload up to 10 photos of your happiest moments together.
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="Photo Booth"
                        isEnabled={enabledPages.chapter6_photos}
                        onToggle={() => togglePageEnabled("chapter6_photos")}
                      />

                      {enabledPages.chapter6_photos ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <PhotoUploader photos={photos} onChange={setPhotos} max={MAX_LIMITS.PHOTOS} />
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter6_photos")} />
                      )}
                    </>
                  )}

                  {/* Step 7: Our Places */}
                  {step === 7 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 7 • Memory Map
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Special Places Together
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Mark the cities, cafes, or spots where unforgettable memories happened.
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="Memory Map & Places"
                        isEnabled={enabledPages.chapter7_places}
                        onToggle={() => togglePageEnabled("chapter7_places")}
                      />

                      {enabledPages.chapter7_places ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={placeEmoji}
                              onChange={(e) => setPlaceEmoji(e.target.value.slice(-2))}
                              maxLength={2}
                              className="w-14 px-2 py-3 rounded-2xl border border-pink-200 text-center text-xl outline-none focus:border-[#FF2E63] bg-pink-50/20"
                              placeholder="📍"
                            />
                            <input
                              type="text"
                              value={placeInput}
                              onChange={(e) => setPlaceInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  placeInput.trim() &&
                                  places.length < MAX_LIMITS.PLACES
                                ) {
                                  setPlaces((prev) => [
                                    ...prev,
                                    { name: placeInput.trim(), emoji: placeEmoji || "📍" },
                                  ]);
                                  setPlaceInput("");
                                  soundFx.playPop();
                                }
                              }}
                              placeholder="e.g. Our favorite cafe, Road trip to the hills..."
                              maxLength={80}
                              className="flex-1 px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (placeInput.trim() && places.length < MAX_LIMITS.PLACES) {
                                  setPlaces((prev) => [
                                    ...prev,
                                    { name: placeInput.trim(), emoji: placeEmoji || "📍" },
                                  ]);
                                  setPlaceInput("");
                                  soundFx.playPop();
                                }
                              }}
                              disabled={!placeInput.trim() || places.length >= MAX_LIMITS.PLACES}
                              className="px-5 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 shrink-0"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              <span className="text-xs font-bold">Add</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {places.map((place, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-pink-50/40 border border-pink-100 shadow-2xs"
                              >
                                <span className="text-xl">{place.emoji}</span>
                                <p className="flex-1 text-xs sm:text-sm font-semibold text-slate-800">
                                  {place.name}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundFx.playPop();
                                    setPlaces((prev) => prev.filter((_, idx) => idx !== i));
                                  }}
                                  className="w-6 h-6 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter7_places")} />
                      )}
                    </>
                  )}

                  {/* Step 8: Special Date */}
                  {step === 8 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 8 • 3D Calendar
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          A Date to Keep
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          A milestone date that shows up prominently on a 3D calendar flip.
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="3D Calendar Date"
                        isEnabled={enabledPages.chapter8_date}
                        onToggle={() => togglePageEnabled("chapter8_date")}
                      />

                      {enabledPages.chapter8_date ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Choose Special Date
                            </label>
                            <input
                              type="date"
                              value={ourDate}
                              onChange={(e) => setOurDate(e.target.value)}
                              className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                            />
                          </div>
                          <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-[#FF2E63] shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                              This can be their birth date, the day you first met, or any milestone
                              you want to celebrate.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter8_date")} />
                      )}
                    </>
                  )}

                  {/* Step 9: Our Song */}
                  {step === 9 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 9 • Vinyl Record
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Our Song &amp; Melodies
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Name a special track that shows up spinning on the retro vinyl turntable.
                        </p>
                      </div>

                      {/* Page Toggle */}
                      <PageToggleBanner
                        title="Vinyl Record & Song"
                        isEnabled={enabledPages.chapter9_song}
                        onToggle={() => togglePageEnabled("chapter9_song")}
                      />

                      {enabledPages.chapter9_song ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Song Title &amp; Artist
                            </label>
                            <input
                              type="text"
                              value={ourSong}
                              onChange={(e) => setOurSong(e.target.value)}
                              placeholder="e.g. Perfect by Ed Sheeran, Tum Hi Ho, Happy Birthday..."
                              maxLength={100}
                              className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-[#FF2E63] focus:ring-2 focus:ring-pink-100 outline-none text-sm font-semibold text-slate-800 bg-pink-50/20"
                            />
                          </div>
                        </div>
                      ) : (
                        <PageSkippedCard onRestore={() => togglePageEnabled("chapter9_song")} />
                      )}
                    </>
                  )}

                  {/* Step 10: Launch, Pricing, PIN & Music */}
                  {step === 10 && (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500">
                          Chapter 10 • Audio, Security &amp; Launch
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          Final Touches &amp; Publish
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Choose background audio, optional PIN security, duration and publish your
                          gift website!
                        </p>
                      </div>

                      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-6">
                        {/* Audio track selection */}
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                            Select Background Music:
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            {AUDIO_TRACKS.map((track) => (
                              <button
                                key={track.id}
                                type="button"
                                onClick={() => {
                                  soundFx.playPop();
                                  setBgMusic(track.id);
                                  if (audioPreviewRef.current) {
                                    audioPreviewRef.current.src = track.src;
                                    if (isAudioPlaying) {
                                      audioPreviewRef.current.play().catch(() => {});
                                    }
                                  }
                                }}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                  bgMusic === track.id
                                    ? "bg-pink-50/70 border-[#FF2E63] ring-2 ring-pink-300/40"
                                    : "bg-white border-slate-200 hover:border-pink-200"
                                }`}
                              >
                                <span className="text-2xl block mb-1">{track.emoji}</span>
                                <span className="text-xs font-bold text-slate-800 block">
                                  {track.name}
                                </span>
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={toggleAudio}
                            className="mt-3 w-full py-2.5 rounded-xl border border-pink-200 text-xs font-bold text-[#FF2E63] flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors cursor-pointer"
                          >
                            {isAudioPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Pause Audio Preview</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span>Preview Background Audio</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Secret PIN Passcode Protection */}
                        <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100/90 space-y-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Lock className="w-3.5 h-3.5 text-[#FF2E63] shrink-0" />
                                <span className="text-xs font-bold text-slate-800">
                                  Secret Passcode Protection
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                  Optional • Default OFF
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">
                                By default, your friend can open the link directly with 1 tap (no
                                PIN). Turn ON only if you want secret date/PIN lock.
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
                            <div className="pt-2 border-t border-pink-100/80 space-y-1.5">
                              <label className="block text-[11px] font-bold text-slate-700">
                                Set 4-Digit Secret PIN:
                              </label>
                              <input
                                type="password"
                                maxLength={4}
                                value={secretPin}
                                onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, ""))}
                                placeholder="e.g. 1508"
                                className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 text-xs font-mono font-bold tracking-widest text-slate-800 outline-none focus:border-[#FF2E63] bg-white text-center"
                              />
                            </div>
                          )}
                        </div>

                        {/* Email Delivery Settings (Resend) */}
                        <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-pink-100/90 space-y-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Mail className="w-3.5 h-3.5 text-[#FF2E63] shrink-0" />
                            <span className="text-xs font-bold text-slate-800">
                              Email Delivery &amp; Backup
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-[#FF2E63]">
                              Recommended
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            Receive your private website link and backup directly in your inbox.
                          </p>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Your Email Address:
                            </label>
                            <input
                              type="email"
                              value={creatorEmail}
                              onChange={(e) => setCreatorEmail(e.target.value)}
                              placeholder="youremail@example.com"
                              className="w-full px-4 py-3 rounded-2xl border border-pink-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#FF2E63] bg-pink-50/20"
                            />
                          </div>
                        </div>

                        {/* Custom URL Slug */}
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                            Custom Website Link (Optional):
                          </label>
                          <div className="flex items-center gap-1 px-3.5 py-3 rounded-2xl border border-pink-200 bg-pink-50/20 focus-within:border-[#FF2E63] focus-within:bg-white transition-colors">
                            <span className="text-xs text-slate-400 font-medium shrink-0">
                              lovedrop.online/birthday/
                            </span>
                            <input
                              type="text"
                              value={customSlug}
                              onChange={(e) =>
                                setCustomSlug(
                                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                                )
                              }
                              placeholder={`${
                                recipientName.toLowerCase().replace(/\s+/g, "") || "name"
                              }-bday`}
                              maxLength={30}
                              className="flex-1 text-xs font-bold outline-none bg-transparent text-[#FF2E63]"
                            />
                          </div>
                        </div>

                        {/* Access Duration & Pricing Selector */}
                        <div className="space-y-3 pt-1">
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
                                    ? "bg-white text-[#FF2E63] shadow-2xs font-extrabold"
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
                                    ? "bg-white text-[#FF2E63] shadow-2xs font-extrabold"
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
                                      : "bg-white/80 border-slate-200 hover:border-pink-200"
                                  }`}
                                >
                                  {p.popular && (
                                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FF2E63] text-[9px] font-black text-white uppercase tracking-wider shadow-xs">
                                      POPULAR
                                    </span>
                                  )}
                                  <div className="space-y-0.5 pt-1">
                                    <p className="text-xs font-bold text-slate-800">{p.name}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                      {p.duration}
                                    </p>
                                  </div>
                                  <div className="pt-2">
                                    <p className="text-sm sm:text-base font-black text-[#FF2E63]">
                                      {p.priceFormatted}
                                    </p>
                                    <p className="text-[10px] line-through text-slate-400">
                                      {p.originalPriceFormatted}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Final Launch Button */}
                          <div className="pt-3">
                            <button
                              type="button"
                              disabled={isPublishing}
                              onClick={handlePublish}
                              className="w-full py-4 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-base shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                            >
                              {isPublishing ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Publishing your birthday surprise...</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-lg">🎂</span>
                                  <span>
                                    Send Birthday Surprise — {currentPlan.priceFormatted}
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: STICKY REALISTIC LIVE PHONE PREVIEW               */}
          {/* =============================================================== */}
          {!isCreated && (
            <div className="lg:col-span-5 xl:col-span-5 flex justify-center sticky top-20">
              <BirthdayPreviewCard
                currentStep={step}
                data={liveData}
                onStepChange={(newStep) => goToStep(newStep)}
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
            {step}/10
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
              <BirthdayPreviewCard
                currentStep={step}
                data={liveData}
                onStepChange={(newStep) => {
                  goToStep(newStep);
                  setShowMobilePreviewModal(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* STICKY BOTTOM NAVIGATION BAR (Identical to Classic Romance)        */}
      {/* =================================================================== */}
      {!isCreated && (
        <footer className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 p-3 sm:p-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={goPrev}
                className="px-5 py-3 rounded-full border border-pink-200 text-slate-700 bg-white hover:bg-pink-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF2E63]" />
                <span>Previous</span>
              </button>
            ) : (
              <Link
                href="/"
                className="px-5 py-3 rounded-full border border-pink-200 text-slate-700 bg-white hover:bg-pink-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF2E63]" />
                <span>Back to Home</span>
              </Link>
            )}

            <div className="text-center hidden sm:block">
              <span className="text-[11px] font-semibold text-slate-400">
                Step {step} of 10 • All changes auto-saved
              </span>
            </div>

            {step < 10 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-7 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Continue to Page {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublish}
                className="px-8 py-3 rounded-full bg-[#FF2E63] hover:bg-[#E02656] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Launch Birthday Surprise</span>
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
