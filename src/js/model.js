export const state = {
	drinks: [],
	search: {
		query: "",
		results: [],
		shortcuts: [],
	},
	dailyDrinks: [],
	caffeine: 0,
	maxCaffeine: 450,
	progressPerc: 0,
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
	const percentage = Math.round((state.caffeine / state.maxCaffeine) * 100);
	state.progressPerc = percentage;
	console.log("progress:", state.progressPerc);
};

export const storeDrink = (id) => {
	const currentDrink = state.drinks.find((drink) => drink.id === id);

	state.caffeine += currentDrink.caffeine_mg;
	// pushing object at the start of the array
	state.dailyDrinks.unshift(currentDrink);

	console.log("caffeine:", state.caffeine);
	calcProgress();
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
	// console.log("query: ", state.search.query);
	// console.log("results: ", state.search.results);
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
