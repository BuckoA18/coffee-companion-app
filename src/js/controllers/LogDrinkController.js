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
		LogDrinkView.render(model.state); // Render shell

		updateLogDrinkUI();

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

const updateLogDrinkUI = async () => {
	const { results } = model.state.search;
	SearchBarView.render();
	SearchShortcutsView.render(await model.getShortcuts());
	DrinksListView.render(results);
};

const handleToggleDrinkEdit = async (id) => {
	try {
		DrinkEditorView.render(await model.getDrinkData(id));
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
		DrinksListView.render(model.getQueryResults(query));
	} catch (error) {
		console.error(error);
	}
};

const handleShortcuts = async (id) => {
	try {
		await model.getShortcutResults(id);

		const { results } = model.state.search;
		DrinksListView.render(results);
	} catch (error) {
		console.error(error);
	}
};
