import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SocialMediaIcons from "../SocialMediaIcons/SocialMediaIcons";
import useScrolled from "../../hooks/useScrolled";
import "./Navbar.css";

// True while the middle of the bar (40px down) is over a `data-tone="light"`
// section. Passive, rAF-throttled like useScrolled.
function useOnLightSection(enabled) {
	const [onLight, setOnLight] = useState(false);

	useEffect(() => {
		if (!enabled) return setOnLight(false);
		let ticking = false;
		const check = () => {
			ticking = false;
			setOnLight(
				[...document.querySelectorAll('[data-tone="light"]')].some((el) => {
					const r = el.getBoundingClientRect();
					return r.top <= 40 && r.bottom > 40;
				})
			);
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(check);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		check();
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [enabled]);

	return onLight;
}

// Rewritten from a class component that scanned every DOM node with
// getComputedStyle on each scroll event (major jank). The hamburger color is now
// driven purely by CSS state, and a passive rAF-throttled listener only toggles
// a `scrolled` class.
//
// `home`: no background at any scroll position, with the Free Consultation
// button in the bar (see DESIGN.md). Over light homepage sections
// (`data-tone="light"`) the icon and links switch to dark so they stay visible.
export default function Navbar({ home = false }) {
	const [isOpen, setIsOpen] = useState(false);
	const scrolled = useScrolled(60);
	const onLight = useOnLightSection(home);
	const location = useLocation();

	// Any navigation (including the logo, which lives outside this menu)
	// closes the menu, so the new page isn't hidden behind it
	useEffect(() => setIsOpen(false), [location.key]);

	const close = () => setIsOpen(false);

	return (
		<nav
			className={`navbar ${scrolled ? "scrolled" : ""} ${home ? "navbar--home" : ""} ${onLight ? "on-light" : ""} ${isOpen ? "menu-open" : ""}`}
		>
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

			{home && (
				<a className="nav-phone" href="tel:+16146017897">
					+1 614 601 7897
				</a>
			)}
			{home && (
				<Link className="hbtn hbtn--accent nav-consult" to="/contact?topic=consultation">
					Free Consultation
				</Link>
			)}
		</nav>
	);
}
