import React from "react";
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
				<p>
					JOA — Jewel of Africa — was founded by an American with Moroccan
					roots: born in the United States, raised in Morocco. Growing up
					between two cultures gave our founder a rare understanding of both
					sides of the journey — what a traveler hopes to find, and what
					Morocco truly has to give.
				</p>
				<p>
					Our journeys are built by guides, not marketers. Our guides grew up
					in the places they share with you. They know the streets, the
					people, the hidden corners, the traditions, and the stories no tour
					script contains. Their knowledge comes from living Morocco — not
					memorizing it.
				</p>
				<p>
					Every journey begins with a conversation: what inspires you, how you
					like to travel, and, above all, how you want to feel when you return
					home. From there, we shape every detail around you — from private
					riads tucked inside ancient medinas to nights beneath the Sahara
					stars, from intimate culinary experiences to roads through the Atlas
					Mountains.
				</p>
				<p className="about-closing">
					Because Morocco isn't something to simply see.
					<br />
					It's something to feel.
				</p>
			</article>
		</main>
	);
};

export default AboutPage;
