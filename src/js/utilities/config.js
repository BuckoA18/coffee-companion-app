export const CAFFEINE_BAR_CIRCUMFERENCE = 879;
export const CAFFEINE_THRESHOLD = 25;
export const BASELINE = {
	WEIGHT: 70,
	AGE: 25,
	MAX_CAFFEINE: 400,
	HALF_LIFE: 5,
	MULTIPLIER: 1,
	IS_PREGNANT: false,
	CAFFEINE: 0,
	CAFFEINE_IN_SYSTEM: 0,
	BEDTIME: "",
};
export const METABOLIC_FACTORS = {
	SMOKER_MULTIPLIER: 0.6,
	CONTRACEPTIVE_MULTIPLIER: 2.0,
	PREGNANCY_MULTIPLIER: 2.5,
};
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

export const EVENTS = {
	CAFFEINE_TOTAL_UPDATED: "caffeineTotalUpdated",
	CAFFEINE_IN_SYSTEM_UPDATED: "caffeineInSystemUpdated",
	DRINKS_CHANGED: "drinksChanged",
	STEPS_UPDATED: "stepsUpdated",
};

export const CAFFEINE_LIMITS = {
	CHILDREN: {
		id: "children",
		name: "Children",
		min_age: 0,
		max_age: 11,
		multiplier: 0,
		cap_mg: 0,
		source: "American Academy of Pediatrics (AAP)",
	},
	TEENS: {
		id: "teens",
		name: "Adolescents",
		min_age: 12,
		max_age: 17,
		multiplier: 2.5,
		cap_mg: 100,
		source: "Health Canada / AAP",
	},
	ADULTS: {
		id: "adults",
		name: "Adults",
		min_age: 18,
		max_age: 64,
		multiplier: 5.7,
		cap_mg: 400,
		source: "EFSA / FDA",
	},
	SENIORS: {
		id: "seniors",
		name: "Seniors",
		min_age: 65,
		max_age: 120,
		multiplier: 3.0,
		cap_mg: 300,
		source: "General Clinical Consensus",
	},
	PREGNANCY: {
		id: "pregnancy",
		name: "Pregnancy / Nursing",
		min_age: 18,
		max_age: 50,
		multiplier: null,
		cap_mg: 200,
		source: "ACOG / WHO",
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
		id: "multipliers",
		step: 4,
		title: "Metabolic Profile",
		multipliers: [
			{
				id: "smoking",
				name: "Smoking",
				multiplier: METABOLIC_FACTORS.SMOKER_MULTIPLIER,
				description:
					"Triggers enzymes that process caffeine twice as fast. You likely need more coffee to feel the same effect.",
			},
			{
				id: "pregnancy",
				name: "Pregnancy",
				multiplier: METABOLIC_FACTORS.PREGNANCY_MULTIPLIER,
				description:
					"Drastically slows clearance. By the third trimester, caffeine stays in your system three times longer.",
			},
			{
				id: "contraceptives",
				name: "Contraceptives",
				multiplier: METABOLIC_FACTORS.CONTRACEPTIVE_MULTIPLIER,
				description:
					"Reduces enzyme activity, effectively doubling caffeine's half-life and making its effects last much longer.",
			},
		],
	},
];
