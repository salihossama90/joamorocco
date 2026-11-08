// Turning a successful Stripe payment into a booking (or a balance payment,
// or added seats). Called by the browser right after paying AND by Stripe's
// webhook, so every path is idempotent: a PaymentIntent is recorded once,
// keyed by its id (bookings.stripe_intent / transactions.provider_ref).
import { encrypt, hmacEmail, makeReference } from "./crypto.mjs";
import { refundPaymentIntent, cardLast4 } from "./stripe.mjs";
import { isValidTour, tourDays } from "../../../shared/tourMeta.mjs";
import { validateParty, computeQuote } from "../../../shared/pricing.mjs";
import { endDateFor, isValidYMD } from "../../../shared/dates.mjs";
import { balanceDueDate } from "../../../shared/payments.mjs";

export class PaymentError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

// Paid so far: Stripe payments, plus the simulated ones made before Stripe.
export async function paidCents(db, bookingId) {
  const res = await db.execute({
    sql: `SELECT COALESCE(SUM(amount_cents), 0) AS paid FROM transactions
           WHERE booking_id = ? AND status IN ('paid', 'test')`,
    args: [bookingId],
  });
  return Number(res.rows[0]?.paid || 0);
}

// What the guest has paid, what's left and when it's due.
export async function paymentSummary(db, row) {
  const paid = await paidCents(db, row.id);
  const total = Number(row.total_cents);
  return {
    paidCents: paid,
    balanceCents: Math.max(0, total - paid),
    balanceDueDate: balanceDueDate(row.start_date),
  };
}

async function bookingByIntent(db, intentId) {
  const res = await db.execute({
    sql: `SELECT * FROM bookings WHERE stripe_intent = ? LIMIT 1`,
    args: [intentId],
  });
  return res.rows[0] || null;
}

async function refundAndFail(pi, status, message, extra) {
  try {
    await refundPaymentIntent(pi.id);
  } catch {
    // Refund failures surface in the Stripe dashboard; the guest still sees why.
  }
  throw new PaymentError(status, message, { refunded: true, ...extra });
}

// A new booking from a paid deposit (or full payment). Everything comes from
// the intent's metadata, which only the server wrote.
export async function finalizeBooking(db, pi, { specialRequests } = {}) {
  const m = pi.metadata || {};
  if (m.purpose !== "booking") throw new PaymentError(400, "This payment isn't for a new booking.");
  if (pi.status !== "succeeded") throw new PaymentError(402, "The payment hasn't gone through yet.");

  const existing = await bookingByIntent(db, pi.id);
  if (existing) return existing;

  const tour = m.tour;
  const startDate = m.startDate;
  const adults = Number(m.adults);
  const children = Number(m.children);
  const toddlers = Number(m.toddlers);
  const quote = computeQuote(tour, adults, children, toddlers);
  const valid =
    isValidTour(tour) &&
    isValidYMD(startDate) &&
    validateParty(tour, adults, children, toddlers).ok &&
    quote.totalCents === Number(m.totalCents) &&
    pi.amount_received === Number(m.dueCents);
  if (!valid) await refundAndFail(pi, 400, "Something didn't match on this booking, so the payment was refunded.");

  const endDate = endDateFor(startDate, tourDays(tour));
  const requests = (specialRequests ?? m.requests ?? "").toString().trim().slice(0, 2000) || null;
  const reference = makeReference();

  // Atomic: the insert only happens if the dates are still free.
  const ins = await db.execute({
    sql: `INSERT INTO bookings
            (reference, tour_key, start_date, end_date, adults, children, toddlers,
             total_cents, price_breakdown, special_requests, status, user_id,
             contact_name, contact_email, contact_email_hmac, contact_phone, stripe_intent)
          SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', NULL, ?, ?, ?, ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM bookings
             WHERE status != 'cancelled' AND end_date >= ? AND start_date <= ?
          )`,
    args: [
      reference, tour, startDate, endDate, adults, children, toddlers,
      quote.totalCents, JSON.stringify(quote), requests,
      encrypt(m.name || ""), encrypt(m.email || ""), hmacEmail(m.email || ""),
      m.phone ? encrypt(m.phone) : null, pi.id,
      startDate, endDate,
    ],
  });

  if (ins.rowsAffected === 0) {
    // The other path (browser or webhook) may have just recorded this payment.
    const again = await bookingByIntent(db, pi.id);
    if (again) return again;
    await refundAndFail(
      pi,
      409,
      "Those dates were just reserved by someone else. Your payment has been refunded — please choose another start date.",
      { code: "dates_taken" }
    );
  }

  const bookingId = Number(ins.lastInsertRowid);
  await db.execute({
    sql: `INSERT INTO transactions
            (booking_id, amount_cents, method, status, provider, provider_ref, card_last4, kind)
          VALUES (?, ?, 'card', 'paid', 'stripe', ?, ?, ?)`,
    args: [bookingId, pi.amount_received, pi.id, cardLast4(pi), m.kind === "full" ? "full" : "deposit"],
  });

  const res = await db.execute({ sql: `SELECT * FROM bookings WHERE id = ?`, args: [bookingId] });
  return res.rows[0];
}

// A balance payment or added seats on an existing booking.
export async function finalizeExtra(db, pi) {
  const m = pi.metadata || {};
  if (m.purpose !== "balance" && m.purpose !== "add_seats") {
    throw new PaymentError(400, "This payment isn't for an existing booking.");
  }
  if (pi.status !== "succeeded") throw new PaymentError(402, "The payment hasn't gone through yet.");

  const found = await db.execute({
    sql: `SELECT * FROM bookings WHERE reference = ? LIMIT 1`,
    args: [m.reference],
  });
  const row = found.rows[0];
  if (!row) await refundAndFail(pi, 404, "We couldn't find that booking, so the payment was refunded.");
  if (pi.amount_received !== Number(m.dueCents)) {
    await refundAndFail(pi, 400, "Something didn't match on this payment, so it was refunded.");
  }

  const done = await db.execute({
    sql: `SELECT 1 FROM transactions WHERE provider_ref = ? LIMIT 1`,
    args: [pi.id],
  });
  if (done.rows.length) {
    const fresh = await db.execute({ sql: `SELECT * FROM bookings WHERE id = ?`, args: [row.id] });
    return fresh.rows[0];
  }

  if (m.purpose === "add_seats") {
    const adults = Number(m.adults);
    const children = Number(m.children);
    const toddlers = Number(m.toddlers);
    const quote = computeQuote(row.tour_key, adults, children, toddlers);
    if (!validateParty(row.tour_key, adults, children, toddlers).ok || quote.totalCents !== Number(m.totalCents)) {
      await refundAndFail(pi, 400, "Those seats couldn't be added, so the payment was refunded.");
    }
    await db.execute({
      sql: `UPDATE bookings SET adults = ?, children = ?, toddlers = ?, total_cents = ?, price_breakdown = ?
             WHERE id = ?`,
      args: [adults, children, toddlers, quote.totalCents, JSON.stringify(quote), row.id],
    });
  }

  try {
    await db.execute({
      sql: `INSERT INTO transactions
              (booking_id, amount_cents, method, status, provider, provider_ref, card_last4, kind)
            VALUES (?, ?, 'card', 'paid', 'stripe', ?, ?, ?)`,
      args: [row.id, pi.amount_received, pi.id, cardLast4(pi), m.purpose],
    });
  } catch {
    // Unique provider_ref: the other path recorded it a moment ago.
  }
  const fresh = await db.execute({ sql: `SELECT * FROM bookings WHERE id = ?`, args: [row.id] });
  return fresh.rows[0];
}
