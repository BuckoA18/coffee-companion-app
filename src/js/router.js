export const initRouter = (navigate) => {
	document.addEventListener("click", (e) => {
		const link = e.target.closest("[data-link]");
		if (!link) return; // If it's not a link, do nothing (don't prevent default)

		e.preventDefault();
		const url = link.getAttribute("href");
		window.history.pushState(null, null, url);

		navigate();
	});
};
