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
		IntakeView.render(model.state);
		ProgressBarView.render(model.state);
		ProgressBarView.updateProgressBar(model.state.progressPerc);
		DailyDrinksView.render(model.state.dailyDrinks);
	} catch (error) {
		console.error(error);
	}
};

const controllLogDrink = async () => {
	try {
		// Render
		LogDrinkView.render(model.state);
		SearchBarView.render();
		SearchShortcutsView.render(model.state.search.shortcuts);
		DrinksListView.render(model.state);

		// Attach listeners
		SearchBarView.addHandlerToggle();
		SearchBarView.addHandlerGetQuery(handleSearchDrink);
		SearchShortcutsView.addHandlerGetShortcutId(handleSearchDrinksShortcuts);
		DrinksListView.addHandlerNewLog(handleAddNewLog);
	} catch (error) {
		console.error(error);
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

const handleSearchDrink = async (query) => {
	model.searchDrinks(query);
	DrinksListView.render(model.state);
};

const handleSearchDrinksShortcuts = (id) => {
	model.searchDrinksByShortcuts(id);
	DrinksListView.render(model.state);
};

const init = async () => {
	// intial fetch
	await model.fetchDrinks();

	// Attaching event listeners

	// Handling router
	initRouter(controllRouter);
	controllRouter();
};

init();
