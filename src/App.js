import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Logo from "./Nav-Logo-Footer/Logo/Logo";
import Navbar from "./Nav-Logo-Footer/Navbar/Navbar";
import Footer from "./Nav-Logo-Footer/Footer/Footer";
import { Explore } from "./Pages/Home/HomePage";
import ScrollToTop from "./ScrollToTop";
import { ToastProvider } from "./Components/Toast/ToastProvider";
import "./App.css";
import "./Components/Design/Design.css";
import "./Components/Design/AppPages.css";

// Per-route document titles (SEO + tab clarity in an SPA)
const TITLES = {
	"/": "JOA Morocco — Private Guided Tours of Morocco",
	"/kingdom-of-morocco": "The Kingdom of Morocco Tour · 11 Days Private | JOA Morocco",
	"/desert": "Sahara Dreams · 8-Day Private Desert Tour | JOA Morocco",
	"/book": "Book Your Private Tour | JOA Morocco",
	"/about": "About Us | JOA Morocco",
	"/contact": "Contact | JOA Morocco",
	"/find-booking": "Find Your Booking | JOA Morocco",
	"/terms": "Terms & Conditions | JOA Morocco",
	"/privacy": "Privacy Policy | JOA Morocco",
};

function App() {
	const pathname = useLocation().pathname;
	// Every page uses the homepage design system (DESIGN.md): its header and
	// footer. The trips band closes the tour, About and Contact pages; the
	// booking, lookup and legal pages end straight at the footer.
	const showTrips = ["/kingdom-of-morocco", "/desert", "/about", "/contact"].includes(pathname);

	useEffect(() => {
		document.title = TITLES[pathname] || TITLES["/"];
	}, [pathname]);

	return (
		<ToastProvider>
			<div className="App">
				<ScrollToTop />
				<div className="header">
					<Logo />
					<Navbar home />
				</div>
				<Outlet />
				{showTrips && (
					<div className="home">
						{/* Same trips section as the homepage, with this page's own heading */}
						<Explore
							title="Choose Your Morocco"
							subtitle="Three ways to travel, entirely private"
							intro="From the golden dunes of the Sahara to the blue streets of Chefchaouen — two carefully crafted private tours, or a custom journey designed around you. Every trip is reserved exclusively for you and your group."
						/>
					</div>
				)}
				<Footer variant="home" />
			</div>
		</ToastProvider>
	);
}

export default App;
