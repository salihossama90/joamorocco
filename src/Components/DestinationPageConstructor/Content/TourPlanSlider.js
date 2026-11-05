import { useEffect, useRef, useState } from "react";
import "./TourPlanSlider.css";

// Tour plan, day by day: a numbered timeline across the top (it fills in
// orange up to the selected day), a row of photo cards underneath that you
// can swipe or scroll, and the selected day's details below the cards.
// The timeline, the cards, the arrows and scrolling all stay in step.
// A day's `image` is optional — without one the card shows a placeholder.

const pad = (n) => String(n).padStart(2, "0");

const reducedMotion = () =>
	window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// Placeholder until real photos are chosen: a muted tone that shifts per day
const placeholder = (day) => {
	const hue = (20 + day * 29) % 360;
	return `linear-gradient(160deg, hsl(${hue} 24% 42%) 0%, hsl(${hue} 20% 24%) 100%)`;
};
const cardBg = (item) =>
	item.image ? `url("${item.image}") center / cover no-repeat` : placeholder(item.day);

const TourPlanSlider = ({ info }) => {
	const total = info.length;
	const [at, setAt] = useState(0);
	const trackRef = useRef(null);
	const cardRefs = useRef([]);
	const lockUntil = useRef(0); // ignore scroll events while we scroll for the user
	const frame = useRef(0);

	// selecting a day scrolls its card to the start of the row
	const select = (i) => {
		const next = Math.max(0, Math.min(total - 1, i));
		setAt(next);
		const track = trackRef.current;
		const card = cardRefs.current[next];
		if (!track || !card) return;
		const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
		lockUntil.current = Date.now() + 700;
		track.scrollTo({
			left: card.offsetLeft - padLeft,
			behavior: reducedMotion() ? "auto" : "smooth",
		});
	};

	// scrolling the row by hand selects the card nearest its start
	const onScroll = () => {
		if (Date.now() < lockUntil.current) return;
		cancelAnimationFrame(frame.current);
		frame.current = requestAnimationFrame(() => {
			const track = trackRef.current;
			if (!track) return;
			const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
			const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
			let best = 0;
			if (atEnd) best = total - 1;
			else {
				let dist = Infinity;
				cardRefs.current.forEach((c, i) => {
					const d = Math.abs(c.offsetLeft - padLeft - track.scrollLeft);
					if (d < dist) {
						dist = d;
						best = i;
					}
				});
			}
			setAt(best);
		});
	};
	useEffect(() => () => cancelAnimationFrame(frame.current), []);

	const onKey = (e) => {
		if (e.key === "ArrowRight") select(at + 1);
		if (e.key === "ArrowLeft") select(at - 1);
	};

	const day = info[at];
	const progress = total > 1 ? (at / (total - 1)) * 100 : 0;

	return (
		<section className="tpd" aria-labelledby="tpd-title" onKeyDown={onKey}>
			<div className="tpd-inner">
				<header className="tpd-head">
					<div>
						<p className="tpd-sub">Day by day, all {total} days</p>
						<h2 className="tpd-title" id="tpd-title">
							Tour Plan
						</h2>
					</div>
					<div className="tpd-arrows">
						<button
							type="button"
							onClick={() => select(at - 1)}
							disabled={at === 0}
							aria-label="Previous day"
						>
							‹
						</button>
						<button
							type="button"
							onClick={() => select(at + 1)}
							disabled={at === total - 1}
							aria-label="Next day"
						>
							›
						</button>
					</div>
				</header>

				{/* numbered timeline */}
				<div className="tpd-line">
					<span className="tpd-line-track" aria-hidden="true">
						<span className="tpd-line-fill" style={{ width: `${progress}%` }} />
					</span>
					<ol className="tpd-steps">
						{info.map((d, i) => (
							<li key={d.day}>
								<button
									type="button"
									className={`${i === at ? "is-active" : ""} ${i < at ? "is-past" : ""}`}
									onClick={() => select(i)}
									aria-label={`Day ${d.day}: ${d.title}`}
									aria-current={i === at ? "step" : undefined}
								>
									<span className="tpd-dot">{i === at ? d.day : ""}</span>
									<span className="tpd-num">{pad(d.day)}</span>
								</button>
							</li>
						))}
					</ol>
				</div>
			</div>

			{/* photo cards: scroll or swipe */}
			<div className="tpd-track" ref={trackRef} onScroll={onScroll}>
				{info.map((d, i) => (
					<button
						type="button"
						key={d.day}
						ref={(el) => (cardRefs.current[i] = el)}
						className={`tpd-card ${i === at ? "is-active" : ""}`}
						style={{ background: cardBg(d) }}
						onClick={() => select(i)}
						tabIndex={-1}
						aria-hidden="true"
					>
						{!d.image && <span className="tpd-ph">Photo placeholder</span>}
						<span className="tpd-card-day">Day {pad(d.day)}</span>
						<span className="tpd-card-title">{d.title}</span>
					</button>
				))}
			</div>

			{/* the selected day */}
			<div className="tpd-inner">
				<div className="tpd-detail" key={day.day} aria-live="polite">
					<div className="tpd-detail-main">
						<p className="tpd-detail-day">
							Day {day.day} of {total}
						</p>
						<h3 className="tpd-detail-title">{day.title}</h3>
						<p className="tpd-detail-desc">{day.description}</p>
					</div>
					<ul className="tpd-acts">
						{day.activities.map((a) => (
							<li key={a}>{a}</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default TourPlanSlider;
