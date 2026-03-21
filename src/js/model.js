import * as helper from "./utilities/helpers";
import {
	BASELINE,
	MAX_STEPS,
	EVENTS,
	CAFFEINE_LIMITS,
	CAFFEINE_THRESHOLD,
	CAFFEINE_BAR_CIRCUMFERENCE,
} from "./utilities/config";
import { db, seedDatabase } from "./db";

// ---- State ---- //

export const state = {
	user: {
		weight: BASELINE.WEIGHT,
		weightUnit: "kg",
		age: BASELINE.AGE,
		maxCaffeine: BASELINE.MAX_CAFFEINE,
		halfLifeMultipliers: [],
		halfLifeMultiplier: BASELINE.MULTIPLIER,
		halfLife: BASELINE.HALF_LIFE,
		dailyDrinks: [],
		caffeine: BASELINE.CAFFEINE,
		caffeineInSystem: BASELINE.CAFFEINE_IN_SYSTEM,
		isPregnant: BASELINE.IS_PREGNANT,
		bedTime: BASELINE.BEDTIME,
		profileReady: false,
	},
	search: {
		results: [],
	},
	survey: {
		currentStep: 0,
		maxSteps: MAX_STEPS,
	},
};

let caffeineTimer = null;

const subscribers = {
	[EVENTS.CAFFEINE_TOTAL_UPDATED]: [],
	[EVENTS.CAFFEINE_IN_SYSTEM_UPDATED]: [],
	[EVENTS.DRINKS_CHANGED]: [],
	[EVENTS.STEPS_UPDATED]: [],
};

export const subscribe = (type, handler) => {
	if (!subscribers[type]) return;
	subscribers[type].push(handler);
};

export const notify = (type) => {
	subscribers[type].forEach((func) => func());
};

export const saveUserProfile = async () => {
	try {
		const { weight, weightUnit, age, halfLifeMultipliers, isPregnant } =
			state.user;

		await db.settings.put({
			key: "profile",
			weight,
			weightUnit,
			age,
			halfLifeMultipliers,
			isPregnant,
			profileReady: true,
		});

		// console.log(state.user);
	} catch (error) {
		console.error("Failed to save profile");
	}
};

export const loadUserProfile = async () => {
	try {
		const profileData = await db.settings.get("profile");
		if (!profileData) return;
		setUserProfileData(profileData);
	} catch (error) {
		console.error("Failed to load user profile");
	}
};

const setUserProfileData = (data) => {
	if (!data) return;

	state.user = {
		...state.user,
		weight: data.weight,
		weightUnit: data.weightUnit,
		age: data.age,
		halfLifeMultipliers: data.halfLifeMultipliers,
		isPregnant: data.isPregnant,
		profileReady: data.profileReady,
	};

	calcCaffeineInSystem();
	calcHalfLife();
	calcMaxCaffeine();
};

