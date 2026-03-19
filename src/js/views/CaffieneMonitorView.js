import { html } from "../utilities/helpers";
import View from "./View";

class CaffeineMonitorView extends View {
	get _parentElement() {
		return document.querySelector(".caffeine-monitor");
	}

	_generateMarkup() {
		const { caffeineInSystem } = this._data;
		const { bedTime } = this._data;

		const markup = html`
			<span class="caffeine-monitor__label subtle"
				>~${caffeineInSystem}mg in the system now</span
			>
			<div class="caffeine-monitor__bar">
				<svg
					class="caffeine-monitor__bar-svg"
					viewBox="0 0 100 10"
					preserveAspectRatio="none"
				>
					<rect class="caffeine-monitor__fill" width="0" height="10" />
				</svg>
			</div>
			<div class="caffeine-monitor__sleep">
				<span class="caffeine-monitor__label subtle">Safe to sleep from</span>
				<span class="caffeine-monitor__value">${bedTime}</span>
			</div>
		`;
		return markup;
	}

	updateProgressBar(width) {
		const progressBar = document.querySelector(".caffeine-monitor__fill");
		if (!progressBar) return;

		progressBar.style.setProperty("--monitor-progress", `${width}%`);
	}
}

export default new CaffeineMonitorView();
