import * as model from "./model";
import IntakeView from "./views/IntakeView";
import AddDrinkView from "./views/AddDrinkView";
import BottomBarView from "./views/BottomBarView";

const views = {
	IntakeView: IntakeView,
	AddDrinkView: AddDrinkView,
};

const controllPageNav = (nextView) => {
	const view = views[nextView];
	view.render(model.state.drinks);
};

const init = () => {
	model.fetchDrinks();
	BottomBarView.addHandlerClick(controllPageNav);
};

init();
