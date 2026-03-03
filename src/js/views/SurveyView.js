import View from "./View";
import { html } from "../utilities/helpers";

class Survey extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	_generateMarkup() {
		const markup = html`
			<main class="survey">
				<div class="steps"></div>
			</main>
		`;
		return markup;
	}

	addHandlerSurveyNav(handler) {
		this._parentElement
			.querySelector(".steps")
			.addEventListener("click", (e) => {
				const nextButton = e.target.closest(".steps__button");
				if (!nextButton) return;
				console.log(nextButton);
				handler();
			});
		handler();
	}
}

export default new Survey();
