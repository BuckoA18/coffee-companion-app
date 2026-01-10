import View from "./View";
import { html } from "../utilities/helpers";

class IntakeView extends View {
	_parentElement = document.querySelector(".main-view");

	_generateMarkup() {
		const markup = html`
			<header class="header">
				<div class="header__container container">
					<h1 class="header__title">Brew</h1>
					<button class="btn">
						<a href="/add" data-link><i class="fa-solid fa-plus fa-xl"></i></a>
					</button>
				</div>
			</header>
			<div class="intake container">
				<div class="progress-bar__container"></div>
				<ul class="intake__list"></ul>
			</div>
		`;
		return markup;
	}
}

export default new IntakeView();
