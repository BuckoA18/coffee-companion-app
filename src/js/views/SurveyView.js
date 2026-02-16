import View from "./View";
import { html } from "../utilities/helpers";

class Survey extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	addHandlerSurveyNav(handler) {
		const nextButton = document.querySelector(".survey__button--next");
		nextButton.addEventListener("click", () => {
			handler();
		});
	}

	_generateMarkup() {
		const markup = html`
			<main class="survey">
				<div class="steps"></div>
				<button class="survey__button survey__button--next">Next</button>
			</main>
		`;
		return markup;
	}
}

export default new Survey();
