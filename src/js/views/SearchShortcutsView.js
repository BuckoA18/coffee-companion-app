import View from "./View";
import { html } from "../helpers";

class SearchShortcutsView extends View {
	get _parentElement() {
		return document.querySelector(".log__shortcuts");
	}

	_generateMarkup() {
		const markup = html`
			<button class="log__shortcut-btn">Coffee</button>
			<button class="log__shortcut-btn">Tea</button>
			<button class="log__shortcut-btn">Chocolate</button>
			<button class="log__shortcut-btn">Energy drink</button>
			<button class="log__shortcut-btn">Pills</button>
		`;
		return markup;
	}
}

export default new SearchShortcutsView();
