import React, { useState } from "react";
import { prettyDate } from "@shared/dates.mjs";
import { centsToUSD, computeQuote } from "@shared/pricing.mjs";
import { MAX_TRAVELERS } from "@shared/tourMeta.mjs";
import { getTour } from "../../data/tours";
import { api } from "../../lib/api";
import { useToast } from "../../Components/Toast/ToastProvider";
import StripePay from "../../Components/StripePay/StripePay";
import { balanceIsDue, depositCents } from "@shared/payments.mjs";

async function downloadPdf(booking) {
	const { downloadBookingPdf } = await import("../../lib/generatePdf");
	downloadBookingPdf(booking);
}

// `auth` is { email }: the booking email the guest looked the trip up with.
export default function TripCard({ booking, onChanged, auth }) {
	const tour = getTour(booking.tourKey);
	const [open, setOpen] = useState(false);
	const [modal, setModal] = useState(null); // 'seats' | 'balance' | 'review' | null
	const pay = booking.payment;
	const owes = pay && pay.balanceCents > 0 && booking.status !== "cancelled";

	const statusClass =
		booking.status === "cancelled" ? "cancelled" : booking.status === "pending" ? "pending" : "confirmed";

	return (
		<div className="trip-card">
			<button className="trip-summary" onClick={() => setOpen((o) => !o)}>
				<div
					className="trip-thumb"
					style={{ backgroundImage: `url(${tour?.heroImage})` }}
				/>
				<div className="trip-info">
					<h3>{tour?.name}</h3>
					<p>{prettyDate(booking.startDate)} → {prettyDate(booking.endDate)}</p>
					<span className={`trip-status ${statusClass}`}>{booking.status}</span>
				</div>
				<div className="trip-meta">
					<strong>{centsToUSD(booking.totalCents)}</strong>
					<span className="trip-ref">{booking.reference}</span>
					<span className={`trip-caret ${open ? "up" : ""}`}>⌄</span>
				</div>
			</button>

			{open && (
				<div className="trip-detail">
					<div className="trip-detail-grid">
						<div><span>Guests</span><strong>{booking.adults}A · {booking.children}C · {booking.toddlers}T</strong></div>
						<div><span>Duration</span><strong>{tour?.days} days</strong></div>
						<div><span>Reference</span><strong>{booking.reference}</strong></div>
						{pay && <div><span>Paid</span><strong>{centsToUSD(pay.paidCents)}</strong></div>}
						{pay && (
							<div>
								<span>{owes ? `Balance · due ${prettyDate(pay.balanceDueDate)}` : "Balance"}</span>
								<strong>{owes ? centsToUSD(pay.balanceCents) : "Paid in full"}</strong>
							</div>
						)}
					</div>
					{booking.specialRequests && (
						<p className="trip-requests"><span>Requests:</span> {booking.specialRequests}</p>
					)}
					<div className="trip-actions">
						{owes && (
							<button className="btn-primary sm" onClick={() => setModal("balance")}>
								Pay balance · {centsToUSD(pay.balanceCents)}
							</button>
						)}
						<button className="btn-ghost sm" onClick={() => downloadPdf(booking)}>Download PDF</button>
						{booking.status !== "cancelled" && (
							<button className="btn-ghost sm" onClick={() => setModal("seats")}>Add seats</button>
						)}
						{!booking.hasReview && (
							<button className="btn-primary sm" onClick={() => setModal("review")}>Leave a review</button>
						)}
						{booking.hasReview && <span className="trip-reviewed">✓ Reviewed</span>}
					</div>
				</div>
			)}

			{modal === "balance" && (
				<PayBalanceModal booking={booking} auth={auth} onClose={() => setModal(null)} ondone={() => { setModal(null); onChanged?.(); }} />
			)}
			{modal === "seats" && (
				<AddSeatsModal booking={booking} auth={auth} onClose={() => setModal(null)} ondone={() => { setModal(null); onChanged?.(); }} />
			)}
			{modal === "review" && (
				<ReviewModal booking={booking} auth={auth} onClose={() => setModal(null)} ondone={() => { setModal(null); onChanged?.(); }} />
			)}
		</div>
	);
}

