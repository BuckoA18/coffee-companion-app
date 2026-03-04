export const CAFFEINE_BAR_CIRCUMFERENCE = 879;
export const CAFFEINE_THRESHOLD = 50;
export const CAFFEINE_HALF_LIFE = 0.1;
export const MAX_STEPS = 4;
export const VALIDATION_RULES = {
	AGE: {
		MIN: 12,
		MAX: 120,
	},
	WEIGHT: {
		MIN: 30,
		MAX: 300,
	},
};

export const SURVEY_SCHEMA = [
	{
		id: "intro",
		step: 1,
		title: "Let's personalize your experience",
	},
	{
		id: "weight",
		step: 2,
		input: "number",
		title: "What is your current weight?",
		units: ["kg", "lb"],
	},
	{
		id: "age",
		step: 3,
		input: "number",
		title: "How old are you?",
	},
	{
		id: "factors",
		step: 4,
		title: "Metabolic Profile",
		multipliers: [
			{
				id: "smoking",
				name: "Smoking",
				multiplier: 0.5,
				description:
					"Smoking triggers liver enzymes ($CYP1A2$) that break down caffeine twice as fast as normal. This rapid metabolism often leads smokers to double their coffee intake to maintain the same effect.",
			},
			{
				id: "pregnancy",
				name: "Pregnancy",
				multiplier: 3,
				description:
					"Hormonal changes during pregnancy drastically slow caffeine clearance. By the third trimester, caffeine stays in the system three times longer than usual, extending its half-life from 5 hours to nearly 15.",
			},
			{
				id: "contraceptives",
				name: "Contraceptives",
				multiplier: 1.5,
				description:
					"Oral contraceptives inhibit the enzymes responsible for processing stimulants. This effectively doubles the half-life of caffeine, making a single cup of coffee feel twice as potent and stay in the bloodstream much longer.",
			},
		],
	},
];
