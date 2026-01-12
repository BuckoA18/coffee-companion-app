import { html } from "../utilities/helpers";
import View from "./View";

class ProgressBarView extends View {
	get _parentElement() {
		return document.querySelector(".progress-bar__container");
	}

	_generateMarkup(data) {
		const markup = html`
			<div class="intake__progress-bar">
				<span class="intake__progress-bar-value">
					<span class="highlight">${data.user.caffeine}</span>mg
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
