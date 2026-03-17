import View from "./View";
import { html } from "../utilities/helpers";

class DrinkEditorView extends View {
	get _parentElement() {
		return document.querySelector(".drink-editor");
	}

	addHandlerEditorActions(handler) {
		this._parentElement.addEventListener("click", (e) => {
			// 1. Handle Save Button
			const saveBtn = e.target.closest(".drink-editor__button--save");
			const closeBtn = e.target.closest(".drink-editor__button--close");

			if (closeBtn || e.target === this._parentElement)
				return this._closeEditor();
			if (saveBtn) {
				const servings = this._getDrinkServings();
				const consumptionTime = this._getDrinkConsumptionTime();
				this._closeEditor();
				return handler(this._data.id, servings, consumptionTime);
			}

			const plusBtn = e.target.closest(".drink-editor__button--plus");
			const minusBtn = e.target.closest(".drink-editor__button--minus");
			const input = this._parentElement.querySelector(
				".drink-editor__input--amount",
			);

			if (plusBtn) input.value = Number(input.value) + 1;
			if (minusBtn && input.value > 1) input.value = Number(input.value) - 1;
		});
	}

	_closeEditor() {
		this._parentElement.classList.add("drink-editor--closed");
	}

	toggleDrinkEditor() {
		this._parentElement.classList.toggle("drink-editor--closed");
	}

	_getDrinkServings() {
		const amount = +this._parentElement.querySelector(
			".drink-editor__input--amount",
		)?.value;
		return amount;
	}

	_getDrinkConsumptionTime() {
		const timeInput = this._parentElement.querySelector(
			".drink-editor__input--time",
		).value;
		const drinkDate = new Date();
		const [hours, minutes] = timeInput.split(":");

		drinkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

		console.log(drinkDate);

		const now = new Date();

		if (drinkDate > now) {
			return now;
		}

		return drinkDate;
	}

	_getDefaultTime() {
		return new Date().toTimeString().slice(0, 5);
	}

	_generateMarkup() {
		const drink = this._data;
		const now = this._getDefaultTime(); // Using the bulletproof helper

		return html`
			<div class="drink-editor__container">
				<header class="drink-editor__header">
					<button class="drink-editor__button drink-editor__button--close">
						<i class="fa-solid fa-xmark"></i>
					</button>
					<div class="drink-editor__icon">
						<i class="fa-solid fa-mug-hot fa-xl"></i>
					</div>
					<h2 class="drink-editor__title">${drink.name}</h2>
					<div class="drink-editor__caffeine subtle">
						<span class="highlight">+${drink.caffeine_mg}</span> mg
					</div>
				</header>
				<div class="drink-editor__fields">
					<div class="drink-editor__field">
						<label for="amount" class="drink-editor__label">
							${drink.serving_style}s
						</label>

						<div class="drink-editor__wrapper">
							<button
								type="button"
								class="drink-editor__button drink-editor__button--minus"
								aria-label="Decrease amount"
							>
								<i class="fa-solid fa-minus"></i>
							</button>

							<input
								type="number"
								id="amount"
								class="drink-editor__input drink-editor__input--amount"
								value="1"
								min="1"
								readonly
							/>

							<button
								type="button"
								class="drink-editor__button drink-editor__button--plus"
								aria-label="Increase amount"
							>
								<i class="fa-solid fa-plus"></i>
							</button>
						</div>
					</div>

					<div class="drink-editor__field">
						<label for="consumption" class="drink-editor__label">
							Consumption Time
						</label>
						<input
							type="time"
							id="consumption"
							class="drink-editor__input drink-editor__input--time"
							value="${now}"
							max="${now}"
						/>
					</div>

					<div class="drink-editor__actions">
						<button class="drink-editor__button--save ">Log Drink</button>
					</div>
				</div>
			</div>
		`;
	}
}

export default new DrinkEditorView();
