import React, { useState } from "react";
import { api } from "../../lib/api";
import TripCard from "./TripCard";
import "./Account.css";

export default function FindBookingPage() {
	const [reference, setReference] = useState("");
	const [email, setEmail] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [booking, setBooking] = useState(null);

	const submit = async (e) => {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			const data = await api.post("/api/lookup-booking", {
				reference: reference.trim(),
				email: email.trim(),
			});
			setBooking(data.booking);
		} catch (err) {
			setError(err.message);
			setBooking(null);
		} finally {
			setBusy(false);
		}
	};

	return (
		<main className="ds-page account-page" data-tone="light">
			<div className="account-shell narrow">
				<header className="account-header">
					<div>
						<h1>Find your booking</h1>
						<p>Enter the confirmation code and the email you booked with.</p>
					</div>
				</header>

				{!booking && (
					<form className="lookup-form" onSubmit={submit}>
						<label className="field">
							<span className="field-label">Confirmation code</span>
							<input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="JOA-XXXX-XXXX" />
						</label>
						<label className="field">
							<span className="field-label">Email</span>
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
						</label>
						{error && <p className="form-error">{error}</p>}
						<button className="btn-primary" type="submit" disabled={busy}>
							{busy ? <span className="btn-spinner" /> : "Find booking"}
						</button>
					</form>
				)}

				{booking && (
					<>
						<TripCard booking={booking} auth={{ email: email.trim() }} onChanged={() => setBooking(null)} />
						<button className="link-btn" onClick={() => setBooking(null)}>Look up another booking</button>
					</>
				)}
			</div>
		</main>
	);
}
