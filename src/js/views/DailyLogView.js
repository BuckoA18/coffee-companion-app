import View from "./View";
import { html } from "../utilities/helpers";

class DailyLogView extends View {
	get _parentElement() {
		return document.querySelector(".daily-log__list");
	}

	addHandlerHandleCardActions(handler) {
		this._parentElement.addEventListener("click", (e) => {
			const currentCard = e.target.closest(".drink-card");
			const deleteButton = e.target.closest(".drink-card__button");
			if (!currentCard) return;

			if (deleteButton) this._handleDelete(handler, currentCard);

			this._handleToggle(handler, currentCard);
		});
	}

	_handleDelete(handler, currentCard) {
		const id = currentCard.dataset.id;
		return handler(id);
	}

	_handleToggle(handler, currentCard) {
		if (!currentCard.classList.contains("drink-card--closed")) {
			currentCard.classList.add("drink-card--closed");
			return handler();
		}

		const allCards = Array.from(
			this._parentElement.querySelectorAll(".drink-card"),
		);

		allCards.map((card) => {
			if (card.classList.contains("drink-card--closed")) return;
			card.classList.add("drink-card--closed");
		});
		currentCard.classList.remove("drink-card--closed");
		handler();
	}

	_generateMarkup() {
		console.log(this._data);
		const markup = this._data
			.map((drink) => {
				return html`
					<li
						class="drink-card drink-card--closed"
						data-id="${drink.id}"
						data-timestamp="${drink.consumptionTime}"
					>
						<div class="drink-card__container">
							<div class="drink-card__icon">
								<i class="fa-solid fa-mug-hot fa-xl"></i>
							</div>
							<div class="drink-card__details">
								<span class="drink-card__details-title">${drink.name}</span>
								<span class="drink-card__details-time subtle"
									>${drink.consumptionTime.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}</span
								>
								<span class="drink-card__details-time subtle"
									>${drink.servings}
									${drink.servings > 1
										? drink.serving_style + "s"
										: drink.serving_style}</span
								>
							</div>
							<span class="drink-card__caffeine subtle"
								><span class="highlight">+${drink.caffeine_mg}</span> mg</span
							>
						</div>
						<div class="drink-card__actions">
							<button class="drink-card__button">
								<i class="fa-solid fa-trash"> </i>
							</button>
						</div>
					</li>
				`;
			})
			.join("");
		return markup;
	}
}

export default new DailyLogView();
