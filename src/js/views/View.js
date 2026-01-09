import { html } from "../utilities/helpers";

class View {
	_data;

	render(data) {
		if (Array.isArray(data) && data.length === 0) return;
		this._data = data;

		const parentElement = this._parentElement;
		if (!parentElement) return;

		this.clear();
		this._parentElement.insertAdjacentHTML(
			"afterbegin",
			this._generateMarkup(data)
		);
	}

	clear() {
		this._parentElement.innerHTML = "";
	}

	renderMessage(message = this._message) {
		const markup = html`
			<div class="message">
				<p>${message}</p>
			</div>
		`;
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderError(message = this._error) {
		const markup = html`
			<div class="message">
				<p>${message}</p>
			</div>
		`;
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}

export default View;
