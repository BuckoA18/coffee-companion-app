import View from "./View";
import { html } from "../utilities/helpers";

class LoginView extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	_generateMarkup() {
		const markup = html`
			<div class="login container">
				<h1 class="login__title">Create Your Profile</h1>
				<form class="login__form"></form>
			</div>
		`;
		return markup;
	}
}

export default new LoginView();
