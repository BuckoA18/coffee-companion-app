import View from "./View";
import { html } from "../helpers";

class LoginFormView extends View {
	get _parentElement() {
		return document.querySelector(".login__form");
	}

	addHandlerValidate(handler) {
		const form = this._parentElement;

		form.addEventListener("submit", (e) => {
			e.preventDefault();
			handler();
		});
	}

	_generateMarkup() {
		const markup = html`
			<div class="form-group">
				<label class="login__label" for="input-name">Name</label>
				<input type="text" class="login__input" id="input-name" />
			</div>
			<div class="form-group">
				<label class="login__label" for="input-surname">Surname</label>
				<input type="text" class="login__input" id="input-surname" />
			</div>
			<div class="form-group">
				<label class="login__label" for="input-weight">Weight (kg)</label>
				<input type="number" class="login__input" id="input-weight" />
			</div>
			<div class="form-group">
				<label class="login__label" for="input-metabolism"
					>Metabolism Speed</label
				>
				<select id="input-metabolism" class="login__input">
					<option value="fast">Fast (I can sleep after coffee)</option>
					<option value="normal" selected>Normal</option>
					<option value="slow">Slow (Sensitive to caffeine)</option>
				</select>
			</div>
			<div class="form-group">
				<label class="login__label" for="input-bedtime">Target Bedtime</label>
				<input
					type="time"
					id="input-bedtime"
					class="login__input"
					value="22:30"
				/>
			</div>
			<button class="login__button button" type="submit">Set Up Profile</button>
		`;
		return markup;
	}
}

export default new LoginFormView();
