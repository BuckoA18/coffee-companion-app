class View {
	_data;
	_message;
	_errorMessage;

	render(data) {
		this._data = data;
		const parentElement = this._parentElement;
		if (!parentElement) return;

		this._parentElement.innerHTML = "";
		this._parentElement.insertAdjacentHTML(
			"afterbegin",
			this._generateMarkup(data)
		);
	}
}

export default View;
