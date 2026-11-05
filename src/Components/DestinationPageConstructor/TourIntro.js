import SocialMediaIcons from "../../Nav-Logo-Footer/SocialMediaIcons/SocialMediaIcons";
import { getTour } from "../../data/tours";
import "./TourIntro.css";

// Top of a converted tour page, laid out after the user's reference
// screenshot: a full-width photo with the title centred on it (social rings
// at the bottom, as on the homepage hero), then a centred overview and
// three key facts (When / Price / How long).

export const TourImageHero = ({ image, country, title, subtitle }) => (
	<section className="ti-hero" style={{ backgroundImage: `url("${image}")` }}>
		<div className="ti-hero-scrim" aria-hidden="true" />
		<div className="ti-hero-text">
			<p className="ti-hero-country">{country}</p>
			<h1 className="ti-hero-title">{title}</h1>
			<p className="ti-hero-sub">{subtitle}</p>
		</div>
		<div className="ti-hero-social">
			<SocialMediaIcons only={["Facebook", "Instagram", "TikTok", "YouTube"]} />
		</div>
	</section>
);

export const TourOverview = ({ tour, information, country }) => {
	const t = getTour(tour);
	const tiers = t?.tiers || [];
	// lowest rate is the largest group's tier
	const from = tiers[tiers.length - 1];
	const paragraphs = Array.isArray(information.description)
		? information.description
		: [information.description];
	// "a, b and c" — items after the first start lower-case mid-sentence
	const included = (information.included || []).map((item, i) =>
		i === 0 ? item : item.charAt(0).toLowerCase() + item.slice(1)
	);
	const includedText =
		included.length > 1 ? `${included.slice(0, -1).join(", ")} and ${included.at(-1)}` : included[0];

	return (
		<section className="ti-overview" data-tone="light">
			<div className="ti-col">
				<p className="ti-eyebrow">{country}</p>
				<h2 className="ti-title">{information.title}</h2>
				{paragraphs.map((p) => (
					<p className="ti-body" key={p}>
						{p}
					</p>
				))}
				{includedText && (
					<p className="ti-body">
						<strong>Included:</strong> {includedText}.
					</p>
				)}
			</div>

			<hr className="ti-rule" />

			<dl className="ti-facts">
				<div>
					<dt>When</dt>
					<dd>Year-round</dd>
					<dd>On the dates you choose</dd>
				</div>
				<div>
					<dt>Price</dt>
					<dd>From {from?.pp}pp excl. flights</dd>
					<dd className="ti-note">(based on {from?.guests})</dd>
				</div>
				<div>
					<dt>How long</dt>
					<dd>{t?.days} days</dd>
					<dd>{t?.nights} nights</dd>
				</div>
			</dl>
		</section>
	);
};
