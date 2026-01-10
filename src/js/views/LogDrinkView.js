import View from "./View";
import { html } from "../utilities/helpers";

class LogDrinkView extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	_generateMarkup() {
		const markup = html`
			<header class="header">
				<div class="header__container container">
					<button class="btn btn--dashboard">
						<a href="/" data-link
							><i class="btn--dashboard__icon fa-solid fa-arrow-left fa-xl"></i
						></a>
					</button>
					<h1 class="header__title">Log your drink</h1>
					<div class="search-bar"></div>
				</div>
			</header>
			<div class="log container">
				<div class="log__shortcuts"></div>
				<ul class="log__list"></ul>
			</div>
		`;
		return markup;
	}
}

export default new LogDrinkView();
