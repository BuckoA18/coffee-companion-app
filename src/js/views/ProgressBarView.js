import { html } from "../helpers";
import View from "./View";

class ProgressBarView extends View {
	get _parentElement() {
		return document.querySelector(".progress-bar__container");
	}

	_generateMarkup(state) {
		this._currentCaffeine = state.caffeine;

		const markup = html`
			<div class="intake__progress-bar">
				<span class="intake__progress-bar-value">
					<span class="highlight">${this._currentCaffeine}</span>mg
				</span>
			</div>
		`;
		return markup;
	}

	updateProgressBar(percentage) {
		const progressBar = document.querySelector(".intake__progress-bar");
		progressBar?.style.setProperty("--progress", `${percentage}%`);
	}
}

export default new ProgressBarView();
