import { loadStripe } from "@stripe/stripe-js";

// The browser half of Stripe: loaded once, only when a payment form appears.
const KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripeConfigured = () => /^pk_(test|live)_/.test(KEY || "");

let promise = null;
export function getStripe() {
	if (!stripeConfigured()) return null;
	if (!promise) promise = loadStripe(KEY);
	return promise;
}
