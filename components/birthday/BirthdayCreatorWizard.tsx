"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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
  Gift,
} from "lucide-react";
import { BirthdayData, AudioTrackId } from "@/lib/types";
import { compressImageToBlob } from "@/lib/imageCompress";
import { generateSecureSlug, hashPasscode, sanitizeInput } from "@/lib/security";
import { soundFx } from "@/lib/soundFx";

// ─── Constants ────────────────────────────────────────────────────────────────
const BD_PINK = "#FF6B9D";
const BD_PURPLE = "#C084FC";
const BD_GRADIENT = `linear-gradient(135deg, ${BD_PINK} 0%, #E8527A 100%)`;

const MAX = {
  PHOTOS: 10,
  REASONS: 9,
  WISHES: 9,
  PLACES: 6,
};

const AUDIO_TRACKS: { id: AudioTrackId; name: string; emoji: string; src: string }[] = [
  { id: "romantic-lofi", name: "Romantic Lofi", emoji: "🎵", src: "/music/love-bgm.mp3?v=2" },
  { id: "summer-guitar", name: "Summer Guitar", emoji: "🎸", src: "/music/summer-gouyad-5.mp3?v=2" },
];

const STEPS = [
  { id: 1, title: "Basic Info", icon: "🎂", desc: "Names & birthday details" },
  { id: 2, title: "The Letter", icon: "💌", desc: "Write a heartfelt message" },
  { id: 3, title: "What I Love", icon: "💖", desc: "Reasons you love them" },
  { id: 4, title: "Our Story", icon: "📖", desc: "Your shared memories" },
  { id: 5, title: "Wishes", icon: "⭐", desc: "Birthday wishes in a jar" },
  { id: 6, title: "Moments", icon: "📸", desc: "Upload your photos" },
  { id: 7, title: "Our Places", icon: "🗺️", desc: "Special places together" },
  { id: 8, title: "Special Date", icon: "📅", desc: "A date to remember" },
  { id: 9, title: "Our Song", icon: "🎵", desc: "Your special song" },
  { id: 10, title: "Music & Launch", icon: "🚀", desc: "Finish & publish" },
];

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full transition-all duration-300"
          style={{
            background:
              i < step - 1
                ? BD_PINK
                : i === step - 1
                ? `linear-gradient(90deg, ${BD_PINK}, ${BD_PURPLE})`
                : "#F3F4F6",
          }}
        />
      ))}
    </div>
  );
}

// ─── Photo Upload Component ───────────────────────────────────────────────────
function PhotoUploader({
  photos,
  onChange,
  max = MAX.PHOTOS,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || photos.length >= max) return;
    setIsCompressing(true);
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
          reader.onload = () => { results.push(reader.result as string); res(); };
          reader.readAsDataURL(file);
        });
      }
    }

    onChange([...photos, ...results]);
    setIsCompressing(false);
  };

  return (
    <div className="space-y-3">
      {/* Upload button */}
      {photos.length < max && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all"
          style={{ borderColor: "#FFB3CC", background: "#FFF5F9" }}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => e.preventDefault()}>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />
          {isCompressing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-pink-500 font-medium">Compressing...</p>
            </div>
          ) : (
            <>
              <Camera className="w-8 h-8 mb-2" style={{ color: BD_PINK }} />
              <p className="text-sm font-bold" style={{ color: BD_PINK }}>Upload Photos</p>
              <p className="text-xs text-gray-400 mt-1">{photos.length}/{max} photos</p>
            </>
          )}
        </label>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-2">
        <AnimatePresence>
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => onChange(photos.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── List Editor (for reasons, wishes, places) ────────────────────────────────
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
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          maxLength={120}
          className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none"
          style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
        />
        <button
          onClick={add}
          disabled={!input.trim() || items.length >= max}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
          style={{ background: BD_GRADIENT }}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: "#FFF5F9" }}
          >
            <span className="text-lg">{emoji}</span>
            <p className="flex-1 text-sm font-medium" style={{ color: "#1E1B2E" }}>{item}</p>
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-400 transition-colors" />
            </button>
          </motion.div>
        ))}
      </div>

      {items.length > 0 && (
        <p className="text-xs text-center text-gray-400">{items.length}/{max} items</p>
      )}
    </div>
  );
}

