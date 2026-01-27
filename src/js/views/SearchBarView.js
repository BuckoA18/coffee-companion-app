import View from "./View";
import { html } from "../utilities/helpers";

class SearchBarView extends View {
	get _parentElement() {
		return document.querySelector(".search");
	}

	addHandlerGetQuery(handler) {
		const parentElement = this._parentElement;
		if (!parentElement) return;

		this._parentElement.addEventListener("input", (e) => {
			const query = this._parentElement.querySelector(".search__input").value;
			console.log(query);
			if (query.length === 0) return;

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
