import CaffieneMonitorView from "./views/CaffieneMonitorView";
import * as router from "./router";
import * as model from "./model";

// ---- INIT ---- //

const init = async () => {
	try {
		await model.checkDate();
		await model.setInitialState();

		window.addEventListener("caffeineUpdated", () => {
			const { user } = model.state;
			CaffieneMonitorView.render(user);
			CaffieneMonitorView.updateProgressBar(model.getMonitorProgress());
		});

		router.navigateTo("/welcome");

		router.initRouter(router.controllRouter);
		router.controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
