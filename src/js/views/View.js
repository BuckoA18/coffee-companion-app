class View {
	render(data) {
		this._parentElement.innerHTML = "";
		this._parentElement.insertAdjacentHTML(
			"afterbegin",
			this._generateMarkup(data)
		);
	}
}

export default View;
