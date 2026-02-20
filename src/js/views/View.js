import { html } from "../utilities/helpers";

class View {
	_data;

	render(data, params) {
		if (Array.isArray(data) && data.length === 0) return;
		this._data = data;

		const parentElement = this._parentElement;
		if (!parentElement) return;

		this.clear();
		this._parentElement.insertAdjacentHTML(
			"afterbegin",
			this._generateMarkup(data, params),
		);
	}

	clear() {
		this._parentElement.innerHTML = "";
	}
}

export default View;
