/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{css,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  important: "body",
  theme: {
    extend: {},
  },
  plugins: [],
};
