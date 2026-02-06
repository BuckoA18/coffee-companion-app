import View from "./View";
import { html } from "../utilities/helpers";

class DrinkEditorView extends View {
	get _parentElement() {
		return document.querySelector(".drink-editor");
	}

	toggleDrinkEditor() {
		if (!this._parentElement.classList.contains("drink-editor--closed")) return;

		this._parentElement.classList.remove("drink-editor--closed");
		console.log(this._parentElement);

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
		console.log(this._parentElement);
	}

	_generateMarkup() {
		const markup = html`
			<div class="drink-editor__grabber"></div>

			<div class="drink-editor__header">
				<div class="drink-editor__icon">
					<i class="fa-solid fa-mug-hot fa-xl"></i>
				</div>
				<h2 class="drink-editor__title">Espresso</h2>

				<span class="drink-editor__caffeine subtle"
					><span class="highlight">+45</span> mg</span
				>
			</div>

			<div class="drink-editor__fields">
				<div class="drink-editor__field">
					<label for="amount" class="drink-editor__label">Shots:</label>
					<input
						type="number"
						name="amount"
						id="amount"
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
						class="drink-editor__input"
						value="09:14"
					/>
				</div>
				<div class="drink-editor__field">
					<button class="btn btn--save">Save</button>
				</div>
			</div>
		`;
		return markup;
	}
}

export default new DrinkEditorView();
