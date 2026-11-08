// Payment schedule — shared by the booking UI and the server (which
// recomputes and never trusts client math). Money is integer cents.
//
//   30% deposit at booking; the balance is due 45 days before the trip starts.
//   Booking inside those 45 days (or after the due date) means paying in full.
import { addDays, todayYMD } from "./dates.mjs";

export const DEPOSIT_RATE = 0.3;
export const BALANCE_DUE_DAYS = 45;

// YYYY-MM-DD the balance is due for a trip starting `startDate`.
export function balanceDueDate(startDate) {
  return addDays(startDate, -BALANCE_DUE_DAYS);
}

// Has the balance due date arrived (so anything owed is owed in full now)?
export function balanceIsDue(startDate, today = todayYMD()) {
  return today >= balanceDueDate(startDate);
}

export function depositCents(totalCents) {
  return Math.round(totalCents * DEPOSIT_RATE);
}

// What a new booking pays today: the deposit, or the full price when the
// balance would already be due.
export function dueAtBooking(totalCents, startDate, today = todayYMD()) {
  const full = balanceIsDue(startDate, today);
  return { cents: full ? totalCents : depositCents(totalCents), kind: full ? "full" : "deposit" };
}
