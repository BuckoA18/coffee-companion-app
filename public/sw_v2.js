const staticCache = "app-static-v20";
const dynamicCache = "app-dynamic-v20";
const shellAssets = [
	"/",
	"/index.html",
	"/manifest.json",
	"/images/coffee_bean.png",
	"/images/undraw_coffee-run_kfzq.svg",
	"/images/undraw_coffee-with-friends_ocg2 (1).svg",
	"https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
];

self.addEventListener("install", (e) => {
	// Progress newly installed SW into activation phase
	self.skipWaiting();
	// Wait until promise resovled
	e.waitUntil(addToCache(staticCache, shellAssets));
	console.log(
		"Service worker intalled and assets added to static cache: ",
		shellAssets,
	);
});

const addToCache = async (cacheName, assets) => {
	const cache = await caches.open(cacheName);
	cache.addAll(assets);
};

self.addEventListener("activate", (e) => {
	e.waitUntil([deleteOldCache(), self.clients.claim()]);
});

const deleteOldCache = async () => {
	const allCaches = await caches.keys();
	const cacheWhitelist = [staticCache, dynamicCache];

	const deletionPromise = allCaches.map((key) => {
		if (!cacheWhitelist.includes(key)) {
			console.log("Deleting old cache:", key);
			return caches.delete(key);
		}
	});
	return Promise.all(deletionPromise);
};

self.addEventListener("fetch", (e) => {
	// intercepting fetches by either cached resource or just the fetch
	e.respondWith(handleRequest(e));
});

const handleRequest = async (e) => {
	const cachedResponse = await caches.match(e.request, {
		ignoreSearch: true,
		ignoreVary: true,
	});

	if (cachedResponse) {
		return cachedResponse;
	}
	try {
		const networkResponse = await fetch(e.request);
		if (networkResponse.ok && e.request.method === "GET") {
			const cache = await caches.open(dynamicCache);
			cache.put(e.request.url, networkResponse.clone());
		}
		return networkResponse;
	} catch (error) {
		return new Response("Resource unavailable offline", { status: 404 });
	}
};
