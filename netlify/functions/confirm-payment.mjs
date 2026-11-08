// Records a balance payment or added seats once Stripe has the money.
import { getDb } from "./_lib/db.mjs";
import { json, error, requireMethod, parseBody } from "./_lib/respond.mjs";
import { getPaymentIntent, stripeConfigured } from "./_lib/stripe.mjs";
import { serializeBooking } from "./_lib/bookings.mjs";
import { finalizeExtra, paymentSummary, PaymentError } from "./_lib/finalize.mjs";

export const handler = async (event) => {
  const bad = requireMethod(event, "POST");
  if (bad) return bad;
  if (!stripeConfigured()) return error(503, "Online payment isn't available yet.");
  const body = parseBody(event);
  if (!body || !/^pi_\w+$/.test(body.paymentIntentId || "")) return error(400, "Missing payment.");

  try {
    const pi = await getPaymentIntent(body.paymentIntentId);
    const db = await getDb();
    const row = await finalizeExtra(db, pi);
    return json(200, { booking: serializeBooking(row), payment: await paymentSummary(db, row) });
  } catch (err) {
    if (err instanceof PaymentError) return error(err.status, err.message, err.extra);
    return error(502, "We couldn't confirm your payment. If you were charged, please contact us — your payment is safe.");
  }
};
