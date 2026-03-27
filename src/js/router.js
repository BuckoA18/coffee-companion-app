import { controllSurvey } from "./controllers/SurveyController";
import { controllWelcome } from "./controllers/WelcomeController";
import { controllDashboard } from "./controllers/DashboardController";
import { controllLogDrink } from "./controllers/LogDrinkController";

export const initRouter = (navigate) => {
	window.addEventListener("popstate", () => {
		navigate();
	});
	document.addEventListener("click", (e) => {
		const link = e.target.closest("[data-link]");
		if (!link) return;

		e.preventDefault();
		const url = link.getAttribute("href");
		setTimeout(() => {
			window.history.pushState(null, null, url);
			navigate();
		}, 10);
	});
};

export const navigateTo = (path) => {
	window.history.pushState(null, "", path);
	controllRouter();
};

export const controllRouter = () => {
	const path = window.location.pathname;

	switch (path) {
		case "/welcome":
			controllWelcome();
			break;
		case "/":
			controllDashboard();
			break;
		case "/add":
			controllLogDrink();
			break;
		case "/survey":
			controllSurvey();
			break;
		default:
			console.error("404: Page not found");
		// TODO Page not found page?
	}
};
