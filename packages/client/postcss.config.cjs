const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

const config = {
	plugins: [tailwindcss(), autoprefixer],
};

module.exports = config;
