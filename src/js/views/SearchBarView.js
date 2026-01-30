import View from "./View";
import { html } from "../utilities/helpers";

class SearchBarView extends View {
	get _parentElement() {
		return document.querySelector(".search");
	}

	addHandlerOnActiveInput(handler) {
		const input = this._parentElement?.querySelector(".search__input");
		input.addEventListener("focus", () => {
			handler();
		});
	}

	addHandlerGetQuery(handler) {
		this._parentElement?.addEventListener("input", () => {
			const query = this._parentElement.querySelector(".search__input").value;
			handler(query);
		});
	}

	_generateMarkup() {
		const markup = html`<i class="fa-solid fa-magnifying-glass"></i>
			<input type="text" name="drink-name" class="search__input" />`;
		return markup;
	}
}

export default new SearchBarView();
