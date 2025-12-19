import View from "./View";
import { html } from "../helpers";

class IntakeView extends View {
	_parentElement = document.querySelector(".main-view");

	_generateMarkup() {
		const markup = html`
			<div class="intake">
				<div class="intake__progress">
					<span class="intake__progress-value"
						><span class="highlight">245</span>mg</span
					>
				</div>

				<ul class="intake__list">
					<li class="intake__list-item">
						<i class="intake__list-item-icon fa-solid fa-mug-hot fa-xl"></i>
						<h2 class="intake__list-item-title">espresso</h2>
						<span class="intake__list-item-time">9:45 AM</span>
					</li>
					<li class="intake__list-item">
						<i class="intake__list-item-icon fa-solid fa-mug-hot fa-xl"></i>
						<h2 class="intake__list-item-title">filter</h2>
						<span class="intake__list-item-time">11:45 AM</span>
					</li>
					<li class="intake__list-item">
						<i class="intake__list-item-icon fa-solid fa-mug-hot fa-xl"></i>
						<h2 class="intake__list-item-title">capuccino</h2>
						<span class="intake__list-item-time">12:00 AM</span>
					</li>
					<li class="intake__list-item">
						<i class="intake__list-item-icon fa-solid fa-mug-hot fa-xl"></i>
						<h2 class="intake__list-item-title">decaf filter</h2>
						<span class="intake__list-item-time">15:45 PM</span>
					</li>
				</ul>
			</div>
		`;
		return markup;
	}
}

export default new IntakeView();
