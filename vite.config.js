import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
	plugins: [
		VitePWA({
			strategies: "injectManifest",
			srcDir: "./",
			filename: "sw_v2.js",
			injectManifest: {
				globPatterns: ["**/*.{html,js,css,svg,png,woff2}"],
			},
			manifest: {
				name: "Brew",
				short_name: "Brew",
				start_url: "/",
				background_color: "#faf9f7",
				theme_color: "#faf9f7",
				display: "standalone",
				icons: [
					{
						src: "/images/coffee_bean.png",
						type: "image/png",
						sizes: "512x512",
					},
				],
			},
		}),
	],
	css: {
		preprocessorOptions: {
			scss: {
				includePaths: [path.resolve(__dirname, "node_modules")],
			},
		},
	},
});
