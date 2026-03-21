import View from "./View";
import { html } from "../utilities/helpers";

class StepsView extends View {
	get _parentElement() {
		return document.querySelector(".steps");
	}

	focusInput() {
		const input = this._parentElement.querySelector(".steps__input");
		if (!input) return;

		input.focus();
	}

	_generateInputMarkup(data, error) {
		const isWeight = data.id === "weight";
		const markup = html`<input
				class="steps__input ${error ? "steps__input--error" : ""}"
				type=${data.input}
				id=${data.id}
				name="${data.id}"
			/>

			${isWeight
				? html` <div class="steps__toggle">
						<label class="steps__toggle-option">
							<input
								type="radio"
								name="weight-unit"
								value="kg"
								class="steps__toggle-input"
								checked
							/>
							<span>kg</span>
						</label>
						<label class="steps__toggle-option">
							<input
								type="radio"
								name="weight-unit"
								class="steps__toggle-input"
								value="lbs"
							/>
							<span>lbs</span>
						</label>
					</div>`
				: ""}`;
		return markup;
	}

	_generateMultipliersMarkup(data) {
		const markup = html` <ul class="multipliers">
			${data.multipliers
				.map(
					(multiplier) => html`
						<li
							class="multiplier__card"
							data-multiplier="${multiplier.multiplier}"
							data-name="${multiplier.name}"
						>
							<div class="multiplier__content">
								<span class="multiplier__label">${multiplier.name}</span>
								<span class="multiplier__description"
									>${multiplier.description}</span
								>
							</div>
							<div class="multiplier__badge">${multiplier.multiplier}x</div>
						</li>
					`,
				)
				.join("")}
		</ul>`;
		return markup;
	}

	_generateMarkup(data, error) {
		const markup = html`<div class="steps__card">
				<h1 class="steps__title">${data.title}</h1>
				${data.input ? this._generateInputMarkup(data, error) : ""}
				${data.multipliers ? this._generateMultipliersMarkup(data) : ""}
			</div>
			<button class="steps__button">
				${data.isLastStep ? "Done" : "Next"}
			</button>`;
		return markup;
	}

	_generateErrorMarkup(error) {
		console.log(error);
		const markup = html`
			<div class="error steps__error">
				<p class="error__description">${error.message}</p>
			</div>
		`;
		return markup;
	}
}

export default new StepsView();
