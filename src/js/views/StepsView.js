import View from "./View";
import { html } from "../utilities/helpers";
import { MAX_STEPS } from "../utilities/config";

class StepsView extends View {
	get _parentElement() {
		return document.querySelector(".steps");
	}

	_generateInputMarkup(inputType) {
		const markup = html`<input class="steps__input" type=${inputType} />`;
		return markup;
	}

	_generateMultipliersMarkup(multipliers) {
		const markup = html`<ul class="multipliers">
			${multipliers
				.map((multiplier) => {
					return html`<li class="multiplier__card">
						<span>${multiplier.name}</span>
					</li>`;
				})
				.join("")}
		</ul>`;
		return markup;
	}

	_generateMarkup(data) {
		console.log(data);
		const markup = html`<div class="steps__card">
				<h1 class="steps__title">${data.title}</h1>
				${data.input ? this._generateInputMarkup(data.input) : ""}
				${data.multipliers
					? this._generateMultipliersMarkup(data.multipliers)
					: ""}
			</div>
			<button class="steps__button">
				${data.isLastStep ? "Finish" : "Next"}
			</button>`;
		return markup;
	}
}

export default new StepsView();
