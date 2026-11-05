import { useState } from "react";
import emailjs from "emailjs-com";
import { useToast } from "../../Toast/ToastProvider";
import { getTour } from "../../../data/tours";

// "Contact us" beside the booking box on converted tour pages: a short form
// that sends through the same EmailJS template as the Contact page, with the
// tour in the subject.
const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const configured = (v) => v && !/^YOUR/i.test(v);
const emailReady = configured(SERVICE) && configured(TEMPLATE) && configured(PUBLIC_KEY);

const EMPTY = { name: "", email: "", message: "" };

const TourContact = ({ tour }) => {
	const toast = useToast();
	const name = getTour(tour)?.name || "a tour";
	const [form, setForm] = useState(EMPTY);
	const [busy, setBusy] = useState(false);

	const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!emailReady) {
			toast.error("Messaging isn't configured yet. Please email us directly at joamorocco@gmail.com.");
			return;
		}
		setBusy(true);
		try {
			await emailjs.send(
				SERVICE,
				TEMPLATE,
				{ name: form.name, email: form.email, subject: `Question about ${name}`, message: form.message },
				PUBLIC_KEY
			);
			toast.success("Message sent. We'll be in touch soon!");
			setForm(EMPTY);
		} catch {
			toast.error("Failed to send message. Please try again.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="tour-contact">
			<h3 className="tour-contact-title">Contact us</h3>
			<p className="tour-contact-sub">Questions about {name}? Send us a message.</p>
			<form className="tour-contact-form" onSubmit={handleSubmit}>
				<div className="tour-contact-row">
					<label className="tour-contact-field">
						<span>Name</span>
						<input type="text" name="name" placeholder="Your name" autoComplete="name"
							value={form.name} onChange={handleChange} />
					</label>
					<label className="tour-contact-field">
						<span>Email *</span>
						<input type="email" name="email" placeholder="your@email.com" autoComplete="email" required
							value={form.email} onChange={handleChange} />
					</label>
				</div>
				<label className="tour-contact-field">
					<span>Message *</span>
					<textarea name="message" rows={5} placeholder="Your message" required
						value={form.message} onChange={handleChange} />
				</label>
				<button type="submit" className="tour-contact-btn" disabled={busy}>
					{busy ? "Sending…" : "Send message"}
				</button>
			</form>
		</div>
	);
};

export default TourContact;
