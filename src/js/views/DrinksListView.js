import View from "./View";
import { html } from "../utilities/helpers";

class DrinksListView extends View {
	get _parentElement() {
		return document.querySelector(".log-list");
	}

	addHandlerNewLog(handler) {
		this._parentElement?.addEventListener("click", (e) => {
			const item = e.target.closest(".drink-card");
			if (!item) return;

			handler(item.dataset.id);
		});
	}

	_generateMarkup() {
		const markup = this._data
			.map((drink) => {
				return html`
					<li class="drink-card" data-id="${drink.id}">
						<div class="drink-card__icon">
							<i class="fa-solid fa-mug-hot fa-xl"></i>
						</div>
						<div class="drink-card__details">
							<span class="drink-card__details-name">${drink.name}</span>
							<span class="drink-card__details-amount subtle"
								>${drink.volume_ml} ml</span
							>
						</div>
						<span class="drink-card__caffeine subtle"
							><span class="highlight">+${drink.caffeine_mg}</span> mg</span
						>
					</li>
				`;
			})
			.join("");
		return markup;
	}
}

export default new DrinksListView();
