import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Logo from "./Nav-Logo-Footer/Logo/Logo";
import Navbar from "./Nav-Logo-Footer/Navbar/Navbar";
import Footer from "./Nav-Logo-Footer/Footer/Footer";
import PopularAdventuresSection from "./Nav-Logo-Footer/PopularSection";
import { Explore } from "./Pages/Home/HomePage";
import ScrollToTop from "./ScrollToTop";
import ConsultButton from "./Components/ConsultButton/ConsultButton";
import { ToastProvider } from "./Components/Toast/ToastProvider";
import "./App.css";

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
	const isHome = pathname === "/";
	// Full-bleed app pages provide their own footer/spacing.
	const isAppPage = ["/book", "/find-booking", "/terms", "/privacy"].includes(pathname);
	// Pages already converted to the homepage design system (DESIGN.md): they
	// share its header, trips section and footer
	const isDesignTour = pathname === "/kingdom-of-morocco";
	const isDesignPage = isHome || isDesignTour;

	useEffect(() => {
		document.title = TITLES[pathname] || TITLES["/"];
	}, [pathname]);

	return (
		<ToastProvider>
			<div className="App">
				<ScrollToTop />
				<div className="header">
					<Logo />
					<Navbar home={isDesignPage} />
				</div>
				<Outlet />
				{!isDesignPage && !isAppPage && (
					<>
						<PopularAdventuresSection />
						<Footer />
					</>
				)}
				{isDesignTour && (
					<div className="home">
						{/* Same trips section as the homepage, with this page's own heading */}
						<Explore
							title="Choose Your Morocco"
							subtitle="Three ways to travel, entirely private"
							intro="From the golden dunes of the Sahara to the blue streets of Chefchaouen — two carefully crafted private tours, or a custom journey designed around you. Every trip is reserved exclusively for you and your group."
						/>
					</div>
				)}
				{isAppPage && <Footer />}
				{isDesignPage && <Footer variant="home" />}
				{/* Converted pages carry Free Consultation in their header instead */}
				{!isDesignPage && <ConsultButton />}
			</div>
		</ToastProvider>
	);
}

export default App;
