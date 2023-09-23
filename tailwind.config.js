/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./node_modules/flowbite/**/*.{js,ts}",
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
        ts1: "#3178c6",
        vue1: "#4dba87",
        vue2: "#435466",
        react1: "#61dafb",
        quasar1: "#00b4ff",
        nuxt1: "#00DC82",
        tailwind1: "#38bdf8",
        backblack: "#050607",
        backlight: "#cccccc",
        primary: "#6e1313",
        secondary: "#363232",
        accent: "#dddddd",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
