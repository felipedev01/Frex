/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "../index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
          }
        }
      },
    },
    plugins: [],
  }