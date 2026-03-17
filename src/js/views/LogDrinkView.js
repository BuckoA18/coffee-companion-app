import View from "./View";
import { html } from "../utilities/helpers";

class LogDrinkView extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	_generateMarkup() {
		const markup = html`
			<header class="header ">
				<div class="header__container">
					<h2 class="header__title">Log Your Drink</h2>
					<a href="/" data-link class="header__back-btn">
						<i class="fa-solid fa-arrow-left"></i>
					</a>
				</div>
			</header>

			<main class="log ">
				<div class="log__container">
					<section class="log__toolbar">
						<form class="search">
							<input type="text" placeholder="Search drinks..." />
						</form>
						<div class="shortcuts"></div>
					</section>

					<div class="log">
						<ul class="log-list"></ul>
						<div class="drink-editor drink-editor--closed"></div>
					</div>
				</div>
			</main>
		`;
		return markup;
	}
}

export default new LogDrinkView();
