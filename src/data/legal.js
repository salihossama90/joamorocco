// Terms & Conditions and Privacy Policy text, as supplied by the owner
// (28 Sep 2026). Body entries: a string is a paragraph, an array is a bullet
// list, { sub } is a small subheading, { lines } is an unbulleted block.
export const EFFECTIVE_DATE = "28 September 2026";

const CONTACT = [
	"JOA",
	"Email: joamorocco@gmail.com",
	"Website: joamorocco.netlify.app",
	"Phone: +1 614-601-7897",
	"Address: 580 Riverview Dr, Columbus, OH, USA",
];

export const TERMS = {
	title: "Terms & Conditions",
	intro: [
		"Welcome to JOA. These Terms & Conditions govern your use of the JOA website and your purchase or participation in any tours, private trips, excursions, transportation, accommodations, or related travel services arranged through JOA.",
		"By using our website or booking a trip with us, you agree to these Terms & Conditions.",
	],
	sections: [
		{
			h: "1. About JOA",
			body: [
				"JOA provides private and customized travel experiences in Morocco, including but not limited to transportation, accommodations, guided experiences, excursions, cultural activities, and itinerary planning.",
				"JOA may work with independent hotels, transportation providers, guides, restaurants, activity operators, and other third-party suppliers to provide your travel experience.",
			],
		},
		{
			h: "2. Booking & Reservations",
			body: [
				"A reservation is confirmed only after JOA has received the required deposit or full payment and provided written confirmation of the booking.",
				"Prices, availability, and itinerary details may change until your reservation has been confirmed.",
				"By making a booking, you confirm that all information provided to JOA is accurate, including your name, passport information, travel dates, contact information, and the information of any other travelers in your party.",
			],
		},
		{
			h: "3. Payments",
			body: [
				"A deposit of 30% of the trip price is due at the time of booking to secure your reservation.",
				"The remaining balance is due 45 days before your trip's start date. Bookings made within 45 days of the start date must be paid in full at the time of booking.",
				"You can pay the balance at any time before it is due from the Find your booking page, using your confirmation code and the email you booked with.",
				"Guests added to an existing booking are charged on the same terms: their share of the deposit at the time they are added, or the full amount if the balance is already due.",
				"Payments are processed securely by Stripe. JOA does not store your card details.",
				"Failure to make required payments by the stated deadline may result in cancellation of your reservation and forfeiture of applicable deposits.",
			],
		},
		{
			h: "4. Cancellation & Refunds",
			body: [
				"Cancellation and refund terms may vary depending on the specific trip, accommodations, transportation, activities, and third-party suppliers involved.",
				"The cancellation policy applicable to your booking will be provided to you before or at the time of booking.",
				"Certain deposits, reservations, transportation arrangements, accommodations, activities, or other services may be non-refundable.",
				"JOA will make reasonable efforts to recover refundable amounts from third-party suppliers, but JOA cannot guarantee a refund where a supplier’s policies prevent one.",
			],
		},
		{
			h: "5. Changes to Your Trip",
			body: [
				"JOA understands that travel plans may change. Requests to modify an itinerary should be made as early as possible.",
				"Changes may result in additional costs depending on availability and the policies of hotels, transportation providers, guides, airlines, or other suppliers.",
				"JOA reserves the right to make reasonable changes to an itinerary when necessary because of weather, safety concerns, road conditions, supplier availability, government restrictions, or circumstances outside of JOA’s reasonable control.",
				"When possible, JOA will provide a comparable alternative.",
			],
		},
		{
			h: "6. Passports, Visas & Travel Documents",
			body: [
				"Travelers are responsible for ensuring that they possess valid passports, visas, permits, vaccinations, travel insurance, and any other documents required for their journey.",
				"JOA does not guarantee that a traveler will receive a visa or be admitted into Morocco or any other country.",
				"Travelers should verify applicable requirements with the appropriate government authorities before traveling.",
			],
		},
		{
			h: "7. Traveler Preparedness & Personal Responsibility",
			body: [
				"Travelers are responsible for preparing appropriately for their journey, including ensuring that they have valid travel documents, necessary medications, appropriate clothing, and any other personal necessities required for their trip.",
				"Travelers are also responsible for any personal expenses or costs arising from circumstances outside the services included in their booking, including medical expenses, personal emergencies, missed activities, lost belongings, or changes to personal travel plans.",
				"JOA will make reasonable efforts to assist travelers when unexpected situations arise during their trip; however, any additional costs resulting from such circumstances are the responsibility of the traveler.",
			],
		},
		{
			h: "8. Third-Party Providers",
			body: [
				"Some services included in your trip may be provided by independent third parties.",
				"These may include hotels, airlines, drivers, guides, restaurants, activity providers, transportation companies, and other suppliers.",
				"JOA carefully selects its partners but does not control every aspect of their operations.",
				"Third-party services may be subject to their own terms and conditions.",
			],
		},
		{
			h: "9. Traveler Responsibilities",
			body: [
				"Travelers are expected to:",
				[
					"Follow applicable laws and regulations.",
					"Respect local customs, communities, guides, drivers, hotels, and other travelers.",
					"Follow reasonable safety instructions.",
					"Provide accurate information to JOA.",
					"Arrive at designated meeting points on time.",
					"Take reasonable care of personal belongings.",
					"Maintain appropriate travel documentation.",
				],
				"JOA reserves the right to remove a traveler from an activity or trip when their conduct creates a safety concern, seriously disrupts the experience of others, or violates applicable laws or rules.",
			],
		},
		{
			h: "10. Personal Belongings",
			body: [
				"Travelers are responsible for their personal belongings, including passports, cash, electronics, luggage, jewelry, and other valuables.",
				"JOA is not responsible for loss, theft, or damage to personal property except where liability cannot legally be excluded.",
			],
		},
		{
			h: "11. Limitation of Liability",
			body: [
				"To the maximum extent permitted by applicable law, JOA shall not be responsible for losses, injuries, delays, cancellations, or expenses resulting from circumstances outside JOA’s reasonable control, including but not limited to:",
				[
					"Weather",
					"Natural disasters",
					"Government actions",
					"Border closures",
					"Political unrest",
					"Strikes",
					"Transportation delays",
					"Road closures",
					"Illness or medical emergencies",
					"Acts of terrorism",
					"Civil disturbances",
					"Supplier failures",
					"Airline cancellations",
					"Lost or stolen belongings",
				],
				"Nothing in these Terms & Conditions is intended to exclude or limit liability where such exclusion or limitation is prohibited by law.",
			],
		},
		{
			h: "12. Photography & Marketing",
			body: [
				"JOA may occasionally photograph or record trips for marketing purposes.",
				"JOA will not use identifiable photographs or videos of a traveler for promotional purposes without appropriate permission where required by applicable law.",
				"Travelers may contact JOA if they have questions about the use of their image.",
			],
		},
		{
			h: "13. Website Use",
			body: [
				"The content on the JOA website is provided for general informational purposes.",
				"You may not misuse the website, attempt to gain unauthorized access, interfere with its operation, copy its content for commercial purposes, or use the website for unlawful activities.",
			],
		},
		{
			h: "14. Intellectual Property",
			body: [
				"The JOA name, logo, website design, written content, photographs, graphics, videos, and other materials are owned by or licensed to JOA unless otherwise stated.",
				"You may not reproduce, distribute, modify, or commercially use JOA’s intellectual property without written permission.",
			],
		},
		{
			h: "15. Force Majeure",
			body: [
				"JOA shall not be responsible for failure or delay in performing its obligations when caused by circumstances beyond its reasonable control.",
				"This includes natural disasters, pandemics, government restrictions, war, civil unrest, strikes, transportation disruptions, and other extraordinary circumstances.",
			],
		},
		{
			h: "16. Governing Law",
			body: [
				"These Terms & Conditions shall be governed by the laws of the jurisdiction in which JOA is legally established, unless otherwise required by applicable law.",
			],
		},
		{
			h: "17. Contact Us",
			body: ["For questions regarding these Terms & Conditions, please contact:", { lines: CONTACT }],
		},
	],
};

