import View from "./View";
import { html } from "../utilities/helpers";

class StepsView extends View {
	get _parentElement() {
		return document.querySelector(".steps");
	}

	_generateMarkup(data) {
		console.log(data);
		const markup = html`<div class="steps__card">
				<h1 class="steps__title">${data.title}</h1>
			</div>
			<button class="steps__button">next</button>`;
		return markup;
	}
}

export default new StepsView();
