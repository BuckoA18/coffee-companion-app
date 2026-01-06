import View from "./View";
import { html } from "../helpers";

class DailyDrinksView extends View {
	_message = "Your mug is empty. Time for a brew?";
	get _parentElement() {
		return document.querySelector(".intake__list");
	}

	_generateMarkup() {
		const markup = this._data
			.map((drink) => {
				return html`
					<li class="intake__list-item">
						<i class="intake__list-item-icon fa-solid fa-mug-hot fa-xl"></i>
						<h2 class="intake__list-item-title">${drink.name}</h2>
						<span class="intake__list-item-time">${new Date()}</span>
					</li>
				`;
			})
			.join("");
		return markup;
	}
}

export default new DailyDrinksView();
