import * as model from "./model";
import IntakeView from "./views/IntakeView";
import LogDrinkView from "./views/LogDrinkView";
import ProgressBarView from "./views/ProgressBarView";
import DailyDrinksView from "./views/DailyDrinksView";
import SearchShortcutsView from "./views/SearchShortcutsView";
import DrinksListView from "./views/DrinksListView";
import { initRouter } from "./router";

const controllDashboard = () => {
	IntakeView.render(model.state);
	ProgressBarView.render(model.state);
	DailyDrinksView.render(model.state);
};

const controllLogDrink = () => {
	LogDrinkView.render(model.state);
	SearchShortcutsView.render(model.state);
	DrinksListView.render(model.state);
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

const init = async () => {
	await model.fetchDrinks();

	initRouter(controllRouter);
	controllRouter();
};

init();
