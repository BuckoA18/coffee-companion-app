import * as model from "../model";
import IntakeView from "../views/IntakeView";
import ProgressBarView from "../views/ProgressBarView";
import IntakeLimitView from "../views/IntakeLimitView";
import CaffeineMonitorView from "../views/CaffeineMonitorView";
import DailyLogView from "../views/DailyLogView";

const updateDashboardUI = async () => {
	const { user } = model.state;

	try {
		const drinks = await model.getDailyDrinks();
		DailyLogView.render(drinks);
	} catch (error) {
		console.error("UI Update Error :", error);
	}

	// Render components
	ProgressBarView.render(user);
	IntakeLimitView.render(model.getCaffeineUntillLimit());
	CaffeineMonitorView.render(user);

	// Update progress animations
	ProgressBarView.updateProgressBar(model.getCaffeineProgress());
	CaffeineMonitorView.updateProgressBar(model.getMonitorProgress());
};

export const controllDashboard = async () => {
	try {
		// Calc caffeine
		await model.calcCaffeine();

		// Start monitor, if NOT running already
		model.startCaffeineMonitor();

		// Render shell
		IntakeView.render();

		// Add handler for deleteing drinks
		DailyLogView.addHandlerHandleCardActions(handleDeleteDrink);

		model.subscribe("caffeineTotalUpdated", updateDashboardUI);
		model.notify("caffeineTotalUpdated");
	} catch (error) {
		console.error("Dashboard init error: ", error);
	}
};

const handleDeleteDrink = async (id) => {
	if (!id) return;
	await model.deleteDrinkAndRecalculate(id);
};
