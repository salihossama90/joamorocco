import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faXTwitter,
	faFacebook,
	faInstagram,
	faTiktok,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./SocialMediaIcons.css";

// Links point at each platform's home until JOA's own profiles exist.
const NETWORKS = [
	{ name: "X", link: "https://x.com/", icon: faXTwitter },
	{ name: "Facebook", link: "https://www.facebook.com/", icon: faFacebook },
	{ name: "Instagram", link: "https://www.instagram.com/", icon: faInstagram },
	{ name: "TikTok", link: "https://www.tiktok.com/", icon: faTiktok },
	{ name: "YouTube", link: "https://www.youtube.com/", icon: faYoutube },
];

// `only` narrows to the named networks (the footer shows four, no X)
const SocialMediaIcons = ({ only }) => (
	<div className="media-icons">
		<ul>
			{NETWORKS.filter(({ name }) => !only || only.includes(name)).map(({ name, link, icon }) => (
				<li key={name}>
					<a href={link} target="_blank" rel="noopener noreferrer" aria-label={name}>
						<FontAwesomeIcon icon={icon} />
					</a>
				</li>
			))}
		</ul>
	</div>
);

export default SocialMediaIcons;