export const PRIVACY = {
	title: "Privacy Policy",
	intro: [
		"JOA respects your privacy and is committed to protecting the personal information you provide to us.",
		"This Privacy Policy explains how JOA collects, uses, stores, and protects information when you visit our website, contact us, or book a travel experience with us.",
	],
	sections: [
		{
			h: "1. Information We Collect",
			body: [
				"Depending on how you interact with JOA, we may collect:",
				{ sub: "Contact information" },
				["Name", "Email address", "Phone number", "Mailing address"],
				{ sub: "Travel information" },
				[
					"Travel dates",
					"Number of travelers",
					"Passport or identification information when necessary to arrange travel services",
					"Accommodation preferences",
					"Dietary or activity preferences that you voluntarily provide",
					"Other information necessary to organize your trip",
				],
				{ sub: "Payment information" },
				"When you make a payment, payment information may be processed by our payment provider. JOA may receive transaction-related information but generally does not store your complete credit or debit card number.",
				{ sub: "Website information" },
				"We may automatically collect information such as:",
				[
					"IP address",
					"Browser type",
					"Device type",
					"Pages visited",
					"Website activity",
					"Referring website",
					"Approximate geographic information",
					"Cookies and similar technologies",
				],
			],
		},
		{
			h: "2. How We Use Your Information",
			body: [
				"JOA may use your information to:",
				[
					"Process and manage reservations",
					"Communicate with you about your trip",
					"Customize your travel experience",
					"Arrange accommodations, transportation, guides, and activities",
					"Process payments",
					"Respond to questions and requests",
					"Improve our website and services",
					"Send important booking or travel updates",
					"Send promotional communications when permitted by law",
					"Prevent fraud and protect our website",
					"Comply with legal obligations",
				],
			],
		},
		{
			h: "3. Information Shared With Third Parties",
			body: [
				"JOA may share necessary information with trusted third parties involved in providing your travel experience.",
				"These may include:",
				[
					"Hotels",
					"Transportation providers",
					"Tour guides",
					"Activity providers",
					"Restaurants",
					"Payment processors",
					"Website and technology providers",
					"Customer service providers",
					"Government or regulatory authorities when legally required",
				],
				"JOA only shares information reasonably necessary for the relevant purpose.",
			],
		},
		{
			h: "4. Cookies",
			body: [
				"Our website may use cookies and similar technologies to improve functionality, understand website traffic, remember preferences, and support marketing or analytics.",
				"You may be able to control cookies through your browser settings.",
			],
		},
		{
			h: "5. Marketing Communications",
			body: [
				"If you provide your contact information and consent where required, JOA may send you promotional emails, offers, travel inspiration, or information about future trips.",
				"You can unsubscribe from marketing emails at any time by using the unsubscribe link contained in the message or by contacting us.",
			],
		},
		{
			h: "6. Data Security",
			body: [
				"JOA takes reasonable measures to protect personal information from unauthorized access, disclosure, alteration, or destruction.",
				"However, no method of transmitting or storing information electronically can be guaranteed to be completely secure.",
			],
		},
		{
			h: "7. Data Retention",
			body: [
				"JOA retains personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including fulfilling bookings, maintaining business records, resolving disputes, complying with legal obligations, and enforcing agreements.",
			],
		},
		{
			h: "8. Your Privacy Rights",
			body: [
				"Depending on where you live, you may have certain rights regarding your personal information, including the right to:",
				[
					"Request access to information we hold about you",
					"Request correction of inaccurate information",
					"Request deletion of certain information",
					"Withdraw consent where applicable",
					"Opt out of certain marketing communications",
					"Request information about how your personal information is used",
				],
				"To make a privacy-related request, contact us using the information below.",
			],
		},
		{
			h: "9. Children’s Privacy",
			body: [
				"Our website is not intended to knowingly collect personal information from children without appropriate parental or guardian involvement.",
			],
		},
		{
			h: "10. Third-Party Websites",
			body: [
				"Our website may contain links to third-party websites.",
				"JOA is not responsible for the privacy practices, security, or content of third-party websites.",
				"We encourage you to review the privacy policy of any third-party website you visit.",
			],
		},
		{
			h: "11. Changes to This Privacy Policy",
			body: [
				"JOA may update this Privacy Policy from time to time.",
				"When changes are made, the updated policy will be posted on this page with a revised effective date.",
			],
		},
		{
			h: "12. Contact Us",
			body: [
				"If you have questions about this Privacy Policy or would like to exercise a privacy right, contact:",
				{ lines: CONTACT },
			],
		},
	],
};
