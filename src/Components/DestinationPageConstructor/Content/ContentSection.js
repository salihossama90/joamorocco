import { Link } from "react-router-dom";
import InformationContent from "./Information";
import TourPlanContent from "./TourPlan";
import TourPlanSlider from "./TourPlanSlider";
import ReviewsContent from "./Reviews";
import { getTour, KIDS_PROMO } from "../../../data/tours";

import "./ContentSection.css";

const BookCta = ({ tour }) => {
	const t = getTour(tour);
	return (
		<aside className="book-cta" id="book-form">
			<div className="book-cta-inner">
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
const ContentSection = ({ information, tourPlan, reviews, tour, design, hideIntro }) =>
	design ? (
		<>
			{hideIntro ? (
				// the overview above already has the intro: day-by-day plan first,
				// then the review form and the booking box side by side, reviews under
				<>
					<TourPlanSlider info={tourPlan} />
					<section className="content-section" data-tone="light">
						<div className="content-destination-page">
							<div className="content-container content-container--solo">
								<ReviewsContent info={reviews} tour={tour} design aside={<BookCta tour={tour} />} />
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
