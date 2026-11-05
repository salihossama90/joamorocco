import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import emailjs from "emailjs-com";
import { useToast } from "../../Components/Toast/ToastProvider";

const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const configured = (v) => v && !/^YOUR/i.test(v);
const emailReady = configured(SERVICE) && configured(TEMPLATE) && configured(PUBLIC_KEY);

const CONSULT = "Free consultation";
const ABOUT = [CONSULT, "Ask a question", "Other"];
// Free Consultation button and the home page's Custom panel arrive pre-filled;
// custom trips start with a consultation, so custom lands there too
const TOPICS = { consultation: CONSULT, custom: CONSULT };
const TOPIC_NOTES = { custom: "I'd like a custom trip. " };
const METHODS = [
	{ value: "WhatsApp video call", phone: true },
	{ value: "WhatsApp audio call", phone: true },
	{ value: "Phone call (US only)", phone: true },
	{ value: "Google Meet" },
	{ value: "Zoom" },
];
const needsPhone = (method) => Boolean(METHODS.find((m) => m.value === method)?.phone);
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

// No consultation calendar exists: the visitor proposes a slot in their own
// time, and the time zone travels with it in the email
const pad = (n) => String(n).padStart(2, "0");
const DAYS = Array.from({ length: 14 }, (_, i) => {
	const d = new Date();
	d.setDate(d.getDate() + i + 1);
	return {
		value: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
		label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
	};
});
// Every 30 minutes, 9:00 to the last call starting at 17:30
const SLOTS = Array.from({ length: 18 }, (_, i) => {
	const d = new Date(2000, 0, 1, 9 + Math.floor(i / 2), (i % 2) * 30);
	return {
		value: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
		label: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
	};
});
const labelOf = (list, value) => list.find((o) => o.value === value)?.label || value;

const EMPTY = { name: "", email: "", about: "Ask a question", day: "", time: "", method: "", phone: "", message: "" };

const FormInputs = () => {
	const toast = useToast();
	const [searchParams] = useSearchParams();
	// Only known topics count — ignores inherited keys like ?topic=constructor
	const raw = searchParams.get("topic");
	const topic = Object.hasOwn(TOPICS, raw ?? "") ? raw : null;
	const topicAbout = TOPICS[topic] || "";
	const consult = Boolean(topicAbout);
	const formRef = useRef(null);
	const [formData, setFormData] = useState({
		...EMPTY,
		about: topicAbout || EMPTY.about,
		message: TOPIC_NOTES[topic] || "",
	});

	// Arriving from either: pre-fill and bring the form into view
	useEffect(() => {
		if (!consult) return;
		setFormData((f) => ({ ...f, about: topicAbout, message: f.message || TOPIC_NOTES[topic] || "" }));
		const id = setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
		return () => clearTimeout(id);
	}, [consult, topicAbout, topic, searchParams]);
	const [busy, setBusy] = useState(false);
	const isConsult = formData.about === CONSULT;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((f) => ({ ...f, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!emailReady) {
			toast.error("Messaging isn't configured yet. Please email us directly at joamorocco@gmail.com.");
			return;
		}
		setBusy(true);
		try {
			// The template only knows name/email/subject/message, so the
			// consultation details ride at the top of the message
			const f = formData;
			let { message } = f;
			let subject = f.about;
			if (isConsult) {
				const when = `${labelOf(DAYS, f.day)}, ${labelOf(SLOTS, f.time)} (visitor's time zone: ${TIME_ZONE})`;
				subject = `${CONSULT}: ${when}`;
				message = [
					`Requested call: ${when} [${f.day} ${f.time}]`,
					`Meet by: ${f.method}`,
					needsPhone(f.method) ? `Phone / WhatsApp: ${f.phone}` : `Meeting invite to: ${f.email}`,
					"",
					message,
				].join("\n");
			}
			await emailjs.send(SERVICE, TEMPLATE, { name: f.name, email: f.email, subject, message }, PUBLIC_KEY);
			toast.success("Message sent. We'll be in touch soon!");
			setFormData(EMPTY);
		} catch {
			toast.error("Failed to send message. Please try again.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<section className="ds-card contact-card" ref={formRef} aria-labelledby="contact-title">
			<p className="ds-label">Get in touch</p>
			<h2 className="ds-heading" id="contact-title">
				Contact us
			</h2>
			<form className="contact-form" onSubmit={handleSubmit}>
				<div className="contact-row">
					<label className="ds-field">
						<span>Name</span>
						<input className="ds-input" type="text" name="name" placeholder="Your name"
							value={formData.name} onChange={handleChange} autoComplete="name" />
					</label>
					<label className="ds-field">
						<span>Email *</span>
						<input className="ds-input" type="email" name="email" placeholder="your@email.com" required
							value={formData.email} onChange={handleChange} autoComplete="email" />
					</label>
				</div>

				<div className="ds-field" role="radiogroup" aria-label="About">
					<span className="ds-field-label">About</span>
					<div className="contact-pills">
						{ABOUT.map((a) => (
							<label key={a} className="contact-pill">
								<input type="radio" name="about" value={a}
									checked={formData.about === a} onChange={handleChange} />
								{a}
							</label>
						))}
					</div>
				</div>

				{isConsult && (
					<>
						<div className="contact-row">
							<label className="ds-field">
								<span>Day *</span>
								<select className="ds-input" name="day" required value={formData.day} onChange={handleChange}>
									<option value="">Pick a day</option>
									{DAYS.map((d) => (
										<option key={d.value} value={d.value}>{d.label}</option>
									))}
								</select>
							</label>
							<label className="ds-field">
								<span>Time *</span>
								<select className="ds-input" name="time" required value={formData.time} onChange={handleChange}>
									<option value="">Pick a time</option>
									{SLOTS.map((t) => (
										<option key={t.value} value={t.value}>{t.label}</option>
									))}
								</select>
							</label>
						</div>
						<label className="ds-field">
							<span>Meet by *</span>
							<select className="ds-input" name="method" required value={formData.method} onChange={handleChange}>
								<option value="">How should we meet?</option>
								{METHODS.map((m) => (
									<option key={m.value} value={m.value}>{m.value}</option>
								))}
							</select>
						</label>
						{needsPhone(formData.method) && (
							<label className="ds-field">
								<span>Phone *</span>
								<input className="ds-input" type="tel" name="phone" required
									placeholder={formData.method.startsWith("Phone") ? "US number only" : "WhatsApp, with country code"}
									value={formData.phone} onChange={handleChange} autoComplete="tel" />
							</label>
						)}
						<p className="contact-note">Times are in your time zone ({TIME_ZONE}).</p>
					</>
				)}

				<label className="ds-field">
					<span>Message *</span>
					<textarea className="ds-input contact-message" id="pc-message" name="message"
						placeholder="Dear JOA Morocco…" required rows={5}
						value={formData.message} onChange={handleChange} />
				</label>

				<button type="submit" className="ds-btn ds-btn--block" disabled={busy}>
					{busy ? "Sending…" : "Send message"}
				</button>
			</form>
		</section>
	);
};

export default FormInputs;
