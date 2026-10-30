// Shared booking helpers: ownership resolution (reference + booking email)
// and safe serialization for API responses.
import { decrypt, hmacEmail } from "./crypto.mjs";

// Find a booking the caller is allowed to act on: they must present the
// correct reference + the email it was booked with. `_event` is unused since
// customer accounts were removed (29 Oct 2026); kept so callers stay unchanged.
// Returns the raw DB row or null (caller maps null -> generic 404/403).
export async function findOwnedBooking(db, _event, body = {}) {
  const reference = (body.reference || "").trim().toUpperCase();
  const email = (body.email || "").trim();

  if (reference) {
    const res = await db.execute({
      sql: `SELECT * FROM bookings WHERE reference = ? LIMIT 1`,
      args: [reference],
    });
    const row = res.rows[0];
    if (!row) return null;
    if (email && row.contact_email_hmac === hmacEmail(email)) {
      return row;
    }
    return null;
  }

  return null;
}

// Convert a DB row to the shape the client expects. `includeContact` decrypts
// PII (only for the verified owner); the list view leaves it out.
export function serializeBooking(row, { includeContact = false } = {}) {
  let breakdown = null;
  try {
    breakdown = JSON.parse(row.price_breakdown);
  } catch {
    breakdown = null;
  }
  const out = {
    reference: row.reference,
    tourKey: row.tour_key,
    startDate: row.start_date,
    endDate: row.end_date,
    adults: row.adults,
    children: row.children,
    toddlers: row.toddlers,
    totalCents: row.total_cents,
    breakdown,
    specialRequests: row.special_requests || "",
    status: row.status,
    createdAt: row.created_at,
  };
  if (includeContact) {
    out.contact = {
      name: decrypt(row.contact_name),
      email: decrypt(row.contact_email),
      phone: decrypt(row.contact_phone),
    };
  }
  return out;
}
