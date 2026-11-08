import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTour } from "../../../data/tours";
import { MAP, MOROCCO, NEIGHBOURS } from "./routeMapLand";
import "./TourItinerary.css";

// Day-by-day itinerary, laid out after the user's reference screenshots:
// the tour's places in order, each with a big name, a short intro and
// "Days 2–3", then one white card per day (text on one side, a small photo
// slider on the other, alternating), a dotted line with a dot per day down
// the left, and a route map on the right that stays in view and lights up
// place by place as you scroll.

const range = (days) => (days.length > 1 ? `Days ${days[0]}–${days.at(-1)}` : `Day ${days[0]}`);

// ── Photo slider for one day: fades between photos, dots + swipe ──
const DayPhotos = ({ images, alt }) => {
	const [i, setI] = useState(0);
	const touchX = useRef(null);
	const n = images.length;
	const go = (d) => setI((x) => (x + d + n) % n);

	return (
		<div
			className="tit-photos"
			onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
			onTouchEnd={(e) => {
				if (touchX.current == null) return;
				const dx = e.changedTouches[0].clientX - touchX.current;
				touchX.current = null;
				if (n > 1 && Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
			}}
		>
			{images.map((src, k) => (
				<img
					key={src}
					src={src}
					alt={k === i ? alt : ""}
					loading="lazy"
					className={k === i ? "is-active" : ""}
				/>
			))}
			{n > 1 && (
				<div className="tit-photo-dots">
					{images.map((src, k) => (
						<button
							type="button"
							key={src}
							className={k === i ? "is-active" : ""}
							aria-label={`Photo ${k + 1} of ${n}`}
							aria-current={k === i ? "true" : undefined}
							onClick={() => setI(k)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

// ── Route map: Morocco's outline (Natural Earth) with the places at their
// real positions, joined in order. kx = 100 × cos(33°) keeps the proportions
// right near Morocco's latitude. ──
const pt = ({ lat, lon }) => ({ x: (lon - MAP.lon0) * MAP.kx, y: (MAP.lat0 - lat) * MAP.ky });
// the part of the frame around the route, running east past Merzouga so the
// land reaches the screen edge (x 150–710, y 50–690)
const VIEW = "150 50 560 640";
// where a place's name sits around its dot
const LABEL = {
	right: { dx: 16, dy: 5, anchor: "start" },
	left: { dx: -16, dy: 5, anchor: "end" },
	above: { dx: 0, dy: -18, anchor: "middle" },
	below: { dx: 0, dy: 28, anchor: "middle" },
};

const RouteMap = ({ stops, active }) => {
	const points = stops.flatMap((s, si) => s.map.map((m, mi) => ({ ...m, ...pt(m), si, key: `${si}-${mi}` })));
	return (
		<svg className="tit-map-svg" viewBox={VIEW} role="img" aria-label="Route map of the tour">
			<path className="tit-map-land tit-map-land--near" d={NEIGHBOURS} />
			<path className="tit-map-land" d={MOROCCO} />
			{/* sea and desert names for bearings */}
			<text className="tit-map-region" x="160" y="420">Atlantic</text>
			<text className="tit-map-region" x="160" y="440">Ocean</text>
			<text className="tit-map-region" x="560" y="95">Mediterranean</text>
			<text className="tit-map-region" x="560" y="660">Sahara</text>
			{points.slice(1).map((p, k) => {
				const a = points[k];
				const done = p.si <= active;
				return (
					<line
						key={`${a.key}-${p.key}`}
						x1={a.x}
						y1={a.y}
						x2={p.x}
						y2={p.y}
						className={`tit-map-leg${done ? " is-done" : ""}`}
					/>
				);
			})}
			{points.map((p) => {
				const done = p.si <= active;
				// label "none": a place already on the map (a round trip's return),
				// so only the route line comes back to it
				if (p.label === "none") return null;
				const at = LABEL[p.label || "right"];
				return (
					<g key={p.key} className={`tit-map-stop${done ? " is-done" : ""}`}>
						<circle cx={p.x} cy={p.y} r="10" />
						<text x={p.x + at.dx} y={p.y + at.dy} textAnchor={at.anchor}>
							{p.name}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

const TourItinerary = ({ tourPlan, stops, tour }) => {
	const from = getTour(tour)?.tiers?.at(-1)?.pp;
	const [active, setActive] = useState(0);
	const stopRefs = useRef([]);
	// phones: each day is a compact row that opens on tap (desktop shows all)
	const [open, setOpen] = useState(() => new Set());
	const toggle = (day) =>
		setOpen((prev) => {
			const next = new Set(prev);
			next.has(day) ? next.delete(day) : next.add(day);
			return next;
		});

	// the place whose section has reached the upper third of the screen
	useEffect(() => {
		let frame = 0;
		const update = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const mark = window.innerHeight * 0.35;
				let a = 0;
				stopRefs.current.forEach((el, k) => {
					if (el && el.getBoundingClientRect().top < mark) a = k;
				});
				setActive(a);
			});
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	const byDay = Object.fromEntries(tourPlan.map((d) => [d.day, d]));

	return (
		<section className="tit" id="tour-plan" data-tone="light" aria-label="Day-by-day itinerary">
			<div className="tit-inner">
				<div className="tit-main">
					<span className="tit-line" aria-hidden="true" />
					{stops.map((s, si) => (
						<div className="tit-stop" key={`${si}-${s.place}`} ref={(el) => (stopRefs.current[si] = el)}>
							<h2 className="tit-place">{s.place}</h2>
							<p className="tit-intro">{s.intro}</p>
							<p className="tit-days">{range(s.days)}</p>
							{s.days.map((n) => {
								const d = byDay[n];
								if (!d) return null;
								return (
									<article
										className={`tit-day${d.day % 2 === 0 ? " tit-day--flip" : ""}${open.has(d.day) ? " is-open" : ""}`}
										key={n}
									>
										<span className="tit-dot" aria-hidden="true" />
										{/* phones only: the day's row, tap to open */}
										<button
											type="button"
											className="tit-day-toggle"
											aria-expanded={open.has(d.day)}
											aria-controls={`tit-day-${d.day}`}
											onClick={() => toggle(d.day)}
										>
											{d.images?.[0] && <img className="tit-day-thumb" src={d.images[0]} alt="" loading="lazy" />}
											<span className="tit-day-toggle-text">
												<span className="tit-day-label">Day {d.day}</span>
												<span className="tit-day-toggle-title">{d.title}</span>
											</span>
											<span className="tit-day-plus" aria-hidden="true" />
										</button>
										<div className="tit-day-text" id={`tit-day-${d.day}`}>
											<p className="tit-day-label">Day {d.day}</p>
											<h3 className="tit-day-title">{d.title}</h3>
											<p className="tit-day-desc">{d.description}</p>
											<ul className="tit-acts">
												{d.activities.map((a) => (
													<li key={a}>{a}</li>
												))}
											</ul>
										</div>
										{d.images?.length > 0 && <DayPhotos images={d.images} alt={d.title} />}
									</article>
								);
							})}
						</div>
					))}
				</div>
				<aside className="tit-map">
					{/* booking, always in reach while reading the days: in the sea
					    above Tangier, clear of the route */}
					{tour && (
						<div className="tit-map-book">
							{from && <p className="tit-map-price">From {from}pp</p>}
							<Link to={`/book?tour=${tour}`} className="tit-map-btn">
								Book this tour
							</Link>
						</div>
					)}
					<RouteMap stops={stops} active={active} />
				</aside>
			</div>
		</section>
	);
};

export default TourItinerary;
