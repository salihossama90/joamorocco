// Day photos: the Kingdom and Sahara Dreams gallery photos (Pexels)
const BASE = "?auto=compress&cs=tinysrgb&w=1200";
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg${BASE}`;

const tourPlan = [
	{
		day: 1,
		images: [px(2404046)],
		title: "Arrival in Casablanca",
		description: "Land in Morocco's largest city and begin at its most iconic landmark on the Atlantic.",
		activities: [
			"Airport pickup and transfer to your hotel",
			"Visit the Hassan II Mosque — one of the largest in the world, rising above the sea",
			"Walk the Casablanca Corniche along the coast",
			"Welcome dinner",
			"Overnight in Casablanca",
		],
	},
	{
		day: 2,
		images: [px(15360680), px(31576064), px(36599126)],
		title: "Casablanca → Marrakech — Imperial Introduction",
		description: "Drive south to the Red City and dive straight into its storied medina.",
		activities: [
			"Scenic drive to Marrakech",
			"Visit the Koutoubia Mosque",
			"Visit Bahia Palace",
			"Visit Ben Youssef Madrasa",
			"Guided Medina & Souk tour",
			"Evening at Jemaa el-Fnaa square",
			"Overnight in Marrakech",
		],
	},
	{
		day: 3,
		images: [px(25791913), px(32013503), px(29038454)],
		title: "Marrakech — Cultural Experience",
		description: "A slower day of gardens, cooking, and a traditional Berber welcome.",
		activities: [
			"Visit the Majorelle Garden",
			"Moroccan cooking class",
			"Traditional Berber family lunch",
			"Hammam & spa experience",
			"Free evening",
			"Overnight in Marrakech",
		],
	},
	{
		day: 4,
		images: [px(5541277)],
		title: "Marrakech → Ait Ben Haddou → Todgha Gorge",
		description: "Cross the High Atlas to a legendary ksar, then continue to a dramatic canyon.",
		activities: [
			"Cross the High Atlas Mountains via the Tizi n'Tichka pass",
			"Visit Ait Ben Haddou — the UNESCO-listed ksar of a hundred films",
			"Continue to the Todgha Gorge",
			"Overnight near Todgha Gorge",
		],
	},
	{
		day: 5,
		images: [px(34187460), px(30757346), px(30757368)],
		title: "Todgha Gorge → Merzouga (Sahara Desert)",
		description: "Reach the great dunes of Erg Chebbi and ride into the sand at sunset.",
		activities: [
			"Morning at the Todgha Gorge",
			"Arrival in Merzouga",
			"Camel trek into the Sahara dunes",
			"Sunset over Erg Chebbi",
			"Luxury desert camp experience",
			"Campfire under the stars",
			"Overnight in the Sahara",
		],
	},
	{
		day: 6,
		images: [px(30710164), px(9726809), px(30158465)],
		title: "Sahara Desert Experience — Horse Riding Day",
		description: "A full day in the dunes on horseback and by 4x4, among the nomad families.",
		activities: [
			"Sunrise over the dunes",
			"Guided horseback riding across the desert",
			"4x4 desert exploration tour",
			"Visit nomad families",
			"Optional sandboarding",
			"Second night in the luxury desert camp",
		],
	},
	{
		day: 7,
		images: [px(998639), px(35976808)],
		title: "Merzouga → Fes",
		description: "A scenic drive north through the Middle Atlas and its cedar forests.",
		activities: [
			"Scenic drive through the Middle Atlas Mountains",
			"Stop in Ifrane",
			"Cedar forest visit",
			"Barbary macaque monkeys",
			"Arrival in Fes",
			"Free evening",
			"Overnight in Fes",
		],
	},
	{
		day: 8,
		images: [px(30283794)],
		title: "Fes — Imperial City Experience",
		description: "A full day inside the world's largest living medieval medina.",
		activities: [
			"Guided Fes Medina & souks tour",
			"Visit the tanneries",
			"Artisan workshops",
			"Historic quarters",
			"Traditional Moroccan dinner",
			"Overnight in Fes",
		],
	},
	{
		day: 9,
		images: [px(210478), px(5472522)],
		title: "Fes → Chefchaouen",
		description: "Travel into the Rif Mountains to the town painted entirely in blue.",
		activities: [
			"Travel to Chefchaouen",
			"Guided Blue City walking tour",
			"Free time for photography & shopping",
			"Sunset hike to the Spanish Mosque",
			"Mint tea overlooking the mountains",
			"Overnight in Chefchaouen",
		],
	},
	{
		day: 10,
		images: [px(13142301)],
		title: "Chefchaouen → Tangier — Coastal Finale",
		description: "Descend to the coast where two seas meet, and end the day by the Atlantic.",
		activities: [
			"Visit Cap Spartel",
			"Visit the Hercules Caves",
			"Guided tour of Tangier's Old Medina",
			"Visit the Kasbah & Grand Socco",
			"Seafood dinner by the Atlantic coast",
			"Overnight in Tangier",
		],
	},
	{
		day: 11,
		images: [px(13142301)],
		title: "Tangier — Departure",
		description: "A final Moroccan morning above the Strait of Gibraltar before you fly home.",
		activities: [
			"Mint tea at Café Hafa overlooking the Strait of Gibraltar",
			"Airport transfer and departure",
		],
	},
];

// The itinerary's places, in order: each groups its days under a short intro.
// `map` places it on the route map (several points for a place on the move;
// `label`: which side of the dot its name sits, right by default).
export const stops = [
	{
		place: "Casablanca",
		days: [1],
		intro: "Morocco's largest city and its Atlantic front door. The journey begins at the Hassan II Mosque, its minaret rising above the waves, and along the Corniche where the city meets the sea.",
		map: [{ name: "Casablanca", lat: 33.57, lon: -7.59, label: "left" }],
	},
	{
		place: "Marrakech",
		days: [2, 3],
		intro: "The Red City: palaces, gardens and a medina that hums from morning to midnight. One day for the imperial landmarks and the souks, one slower day for gardens, a cooking class and a Berber welcome.",
		map: [{ name: "Marrakech", lat: 31.63, lon: -7.99, label: "left" }],
	},
	{
		place: "The High Atlas",
		days: [4],
		intro: "Over the Tizi n'Tichka pass to Ait Ben Haddou, the earthen ksar on the old caravan route, and on to the sheer red walls of the Todgha Gorge.",
		map: [
			{ name: "Ait Ben Haddou", lat: 31.05, lon: -7.13, label: "below" },
			{ name: "Todgha Gorge", lat: 31.59, lon: -5.59, label: "above" },
		],
	},
	{
		place: "The Sahara",
		days: [5, 6],
		intro: "The great dunes of Erg Chebbi at Merzouga. Two nights in a luxury desert camp, with camels at sunset, horses at sunrise and the nomad families who call the sands home.",
		map: [{ name: "Merzouga", lat: 31.08, lon: -4.01, label: "below" }],
	},
	{
		place: "Fes",
		days: [7, 8],
		intro: "North through the cedar forests of the Middle Atlas to Fes, home to the world's largest living medieval medina: tanneries, artisans and quarters little changed in centuries.",
		map: [{ name: "Fes", lat: 34.03, lon: -5.0 }],
	},
	{
		place: "Chefchaouen",
		days: [9],
		intro: "Into the Rif Mountains, to the town painted in every shade of blue. Time to wander, to photograph, and to watch the sun set from the Spanish Mosque.",
		map: [{ name: "Chefchaouen", lat: 35.17, lon: -5.27 }],
	},
	{
		place: "Tangier",
		days: [10, 11],
		intro: "Where the Atlantic meets the Mediterranean. Cap Spartel, the Hercules Caves and the old medina, then a last mint tea above the Strait of Gibraltar.",
		map: [{ name: "Tangier", lat: 35.76, lon: -5.83, label: "left" }],
	},
];

export default tourPlan;
