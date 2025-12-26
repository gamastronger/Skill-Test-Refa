/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#0F2854",
          700: "#1C4D8D",
          500: "#4988C4",
          200: "#BDE8F5",
        },
      },
    },
  },
  plugins: [],
}

