import React, { useState } from "react";
import { prettyDate } from "@shared/dates.mjs";
import { centsToUSD, computeQuote } from "@shared/pricing.mjs";
import { MAX_TRAVELERS } from "@shared/tourMeta.mjs";
import { getTour } from "../../data/tours";
import { api } from "../../lib/api";
import { useToast } from "../../Components/Toast/ToastProvider";

async function downloadPdf(booking) {
	const { downloadBookingPdf } = await import("../../lib/generatePdf");
	downloadBookingPdf(booking);
}

// `auth` is { email }: the booking email the guest looked the trip up with.
export default function TripCard({ booking, onChanged, auth }) {
	const tour = getTour(booking.tourKey);
	const [open, setOpen] = useState(false);
	const [modal, setModal] = useState(null); // 'seats' | 'review' | null

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
					</div>
					{booking.specialRequests && (
						<p className="trip-requests"><span>Requests:</span> {booking.specialRequests}</p>
					)}
					<div className="trip-actions">
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

			{modal === "seats" && (
				<AddSeatsModal booking={booking} auth={auth} onClose={() => setModal(null)} ondone={() => { setModal(null); onChanged?.(); }} />
			)}
			{modal === "review" && (
				<ReviewModal booking={booking} auth={auth} onClose={() => setModal(null)} ondone={() => { setModal(null); onChanged?.(); }} />
			)}
		</div>
	);
}

/* ── Add seats ── */
function AddSeatsModal({ booking, auth, onClose, ondone }) {
	const toast = useToast();
	const [add, setAdd] = useState({ a: 0, c: 0, t: 0 });
	const [card, setCard] = useState({ cardNumber: "", expiry: "", cvc: "" });
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
	const needsPayment = delta > 0;

	const inc = (k, d) => setAdd((s) => ({ ...s, [k]: Math.max(0, s[k] + d) }));

	const submit = async () => {
		if (!addedAny) return toast.error("Add at least one guest.");
		if (overCap) return toast.error(`Maximum ${MAX_TRAVELERS} travelers per tour.`);
		setBusy(true);
		try {
			await api.post("/api/add-seats", {
				reference: booking.reference,
				email: auth?.email,
				addAdults: add.a,
				addChildren: add.c,
				addToddlers: add.t,
				payment: needsPayment
					? { method: "card", cardNumber: card.cardNumber, expiry: card.expiry, cvc: card.cvc }
					: undefined,
			});
			toast.success(delta > 0 ? `Added — ${centsToUSD(delta)} charged.` : "Guests added.");
			onDoneSafe(ondone);
		} catch (e) {
			setBusy(false);
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
				<span>Additional charge</span>
				<strong>{centsToUSD(delta)}</strong>
			</div>
			{needsPayment && (
				<div className="mini-card">
					<input placeholder="Card number" value={card.cardNumber}
						onChange={(e) => setCard({ ...card, cardNumber: e.target.value.replace(/\D/g, "").slice(0,19).replace(/(.{4})/g,"$1 ").trim() })} />
					<div className="field-row">
						<input placeholder="MM/YY" value={card.expiry}
							onChange={(e) => { const d=e.target.value.replace(/\D/g,"").slice(0,4); setCard({ ...card, expiry: d.length>2?`${d.slice(0,2)}/${d.slice(2)}`:d }); }} />
						<input placeholder="CVC" value={card.cvc}
							onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g,"").slice(0,4) })} />
					</div>
					<p className="pay-sim-note">Test mode — use 4242 4242 4242 4242.</p>
				</div>
			)}
			<button className="btn-primary" onClick={submit} disabled={busy || !addedAny || overCap}>
				{busy ? <span className="btn-spinner" /> : needsPayment ? `Pay ${centsToUSD(delta)}` : "Add guests"}
			</button>
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
