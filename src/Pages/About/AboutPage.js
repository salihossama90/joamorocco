import React from "react";
import AboutCopy from "./AboutCopy";
import { TourImageHero } from "../../Components/DestinationPageConstructor/TourIntro";
import "./About.css";

// About, in the tour pages' layout: the photo hero, then the story as a
// centred overview (orange label, title, body), closing on its last line in
// the display face.
const AboutPage = () => (
	<main className="ds-page about-page">
		<TourImageHero
			image="/assets/blue-alley.webp"
			country="Jewel of Africa"
			title="About JOA"
			subtitle="Completely private tours across Morocco, led by local guides"
		/>
		<section className="ti-overview about-story" data-tone="light">
			<div className="ti-col">
				<p className="ti-eyebrow">Jewel of Africa</p>
				<h2 className="ti-title">Our story</h2>
				<AboutCopy closingClass="about-closing" />
			</div>
		</section>
	</main>
);

export default AboutPage;
