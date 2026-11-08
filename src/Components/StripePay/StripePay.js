import React, { useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getStripe } from "../../lib/stripe";
import "./StripePay.css";

// Stripe's secure payment form (card, Apple Pay, Google Pay) for one
// PaymentIntent. Card details go straight to Stripe and never touch our
// servers. On success it calls onPaid(paymentIntent); the caller then asks
// our server to record it.

// The form in the site's look: Josefin Sans, underlined-feel fields, JOA orange
const APPEARANCE = {
	theme: "stripe",
	variables: {
		colorPrimary: "#ff681a",
		colorText: "#2f2f2f",
		colorTextSecondary: "#52575c",
		colorDanger: "#c0392b",
		fontFamily: '"Josefin Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
		fontSizeBase: "16px",
		borderRadius: "3px",
		spacingUnit: "4px",
	},
	rules: {
		".Label": { fontSize: "12px", fontWeight: "700", letterSpacing: "1.2px", textTransform: "uppercase", color: "#2f2f2f" },
		".Input": { boxShadow: "none", border: "1px solid #cacccf" },
		".Input:focus": { borderColor: "#ff681a", boxShadow: "none" },
		".Tab": { boxShadow: "none", border: "1px solid #cacccf" },
		".Tab--selected": { borderColor: "#000", boxShadow: "none" },
	},
};
const FONTS = [{ cssSrc: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap" }];

function PayForm({ label, onPaid, onError, disabled }) {
	const stripe = useStripe();
	const elements = useElements();
	const [ready, setReady] = useState(false);
	const [busy, setBusy] = useState(false);

	const pay = async () => {
		if (!stripe || !elements) return;
		setBusy(true);
		const { error, paymentIntent } = await stripe.confirmPayment({
			elements,
			redirect: "if_required",
			confirmParams: { return_url: window.location.href },
		});
		if (error) {
			setBusy(false);
			onError?.(error.message || "Your payment didn't go through. Please try again.");
			return;
		}
		if (paymentIntent?.status === "succeeded") {
			await onPaid(paymentIntent);
		} else if (paymentIntent?.status === "processing") {
			// a slower method (e.g. a bank payment): Stripe tells us when it clears
			onError?.("Your payment is processing. We'll email you as soon as it's confirmed.");
		} else {
			onError?.("Your payment didn't go through. Please try again.");
		}
		setBusy(false);
	};

	return (
		<div className="stripe-pay">
			<PaymentElement onReady={() => setReady(true)} options={{ layout: "tabs" }} />
			<button
				type="button"
				className="btn-primary stripe-pay-btn"
				onClick={pay}
				disabled={!stripe || !ready || busy || disabled}
			>
				{busy ? <span className="btn-spinner" aria-label="Processing" /> : label}
			</button>
			<p className="stripe-pay-note">Payments are processed securely by Stripe.</p>
		</div>
	);
}

// Which payment types show (card, Apple Pay, Google Pay…) is set in the
// Stripe dashboard: Settings → Payment methods.
export default function StripePay({ clientSecret, amountCents, ...rest }) {
	const stripe = getStripe();
	if (!stripe) {
		return <p className="form-error">Online payment isn't available yet. Please contact us to book.</p>;
	}
	return (
		<Elements stripe={stripe} key={clientSecret} options={{ clientSecret, appearance: APPEARANCE, fonts: FONTS }}>
			<PayForm {...rest} />
		</Elements>
	);
}
