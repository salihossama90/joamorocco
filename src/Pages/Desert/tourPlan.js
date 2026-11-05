// Day photos: the Sahara Dreams and Kingdom gallery photos (Pexels)
const BASE = "?auto=compress&cs=tinysrgb&w=1200";
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg${BASE}`;

const tourPlan = [
	{
		day: 1,
		images: [px(2404046)],
		title: "Arrival in Casablanca → Drive to Fes",
		description: "Land in Morocco, stand inside its most iconic mosque, and head for the old imperial capital.",
		activities: [
			"Airport pickup",
			"Visit the Hassan II Mosque",
			"Welcome lunch in Casablanca",
			"Drive to Fes",
			"Overnight in Fes",
		],
	},
	{
		day: 2,
		images: [px(30283794)],
		title: "Fes — Imperial City Experience",
		description: "A full day inside the world's largest living medieval medina.",
		activities: [
			"Guided Fes Old Medina tour",
			"Visit the traditional tanneries",
			"Artisan workshops",
			"Historic old city quarters",
			"Traditional Moroccan dinner",
			"Overnight in Fes",
		],
	},
	{
		day: 3,
		images: [px(34187460), px(30757346), px(9726809)],
		title: "Fes → Ifrane → Merzouga (Sahara Gateway)",
		description: "Cross the Middle Atlas and ride a camel into the great dunes by sunset.",
		activities: [
			"Scenic drive through the Middle Atlas Mountains",
			"Stop in Ifrane",
			"Cedar forest visit",
			"Barbary macaque monkeys",
			"Continue to Merzouga",
			"Camel trek into the Sahara dunes",
			"Sunset over Erg Chebbi",
			"Luxury desert camp",
			"Overnight in the Sahara",
		],
	},
	{
		day: 4,
		images: [px(30710164), px(30757368), px(30158465)],
		title: "Sahara Desert Experience — Horse Riding Day",
		description: "A full day in the dunes on horseback and by 4x4, among the nomad families.",
		activities: [
			"Sunrise over the dunes",
			"Guided horseback riding experience",
			"4x4 desert exploration",
			"Visit nomad families",
			"Optional sandboarding",
			"Second night in the luxury desert camp",
		],
	},
	{
		day: 5,
		images: [px(28829635), px(35976808), px(998639)],
		title: "Merzouga → Marrakech (Scenic Journey Day)",
		description: "A long, beautiful drive from the dunes to the Red City.",
		activities: [
			"Early departure from the Sahara",
			"Scenic drive through desert landscapes and Atlas foothills",
			"Arrival in Marrakech",
			"Free evening",
			"Overnight in Marrakech",
		],
	},
	{
		day: 6,
		images: [px(15360680), px(31576064), px(36599126)],
		title: "Marrakech — Cultural Experience",
		description: "Palaces, souks, and the greatest square in North Africa.",
		activities: [
			"Visit the Koutoubia Mosque",
			"Visit Bahia Palace",
			"Visit Ben Youssef Madrasa",
			"Guided Medina & Souk tour",
			"Evening at Jemaa el-Fnaa",
			"Overnight in Marrakech",
		],
	},
	{
		day: 7,
		images: [px(25791913), px(32013503), px(29038454)],
		title: "Marrakech — Cultural & Leisure Experience",
		description: "A slower day of gardens, cooking, and a traditional hammam.",
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
		day: 8,
		images: [px(2404046)],
		title: "Marrakech → Casablanca → Departure",
		description: "The drive back to the coast, and farewell to Morocco.",
		activities: [
			"Drive to Casablanca",
			"Airport drop off",
			"Departure",
		],
	},
];

// The itinerary's places, in order: each groups its days under a short intro.
// `map` places it on the route map (several points for a place on the move;
// `label`: which side of the dot its name sits, right by default; "none" for
// a place already on the map, so only the route line returns to it).
export const stops = [
	{
		place: "Casablanca",
		days: [1],
		intro: "Morocco's Atlantic front door, and your first look at its grandest mosque. After a welcome lunch by the sea, the road runs inland to Fes.",
		map: [{ name: "Casablanca", lat: 33.57, lon: -7.59, label: "left" }],
	},
	{
		place: "Fes",
		days: [2],
		intro: "The oldest of the imperial cities, and the world's largest living medieval medina: tanneries, artisans and quarters little changed in centuries.",
		map: [{ name: "Fes", lat: 34.03, lon: -5.0 }],
	},
	{
		place: "The Sahara",
		days: [3, 4],
		intro: "Over the Middle Atlas, past the cedar forests of Ifrane, to the great dunes of Erg Chebbi at Merzouga. Two nights in a luxury desert camp, with camels at sunset and horses at sunrise.",
		map: [
			{ name: "Ifrane", lat: 33.53, lon: -5.11 },
			{ name: "Merzouga", lat: 31.08, lon: -4.01, label: "below" },
		],
	},
	{
		place: "Marrakech",
		days: [5, 6, 7],
		intro: "The long, beautiful drive from the dunes to the Red City, then two full days of palaces, souks, gardens, a cooking class and a traditional hammam.",
		map: [{ name: "Marrakech", lat: 31.63, lon: -7.99, label: "left" }],
	},
	{
		place: "Casablanca",
		days: [8],
		intro: "Back to the coast, and farewell to Morocco.",
		map: [{ name: "Casablanca", lat: 33.57, lon: -7.59, label: "none" }],
	},
];

export default tourPlan;
