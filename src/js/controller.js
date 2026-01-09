import * as model from "./model";
import * as helper from "./utilities/helpers";
import LoginView from "./views/LoginView";
import LoginFormView from "./views/LoginFormView";
import IntakeView from "./views/IntakeView";
import LogDrinkView from "./views/LogDrinkView";
import ProgressBarView from "./views/ProgressBarView";
import DailyDrinksView from "./views/DailyDrinksView";
import SearchShortcutsView from "./views/SearchShortcutsView";
import DrinksListView from "./views/DrinksListView";
import SearchBarView from "./views/SearchBarView";
import NavigationView from "./views/NavigationView";
import { initRouter } from "./router";

const controllDashboard = async () => {
	try {
		// render structure

		IntakeView.render(model.state);
		ProgressBarView.render(model.state);
		NavigationView.render();

		// update progress bar
		ProgressBarView.updateProgressBar(model.state.progressPerc);

		// render no-drink message
		if (model.state.user.dailyDrinks.length === 0)
			DailyDrinksView.renderMessage();

		// render drinks
		DailyDrinksView.render(model.state.user.dailyDrinks);
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
		NavigationView.render();

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

const controllLogin = async () => {
	try {
		LoginView.render();
		LoginFormView.render();

		LoginFormView.addHandlerSubmit(handleSubmit);
	} catch (error) {
		console.error("Initialization error: ", error);
	}
};

const handleSubmit = async (data) => {
	console.log("1. Click detected");
	try {
		await helper.validate(data);
		console.log("2. Validation completed");
		window.history.pushState(null, null, "/");
		controllRouter();
	} catch (error) {
		console.error("Validation error: ", error);
	}
};

const handleAddNewLog = async (id) => {
	try {
		helper.getCurrentDate();
		model.storeDrink(id);
		model.calcProgress();

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

const controllRouter = () => {
	const path = window.location.pathname;

	switch (path) {
		case "/login":
			controllLogin();
			break;
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

const init = async () => {
	try {
		if (!model.state.user.profileReady) {
			window.history.pushState(null, null, "/login");
		}
		initRouter(controllRouter);
		controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
