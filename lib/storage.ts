import { LoveSurpriseData, OccasionType } from "./types";

const STORAGE_PREFIX = "lovelink_v2_site_";

export const DEFAULT_DEMO_SURPRISE: LoveSurpriseData = {
  id: "demo-love-site",
  slug: "simran-aman-demo",
  occasion: "proposal",
  relation: "Partner",
  recipientName: "Simran",
  senderName: "Aman",
  question: "Will you be my Valentine forever? 💖",
  subheading: "You are the best thing that ever happened to me ✨",
  reasons: [
    "Your infectious laugh that brightens my darkest days 😂",
    "How you make ordinary chai dates feel like pure magic ☕",
    "Being my absolute safest home in this entire world 🏡",
  ],
  letterContent:
    "Dear Simran,\n\nSome things deserve more than a text. From the moment you entered my life, you've made ordinary days feel special.\n\nThank you for choosing me, for understanding my silly moods, and for being my biggest comfort. I promise to always listen, make you smile, and never take you for granted.\n\nForever yours,\nAman ❤️",
  photos: [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=80",
  ],
  hasPasscode: false,
  dodgeIntensity: "savage",
  bgMusic: "romantic-lofi",
  whatsappNumber: "0000000000",
  whatsappMessage: "Hey Aman! I just opened your special love website and I loved it so much! You made my day! ❤️",
  isPaid: true,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * Save surprise website data to persistent client storage
 */
export function saveSurpriseData(data: LoveSurpriseData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + data.slug, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save surprise data to storage:", err);
  }
}

/**
 * Retrieve surprise website data by unique slug
 */
export function getSurpriseData(slug: string): LoveSurpriseData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + slug);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read surprise data from storage:", err);
  }

  // If viewing demo or not found in local storage, return demo template adapted to slug
  if (slug === "demo" || slug.includes("demo")) {
    return DEFAULT_DEMO_SURPRISE;
  }

  // Parse names if slug matches pattern: [recipient]-[sender]-[id]
  const parts = slug.split("-");
  if (parts.length >= 2) {
    const recipient = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const sender = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return {
      ...DEFAULT_DEMO_SURPRISE,
      slug,
      recipientName: recipient,
      senderName: sender,
      question: `Do you love me, ${recipient}? 🥺`,
    };
  }

  return DEFAULT_DEMO_SURPRISE;
}
