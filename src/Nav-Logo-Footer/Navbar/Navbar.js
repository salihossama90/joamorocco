import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SocialMediaIcons from "../SocialMediaIcons/SocialMediaIcons";
import "./Navbar.css";

// Rewritten from a class component that scanned every DOM node with
// getComputedStyle on each scroll event (major jank). The hamburger color is now
// driven purely by CSS state, and a passive rAF-throttled listener only toggles
// a `scrolled` class.
export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	// Any navigation (including the logo, which lives outside this menu)
	// closes the menu, so the new page isn't hidden behind it
	useEffect(() => setIsOpen(false), [location.key]);

	useEffect(() => {
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				setScrolled(window.scrollY > 60);
				ticking = false;
			});
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const close = () => setIsOpen(false);

	return (
		<nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
			<div
				className={`hamburger ${isOpen ? "open" : ""}`}
				onClick={() => setIsOpen((o) => !o)}
			>
				{[0, 1, 2].map((i) => (
					<div key={i} className="line" />
				))}
			</div>

			{isOpen && <div className="blur" onClick={close} />}

			<div className={`nav-links ${isOpen ? "open" : ""}`}>
				<ul>
					<li><Link to="/" onClick={close}>Tours</Link></li>
					<li><Link to="/about" onClick={close}>About</Link></li>
					<li><Link to="/contact" onClick={close}>Contact</Link></li>
					<li><Link to="/book" onClick={close}>Book</Link></li>
					<li><Link to="/find-booking" onClick={close}>Find booking</Link></li>
				</ul>
				<div className="nav-social">
					<SocialMediaIcons />
				</div>
			</div>
		</nav>
	);
}
