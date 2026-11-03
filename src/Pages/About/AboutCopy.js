import React from "react";

// The About JOA story, shared by the About page and the homepage so the two
// never drift. `emphasis` italicises a few words (homepage style, DESIGN.md).
const AboutCopy = ({ emphasis = false, closingClass }) => {
	const Em = emphasis ? "em" : React.Fragment;
	return (
		<>
			<p>
				JOA — <Em>Jewel of Africa</Em> — was founded by an American with Moroccan
				roots: born in the United States, raised in Morocco. Growing up
				between two cultures gave our founder a rare understanding of both
				sides of the journey — what a traveler hopes to find, and what
				Morocco truly has to give.
			</p>
			<p>
				Our journeys are built by guides, not marketers. Our guides grew up
				in the places they share with you. They know the streets, the
				people, the hidden corners, the traditions, and the stories no tour
				script contains. Their knowledge comes from <Em>living</Em> Morocco — not
				memorizing it.
			</p>
			<p>
				Every journey begins with a conversation: what inspires you, how you
				like to travel, and, above all, <Em>how you want to feel</Em> when you return
				home. From there, we shape every detail around you — from private
				riads tucked inside ancient medinas to nights beneath the Sahara
				stars, from intimate culinary experiences to roads through the Atlas
				Mountains.
			</p>
			<p className={closingClass}>
				Because Morocco isn't something to simply see.
				<br />
				It's something to <Em>feel</Em>.
			</p>
		</>
	);
};

export default AboutCopy;
