import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISurprise extends Document {
  id: string;
  slug: string;
  occasion: string;
  relation: string;
  recipientName: string;
  senderName: string;
  question: string;
  subheading?: string;
  reasons: string[];
  letterContent: string;
  letterText?: string;
  photos: string[];
  theme?: string;
  anniversaryDate?: string;
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
  pricingPlan?: string;
  passcodeHash?: string;
  hasPasscode: boolean;
  dodgeIntensity: string;
  bgMusic: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  creatorEmail?: string;
  recipientEmail?: string;
  isPaid: boolean;
  viewsCount: number;
  yesClicked: boolean;
  yesClickedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const SurpriseSchema = new Schema<ISurprise>(
  {
    id: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    occasion: { type: String, default: "proposal" },
    relation: { type: String, default: "Partner" },
    recipientName: { type: String, required: true, trim: true },
    senderName: { type: String, required: true, trim: true },
    question: { type: String, required: true },
    subheading: { type: String },
    reasons: { type: [String], default: [] },
    letterContent: { type: String, default: "" },
    letterText: { type: String },
    photos: { type: [String], default: [] },
    theme: { type: String, default: "classic" },
    anniversaryDate: { type: String },
    selectedFeatures: { type: [String], default: [] },
    timeline: [
      {
        date: { type: String },
        event: { type: String },
      },
    ],
    promises: { type: [String], default: [] },
    loveReasons: { type: [String], default: [] },
    quizQuestions: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    compliments: { type: [String], default: [] },
    fortuneCookies: { type: [String], default: [] },
    scratchCards: { type: [String], default: [] },
    wheelItems: { type: [String], default: [] },
    bucketList: { type: [String], default: [] },
    enabledPages: { type: Schema.Types.Mixed, default: {} },
    typingIntroWords: { type: [String], default: [] },
    buttonText: { type: String },
    yesButtonText: { type: String },
    dodgePhrases: { type: [String], default: [] },
    letterTitle: { type: String },
    waxSealEmoji: { type: String },
    photoMemories: [
      {
        image: { type: String },
        caption: { type: String },
      },
    ],
    nineReasons: [
      {
        id: { type: Number },
        emoji: { type: String },
        title: { type: String },
      },
    ],
    storyMilestones: [
      {
        icon: { type: String },
        date: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    quizList: [
      {
        id: { type: Number },
        question: { type: String },
        options: { type: [String] },
        correct: { type: String },
      },
    ],
    fortuneQuotes: { type: [String], default: [] },
    pricingPlan: { type: String, default: "lifetime" },
    passcodeHash: { type: String },
    hasPasscode: { type: Boolean, default: false },
    dodgeIntensity: { type: String, default: "savage" },
    bgMusic: { type: String, default: "summer-guitar" },
    whatsappNumber: { type: String },
    whatsappMessage: { type: String },
    creatorEmail: { type: String, trim: true, index: true },
    recipientEmail: { type: String, trim: true },
    isPaid: { type: Boolean, default: true },
    viewsCount: { type: Number, default: 0 },
    yesClicked: { type: Boolean, default: false },
    yesClickedAt: { type: Date },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling model across Next.js reloads
export const Surprise: Model<ISurprise> =
  mongoose.models.Surprise || mongoose.model<ISurprise>("Surprise", SurpriseSchema);

export default Surprise;
