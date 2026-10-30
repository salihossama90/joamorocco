import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { TOUR_LIST } from "../../data/tours";
import Images, { CustomVideo } from "../../images";

import "./ShowCase.css";

// Third panel: no fixed itinerary or price — JOA talks with the traveller and
// builds the trip around them, so it opens the contact form, not the booking.
const CUSTOM_PANEL = {
	key: "custom",
	name: "Custom",
	subTitle: "A Morocco trip built around you",
	eyebrow: "Any length · Private",
	note: "Your dates · your pace · your budget",
	cta: "Plan my trip",
	route: "/contact?topic=custom",
	video: CustomVideo,
	heroImage: Images.CustomHero,
};

const ShowCaseItem = ({ tour }) => {
	const { name, subTitle, video, heroImage, route, days, priceRange } = tour;
	const eyebrow = tour.eyebrow || `${days} Days · Private`;
	const note = tour.note || `${priceRange} / person · kids 50% off`;
	const cta = tour.cta || "Explore & Book";
	const videoRef = useRef(null);

	useEffect(() => {
		const el = videoRef.current;
		if (!el) return;
		const load = () => {
			el.src = video;
			el.load();
			el.play().catch(() => {});
		};
		const t = setTimeout(load, 1000);
		return () => clearTimeout(t);
	}, [video]);

	const handlePlay = () => {
		if (videoRef.current) videoRef.current.classList.add("playing");
	};

	return (
		<div
			className="show-case-item"
			style={{
				backgroundImage: `url(${heroImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<video
				ref={videoRef}
				className="show-case-video"
				muted
				loop
				playsInline
				poster={heroImage}
				onPlay={handlePlay}
			/>
			<div className="show-case-content">
				<span className="show-case-eyebrow">{eyebrow}</span>
				<h2>{name}</h2>
				<h4>{subTitle}</h4>
				<span className="show-case-price">{note}</span>
				<Link to={route} className="book-btn">
					<span>{cta}</span>
				</Link>
			</div>
		</div>
	);
};

function ShowCase() {
	return (
		<section className="show-case show-case--trio">
			{[...TOUR_LIST, CUSTOM_PANEL].map((tour) => (
				<ShowCaseItem key={tour.key} tour={tour} />
			))}
		</section>
	);
}

export default ShowCase;
