import React from "react";
import SocialMediaIcons from "../../Nav-Logo-Footer/SocialMediaIcons/SocialMediaIcons";
import { CompassRose } from "../../Components/Motifs/Motifs";

const FormHeading = () => {
	return (
		<aside className="contact-info">
			<div className="contact-info-compass" aria-hidden="true">
				<CompassRose />
			</div>
			<h2>Find us</h2>
			<ul className="contact-info-rows">
				<li>
					<span className="contact-info-label">Office</span>
					<span>580 Riverview Dr, Columbus, OH, USA</span>
				</li>
				<li>
					<span className="contact-info-label">Email</span>
					<a href="mailto:joamorocco@gmail.com">joamorocco@gmail.com</a>
				</li>
				<li>
					<span className="contact-info-label">Phone</span>
					<a href="tel:+16143809363">+1 614-380-9363</a>
				</li>
				<li>
					<span className="contact-info-label">Replies</span>
					<span>Within 24 hours</span>
				</li>
			</ul>
			<SocialMediaIcons />
		</aside>
	);
};

export default FormHeading;
