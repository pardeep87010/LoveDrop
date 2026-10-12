"use client";

import { useState, useEffect } from "react";

export type CountryRegion = "IN" | "GLOBAL";

export interface PricingPlan {
  id: "month" | "year" | "lifetime";
  name: string;
  duration: string;
  badge?: string;
  popular?: boolean;
  bestValue?: boolean;
  price: number;
  originalPrice: number;
  currency: string;
  priceFormatted: string;
  originalPriceFormatted: string;
  periodText: string;
  description: string;
  features: string[];
}

export interface PricingConfig {
  region: CountryRegion;
  currencySymbol: string;
  plans: PricingPlan[];
}

export const PRICING_DATA: Record<CountryRegion, { currency: string; plans: Omit<PricingPlan, "currency" | "priceFormatted" | "originalPriceFormatted">[] }> = {
  IN: {
    currency: "₹",
    plans: [
      {
        id: "month",
        name: "1 Month Access",
        duration: "30 Days Access",
        price: 149,
        originalPrice: 499,
        periodText: "for 1 month access",
        description: "Perfect for a single special date or anniversary celebration",
        features: [
          "100% Watermark-Free experience",
          "Active link for 30 full days",
          "Real-time WhatsApp notification when opened",
          "Background romantic ambient music",
          "High-res printable QR polaroid card",
          "Interactive runaway 'No' button",
        ],
      },
      {
        id: "year",
        name: "1 Year Access",
        duration: "365 Days Access",
        badge: "MOST POPULAR",
        popular: true,
        price: 249,
        originalPrice: 999,
        periodText: "for 1 year access",
        description: "Cherish your love story all year long with unlimited revisits",
        features: [
          "Everything in 1 Month plan",
          "Active link for 1 Full Year (365 days)",
          "Edit text & photos anytime after launch",
          "All 15 interactive stages & love quiz",
          "Fortune cookies, scratch cards & wheel",
          "Priority 24/7 WhatsApp support",
        ],
      },
      {
        id: "lifetime",
        name: "Lifetime Access",
        duration: "Forever Access",
        badge: "BEST VALUE",
        bestValue: true,
        price: 599,
        originalPrice: 1999,
        periodText: "for lifetime access",
        description: "A permanent digital monument of your eternal love story",
        features: [
          "Everything in 1 Year plan",
          "Never expires — permanent digital keepsake",
          "Unlimited photo uploads & memory timeline",
          "Passcode protection lock included",
          "Custom subdomain option",
          "VIP priority support & backup archive",
        ],
      },
    ],
  },
  GLOBAL: {
    currency: "$",
    plans: [
      {
        id: "month",
        name: "1 Month Access",
        duration: "30 Days Access",
        price: 3.49,
        originalPrice: 9.99,
        periodText: "for 1 month access",
        description: "Perfect for a single special date or anniversary celebration",
        features: [
          "100% Watermark-Free experience",
          "Active link for 30 full days",
          "Real-time WhatsApp notification when opened",
          "Background romantic ambient music",
          "High-res printable QR polaroid card",
          "Interactive runaway 'No' button",
        ],
      },
      {
        id: "year",
        name: "1 Year Access",
        duration: "365 Days Access",
        badge: "MOST POPULAR",
        popular: true,
        price: 7.99,
        originalPrice: 19.99,
        periodText: "for 1 year access",
        description: "Cherish your love story all year long with unlimited revisits",
        features: [
          "Everything in 1 Month plan",
          "Active link for 1 Full Year (365 days)",
          "Edit text & photos anytime after launch",
          "All 15 interactive stages & love quiz",
          "Fortune cookies, scratch cards & wheel",
          "Priority 24/7 WhatsApp support",
        ],
      },
      {
        id: "lifetime",
        name: "Lifetime Access",
        duration: "Forever Access",
        badge: "BEST VALUE",
        bestValue: true,
        price: 10.99,
        originalPrice: 29.99,
        periodText: "for lifetime access",
        description: "A permanent digital monument of your eternal love story",
        features: [
          "Everything in 1 Year plan",
          "Never expires — permanent digital keepsake",
          "Unlimited photo uploads & memory timeline",
          "Passcode protection lock included",
          "Custom subdomain option",
          "VIP priority support & backup archive",
        ],
      },
    ],
  },
};

/**
 * Detects whether the current device is in India or International.
 */
export function detectUserRegion(): CountryRegion {
  if (typeof window === "undefined") return "IN";

  try {
    // 1. Check saved override
    const saved = localStorage.getItem("lovelink_region") as CountryRegion | null;
    if (saved === "IN" || saved === "GLOBAL") return saved;

    // 2. Check timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (
      tz.includes("Kolkata") ||
      tz.includes("Calcutta") ||
      tz.includes("Delhi") ||
      tz.includes("IST")
    ) {
      return "IN";
    }

    // 3. Check timezone offset: IST is UTC+5:30 (offset is -330 minutes)
    const offset = new Date().getTimezoneOffset();
    if (offset === -330) {
      return "IN";
    }

    // 4. Check navigator languages
    const languages = navigator.languages || [navigator.language || ""];
    const isIndianLocale = languages.some((l) =>
      /-IN\b|hi|bn|te|mr|ta|gu|kn|ml|pa/i.test(l)
    );
    if (isIndianLocale) {
      return "IN";
    }

    // Default to GLOBAL if outside India
    return "GLOBAL";
  } catch {
    return "IN";
  }
}

export function formatPrice(amount: number, currency: string): string {
  if (currency === "₹") {
    return `₹${amount}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function getPricingPlans(region: CountryRegion): PricingPlan[] {
  const data = PRICING_DATA[region] || PRICING_DATA.IN;
  return data.plans.map((p) => ({
    ...p,
    currency: data.currency,
    priceFormatted: formatPrice(p.price, data.currency),
    originalPriceFormatted: formatPrice(p.originalPrice, data.currency),
  }));
}

/**
 * React hook for reactive pricing across the landing page and creator wizard.
 */
export function usePricing() {
  const [region, setRegionState] = useState<CountryRegion>("IN");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const detected = detectUserRegion();
    setRegionState(detected);
    setIsReady(true);
  }, []);

  const setRegion = (newRegion: CountryRegion) => {
    setRegionState(newRegion);
    try {
      localStorage.setItem("lovelink_region", newRegion);
    } catch {}
  };

  const plans = getPricingPlans(region);
  const currencySymbol = region === "IN" ? "₹" : "$";

  return {
    region,
    setRegion,
    plans,
    currencySymbol,
    isReady,
  };
}
