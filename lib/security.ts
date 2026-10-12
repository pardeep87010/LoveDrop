import bcrypt from "bcryptjs";

/**
 * Basic HTML escaping to prevent XSS in user-generated strings
 */
export function sanitizeString(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Clean text without escaping normal letters (for DB storage where React handles escaping on render)
 * Strips dangerous script tags and null bytes.
 */
export function cleanUserInput(str: unknown, maxLength = 5000): string {
  if (typeof str !== "string") return "";
  let clean = str.trim().replace(/\0/g, ""); // strip null bytes
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""); // remove script tags
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  return clean;
}

/**
 * Hash secret 4-digit passcode with salt using bcrypt
 */
export async function hashPasscode(passcode: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passcode.trim(), salt);
}

/**
 * Compare entered passcode with stored hash
 */
export async function verifyPasscode(
  enteredPasscode: string,
  storedHash: string
): Promise<boolean> {
  return bcrypt.compare(enteredPasscode.trim(), storedHash);
}

/**
 * Validate email address format
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Sanitize user input (alias used in creator wizard)
 */
export function sanitizeInput(input: string): string {
  return cleanUserInput(input);
}

/**
 * Generate a clean, URL-safe secure slug from recipient and sender names
 */
export function generateSecureSlug(
  recipientName: string,
  senderName: string
): string {
  const cleanRecipient = recipientName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const cleanSender = senderName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const base = `${cleanRecipient || "love"}-${cleanSender || "you"}-${randomSuffix}`;
  return base;
}
