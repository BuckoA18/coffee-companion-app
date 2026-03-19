import * as model from "../model";
import IntakeView from "../views/IntakeView";
import ProgressBarView from "../views/ProgressBarView";
import IntakeLimitView from "../views/IntakeLimitView";
import CaffieneMonitorView from "../views/CaffieneMonitorView";
import DailyLogView from "../views/DailyLogView";

export const controllDashboard = async () => {
	try {
		// Calc caffeine
		await model.calcCaffeine();

		// Start monitor, if NOT running already
		model.startCaffeineMonitor();

		// Render shell
		IntakeView.render();

		updateDashboardUI();

		DailyLogView.addHandlerHandleCardActions(handleDeleteDrink);
	} catch (error) {
		console.error(error);
	}
};

const updateDashboardUI = async () => {
	const { user } = model.state;
	const data = await model.getDailyDrinks();
	console.log(data);
	try {
		DailyLogView.render(data);
	} catch (error) {
		console.log(error);
	}
	ProgressBarView.render(user);
	IntakeLimitView.render(model.getCaffeineUntillLimit());
	CaffieneMonitorView.render(user);
	ProgressBarView.updateProgressBar(model.getCaffeineProgress());
	CaffieneMonitorView.updateProgressBar(model.getMonitorProgress());
};

const handleDeleteDrink = async (id) => {
	if (!id) return;
	// Delete drink
	await model.deleteDrink(id);

	// Recalculate caffeine
	await model.calcCaffeine();
	await model.calcCaffeineInSystem();

	// Rerender
	await updateDashboardUI();
};
