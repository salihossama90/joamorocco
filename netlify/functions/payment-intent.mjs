// Starts a Stripe payment: prices it on the server and returns the client
// secret the browser's payment form needs. Nothing is booked or charged here.
//   purpose "booking":   a new booking — the deposit (30%), or the full price
//                        when the trip starts within 45 days
//   purpose "balance":   what's left on an existing booking
//   purpose "add_seats": more guests on an existing booking (their share now:
//                        30% before the balance is due, in full after)
import { getDb } from "./_lib/db.mjs";
import { json, error, requireMethod, parseBody } from "./_lib/respond.mjs";
import { createPaymentIntent, stripeConfigured } from "./_lib/stripe.mjs";
import { findOwnedBooking, serializeBooking } from "./_lib/bookings.mjs";
import { paidCents, paymentSummary } from "./_lib/finalize.mjs";
import { isValidTour, tourDays, TOUR_META } from "../../shared/tourMeta.mjs";
import { validateParty, computeQuote } from "../../shared/pricing.mjs";
import { endDateFor, minBookableDate, isValidYMD } from "../../shared/dates.mjs";
import { dueAtBooking, balanceIsDue, depositCents, balanceDueDate } from "../../shared/payments.mjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// No redirect-based methods. Which types show is set in the Stripe dashboard
// (Settings → Payment methods): keep it to cards, Apple Pay and Google Pay,
// which settle instantly so the booking is recorded right away.
const METHODS = { enabled: true, allow_redirects: "never" };

const tourName = (key) => TOUR_META[key]?.name || key;

async function bookingIntent(db, body) {
  const { tour, startDate } = body;
  const adults = Number(body.adults) || 0;
  const children = Number(body.children) || 0;
  const toddlers = Number(body.toddlers) || 0;
  const c = body.contact || {};
  const name = (c.name || "").trim();
  const email = (c.email || "").trim();
  const phone = (c.phone || "").trim();

  if (!isValidTour(tour)) return error(400, "Please choose a valid tour.");
  const party = validateParty(tour, adults, children, toddlers);
  if (!party.ok) return error(400, party.error);
  if (!isValidYMD(startDate)) return error(400, "Please choose a valid start date.");
  if (startDate < minBookableDate()) return error(400, "Bookings must be made at least 14 days in advance.");
  if (!name) return error(400, "Please enter the lead traveler's name.");
  if (!EMAIL_RE.test(email)) return error(400, "Please enter a valid email address.");
  if (!phone) return error(400, "Please enter a contact phone number.");

  // Early check so nobody pays for dates already gone (the booking insert
  // re-checks atomically after payment).
  const endDate = endDateFor(startDate, tourDays(tour));
  const taken = await db.execute({
    sql: `SELECT 1 FROM bookings WHERE status != 'cancelled' AND end_date >= ? AND start_date <= ? LIMIT 1`,
    args: [startDate, endDate],
  });
  if (taken.rows.length) {
    return error(409, "Those dates were just reserved. Please choose another start date.", { code: "dates_taken" });
  }

  const quote = computeQuote(tour, adults, children, toddlers);
  const due = dueAtBooking(quote.totalCents, startDate);
  const requests = (body.specialRequests || "").toString().trim();

  const pi = await createPaymentIntent({
    amount: due.cents,
    currency: "usd",
    automatic_payment_methods: METHODS,
    receipt_email: email,
    description: `${tourName(tour)}, starting ${startDate} — ${due.kind === "full" ? "payment in full" : "30% deposit"}`,
    metadata: {
      purpose: "booking",
      tour,
      startDate,
      adults,
      children,
      toddlers,
      totalCents: quote.totalCents,
      dueCents: due.cents,
      kind: due.kind,
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      phone: phone.slice(0, 60),
      requests: requests.slice(0, 490),
    },
  });

  return json(200, {
    clientSecret: pi.client_secret,
    paymentIntentId: pi.id,
    amountCents: due.cents,
    kind: due.kind,
    totalCents: quote.totalCents,
    balanceCents: quote.totalCents - due.cents,
    balanceDueDate: balanceDueDate(startDate),
  });
}

