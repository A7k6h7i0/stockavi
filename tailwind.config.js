/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f6fbfb',
          100: '#ddf4f2',
          200: '#bfe7e4',
          300: '#89d2cf',
          400: '#51b9b5',
          500: '#1f9d98',
          600: '#177f7b',
          700: '#156663',
          800: '#154f4d',
          900: '#143f3d',
        },
        ink: {
          950: '#071315',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
      },
    },
  },
  plugins: [],
}
