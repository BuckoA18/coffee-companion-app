import * as model from "../model";
import * as helper from "../utilities/helpers";
import IntakeView from "../views/IntakeView";
import ProgressBarView from "../views/ProgressBarView";
import IntakeLimitView from "../views/IntakeLimitView";
import CaffieneMonitorView from "../views/CaffieneMonitorView";
import DailyLogView from "../views/DailyLogView";

export const controllDashboard = async () => {
	try {
		helper.calcCaffeine();
		model.calcCaffeineUntillLimit();
		model.calcCaffeineProgress();
		model.calcMonitorProgress();
		model.startCaffeineMonitor();

		IntakeView.render(); // Render shell
		ProgressBarView.render(model.state.user.caffeine);
		ProgressBarView.updateProgressBar(model.state.maxCaffeineBarOffset);
		IntakeLimitView.render(model.state.user.caffeineUntillLimit);
		CaffieneMonitorView.render(model.state);

		CaffieneMonitorView.updateProgressBar(model.state.monitorBar);

		DailyLogView.render(model.state.user.dailyDrinks);
	} catch (error) {
		console.error(error);
	}
};
