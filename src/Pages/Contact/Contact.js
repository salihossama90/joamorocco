import React from "react";
import "./Contact.css";
import FormHeading from "./FormHeading";
import FormInputs from "./FormInputs";
import { TourImageHero } from "../../Components/DestinationPageConstructor/TourIntro";

// Contact, in the tour pages' layout: the photo hero, then the form and
// "Find us" as white cards on the light grey band.
const ContactPage = () => (
	<main className="ds-page contact-page">
		<TourImageHero
			image="/assets/contact-background.webp"
			country="Contact"
			title="Write to us"
			subtitle="Planning questions, custom routes, or just a hello from afar"
		/>
		<section className="ds-section ds-section--grey" data-tone="light">
			<div className="ds-container contact-body">
				<FormInputs />
				<FormHeading />
			</div>
		</section>
	</main>
);

export default ContactPage;
