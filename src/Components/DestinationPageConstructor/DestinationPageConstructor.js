import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import { TourImageHero, TourOverview } from "./TourIntro";
import { getTour } from "../../data/tours";
import ContentSection from "./Content/ContentSection";

import "./DestinationPageConstructor.css";
import "./TourDesign.css";

const FloatingBookBtn = ({ tour }) => (
	<Link className="floating-book-btn" to={`/book?tour=${tour}`} aria-label="Book this tour">
		Book Now
	</Link>
);

// One continuous page: photo gallery on top, then information, tour plan and
// reviews stacked in order — no tabs.
// `design`: use the homepage design system (DESIGN.md), scoped under `.ds-page`
// so tours that haven't been converted keep their current look.
// `heroImage` (design pages): a full-width photo with the title on it, then a
// centred overview with When / Price / How long, instead of the gallery.
const DestinationPage = ({ reviews, information, tourPlan, gallery, theme, tour, design, heroImage, country }) => (
	<div className={`destination-page-container${theme ? ` theme-${theme}` : ""}${design ? " ds-page" : ""}`}>
		{heroImage ? (
			<>
				<TourImageHero
					image={heroImage}
					country={country}
					title={information.title}
					subtitle={getTour(tour)?.tagline}
				/>
				<TourOverview tour={tour} information={information} country={country} />
			</>
		) : (
			<HeroSection gallery={gallery} />
		)}
		<ContentSection
			hideIntro={Boolean(heroImage)}
			information={information}
			tourPlan={tourPlan}
			reviews={reviews}
			tour={tour}
			design={design}
		/>
		<FloatingBookBtn tour={tour} />
	</div>
);

export default DestinationPage;
