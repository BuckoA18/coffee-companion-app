import * as model from "./model";
import IntakeView from "./views/IntakeView";
import LogDrinkView from "./views/LogDrinkView";
import ProgressBarView from "./views/ProgressBarView";
import DailyDrinksView from "./views/DailyDrinksView";
import SearchShortcutsView from "./views/SearchShortcutsView";
import DrinksListView from "./views/DrinksListView";
import SearchBarView from "./views/SearchBarView";
import { initRouter } from "./router";

const controllDashboard = async () => {
	try {
		// render structure
		IntakeView.render(model.state);
		ProgressBarView.render(model.state);

		// update progress bar
		ProgressBarView.updateProgressBar(model.state.progressPerc);

		// render no-drink message
		if (model.state.dailyDrinks.length === 0) DailyDrinksView.renderMessage();

		// render drinks
		DailyDrinksView.render(model.state.dailyDrinks);
	} catch (error) {
		console.error(error);
	}
};

const controllLogDrink = async () => {
	try {
		// fetch data
		await model.fetchDrinks();

		// get initial shortcut id
		model.getResults();

		// render strucure
		LogDrinkView.render(model.state);
		SearchBarView.render();
		SearchShortcutsView.render(model.state.search.shortcuts);
		DrinksListView.render(model.state.search.results);

		// Attach listeners
		SearchBarView.addHandlerToggle();
		SearchBarView.addHandlerGetQuery(handleSearch);
		SearchShortcutsView.addHandlerGetShortcutId(handleShortcuts);
		DrinksListView.addHandlerNewLog(handleAddNewLog);
	} catch (error) {
		console.error(error);
		LogDrinkView.render(model.state);
		DrinksListView.renderError(`Error: ${error.message}`);
	}
};

const controllRouter = () => {
	const path = window.location.pathname;

	switch (path) {
		case "/":
			controllDashboard();
			break;
		case "/add":
			controllLogDrink();
			break;
		default:
			console.error("404: Page not found");
	}
};

const handleAddNewLog = async (id) => {
	try {
		model.storeDrink(id);

		window.history.pushState({}, "", "/");
		controllRouter();
	} catch (error) {
		console.error(error);
	}
};

const handleSearch = async (query) => {
	model.searchDrinks(query);
	DrinksListView.render(model.state.search.results);
};

const handleShortcuts = (id) => {
	model.getResults(id);
	DrinksListView.render(model.state.search.results);
};

const init = async () => {
	try {
		// intial fetch

		// Handling router
		initRouter(controllRouter);
		controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
