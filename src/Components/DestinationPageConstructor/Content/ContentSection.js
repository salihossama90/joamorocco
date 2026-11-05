import { Link } from "react-router-dom";
import InformationContent from "./Information";
import TourPlanContent from "./TourPlan";
import TourPlanSlider from "./TourPlanSlider";
import TourItinerary from "./TourItinerary";
import TourContact from "./TourContact";
import ReviewsContent from "./Reviews";
import { getTour, KIDS_PROMO } from "../../../data/tours";

import "./ContentSection.css";
import "./TourBook.css";

// `eyebrow`: a small label over the heading (converted tour pages)
const BookCta = ({ tour, eyebrow }) => {
	const t = getTour(tour);
	return (
		<aside className="book-cta" id="book-form">
			<div className="book-cta-inner">
				{eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
				<h3>Book this tour</h3>

				{/* Full per-person pricing up front — no checkout surprises */}
				<table className="price-tiers" aria-label="Price per person by group size">
					<tbody>
						{(t?.tiers || []).map((row) => (
							<tr key={row.guests}>
								<td>{row.guests}</td>
								<td>
									<strong>{row.pp}</strong> <span>/ person</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<p className="kids-promo">
					<span className="kids-promo-badge">Family deal</span>
					{KIDS_PROMO}
				</p>

				<ul className="book-cta-points">
					<li>Completely private — your group only</li>
					<li>{t?.days}-day guided journey</li>
					<li>Free date changes up to 2 weeks before your trip, subject to availability</li>
				</ul>
				<Link className="book-cta-btn" to={`/book?tour=${tour}`}>
					Start booking
				</Link>
				<Link className="book-cta-link" to="/find-booking">
					Find an existing booking
				</Link>
			</div>
		</aside>
	);
};

// `design` pages: overview + booking panel, then the tour plan as a full-width
// day slider, then reviews across the full content width
const ContentSection = ({ information, tourPlan, stops, reviews, tour, design, hideIntro }) =>
	design ? (
		<>
			{hideIntro ? (
				// the overview above already has the intro: the day-by-day
				// itinerary, the featured reviews, then Contact us + Book this tour
				// as cards in the itinerary's style
				<>
					{stops && <TourItinerary tourPlan={tourPlan} stops={stops} tour={tour} />}
					<section className="content-section" data-tone="light">
						<div className="content-destination-page">
							<div className="content-container content-container--solo content-container--reviews">
								<h2 className="content-heading" id="tour-reviews">
									Reviews
								</h2>
								<ReviewsContent info={reviews} tour={tour} design quotesOnly />
							</div>
						</div>
					</section>
					<section className="tbk" id="book" data-tone="light" aria-labelledby="tbk-title">
						<div className="tbk-inner">
							<div className="tbk-main">
								<h2 className="tbk-title" id="tbk-title">
									Plan your journey
								</h2>
								<p className="tbk-intro">
									Questions first? Send us a message. Ready to go? Choose your group and book.
								</p>
								<div className="tbk-row">
									<div className="tbk-card">
										<TourContact tour={tour} />
									</div>
									<div className="tbk-card">
										<BookCta tour={tour} eyebrow={`From ${getTour(tour)?.tiers?.at(-1)?.pp}pp`} />
									</div>
								</div>
							</div>
						</div>
					</section>
				</>
			) : (
				<>
					<section className="content-section" data-tone="light">
						<div className="content-destination-page">
							<div className="content-container">
								<div className="content">
									<InformationContent info={information} reviews={reviews} />
								</div>
								<BookCta tour={tour} />
							</div>
						</div>
					</section>
					<TourPlanSlider info={tourPlan} />
				</>
			)}
			{!hideIntro && (
				<section className="content-section" data-tone="light">
					<div className="content-destination-page">
						<div className="content-container">
							<div className="content">
								<h2 className="content-heading" id="tour-reviews">Reviews</h2>
								<ReviewsContent info={reviews} tour={tour} design />
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	) : (
		<section className="content-section" data-tone="light">
			<div className="content-destination-page">
				<div className="content-container">
					<div className="content">
						<InformationContent info={information} reviews={reviews} />
						<h2 className="content-heading">Tour Plan</h2>
						<TourPlanContent info={tourPlan} />
						<h2 className="content-heading" id="tour-reviews">Reviews</h2>
						<ReviewsContent info={reviews} tour={tour} />
					</div>
					<BookCta tour={tour} />
				</div>
			</div>
		</section>
	);

export default ContentSection;
