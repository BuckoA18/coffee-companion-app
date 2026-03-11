import WelcomeView from "../views/WelcomeView";

export const controllWelcome = async () => {
	try {
		WelcomeView.render();
	} catch (error) {
		console.error(error);
	}
};
