/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{css,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  important: "#root",
  theme: {
    extend: {},
  },
  plugins: [],
};
