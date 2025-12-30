import View from "./View";
import { html } from "../helpers";

class SearchBarView extends View {
	get _parentElement() {
		return document.querySelector(".search-bar");
	}

	_generateMarkup() {
		const markup = html`
			<input type="text" class="search-bar__input search-bar__input--closed" />
			<button class="search-bar__button">
				<i class="fa-solid fa-magnifying-glass search-bar__icon"></i>
			</button>
		`;
		return markup;
	}
}

export default new SearchBarView();
