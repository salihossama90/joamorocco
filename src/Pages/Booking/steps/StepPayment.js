import React, { useState } from "react";
import { api, ApiError } from "../../../lib/api";
import { useToast } from "../../../Components/Toast/ToastProvider";
import StripePay from "../../../Components/StripePay/StripePay";
import { centsToUSD } from "@shared/pricing.mjs";
import { prettyDate } from "@shared/dates.mjs";
import { dueAtBooking, balanceDueDate } from "@shared/payments.mjs";
import { sendConfirmationEmail } from "../../../lib/sendConfirmationEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact details, then Stripe's secure form. The guest pays the 30% deposit
// (or the full price when the trip is within 45 days); the server prices it,
// and the booking is recorded only once Stripe confirms the payment.
export default function StepPayment({ data, update, back, onConfirmed, quote }) {
	const toast = useToast();
	const [touched, setTouched] = useState({});
	const [intent, setIntent] = useState(null); // { clientSecret, amountCents, kind, … }
	const [starting, setStarting] = useState(false);
	const [finishing, setFinishing] = useState(false);

	const c = data.contact;
	const setContact = (patch) => update({ contact: { ...c, ...patch } });
	const mark = (k) => setTouched((t) => ({ ...t, [k]: true }));
	const contactOk = c.name.trim() && EMAIL_RE.test(c.email.trim()) && c.phone.trim();

	// Shown before the server confirms it (the server's numbers win)
	const due = dueAtBooking(quote.totalCents, data.startDate);
	const dueDate = prettyDate(balanceDueDate(data.startDate));
	const specialRequests = (
		(data.luxury ? "[LUXURY UPGRADE REQUESTED] " : "") + (data.specialRequests || "")
	).trim();

	const startPayment = async () => {
		setTouched({ name: true, email: true, phone: true });
		if (!contactOk) return toast.error("Please complete your contact details.");
		setStarting(true);
		try {
			const res = await api.post("/api/payment-intent", {
				purpose: "booking",
				tour: data.tour,
				startDate: data.startDate,
				adults: data.adults,
				children: data.children,
				toddlers: data.toddlers,
				specialRequests,
				contact: { name: c.name.trim(), email: c.email.trim(), phone: c.phone.trim() },
			});
			setIntent(res);
		} catch (err) {
			if (err instanceof ApiError && err.data?.code === "dates_taken") {
				toast.error("Those dates were just reserved — please go back and pick another start date.");
			} else {
				toast.error(err.message || "Payment could not be started.");
			}
		} finally {
			setStarting(false);
		}
	};

	const onPaid = async (paymentIntent) => {
		setFinishing(true);
		try {
			const res = await api.post("/api/create-booking", {
				paymentIntentId: paymentIntent.id,
				specialRequests,
			});
			const enriched = {
				...res.booking,
				contact: { name: c.name.trim(), email: c.email.trim(), phone: c.phone.trim() },
				payment: res.payment,
			};
			sendConfirmationEmail(enriched).then((sent) => {
				if (sent) toast.success("Confirmation email sent.");
			});
			onConfirmed({ ...res, booking: enriched });
		} catch (err) {
			setFinishing(false);
			toast.error(err.message || "We couldn't confirm your booking. Please contact us — your payment is safe.");
		}
	};

	return (
		<div className="step">
			<header className="step-head">
				<h1>Contact & payment</h1>
				<p>Secure your dates with a 30% deposit. The rest is due 45 days before your trip.</p>
			</header>

			<div className="pay-grid">
				<section className="pay-block">
					<h3>Lead traveler</h3>
					<label className="field">
						<span className="field-label">Full name</span>
						<input
							type="text"
							value={c.name}
							disabled={Boolean(intent)}
							onChange={(e) => setContact({ name: e.target.value })}
							onBlur={() => mark("name")}
							className={touched.name && !c.name.trim() ? "invalid" : ""}
							placeholder="Your name"
						/>
					</label>
					<div className="field-row">
						<label className="field">
							<span className="field-label">Email</span>
							<input
								type="email"
								value={c.email}
								disabled={Boolean(intent)}
								onChange={(e) => setContact({ email: e.target.value })}
								onBlur={() => mark("email")}
								className={touched.email && !EMAIL_RE.test(c.email.trim()) ? "invalid" : ""}
								placeholder="your@email.com"
							/>
						</label>
						<label className="field">
							<span className="field-label">Phone</span>
							<input
								type="tel"
								value={c.phone}
								disabled={Boolean(intent)}
								onChange={(e) => setContact({ phone: e.target.value })}
								onBlur={() => mark("phone")}
								className={touched.phone && !c.phone.trim() ? "invalid" : ""}
								placeholder="+1 000 000 0000"
							/>
						</label>
					</div>
					{intent && (
						<button type="button" className="link-btn pay-edit" onClick={() => setIntent(null)} disabled={finishing}>
							Edit details
						</button>
					)}
				</section>

				<section className="pay-block">
					<h3>Payment</h3>
					<div className="pay-due">
						<div className="pay-due-row">
							<span>{due.kind === "full" ? "Due today (in full)" : "Due today (30% deposit)"}</span>
							<strong>{centsToUSD(intent?.amountCents ?? due.cents)}</strong>
						</div>
						{due.kind === "deposit" ? (
							<div className="pay-due-row pay-due-later">
								<span>Balance, due by {dueDate}</span>
								<span>{centsToUSD(quote.totalCents - due.cents)}</span>
							</div>
						) : (
							<p className="pay-due-note">Your trip starts within 45 days, so it's paid in full today.</p>
						)}
					</div>

					{intent ? (
						<StripePay
							clientSecret={intent.clientSecret}
							amountCents={intent.amountCents}
							label={`Pay ${centsToUSD(intent.amountCents)}`}
							onPaid={onPaid}
							onError={(msg) => toast.error(msg)}
							disabled={finishing}
						/>
					) : (
						<button type="button" className="btn-primary pay-start" onClick={startPayment} disabled={starting}>
							{starting ? <span className="btn-spinner" aria-label="Loading" /> : "Continue to payment"}
						</button>
					)}
				</section>
			</div>

			<div className="step-actions">
				<button type="button" className="btn-ghost" onClick={back} disabled={finishing}>
					Back
				</button>
			</div>
		</div>
	);
}
