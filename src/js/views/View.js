class View {
	_data;

	render(data, error) {
		const parentElement = this._parentElement;
		if (!parentElement) return;
		this.clear();
		// if (Array.isArray(data) && data.length === 0) return;
		this._data = data;

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

		const error = this._parentElement.querySelector(".error");
		if (!error) return;

		error.classList.add("error--active");
		console.log(error);

		setTimeout(() => {
			error.classList.remove("error--active");
		}, 3000);
	}

	clear() {
		this._parentElement.innerHTML = "";
	}
}

export default View;
