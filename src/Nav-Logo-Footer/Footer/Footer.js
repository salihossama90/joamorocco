import React from "react";
import { Link } from "react-router-dom";
import SocialMediaIcons from "../SocialMediaIcons/SocialMediaIcons";
import "./Footer.css";

const ABOUT =
	"Completely private tours across Morocco, led by local guides. We take you to the places that matter, and give you the time to feel them.";

const CONTACT = [
	{ label: "joamorocco@gmail.com", href: "mailto:joamorocco@gmail.com" },
	{ label: "+1 614-380-9363", href: "tel:+16143809363" },
	{ label: "580 Riverview Dr, Columbus, OH, USA" },
];

const SOCIAL = ["Facebook", "Instagram", "TikTok", "YouTube"];

const LINKS = [
	{ label: "Tours", to: "/#explore-trips" },
	{ label: "About", to: "/about" },
	{ label: "Contact", to: "/contact" },
	{ label: "Book", to: "/book" },
	{ label: "Find booking", to: "/find-booking" },
	{ label: "Privacy Policy", to: "/privacy" },
	{ label: "Terms & Conditions", to: "/terms" },
];

const year = new Date().getFullYear();

// Homepage footer (DESIGN.md): social band, contact, small print, links,
// centered copyright
const HomeFooter = () => (
	<footer className="footer--home">
		<div className="fh-social">
			<SocialMediaIcons only={SOCIAL} />
		</div>
		<div className="fh-body">
			<ul className="fh-contact">
				{CONTACT.map(({ label, href }) => (
					<li key={label}>{href ? <a href={href}>{label}</a> : <span>{label}</span>}</li>
				))}
			</ul>
			<p className="fh-small">{ABOUT}</p>
		</div>
		<div className="fh-bottom">
			<div className="fh-copyright">© JOA Morocco {year}</div>
			<nav className="fh-links" aria-label="Footer">
				{LINKS.map(({ label, to }) => (
					<Link key={label} to={to}>
						{label}
					</Link>
				))}
			</nav>
		</div>
	</footer>
);

const Footer = ({ variant }) => {
	if (variant === "home") return <HomeFooter />;
	return (
		<footer>
			<div className="footer-container">
				<div className="footer-about-container">
					<article>
						<h2>JOA Morocco</h2>
						<p>{ABOUT}</p>
					</article>
					<div className="footer-contact">
					<ul>
						{CONTACT.map(({ label, href }) => (
							<li key={label}>{href ? <a href={href}>{label}</a> : <span>{label}</span>}</li>
						))}
					</ul>
					<div className="footer-social">
						<SocialMediaIcons only={SOCIAL} />
					</div>
					</div>
				</div>
				<nav className="footer-legal">
					<Link to="/terms">Terms &amp; Conditions</Link>
					<Link to="/privacy">Privacy Policy</Link>
				</nav>
				<div className="bottom-declaration">
					© {year} JOA Morocco. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