async function balanceIntent(db, event, body) {
  const row = await findOwnedBooking(db, event, body);
  if (!row) return error(404, "No booking found with that code and email.");
  if (row.status === "cancelled") return error(400, "This booking has been cancelled.");
  const remaining = Number(row.total_cents) - (await paidCents(db, row.id));
  if (remaining <= 0) return error(400, "This booking is already paid in full.");

  const pi = await createPaymentIntent({
    amount: remaining,
    currency: "usd",
    automatic_payment_methods: METHODS,
    description: `${tourName(row.tour_key)} ${row.reference} — balance`,
    metadata: { purpose: "balance", reference: row.reference, dueCents: remaining },
  });
  return json(200, { clientSecret: pi.client_secret, paymentIntentId: pi.id, amountCents: remaining, kind: "balance" });
}

async function addSeatsIntent(db, event, body) {
  const addA = Math.max(0, Number(body.addAdults) || 0);
  const addC = Math.max(0, Number(body.addChildren) || 0);
  const addT = Math.max(0, Number(body.addToddlers) || 0);
  if (addA + addC + addT < 1) return error(400, "Add at least one guest.");

  const row = await findOwnedBooking(db, event, body);
  if (!row) return error(404, "No booking found with that code and email.");
  if (row.status === "cancelled") return error(400, "This booking has been cancelled.");

  const adults = row.adults + addA;
  const children = row.children + addC;
  const toddlers = row.toddlers + addT;
  const party = validateParty(row.tour_key, adults, children, toddlers);
  if (!party.ok) return error(400, party.error);

  // Recompute the whole party: more guests can mean a cheaper tier for everyone
  const quote = computeQuote(row.tour_key, adults, children, toddlers);
  const paid = await paidCents(db, row.id);
  const owedNow = balanceIsDue(row.start_date) ? quote.totalCents : depositCents(quote.totalCents);
  const dueCents = Math.max(0, owedNow - paid);

  // Nothing to pay now (toddlers are free, or it's covered): apply directly
  if (dueCents === 0) {
    await db.execute({
      sql: `UPDATE bookings SET adults = ?, children = ?, toddlers = ?, total_cents = ?, price_breakdown = ?
             WHERE id = ?`,
      args: [adults, children, toddlers, quote.totalCents, JSON.stringify(quote), row.id],
    });
    const updated = { ...row, adults, children, toddlers, total_cents: quote.totalCents, price_breakdown: JSON.stringify(quote) };
    return json(200, { applied: true, booking: serializeBooking(updated), payment: await paymentSummary(db, updated) });
  }

  const pi = await createPaymentIntent({
    amount: dueCents,
    currency: "usd",
    automatic_payment_methods: METHODS,
    description: `${tourName(row.tour_key)} ${row.reference} — added guests`,
    metadata: {
      purpose: "add_seats",
      reference: row.reference,
      adults,
      children,
      toddlers,
      totalCents: quote.totalCents,
      dueCents,
    },
  });
  return json(200, {
    clientSecret: pi.client_secret,
    paymentIntentId: pi.id,
    amountCents: dueCents,
    kind: "add_seats",
    totalCents: quote.totalCents,
  });
}

export const handler = async (event) => {
  const bad = requireMethod(event, "POST");
  if (bad) return bad;
  if (!stripeConfigured()) return error(503, "Online payment isn't available yet. Please contact us to book.");
  const body = parseBody(event);
  if (!body) return error(400, "Invalid JSON");

  try {
    const db = await getDb();
    if (body.purpose === "booking") return await bookingIntent(db, body);
    if (body.purpose === "balance") return await balanceIntent(db, event, body);
    if (body.purpose === "add_seats") return await addSeatsIntent(db, event, body);
    return error(400, "Unknown payment.");
  } catch (err) {
    return error(err.status && err.status < 500 ? 400 : 502, err.message || "Payment could not be started.");
  }
};
