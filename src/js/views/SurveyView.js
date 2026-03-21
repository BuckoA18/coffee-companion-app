import View from "./View";
import { html } from "../utilities/helpers";

class Survey extends View {
	get _parentElement() {
		return document.querySelector(".main-view");
	}

	_generateMarkup() {
		const markup = html`
			<main class="survey">
				<div class="survey__container">
					<button
						type="button"
						class="survey__button-back"
						aria-label="Next Step"
					>
						<i class="fa-solid fa-arrow-left"></i>
					</button>

					<img
						src="/images/undraw_coffee-run_kfzq.svg"
						alt="friends-having-coffee"
					/>
					<form class="steps"></form>
				</div>
			</main>
		`;
		return markup;
	}

	addHandlerNavigateBack(handler) {
		this._parentElement
			.querySelector(".survey")
			.addEventListener("click", (e) => {
				const button = e.target.closest(".survey__button-back");
				if (!button) return;

				handler();
			});
	}

	addHandlerHandleMultipliers(handler) {
		this._parentElement
			.querySelector(".steps")
			.addEventListener("click", (e) => {
				const multiplierCard = e.target.closest(".multiplier__card");
				if (!multiplierCard) return;

				multiplierCard.classList.toggle("multiplier__card--selected");

				const values = Array.from(
					this._parentElement.querySelectorAll(".multiplier__card--selected"),
				).map((multiplier) => ({
					name: multiplier.dataset.name,
					value: +multiplier.dataset.multiplier,
				}));

				handler(values);
			});
	}

	addHandlerHandleUnitToggle(handler) {
		this._parentElement
			.querySelector(".steps")
			.addEventListener("click", (e) => {
				const input = e.target.closest(".steps__toggle-input");
				if (!input) return;
				const value = input.value;
				handler(value);
			});
	}

	addHandlerSurveyNav(handler) {
		this._parentElement
			.querySelector(".steps")
			.addEventListener("submit", (e) => {
				e.preventDefault();

				const nextButton = this._parentElement.querySelector(".steps__button");
				if (!nextButton) return;

				const input = e.target.querySelector(".steps__input");
				// const multipliers = e.target.querySelector(".multipliers");

				if (input) {
					const type = input.name;
					const formData = new FormData(e.target);
					const value = +formData.get(type);

					return handler({ type, value });
				}

				// if (multipliers) {
				// 	console.log(multipliers);
				// 	return handler();
				// }

				handler();
			});

		handler();
	}
}

export default new Survey();
