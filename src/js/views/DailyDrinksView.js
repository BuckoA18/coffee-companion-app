import View from "./View";
import { html } from "../helpers";

class DailyDrinksView extends View {
	_message = "Here you will see your logged drinks of the day..";
	get _parentElement() {
		return document.querySelector(".intake__list");
	}

	_generateMarkup() {
		if (this._data.length === 0) {
			//render message?
		}
		const markup = this._data
			.map((drink) => {
				return html`
					<li class="intake__list-item">
						<i class="intake__list-item-icon fa-solid fa-mug-hot fa-xl"></i>
						<h2 class="intake__list-item-title">${drink.name}</h2>
						<span class="intake__list-item-time">9:45 AM</span>
					</li>
				`;
			})
			.join("");
		return markup;
	}
}

export default new DailyDrinksView();
