"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Lock } from "lucide-react";
import { LoveSurpriseData } from "@/lib/types";
import { soundFx } from "@/lib/soundFx";
import { verifyPasscode } from "@/lib/security";
import LoveSurpriseTemplate from "@/components/experience/LoveSurpriseTemplate";

interface RecipientViewProps {
  data: LoveSurpriseData;
}

export default function RecipientView({ data }: RecipientViewProps) {
  // Passcode Gate State
  const [isUnlocked, setIsUnlocked] = useState(!data.hasPasscode);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPin = async () => {
    if (!enteredPin.trim() || isVerifying) return;
    soundFx.playPop();
    if (pinAttempts >= 5) {
      alert("Too many incorrect attempts. Please ask whoever sent this surprise for the PIN!");
      return;
    }

    setIsVerifying(true);
    let isSuccess = false;

    // 1. Attempt secure server-side verification with rate limiting
    try {
      const res = await fetch(`/api/surprise/${data.slug}/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin.trim() }),
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.verified) {
        isSuccess = true;
      } else if (res.status === 429) {
        alert(resData.error || "Too many attempts. Please wait a minute!");
        setIsVerifying(false);
        return;
      }
    } catch {
      // If server or network is offline, fallback to client hash check
      if (data.passcodeHash) {
        isSuccess = await verifyPasscode(enteredPin, data.passcodeHash);
      }
    }

    setIsVerifying(false);

    if (isSuccess) {
      soundFx.playSuccessChime();
      setIsUnlocked(true);
      confetti({ particleCount: 60, spread: 60 });
    } else {
      setPinError(true);
      setPinAttempts((p) => p + 1);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-[100dvh] w-full bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white rounded-3xl p-7 border border-pink-100 shadow-xl text-center space-y-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#FF2E63] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
              Enter Secret Date Lock
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {data.senderName || "Your partner"} set a secret passcode to unlock this surprise.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="••••"
              className={`w-40 mx-auto text-center tracking-[0.4em] text-2xl font-mono font-bold py-2.5 rounded-2xl border ${
                pinError
                  ? "border-rose-500 ring-2 ring-rose-200"
                  : "border-slate-200 focus:border-pink-500"
              } outline-none bg-white`}
            />
            {pinError && (
              <p className="text-xs font-bold text-[#FF2E63] animate-pulse">
                Incorrect PIN. Please try again!
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleVerifyPin}
            className="w-full py-3.5 rounded-2xl bg-[#FF2E63] hover:bg-[#E02656] active:scale-95 text-white font-extrabold text-sm shadow-md shadow-pink-500/25 transition-all cursor-pointer"
          >
            Unlock Surprise 💌
          </button>
        </motion.div>
      </div>
    );
  }

  return <LoveSurpriseTemplate data={data} />;
}
