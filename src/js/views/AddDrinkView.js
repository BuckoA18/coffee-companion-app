import View from "./View";
import { html } from "../helpers";

class AddDrinkView extends View {
	_addDrinkButton = document.querySelector(".header__btn-add-drink");
	_parentElement = document.querySelector(".main-view");
	_data;

	// addHandlerRenderDrinkView(handler) {
	// 	this._addDrinkButton.addEventListener("click", (e) => {
	// 		handler();
	// 	});
	// }

	_generateMarkup(data) {
		this._data = data;
		const markup = html`
			<div class="add-drink">
				<input type="text" class="add-drink__input" placeholder="espresso..." />
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
					<li class="add-drink__list-item">
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
