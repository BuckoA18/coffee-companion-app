import View from "./View";
import { html } from "../utilities/helpers";

class SearchShortcutsView extends View {
	get _parentElement() {
		return document.querySelector(".shortcuts");
	}

	addHandlerGetShortcutId(handler) {
		this._parentElement?.addEventListener("click", (e) => {
			const btn = e.target.closest(".shortcut-btn");
			if (!btn) return;

			const id = btn.dataset.id || "all";
			if (!id) return;

			this._parentElement
				.querySelectorAll(".shortcut-btn")
				.forEach((el) => el.classList.remove("shortcut-btn--active"));

			btn.classList.add("shortcut-btn--active");

			handler(id);
		});
	}

	setActiveShortcut(id) {
		this._parentElement
			.querySelectorAll(".shortcut-btn")
			.forEach((el) => el.classList.remove("shortcut-btn--active"));

		const shortcut = document.querySelector(`[data-id=${id}]`);
		shortcut.classList.add("shortcut-btn--active");
	}

	_generateMarkup() {
		const markup = this._data
			.map((shortcut) => {
				const isActive =
					shortcut.toLowerCase() === "all" ? "shortcut-btn--active" : "";

				return html`<button
					data-id="${shortcut.toLowerCase()}"
					class="shortcut-btn ${isActive}"
				>
					${shortcut}
				</button> `;
			})
			.join("");
		return markup;
	}
}

export default new SearchShortcutsView();
