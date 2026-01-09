import View from "./View";
import { html } from "../utilities/helpers";

class SearchBarView extends View {
	get _parentElement() {
		return document.querySelector(".search-bar");
	}

	addHandlerToggle() {
		this._parentElement?.addEventListener("click", (e) => {
			const btn = e.target.closest(".search-bar__button");
			if (!btn) return;

			const input = this._parentElement.querySelector(".search-bar__input");
			input.classList.toggle("search-bar__input--closed");

			if (!input.classList.contains("search-bar__input--closed")) input.focus();
		});

		this._parentElement
			?.querySelector(".search-bar__input")
			.addEventListener("blur", (e) => {
				if (!this._parentElement.contains(e.relatedTarget)) {
					e.target.classList.add("search-bar__input--closed");
				}
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
		const markup = html`<input
				type="text"
				class="search-bar__input search-bar__input--closed"
			/>
			<button class="search-bar__button">
				<i class="fa-solid fa-magnifying-glass search-bar__icon"></i>
			</button> `;
		return markup;
	}
}

export default new SearchBarView();
