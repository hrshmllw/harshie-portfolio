import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        display: ["Archivo", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        bg: "#2A2E31",
        surface: "#32363A",
        fg: "#F4F1EC",
        muted: "#A7A7A7",
        border: "#45494C",
        accent: {
          DEFAULT: "#3C0007",
          soft: "#8B2A32",
          bright: "#C4454A",
          // Small text on bg/surface: 5.4:1 on bg (AA); `bright` is 2.8:1 there
          light: "#E8888B",
        },
      },
      maxWidth: {
        content: "90rem",
      },
    },
  },
  plugins: [forms],
};
