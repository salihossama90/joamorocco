import emailjs from "emailjs-com";
import { prettyDate } from "@shared/dates.mjs";
import { centsToUSD } from "@shared/pricing.mjs";
import { getTour } from "../data/tours";

const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function configured(v) {
	return v && !/^YOUR/i.test(v);
}

export function emailConfigured() {
	return configured(SERVICE) && configured(TEMPLATE) && configured(PUBLIC_KEY);
}

// Fire-and-forget confirmation email. Returns true if sent, false if skipped or
// failed — the caller decides how to surface it (never blocks the UI).
export async function sendConfirmationEmail(booking) {
	if (!emailConfigured()) return false;
	const tour = getTour(booking.tourKey) || { name: booking.tourKey };
	const params = {
		to_email: booking.contact?.email,
		to_name: booking.contact?.name,
		reference: booking.reference,
		tour_name: tour.name,
		start_date: prettyDate(booking.startDate),
		end_date: prettyDate(booking.endDate),
		guests: `${booking.adults} adult(s), ${booking.children} child(ren), ${booking.toddlers} toddler(s)`,
		total: centsToUSD(booking.totalCents || 0),
		// payment schedule: optional in the template ({{paid_today}} etc.)
		paid_today: centsToUSD(booking.payment?.paidCents || 0),
		balance: centsToUSD(booking.payment?.balanceCents || 0),
		balance_due: booking.payment?.balanceCents ? prettyDate(booking.payment.balanceDueDate) : "Paid in full",
	};
	try {
		await emailjs.send(SERVICE, TEMPLATE, params, PUBLIC_KEY);
		return true;
	} catch {
		return false;
	}
}
