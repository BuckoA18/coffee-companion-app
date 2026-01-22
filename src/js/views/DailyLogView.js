import View from "./View";
import { html } from "../utilities/helpers";

class DailyLogView extends View {
	_message = "Your mug is empty. Time for a brew?";
	get _parentElement() {
		return document.querySelector(".daily-log__list");
	}

	_generateMarkup() {
		const markup = this._data
			.map((drink) => {
				return html`
					<li class="drink-card">
						<div class="drink-card__icon">
							<i class="fa-solid fa-mug-hot fa-xl"></i>
						</div>
						<div class="drink-card__details">
							<span class="drink-card__details-name">${drink.name}</span>
							<span class="drink-card__details-time subtle"
								>${drink.time.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}</span
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

export default new DailyLogView();
