"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  swayDistance: number;
  rotation: number;
}

const ROMANTIC_EMOJIS = [
  "💖",
  "💕",
  "💗",
  "💓",
  "💞",
  "💘",
  "🌸",
  "🌷",
  "✨",
  "⭐",
  "🫧",
  "🎀",
];

export default function RomanticBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate 24 varied floating romantic particles
    const items: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.floor(Math.random() * 94) + 3, // 3% to 97% horizontal width
      size: Math.floor(Math.random() * 16) + 14, // 14px to 30px
      duration: Math.random() * 8 + 8, // 8s to 16s float speed
      delay: Math.random() * 6, // 0s to 6s delay
      emoji: ROMANTIC_EMOJIS[Math.floor(Math.random() * ROMANTIC_EMOJIS.length)],
      swayDistance: (i % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 25) + 15),
      rotation: (i % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 30) + 15),
    }));
    setParticles(items);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0 select-none bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE]" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0 select-none">
      {/* ============================================================= */}
      {/* AMBIENT GLOWING BOKEH GRADIENT ORBS (Dreamy Romantic Atmosphere) */}
      {/* ============================================================= */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pink-300/35 blur-[90px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-rose-300/30 blur-[100px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-24 left-1/4 w-[28rem] h-[28rem] rounded-full bg-purple-200/30 blur-[110px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-1/3 -left-20 w-80 h-80 rounded-full bg-amber-200/25 blur-[95px] pointer-events-none"
      />

      {/* ============================================================= */}
      {/* FLOATING ROMANTIC PARTICLES (Hearts, Petals, Sparkles)        */}
      {/* ============================================================= */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none pointer-events-none drop-shadow-xs"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            bottom: "-50px",
          }}
          animate={{
            y: ["0vh", "-115vh"],
            x: ["0px", `${p.swayDistance}px`, "0px"],
            rotate: [0, p.rotation, 0],
            opacity: [0, 0.7, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* Subtle Micro Twinkles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[12%] left-[15%] text-amber-300 text-xs animate-ping duration-3000 opacity-60">
          ✨
        </span>
        <span className="absolute top-[35%] right-[18%] text-pink-400 text-xs animate-pulse duration-2000 opacity-70">
          💖
        </span>
        <span className="absolute top-[68%] left-[22%] text-rose-300 text-sm animate-ping duration-4000 opacity-50">
          ✨
        </span>
        <span className="absolute top-[82%] right-[28%] text-amber-300 text-xs animate-pulse duration-2500 opacity-60">
          ⭐
        </span>
      </div>
    </div>
  );
}
