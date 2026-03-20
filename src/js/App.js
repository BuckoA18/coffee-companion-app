import CaffeineMonitorView from "./views/CaffeineMonitorView"; // FIX TYPO
import "../sass/main.scss";
import * as router from "./router";
import * as model from "./model";

const registerServiceWorker = async () => {
	if (!("serviceWorker" in navigator)) return;
	try {
		const registration = await navigator.serviceWorker.register("/sw_v2.js", {
			scope: "/",
		});

		console.log("SW registrated: ", registration.scope);
	} catch (error) {
		console.error("SW registration failed: ", error);
	}
};

const updateCaffeineMonitor = () => {
	const { user } = model.state;
	CaffeineMonitorView.render(user);
	CaffeineMonitorView.updateProgressBar(model.getMonitorProgress());
};

const init = async () => {
	try {
		await registerServiceWorker();

		await Promise.all([
			model.loadUserProfile(),
			model.checkDate(),
			model.setInitialState(),
		]);

		model.subscribe("caffeineInSystemUpdated", updateCaffeineMonitor);

		const initilRoute = model.state.user.profileReady ? "/" : "/welcome";
		router.navigateTo(initilRoute);

		router.initRouter(router.controllRouter);
		router.controllRouter();
	} catch (error) {
		console.error("Initialization error: ", error);
	}
};

init();
