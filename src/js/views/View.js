import { html } from "../utilities/helpers";

class View {
	_data;

	render(data, error) {
		if (Array.isArray(data) && data.length === 0) return;
		this._data = data;

		const parentElement = this._parentElement;
		if (!parentElement) return;

		this.clear();
		this._parentElement.insertAdjacentHTML(
			"afterbegin",
			this._generateMarkup(data, error),
		);
	}

	renderError(data) {
		const parentElement = this._parentElement;
		if (!parentElement) return;

		this._parentElement.insertAdjacentHTML(
			"afterbegin",
			this._generateErrorMarkup(data),
		);
	}

	clear() {
		this._parentElement.innerHTML = "";
	}
}

export default View;
