import React, { useState, useEffect, useRef } from "react";
import { api } from "../../../lib/api";
import { useToast } from "../../Toast/ToastProvider";
import "./Reviews.css";
import { ReviewQuotes } from "../../../Pages/Home/HomePage";

// Converted tour pages feature 8 reviews in the homepage carousel: the newest
// five-star ones (guest-posted first, then the page's own)
const FEATURED = 8;

const StarDisplay = ({ stars }) => (
	<div className="review-rating">
		{[1, 2, 3, 4, 5].map((i) => (
			<span key={i} className={`star ${i <= stars ? "filled" : "empty"}`}>
				&#9733;
			</span>
		))}
	</div>
);

const StarInput = ({ value, onChange }) => {
	const [hovered, setHovered] = useState(0);
	return (
		<div className="star-input" onMouseLeave={() => setHovered(0)}>
			{[1, 2, 3, 4, 5].map((n) => (
				<span
					key={n}
					className={`star-btn ${n <= (hovered || value) ? "active" : ""}`}
					onMouseEnter={() => setHovered(n)}
					onClick={() => onChange(n)}
				>
					&#9733;
				</span>
			))}
		</div>
	);
};

const ReviewItem = ({ review }) => {
	return (
		<div className="review-item">
			<div className="review-head">
				<div className="review-avatar">{review.name.charAt(0).toUpperCase()}</div>
				<div className="review-info">
					<h4 className="review-name">
						{review.name}
						{review.verified && <span className="verified-badge">✓ Verified traveler</span>}
					</h4>
					<StarDisplay stars={review.stars} />
				</div>
			</div>
			<p className="review-review">{review.review}</p>
		</div>
	);
};

// Reviews read sideways: swipe (native scroll-snap) or the arrows move one
// card. No "n / total" counter — it just slides.
// Wider screens show two or three cards at once, so everything is read from
// the scroll position itself.
const ReviewCarousel = ({ reviews }) => {
	const trackRef = useRef(null);
	const [pos, setPos] = useState({ index: 0, visible: 1, atStart: true, atEnd: true });

	// One card plus the gap after it — the distance a swipe or arrow moves
	const cardStep = (track) => {
		const [a, b] = track.children;
		return b ? b.offsetLeft - a.offsetLeft : track.clientWidth;
	};

	const measure = () => {
		const track = trackRef.current;
		if (!track || !track.children.length) return;
		const w = cardStep(track);
		setPos({
			index: Math.round(track.scrollLeft / w),
			visible: Math.max(1, Math.round(track.clientWidth / w)),
			atStart: track.scrollLeft <= 4,
			atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
		});
	};

	useEffect(() => {
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reviews.length]);

	// Card an arrow is still smoothly scrolling to (null once settled), so
	// taps during the animation stack up instead of repeating the same move
	const target = useRef(null);
	const settle = useRef(0);

	const step = (delta) => {
		const track = trackRef.current;
		if (!track) return;
		const last = Math.max(0, reviews.length - pos.visible);
		const n = Math.max(0, Math.min(last, (target.current ?? pos.index) + delta));
		target.current = n;
		clearTimeout(settle.current);
		settle.current = setTimeout(() => (target.current = null), 700);
		track.scrollTo({ left: n * cardStep(track), behavior: "smooth" });
	};

	const fits = pos.atStart && pos.atEnd;

	return (
		<div className="review-carousel" aria-roledescription="carousel" aria-label="Traveler reviews">
			<div className="review-content" ref={trackRef} onScroll={measure}>
				{reviews.map((review, i) => (
					<ReviewItem key={i} review={review} />
				))}
			</div>
			{!fits && (
				<div className="review-carousel-nav">
					<button type="button" className="review-arrow" aria-label="Previous review"
						disabled={pos.atStart} onClick={() => step(-1)}>
						&#8249;
					</button>
					<button type="button" className="review-arrow" aria-label="Next review"
						disabled={pos.atEnd} onClick={() => step(1)}>
						&#8250;
					</button>
				</div>
			)}
		</div>
	);
};

const EMPTY_FORM = { reference: "", email: "", name: "", stars: 5, review: "" };

