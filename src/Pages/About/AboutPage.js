import React from "react";
import AboutCopy from "./AboutCopy";
import "./About.css";

const AboutPage = () => {
	return (
		<main className="about-page">
			<article className="about-article">
				<span className="about-eyebrow">Jewel of Africa</span>
				<h1>About JOA</h1>
				<img
					className="about-photo"
					src="/assets/blue-alley.webp"
					alt="Blue-painted steps lined with handmade crafts in the medina of Chefchaouen, Morocco"
					width="1600"
					height="2133"
					decoding="async"
				/>
				<AboutCopy closingClass="about-closing" />
			</article>
		</main>
	);
};

export default AboutPage;
