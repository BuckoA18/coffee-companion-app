import CaffieneMonitorView from "./views/CaffieneMonitorView";
import * as router from "./router";
import * as model from "./model";

// ---- INIT ---- //

const init = async () => {
	try {
		await model.checkDate();
		await model.setInitialState();

		window.addEventListener("caffeineUpdated", () => {
			CaffieneMonitorView.render(model.state);
			CaffieneMonitorView.updateProgressBar(model.state.monitorBar);
		});

		window.history.pushState(null, null, "/welcome");

		router.initRouter(router.controllRouter);
		router.controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
