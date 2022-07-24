import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [svelte(), tsconfigPaths({ loose: true, root: "./" })],
	server: {
		port: 3000,
	},
});
