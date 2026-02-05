import View from "./View";
import { html } from "../utilities/helpers";

class LogDrinkView extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	_generateMarkup() {
		const markup = html`
			<header class="header">
				<div class="header__content header__content--log">
					<div class="header__container">
						<h2 class="header__title">Log Your Drink</h2>
						<a href="/" data-link
							><button class="header__back-btn btn">
								<i class="fa-solid fa-arrow-left header__icon"></i></button
						></a>
					</div>
					<form class="search"></form>

					<div class="shortcuts"></div>
				</div>
			</header>

			<div class="log">
				<ul class="log-list"></ul>
			</div>

			<div class="drink-editor drink-editor--closed"></div>
		`;
		return markup;
	}
}

export default new LogDrinkView();
