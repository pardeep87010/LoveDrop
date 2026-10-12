"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { OccasionType } from "@/lib/types";

const CreatorWizard = dynamic(() => import("@/components/creator/CreatorWizard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF3F8] space-y-3">
      <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold text-rose-500 animate-pulse tracking-wide">
        Preparing your creative workspace... 🎨
      </p>
    </div>
  ),
});

function CreateWizardContainer() {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme") || "classic";
  const occasionParam = (searchParams.get("occasion") as OccasionType) || "proposal";

  return <CreatorWizard initialOccasion={occasionParam} initialTheme={themeParam} />;
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDF3F8]">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateWizardContainer />
    </Suspense>
  );
}
