// Stripe's own notice that a payment succeeded — the safety net if a guest
// closes the page between paying and the booking being recorded. Signed with
// STRIPE_WEBHOOK_SECRET; the same idempotent code as the browser path runs.
import { getDb } from "./_lib/db.mjs";
import { verifyWebhook, getPaymentIntent } from "./_lib/stripe.mjs";
import { finalizeBooking, finalizeExtra } from "./_lib/finalize.mjs";

const ok = (msg = "ok") => ({ statusCode: 200, body: msg });

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return ok("webhook not configured");

  const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
  const sig = event.headers?.["stripe-signature"] || event.headers?.["Stripe-Signature"];
  if (!verifyWebhook(raw, sig, secret)) return { statusCode: 400, body: "Bad signature" };

  let evt;
  try {
    evt = JSON.parse(raw);
  } catch {
    return { statusCode: 400, body: "Bad payload" };
  }
  if (evt.type !== "payment_intent.succeeded") return ok("ignored");

  try {
    const pi = await getPaymentIntent(evt.data.object.id);
    const db = await getDb();
    const purpose = pi.metadata?.purpose;
    if (purpose === "booking") await finalizeBooking(db, pi);
    else if (purpose === "balance" || purpose === "add_seats") await finalizeExtra(db, pi);
  } catch {
    // Already handled, refunded or not ours — nothing for Stripe to retry.
  }
  return ok();
};
