import * as helper from "./utilities/helpers";
import * as config from "./utilities/config";
import { db, seedDatabase } from "./db";
import { initialDrinks } from "./InitialDrinks";

// ---- State ---- //

export const state = {
	user: {
		weight: "",
		weightUnit: "kg",
		age: "",
		maxCaffeine: 400,
		halfLifeMultipliers: [],
		halfLifeMultiplier: 1,
		halfLife: 5,
		dailyDrinks: [],
		caffeine: 0,
		caffeineInSystem: 0,
		currentDrink: "",
		isPregnant: false,
		bedTime: "",
		progressPerc: 0,
		profileReady: false,
	},
	search: {
		query: "",
		results: [],
		shortcuts: [],
	},
	survey: {
		currentStep: 0,
		maxSteps: config.MAX_STEPS,
	},
	drinks: [],
};

let caffeineTimer = null;

export const setInitialState = async () => {
	try {
		await seedDatabase(initialDrinks);
		state.drinks = await db.drinks.toArray();
		state.user.dailyDrinks = await db.consumption.toArray();

		helper.createShortcuts();
	} catch (error) {
		throw error;
	}
};

// ---- Getters ---- //

export const getCaffeineProgress = () => {
	const percentage = Math.round(
		(state.user.caffeine / state.user.maxCaffeine) * 100,
	);
	const offset =
		config.CAFFEINE_BAR_CIRCUMFERENCE -
		(percentage / 100) * config.CAFFEINE_BAR_CIRCUMFERENCE;

	if (percentage >= 100) return 0;
	console.log(offset);

	return offset;
};

export const getMonitorProgress = () => {
	const width = (state.user.caffeineInSystem / state.user.caffeine) * 100;
	return width;
};

export const getCaffeineUntillLimit = () => {
	const caffeineUntillLimit = state.user.maxCaffeine - state.user.caffeine;
	return caffeineUntillLimit;
};

// ---- Setters ---- //

const setCaffeine = (caffeine) => {
	state.user.caffeine = caffeine;
};

const setCaffeineInSystem = (amount) => {
	state.user.caffeineInSystem = amount;
};

const setBedTime = (timeString) => {
	state.user.bedTime = timeString;
};

const setMaxCaffeine = (maxCaffeine) => {
	state.user.maxCaffeine = maxCaffeine;
};

const setHalfLife = (halfLife) => {
	state.user.halfLife = halfLife;
};

// ---- Calculations Logicc ---- //

export const calcCaffeine = () => {
	const caffeine = state.user.dailyDrinks.reduce(
		(accumulator, currentValue) => accumulator + currentValue.caffeine_mg,
		0,
	);
	setCaffeine(caffeine);
};

export const calcCaffeineInSystem = () => {
	const { halfLife, dailyDrinks } = state.user;
	const threshold = config.CAFFEINE_THRESHOLD;
	const currentTime = new Date();

	let totalCurrentCaffeine = 0;

	// Calculate remaining caffeine for every drink logged
	dailyDrinks?.forEach((drink) => {
		const elapsedHours = helper.getElapsedHours(
			currentTime,
			drink.consumptionTime,
		);
		totalCurrentCaffeine += helper.calcRemainingCaffeine(
			drink.caffeine_mg,
			elapsedHours,
			halfLife,
		);
	});

	// Check if we can stop the timer
	if (+totalCurrentCaffeine.toFixed(1) <= 0) {
		setCaffeineInSystem(0);
		return clearInterval(caffeineTimer);
	}

	// Calculate safe sleep time using helpers
	const hoursUntilSafeSleep = helper.calcHoursUntilThreshold(
		totalCurrentCaffeine,
		threshold,
		halfLife,
	);

	const bedTimeDate = new Date(
		currentTime.getTime() + hoursUntilSafeSleep * 60 * 60 * 1000,
	);
	const formattedBedTime = bedTimeDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	setCaffeineInSystem(Math.round(totalCurrentCaffeine));
	setBedTime(formattedBedTime);

	window.dispatchEvent(new CustomEvent("caffeineUpdated"));
};

export const calcMaxCaffeine = async () => {
	// Need to cap max caffeine to 200mg~ if pregnant :P
	const { age, weight, isPregnant, weightUnit } = state.user;
	if (isPregnant) {
		state.user.maxCaffeine = config.CAFFEINE_LIMITS.PREGNANCY.cap_mg;
		return;
	}
	const rule = Object.values(config.CAFFEINE_LIMITS).find(
		(limit) => limit.min_age <= age && limit.max_age >= age,
	);

	const weightInKilos = helper.convertToKilos(weight, weightUnit);

	const weightBasedLimit = Math.round(weightInKilos * rule.multiplier);
	console.log(weightInKilos);

	const finalLimit =
		weightBasedLimit > rule.cap_mg ? rule.cap_mg : weightBasedLimit;

	setMaxCaffeine(finalLimit);
};

export const calcHalfLife = async () => {
	const multiplierValues = state.user.halfLifeMultipliers.map(
		(mult) => mult.value,
	);
	const finalMultiplier = helper.getMultiplierValue(multiplierValues);

	const halfLife =
		finalMultiplier * config.METABOLIC_FACTORS.BASELINE_HALF_LIFE;

	setHalfLife(halfLife);
};

export const storeDrink = async (id, servings, consumptionTime) => {
	const baseDrink = await getDrinkData(id);
	const newCaffeineValue = servings * baseDrink.caffeine_mg;
	const currentDrink = {
		...baseDrink,
		caffeine_mg: !newCaffeineValue ? baseDrink.caffeine_mg : newCaffeineValue,
		consumptionTime,
		servings,
	};

	db.consumption.add(currentDrink);

	state.user.caffeine += currentDrink.caffeine_mg;
	state.user.dailyDrinks.unshift(currentDrink);
};

export const startCaffeineMonitor = () => {
	if (caffeineTimer) clearInterval(caffeineTimer);

	calcCaffeineInSystem();

	caffeineTimer = setInterval(() => {
		calcCaffeineInSystem();
	}, 10000);
};

export const searchDrinks = async (drinkQuery) => {
	try {
		const query = drinkQuery?.toLowerCase().trim();

		const results = state.search.results.filter((drink) => {
			return drink.name.toLowerCase().includes(query);
		});

		if (results.length === 0) {
			throw new Error("Invalid name");
		}

		state.results = results;
	} catch (error) {
		throw error;
	}
};

export const searchShortcuts = async (shortcutId) => {
	const id = shortcutId?.toLowerCase();

	if (id === "all" || !id) {
		const results = await db.drinks.toArray();
		state.search.results = results;
	} else {
		const results = await db.drinks
			.filter((drink) => {
				return drink.category.toLowerCase() === id;
			})
			.toArray();
		state.search.results = results;
	}
};

export const checkDate = async () => {
	try {
		const currentDate = new Date().toLocaleDateString();
		const lastLoggedItem = await db.consumption.orderBy("id").last();

		if (!lastLoggedItem) return;
		const lastLoggedDate = lastLoggedItem.time.toLocaleDateString();

		if (currentDate !== lastLoggedDate) {
			await db.consumption.clear();
		}
	} catch (error) {
		throw error;
	}
};

export const getDrinkData = async (drinkId) => {
	try {
		const currentDrink = await db.drinks.get({ id: drinkId });
		if (!currentDrink) return;

		const newEntry = {
			...currentDrink,
		};

		state.user.currentDrink = newEntry;
		return newEntry;
	} catch (error) {
		throw error;
	}
};

export const nextStep = async () => {
	state.survey.currentStep++;
};

export const prevStep = async () => {
	state.survey.currentStep--;
};
