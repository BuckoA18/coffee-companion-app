import * as helper from "./utilities/helpers";
import * as config from "./utilities/config";
import { db, seedDatabase } from "./db";
import { initialDrinks } from "./InitialDrinks";

export const state = {
	user: {
		weight: "",
		weightUnit: "",
		age: "",
		metabolism: "",
		maxCaffeine: "",
		halfLifeMultipliers: [],
		halfLifeMultiplier: "",
		halfLife: "",
		dailyDrinks: [],
		caffeine: 0,
		caffeineUntillLimit: "",
		caffeineInSystem: 0,
		currentDrink: "",
		isPregnant: false,
		safeSleep: {
			bedTime: "",
			hoursToBedTime: "",
		},
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

export const calcCaffeineProgress = () => {
	const percentage = Math.round(
		(state.user.caffeine / state.user.maxCaffeine) * 100,
	);
	const offset =
		config.CAFFEINE_BAR_CIRCUMFERENCE -
		(percentage / 100) * config.CAFFEINE_BAR_CIRCUMFERENCE;

	if (percentage >= 100) return 0;

	return offset;
};

export const calcMonitorProgress = () => {
	const width = (state.user.caffeineInSystem / state.user.caffeine) * 100;
	return width;
};

export const calcCaffeineUntillLimit = () => {
	const caffeineUntillLimit = state.user.maxCaffeine - state.user.caffeine;
	state.user.caffeineUntillLimit = caffeineUntillLimit;
	console.log(caffeineUntillLimit);
	// console.log("Caffeine left: ", caffeineLeft);
};

export const calcCaffeineInSystem = () => {
	const halfLife = config.CAFFEINE_HALF_LIFE;
	const threshold = config.CAFFEINE_THRESHOLD;
	const currentTime = new Date();
	let totalCurrentCaffeine = 0;
	let hoursUntilSafeSleep = 0;

	//Calculate remaining caffeine for every drink logged
	state.user.dailyDrinks?.forEach((drink) => {
		const elapsedMs = currentTime.getTime() - drink.time.getTime();
		const elapsedHours = elapsedMs / (1000 * 60 * 60);

		if (elapsedHours >= 0) {
			const remaining =
				drink.caffeine_mg * Math.pow(0.5, elapsedHours / halfLife);
			totalCurrentCaffeine += remaining;
		}
	});

	//Calculate how many hours until safe sleep (for furute features?)
	if (+totalCurrentCaffeine.toFixed(1) <= 0)
		return clearInterval(caffeineTimer);
	if (totalCurrentCaffeine > threshold) {
		hoursUntilSafeSleep =
			halfLife * (Math.log(threshold / totalCurrentCaffeine) / Math.log(0.5));
	}

	const bedTime = new Date(
		currentTime.getTime() + hoursUntilSafeSleep * 60 * 60 * 1000,
	);

	state.user.caffeineInSystem = Math.round(totalCurrentCaffeine);
	state.user.safeSleep.hoursToBedTime = hoursUntilSafeSleep.toFixed(1);
	state.user.safeSleep.bedTime = bedTime.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	window.dispatchEvent(new CustomEvent("caffeineUpdated"));
};

export const storeDrink = async (id, amount, newTime) => {
	const baseDrink = await getDrinkData(id);
	const newCaffeineValue = amount * baseDrink.caffeine_mg;
	const currentDrink = {
		...baseDrink,
		caffeine_mg: !newCaffeineValue ? baseDrink.caffeine_mg : newCaffeineValue,
		time: newTime,
		servings: amount,
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
	}, 5000);
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
			time: new Date(),
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

export const calcMaxCaffeine = async () => {
	// Need to cap max caffeine to 200mg~ if pregnant
	const { age, weight, isPregnant } = state.user;
	if (isPregnant) {
		state.user.maxCaffeine = config.CAFFEINE_LIMITS.PREGNANCY.cap_mg;
		return;
	}
	const rule = Object.values(config.CAFFEINE_LIMITS).find(
		(limit) => limit.min_age <= age && limit.max_age >= age,
	);

	const weightBasedLimit = Math.round(weight * rule.multiplier);
	console.log(weightBasedLimit);

	const finalLimit =
		weightBasedLimit > rule.cap_mg ? rule.cap_mg : weightBasedLimit;

	state.user.maxCaffeine = finalLimit;
};

export const calcHalfLife = async () => {
	const multiplierValues = state.user.halfLifeMultipliers.map(
		(mult) => mult.value,
	);
	const finalMultiplier = helper.getMultiplierValue(multiplierValues);

	const halfLife =
		finalMultiplier * config.METABOLIC_FACTORS.BASELINE_HALF_LIFE;

	state.user.halfLifeMultiplier = halfLife;
	console.log("half life:", halfLife);
};
