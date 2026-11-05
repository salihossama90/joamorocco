import React from "react";
import SocialMediaIcons from "../../Nav-Logo-Footer/SocialMediaIcons/SocialMediaIcons";

const FormHeading = () => {
	return (
		<aside className="ds-card contact-info" aria-labelledby="find-us-title">
			<p className="ds-label">Our office</p>
			<h2 className="ds-heading" id="find-us-title">
				Find us
			</h2>
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
					<a href="tel:+16146017897">+1 614-601-7897</a>
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
