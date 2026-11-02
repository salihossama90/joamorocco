import React, { useEffect, useRef, useState } from "react";
import { centsToUSD } from "@shared/pricing.mjs";
import { prettyDate, endDateFor } from "@shared/dates.mjs";
import { getTour } from "../../data/tours";

// Animate a dollar total when it changes (count-up "ticker").
function useCountUp(target) {
	const [value, setValue] = useState(target);
	const fromRef = useRef(target);
	useEffect(() => {
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			setValue(target);
			fromRef.current = target;
			return;
		}
		const from = fromRef.current;
		const start = performance.now();
		const dur = 420;
		let raf;
		const tick = (now) => {
			const t = Math.min(1, (now - start) / dur);
			const eased = 1 - Math.pow(1 - t, 3);
			setValue(Math.round(from + (target - from) * eased));
			if (t < 1) raf = requestAnimationFrame(tick);
			else fromRef.current = target;
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target]);
	return value;
}

export default function PriceSummary({ data, quote, showPrice }) {
	const tour = getTour(data.tour);
	const animatedTotal = useCountUp(quote.totalCents);

	return (
		<aside className="price-summary">
			<div className="price-summary-inner">
				<h3 className="ps-tour">{tour?.name}</h3>
				<div className="ps-facts">
					{data.startDate ? (
						<div className="ps-fact">
							<span>Dates</span>
							<strong>
								{prettyDate(data.startDate)} → {prettyDate(endDateFor(data.startDate, tour.days))}
							</strong>
						</div>
					) : (
						<div className="ps-fact ps-muted">
							<span>Dates</span>
							<strong>Not selected</strong>
						</div>
					)}
					<div className="ps-fact">
						<span>Duration</span>
						<strong>{tour?.days} days</strong>
					</div>
					{showPrice ? (
						<div className="ps-fact">
							<span>Guests</span>
							<strong>
								{data.adults}A · {data.children}C · {data.toddlers}T
							</strong>
						</div>
					) : (
						<div className="ps-fact ps-muted">
							<span>Guests</span>
							<strong>Not selected</strong>
						</div>
					)}
				</div>

				{showPrice ? (
					<>
						<div className="ps-lines">
							<div className="ps-line">
								<span>Per person ({quote.perPersonLabel})</span>
							</div>
							{quote.adults > 0 && (
								<div className="ps-line">
									<span>Adults × {quote.adults}</span>
									<span>{centsToUSD(quote.adultsCents)}</span>
								</div>
							)}
							{quote.children > 0 && (
								<div className="ps-line">
									<span>Children × {quote.children} (50%)</span>
									<span>{centsToUSD(quote.childrenCents)}</span>
								</div>
							)}
							{quote.toddlers > 0 && (
								<div className="ps-line ps-muted">
									<span>Toddlers × {quote.toddlers}</span>
									<span>Free</span>
								</div>
							)}
						</div>

						<div className="ps-total">
							<span>Total</span>
							<strong className="ps-total-amount">{centsToUSD(animatedTotal)}</strong>
						</div>
					</>
				) : (
					<p className="ps-pending">Your total appears once you choose who's travelling.</p>
				)}
				<p className="ps-note">Private tour · reserved exclusively for your group</p>
			</div>
		</aside>
	);
}
