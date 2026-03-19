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
		profileReady: false,
	},
	search: {
		query: "",
		results: [],
		categoryResults: [],
		shortcuts: [],
	},
	survey: {
		currentStep: 0,
		maxSteps: config.MAX_STEPS,
	},
	drinks: [],
};

let caffeineTimer = null;

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

const setProfileReady = () => {
	state.user.profileReady = true;
};

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

const setShortcutResults = (results) => {
	state.search.results = results;
};

// ---- Calculations Logicc ---- //

export const calcCaffeine = () => {
	const caffeine = state.user.dailyDrinks.reduce(
		(accumulator, currentValue) => accumulator + currentValue.caffeine_mg,
		0,
	);
	setCaffeine(caffeine);
};

export const calcCaffeineInSystem = async () => {
	const { halfLife } = state.user;
	const threshold = config.CAFFEINE_THRESHOLD;
	const currentTime = new Date();
	const dailyDrinks = await db.consumption.toArray();

	console.log("dailyDrinks: ", dailyDrinks);

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
		console.log("bedtime from calcCaffeineInSystem: ", state.user.bedTime);
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

	console.log(db.consumption.toArray());

	state.user.caffeine += currentDrink.caffeine_mg;
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
		console.log(currentDrink);
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
