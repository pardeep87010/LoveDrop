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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSurprise() {
      setIsLoading(true);

      // 1. Try fetching from MongoDB API backend first
      try {
        const res = await fetch(`/api/surprise/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data && isMounted) {
            setData(resData.data);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("[MongoDB fetch warning, checking client storage]:", err);
      }

      // 2. Fallback to localStorage or demo template if MongoDB is offline or slug is demo
      if (isMounted) {
        const localSite = getSurpriseData(slug);
        setData(localSite || DEFAULT_DEMO_SURPRISE);
        setIsLoading(false);
      }
    }

    if (slug) {
      loadSurprise();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading || !data) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE] space-y-4">
        <div className="w-10 h-10 border-4 border-[#FF2E63] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-pink-500 animate-pulse tracking-wide uppercase">
          Unwrapping your surprise... 💌
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] w-full flex flex-col bg-gradient-to-b from-[#FDF3F8] via-[#FEFAFC] to-[#FFFDFE]">
      <RecipientView data={data} />
    </main>
  );
}
