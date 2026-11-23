/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0f1d',
          darker: '#060913',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#06b6d4',
          neon: '#10b981',
          danger: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
