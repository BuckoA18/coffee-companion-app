import { html } from "../utilities/helpers";
import View from "./View";

class IntakeLimitView extends View {
	get _parentElement() {
		return document.querySelector(".intake-limit");
	}

	_generateMarkup() {
		const caffeineUntillLimit = this._data;

		const markup = html`
			<span class="intake-limit__label subtle"
				><span class="intake-limit__value"
					>${Math.abs(caffeineUntillLimit)}</span
				>
				mg ${caffeineUntillLimit < 0 ? "over" : "untill"} daily limit
			</span>
		`;
		return markup;
	}
}

export default new IntakeLimitView();
