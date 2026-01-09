import View from "./View";
import { html } from "../utilities/helpers";

class LoginFormView extends View {
	get _parentElement() {
		return document.querySelector(".login__form");
	}

	_getInputValues() {
		const inputs = document.querySelectorAll(".login__input");
		const values = {};
		inputs.forEach((input) => {
			values[input.id] = input.value;
		});
		return values;
	}

	addHandlerSubmit(handler) {
		this._parentElement.addEventListener("submit", (e) => {
			e.preventDefault();

			const data = this._getInputValues();
			handler(data);
		});
	}

	_generateMarkup() {
		const markup = html`
			<div class="form-group">
				<label class="login__label" for="name">Name</label>
				<input type="text" class="login__input" id="firstName" />
			</div>

			<div class="form-group">
				<label class="login__label" for="weight">Weight (kg)</label>
				<input type="number" step="any" class="login__input" id="weight" />
			</div>
			<div class="form-group">
				<label class="login__label" for="metabolism">Metabolism Speed</label>
				<select id="metabolism" class="login__input  ">
					<option value="fast">Fast (I can sleep after coffee)</option>
					<option value="normal" selected>Normal</option>
					<option value="slow">Slow (Sensitive to caffeine)</option>
				</select>
			</div>
			<div class="form-group">
				<label class="login__label" for="bedtime">Target Bedtime</label>
				<input type="time" id="bedtime" class="login__input" value="22:30" />
			</div>
			<button class="login__button button" type="submit">Set Up Profile</button>
		`;
		return markup;
	}
}

export default new LoginFormView();
