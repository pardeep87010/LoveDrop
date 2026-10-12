"use client";

import React from "react";

interface QrCodeSvgProps {
  className?: string;
  size?: number;
}

/**
 * High-performance, zero-network SVG QR Code representation.
 * Renders instantly without external API roundtrips (like api.qrserver.com).
 */
export default function QrCodeSvg({ className = "w-full h-full", size = 200 }: QrCodeSvgProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Background */}
      <rect width="100" height="100" fill="#FFFFFF" />

      {/* Top-Left Finder Pattern */}
      <rect x="6" y="6" width="26" height="26" fill="#1E293B" />
      <rect x="10" y="10" width="18" height="18" fill="#FFFFFF" />
      <rect x="14" y="14" width="10" height="10" fill="#E11D48" />

      {/* Top-Right Finder Pattern */}
      <rect x="68" y="6" width="26" height="26" fill="#1E293B" />
      <rect x="72" y="10" width="18" height="18" fill="#FFFFFF" />
      <rect x="76" y="14" width="10" height="10" fill="#E11D48" />

      {/* Bottom-Left Finder Pattern */}
      <rect x="6" y="68" width="26" height="26" fill="#1E293B" />
      <rect x="10" y="72" width="18" height="18" fill="#FFFFFF" />
      <rect x="14" y="76" width="10" height="10" fill="#E11D48" />

      {/* Timing Patterns */}
      <rect x="36" y="14" width="4" height="4" fill="#334155" />
      <rect x="44" y="14" width="4" height="4" fill="#334155" />
      <rect x="52" y="14" width="4" height="4" fill="#334155" />
      <rect x="60" y="14" width="4" height="4" fill="#334155" />

      <rect x="14" y="36" width="4" height="4" fill="#334155" />
      <rect x="14" y="44" width="4" height="4" fill="#334155" />
      <rect x="14" y="52" width="4" height="4" fill="#334155" />
      <rect x="14" y="60" width="4" height="4" fill="#334155" />

      {/* Data Modules Matrix */}
      <g fill="#1E293B">
        <rect x="36" y="24" width="4" height="8" />
        <rect x="44" y="24" width="8" height="4" />
        <rect x="56" y="24" width="4" height="4" />
        <rect x="64" y="28" width="4" height="4" />

        <rect x="24" y="36" width="8" height="4" />
        <rect x="36" y="36" width="4" height="4" />
        <rect x="44" y="40" width="8" height="8" />
        <rect x="56" y="36" width="4" height="8" />
        <rect x="64" y="40" width="8" height="4" />
        <rect x="76" y="36" width="8" height="4" />
        <rect x="88" y="40" width="4" height="8" />

        <rect x="24" y="44" width="4" height="8" />
        <rect x="32" y="48" width="4" height="4" />
        <rect x="56" y="48" width="4" height="4" />
        <rect x="76" y="44" width="4" height="8" />
        <rect x="84" y="52" width="8" height="4" />

        <rect x="24" y="56" width="8" height="4" />
        <rect x="36" y="52" width="4" height="8" />
        <rect x="44" y="56" width="8" height="4" />
        <rect x="64" y="56" width="8" height="4" />
        <rect x="80" y="60" width="4" height="4" />

        <rect x="36" y="68" width="8" height="4" />
        <rect x="48" y="64" width="4" height="8" />
        <rect x="56" y="68" width="8" height="4" />
        <rect x="68" y="64" width="4" height="4" />
        <rect x="76" y="68" width="8" height="4" />
        <rect x="88" y="72" width="4" height="8" />

        <rect x="36" y="76" width="4" height="8" />
        <rect x="44" y="80" width="8" height="4" />
        <rect x="56" y="76" width="4" height="8" />
        <rect x="68" y="76" width="4" height="4" />
        <rect x="80" y="80" width="8" height="4" />

        <rect x="36" y="88" width="8" height="4" />
        <rect x="48" y="88" width="4" height="4" />
        <rect x="60" y="88" width="8" height="4" />
        <rect x="72" y="88" width="4" height="4" />
        <rect x="84" y="88" width="8" height="4" />
      </g>
    </svg>
  );
}
