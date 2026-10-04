"use client";

import React, { Suspense } from "react";
import CreatorWizard from "@/components/creator/CreatorWizard";

export default function ApologyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreatorWizard initialOccasion="apology" />
    </Suspense>
  );
}
