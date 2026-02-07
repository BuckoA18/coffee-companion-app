import View from "./View";
import { html } from "../utilities/helpers";

class DrinkEditorView extends View {
	get _parentElement() {
		return document.querySelector(".drink-editor");
	}
	addHandlerSaveLog(handler) {
		this._parentElement?.addEventListener("click", (e) => {
			const saveButton = this._parentElement.querySelector(
				".drink-editor__button--save",
			);
			if (e.target !== saveButton) return;

			const amount = this._getCustomDrinkAmount();
			const drinkDate = this._getCustomDrinkDate();

			this._closeEditor();
			handler(this._id, amount, drinkDate);
		});
	}

	_getCustomDrinkAmount() {
		const amount = +document.querySelector(".drink-editor__input--amount")
			.value;
		return amount;
	}

	_getCustomDrinkDate() {
		const time = this._parentElement.querySelector(
			".drink-editor__input--time",
		).value;

		const drinkDate = new Date();
		const [hours, minutes] = time.split(":");

		drinkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
		return drinkDate;
	}

	toggleDrinkEditor(id) {
		this._id = id;
		if (!this._parentElement.classList.contains("drink-editor--closed")) return;

		this._parentElement.classList.remove("drink-editor--closed");

		setTimeout(() => {
			this._addOutsideClickListener();
		}, 10);
	}

	_addOutsideClickListener() {
		this._outsideClickRef = (e) => {
			if (this._parentElement.contains(e.target)) return;
			this._closeEditor();
		};

		window.addEventListener("click", this._outsideClickRef);
	}

	_closeEditor() {
		this._parentElement.classList.add("drink-editor--closed");
		window.removeEventListener("click", this._outsideClickRef);
	}

	_generateMarkup() {
		const drink = this._data;

		const markup = html`
			<div class="drink-editor__grabber"></div>

			<div class="drink-editor__header">
				<div class="drink-editor__icon">
					<i class="fa-solid fa-mug-hot fa-xl"></i>
				</div>
				<h2 class="drink-editor__title">${drink.name}</h2>

				<span class="drink-editor__caffeine subtle"
					><span class="highlight">+${drink.caffeine_mg}</span> mg</span
				>
			</div>

			<div class="drink-editor__fields">
				<div class="drink-editor__field">
					<label for="${drink.id}" class="drink-editor__label"
						>${drink.serving_style}s:</label
					>
					<input
						type="number"
						name="amount"
						id="${drink.id}"
						class="drink-editor__input drink-editor__input--amount"
						value="1"
					/>
					<div class="drink-editor__wrapper">
						<button class="drink-editor__button drink-editor__button--plus">
							+</button
						><button class="drink-editor__button drink-editor__button--minus">
							-
						</button>
					</div>
				</div>
				<div class="drink-editor__field">
					<label for="consumption" class="drink-editor__label"
						>Time of consumption:</label
					>
					<input
						type="time"
						name="consumption"
						id="consumption"
						class="drink-editor__input drink-editor__input--time"
						value=${drink.time.toLocaleTimeString("en-GB", {
							hours: "2-digit",
							minutes: "2-digit",
						})}
					/>
				</div>
				<div class="drink-editor__field">
					<button class="drink-editor__button--save btn btn--save">Save</button>
				</div>
			</div>
		`;
		return markup;
	}
}

export default new DrinkEditorView();
