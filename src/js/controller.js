import CaffieneMonitorView from "./views/CaffieneMonitorView";
import "../sass/main.scss";
import * as router from "./router";
import * as model from "./model";

// ---- INIT ---- //

const init = async () => {
	try {
		// Check if SW if suported
		if ("serviceWorker" in navigator) {
			const registration = await navigator.serviceWorker.register("/sw_v2.js", {
				scope: "/",
			});

			if (registration.installing) {
				console.log("Service worker installing");
			} else if (registration.waiting) {
				console.log("Service worker installed");
			} else if (registration.active) {
				console.log("Service worker active");
			}
		}

		await model.loadUserProfile();
		await model.checkDate();
		await model.setInitialState();

		window.addEventListener("caffeineUpdated", () => {
			const { user } = model.state;
			CaffieneMonitorView.render(user);
			CaffieneMonitorView.updateProgressBar(model.getMonitorProgress());
		});

		model.state.user.profileReady
			? router.navigateTo("/")
			: router.navigateTo("/welcome");

		router.initRouter(router.controllRouter);
		router.controllRouter();
	} catch (error) {
		console.error(error);
	}
};

init();
