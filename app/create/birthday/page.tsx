"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const BirthdayCreatorWizard = dynamic(
  () => import("@/components/birthday/BirthdayCreatorWizard"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3"
        style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F5 100%)" }}>
        <div className="text-5xl animate-bounce">🎂</div>
        <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-pink-500 animate-pulse tracking-wide">
          Setting up birthday magic... 🎉
        </p>
      </div>
    ),
  }
);

export default function CreateBirthdayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F5 100%)" }}>
          <div className="text-5xl animate-bounce">🎂</div>
        </div>
      }
    >
      <BirthdayCreatorWizard />
    </Suspense>
  );
}
