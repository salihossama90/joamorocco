import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PopularSection.css";

import { TOUR_LIST } from "../data/tours";
import Images from "../images";

// No fixed itinerary or price — it opens the contact form, like the Custom
// panel in the home page hero.
const CUSTOM_TRIP = {
	name: "Your Custom Journey",
	city: "Anywhere in Morocco",
	route: "/contact?topic=custom",
	heroImage: Images.CustomHero,
	description:
		"Your dates, your pace, your budget. Tell us what you dream of seeing and we'll design a private trip around you — from a long weekend in Marrakech to weeks across the whole Kingdom.",
	badge: "Any Length",
	price: "Tailored to you",
	perk: "Free consultation",
	caption: "Built around you",
	length: "Any length",
	cta: "Plan My Trip",
};

const PopularAdventuresSection = () => {
	const adventures = [...TOUR_LIST, CUSTOM_TRIP];

	const [current, setCurrent] = useState(0);
	const count = adventures.length;
	const sectionRef = useRef(null);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					el.classList.add("pop-visible");
					observer.disconnect();
				}
			},
			{ threshold: 0.08 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const prev = () => setCurrent((i) => (i - 1 + count) % count);
	const next = () => setCurrent((i) => (i + 1) % count);
	const adv = adventures[current];

	return (
		<section ref={sectionRef} className="popular-adventures-section">
			<div className="heading-container max-width">
				<h5>Three Ways to Travel, Entirely Private</h5>
				<h3>Choose Your Morocco</h3>
				<p>
					From the golden dunes of the Sahara to the blue streets of
					Chefchaouen — two carefully crafted private tours, or a custom
					journey designed around you. Every trip is reserved exclusively for
					you and your group.
				</p>
			</div>

			{/* ── Mobile carousel ── */}
			<div className="pop-carousel">
				<div className="carousel-controls">
					<button className="carousel-arrow" onClick={prev} aria-label="Previous">
						<span>&#8249;</span>
					</button>
					<div className="carousel-dots">
						{adventures.map((_, i) => (
							<button
								key={i}
								className={`dot ${i === current ? "active" : ""}`}
								onClick={() => setCurrent(i)}
								aria-label={`Go to adventure ${i + 1}`}
							/>
						))}
					</div>
					<button className="carousel-arrow" onClick={next} aria-label="Next">
						<span>&#8250;</span>
					</button>
				</div>

				<Link to={adv.route} className="carousel-card" key={current}>
					<div
						className="carousel-image"
						style={{ backgroundImage: `url(${adv.heroImage})` }}
					>
						<div className="carousel-image-overlay" />
						<div className="carousel-badge">{adv.badge || `${adv.days} Days`}</div>
					</div>
					<div className="carousel-body">
						<h3>{adv.name}</h3>
						<p className="carousel-location">{adv.city}</p>
						<div className="carousel-meta">
							<span className="carousel-price">{adv.price || `${adv.priceRange} / person`}</span>
							<span className="carousel-seats">{adv.perk || "Kids 50% off"}</span>
						</div>
					</div>
					<div className="carousel-book-btn">{adv.cta || "Explore & Book"}</div>
				</Link>
			</div>

			{/* ── Desktop grid ── */}
			<section className="popular-adventures-showcase">
				{adventures.map((adventure, index) => (
					<Link to={adventure.route} className="showcase-item" key={index}>
						<div className="top-section">
							<div
								style={{
									backgroundImage: `url(${adventure.heroImage})`,
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									width: "100%",
									height: "100%",
								}}
							/>
						</div>
						<div className="middle-section">
							<h3>
								{adventure.name}
								<span>{adventure.price || `${adventure.priceRange} / person`}</span>
							</h3>
							<figcaption>
								{adventure.caption ||
									`${"★".repeat(adventure.rating)} ${adventure.rating} / 5`}{" "}
								· {adventure.city}
							</figcaption>
							<p>{adventure.description}</p>
						</div>
						<div className="bottom-section">
							<p>
								{adventure.length || `${adventure.days} Days / ${adventure.nights} Nights`}
								<span>Private &amp; Exclusive</span>
							</p>
						</div>
					</Link>
				))}
			</section>
		</section>
	);
};

export default PopularAdventuresSection;
