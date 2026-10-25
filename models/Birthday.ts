import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBirthday extends Document {
  id: string;
  slug: string;
  templateType: "birthday-party";
  recipientName: string;
  senderName: string;
  birthdayAge?: number;
  birthdayDate?: string;
  letterText: string;
  letterTitle?: string;
  buttonText?: string;
  photos: string[];
  ourStory?: string;
  loveReasons?: string[];
  wishes?: string[];
  ourPlaces?: { name: string; emoji: string }[];
  ourDate?: string;
  ourSong?: string;
  bgMusic: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  hasPasscode: boolean;
  passcodeHash?: string;
  creatorEmail?: string;
  recipientEmail?: string;
  isPaid: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const BirthdaySchema = new Schema<IBirthday>(
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
    templateType: { type: String, default: "birthday-party" },
    recipientName: { type: String, required: true, trim: true },
    senderName: { type: String, required: true, trim: true },
    birthdayAge: { type: Number },
    birthdayDate: { type: String },
    letterText: { type: String, default: "" },
    letterTitle: { type: String },
    buttonText: { type: String, default: "Open my gift" },
    photos: { type: [String], default: [] },
    ourStory: { type: String },
    loveReasons: { type: [String], default: [] },
    wishes: { type: [String], default: [] },
    ourPlaces: [
      {
        name: { type: String },
        emoji: { type: String },
      },
    ],
    ourDate: { type: String },
    ourSong: { type: String, default: "Happy Birthday Melodies" },
    bgMusic: { type: String, default: "romantic-lofi" },
    whatsappNumber: { type: String },
    whatsappMessage: { type: String },
    hasPasscode: { type: Boolean, default: false },
    passcodeHash: { type: String },
    creatorEmail: { type: String, trim: true, index: true },
    recipientEmail: { type: String, trim: true },
    isPaid: { type: Boolean, default: true },
    viewsCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling model across Next.js reloads
export const Birthday: Model<IBirthday> =
  mongoose.models.Birthday || mongoose.model<IBirthday>("Birthday", BirthdaySchema);

export default Birthday;
