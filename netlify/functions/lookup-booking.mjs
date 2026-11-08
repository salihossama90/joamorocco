import { getDb } from "./_lib/db.mjs";
import { json, error, requireMethod, parseBody } from "./_lib/respond.mjs";
import { findOwnedBooking, serializeBooking } from "./_lib/bookings.mjs";
import { paymentSummary } from "./_lib/finalize.mjs";

export const handler = async (event) => {
  const bad = requireMethod(event, "POST");
  if (bad) return bad;

  const body = parseBody(event);
  if (!body) return error(400, "Invalid JSON");
  if (!body.reference || !body.email) {
    return error(400, "Enter your confirmation code and the email you booked with.");
  }

  const db = await getDb();
  const row = await findOwnedBooking(db, event, body);
  // Generic message so we don't confirm which half was wrong.
  if (!row) return error(404, "No booking found with that code and email.");

  const tx = await db.execute({
    sql: `SELECT amount_cents, method, status, kind, card_last4, created_at
            FROM transactions WHERE booking_id = ? ORDER BY created_at ASC`,
    args: [row.id],
  });
  const hasReview = await db.execute({
    sql: `SELECT id FROM reviews WHERE booking_id = ? LIMIT 1`,
    args: [row.id],
  });

  return json(200, {
    booking: {
      ...serializeBooking(row, { includeContact: true }),
      hasReview: hasReview.rows.length > 0,
    },
    payment: await paymentSummary(db, row),
    transactions: tx.rows.map((t) => ({
      amountCents: t.amount_cents,
      method: t.method,
      status: t.status,
      kind: t.kind,
      last4: t.card_last4,
      createdAt: t.created_at,
    })),
  });
};