// `aside` (converted tour pages): the review form sits beside it, the rating
// summary is left out and the featured reviews follow under their own heading
const ReviewsContent = ({ info, tour, design, aside }) => {
	const toast = useToast();
	const [dbReviews, setDbReviews] = useState([]);
	const [form, setForm] = useState(EMPTY_FORM);
	const [error, setError] = useState("");
	const [submitStatus, setSubmitStatus] = useState("idle");

	const loadReviews = () => {
		api
			.get(`/api/get-reviews?tour=${tour}`)
			.then((rows) => setDbReviews(Array.isArray(rows) ? rows : []))
			.catch(() => {});
	};

	useEffect(() => {
		if (tour) loadReviews();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tour]);

	const handleChange = (e) => {
		setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.reference.trim() || !form.email.trim()) {
			setError("Enter the confirmation code and email from your booking.");
			return;
		}
		if (!form.review.trim()) {
			setError("Please write a short review.");
			return;
		}
		setSubmitStatus("loading");
		setError("");
		try {
			await api.post("/api/submit-review", {
				tour,
				reference: form.reference.trim(),
				email: form.email.trim(),
				name: form.name.trim() || undefined,
				stars: form.stars,
				review: form.review.trim(),
			});
			loadReviews();
			setForm(EMPTY_FORM);
			setSubmitStatus("success");
			toast.success("Thank you for your review!");
			setTimeout(() => setSubmitStatus("idle"), 4000);
		} catch (err) {
			setSubmitStatus("idle");
			setError(err.message);
		}
	};

	const allReviews = [...dbReviews, ...info];

	// Star distribution across all shown reviews.
	const total = allReviews.length || 1;
	const dist = [5, 4, 3, 2, 1].map((s) => ({
		s,
		count: allReviews.filter((r) => r.stars === s).length,
	}));
	const avg = (allReviews.reduce((a, r) => a + r.stars, 0) / total).toFixed(1);

	const summary = (
		<div className="reviews-summary">
			<div className="reviews-avg">
				<strong>{avg}</strong>
				<StarDisplay stars={Math.round(avg)} />
				<span>{allReviews.length} reviews</span>
			</div>
			<div className="reviews-bars">
				{dist.map(({ s, count }) => (
					<div className="reviews-bar-row" key={s}>
						<span className="rb-label">{s}★</span>
						<div className="rb-track">
							<div className="rb-fill" style={{ width: `${(count / total) * 100}%` }} />
						</div>
						<span className="rb-count">{count}</span>
					</div>
				))}
			</div>
		</div>
	);

	const reviewForm = (
		<div className="add-review-card">
			<h3>Share Your Experience</h3>
			<p className="add-review-sub">
				Reviews are for confirmed guests — enter your confirmation code and email.
			</p>

			{submitStatus === "success" && (
				<div className="review-success">Your review has been posted — thank you!</div>
			)}

			<form className="add-review-form" onSubmit={handleSubmit}>
				<div className="review-form-row">
					<div className="review-form-field">
						<label htmlFor="rv-ref">Confirmation Code *</label>
						<input id="rv-ref" name="reference" type="text" placeholder="JOA-XXXX-XXXX"
							value={form.reference} onChange={handleChange} required />
					</div>
					<div className="review-form-field">
						<label htmlFor="rv-email">Email *</label>
						<input id="rv-email" name="email" type="email" placeholder="your@email.com"
							value={form.email} onChange={handleChange} required />
					</div>
				</div>

				<div className="review-form-row">
					<div className="review-form-field">
						<label htmlFor="rv-name">Display Name</label>
						<input id="rv-name" name="name" type="text" placeholder="Optional"
							value={form.name} onChange={handleChange} />
					</div>
					<div className="review-form-field">
						<label>Rating</label>
						<StarInput value={form.stars} onChange={(n) => setForm((f) => ({ ...f, stars: n }))} />
					</div>
				</div>

				<div className="review-form-field">
					<label htmlFor="rv-review">Review *</label>
					<textarea id="rv-review" name="review" placeholder="Tell us about your experience..."
						value={form.review} onChange={handleChange} required rows={4} />
				</div>

				{error && <p className="review-error">{error}</p>}

				<button type="submit" className="review-submit-btn" disabled={submitStatus === "loading"}>
					{submitStatus === "loading" ? "Posting…" : "Post Review"}
				</button>
			</form>
		</div>
	);

	return (
		<div className="reviews-wrapper">
			{aside ? (
				<div className="reviews-split">
					{reviewForm}
					{aside}
				</div>
			) : (
				<>
					{summary}
					{reviewForm}
				</>
			)}

			{aside && (
				<h2 className="content-heading" id="tour-reviews">
					Reviews
				</h2>
			)}
			{design ? (
				<div className="home tour-review-quotes">
					<ReviewQuotes reviews={allReviews.filter((r) => r.stars === 5).slice(0, FEATURED)} />
				</div>
			) : (
				<ReviewCarousel reviews={allReviews} />
			)}
		</div>
	);
};

export default ReviewsContent;