// ─── Main Birthday Creator Wizard ─────────────────────────────────────────────
export default function BirthdayCreatorWizard() {
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [birthdayAge, setBirthdayAge] = useState<string>("");
  const [birthdayDate, setBirthdayDate] = useState("");

  // Step 2: Letter
  const [letterTitle, setLetterTitle] = useState("");
  const [letterText, setLetterText] = useState("");

  // Step 3: Love Reasons
  const [loveReasons, setLoveReasons] = useState<string[]>([]);

  // Step 4: Our Story
  const [ourStory, setOurStory] = useState("");

  // Step 5: Wishes
  const [wishes, setWishes] = useState<string[]>([]);

  // Step 6: Photos
  const [photos, setPhotos] = useState<string[]>([]);

  // Step 7: Places
  const [places, setPlaces] = useState<{ name: string; emoji: string }[]>([]);
  const [placeInput, setPlaceInput] = useState("");
  const [placeEmoji, setPlaceEmoji] = useState("📍");

  // Step 8: Date
  const [ourDate, setOurDate] = useState("");

  // Step 9: Song
  const [ourSong, setOurSong] = useState("");

  // Step 10: Music & Launch
  const [bgMusic, setBgMusic] = useState<AudioTrackId>("romantic-lofi");
  const [enablePin, setEnablePin] = useState(false);
  const [secretPin, setSecretPin] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [customSlug, setCustomSlug] = useState("");

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio preview
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleAudio = () => {
    soundFx.playPop();
    if (!audioPreviewRef.current) {
      const track = AUDIO_TRACKS.find((t) => t.id === bgMusic);
      audioPreviewRef.current = new Audio(track?.src || AUDIO_TRACKS[0].src);
      audioPreviewRef.current.loop = true;
    }
    if (isAudioPlaying) {
      audioPreviewRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioPreviewRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false));
    }
  };

  useEffect(() => () => { audioPreviewRef.current?.pause(); }, []);

  // Auto-fill letter defaults
  useEffect(() => {
    if (!letterText && recipientName) {
      setLetterText(
        `Dear ${recipientName},\n\nOn your special day, I want you to know just how much you mean to me. You bring so much joy and love into my life every single day.\n\nHappy Birthday! 🎂\n\nWith all my love,\n${senderName || "Me"} 💖`
      );
    }
  }, [recipientName]);

  const goNext = () => {
    soundFx.playPop();
    setStep((s) => Math.min(s + 1, 10));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    soundFx.playPop();
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canGoNext = () => {
    if (step === 1) return recipientName.trim().length >= 2 && senderName.trim().length >= 2;
    if (step === 2) return letterText.trim().length >= 20;
    return true;
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    soundFx.playPop();

    let pinHash: string | undefined;
    if (enablePin && secretPin) {
      pinHash = await hashPasscode(secretPin);
    }

    const slug = (customSlug.trim()
      ? customSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/, "")
      : generateSecureSlug(recipientName || "Birthday", senderName || "Love")
    );

    const birthdayPayload: BirthdayData = {
      id: "bday-" + Date.now(),
      slug,
      templateType: "birthday-party",
      recipientName: sanitizeInput(recipientName.trim()),
      senderName: sanitizeInput(senderName.trim()),
      birthdayAge: birthdayAge ? Number(birthdayAge) : undefined,
      birthdayDate: birthdayDate || undefined,
      letterText: sanitizeInput(letterText.trim()),
      letterTitle: letterTitle.trim() || undefined,
      photos: photos.slice(0, MAX.PHOTOS),
      ourStory: ourStory.trim() || undefined,
      loveReasons: loveReasons.slice(0, MAX.REASONS),
      wishes: wishes.slice(0, MAX.WISHES),
      ourPlaces: places.slice(0, MAX.PLACES),
      ourDate: ourDate || undefined,
      ourSong: ourSong.trim() || undefined,
      bgMusic,
      whatsappNumber: whatsappNumber.trim() || undefined,
      whatsappMessage: `Happy Birthday ${recipientName}! I made something special for you 🎂`,
      hasPasscode: enablePin && !!secretPin,
      passcodeHash: pinHash,
      creatorEmail: creatorEmail.trim() || undefined,
      isPaid: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Save to localStorage
    const storageKey = `birthday_v1_${slug}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(birthdayPayload));
    } catch { /* ignore */ }

    // POST to API
    try {
      await fetch("/api/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthdayPayload),
      });
    } catch { /* API might not exist yet — localStorage fallback handles it */ }

    setCreatedSlug(slug);
    setIsCreated(true);
    setIsPublishing(false);

    confetti({
      particleCount: 120,
      spread: 80,
      colors: ["#FF6B9D", "#C084FC", "#FFD700", "#FF4081"],
      origin: { y: 0.5 },
    });
  };

  const siteUrl = `${typeof window !== "undefined" ? window.location.origin : "https://lovedrop.online"}/birthday/${createdSlug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopiedLink(true);
      soundFx.playPop();
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // ─── Success Screen ───────────────────────────────────────────────────────
  if (isCreated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FFD6EC 100%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-6 text-center"
        >
          <div className="text-7xl">🎂</div>
          <div>
            <h2 className="text-3xl font-black" style={{ color: "#1E1B2E" }}>
              Birthday Surprise Ready! 🎉
            </h2>
            <p className="text-sm mt-2" style={{ color: "#9B8FAB" }}>
              Share this magical link with {recipientName}
            </p>
          </div>

          {/* Link box */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Your Link</p>
            <p className="text-sm font-mono break-all" style={{ color: "#FF6B9D" }}>{siteUrl}</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={copyLink}
              className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: copiedLink ? "#22C55E" : BD_GRADIENT }}
              whileTap={{ scale: 0.96 }}
            >
              {copiedLink ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
            </motion.button>

            <motion.a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2"
              style={{ borderColor: BD_PINK, color: BD_PINK }}
              whileTap={{ scale: 0.96 }}
            >
              <ExternalLink className="w-4 h-4" /> Preview
            </motion.a>
          </div>

          <button onClick={() => { setIsCreated(false); setStep(1); }}
            className="text-sm text-gray-400 underline">
            Create another
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Step Renderer ────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── Step 1: Basic Info ──────────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                Birthday Person's Name *
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Priya, Sarah, Arjun..."
                maxLength={50}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm font-medium outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                Your Name (the sender) *
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Rahul, Me, Your bestie..."
                maxLength={50}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm font-medium outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                  Age (optional)
                </label>
                <input
                  type="number"
                  value={birthdayAge}
                  onChange={(e) => setBirthdayAge(e.target.value)}
                  placeholder="21"
                  min={1} max={120}
                  className="w-full px-4 py-3.5 rounded-2xl border text-sm font-medium outline-none"
                  style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                  Birthday Date
                </label>
                <input
                  type="date"
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border text-sm font-medium outline-none"
                  style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
                />
              </div>
            </div>
          </div>
        );

      // ── Step 2: Letter ──────────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                Letter Heading (optional)
              </label>
              <input
                type="text"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                placeholder="e.g. To my sunshine, Happy 21st!"
                maxLength={80}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                Birthday Letter *
              </label>
              <textarea
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder="Write your heartfelt birthday message here..."
                rows={9}
                maxLength={2000}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none resize-none leading-relaxed"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
              <p className="text-xs text-right text-gray-400 mt-1">{letterText.length}/2000</p>
            </div>
          </div>
        );

      // ── Step 3: Love Reasons ────────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "#9B8FAB" }}>
              Add up to {MAX.REASONS} things you love about {recipientName || "them"}. These appear in the claw machine! 🎯
            </p>
            <ListEditor
              items={loveReasons}
              onChange={setLoveReasons}
              placeholder={`e.g. Your beautiful smile, The way you laugh...`}
              max={MAX.REASONS}
              emoji="💖"
            />
          </div>
        );

      // ── Step 4: Our Story ───────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "#9B8FAB" }}>
              Tell the story of your friendship / relationship. This appears in a beautiful story book.
            </p>
            <textarea
              value={ourStory}
              onChange={(e) => setOurStory(e.target.value)}
              placeholder={`Every chapter of our story is special...\n\nFrom the day we met to all the adventures we've had together, every moment has been a gift.\n\nThank you for being part of my story, ${recipientName || "you"}! 🎁`}
              rows={9}
              maxLength={1500}
              className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none resize-none leading-relaxed"
              style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
            />
            <p className="text-xs text-right text-gray-400">{ourStory.length}/1500</p>
          </div>
        );

      // ── Step 5: Wishes ──────────────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "#9B8FAB" }}>
              Add birthday wishes that float out of a magical jar! Each tap reveals a new wish. ⭐
            </p>
            <ListEditor
              items={wishes}
              onChange={setWishes}
              placeholder="e.g. May all your dreams come true..."
              max={MAX.WISHES}
              emoji="⭐"
            />
          </div>
        );

      // ── Step 6: Photos ──────────────────────────────────────────────────
      case 6:
        return (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "#9B8FAB" }}>
              Upload your favourite memories together. They'll appear in a fun photo booth! 📸 (Max {MAX.PHOTOS} photos)
            </p>
            <PhotoUploader photos={photos} onChange={setPhotos} max={MAX.PHOTOS} />
          </div>
        );

      // ── Step 7: Our Places ──────────────────────────────────────────────
      case 7:
        return (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "#9B8FAB" }}>
              Add special places that hold memories for you both. These appear on a beautiful map! 🗺️
            </p>

            {/* Place input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={placeEmoji}
                onChange={(e) => setPlaceEmoji(e.target.value.slice(-2))}
                maxLength={2}
                className="w-14 px-2 py-3 rounded-xl border text-center text-xl outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9" }}
                placeholder="📍"
              />
              <input
                type="text"
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && placeInput.trim() && places.length < MAX.PLACES) {
                    setPlaces((prev) => [...prev, { name: placeInput.trim(), emoji: placeEmoji || "📍" }]);
                    setPlaceInput("");
                    soundFx.playPop();
                  }
                }}
                placeholder="e.g. Where we first met, Our cafe..."
                maxLength={80}
                className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
              <button
                onClick={() => {
                  if (placeInput.trim() && places.length < MAX.PLACES) {
                    setPlaces((prev) => [...prev, { name: placeInput.trim(), emoji: placeEmoji || "📍" }]);
                    setPlaceInput("");
                    soundFx.playPop();
                  }
                }}
                disabled={!placeInput.trim() || places.length >= MAX.PLACES}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
                style={{ background: BD_GRADIENT }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Places list */}
            <div className="space-y-2">
              {places.map((place, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "#FFF5F9" }}
                >
                  <span className="text-2xl">{place.emoji}</span>
                  <p className="flex-1 text-sm font-medium" style={{ color: "#1E1B2E" }}>{place.name}</p>
                  <button onClick={() => setPlaces((prev) => prev.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-400" />
                  </button>
                </motion.div>
              ))}
            </div>

            {places.length > 0 && <p className="text-xs text-center text-gray-400">{places.length}/{MAX.PLACES} places</p>}
          </div>
        );

      // ── Step 8: Special Date ────────────────────────────────────────────
      case 8:
        return (
          <div className="space-y-5">
            <p className="text-sm" style={{ color: "#9B8FAB" }}>
              A special date that means something to you both — it appears on a beautiful calendar page. 📅
            </p>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                The Special Date
              </label>
              <input
                type="date"
                value={ourDate}
                onChange={(e) => setOurDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm font-medium outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
            </div>
            <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: "#FFF5F9" }}>
              <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BD_PINK }} />
              <p className="text-xs" style={{ color: "#9B8FAB" }}>
                This could be their birthday, the day you met, a special anniversary, or any date worth celebrating!
              </p>
            </div>
          </div>
        );

      // ── Step 9: Our Song ────────────────────────────────────────────────
      case 9:
        return (
          <div className="space-y-5">
            <p className="text-sm" style={{ color: "#9B8FAB" }}>
              Name a song that's special to you both. It shows up on a beautiful spinning vinyl record! 🎵
            </p>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                Your Song
              </label>
              <input
                type="text"
                value={ourSong}
                onChange={(e) => setOurSong(e.target.value)}
                placeholder="e.g. Tum Hi Ho, Happy Birthday, Perfect by Ed Sheeran..."
                maxLength={100}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm font-medium outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
            </div>
          </div>
        );

      // ── Step 10: Music & Launch ─────────────────────────────────────────
      case 10:
        return (
          <div className="space-y-5">
            {/* Music picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: BD_PINK }}>
                Background Music
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AUDIO_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => { setBgMusic(track.id); if (audioPreviewRef.current) { audioPreviewRef.current.src = track.src; } soundFx.playPop(); }}
                    className="p-3 rounded-2xl border-2 text-left transition-all"
                    style={{
                      borderColor: bgMusic === track.id ? BD_PINK : "#F3F4F6",
                      background: bgMusic === track.id ? "#FFF5F9" : "white",
                    }}
                  >
                    <p className="text-2xl mb-1">{track.emoji}</p>
                    <p className="text-xs font-bold" style={{ color: bgMusic === track.id ? BD_PINK : "#1E1B2E" }}>
                      {track.name}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={toggleAudio}
                className="mt-3 w-full py-2.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2"
                style={{ borderColor: BD_PINK, color: BD_PINK }}
              >
                {isAudioPlaying ? <><Pause className="w-4 h-4" /> Stop Preview</> : <><Play className="w-4 h-4" /> Preview Music</>}
              </button>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: BD_PINK }}>
                Passcode (optional)
              </label>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => { setEnablePin((p) => !p); soundFx.playPop(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold"
                  style={{ borderColor: enablePin ? BD_PINK : "#E5E7EB", background: enablePin ? "#FFF5F9" : "white", color: enablePin ? BD_PINK : "#9CA3AF" }}
                >
                  <Lock className="w-4 h-4" />
                  {enablePin ? "PIN Enabled" : "Add PIN Lock"}
                </button>
              </div>
              {enablePin && (
                <input
                  type="password"
                  value={secretPin}
                  onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="4-6 digit PIN"
                  className="w-full px-4 py-3 rounded-xl border text-center text-2xl font-mono tracking-widest outline-none"
                  style={{ borderColor: "#FFB3CC", background: "#FFF5F9" }}
                />
              )}
            </div>

            {/* Custom URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                Custom URL (optional)
              </label>
              <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl border"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9" }}>
                <span className="text-xs text-gray-400 shrink-0">lovedrop.online/birthday/</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder={`${recipientName.toLowerCase().replace(/\s+/g, "") || "name"}-bday`}
                  maxLength={30}
                  className="flex-1 text-xs font-bold outline-none bg-transparent"
                  style={{ color: BD_PINK }}
                />
              </div>
            </div>

            {/* Notifications */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                Notify Me (optional)
              </label>
              <input
                type="email"
                value={creatorEmail}
                onChange={(e) => setCreatorEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
              <p className="text-xs text-gray-400 mt-1">We'll send you the link and notify when they open it.</p>
            </div>

            {/* WhatsApp number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: BD_PINK }}>
                WhatsApp Number (optional)
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFB3CC", background: "#FFF5F9", color: "#1E1B2E" }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F5 100%)" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-pink-100">
        <div className="flex items-center justify-between px-4 py-3 max-w-xl mx-auto">
          <button onClick={goPrev} disabled={step <= 1}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{ background: "#FFF0F8" }}>
            <ArrowLeft className="w-5 h-5" style={{ color: BD_PINK }} />
          </button>

          <div className="text-center">
            <p className="text-xs font-bold" style={{ color: BD_PINK }}>
              {STEPS[step - 1]?.icon} {STEPS[step - 1]?.title}
            </p>
            <p className="text-xs text-gray-400">Step {step} of 10</p>
          </div>

          <div className="text-2xl">{STEPS[step - 1]?.icon}</div>
        </div>
        <div className="max-w-xl mx-auto">
          <StepProgress step={step} total={10} />
        </div>
      </div>

      {/* Step content */}
      <div className="px-4 py-6 max-w-xl mx-auto">
        {/* Step title */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-black" style={{ color: "#1E1B2E" }}>
            {STEPS[step - 1]?.title}
          </h2>
          <p className="text-sm mt-1" style={{ color: "#9B8FAB" }}>
            {STEPS[step - 1]?.desc}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 z-30 bg-white/90 backdrop-blur-sm border-t border-pink-100 px-4 py-4">
        <div className="max-w-xl mx-auto">
          {step < 10 ? (
            <motion.button
              onClick={goNext}
              disabled={!canGoNext()}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: canGoNext() ? BD_GRADIENT : "#E5E7EB" }}
              whileTap={{ scale: 0.97 }}
            >
              Continue <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2"
              style={{ background: isPublishing ? "#E5E7EB" : BD_GRADIENT }}
              whileTap={{ scale: 0.97 }}
            >
              {isPublishing ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
              ) : (
                <>🎂 Launch Birthday Surprise!</>
              )}
            </motion.button>
          )}

          {step < 10 && (
            <p className="text-center text-xs text-gray-400 mt-2">
              {10 - step} more step{10 - step !== 1 ? "s" : ""} to go
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