/* ── Pay balance ── */
function PayBalanceModal({ booking, auth, onClose, ondone }) {
	const toast = useToast();
	const [intent, setIntent] = useState(null);
	const [busy, setBusy] = useState(false);

	const start = async () => {
		setBusy(true);
		try {
			setIntent(await api.post("/api/payment-intent", { purpose: "balance", reference: booking.reference, email: auth?.email }));
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	};

	const onPaid = async (pi) => {
		try {
			await api.post("/api/confirm-payment", { paymentIntentId: pi.id });
			toast.success("Balance paid — thank you! Your trip is paid in full.");
			onDoneSafe(ondone);
		} catch (e) {
			toast.error(e.message);
		}
	};

	return (
		<Modal title="Pay your balance" onClose={onClose}>
			<div className="mini-delta">
				<span>Balance due by {prettyDate(booking.payment.balanceDueDate)}</span>
				<strong>{centsToUSD(booking.payment.balanceCents)}</strong>
			</div>
			{intent ? (
				<StripePay
					clientSecret={intent.clientSecret}
							amountCents={intent.amountCents}
					label={`Pay ${centsToUSD(intent.amountCents)}`}
					onPaid={onPaid}
					onError={(m) => toast.error(m)}
				/>
			) : (
				<button className="btn-primary" onClick={start} disabled={busy}>
					{busy ? <span className="btn-spinner" /> : "Continue to payment"}
				</button>
			)}
		</Modal>
	);
}

/* ── Add seats ── */
// Added guests pay their share now: 30% before the balance is due, in full
// after (the server prices it; this is the preview)
function AddSeatsModal({ booking, auth, onClose, ondone }) {
	const toast = useToast();
	const [add, setAdd] = useState({ a: 0, c: 0, t: 0 });
	const [intent, setIntent] = useState(null);
	const [busy, setBusy] = useState(false);

	const newA = booking.adults + add.a;
	const newC = booking.children + add.c;
	const newT = booking.toddlers + add.t;
	const newTotalGuests = newA + newC + newT;
	const overCap = newTotalGuests > MAX_TRAVELERS;
	const addedAny = add.a + add.c + add.t > 0;

	const oldQuote = computeQuote(booking.tourKey, booking.adults, booking.children, booking.toddlers);
	const newQuote = computeQuote(booking.tourKey, newA, newC, newT);
	const delta = Math.max(0, newQuote.totalCents - oldQuote.totalCents);
	const paid = booking.payment?.paidCents ?? oldQuote.totalCents;
	const owedNow = balanceIsDue(booking.startDate) ? newQuote.totalCents : depositCents(newQuote.totalCents);
	const dueNow = Math.max(0, owedNow - paid);

	const inc = (k, d) => {
		setIntent(null);
		setAdd((s) => ({ ...s, [k]: Math.max(0, s[k] + d) }));
	};

	const start = async () => {
		if (!addedAny) return toast.error("Add at least one guest.");
		if (overCap) return toast.error(`Maximum ${MAX_TRAVELERS} travelers per tour.`);
		setBusy(true);
		try {
			const res = await api.post("/api/payment-intent", {
				purpose: "add_seats",
				reference: booking.reference,
				email: auth?.email,
				addAdults: add.a,
				addChildren: add.c,
				addToddlers: add.t,
			});
			if (res.applied) {
				toast.success("Guests added.");
				onDoneSafe(ondone);
			} else {
				setIntent(res);
			}
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	};

	const onPaid = async (pi) => {
		try {
			await api.post("/api/confirm-payment", { paymentIntentId: pi.id });
			toast.success("Guests added — thank you!");
			onDoneSafe(ondone);
		} catch (e) {
			toast.error(e.message);
		}
	};

	return (
		<Modal title="Add guests" onClose={onClose}>
			<div className="mini-counters">
				{[["a", "Adults"], ["c", "Children (50%)"], ["t", "Toddlers (free)"]].map(([k, label]) => (
					<div className="mini-counter" key={k}>
						<span>{label}</span>
						<div className="counter">
							<button className="counter-btn" onClick={() => inc(k, -1)} disabled={add[k] <= 0}>−</button>
							<span className="counter-value">{add[k]}</span>
							<button className="counter-btn" onClick={() => inc(k, 1)} disabled={overCap}>+</button>
						</div>
					</div>
				))}
			</div>
			<p className="mini-note">
				New party: {newTotalGuests} of {MAX_TRAVELERS} seats
				{overCap && " — over capacity"}
			</p>
			<div className="mini-delta">
				<span>Trip total goes up by</span>
				<strong>{centsToUSD(delta)}</strong>
			</div>
			{addedAny && (
				<p className="mini-note">
					{dueNow > 0
						? `Due now: ${centsToUSD(dueNow)}${balanceIsDue(booking.startDate) ? "" : " (30%) — the rest joins your balance"}.`
						: "Nothing to pay now — it's added to your trip."}
				</p>
			)}
			{intent ? (
				<StripePay
					clientSecret={intent.clientSecret}
							amountCents={intent.amountCents}
					label={`Pay ${centsToUSD(intent.amountCents)}`}
					onPaid={onPaid}
					onError={(m) => toast.error(m)}
				/>
			) : (
				<button className="btn-primary" onClick={start} disabled={busy || !addedAny || overCap}>
					{busy ? <span className="btn-spinner" /> : dueNow > 0 ? "Continue to payment" : "Add guests"}
				</button>
			)}
		</Modal>
	);
}

/* ── Review ── */
function ReviewModal({ booking, auth, onClose, ondone }) {
	const toast = useToast();
	const [stars, setStars] = useState(5);
	const [hover, setHover] = useState(0);
	const [name, setName] = useState("");
	const [text, setText] = useState("");
	const [busy, setBusy] = useState(false);

	const submit = async () => {
		if (!text.trim()) return toast.error("Please write a short review.");
		setBusy(true);
		try {
			await api.post("/api/submit-review", {
				reference: booking.reference,
				email: auth?.email,
				name: name.trim() || undefined,
				stars,
				review: text.trim(),
			});
			toast.success("Thank you for your review!");
			onDoneSafe(ondone);
		} catch (e) {
			setBusy(false);
			toast.error(e.message);
		}
	};

	return (
		<Modal title="How was your trip?" onClose={onClose}>
			<div className="stars-input" onMouseLeave={() => setHover(0)}>
				{[1, 2, 3, 4, 5].map((n) => (
					<button
						key={n}
						type="button"
						className={`star-btn ${n <= (hover || stars) ? "active" : ""}`}
						onMouseEnter={() => setHover(n)}
						onClick={() => setStars(n)}
						aria-label={`${n} stars`}
					>
						★
					</button>
				))}
			</div>
			<input className="review-name-input" placeholder="Display name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
			<textarea rows={4} placeholder="Tell future travelers about your experience…" value={text} onChange={(e) => setText(e.target.value)} />
			<button className="btn-primary" onClick={submit} disabled={busy}>
				{busy ? <span className="btn-spinner" /> : "Post review"}
			</button>
		</Modal>
	);
}

function onDoneSafe(fn) {
	try { fn?.(); } catch { /* ignore */ }
}

function Modal({ title, children, onClose }) {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<div className="modal-head">
					<h3>{title}</h3>
					<button className="modal-close" onClick={onClose} aria-label="Close">×</button>
				</div>
				{children}
			</div>
		</div>
	);
}
