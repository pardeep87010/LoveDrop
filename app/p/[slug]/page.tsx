"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LoveSurpriseData } from "@/lib/types";
import { getSurpriseData, DEFAULT_DEMO_SURPRISE } from "@/lib/storage";
import RecipientView from "@/components/experience/RecipientView";

export default function SurprisePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "demo";
  const [data, setData] = useState<LoveSurpriseData | null>(null);

  useEffect(() => {
    const site = getSurpriseData(slug);
    setData(site || DEFAULT_DEMO_SURPRISE);
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <RecipientView data={data} />;
}
