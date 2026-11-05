import React from "react";
import DestinationPage from "../../Components/DestinationPageConstructor/DestinationPageConstructor.js";
import information from "./information.js";
import tourPlan, { stops } from "./tourPlan.js";
import gallery from "./gallery.js";
import reviews from "./reviews.js";
import Images from "../../images";

function KingdomPage() {
	return (
		<DestinationPage
			tour="kingdom"
			theme="moroccan"
			design
			heroImage={Images.KingdomHero}
			country="Morocco"
			information={information}
			tourPlan={tourPlan}
			stops={stops}
			gallery={gallery}
			reviews={reviews}
		/>
	);
}
export default KingdomPage;
