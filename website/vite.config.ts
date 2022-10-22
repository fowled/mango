import tsconfigPaths from "vite-tsconfig-paths";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vue(), tsconfigPaths({ loose: true, root: "./" })],
	server: { port: 3002 },
});
