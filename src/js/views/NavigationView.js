import { html } from "../helpers";
import View from "./View";

class NavigationView extends View {
	get _parentElement() {
		return document.querySelector(".nav");
	}
	_generateMarkup() {
		const markup = html`
			<nav class="nav__container">
				<a href="/" class="nav__item" data-link
					><i class="fa-solid fa-house fa-xl"></i
				></a>
				<a href="/add" class="nav__item" data-link
					><i class="fa-solid fa-plus fa-xl"></i
				></a>
				<a href="/login" class="nav__item"
					><i class="fa-regular fa-square fa-xl"></i
				></a>
			</nav>
		`;
		return markup;
	}
}

export default new NavigationView();
