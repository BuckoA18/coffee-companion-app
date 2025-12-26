import View from "./View";
import { html } from "../helpers";

class IntakeView extends View {
	_parentElement = document.querySelector(".main-view");
	_dailyDrinks;
	_currentCaffeine;

	_generateMarkup(state) {
		this._dailyDrinks = state.dailyDrinks;
		this._currentCaffeine = state.caffeine;
		console.log(this._dailyDrinks);
		const markup = html`
			<header class="header">
				<div class="header__container container">
					<h1 class="header__title">Brew</h1>
					<i class="fa-solid fa-user-circle fa-xl"></i>
				</div>
			</header>
			<div class="intake container">
				<div class="intake__progress-bar">
					<span class="intake__progress-bar-value">
						<span class="highlight">${this._currentCaffeine}</span>mg</span
					>
				</div>

				<ul class="intake__list">
					${this._generateListItemMarkup()}
				</ul>
			</div>
		`;
		return markup;
	}

	_generateListItemMarkup() {
		return this._dailyDrinks
			.map((drink) => {
				return html`
					<li class="intake__list-item">
						<i class="intake__list-item-icon fa-solid fa-mug-hot fa-xl"></i>
						<h2 class="intake__list-item-title">${drink.name}</h2>
						<span class="intake__list-item-time">9:45 AM</span>
					</li>
				`;
			})
			.join("");
	}

	updateProgressBar(percentage) {
		const progressBar = document.querySelector(".intake__progress");
		progressBar?.style.setProperty("--progress", `${percentage}%`);
	}
}

export default new IntakeView();
