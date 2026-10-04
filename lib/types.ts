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
  photos: string[];
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
