export type OccasionType =
  | "apology"
  | "proposal"
  | "birthday"
  | "love-note"
  | "custom";

export type DodgeIntensity = "gentle" | "savage" | "impossible";

export type AudioTrackId = "summer-guitar" | "romantic-lofi" | "soft-piano" | "birthday-beats";

export type TemplateType = "love-surprise" | "birthday-party";

// ─── Birthday Theme Data ──────────────────────────────────────────────────────
export interface BirthdayData {
  id: string;
  slug: string;
  templateType: "birthday-party";
  recipientName: string;       // Birthday person's name
  senderName: string;          // Who is sending
  birthdayAge?: number;        // e.g. 21, 25
  birthdayDate?: string;       // ISO date string e.g. "2024-10-18"
  letterText: string;          // The birthday letter
  letterTitle?: string;        // Letter heading
  photos: string[];            // User's memories photos (max 10)
  ourStory?: string;           // "Our story" text (chapter by chapter)
  loveReasons?: string[];      // "What I love about you" (max 9 items)
  wishes?: string[];           // Wishes in a jar (max 9 wishes)
  ourPlaces?: { name: string; emoji: string }[]; // Our special places
  ourDate?: string;            // A special date to remember
  ourSong?: string;            // Song name / dedication text
  bgMusic: AudioTrackId;
  whatsappNumber?: string;
  whatsappMessage?: string;
  hasPasscode: boolean;
  passcodeHash?: string;
  creatorEmail?: string;
  recipientEmail?: string;
  isPaid: boolean;
  createdAt: string;
  expiresAt: string;
}

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
  // Page-by-Page Template Fields (Pages 1 to 8)
  enabledPages?: Record<string, boolean>;
  typingIntroWords?: string[];
  buttonText?: string;
  yesButtonText?: string;
  dodgePhrases?: string[];
  letterTitle?: string;
  waxSealEmoji?: string;
  photoMemories?: { image: string; caption: string }[];
  nineReasons?: { id: number; emoji: string; title: string }[];
  storyMilestones?: { icon: string; date: string; title: string; description: string }[];
  quizList?: { id: number; question: string; options: string[]; correct: string }[];
  fortuneQuotes?: string[];
  pricingPlan?: "month" | "year" | "lifetime";
  passcodeHash?: string; // Salted/hashed 4-digit PIN if enabled
  hasPasscode: boolean;
  dodgeIntensity: DodgeIntensity;
  bgMusic: AudioTrackId;
  whatsappNumber?: string;
  whatsappMessage?: string;
  creatorEmail?: string;
  recipientEmail?: string;
  isPaid: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface EmotionalSpark {
  id: string;
  text: string;
  category: "Romantic" | "Heartfelt" | "Hinglish" | "Apology";
}
