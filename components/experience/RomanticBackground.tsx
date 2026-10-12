"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  swayDistance: number;
}

const ROMANTIC_EMOJIS = ["💖", "💕", "💗", "🌸", "✨", "🎀", "🌷", "⭐"];

export default function RomanticBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lightweight set of 10 smooth floating particles (Compositor-accelerated CSS)
    const items: Particle[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.floor((i * 10) + Math.random() * 8), // evenly spread horizontally
      size: Math.floor(Math.random() * 8) + 16, // 16px to 24px
      duration: Math.random() * 6 + 10, // 10s to 16s float speed
      delay: Math.random() * 5,
      emoji: ROMANTIC_EMOJIS[i % ROMANTIC_EMOJIS.length],
      swayDistance: (i % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 15) + 10),
    }));
    setParticles(items);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0 select-none bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE]" />
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden -z-0 select-none"
      style={{ contain: "strict" }}
    >
      {/* ============================================================= */}
      {/* 60FPS AMBIENT BOKEH ORBS (Pure Radial Gradients - ZERO GPU BLUR OVERHEAD) */}
      {/* ============================================================= */}
      <div
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none opacity-45 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(244,114,182,0) 70%)",
          animation: "orbFloat1 18s ease-in-out infinite alternate",
        }}
      />

      <div
        className="absolute top-1/4 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none opacity-40 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(251,113,133,0.35) 0%, rgba(251,113,133,0) 70%)",
          animation: "orbFloat2 20s ease-in-out infinite alternate",
        }}
      />

      <div
        className="absolute -bottom-20 left-1/4 w-[480px] h-[480px] rounded-full pointer-events-none opacity-35 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(233,213,255,0.45) 0%, rgba(233,213,255,0) 70%)",
          animation: "orbFloat3 22s ease-in-out infinite alternate",
        }}
      />

      {/* ============================================================= */}
      {/* HARDWARE-ACCELERATED FLOATING PARTICLES (COMPOSITOR KEYFRAMES) */}
      {/* ============================================================= */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none pointer-events-none will-change-transform"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            bottom: "-40px",
            animation: `particleFloat ${p.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            animationDelay: `${p.delay}s`,
            transform: `translate3d(0, 0, 0)`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Subtle Micro Twinkles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[12%] left-[15%] text-amber-300 text-xs animate-pulse opacity-60">
          ✨
        </span>
        <span className="absolute top-[35%] right-[18%] text-pink-400 text-xs animate-pulse opacity-70">
          💖
        </span>
        <span className="absolute top-[68%] left-[22%] text-rose-300 text-sm animate-pulse opacity-50">
          ✨
        </span>
      </div>

      {/* Scoped CSS Keyframes for 60/120fps Native Compositor Smoothness */}
      <style jsx>{`
        @keyframes orbFloat1 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(24px, -18px, 0) scale(1.08); }
          100% { transform: translate3d(-12px, 15px, 0) scale(0.96); }
        }
        @keyframes orbFloat2 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-25px, 20px, 0) scale(1.05); }
          100% { transform: translate3d(15px, -10px, 0) scale(0.95); }
        }
        @keyframes orbFloat3 {
          0% { transform: translate3d(0, 0, 0) scale(0.96); }
          50% { transform: translate3d(20px, -20px, 0) scale(1.06); }
          100% { transform: translate3d(-15px, 10px, 0) scale(1); }
        }
        @keyframes particleFloat {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translate3d(18px, -112vh, 0) rotate(25deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
