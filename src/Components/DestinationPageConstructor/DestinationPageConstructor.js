import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import ContentSection from "./Content/ContentSection";

import "./DestinationPageConstructor.css";

const FloatingBookBtn = ({ tour }) => (
	<Link className="floating-book-btn" to={`/book?tour=${tour}`} aria-label="Book this tour">
		Book Now
	</Link>
);

// One continuous page: photo gallery on top, then information, tour plan and
// reviews stacked in order — no tabs.
const DestinationPage = ({ reviews, information, tourPlan, gallery, theme, tour }) => (
	<div className={`destination-page-container${theme ? ` theme-${theme}` : ""}`}>
		<HeroSection gallery={gallery} />
		<ContentSection
			information={information}
			tourPlan={tourPlan}
			reviews={reviews}
			tour={tour}
		/>
		<FloatingBookBtn tour={tour} />
	</div>
);

export default DestinationPage;
