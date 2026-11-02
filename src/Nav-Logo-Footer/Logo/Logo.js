import React from "react";
import "./Logo.css";
import { Link, useLocation } from "react-router-dom";

const Logo = () => {
	const { pathname } = useLocation();
	// Already home: the route doesn't change, so scroll back to the top instead
	const onClick = () => {
		if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="logo-container">
			<Link to="/" onClick={onClick} aria-label="JOA Morocco home">
				<img src="/assets/logo.png" alt="logo" />
			</Link>
		</div>
	);
};

export default Logo;
