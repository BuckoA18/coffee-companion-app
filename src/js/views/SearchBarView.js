import View from "./View";
import { html } from "../helpers";

class SearchBarView extends View {
	get _parentElement() {
		return document.querySelector(".search-bar");
	}

	addHandlerToggle() {
		this._parentElement?.addEventListener("click", (e) => {
			console.log("dd");
			const button = e.target.closest(".search-bar__button");
			if (!button) return;

			const input = this._parentElement.querySelector(".search-bar__input");
			if (!input) return;

			input.classList.toggle("search-bar__input--closed");
			if (!input.classList.contains("search-bar__input--closed")) input.focus();
		});
	}

	addHandlerGetQuery(handler) {
		const parentElement = this._parentElement;
		if (!parentElement) return;

		this._parentElement.addEventListener("input", (e) => {
			const query =
				this._parentElement.querySelector(".search-bar__input").value;
			handler(query);
		});
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
