import View from "./View";
import { html } from "../utilities/helpers";

class StepsView extends View {
	get _parentElement() {
		return document.querySelector(".steps");
	}

	_generateFactorsMarkup(data) {
		const markup = data
			.map((option) => {
				return html` <div class="factors__card ">
					<h2 class="factors__title">${option}</h2>
				</div>`;
			})
			.join("");

		return markup;
	}

	_generateMarkup(schema, currentStep) {
		const currStepData = schema.find((step) => step.step === currentStep);

		if (currStepData.options) {
			const markup = html`
			<div class="steps__card data-step="${currStepData.id}">
				<h1 class="steps__title">${currStepData.title}</h1>
				 <div class="factors">${this._generateFactorsMarkup(currStepData.options)}</div>
				
			</div>
			`;

			return markup;
		}

		if (currStepData.input) {
			const markup = html`
			<div class="steps__card data-step="${currStepData.id}">
				<h1 class="steps__title" id="${currStepData.id}-label">${currStepData.title}</h1>
				<input type="${currStepData.input}" id="${currStepData.id}" class="steps__input" aria-labelledby="${currStepData.id}-label}}-label">
			</div>
		`;
			return markup;
		}

		const markup = html`
			<div class="steps__card data-step="${currStepData.id}">
				<h1 class="steps__title">${currStepData.title}</h1>
			</div>
		`;
		return markup;
	}
}

export default new StepsView();
