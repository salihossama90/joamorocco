import React, { useState } from "react";
import useInView from "../../../hooks/useInView";
import "./TourPlan.css";

const DayItem = ({ item, index, open, onToggle }) => {
	const [ref, inView] = useInView();
	const panelId = `day-panel-${item.day}`;
	return (
		<div
			ref={ref}
			className={`day-item anim fade-right ${inView ? "anim-in" : ""} ${open ? "open" : ""}`}
			style={{ "--anim-delay": `${index * 90}ms` }}
		>
			<div className="day-number">
				<span>{item.day}</span>
			</div>
			<div className="day-content">
				<h3>
					<button
						type="button"
						className="day-toggle"
						onClick={onToggle}
						aria-expanded={open}
						aria-controls={panelId}
					>
						<span>{`Day ${item.day}: ${item.title}`}</span>
						<span className="day-chevron" aria-hidden="true" />
					</button>
				</h3>
				{/* Collapsed by default so the itinerary isn't a long scroll */}
				<div className="day-details" id={panelId}>
					<div className="day-details-inner">
						<p>{item.description}</p>
						<ul>
							{item.activities.map((activity, i) => (
								<li className="list-item" key={i}>
									{activity}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

const TourPlan = ({ info }) => {
	const [openDays, setOpenDays] = useState(() => new Set());
	const allOpen = openDays.size === info.length;

	const toggle = (index) =>
		setOpenDays((prev) => {
			const next = new Set(prev);
			next.has(index) ? next.delete(index) : next.add(index);
			return next;
		});
	const toggleAll = () => setOpenDays(allOpen ? new Set() : new Set(info.map((_, i) => i)));

	return (
		<div className="tour-plan-destination-page">
			<button type="button" className="day-toggle-all" onClick={toggleAll}>
				{allOpen ? "Collapse all days" : "Expand all days"}
			</button>
			{info.map((item, index) => (
				<DayItem
					key={index}
					item={item}
					index={index}
					open={openDays.has(index)}
					onToggle={() => toggle(index)}
				/>
			))}
		</div>
	);
};

export default TourPlan;
