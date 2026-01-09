import View from "./View";
import { html } from "../utilities/helpers";

class DrinksListView extends View {
	get _parentElement() {
		return document.querySelector(".log__list");
	}

	addHandlerNewLog(handler) {
		this._parentElement?.addEventListener("click", (e) => {
			const item = e.target.closest(".log__item");
			if (!item) return;

			handler(item.dataset.id);
		});
	}

	_generateMarkup() {
		const markup = this._data
			.map((drink) => {
				return html`
					<li class="log__item" data-id="${drink.id}">
						<i class="log__item-icon fa-solid fa-mug-hot fa-xl"> </i>
						<h2 class="log__item-title">${drink.name}</h2>
						<span class="log__item-caffeine">${drink.caffeine_mg}mg</span>
					</li>
				`;
			})
			.join("");
		return markup;
	}
}

export default new DrinksListView();
