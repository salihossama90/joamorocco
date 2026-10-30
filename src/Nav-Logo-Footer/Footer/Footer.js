import React from "react";
import { Link } from "react-router-dom";
import SocialMediaIcons from "../SocialMediaIcons/SocialMediaIcons";
import "./Footer.css";

const Footer = () => {
	return (
		<footer>
			<div className="footer-container">
				<div className="footer-about-container">
					<article>
						<h2>JOA Morocco</h2>
						<p>
							Completely private tours across Morocco, led by local
							guides. We take you to the places that matter, and give
							you the time to feel them.
						</p>
					</article>
					<div className="footer-contact">
					<ul>
						<li>
							<a href="mailto:joamorocco@gmail.com">joamorocco@gmail.com</a>
						</li>
						<li>
							<a href="tel:+16143809363">+1 614-380-9363</a>
						</li>
						<li>
							<span>580 Riverview Dr, Columbus, OH, USA</span>
						</li>
					</ul>
					<div className="footer-social">
						<SocialMediaIcons only={["Facebook", "Instagram", "TikTok", "YouTube"]} />
					</div>
					</div>
				</div>
				<nav className="footer-legal">
					<Link to="/terms">Terms &amp; Conditions</Link>
					<Link to="/privacy">Privacy Policy</Link>
				</nav>
				<div className="bottom-declaration">
					© {new Date().getFullYear()} JOA Morocco. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
