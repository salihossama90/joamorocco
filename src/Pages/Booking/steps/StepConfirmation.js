import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { prettyDate } from "@shared/dates.mjs";
import { centsToUSD } from "@shared/pricing.mjs";
import { getTour } from "../../../data/tours";
import { burstConfetti } from "../../../lib/confetti";
import { useToast } from "../../../Components/Toast/ToastProvider";

export default function StepConfirmation({ result, onStartOver }) {
	const toast = useToast();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		burstConfetti();
	}, []);

	if (!result) {
		return (
			<div className="step">
				<p>No booking to show. <Link to="/book">Start a booking</Link>.</p>
			</div>
		);
	}

	const booking = result.booking;
	const tour = getTour(booking.tourKey);
	const b = booking.breakdown || {};
	const pending = result.paymentStatus === "pending";

	const copyRef = () => {
		navigator.clipboard?.writeText(booking.reference).then(
			() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1800);
			},
			() => {}
		);
	};

	const downloadPdf = async () => {
		try {
			const { downloadBookingPdf } = await import("../../../lib/generatePdf");
			downloadBookingPdf(booking);
		} catch {
			toast.error("Could not generate the PDF. Please try again.");
		}
	};

	return (
		<div className="step step-confirm">
			<div className="confirm-check" aria-hidden="true">
				<svg viewBox="0 0 52 52">
					<circle className="cc-circle" cx="26" cy="26" r="24" fill="none" />
					<path className="cc-tick" fill="none" d="M14 27l8 8 16-16" />
				</svg>
			</div>

			<h1>You're booked!</h1>
			<p className="confirm-sub">
				Your private {tour?.name} is reserved. A confirmation has been sent to{" "}
				{booking.contact?.email}.
			</p>

			<div className="confirm-ref">
				<span>Confirmation code</span>
				<div className="confirm-ref-row">
					<strong>{booking.reference}</strong>
					<button type="button" className="copy-btn" onClick={copyRef}>
						{copied ? "Copied ✓" : "Copy"}
					</button>
				</div>
			</div>

			<div className="confirm-card">
				<div className="confirm-line">
					<span>Tour</span>
					<strong>{tour?.name}</strong>
				</div>
				<div className="confirm-line">
					<span>Dates</span>
					<strong>
						{prettyDate(booking.startDate)} → {prettyDate(booking.endDate)}
					</strong>
				</div>
				<div className="confirm-line">
					<span>Guests</span>
					<strong>
						{booking.adults} adults{booking.children ? `, ${booking.children} children` : ""}
						{booking.toddlers ? `, ${booking.toddlers} toddlers` : ""}
					</strong>
				</div>
				<div className="confirm-line total">
					<span>Total</span>
					<strong>{centsToUSD(booking.totalCents)}</strong>
				</div>
			</div>

			{pending && result.instructions && (
				<div className="confirm-instructions">
					<strong>Complete your payment</strong>
					<p>{result.instructions}</p>
				</div>
			)}

			<div className="confirm-actions">
				<button type="button" className="btn-primary" onClick={downloadPdf}>
					Download PDF itinerary
				</button>
			</div>

			<p className="confirm-sub">
				Everything has been emailed to you. Reopen this trip any time with your confirmation code and
				email at <Link to="/find-booking">Find your booking</Link>.
			</p>

			<button type="button" className="link-btn" onClick={onStartOver}>
				Book another tour
			</button>
		</div>
	);
}
