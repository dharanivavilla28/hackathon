/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7f3',
          100: '#f6ede4',
          200: '#edd6c5',
          300: '#e0b89d',
          400: '#cf9271',
          500: '#c2734f',
          600: '#b15a3e',
          700: '#944534',
          800: '#793b2f',
          900: '#64322a',
          950: '#361815',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0B',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(224, 184, 157, 0.25)',
        'gold-glow': '0 0 30px -5px rgba(245, 158, 11, 0.3)'
      }
    },
  },
  plugins: [],
}
