import View from "./View";
import { html } from "../helpers";

class DrinksListView extends View {
	get _parentElement() {
		return document.querySelector(".log__list");
	}

	_generateMarkup(state) {
		const markup = state.drinks
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
