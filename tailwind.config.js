/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eef9ff",
          100: "#d6f0ff",
          200: "#a8e0ff",
          300: "#74cbfa",
          400: "#38afee",
          500: "#1493d9",
          600: "#0d74b2",
          700: "#0e5b8d",
          800: "#124d74",
          900: "#143f5f",
        },
        mangrove: {
          50: "#edfdf4",
          100: "#d5f8e4",
          200: "#b0efcb",
          300: "#79dfaa",
          400: "#43c684",
          500: "#219f61",
          600: "#157e4d",
          700: "#13643f",
          800: "#135033",
          900: "#11422b",
        },
        sand: "#f5efe2",
        coral: "#ff8b6a",
      },
      boxShadow: {
        glow: "0 20px 50px rgba(7, 89, 133, 0.18)",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
