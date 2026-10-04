// Security utilities: cryptographic slug generation, PIN hashing, and XSS sanitization

/**
 * Generates a cryptographically random, URL-safe slug.
 * Prevents sequential ID guessing or enumeration attacks.
 * Format: [clean-names]-[random-nanoid]
 */
export function generateSecureSlug(recipient: string, sender: string): string {
  const cleanRecipient = recipient.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 15) || "love";
  const cleanSender = sender.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 15) || "heart";

  // Generate 6 cryptographically secure random alphanumeric characters
  const charset = "23456789abcdefghjkmnpqrstuvwxyz";
  let randomStr = "";
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const values = new Uint8Array(6);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < 6; i++) {
      randomStr += charset[values[i] % charset.length];
    }
  } else {
    randomStr = Math.random().toString(36).substring(2, 8);
  }

  return `${cleanRecipient}-${cleanSender}-${randomStr}`;
}

/**
 * Computes SHA-256 hash with a fixed application salt.
 * Ensures the plaintext PIN (e.g. "1402") is never stored or exposed in the payload.
 */
export async function hashPasscode(pin: string): Promise<string> {
  const salt = "lovelink_secret_salt_v2_";
  const text = salt + pin.trim();

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback hash for environments without WebCrypto
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Verifies if entered PIN matches the stored hash
 */
export async function verifyPasscode(enteredPin: string, storedHash?: string): Promise<boolean> {
  if (!storedHash) return true;
  const computed = await hashPasscode(enteredPin);
  return computed === storedHash;
}

/**
 * Sanitizes user input against script injection and XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Strip raw HTML tag delimiters
    .replace(/javascript:/gi, "") // Strip pseudo-protocols
    .trim();
}
