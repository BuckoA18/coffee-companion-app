import * as model from "./model";
import * as helper from "./utilities/helpers";
import * as db from "./db";
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
import DrinkEditorView from "./views/DrinkEditorView";

const controllDashboard = async () => {
	try {
		model.startCaffeineMonitor();

		IntakeView.render(model.state);
		helper.calcCaffeine();
		ProgressBarView.render(model.state);
		ProgressBarView.updateProgressBar(model.calcCaffeineProgress());

		model.calcCaffeineUntillLimit();
		IntakeLimitView.render(model.state.user);

		CaffieneMonitorView.render(model.state);
		CaffieneMonitorView.updateProgressBar(model.calcMonitorProgress());
		DailyLogView.render(model.state.user.dailyDrinks);
	} catch (error) {
		console.error(error);
	}
};

const controllLogDrink = async () => {
	try {
		await model.searchShortcuts();
		LogDrinkView.render(model.state);
		SearchBarView.render();
		SearchShortcutsView.render(model.state.search.shortcuts);
		DrinksListView.render(model.state.search.results);
		DrinkEditorView.render();

		// Attach listeners
		SearchBarView.addHandlerGetQuery(handleSearch);
		SearchBarView.addHandlerClearSearchBar(handleSearch);
		SearchShortcutsView.addHandlerGetShortcutId(handleShortcuts);
		DrinksListView.addHandlerToggleDrinkEdit(handleToggleDrinkEdit);
	} catch (error) {
		console.error(error);
	}
};

const handleToggleDrinkEdit = async () => {
	try {
		DrinkEditorView.toggleDrinkEditor();
	} catch (error) {
		console.error(error);
	}
};

// const handleAddNewLog = async (id) => {
// 	try {
// 		model.storeDrink(id);
// 		model.startCaffeineMonitor();
// 		window.history.pushState({}, "", "/");
// 		controllRouter();
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

const handleSearch = async (query) => {
	try {
		await model.searchDrinks(query);
		DrinksListView.render(model.state.results);
	} catch (error) {
		console.error(error);
	}
};

const handleShortcuts = async (id) => {
	try {
		await model.searchShortcuts(id);
		DrinksListView.render(model.state.search.results);
	} catch (error) {}
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
		// model.registerServiceWorker();
		await model.checkDate();
		await model.setInitialState();
		window.addEventListener("caffeineUpdated", () => {
			CaffieneMonitorView.render(model.state);
			CaffieneMonitorView.updateProgressBar(model.calcMonitorProgress());
		});
		initRouter(controllRouter);
		controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
