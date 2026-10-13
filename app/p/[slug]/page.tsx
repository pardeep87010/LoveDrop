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

    // 1. Instant Zero-Latency Demo Mode
    if (slug === "demo") {
      setData(DEFAULT_DEMO_SURPRISE);
      setIsLoading(false);
      return;
    }

    // 2. High-Speed Cache First: Check memory/sessionStorage/localStorage
    const cacheKey = `lovedrop_cache_${slug}`;
    let cachedData: LoveSurpriseData | null = null;
    try {
      const stored = sessionStorage.getItem(cacheKey);
      if (stored) {
        cachedData = JSON.parse(stored);
      }
    } catch {}

    if (!cachedData) {
      cachedData = getSurpriseData(slug);
    }

    // If cache hit, render IMMEDIATELY (0ms perceived latency)
    if (cachedData && isMounted) {
      setData(cachedData);
      setIsLoading(false);
    }

    // 3. Background Asynchronous Revalidation (SWR Pattern)
    async function revalidateSurprise() {
      try {
        const res = await fetch(`/api/surprise/${encodeURIComponent(slug)}`, {
          // Allow Edge CDN to serve cached representation
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data && isMounted) {
            const hasDataChanged =
              !cachedData ||
              JSON.stringify(resData.data) !== JSON.stringify(cachedData);
            if (hasDataChanged) {
              setData(resData.data);
            }
            setIsLoading(false);
            try {
              sessionStorage.setItem(cacheKey, JSON.stringify(resData.data));
            } catch {}
            return;
          }
        }
      } catch (err) {
        console.warn("[Background revalidation notice]:", err);
      }

      // If network failed and no cached data was previously set, use local fallback
      if (isMounted && !cachedData) {
        const fallback = getSurpriseData(slug) || DEFAULT_DEMO_SURPRISE;
        setData(fallback);
        setIsLoading(false);
      }
    }

    revalidateSurprise();

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
