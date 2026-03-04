import * as model from "./model";
import * as helper from "./utilities/helpers";
import * as config from "./utilities/config";
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
import WelcomeView from "./views/WelcomeView";
import SurveyView from "./views/SurveyView";
import StepsView from "./views/StepsView";
import ErrorView from "./views/ErrorView";

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
		// Render strucure
		await model.searchShortcuts();
		LogDrinkView.render(model.state);
		SearchBarView.render();
		SearchShortcutsView.render(model.state.search.shortcuts);
		DrinksListView.render(model.state.search.results);

		// Attach listeners
		SearchBarView.addHandlerGetQuery(handleSearch);
		SearchBarView.addHandlerClearSearchBar(handleSearch);
		SearchShortcutsView.addHandlerGetShortcutId(handleShortcuts);
		DrinksListView.addHandlerToggleDrinkEdit(handleToggleDrinkEdit);
		DrinkEditorView.addHandlerSaveLog(handleSaveLog);
	} catch (error) {
		console.error(error);
	}
};

const controllWelcome = async () => {
	try {
		WelcomeView.render();
	} catch (error) {
		console.error(error);
	}
};

const controllSurvey = async () => {
	try {
		// Render shell
		SurveyView.render();
		// Attach handler and imidietly call it
		SurveyView.addHandlerSurveyNav(handleSurveyNav);
	} catch (error) {
		console.error(error);
	}
};

const handleSurveyNav = () => {
	// Get the current step from state
	const { currentStep, maxSteps } = model.state.survey;
	// After last step go to dashboard
	if (currentStep > maxSteps) {
		window.history.pushState(null, "", "/");
		controllRouter();
		return;
	}
	// Prep data, add lastStep property
	const viewData = {
		...config.SURVEY_SCHEMA[currentStep - 1],
		isLastStep: currentStep === maxSteps,
	};
	// Render step markup based on given step
	StepsView.render(viewData);
	// update state
	model.plusStep();
};

const handleCloseError = () => {
	ErrorView.closeError();
};

const handleToggleDrinkEdit = async (id) => {
	try {
		await model.getDrinkData(id);
		DrinkEditorView.render(model.state.user.currentDrink);
		DrinkEditorView.toggleDrinkEditor(id);
	} catch (error) {
		console.error(error);
	}
};

const handleSaveLog = async (id, amount, newTime) => {
	try {
		await model.storeDrink(id, amount, newTime);
		model.startCaffeineMonitor();
		window.history.pushState({}, "", "/");
		controllRouter();
	} catch (error) {
		console.error(error);
	}
};

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
	} catch (error) {
		console.error(error);
	}
};

const controllRouter = () => {
	// Sets variable path to the curent URL path
	const path = window.location.pathname;
	console.log(path);
	// Checks if survey is open
	// if (path.startsWith("/survey/step-")) {
	// 	// Takes step from URL and sets it to state so its properly updated
	// 	const step = +path.split("-").pop();
	// 	model.state.survey.currentStep = step;
	// 	// Renders survey
	// 	controllSurvey();
	// 	StepsView.render(cfg.SURVEY_SCHEMA, model.state.survey.currentStep);
	// 	StepsView.addHandlerSelectMultipliers(handleMultipliers);
	// 	return;
	// }

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
	}
};

const init = async () => {
	try {
		await model.checkDate();
		await model.setInitialState();

		window.addEventListener("caffeineUpdated", () => {
			CaffieneMonitorView.render(model.state);
			CaffieneMonitorView.updateProgressBar(model.calcMonitorProgress());
		});

		window.history.pushState(null, null, "/welcome");

		initRouter(controllRouter);
		controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
