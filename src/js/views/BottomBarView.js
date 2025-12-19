import View from "./View";

class BottomBarView extends View {
	_parentElement = document.querySelector(".bottom-bar");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", (e) => {
			e.preventDefault();

			if (!e.target.closest(".bottom-bar__link")) return;

			const target = e.target.closest(".bottom-bar__link");
			const nextView = target.dataset.view;
			handler(nextView);
		});
	}
}

export default new BottomBarView();
