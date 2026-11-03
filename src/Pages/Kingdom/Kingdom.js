import React from "react";
import DestinationPage from "../../Components/DestinationPageConstructor/DestinationPageConstructor.js";
import information from "./information.js";
import tourPlan from "./tourPlan.js";
import gallery from "./gallery.js";
import reviews from "./reviews.js";

function KingdomPage() {
	return (
		<DestinationPage
			tour="kingdom"
			theme="moroccan"
			design
			information={information}
			tourPlan={tourPlan}
			gallery={gallery}
			reviews={reviews}
		/>
	);
}
export default KingdomPage;
