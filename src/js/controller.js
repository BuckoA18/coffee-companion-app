import * as model from "./model";
import IntakeView from "./views/IntakeView";
import AddDrinkView from "./views/AddDrinkView";
import { initRouter } from "./router";
import { ROUTES } from "./config";

const controllAddDrink = (id) => {
	model.storeDrink(id);
};

const controllRouter = () => {
	const path = window.location.pathname;
	const view = ROUTES[path];

	view.render(model.state);

	if (view === AddDrinkView) {
		AddDrinkView.addHandlerAddDrink(controllAddDrink);
	}
	if (view === IntakeView) {
		IntakeView.updateProgressBar(model.state.progressPerc);
	}
};

const init = async () => {
	// Fetch data
	await model.fetchDrinks();

	initRouter(controllRouter);
	controllRouter();
};

init();
