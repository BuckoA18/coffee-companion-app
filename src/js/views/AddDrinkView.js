import View from "./View";
import { html } from "../helpers";

class AddDrinkView extends View {
	_parentElement = document.querySelector(".main-view");
	_data;

	addHandlerAddDrink(handler) {
		const drinkList = this._parentElement.querySelector(".add-drink__list");

		drinkList.addEventListener("click", (e) => {
			const item = e.target.closest(".add-drink__list-item");
			if (!item) return;

			handler(item.dataset.id);
		});
	}

	_generateMarkup(state) {
		this._data = state.drinks;
		const markup = html`
			<header class="header">
				<div class="header__container container">
					<h1 class="header__title">Log your drink</h1>
					<i class="fa-solid fa-magnifying-glass"></i>
				</div>
			</header>
			<div class="add-drink container">
				<div class="add-drink__shortcuts-container">
					<button class="add-drink__shortcut">Coffee</button>
					<button class="add-drink__shortcut">Tea</button>
					<button class="add-drink__shortcut">Chocolate</button>
					<button class="add-drink__shortcut">Energy drink</button>
					<button class="add-drink__shortcut">Pills</button>
				</div>
				<ul class="add-drink__list">
					${this._generateListItemsMarkup()}
				</ul>
			</div>
		`;
		return markup;
	}

	_generateListItemsMarkup() {
		return this._data
			.map((drink) => {
				return html`
					<li class="add-drink__list-item" data-id="${drink.id}">
						<i class="add-drink__list-item-icon fa-solid fa-mug-hot fa-xl"> </i>
						<h2 class="add-drink__list-item-title">${drink.name}</h2>
						<span class="add-drink__list-item-caffeine"
							>${drink.caffeine_mg}mg</span
						>
					</li>
				`;
			})
			.join("");
	}
}

export default new AddDrinkView();
