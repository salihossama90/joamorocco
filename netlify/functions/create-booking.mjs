import { getDb } from "./_lib/db.mjs";
import { json, error, requireMethod, parseBody } from "./_lib/respond.mjs";
import { encrypt, hmacEmail, makeReference } from "./_lib/crypto.mjs";
import { processPayment } from "./_lib/payment.mjs";
import { serializeBooking } from "./_lib/bookings.mjs";
import { isValidTour, tourDays } from "../../shared/tourMeta.mjs";
import { validateParty, computeQuote } from "../../shared/pricing.mjs";
import { endDateFor, minBookableDate, isValidYMD } from "../../shared/dates.mjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handler = async (event) => {
  const bad = requireMethod(event, "POST");
  if (bad) return bad;

  const body = parseBody(event);
  if (!body) return error(400, "Invalid JSON");

  const tour = body.tour;
  const startDate = body.startDate;
  const adults = Number(body.adults) || 0;
  const children = Number(body.children) || 0;
  const toddlers = Number(body.toddlers) || 0;
  const contact = body.contact || {};

  // ── Validate tour + party ──
  if (!isValidTour(tour)) return error(400, "Please choose a valid tour.");
  const party = validateParty(tour, adults, children, toddlers);
  if (!party.ok) return error(400, party.error);

  // ── Validate date + 14-day advance rule ──
  if (!isValidYMD(startDate)) return error(400, "Please choose a valid start date.");
  if (startDate < minBookableDate()) {
    return error(400, "Bookings must be made at least 14 days in advance.");
  }
  const endDate = endDateFor(startDate, tourDays(tour));

  // ── Validate contact ──
  const name = (contact.name || "").trim();
  const email = (contact.email || "").trim();
  const phone = (contact.phone || "").trim();
  if (!name) return error(400, "Please enter the lead traveler's name.");
  if (!EMAIL_RE.test(email)) return error(400, "Please enter a valid email address.");
  if (!phone) return error(400, "Please enter a contact phone number.");

  // ── Recompute price on the server (never trust the client) ──
  const quote = computeQuote(tour, adults, children, toddlers);

  // ── Simulated payment ──
  const pay = processPayment(body.payment || {});
  if (!pay.ok) return error(402, pay.error);

  const db = await getDb();
  const reference = makeReference();

  // ── Atomic conflict-check + insert in a SINGLE statement ──
  // INSERT ... SELECT ... WHERE NOT EXISTS(overlap) is atomic in SQLite, so two
  // concurrent bookings for overlapping dates can't both succeed. If a conflict
  // exists, zero rows are inserted and we report 409.
  const insertBooking = await db.execute({
    sql: `INSERT INTO bookings
            (reference, tour_key, start_date, end_date, adults, children, toddlers,
             total_cents, price_breakdown, special_requests, status, user_id,
             contact_name, contact_email, contact_email_hmac, contact_phone)
          SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM bookings
             WHERE status != 'cancelled'
               AND end_date >= ? AND start_date <= ?
          )`,
    args: [
      reference,
      tour,
      startDate,
      endDate,
      adults,
      children,
      toddlers,
      quote.totalCents,
      JSON.stringify(quote),
      (body.specialRequests || "").trim().slice(0, 2000) || null,
      null, // user_id: customer accounts were removed (29 Oct 2026); every booking is a guest booking
      encrypt(name),
      encrypt(email),
      hmacEmail(email),
      phone ? encrypt(phone) : null,
      startDate,
      endDate,
    ],
  });

  if (insertBooking.rowsAffected === 0) {
    return error(409, "Those dates were just reserved. Please choose another start date.", {
      code: "dates_taken",
    });
  }

  const bookingId = Number(insertBooking.lastInsertRowid);

  // ── Record the (simulated) transaction ──
  await db.execute({
    sql: `INSERT INTO transactions
            (booking_id, amount_cents, method, status, provider, card_last4, kind)
          VALUES (?, ?, ?, ?, 'simulated', ?, 'initial')`,
    args: [bookingId, quote.totalCents, pay.method, pay.txStatus, pay.last4],
  });

  const row = {
    reference,
    tour_key: tour,
    start_date: startDate,
    end_date: endDate,
    adults,
    children,
    toddlers,
    total_cents: quote.totalCents,
    price_breakdown: JSON.stringify(quote),
    special_requests: (body.specialRequests || "").trim(),
    status: "confirmed",
    created_at: new Date().toISOString(),
  };

  return json(201, {
    booking: serializeBooking(row),
    paymentStatus: pay.txStatus,
    paymentMethod: pay.method,
    instructions: pay.instructions,
  });
};
