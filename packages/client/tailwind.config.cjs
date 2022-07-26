/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{html,js,svelte,ts}", "./index.html"],
	theme: {
		extend: {},
		fontFamily: {
			sans: ["Inter", "sans-serif"],
		},
	},
	plugins: [require("tailwindcss"), require("autoprefixer")],
};