const fetchDrinks = async () => {
	try {
		const repsonse = await fetch("/InitialDrinks.json");
		if (repsonse.ok) {
			const data = await repsonse.json();
			return data;
		}
	} catch (error) {
		console.error("Failed to fetch: ", error);
	}
};
export const setInitialState = async () => {
	try {
		const data = await fetchDrinks();
		await seedDatabase(data);
		state.user.dailyDrinks = await db.consumption.toArray();
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
		CAFFEINE_BAR_CIRCUMFERENCE -
		(percentage / 100) * CAFFEINE_BAR_CIRCUMFERENCE;

	if (percentage >= 100) return 0;
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

export const getDailyDrinks = async () => {
	return await db.consumption.toArray();
};

export const getShortcuts = async () => {
	const drinks = await db.drinks.toArray();
	return [
		"All",
		...new Set(
			drinks.map((drink) => {
				return drink.category;
			}),
		),
	];
};

// ---- Setters ---- //

const setCaffeine = (caffeine) => {
	state.user.caffeine = caffeine;
	notify(EVENTS.CAFFEINE_TOTAL_UPDATED);
};

const setCaffeineInSystem = (amount) => {
	state.user.caffeineInSystem = amount;
	notify(EVENTS.CAFFEINE_IN_SYSTEM_UPDATED);
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

const setShortcutResults = (results) => {
	state.search.results = results;
};

export const setIsPregnant = (value) => {
	state.user.isPregnant = value;
};

export const setHalfLifeMultipliers = (values) => {
	state.user.halfLifeMultipliers = values;
};

// ---- Calculations Logicc ---- //

export const calcCaffeine = async () => {
	const dailyDrinks = await db.consumption.toArray();
	const caffeine = helper.getCaffeine(dailyDrinks);
	setCaffeine(caffeine);
};

export const calcCaffeineInSystem = async () => {
	const { halfLife } = state.user;
	const threshold = CAFFEINE_THRESHOLD;
	const currentTime = new Date();
	const dailyDrinks = await db.consumption.toArray();

	// console.log("dailyDrinks: ", dailyDrinks);

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
		setBedTime("");
		// console.log("bedtime from calcCaffeineInSystem: ", state.user.bedTime);
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
};

export const calcMaxCaffeine = async () => {
	// Need to cap max caffeine to 200mg~ if pregnant :P
	const { age, weight, isPregnant, weightUnit } = state.user;
	if (isPregnant) {
		state.user.maxCaffeine = CAFFEINE_LIMITS.PREGNANCY.cap_mg;
		return;
	}
	const rule = Object.values(CAFFEINE_LIMITS).find(
		(limit) => limit.min_age <= age && limit.max_age >= age,
	);

	const weightInKilos = helper.convertToKilos(weight, weightUnit);

	const weightBasedLimit = Math.round(weightInKilos * rule.multiplier);
	const finalLimit =
		weightBasedLimit > rule.cap_mg ? rule.cap_mg : weightBasedLimit;

	setMaxCaffeine(finalLimit);
};

export const calcHalfLife = async () => {
	const multiplierValues = state.user.halfLifeMultipliers.map(
		(mult) => mult.value,
	);
	const finalMultiplier = helper.getMultiplierValue(multiplierValues);

	const halfLife = finalMultiplier
		? finalMultiplier * BASELINE.HALF_LIFE
		: BASELINE.HALF_LIFE;

	setHalfLife(halfLife);
};
export const deleteDrinkAndRecalculate = async (id) => {
	await deleteDrink(id);
	Promise.all([calcCaffeine(), calcCaffeineInSystem()]);
};
export const deleteDrink = async (id) => {
	await db.consumption.delete(+id);
	state.user.dailyDrinks = await db.consumption.toArray();
};

export const storeDrink = async (id, servings, consumptionTime) => {
	const baseDrink = await getDrinkData(id);
	const newCaffeineValue = servings * baseDrink.caffeine_mg;
	const currentDrink = {
		...baseDrink,
		drinkId: baseDrink.id,
		caffeine_mg: !newCaffeineValue ? baseDrink.caffeine_mg : newCaffeineValue,
		consumptionTime,
		servings,
	};

	delete currentDrink.id; // delete the id so db.consumption can auto increment the next one
	await db.consumption.add(currentDrink);

	const caffeine = (state.user.caffeine += currentDrink.caffeine_mg);
	setCaffeine(caffeine);
	state.user.dailyDrinks.push(currentDrink);
};

export const startCaffeineMonitor = () => {
	if (caffeineTimer) clearInterval(caffeineTimer);

	calcCaffeineInSystem();

	caffeineTimer = setInterval(() => {
		calcCaffeineInSystem();
	}, 10000);
};

export const getQueryResults = (drinkQuery) => {
	const query = drinkQuery?.toLowerCase().trim();
	const results = state.search.results.filter((drink) => {
		return drink.name.toLowerCase().includes(query);
	});

	if (results.length === 0) {
		throw new Error("Invalid name");
	}
	return results;
};

export const getShortcutResults = async (shortcutId) => {
	const id = shortcutId?.toLowerCase();
	let results;
	if (id === "all" || !id) {
		results = await db.drinks.toArray();
		state.search.results = results;
	} else {
		results = await db.drinks
			.filter((drink) => {
				return drink.category.toLowerCase() === id;
			})
			.toArray();
	}

	setShortcutResults(results);
};

export const checkDate = async () => {
	try {
		const currentDate = new Date().toLocaleDateString();
		const lastLoggedItem = await db.consumption.orderBy("id").last();

		if (!lastLoggedItem) return;
		const lastLoggedDate = lastLoggedItem.consumptionTime.toLocaleDateString();

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
	notify("stepsUpdated");
};

export const prevStep = async () => {
	state.survey.currentStep--;
	notify("stepsUpdated");
};
