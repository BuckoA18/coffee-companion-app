import * as model from "../model";
import * as router from "../router";
import LogDrinkView from "../views/LogDrinkView";
import SearchBarView from "../views/SearchBarView";
import SearchShortcutsView from "../views/SearchShortcutsView";
import DrinksListView from "../views/DrinksListView";
import DrinkEditorView from "../views/DrinkEditorView";

export const controllLogDrink = async () => {
	try {
		// Render strucure
		await model.searchShortcuts();
		LogDrinkView.render(model.state);
		SearchBarView.render();
		SearchShortcutsView.render(model.state.search.shortcuts);
		DrinksListView.render(model.state.search.results);

		// Attach listeners
		SearchBarView.addHandlerGetQuery(handleSearch);
		SearchBarView.addHandlerClearSearchBar(handleSearch);
		SearchShortcutsView.addHandlerGetShortcutId(handleShortcuts);
		DrinksListView.addHandlerToggleDrinkEdit(handleToggleDrinkEdit);
		DrinkEditorView.addHandlerEditorActions(handleEditorActions);
	} catch (error) {
		console.error(error);
	}
};

const handleToggleDrinkEdit = async (id) => {
	try {
		await model.getDrinkData(id);
		DrinkEditorView.render(model.state.user.currentDrink);
		DrinkEditorView.toggleDrinkEditor();
	} catch (error) {
		console.error(error);
	}
};

const handleEditorActions = async (id, servings, consumptionTime) => {
	try {
		await model.storeDrink(id, servings, consumptionTime);
		model.startCaffeineMonitor();
		router.navigateTo("/");
	} catch (error) {
		console.error(error);
	}
};

const handleSearch = async (query) => {
	try {
		await model.searchDrinks(query);
		DrinksListView.render(model.state.results);
	} catch (error) {
		console.error(error);
	}
};

const handleShortcuts = async (id) => {
	try {
		await model.searchShortcuts(id);
		DrinksListView.render(model.state.search.results);
	} catch (error) {
		console.error(error);
	}
};
