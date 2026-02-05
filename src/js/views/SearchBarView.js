import View from "./View";
import { html } from "../utilities/helpers";

class SearchBarView extends View {
	get _parentElement() {
		return document.querySelector(".search");
	}

	addHandlerGetQuery(handler) {
		this._parentElement?.addEventListener("input", () => {
			const query = this._parentElement.querySelector(".search__input").value;
			handler(query);
		});
	}

	addHandlerClearSearchBar(handler) {
		this._parentElement?.addEventListener("click", (e) => {
			const clearBtn = this._parentElement?.querySelector(
				".search__icon-clear",
			);
			if (e.target !== clearBtn) return;
			const input = this._parentElement.querySelector(".search__input");
			input.value = "";
			handler("");
		});
	}

	_generateMarkup() {
		const markup = html`<i class="fa-solid fa-magnifying-glass"></i>
			<input type="text" name="drink-name" class="search__input" />
			<i class="fa-solid fa-xmark search__icon-clear"></i>`;
		return markup;
	}
}

export default new SearchBarView();
