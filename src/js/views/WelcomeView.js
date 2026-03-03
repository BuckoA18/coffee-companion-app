import View from "./View";
import { html } from "../utilities/helpers";

class Welcome extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	_generateMarkup() {
		const markup = html`
			<main class="login">
				<img
					src="/images/undraw_coffee-with-friends_ocg2 (1).svg"
					alt="Friends sharing coffee"
					class="login__image"
				/>
				<div class="login__container">
					<div class="login__group login__group--info">
						<h1 class="login__title">Welcome to Brew</h1>
						<p class="login__description">Caffeine tracking made simple</p>
					</div>
					<div class="login__group login__group--actions">
						<a href="/survey" data-link class="login__link login__link--start"
							>Get Started</a
						>
						<a href="/" data-link class="login__link login__link--skip subtle"
							>Skip</a
						>
					</div>
				</div>
			</main>
		`;
		return markup;
	}
}

export default new Welcome();
