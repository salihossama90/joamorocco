// Minimal Stripe REST client (fetch + form encoding, no SDK): create and read
// PaymentIntents, refund, and verify webhook signatures. Server-only.
import crypto from "node:crypto";

const API = "https://api.stripe.com/v1";

export function stripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return /^sk_(test|live)_/.test(key);
}

// Stripe's form encoding: nested objects as a[b]=c, arrays as a[0]=c.
function encode(obj, prefix = "", out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") encode(v, key, out);
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.join("&");
}

async function call(method, path, params, idempotencyKey) {
  const headers = { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` };
  let body;
  if (params && method !== "GET") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = encode(params);
  }
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  const url = method === "GET" && params ? `${API}${path}?${encode(params)}` : `${API}${path}`;
  const res = await fetch(url, { method, headers, body });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || "Payment provider error");
    err.status = res.status;
    err.stripe = data?.error;
    throw err;
  }
  return data;
}

export function createPaymentIntent(params) {
  return call("POST", "/payment_intents", params);
}

// With the charge expanded, so we can record the card's last 4 digits.
export function getPaymentIntent(id) {
  return call("GET", `/payment_intents/${encodeURIComponent(id)}`, { expand: ["latest_charge"] });
}

export function refundPaymentIntent(id, reason = "requested_by_customer") {
  return call("POST", "/refunds", { payment_intent: id, reason }, `refund-${id}`);
}

export function cardLast4(pi) {
  return pi?.latest_charge?.payment_method_details?.card?.last4 || null;
}

// Verify a webhook's Stripe-Signature header (t=…,v1=…) against the raw body.
export function verifyWebhook(rawBody, header, secret, toleranceSec = 300) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    })
  );
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const sigs = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  return sigs.some(
    (s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))
  );
}
