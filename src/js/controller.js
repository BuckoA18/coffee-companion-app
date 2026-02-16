import * as model from "./model";
import * as helper from "./utilities/helpers";
import * as cfg from "./utilities/config";
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
		// Render
		SurveyView.render();
		StepsView.render(cfg.SURVEY_SCHEMA, model.state.survey.currentStep);

		// Handlers
		SurveyView.addHandlerSurveyNav(handleSurveyNav);

		model.plusStep();
	} catch (error) {
		console.error(error);
	}
};

const handleSurveyNav = async () => {
	try {
		if (model.state.survey.currentStep === model.state.survey.maxSteps) {
			window.history.pushState(null, null, "/");
			controllRouter();
			return;
		}
		// Render
		StepsView.render(cfg.SURVEY_SCHEMA, model.state.survey.currentStep);

		//Logic
		window.history.pushState(
			null,
			null,
			`/survey/step-${model.state.survey.currentStep}`,
		);
		controllRouter();
		model.plusStep();
	} catch (error) {}
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
	} catch (error) {}
};

const controllRouter = () => {
	const path = window.location.pathname;
	if (path.startsWith("/survey/step-")) {
		const step = +path.split("-").pop();

		model.state.survey.currentStep = step;

		StepsView.render(cfg.SURVEY_SCHEMA, model.state.survey.currentStep);
		return;
	}
	console.log(path);

	switch (path) {
		case "/survey":
			controllSurvey();
			break;
		case "/welcome":
			controllWelcome();
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
