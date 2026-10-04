export type OccasionType =
  | "apology"
  | "proposal"
  | "birthday"
  | "love-note"
  | "custom";

export type DodgeIntensity = "gentle" | "savage" | "impossible";

export type AudioTrackId = "summer-guitar" | "romantic-lofi" | "soft-piano";

export interface LoveSurpriseData {
  id: string;
  slug: string;
  occasion: OccasionType;
  relation: string; // e.g., "Girlfriend", "Partner", "Boyfriend"
  recipientName: string;
  senderName: string;
  question: string;
  subheading?: string;
  reasons: string[]; // 3 heartfelt reasons
  letterContent: string;
  letterText?: string;
  photos: string[];
  theme?: string; // e.g., "classic", "classic-romance", "first-love", "minimalist"
  anniversaryDate?: string; // e.g. "2023-02-14"
  // 9 Interactive Feature Fields matching Stage 5
  selectedFeatures?: string[];
  timeline?: { date: string; event: string }[];
  promises?: string[];
  loveReasons?: string[];
  quizQuestions?: { question: string; answer: string }[];
  compliments?: string[];
  fortuneCookies?: string[];
  scratchCards?: string[];
  wheelItems?: string[];
  bucketList?: string[];
  passcodeHash?: string; // Salted/hashed 4-digit PIN if enabled
  hasPasscode: boolean;
  dodgeIntensity: DodgeIntensity;
  bgMusic: AudioTrackId;
  whatsappNumber?: string;
  isPaid: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface EmotionalSpark {
  id: string;
  text: string;
  category: "Romantic" | "Heartfelt" | "Hinglish" | "Apology";
}
