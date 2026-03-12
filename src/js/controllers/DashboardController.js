import * as model from "../model";
import IntakeView from "../views/IntakeView";
import ProgressBarView from "../views/ProgressBarView";
import IntakeLimitView from "../views/IntakeLimitView";
import CaffieneMonitorView from "../views/CaffieneMonitorView";
import DailyLogView from "../views/DailyLogView";

export const controllDashboard = async () => {
	try {
		// Calc caffeine
		model.calcCaffeine();
		// Start monitor, if NOT running already
		model.startCaffeineMonitor();

		IntakeView.render(); // Render shell

		updateDashboardUI();

		ProgressBarView.updateProgressBar(model.getCaffeineProgress());
		CaffieneMonitorView.updateProgressBar(model.getMonitorProgress());
	} catch (error) {
		console.error(error);
	}
};

const updateDashboardUI = () => {
	const { user } = model.state;
	ProgressBarView.render(user);
	IntakeLimitView.render(model.getCaffeineUntillLimit());
	CaffieneMonitorView.render(user);
	DailyLogView.render(user);
};
