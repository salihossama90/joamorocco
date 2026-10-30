import { Link } from "react-router-dom";
import InformationContent from "./Information";
import TourPlanContent from "./TourPlan";
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

const ContentSection = ({ information, tourPlan, reviews, tour }) => (
	<section className="content-section">
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
