import * as helper from "./utilities/helpers";
import * as config from "./utilities/config";
import { db, seedDatabase } from "./db";
import { initialDrinks } from "./InitialDrinks";

export const state = {
	user: {
		firstName: "",
		weight: "",
		metabolism: "",
		maxCaffeine: 400,
		dailyDrinks: [],
		caffeine: 0,
		caffeineUntillLimit: "",
		caffeineInSystem: 0,
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
	drinks: [],
};

let caffeineTimer = null;

export const fetchInitialDrinks = async () => {
	try {
		await seedDatabase(initialDrinks);
		state.drinks = await db.drinks.toArray();
		state.user.dailyDrinks = await db.consumption.toArray();
		console.log(state.drinks);
		console.log(state.user.dailyDrinks);

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
	const caffeineLeft = state.user.maxCaffeine - state.user.caffeine;
	state.user.caffeineLeft = caffeineLeft;
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
	if (totalCurrentCaffeine <= 0) clearInterval(caffeineTimer);
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
	console.log(totalCurrentCaffeine);
};

export const storeDrink = (id) => {
	const currentDrink = state.drinks.find((drink) => drink.id === id);
	if (!currentDrink) return;

	const newEntry = {
		...currentDrink,
		time: new Date(),
	};

	db.consumption.add(newEntry);
	console.log(db.consumption.toArray());

	state.user.caffeine += newEntry.caffeine_mg;
	state.user.dailyDrinks.unshift(newEntry);
};

export const startCaffeineMonitor = () => {
	if (caffeineTimer) clearInterval(caffeineTimer);

	calcCaffeineInSystem();

	caffeineTimer = setInterval(() => {
		calcCaffeineInSystem();
	}, 5000);
};

export const searchDrinks = (query) => {
	const searchQuery = query;
	const results = state.drinks.filter((drink) => {
		return drink.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
	});
	console.log("results:", results);

	state.user.results = results;
	state.search.query = searchQuery;
};

export const getResults = (id) => {
	if (id === "all" || !id) {
		state.search.results = state.drinks;
	} else {
		state.search.results = state.drinks.filter((drink) => {
			return drink.category.toLowerCase() === id;
		});
	}
};

export const setProfile = (data) => {
	state.user.maxCaffeine = helper.calcMaxCaffeine(data.weight, 6);
	state.user.firstName = data.firstName.trim();
	state.user.weight = data.weight;
	state.user.metabolism = data.metabolism;
	state.user.bedtime = data.bedtime;
	state.user.profileReady = true;

	console.log("Succesfull validation");
	console.log("Ready profile data:", state.user);
};
