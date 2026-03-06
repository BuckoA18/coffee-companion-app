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
		const markup = html`<input
			class="steps__input ${error ? "steps__input--error" : ""}"
			type=${data.input}
			id=${data.id}
			name="${data.id}"
		/>`;
		return markup;
	}

	_generateMultipliersMarkup(data) {
		const markup = html`<ul class="multipliers">
			${data.multipliers
				.map((multiplier) => {
					console.log(multiplier);
					return html`<li
						class="multiplier__card"
						data-multiplier=${multiplier.multiplier}
					>
						<span>${multiplier.name}</span>
					</li>`;
				})
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
				${data.isLastStep ? "Finish" : "Next"}
			</button>`;
		return markup;
	}

	_generateErrorMarkup(error) {
		console.log(error);
		const markup = html`
			<div class="error">
				<div class="error__container">
					<p class="error__description">${error.message}</p>
					<button class="error__button">X</button>
				</div>
			</div>
		`;
		return markup;
	}
}

export default new StepsView();
