/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#6C63FF',
          teal: '#4ECDC4',
          coral: '#FF6B6B',
        },
        brand: {
          50: '#f3f2ff',
          100: '#ebe8ff',
          200: '#d9d4ff',
          300: '#bcb2ff',
          400: '#9d8aff',
          500: '#6C63FF',
          600: '#5a50e8',
          700: '#4940c9',
          800: '#3d35a3',
          900: '#342e84',
          950: '#1f1a52',
        },
        teal: {
          400: '#4ECDC4',
          500: '#3DBDB5',
          600: '#2CA8A0',
        },
        coral: {
          400: '#FF8E8E',
          500: '#FF6B6B',
          600: '#E85555',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(108, 99, 255, 0.35)',
        'glow-teal': '0 0 30px rgba(78, 205, 196, 0.35)',
        'card': '0 4px 24px rgba(108, 99, 255, 0.08)',
        'card-hover': '0 12px 40px rgba(108, 99, 255, 0.18)',
        'card-deep': '0 20px 60px rgba(108, 99, 255, 0.15)',
      },
      backgroundImage: {
        'gradient-purple-teal': 'linear-gradient(135deg, #6C63FF 0%, #4ECDC4 100%)',
        'gradient-hero': 'linear-gradient(135deg, #6C63FF 0%, #8B7DFF 30%, #4ECDC4 100%)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'fadeInScale': 'fadeInScale 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(108, 99, 255, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
