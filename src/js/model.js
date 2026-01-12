import * as helper from "./utilities/helpers";

export const state = {
	user: {
		firstName: "",
		weight: "",
		metabolism: "",
		maxCaffeine: 400,
		dailyDrinks: [],
		caffeine: 0,
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

export const fetchDrinks = async () => {
	try {
		const response = await fetch("http://localhost:3000/drinks");

		if (!response.ok) {
			const error = new Error(
				`Server responder with ${response.status}: ${response.statusText}`
			);
			throw error;
		}
		const data = await response.json();
		state.drinks = data;
		state.search.shortcuts = [
			"All",
			...new Set(
				state.drinks.map((drink) => {
					return drink.category;
				})
			),
		];
		// console.log(state.search.shortcuts);
	} catch (error) {
		throw error;
	}
};

export const calcProgress = () => {
	const percentage = Math.round(
		(state.user.caffeine / state.user.maxCaffeine) * 100
	);
	state.user.progressPerc = percentage;
	console.log("progress:", state.user.progressPerc);
};

export const storeDrink = (id) => {
	const currentDrink = state.drinks.find((drink) => drink.id === id);
	currentDrink.time = helper.getCurrentDate();
	state.user.caffeine += currentDrink.caffeine_mg;
	state.user.dailyDrinks.unshift(currentDrink);
};

export const searchDrinks = (query) => {
	if (!query) {
		state.search.results = state.search.drinks;
		state.search.query = "";
	}
	state.search.query = query;
	state.search.results = state.drinks.filter((drink) => {
		return drink.name.toLowerCase().includes(query.trim().toLowerCase());
	});
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
