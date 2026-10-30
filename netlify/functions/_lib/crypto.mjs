// Server-only crypto helpers (Node built-ins, zero deps). Never import this
// from the client bundle — it belongs to the serverless functions only.
import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";

// Dev fallbacks let the whole app run locally with placeholder .env values.
// They are intentionally weak and MUST be overridden in production.
const DEV_ENCRYPTION_KEY =
  "0000000000000000000000000000000000000000000000000000000000000000";
const DEV_SESSION_SECRET = "dev-insecure-session-secret-change-me";

function encryptionKey() {
  const hex = process.env.ENCRYPTION_KEY;
  const valid = hex && /^[0-9a-fA-F]{64}$/.test(hex);
  if (!valid && process.env.NODE_ENV === "production") {
    // In production a real key is required; surface loudly.
    throw new Error("ENCRYPTION_KEY must be 64 hex chars (32 bytes) in production");
  }
  return Buffer.from(valid ? hex : DEV_ENCRYPTION_KEY, "hex");
}

// SESSION_SECRET keys the email lookup hash (hmacEmail). The name predates the
// removal of customer accounts; changing it would orphan every stored hash.
export function sessionSecret() {
  return process.env.SESSION_SECRET && !/YOUR/i.test(process.env.SESSION_SECRET)
    ? process.env.SESSION_SECRET
    : DEV_SESSION_SECRET;
}

// ── PII encryption (AES-256-GCM) — "iv:authTag:ciphertext" hex ──
export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey(), iv);
  const enc = Buffer.concat([cipher.update(String(text), "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${enc.toString("hex")}`;
}

export function decrypt(payload) {
  if (!payload || typeof payload !== "string" || !payload.includes(":")) return "";
  const [ivHex, tagHex, dataHex] = payload.split(":");
  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      encryptionKey(),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ]);
    return dec.toString("utf8");
  } catch {
    return "";
  }
}

// Deterministic keyed hash of an email so guests can look up a booking by
// email without us decrypting every row. Case/space-insensitive.
export function hmacEmail(email) {
  return crypto
    .createHmac("sha256", sessionSecret())
    .update(String(email).trim().toLowerCase())
    .digest("hex");
}

// Confirmation reference: JOA-XXXX-XXXX from a crypto-strong source.
export function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I
  const bytes = crypto.randomBytes(8);
  const pick = (i) => chars[bytes[i] % chars.length];
  const block = (o) => pick(o) + pick(o + 1) + pick(o + 2) + pick(o + 3);
  return `JOA-${block(0)}-${block(4)}`;
}
