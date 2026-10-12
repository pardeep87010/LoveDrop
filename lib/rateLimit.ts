/**
 * Lightweight, in-memory sliding window rate limiter for Next.js API routes.
 * Prevents brute-force attacks, DDoS, and API abuse.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const tracker = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    tracker.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((t) => now - t < 60000);
      if (record.timestamps.length === 0) {
        tracker.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Check if a given identifier (IP or token) has exceeded max requests within the window.
 *
 * @param key Unique identifier (e.g. `ip:upload`, `ip:verify-pin`)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 min)
 * @returns { isAllowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { isAllowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  let record = tracker.get(key);

  if (!record) {
    record = { timestamps: [] };
    tracker.set(key, record);
  }

  // Filter timestamps outside current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      isAllowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.timestamps.push(now);
  return {
    isAllowed: true,
    remaining: limit - record.timestamps.length,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Helper to get client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}
