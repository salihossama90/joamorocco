import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { computeQuote } from "@shared/pricing.mjs";
import { getTour } from "../../data/tours";

import WizardProgress from "./WizardProgress";
import PriceSummary from "./PriceSummary";
import StepTour from "./steps/StepTour";
import StepDate from "./steps/StepDate";
import StepGuests from "./steps/StepGuests";
import StepRequests from "./steps/StepRequests";
import StepPayment from "./steps/StepPayment";
import StepConfirmation from "./steps/StepConfirmation";

import "./Booking.css";

const STORAGE_KEY = "joa-booking-draft";

const DEFAULT_DATA = {
	tour: null,
	startDate: null,
	adults: 2,
	children: 0,
	toddlers: 0,
	specialRequests: "",
	luxury: false,
	contact: { name: "", email: "", phone: "" },
	payment: { method: "card", cardName: "", cardNumber: "", expiry: "", cvc: "" },
};

const STEPS = ["Tour", "Dates", "Guests", "Requests", "Payment", "Done"];

function loadDraft() {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) };
	} catch {
		/* ignore */
	}
	return DEFAULT_DATA;
}

export default function BookingWizard() {
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const [data, setData] = useState(loadDraft);
	const [step, setStep] = useState(1);
	const [maxReached, setMaxReached] = useState(1);
	const [result, setResult] = useState(null);

	// Preselect tour from ?tour= and jump to date step.
	useEffect(() => {
		const t = params.get("tour");
		if (t && getTour(t)) {
			setData((d) => ({ ...d, tour: t }));
			setStep((s) => (s < 2 ? 2 : s));
			setMaxReached((m) => Math.max(m, 2));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Persist the draft (never persist the final result).
	useEffect(() => {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch {
			/* ignore */
		}
	}, [data]);

	const update = (patch) => setData((d) => ({ ...d, ...patch }));

	const quote = useMemo(
		() => (data.tour ? computeQuote(data.tour, data.adults, data.children, data.toddlers) : null),
		[data.tour, data.adults, data.children, data.toddlers]
	);

	const goTo = (n) => {
		if (n <= maxReached) {
			setStep(n);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};
	const next = () => {
		const n = Math.min(step + 1, STEPS.length);
		setStep(n);
		setMaxReached((m) => Math.max(m, n));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	const back = () => setStep((s) => Math.max(1, s - 1));

	const onConfirmed = (res) => {
		setResult(res);
		setMaxReached(6);
		setStep(6);
		try {
			sessionStorage.removeItem(STORAGE_KEY);
		} catch {
			/* ignore */
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const startOver = () => {
		setData(DEFAULT_DATA);
		setResult(null);
		setStep(1);
		setMaxReached(1);
		navigate("/book", { replace: true });
	};

	const shared = { data, update, next, back, quote };

	return (
		<main className="ds-page booking-page" data-tone="light">
			<div className="booking-shell">
				<div className="booking-main">
					<WizardProgress steps={STEPS} step={step} maxReached={maxReached} onJump={goTo} />

					<div className="booking-step" key={step}>
						{step === 1 && <StepTour {...shared} />}
						{step === 2 && <StepDate {...shared} />}
						{step === 3 && <StepGuests {...shared} />}
						{step === 4 && <StepRequests {...shared} />}
						{step === 5 && <StepPayment {...shared} onConfirmed={onConfirmed} />}
						{step === 6 && <StepConfirmation result={result} onStartOver={startOver} />}
					</div>
				</div>

				{step >= 2 && step <= 5 && quote && (
					// No guests or total until the guest step — before that it'd just
					// be the default 2 adults, which reads like a price already chosen
					<PriceSummary data={data} quote={quote} showPrice={maxReached >= 3} />
				)}
			</div>
		</main>
	);
}
