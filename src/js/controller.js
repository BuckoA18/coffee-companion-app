import * as model from "./model";
import * as helper from "./utilities/helpers";
import LoginView from "./views/LoginView";
import LoginFormView from "./views/LoginFormView";
import IntakeView from "./views/IntakeView";
import LogDrinkView from "./views/LogDrinkView";
import ProgressBarView from "./views/ProgressBarView";
import IntakeLimitView from "./views/IntakeLimitView";
import CaffieneMonitorView from "./views/CaffieneMonitorView";
import DailyLogView from "./views/DailyLogView";
import SearchShortcutsView from "./views/SearchShortcutsView";
import DrinksListView from "./views/DrinksListView";
import SearchBarView from "./views/SearchBarView";
import { initRouter } from "./router";

const controllDashboard = async () => {
	try {
		IntakeView.render(model.state);

		ProgressBarView.render(model.state);
		ProgressBarView.updateProgressBar(model.calcProgress());

		model.calcCaffeineLeft();
		IntakeLimitView.render(model.state.user);

		CaffieneMonitorView.render(model.state);
		CaffieneMonitorView.updateProgressBar(100);
		DailyLogView.render(model.state.user.dailyDrinks);
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
	try {
		await helper.validate(data);

		window.history.replaceState({}, "", "/");
		controllRouter();
	} catch (error) {
		console.error("Validation error: ", error);
	}
};

const handleAddNewLog = async (id) => {
	try {
		model.storeDrink(id);
		model.startCaffeineMonitor();
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
		window.addEventListener("caffeineUpdated", () => {
			CaffieneMonitorView.render(model.state);
			CaffieneMonitorView.updateProgressBar(100);
		});
		initRouter(controllRouter);
		controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
