"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CreatorWizard from "@/components/creator/CreatorWizard";
import { OccasionType } from "@/lib/types";

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
