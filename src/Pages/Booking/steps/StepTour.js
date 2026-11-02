import React from "react";
import { TOUR_LIST, KIDS_PROMO } from "../../../data/tours";

export default function StepTour({ data, update, next }) {
	const choose = (key) => update({ tour: key });

	return (
		<div className="step">
			<header className="step-head">
				<h1>Choose your journey</h1>
				<p>Two private tours, each reserved exclusively for you and your group. Select one to continue.</p>
			</header>

			<div className="tour-choices" role="radiogroup" aria-label="Choose your tour">
				{TOUR_LIST.map((tour) => {
					const selected = data.tour === tour.key;
					return (
						<button
							key={tour.key}
							type="button"
							className={`tour-choice ${selected ? "selected" : ""}`}
							onClick={() => choose(tour.key)}
							role="radio"
							aria-checked={selected}
						>
							<div
								className="tour-choice-img"
								style={{ backgroundImage: `url(${tour.heroImage})` }}
							>
								<span className="tour-choice-badge">{tour.days} Days · Private</span>
								<span className="tour-choice-check" aria-hidden="true">
									{selected && "✓"}
								</span>
							</div>
							<div className="tour-choice-body">
								<h3>{tour.name}</h3>
								<p className="tour-choice-tag">{tour.tagline}</p>
								<ul className="tour-choice-highlights">
									{tour.highlights.slice(0, 3).map((h) => (
										<li key={h}>{h}</li>
									))}
								</ul>
								<div className="tour-choice-tiers">
									{tour.tiers.map((row) => (
										<div className="tct-row" key={row.guests}>
											<span>{row.guests}</span>
											<span>
												<strong>{row.pp}</strong> / person
											</span>
										</div>
									))}
								</div>
								<p className="tour-choice-kids">{KIDS_PROMO}</p>
							</div>
							<div className="tour-choice-select" aria-hidden="true">
								<span className="tour-choice-radio" />
								{selected ? "Selected" : "Select this tour"}
							</div>
						</button>
					);
				})}
			</div>

			<div className="step-actions">
				<span />
				<button type="button" className="btn-primary" disabled={!data.tour} onClick={next}>
					{data.tour ? "Continue" : "Select a tour to continue"}
				</button>
			</div>
		</div>
	);
}
