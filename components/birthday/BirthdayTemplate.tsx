"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronLeft, ChevronRight, Music, Music2, Settings2, X, Heart, Star, Gift, Mic, Hand } from "lucide-react";
import { BirthdayData } from "@/lib/types";

// ─── Color Palette ────────────────────────────────────────────────────────────
const BD = {
  bg: "#FDF0F5",
  bgLight: "#FFF5F9",
  pink: "#FF6B9D",
  pinkDark: "#E8527A",
  purple: "#C084FC",
  purpleLight: "#DDB6FD",
  gold: "#F59E0B",
  cream: "#FFF8F0",
  text: "#1E1B2E",
  textMuted: "#9B8FAB",
};

// ─── Floating Confetti Particle ───────────────────────────────────────────────
function FloatingParticle({ index }: { index: number }) {
  const shapes = ["⭐", "🎈", "🎊", "✨", "💖", "🎀", "🎉"];
  const shape = shapes[index % shapes.length];
  const xStart = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = 6 + Math.random() * 8;

  return (
    <motion.div
      className="absolute text-lg pointer-events-none select-none"
      style={{ left: `${xStart}%`, top: "110%" }}
      animate={{
        y: [0, -(window?.innerHeight || 800) * 1.3],
        x: [0, (Math.random() - 0.5) * 80],
        rotate: [0, Math.random() > 0.5 ? 360 : -360],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {shape}
    </motion.div>
  );
}

// ─── Scene 1: Birthday Landing ────────────────────────────────────────────────
function SceneLanding({ data, onOpen }: { data: BirthdayData; onOpen: () => void }) {
  const [cakeRotation, setCakeRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const lastX = useRef(0);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    startX.current = x;
    lastX.current = x;
  };

  const handleDragMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      const x = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const delta = x - lastX.current;
      setCakeRotation((r) => r + delta * 0.8);
      lastX.current = x;
    },
    [isDragging]
  );

  const handleDragEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove]);

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-between overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F5 50%, #FFCFE8 100%)" }}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => <FloatingParticle key={i} index={i} />)}
      </div>

      {/* Top text */}
      <motion.div
        className="text-center pt-16 px-8 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: BD.pink }}>A Gift For You</p>
        <h1 className="text-4xl font-black leading-tight" style={{ color: BD.text }}>
          Happy birthday!
        </h1>
        <p className="text-2xl font-light italic mt-1" style={{ color: BD.pinkDark }}>
          for being so <span className="font-bold text-[#FF6B9D]">kind</span>
        </p>
        <p className="text-sm mt-3 font-medium" style={{ color: BD.textMuted }}>
          Someone threw a little party just for you.
        </p>
      </motion.div>

      {/* Spinning Cake */}
      <motion.div
        className="flex flex-col items-center gap-4 z-10 cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        style={{ transform: `rotateY(${cakeRotation}deg)`, transformStyle: "preserve-3d" }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="text-[160px] leading-none select-none drop-shadow-2xl">🎂</div>
        <motion.p
          className="text-xs text-center px-4 py-2 rounded-full text-white font-semibold"
          style={{ background: "rgba(255,107,157,0.3)", backdropFilter: "blur(8px)", color: BD.pinkDark }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ‹ › Drag to spin the cake
        </motion.p>
      </motion.div>

      {/* CTA Button */}
      <motion.div className="pb-12 z-10 w-full px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}>
        <motion.button
          onClick={onOpen}
          className="w-full py-4 rounded-full font-extrabold text-lg text-white shadow-lg shadow-pink-500/40 flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${BD.pink} 0%, ${BD.pinkDark} 100%)` }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          🎁 Open my gift
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Scene 2: The Letter ──────────────────────────────────────────────────────
function SceneLetter({ data }: { data: BirthdayData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => setLetterVisible(true), 600);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "linear-gradient(180deg, #FFE8F5 0%, #FDD6ED 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div key={i}
            className="absolute text-sm opacity-40"
            style={{ left: `${Math.random() * 90}%`, top: `${Math.random() * 90}%` }}
            animate={{ y: [-8, 8, -8], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}>
            {["💌", "🎀", "⭐", "🌸"][i % 4]}
          </motion.div>
        ))}
      </div>

      <motion.div className="w-full max-w-sm z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        {/* Letter Title */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
            Open The Envelope
          </p>
          <h2 className="text-3xl font-black" style={{ color: BD.text }}>
            A letter for you
          </h2>
        </div>

        {/* Envelope */}
        <div className="relative" onClick={!isOpen ? handleOpenEnvelope : undefined}>
          {/* Envelope body */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
            style={{ background: "linear-gradient(135deg, #FFB3D4 0%, #FF8BBF 100%)" }}
            whileHover={!isOpen ? { scale: 1.02 } : {}}
            whileTap={!isOpen ? { scale: 0.98 } : {}}
          >
            {/* Envelope flap */}
            <motion.div
              className="relative z-10"
              style={{
                height: 120,
                background: "linear-gradient(135deg, #FF9EC8 0%, #F07EB4 100%)",
                clipPath: "polygon(0 0, 50% 70%, 100% 0)",
                transformOrigin: "top",
              }}
              animate={isOpen ? { rotateX: -180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Letter content inside */}
            <div className="bg-white mx-4 mb-4 mt-[-20px] rounded-xl p-5 min-h-[200px] relative shadow-inner">
              {/* Wax seal */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-lg z-20"
                style={{ background: "linear-gradient(135deg, #C0392B 0%, #8B1A1A 100%)" }}>
                ❤️
              </div>

              <AnimatePresence>
                {letterVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="pt-4"
                  >
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BD.pink }}>
                      {data.letterTitle || `Dear ${data.recipientName}`}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: BD.text }}>
                      {data.letterText || `Happy Birthday, ${data.recipientName}! 🎉\n\nYou make every day feel special. Wishing you a day as amazing as you are!\n\nWith all my love,\n${data.senderName} 💖`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isOpen && (
                <div className="flex items-center justify-center h-full py-8">
                  <motion.p className="text-xs font-bold text-center" style={{ color: BD.textMuted }}
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}>
                    ↑ PULL UP TO READ
                  </motion.p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {!isOpen && (
          <motion.p className="text-center text-xs font-medium mt-4" style={{ color: BD.textMuted }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}>
            Tap envelope to open 💌
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

// ─── Scene 3: Claw Machine (What I Love) ─────────────────────────────────────
function SceneClawMachine({ data }: { data: BirthdayData }) {
  const reasons = data.loveReasons?.length ? data.loveReasons : [
    "Your beautiful smile", "Your kind heart", "Your amazing laugh",
    "How you make me feel", "Your endless love", "Your strength"
  ];
  const [clawX, setClawX] = useState(50);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [grabbedIndex, setGrabbedIndex] = useState<number | null>(null);
  const [grabbedReason, setGrabbedReason] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);

  const ballColors = ["#FFB3C6", "#C3B1E1", "#B5EAD7", "#FFDAC1", "#FF9AA2", "#FFE4B5", "#B5D5C5", "#D4A5A5", "#A8D8EA"];

  const handleGrab = () => {
    if (isGrabbing) return;
    setIsGrabbing(true);
    const ballCount = Math.min(reasons.length, ballColors.length);
    const idx = Math.floor((clawX / 100) * ballCount);
    const safeIdx = Math.min(idx, ballCount - 1);

    setTimeout(() => {
      setGrabbedIndex(safeIdx);
      setGrabbedReason(reasons[safeIdx]);
      setShowModal(true);
      setIsGrabbing(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF5FF 0%, #F5E6FF 100%)" }}>

      <motion.div className="text-center pt-12 px-6"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black" style={{ color: BD.text }}>
          What I love about you
        </h2>
      </motion.div>

      {/* Claw Machine Cabinet */}
      <motion.div
        className="flex-1 mx-4 mt-4 rounded-3xl overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        style={{
          background: "linear-gradient(180deg, #F0D6FF 0%, #E8C5FF 100%)",
          border: "3px solid #C084FC",
          boxShadow: "0 8px 32px rgba(192,132,252,0.4)",
        }}
      >
        {/* Machine Header */}
        <div className="flex items-center justify-center gap-2 py-3"
          style={{ background: "linear-gradient(90deg, #C084FC, #A855F7)", borderBottom: "2px solid #9333EA" }}>
          <Heart className="w-4 h-4 text-white fill-white" />
          <span className="text-white font-extrabold text-sm tracking-wide">Love prizes</span>
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>

        {/* Glass window */}
        <div className="relative mx-3 mt-3 rounded-2xl overflow-hidden"
          style={{ height: 220, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(4px)", border: "2px solid rgba(255,255,255,0.6)" }}>

          {/* Claw */}
          <motion.div
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${clawX}%`, transform: "translateX(-50%)" }}
            animate={isGrabbing ? { top: [0, 120, 120, 0] } : { top: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="w-0.5 bg-gray-400" style={{ height: 40 }} />
            <div className="text-3xl">🦾</div>
          </motion.div>

          {/* Balls */}
          <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
            {reasons.slice(0, 6).map((_, i) => (
              <motion.div
                key={i}
                className="w-12 h-12 rounded-full shadow-md flex items-center justify-center"
                style={{ background: ballColors[i % ballColors.length] }}
                animate={isGrabbing && grabbedIndex === i ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="px-4 py-4">
          {/* Joystick slider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
              style={{ background: BD.pink }}>◉</div>
            <input type="range" min={5} max={95} value={clawX}
              onChange={(e) => setClawX(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(90deg, ${BD.purple} ${clawX}%, #E5E7EB ${clawX}%)` }} />
            <div className="w-8 h-8 rounded-full shadow-md"
              style={{ background: "#2D2D2D" }} />
          </div>
          <p className="text-xs text-center mb-3" style={{ color: BD.textMuted }}>
            Move the joystick, then press Grab
          </p>

          <motion.button
            onClick={handleGrab}
            disabled={isGrabbing}
            className="w-full py-3.5 rounded-full font-extrabold text-white shadow-lg text-sm"
            style={{ background: isGrabbing ? "#D1D5DB" : `linear-gradient(135deg, ${BD.pink}, ${BD.pinkDark})` }}
            whileTap={{ scale: 0.95 }}
          >
            {isGrabbing ? "Grabbing... 🦾" : "GRAB"}
          </motion.button>
        </div>
      </motion.div>

      {/* Modal showing grabbed reason */}
      <AnimatePresence>
        {showModal && grabbedReason && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 text-center w-full max-w-sm shadow-2xl relative"
              initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <div className="text-5xl mb-4">💖</div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BD.pink }}>
                I love...
              </p>
              <p className="text-xl font-black" style={{ color: BD.text }}>{grabbedReason}</p>
              <motion.button
                className="mt-6 px-8 py-3 rounded-full text-white font-bold text-sm"
                style={{ background: `linear-gradient(135deg, ${BD.pink}, ${BD.pinkDark})` }}
                onClick={() => { setShowModal(false); setGrabbedReason(null); }}
                whileTap={{ scale: 0.96 }}
              >
                Grab Another 🎯
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scene 4: Our Story ───────────────────────────────────────────────────────
function SceneOurStory({ data }: { data: BirthdayData }) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFFBF0 0%, #FFF5D6 100%)" }}>

      <motion.div className="text-center pt-12 px-6"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
          Chapter By Chapter
        </p>
        <h2 className="text-3xl font-black" style={{ color: BD.text }}>Our story</h2>
      </motion.div>

      {/* Story book */}
      <motion.div
        className="flex-1 mx-4 mt-6 mb-6 bg-white rounded-3xl shadow-xl p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>

        {/* Spiral binding effect */}
        <div className="absolute -left-2 top-6 bottom-6 flex flex-col justify-around">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-400" />
          ))}
        </div>

        <div className="ml-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium" style={{ color: BD.text }}>
            {data.ourStory || `${data.recipientName},\n\nEvery single memory we've shared together has been a chapter in the most beautiful story I've ever read.\n\nThank you for being in my story. 🎁\n\nWith all my love,\n${data.senderName}`}
          </p>
        </div>

        {/* Gift illustration */}
        <motion.div className="flex justify-center mt-8"
          animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
          <div className="text-8xl">🎁</div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Scene 5: Wishes Jar ──────────────────────────────────────────────────────
function SceneWishesJar({ data }: { data: BirthdayData }) {
  const [revealedWishes, setRevealedWishes] = useState<number[]>([]);
  const wishes = data.wishes?.length ? data.wishes : [
    "May all your dreams come true 🌟",
    "Happiness every single day ☀️",
    "Adventure, love, and joy 🎉",
    "Health and laughter always 😄",
    "All the love you deserve 💖",
  ];

  const revealNextWish = () => {
    if (revealedWishes.length < wishes.length) {
      setRevealedWishes((prev) => [...prev, prev.length]);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF8EC 0%, #FDECD4 100%)" }}>

      <motion.div className="text-center pt-12 px-6 z-10"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
          Make A Wish
        </p>
        <h2 className="text-3xl font-black" style={{ color: BD.text }}>
          Wishes for your new year
        </h2>
      </motion.div>

      {/* Jar */}
      <motion.div
        className="relative mt-6 cursor-pointer select-none"
        onClick={revealNextWish}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="text-[140px] leading-none drop-shadow-2xl">🫙</div>
        {/* Stars rising from jar */}
        <AnimatePresence>
          {revealedWishes.map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{ left: `${20 + (i % 3) * 25}%`, top: "30%" }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: -80 - i * 20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, delay: 0 }}
            >
              ⭐
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Wishes list */}
      <div className="w-full px-6 mt-4 space-y-3 z-10">
        <AnimatePresence>
          {revealedWishes.map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="bg-white rounded-2xl px-4 py-3 shadow-md flex items-start gap-3"
            >
              <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BD.gold }} />
              <p className="text-sm font-medium" style={{ color: BD.text }}>{wishes[idx]}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {revealedWishes.length === 0 && (
          <motion.p className="text-center text-sm font-medium" style={{ color: BD.textMuted }}
            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
            Tap the jar to open your wishes ✨
          </motion.p>
        )}

        {revealedWishes.length > 0 && revealedWishes.length < wishes.length && (
          <p className="text-center text-xs font-medium" style={{ color: BD.textMuted }}>
            Tap jar for more wishes ({wishes.length - revealedWishes.length} remaining)
          </p>
        )}

        {revealedWishes.length === wishes.length && (
          <motion.p className="text-center text-sm font-bold" style={{ color: BD.pink }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            All wishes released! 🌟 Make them come true!
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ─── Scene 6: Photo Booth ─────────────────────────────────────────────────────
function ScenePhotoBooth({ data }: { data: BirthdayData }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedPhotos, setPrintedPhotos] = useState<string[]>([]);
  const photos = data.photos?.filter(Boolean) || [];

  const printPhoto = () => {
    if (isPrinting || photos.length === 0) return;
    setIsPrinting(true);
    setTimeout(() => {
      if (photos.length > 0) {
        const photo = photos[currentIdx % photos.length];
        setPrintedPhotos((prev) => [photo, ...prev].slice(0, 4));
        setCurrentIdx((i) => (i + 1) % photos.length);
      }
      setIsPrinting(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FFD6EC 100%)" }}>

      <motion.div className="text-center pt-10 px-6 z-10"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
          Say Cheese!
        </p>
        <h2 className="text-3xl font-black" style={{ color: BD.text }}>Our moments</h2>
      </motion.div>

      {/* Photo Booth Machine */}
      <motion.div
        className="mt-4 mx-6 rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ background: "linear-gradient(180deg, #C084FC 0%, #A855F7 100%)", border: "3px solid #9333EA" }}
      >
        {/* Booth Sign */}
        <div className="text-center py-3 px-6"
          style={{ background: "linear-gradient(90deg, #FF6B9D, #FF4081)", borderBottom: "2px solid #E91E7A" }}>
          <p className="text-white font-extrabold text-lg tracking-wide">Photo booth</p>
        </div>

        {/* Camera window */}
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden relative bg-gray-900"
          style={{ height: 180 }}>
          {photos.length > 0 ? (
            <img
              src={photos[currentIdx % photos.length]}
              alt="Memory"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="text-5xl">📸</div>
              <p className="text-xs text-gray-400">Your photos will print here</p>
            </div>
          )}

          {isPrinting && (
            <motion.div
              className="absolute inset-0 bg-white flex items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-4xl">📸</div>
            </motion.div>
          )}

          {/* Camera lens overlay */}
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full border-2 border-purple-400 opacity-60 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-purple-600 opacity-70" />
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 py-2">
          {photos.slice(0, 4).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full"
              style={{ background: i === (currentIdx % photos.length) ? "white" : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>

        {/* Controls */}
        <div className="px-4 pb-4 flex gap-3">
          <div className="w-8 h-12 rounded-lg" style={{ background: "#F59E0B" }} />
          <motion.button
            className="flex-1 py-3 rounded-xl text-white font-extrabold text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF6B9D, #E8527A)" }}
            onClick={printPhoto}
            whileTap={{ scale: 0.95 }}
            disabled={isPrinting || photos.length === 0}
          >
            {isPrinting ? "Printing... 📸" : photos.length === 0 ? "No Photos Added" : "📸 Print Photo"}
          </motion.button>
          <div className="w-8 h-12 rounded-lg flex items-center justify-center"
            style={{ background: "#FF6B9D" }}>
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      </motion.div>

      {/* Printed photos strip */}
      <div className="w-full px-6 mt-4 space-y-2">
        <AnimatePresence>
          {printedPhotos.map((photo, i) => (
            <motion.div
              key={`${photo}-${i}`}
              initial={{ y: -20, opacity: 0, scaleY: 0 }}
              animate={{ y: 0, opacity: 1, scaleY: 1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
              style={{ transformOrigin: "top" }}
            >
              <img src={photo} alt="Printed" className="w-full h-32 object-cover" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Scene 7: Our Places ──────────────────────────────────────────────────────
function SceneOurPlaces({ data }: { data: BirthdayData }) {
  const places = data.ourPlaces?.length ? data.ourPlaces : [
    { name: "Where we first met", emoji: "☕" },
    { name: "Our favourite spot", emoji: "🌅" },
    { name: "Where we made memories", emoji: "🎡" },
  ];

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF5F5 0%, #FFE5E5 100%)" }}>

      {/* Map illustration at top */}
      <motion.div className="flex-1 flex items-center justify-center pt-8"
        initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="relative">
          <div className="text-[180px] leading-none">🗺️</div>
          {/* Animated heart pin */}
          <motion.div
            className="absolute text-4xl"
            style={{ top: "20%", left: "55%", transformOrigin: "bottom" }}
            animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📍
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom card */}
      <motion.div
        className="mx-4 mb-8 bg-white rounded-3xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
          Where We Have Been
        </p>
        <h2 className="text-2xl font-black mb-4" style={{ color: BD.text }}>Our places</h2>

        <div className="space-y-3">
          {places.map((place, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: "#FFF5F9" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg, #FFB3C6, #FF8BBF)" }}>
                {place.emoji}
              </div>
              <p className="font-semibold text-sm" style={{ color: BD.text }}>{place.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Scene 8: Our Date ────────────────────────────────────────────────────────
function SceneOurDate({ data }: { data: BirthdayData }) {
  const dateText = data.ourDate || data.birthdayDate || "";
  let formattedDate = dateText;
  try {
    if (dateText) {
      formattedDate = new Date(dateText).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric"
      });
    }
  } catch { /* keep raw */ }

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F5F0FF 0%, #EAD6FF 100%)" }}>

      {/* Calendar illustration */}
      <motion.div className="mt-16"
        initial={{ opacity: 0, rotate: -10, scale: 0.7 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}>
        <div className="text-[160px] leading-none drop-shadow-2xl">📅</div>
      </motion.div>

      {/* Bottom card */}
      <motion.div
        className="mx-4 mt-6 mb-8 bg-white rounded-3xl p-6 shadow-xl w-full"
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        style={{ maxWidth: 400 }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
          Mark The Calendar
        </p>
        <h2 className="text-2xl font-black mb-4" style={{ color: BD.text }}>A date to keep</h2>

        {formattedDate ? (
          <div className="p-4 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, #FFF0F8, #FFE5F5)" }}>
            <p className="text-4xl mb-2">🎂</p>
            <p className="text-xl font-extrabold" style={{ color: BD.pinkDark }}>{formattedDate}</p>
            <p className="text-sm mt-2" style={{ color: BD.textMuted }}>This day is forever special 💖</p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl" style={{ background: "#FFF5F9" }}>
            <p className="text-sm" style={{ color: BD.textMuted }}>
              The day {data.recipientName} was born — the world became a brighter place. 🌟
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Scene 9: Our Song (Vinyl) ────────────────────────────────────────────────
function SceneOurSong({ data }: { data: BirthdayData }) {
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFFBF5 0%, #FFEDD5 100%)" }}>

      {/* Vinyl */}
      <motion.div
        className="relative mx-6 mt-10 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        onClick={() => setIsSpinning((s) => !s)}
        style={{ background: "linear-gradient(180deg, #FFE4EC 0%, #FFD6E8 100%)", padding: 20 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Vinyl record */}
        <div className="relative flex justify-center">
          <motion.div
            className="relative"
            animate={isSpinning ? { rotate: 360 } : {}}
            transition={isSpinning ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
          >
            {/* Record disc */}
            <div className="w-52 h-52 rounded-full relative overflow-hidden shadow-2xl"
              style={{ background: "radial-gradient(circle, #C084FC 0%, #A855F7 30%, #7C3AED 60%, #1E1B4B 100%)" }}>
              {/* Grooves */}
              {[...Array(6)].map((_, i) => (
                <div key={i}
                  className="absolute rounded-full border border-white/10"
                  style={{
                    top: `${12 + i * 8}%`, left: `${12 + i * 8}%`,
                    right: `${12 + i * 8}%`, bottom: `${12 + i * 8}%`
                  }}
                />
              ))}
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: "linear-gradient(135deg, #FF6B9D, #FF4081)" }}>
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tonearm */}
          <motion.div
            className="absolute right-4 top-2 w-1 h-24 rounded-full origin-top"
            style={{ background: "#9CA3AF", transform: "rotate(30deg)" }}
            animate={isSpinning ? { rotate: [30, 45, 30] } : { rotate: 30 }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute bottom-0 w-3 h-3 rounded-full bg-yellow-400 -translate-x-1" />
          </motion.div>
        </div>

        <p className="text-center text-xs mt-3 font-medium" style={{ color: "#9B8FAB" }}>
          {isSpinning ? "🎵 Playing..." : "Tap to play"}
        </p>
      </motion.div>

      {/* Bottom card */}
      <motion.div
        className="mx-4 mt-6 bg-white rounded-3xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
          Press Play
        </p>
        <h2 className="text-2xl font-black mb-2" style={{ color: BD.text }}>Our song</h2>
        {data.ourSong && (
          <p className="text-sm font-medium" style={{ color: BD.textMuted }}>🎵 {data.ourSong}</p>
        )}
        {!data.ourSong && (
          <p className="text-sm" style={{ color: BD.textMuted }}>
            Every time this plays, I think of you. 💕
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ─── Scene 10: Blow Candles + Finale ─────────────────────────────────────────
function SceneBlowCandles({ data, onWatchAgain }: { data: BirthdayData; onWatchAgain: () => void }) {
  const [mode, setMode] = useState<"choose" | "listening" | "blown" | "finale">("choose");
  const [candlesBlow, setCandlesBlow] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    setMode("listening");
    let progress = 0;
    holdInterval.current = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdInterval.current!);
        blowCandles();
      }
    }, 80);
  };

  const stopHold = () => {
    if (holdInterval.current) clearInterval(holdInterval.current);
    if (mode === "listening") {
      setMode("choose");
      setHoldProgress(0);
    }
  };

  const blowCandles = () => {
    setCandlesBlow(true);
    setMode("blown");
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#FF6B9D", "#C084FC", "#FFD700", "#FF4081", "#A855F7"],
    });
    setTimeout(() => setMode("finale"), 2000);
  };

  const handleMic = async () => {
    setMode("listening");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 512;
      const data = new Uint8Array(analyser.fftSize);

      let loudFrames = 0;
      const check = setInterval(() => {
        analyser.getByteTimeDomainData(data);
        const max = Math.max(...Array.from(data).map((v) => Math.abs(v - 128)));
        if (max > 30) loudFrames++;
        if (loudFrames > 4) {
          clearInterval(check);
          stream.getTracks().forEach((t) => t.stop());
          blowCandles();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(check);
        stream.getTracks().forEach((t) => t.stop());
        if (mode === "listening") setMode("choose");
      }, 8000);
    } catch {
      setMode("choose");
      alert("Microphone not available. Try using the Hold button instead!");
    }
  };

  if (mode === "finale") {
    return (
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-6"
        style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FFD6EC 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => <FloatingParticle key={i} index={i} />)}
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center z-10 space-y-6"
        >
          <div className="text-[120px] leading-none">🎂</div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BD.pink }}>
              Make A Wish
            </p>
            <h2 className="text-4xl font-black" style={{ color: BD.text }}>Happy birthday!</h2>
            <p className="text-xl font-light italic mt-1" style={{ color: BD.pinkDark }}>
              With all my love
            </p>
          </div>

          {/* Emoji row */}
          <div className="flex justify-center gap-3 text-3xl">
            {["🎈", "🎁", "🎊", "🎀", "🎉", "🌟", "💖"].map((e, i) => (
              <motion.div
                key={i}
                animate={{ y: [-6, 6, -6], rotate: [-10, 10, -10] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              >
                {e}
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={onWatchAgain}
            className="flex items-center gap-2 mx-auto px-8 py-3.5 rounded-full border-2 font-bold text-sm"
            style={{ borderColor: BD.pink, color: BD.pink }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            ↺ Watch again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F5F0F8 0%, #EDD9FF 100%)" }}>

      {/* Cake image */}
      <motion.div className="flex justify-center mt-8 relative"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}>
        <div className="relative">
          <div className="text-[160px] leading-none drop-shadow-2xl">
            {candlesBlow ? "🎂" : "🎂"}
          </div>
          {/* Candles */}
          {!candlesBlow && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="text-xl"
                  animate={{ opacity: [1, 0.7, 1], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, delay: i * 0.15 }}
                >
                  🕯️
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom card */}
      <motion.div
        className="mx-4 mt-4 bg-white rounded-3xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BD.pink }}>
          Make A Wish
        </p>
        <h2 className="text-2xl font-black mb-4" style={{ color: BD.text }}>Blow out the candles</h2>

        {/* Candle indicators */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-3 h-6 rounded-full ${candlesBlow ? "bg-gray-200" : "bg-yellow-400"}`} />
          ))}
        </div>

        {mode === "choose" && (
          <div className="flex gap-3">
            <motion.button
              onClick={handleMic}
              className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${BD.pink}, ${BD.pinkDark})` }}
              whileTap={{ scale: 0.96 }}
            >
              <Mic className="w-4 h-4" /> Microphone
            </motion.button>
            <motion.button
              onPointerDown={startHold}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2"
              style={{ borderColor: "#E5E7EB", color: BD.text }}
              whileTap={{ scale: 0.96 }}
            >
              <Hand className="w-4 h-4" /> Hold
            </motion.button>
          </div>
        )}

        {mode === "listening" && (
          <div className="space-y-3">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${holdProgress}%`, background: `linear-gradient(90deg, ${BD.pink}, ${BD.purple})` }}
              />
            </div>
            <p className="text-center text-sm font-medium" style={{ color: BD.textMuted }}>
              {holdProgress > 0 ? "Keep holding..." : "Listening for your breath... 🌬️"}
            </p>
            <button onClick={() => { setMode("choose"); setHoldProgress(0); }}
              className="w-full text-xs text-gray-400 underline">Cancel</button>
          </div>
        )}

        {mode !== "choose" && mode !== "listening" && (
          <p className="text-center text-sm font-medium" style={{ color: BD.textMuted }}>
            🎊 You did it!
          </p>
        )}

        <p className="text-xs mt-4" style={{ color: BD.textMuted }}>
          The microphone only listens for your breath, right here on your device. Nothing is recorded.
        </p>
      </motion.div>
    </div>
  );
}

// ─── Audio Manager ────────────────────────────────────────────────────────────
const BIRTHDAY_TRACKS: Record<string, string> = {
  "romantic-lofi": "/music/love-bgm.mp3?v=2",
  "summer-guitar": "/music/summer-gouyad-5.mp3?v=2",
  "birthday-beats": "/music/love-bgm.mp3?v=2", // fallback until birthday track added
};

// ─── Navigation Bar ───────────────────────────────────────────────────────────
const CHAPTER_NAMES = [
  "The surprise",
  "The letter",
  "What I love",
  "Our story",
  "Wishes",
  "Moments",
  "Our places",
  "Our date",
  "Our song",
  "The wish",
];

// ─── Main BirthdayTemplate Component ─────────────────────────────────────────
interface BirthdayTemplateProps {
  data: BirthdayData;
}

export default function BirthdayTemplate({ data }: BirthdayTemplateProps) {
  const [scene, setScene] = useState(0); // 0 = landing (before open gift)
  const [started, setStarted] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Total scenes after landing: 0=landing, 1-10 = chapters
  const totalChapters = 10;
  const currentChapter = started ? scene : 0; // 0 is the landing scene

  // Initialize audio
  useEffect(() => {
    const trackSrc = BIRTHDAY_TRACKS[data.bgMusic] || BIRTHDAY_TRACKS["romantic-lofi"];
    const audio = new Audio(trackSrc);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const unlock = () => {
      audio.play().catch(() => {});
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });

    return () => {
      audio.pause();
      audioRef.current = null;
      document.removeEventListener("click", unlock);
    };
  }, [data.bgMusic]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicOn) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsMusicOn((m) => !m);
  };

  const goToScene = (s: number) => {
    setScene(s);
    setShowMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    if (scene < totalChapters) goToScene(scene + 1);
  };

  const goPrev = () => {
    if (scene > 1) goToScene(scene - 1);
  };

  const handleOpenGift = () => {
    setStarted(true);
    setScene(1);
    if (audioRef.current && isMusicOn) {
      audioRef.current.play().catch(() => {});
    }
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } });
  };

  const handleWatchAgain = () => {
    setScene(0);
    setStarted(false);
    window.scrollTo({ top: 0 });
  };

  // Render landing
  if (!started) {
    return <SceneLanding data={data} onOpen={handleOpenGift} />;
  }

  // Render chapter scene
  const renderScene = () => {
    switch (scene) {
      case 1: return <SceneLetter data={data} />;
      case 2: return <SceneClawMachine data={data} />;
      case 3: return <SceneOurStory data={data} />;
      case 4: return <SceneWishesJar data={data} />;
      case 5: return <ScenePhotoBooth data={data} />;
      case 6: return <SceneOurPlaces data={data} />;
      case 7: return <SceneOurDate data={data} />;
      case 8: return <SceneOurSong data={data} />;
      case 9: return <SceneBlowCandles data={data} onWatchAgain={handleWatchAgain} />;
      case 10: return (
        <div className="min-h-[100dvh] flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, #FFF0F8, #FFD6EC)" }}>
          <motion.div className="text-center px-8 space-y-6"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-[120px] leading-none">🎉</div>
            <h2 className="text-4xl font-black" style={{ color: "#1E1B2E" }}>Happy Birthday!</h2>
            <p className="text-lg" style={{ color: "#E8527A" }}>With all my love, {data.senderName} 💖</p>
            <button onClick={handleWatchAgain}
              className="px-8 py-3.5 rounded-full border-2 font-bold text-sm"
              style={{ borderColor: "#FF6B9D", color: "#FF6B9D" }}>
              ↺ Watch again
            </button>
          </motion.div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full">
      {/* Top navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,107,157,0.15)" }}>

        {/* Logo / Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
            style={{ background: "linear-gradient(135deg, #FF6B9D, #C084FC)" }}>
            🎂
          </div>
          <span className="font-extrabold text-sm" style={{ color: "#1E1B2E" }}>Birthday party</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => {}} className="text-xs font-bold px-3 py-1.5 rounded-full border"
            style={{ borderColor: "#FF6B9D", color: "#FF6B9D" }}>
            ✦ Change
          </button>
          <button onClick={toggleMusic}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#FFF0F8" }}>
            {isMusicOn ? <Music className="w-4 h-4" style={{ color: "#FF6B9D" }} /> : <Music2 className="w-4 h-4 text-gray-400" />}
          </button>
          <button onClick={() => setShowMenu(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#FFF0F8" }}>
            <Settings2 className="w-4 h-4" style={{ color: "#FF6B9D" }} />
          </button>
        </div>
      </div>

      {/* Main scene content (with top padding for nav) */}
      <div className="pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderScene()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation bar */}
      {scene >= 1 && scene <= 9 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,107,157,0.15)" }}>

          <button onClick={goPrev} disabled={scene <= 1}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{ background: "#FFF0F8" }}>
            <ChevronLeft className="w-5 h-5" style={{ color: "#FF6B9D" }} />
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <p className="text-xs font-extrabold" style={{ color: "#1E1B2E" }}>
              {CHAPTER_NAMES[scene - 1] || "Chapter"}
            </p>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => goToScene(i + 1)}
                  className="cursor-pointer rounded-full transition-all duration-300"
                  style={{
                    width: i === scene - 1 ? 16 : 6,
                    height: 6,
                    background: i < scene ? "#FF6B9D" : i === scene - 1 ? "#FF6B9D" : "#E5E7EB",
                  }}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: "#9B8FAB" }}>{scene}/10</p>
          </div>

          <button onClick={goNext} disabled={scene >= 10}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 text-white"
            style={{ background: scene >= 10 ? "#E5E7EB" : "linear-gradient(135deg, #FF6B9D, #E8527A)" }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Chapter Menu Modal */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              className="w-full bg-white rounded-t-3xl p-6 space-y-3"
              initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg" style={{ color: "#1E1B2E" }}>Chapters</h3>
                <button onClick={() => setShowMenu(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              {CHAPTER_NAMES.map((name, i) => (
                <button
                  key={i}
                  onClick={() => goToScene(i + 1)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all"
                  style={{ background: i + 1 === scene ? "#FFF0F8" : "transparent" }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: i + 1 <= scene ? "linear-gradient(135deg, #FF6B9D, #E8527A)" : "#F3F4F6",
                      color: i + 1 <= scene ? "white" : "#9CA3AF",
                    }}>
                    {i + 1}
                  </div>
                  <span className="font-semibold text-sm" style={{ color: "#1E1B2E" }}>{name}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
