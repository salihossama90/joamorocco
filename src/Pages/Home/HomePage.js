import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TOUR_LIST, TOURS } from "../../data/tours";
import Images, { KingdomVideo, DesertVideo, CustomVideo } from "../../images";
import AboutCopy from "../About/AboutCopy";
import kingdomReviews from "../Kingdom/reviews";
import desertReviews from "../Desert/reviews";

import "./Home.css";

// Layout and type system documented in DESIGN.md.

const prefersReducedMotion = () =>
	window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// ── Trips ──
// Custom has no fixed itinerary or price, so it opens the contact form.
const TRIPS = [
	...TOUR_LIST.map((t) => ({
		key: t.key,
		name: t.name,
		place: t.city,
		meta: `${t.days} Days · Private`,
		description: t.tagline,
		priceLine: `${t.priceRange} / person · Kids 50% off`,
		image: t.heroImage,
		route: t.route,
		cta: "Explore & Book",
	})),
	{
		key: "custom",
		name: "Custom",
		place: "Anywhere in Morocco",
		meta: "Any Length · Private",
		description: "A Morocco trip built around you",
		priceLine: "Your dates · Your pace · Your budget",
		image: Images.CustomHero,
		route: "/contact?topic=custom",
		cta: "Plan My Trip",
	},
];

// ── Reviews: five-star reviews already on the tour pages, alternating tours ──
const pick = (list, tour) =>
	list.filter((r) => r.stars === 5).slice(0, 4).map((r) => ({ ...r, tour: tour.name }));
const REVIEWS = (() => {
	const k = pick(kingdomReviews, TOURS.kingdom);
	const d = pick(desertReviews, TOURS.desert);
	return k.flatMap((r, i) => [r, d[i]]).filter(Boolean);
})();

const scrollToTrips = () =>
	document
		.getElementById("explore-trips")
		?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });

// ════════ 1. Hero ════════
// A slideshow of the three trips, one video each. It advances every 8s
// (restarting after any click); "Next" and the round arrows move it by hand.
// Reduced motion: no auto-advance and no video, just the posters.
const HERO_VIDEOS = { kingdom: KingdomVideo, desert: DesertVideo, custom: CustomVideo };
const SLIDES = TRIPS.map((t) => ({
	...t,
	title: t.key === "custom" ? "Your Custom Journey" : t.name,
	video: HERO_VIDEOS[t.key],
}));
const SLIDE_MS = 8000;

const SlideActions = ({ slide }) =>
	slide.key === "custom" ? (
		<>
			<Link to={slide.route} className="hbtn hbtn--outline-light">
				Plan My Trip
			</Link>
			<a
				href="#explore-trips"
				className="hbtn hbtn--solid-dark hbtn--on-image"
				onClick={(e) => {
					e.preventDefault();
					scrollToTrips();
				}}
			>
				Explore Our Trips
			</a>
		</>
	) : (
		<>
			<Link to={slide.route} className="hbtn hbtn--outline-light">
				{slide.cta}
			</Link>
			<Link to="/contact?topic=custom" className="hbtn hbtn--solid-dark hbtn--on-image">
				Plan My Trip
			</Link>
		</>
	);

