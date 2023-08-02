/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./nuxt.config.{js,ts}",
		"./app.vue",
	],
	theme: {
		extend: {
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
			colors: {
				html1: "#e34f26",
				html2: "#ef652a",
				css1: "#1b73ba",
				css2: "#1c88c7",
				js1: "#f0db4f",
				js2: "#323330",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
