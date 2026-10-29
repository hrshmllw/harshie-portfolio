import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        display: ["Archivo", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
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
        },
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [forms],
};
