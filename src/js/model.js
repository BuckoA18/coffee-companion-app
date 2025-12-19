export const state = {
	drinks: [],
	dailyDrinks: [],
};

export const fetchDrinks = async () => {
	try {
		const response = await fetch("http://localhost:3000/drinks");

		if (!response.ok) throw new Error(`Error: ${response.status}`);
		const data = await response.json();
		state.drinks = data;
	} catch (error) {
		console.error(`Could not fetch data: ${error}`);
	}
};
