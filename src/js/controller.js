import * as model from "./model";
import IntakeView from "./views/IntakeView";
import AddDrinkView from "./views/AddDrinkView";

const routes = {
	"/": IntakeView,
	"/add": AddDrinkView,
};

const controllIntake = () => {};

const controllAddDrinkView = async () => {};

const controllRouter = () => {
	const path = window.location.pathname;
	const view = routes[path];

	view.render(model.state.drinks);
};

const init = async () => {
	// Fetch data
	await model.fetchDrinks();

	// Initial load
	controllRouter();

	// Router setup - clicking home and plus icon
	const navigateTo = function (url) {
		window.history.pushState(null, null, url);
		controllRouter();
	};

	document.addEventListener("click", (e) => {
		e.preventDefault();

		const link = e.target.closest("[data-link]");
		if (!link) return;
		const url = link.getAttribute("href");
		navigateTo(url);
	});
};

init();
