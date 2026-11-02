import React, { useState } from "react";
import { api, ApiError } from "../../../lib/api";
import { useToast } from "../../../Components/Toast/ToastProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { centsToUSD } from "@shared/pricing.mjs";
import { sendConfirmationEmail } from "../../../lib/sendConfirmationEmail";

const METHODS = [
	{ id: "card", label: "Card" },
	{ id: "apple_pay", label: "Apple Pay" },
	{ id: "paypal", label: "PayPal" },
	{ id: "zelle", label: "Zelle" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function luhn(num) {
	const d = num.replace(/\D/g, "");
	if (d.length < 12) return false;
	let sum = 0, alt = false;
	for (let i = d.length - 1; i >= 0; i--) {
		let n = +d[i];
		if (alt) { n *= 2; if (n > 9) n -= 9; }
		sum += n; alt = !alt;
	}
	return sum % 10 === 0;
}

const formatCard = (v) =>
	v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v) => {
	const d = v.replace(/\D/g, "").slice(0, 4);
	return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function StepPayment({ data, update, back, onConfirmed, quote }) {
	const toast = useToast();
	const [submitting, setSubmitting] = useState(false);
	const [shake, setShake] = useState(false);
	const [touched, setTouched] = useState({});

	const c = data.contact;
	const p = data.payment;
	const setContact = (patch) => update({ contact: { ...c, ...patch } });
	const setPayment = (patch) => update({ payment: { ...p, ...patch } });
	const mark = (k) => setTouched((t) => ({ ...t, [k]: true }));

	const isCard = p.method === "card";
	// Apple Pay and PayPal pay through their own button, so the generic one hides
	const hasOwnButton = p.method === "apple_pay" || p.method === "paypal";
	const total = centsToUSD(quote.totalCents);
	const cardOk = !isCard || (luhn(p.cardNumber || "") && /^\d{2}\/\d{2}$/.test(p.expiry) && /^\d{3,4}$/.test(p.cvc));
	const contactOk = c.name.trim() && EMAIL_RE.test(c.email.trim()) && c.phone.trim();
	const canPay = contactOk && cardOk && !submitting;

	const fail = (msg) => {
		toast.error(msg);
		setShake(true);
		setTimeout(() => setShake(false), 500);
	};

	const submit = async () => {
		if (!contactOk) return fail("Please complete your contact details.");
		if (!cardOk) return fail("Please check your card details.");
		setSubmitting(true);
		const specialRequests =
			(data.luxury ? "[LUXURY UPGRADE REQUESTED] " : "") + (data.specialRequests || "");
		try {
			const res = await api.post("/api/create-booking", {
				tour: data.tour,
				startDate: data.startDate,
				adults: data.adults,
				children: data.children,
				toddlers: data.toddlers,
				specialRequests: specialRequests.trim(),
				contact: { name: c.name.trim(), email: c.email.trim(), phone: c.phone.trim() },
				payment: isCard
					? { method: p.method, cardNumber: p.cardNumber, expiry: p.expiry, cvc: p.cvc, cardName: p.cardName }
					: { method: p.method },
			});

			const enriched = {
				...res.booking,
				contact: { name: c.name.trim(), email: c.email.trim(), phone: c.phone.trim() },
				paymentStatus: res.paymentStatus,
				paymentMethod: res.paymentMethod,
				instructions: res.instructions,
			};
			// Fire-and-forget confirmation email.
			sendConfirmationEmail(enriched).then((sent) => {
				if (sent) toast.success("Confirmation email sent.");
			});
			onConfirmed({ ...res, booking: enriched });
		} catch (err) {
			setSubmitting(false);
			if (err instanceof ApiError && err.data?.code === "dates_taken") {
				fail("Those dates were just reserved — please pick another start date.");
			} else {
				fail(err.message || "Payment could not be completed.");
			}
		}
	};

	return (
		<div className="step">
			<header className="step-head">
				<h1>Contact & payment</h1>
				<p>Your dates are held while you complete this step.</p>
			</header>

			<div className="pay-grid">
				<section className="pay-block">
					<h3>Lead traveler</h3>
					<label className="field">
						<span className="field-label">Full name</span>
						<input
							type="text"
							value={c.name}
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
								onChange={(e) => setContact({ phone: e.target.value })}
								onBlur={() => mark("phone")}
								className={touched.phone && !c.phone.trim() ? "invalid" : ""}
								placeholder="+1 000 000 0000"
							/>
						</label>
					</div>
				</section>

				<section className="pay-block">
					<h3>Payment method</h3>
					<div className="method-tabs" role="tablist" aria-label="Payment method">
						{METHODS.map((m) => (
							<button
								key={m.id}
								type="button"
								role="tab"
								aria-selected={p.method === m.id}
								className={`method-tab ${p.method === m.id ? "active" : ""}`}
								onClick={() => setPayment({ method: m.id })}
							>
								{m.label}
							</button>
						))}
					</div>

					{isCard && (
						<div className="card-fields">
							{/* STRIPE-INTEGRATION-POINT: mount Stripe Payment Element here */}
							<label className="field">
								<span className="field-label">Name on card</span>
								<input
									type="text"
									value={p.cardName}
									onChange={(e) => setPayment({ cardName: e.target.value })}
									placeholder="Full name"
								/>
							</label>
							<label className="field">
								<span className="field-label">
									Card number
									{p.cardNumber && (
										<span className={`inline-valid ${luhn(p.cardNumber) ? "ok" : "bad"}`}>
											{luhn(p.cardNumber) ? "✓" : "check number"}
										</span>
									)}
								</span>
								<input
									inputMode="numeric"
									autoComplete="cc-number"
									value={p.cardNumber}
									onChange={(e) => setPayment({ cardNumber: formatCard(e.target.value) })}
									placeholder="4242 4242 4242 4242"
								/>
							</label>
							<div className="field-row">
								<label className="field">
									<span className="field-label">Expiry</span>
									<input
										inputMode="numeric"
										autoComplete="cc-exp"
										value={p.expiry}
										onChange={(e) => setPayment({ expiry: formatExpiry(e.target.value) })}
										placeholder="MM/YY"
									/>
								</label>
								<label className="field">
									<span className="field-label">CVC</span>
									<input
										inputMode="numeric"
										autoComplete="cc-csc"
										value={p.cvc}
										onChange={(e) => setPayment({ cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
										placeholder="123"
									/>
								</label>
							</div>
							<p className="pay-sim-note">Test mode — no real charge. Use 4242 4242 4242 4242.</p>
						</div>
					)}

					{p.method === "apple_pay" && (
						<div className="wallet-pane">
							{/* STRIPE-INTEGRATION-POINT: mount the Payment Request / Apple Pay button here */}
							<button
								type="button"
								className={`wallet-btn wallet-apple ${shake ? "shake" : ""}`}
								onClick={submit}
								disabled={!canPay}
								aria-label={`Pay ${total} with Apple Pay`}
							>
								{submitting ? (
									<span className="btn-spinner" aria-label="Processing" />
								) : (
									<>
										<FontAwesomeIcon icon={faApple} /> Pay
									</>
								)}
							</button>
							<p className="pay-sim-note">
								{contactOk
									? `You'll confirm ${total} with Face ID or Touch ID. Test mode — no real charge.`
									: "Fill in your contact details above to continue."}
							</p>
						</div>
					)}

					{p.method === "paypal" && (
						<div className="wallet-pane">
							<button
								type="button"
								className={`wallet-btn wallet-paypal ${shake ? "shake" : ""}`}
								onClick={submit}
								disabled={!canPay}
								aria-label={`Pay ${total} with PayPal`}
							>
								{submitting ? (
									<span className="btn-spinner" aria-label="Processing" />
								) : (
									<>
										<FontAwesomeIcon icon={faPaypal} /> PayPal
									</>
								)}
							</button>
							<p className="pay-sim-note">
								{contactOk
									? `Your dates are held now and we'll email you a PayPal request for ${total}.`
									: "Fill in your contact details above to continue."}
							</p>
						</div>
					)}

					{p.method === "zelle" && (
						<div className="method-note zelle-steps">
							<strong>How to pay with Zelle</strong>
							<ol>
								<li>Tap <strong>Reserve {total}</strong> below to hold your dates and get your confirmation code.</li>
								<li>In your bank's app, send <strong>{total}</strong> by Zelle to <strong>payments@joamorocco.com</strong>.</li>
								<li>Put your confirmation code in the memo so we can match your payment.</li>
							</ol>
							<span>We'll email you once your payment is received.</span>
						</div>
					)}
				</section>
			</div>

			<div className="step-actions">
				<button type="button" className="btn-ghost" onClick={back} disabled={submitting}>
					Back
				</button>
				{!hasOwnButton && (
					<button
						type="button"
						className={`btn-primary btn-pay ${shake ? "shake" : ""}`}
						onClick={submit}
						disabled={!canPay}
					>
						{submitting ? (
							<span className="btn-spinner" aria-label="Processing" />
						) : (
							`${p.method === "zelle" ? "Reserve" : "Pay"} ${total}`
						)}
					</button>
				)}
			</div>
		</div>
	);
}
