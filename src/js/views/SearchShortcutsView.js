import View from "./View";
import { html } from "../helpers";

class SearchShortcutsView extends View {
	_data;
	get _parentElement() {
		return document.querySelector(".log__shortcuts");
	}

	addHandlerGetShortcutId(handler) {
		this._parentElement?.addEventListener("click", (e) => {
			const btn = e.target.closest(".log__shortcut-btn");
			if (!btn) return;

			const id = btn.dataset.id;
			if (!id) return;

			this._parentElement
				.querySelectorAll(".log__shortcut-btn")
				.forEach((el) => el.classList.remove("log__shortcut-btn--active"));

			btn.classList.add("log__shortcut-btn--active");

			handler(id);
		});
	}

	_generateMarkup(data) {
		this._data = data;

		const markup = this._data
			.map((shortcut) => {
				const isActive =
					shortcut.toLowerCase() === "all" ? "log__shortcut-btn--active" : "";

				return html`<button
					data-id="${shortcut.toLowerCase()}"
					class="log__shortcut-btn ${isActive}"
				>
					${shortcut}
				</button> `;
			})
			.join("");
		return markup;
	}
}

export default new SearchShortcutsView();
