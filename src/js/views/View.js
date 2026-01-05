import { html } from "../helpers";

class View {
	_data;
	_message;
	_errorMessage;

	render(data) {
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
}

export default View;
