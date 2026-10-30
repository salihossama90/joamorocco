import useInView from "../../../hooks/useInView";
import "./Information.css";

const InformationItem = ({ title, description, index }) => {
	const [ref, inView] = useInView();
	return (
		<li
			ref={ref}
			className={`info-item anim fade-right ${inView ? "anim-in" : ""}`}
			style={{ "--anim-delay": `${(index ?? 0) * 80}ms` }}
		>
			<h6>{title}</h6>
			<p>{description}</p>
		</li>
	);
};

// Tour's average rating in gold, right under the title; taps through to the reviews
const TitleStars = ({ reviews = [] }) => {
	if (!reviews.length) return null;
	const stars = Math.round(reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length);
	return (
		<a className="title-stars" href="#tour-reviews" aria-label={`Rated ${stars} out of 5 — read reviews`}>
			{[0, 1, 2, 3, 4].map((i) => (
				<span key={i} className={`gold-star ${i < stars ? "filled" : "empty"}`}>
					&#9733;
				</span>
			))}
		</a>
	);
};

const InformationContent = ({ info, reviews }) => {
	const [descRef, descInView] = useInView();
	const {
		title,
		price,
		description,
		destination,
		departureTime,
		dressCode,
		included,
	} = info;

	return (
		<div className="information-destination-page">
			<div
				ref={descRef}
				className={`description anim fade-up ${descInView ? "anim-in" : ""}`}
			>
				<h1>{title}</h1>
				<TitleStars reviews={reviews} />
				<h4>{price} / person</h4>
				{(Array.isArray(description) ? description : [description]).map(
					(paragraph, index) => (
						<p key={index}>{paragraph}</p>
					)
				)}
			</div>
			<ul>
				<InformationItem index={0} title="Destination" description={destination} />
				<InformationItem index={1} title="Departure Time" description={departureTime} />
				<InformationItem
					index={2}
					title="Dress Code"
					description={dressCode.join(", ")}
				/>
				<InformationItem
					index={3}
					title="Included"
					description={included.join(", ")}
				/>
			</ul>
		</div>
	);
};

export default InformationContent;
