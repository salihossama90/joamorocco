import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Logo from "./Nav-Logo-Footer/Logo/Logo";
import Navbar from "./Nav-Logo-Footer/Navbar/Navbar";
import Footer from "./Nav-Logo-Footer/Footer/Footer";
import PopularAdventuresSection from "./Nav-Logo-Footer/PopularSection";
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

	useEffect(() => {
		document.title = TITLES[pathname] || TITLES["/"];
	}, [pathname]);

	return (
		<ToastProvider>
			<div className="App">
				<ScrollToTop />
				<div className="header">
					<Logo />
					<Navbar color="#fff" />
				</div>
				<Outlet />
				{!isHome && !isAppPage && (
					<>
						<PopularAdventuresSection />
						<Footer />
					</>
				)}
				{isAppPage && <Footer />}
				<ConsultButton />
			</div>
		</ToastProvider>
	);
}

export default App;
