import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import App from "./App";
import HomePage from "./Pages/Home/HomePage";
import AboutPage from "./Pages/About/AboutPage";
import ContactPage from "./Pages/Contact/Contact";

import KingdomPage from "./Pages/Kingdom/Kingdom";
import DesertPage from "./Pages/Desert/DesertPage";
import BookingWizard from "./Pages/Booking/BookingWizard";
import FindBookingPage from "./Pages/Account/FindBookingPage";
import LegalPage from "./Pages/Legal/LegalPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "about", element: <AboutPage /> },
			{ path: "contact", element: <ContactPage /> },

			{ path: "kingdom-of-morocco", element: <KingdomPage /> },
			{ path: "desert", element: <DesertPage /> },

			{ path: "book", element: <BookingWizard /> },
			{ path: "find-booking", element: <FindBookingPage /> },
			{ path: "terms", element: <LegalPage doc="terms" /> },
			{ path: "privacy", element: <LegalPage doc="privacy" /> },

			// Legacy redirect
			{ path: "moroccan-odyssey", element: <Navigate to="/kingdom-of-morocco" replace /> },
			// Accounts were removed (29 Oct 2026); old links land on the guest lookup
			{ path: "login", element: <Navigate to="/find-booking" replace /> },
			{ path: "account", element: <Navigate to="/find-booking" replace /> },
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
