/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6500',
        darkblue: '#1E3E62',
        deepnavy: '#0B192C',
        black: '#000000',
      },
    },
  },
  plugins: [],
}
