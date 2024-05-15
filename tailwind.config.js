// @type {import('tailwindcss').Config}
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        "noto-serif": ["Noto Serif Thai", "serif"],
      },
      colors: {
        blue: "#2D7DF8",
        lightblue: "#6DC6FF",
        babyblue: "#D9E9F9",
        lightgreen: "#66D18B",
        white: "#FFFFFF",
        lightgray: "#EFEFEF",
        black: "#20201D",
        "gray-status": "#7E7E7E",
        "yellow-status": "#FFB730",
        "blue-status": "#0D9BFD",
        "green-status": "#53CC7D",
      },
      fontSize: {
        header: "32px",
      },
      screens: {
        mobile: "320px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
      },
    },
  },
  plugins: [require("daisyui")],
};
