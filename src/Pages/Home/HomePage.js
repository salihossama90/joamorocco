import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TOUR_LIST, TOURS } from "../../data/tours";
import Images, { KingdomVideo } from "../../images";
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
const Hero = () => {
	const videoRef = useRef(null);

	useEffect(() => {
		const el = videoRef.current;
		if (!el) return;
		// Reduced motion: keep the poster still instead of looping footage
		if (prefersReducedMotion()) {
			el.pause();
			return;
		}
		el.muted = true; // iOS only autoplays when the muted *property* is set
		el.play().catch(() => {});
	}, []);

	return (
		<section className="home-hero">
			<video
				ref={videoRef}
				className="home-hero-video"
				src={KingdomVideo}
				poster={Images.KingdomHero}
				autoPlay
				muted
				loop
				playsInline
				preload="auto"
				aria-hidden="true"
			/>
			<div className="home-hero-scrim" />
			<div className="home-hero-content">
				<p className="home-eyebrow">Private Guided Tours of Morocco</p>
				<h1 className="home-hero-title">Choose Your Morocco</h1>
				<div className="home-hero-actions">
					<a
						href="#explore-trips"
						className="hbtn hbtn--outline-light"
						onClick={(e) => {
							e.preventDefault();
							scrollToTrips();
						}}
					>
						Explore Our Trips
					</a>
					<Link to="/contact?topic=custom" className="hbtn hbtn--solid-dark hbtn--on-image">
						Plan My Trip
					</Link>
				</div>
			</div>
		</section>
	);
};

// ════════ 2–3. About + Get in Touch ════════
const About = () => (
	<section className="home-about">
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
		<section className="home-reviews" aria-roledescription="carousel" aria-label="Traveler reviews">
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