// 16 × 16 chevron, like the reference hero arrow icons
const Chevron = ({ dir }) => (
	<svg className="home-hero-arrow-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
		<path
			d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const Hero = () => {
	const [i, setI] = useState(0);
	const [reduced] = useState(prefersReducedMotion);
	const videos = useRef([]);
	const n = SLIDES.length;
	const go = (d) => setI((x) => (x + d + n) % n);
	const slide = SLIDES[i];
	const next = SLIDES[(i + 1) % n];

	// Only the visible slide's video plays
	useEffect(() => {
		videos.current.forEach((v, k) => {
			if (!v) return;
			if (k === i && !reduced) {
				v.muted = true; // iOS only autoplays when the muted *property* is set
				v.play().catch(() => {});
			} else {
				v.pause();
			}
		});
	}, [i, reduced]);

	// Auto-advance; changing slide (by timer or click) restarts the countdown
	useEffect(() => {
		if (reduced) return;
		const t = setTimeout(() => setI((x) => (x + 1) % n), SLIDE_MS);
		return () => clearTimeout(t);
	}, [i, reduced, n]);

	return (
		<section className="home-hero" aria-roledescription="carousel" aria-label="Our trips">
			{SLIDES.map((s, k) => (
				<video
					key={s.key}
					ref={(el) => (videos.current[k] = el)}
					className={`home-hero-video ${k === i ? "is-active" : ""}`}
					src={s.video}
					poster={s.image}
					muted
					loop
					playsInline
					preload={k === i ? "auto" : "none"}
					aria-hidden="true"
				/>
			))}
			<div className="home-hero-scrim" />
			<div className="home-hero-content" key={slide.key}>
				<p className="home-eyebrow">{slide.meta}</p>
				<h1 className="home-hero-title">{slide.title}</h1>
				<div className="home-hero-actions">
					<SlideActions slide={slide} />
				</div>
			</div>

			<div className="home-hero-controls">
				<button type="button" className="home-hero-next" onClick={() => go(1)}>
					<span className="home-hero-next-label">Next</span>
					<span className="home-hero-next-name">{next.title}</span>
				</button>
				<div className="home-hero-bars">
					{SLIDES.map((s, k) => (
						<button
							key={s.key}
							type="button"
							className={`home-hero-bar ${k === i ? "is-active" : ""}`}
							onClick={() => setI(k)}
							aria-label={`Show ${s.title}`}
							aria-current={k === i}
						>
							{/* key restarts the fill animation on every slide change */}
							<span key={k === i ? `on-${i}` : "off"} style={{ animationDuration: `${SLIDE_MS}ms` }} />
						</button>
					))}
				</div>
			</div>
			<div className="home-hero-arrows">
				<button type="button" className="home-hero-arrow" onClick={() => go(-1)} aria-label="Previous trip">
					<Chevron dir="left" />
				</button>
				<button type="button" className="home-hero-arrow" onClick={() => go(1)} aria-label="Next trip">
					<Chevron dir="right" />
				</button>
			</div>
		</section>
	);
};

// ════════ 2–3. About + Get in Touch ════════
const About = () => (
	<section className="home-about" data-tone="light">
		<div className="home-col">
			<h2 className="home-statement">About JOA</h2>
			<div className="home-about-copy">
				<AboutCopy emphasis />
			</div>
			<Link to="/contact?topic=consultation" className="hbtn hbtn--solid-dark">
				Get in Touch
			</Link>
		</div>
	</section>
);

// ════════ 4. Reviews ════════
const Reviews = () => {
	const [i, setI] = useState(0);
	const touchX = useRef(null);
	const n = REVIEWS.length;
	const go = (d) => setI((x) => (x + d + n) % n);
	const r = REVIEWS[i];

	if (!n) return null;
	return (
		<section className="home-reviews" data-tone="light" aria-roledescription="carousel" aria-label="Traveler reviews">
			<div
				className="home-col"
				onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
				onTouchEnd={(e) => {
					if (touchX.current == null) return;
					const dx = e.changedTouches[0].clientX - touchX.current;
					if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
					touchX.current = null;
				}}
			>
				<span className="home-quote-mark" aria-hidden="true">“</span>
				<figure className="home-review" key={i} aria-live="polite">
					<blockquote>{r.review}</blockquote>
					<figcaption>
						{r.name}, {r.tour}
					</figcaption>
				</figure>
				<div className="home-stars" aria-label={`${r.stars} out of 5 stars`}>
					{"★".repeat(r.stars)}
				</div>
				{n > 1 && (
					<div className="home-review-nav">
						<button type="button" className="home-arrow" onClick={() => go(-1)} aria-label="Previous review">
							‹
						</button>
						<div className="home-dots">
							{REVIEWS.map((_, d) => (
								<button
									key={d}
									type="button"
									className={`home-dot ${d === i ? "active" : ""}`}
									onClick={() => setI(d)}
									aria-label={`Review ${d + 1}`}
									aria-current={d === i}
								/>
							))}
						</div>
						<button type="button" className="home-arrow" onClick={() => go(1)} aria-label="Next review">
							›
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

// ════════ 5. Explore Our Trips ════════
const Explore = () => {
	const trackRef = useRef(null);
	const [edges, setEdges] = useState({ atStart: true, atEnd: false });

	const measure = () => {
		const t = trackRef.current;
		if (!t) return;
		setEdges({
			atStart: t.scrollLeft <= 4,
			atEnd: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4,
		});
	};

	useEffect(() => {
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, []);

	const step = (d) => {
		const t = trackRef.current;
		if (!t || !t.children.length) return;
		const [a, b] = t.children;
		const w = b ? b.offsetLeft - a.offsetLeft : t.clientWidth;
		t.scrollBy({ left: d * w, behavior: prefersReducedMotion() ? "auto" : "smooth" });
	};

	const fits = edges.atStart && edges.atEnd;

	return (
		<section className="home-explore" id="explore-trips">
			<div className="home-explore-head">
				<h2 className="home-section-title">Explore Our Trips</h2>
				<p className="home-subtitle">Three ways to travel, entirely private</p>
			</div>
			<div className="home-trips" ref={trackRef} onScroll={measure}>
				{TRIPS.map((t) => (
					<article
						className="home-trip"
						key={t.key}
						style={{ backgroundImage: `url(${t.image})` }}
					>
						<span className="home-trip-meta">{t.meta}</span>
						<div className="home-trip-body">
							<span className="home-trip-place">{t.place}</span>
							<h3>{t.name}</h3>
							<p className="home-trip-desc">{t.description}</p>
							<p className="home-trip-price">{t.priceLine}</p>
							<Link to={t.route} className="hbtn hbtn--outline-light">
								{t.cta}
							</Link>
						</div>
					</article>
				))}
			</div>
			{/* Round arrows like the reference; each shows only when it can move */}
			{!fits && (
				<div className="home-trips-nav">
					{!edges.atStart && (
						<button type="button" className="home-round-arrow home-round-arrow--prev" onClick={() => step(-1)} aria-label="Previous trip">
							‹
						</button>
					)}
					{!edges.atEnd && (
						<button type="button" className="home-round-arrow home-round-arrow--next" onClick={() => step(1)} aria-label="Next trip">
							›
						</button>
					)}
				</div>
			)}
		</section>
	);
};

export default function HomePage() {
	const { hash } = useLocation();

	// Footer "Tours" link lands on /#explore-trips
	useEffect(() => {
		if (hash === "#explore-trips") requestAnimationFrame(scrollToTrips);
	}, [hash]);

	return (
		<main className="home">
			<Hero />
			<About />
			<Reviews />
			<Explore />
		</main>
	);
}
