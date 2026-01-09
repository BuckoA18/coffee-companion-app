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
					<h1 class="header__title">Log your drink</h1>
					<div class="search-bar"></div>
				</div>
			</header>
			<div class="log container">
				<div class="log__shortcuts"></div>
				<ul class="log__list"></ul>
			</div>
			<footer class="nav"</footer>>
		`;
		return markup;
	}
}

export default new LogDrinkView();
