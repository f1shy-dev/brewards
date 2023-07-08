/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./src/*.{html,js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      screens: {
        xs: "372px",
      },
    },
  },
  plugins: [],
};
