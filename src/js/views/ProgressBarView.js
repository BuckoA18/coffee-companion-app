import { html } from "../utilities/helpers";
import View from "./View";

class ProgressBarView extends View {
	get _parentElement() {
		return document.querySelector(".progress-bar");
	}

	_generateMarkup() {
		const caffeine = this._data.caffeine;

		const markup = html`
			<div class="progress-bar__outer">
				<div class="progress-bar__inner">
					<h1 class="progress-bar__caffeine">${caffeine}</h1>
					<span class="progress-bar__label">mg</span>
				</div>
			</div>
			<svg class="progress-bar__svg" width="300px" height="300px">
				<circle class="progress-bar__circle" cx="150" cy="150" r="140" />
			</svg>
		`;
		return markup;
	}

	updateProgressBar(offset) {
		const progressBar = document.querySelector(".progress-bar__circle");
		if (!progressBar) return;

		setTimeout(() => {
			progressBar.style.setProperty("--caff-progress", `${offset}`);
		}, 100);
	}
}

export default new ProgressBarView();
