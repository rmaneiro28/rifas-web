/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#045882',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          500: '#c90b0b',
          600: '#b91c1c',
          700: '#991b1b',
        },
        accent: {
          500: '#003a57',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 0 18px rgba(4, 88, 130, 0.29)',
        'custom-hover': '0 0 18px rgba(201, 11, 11, 0.54)',
      }
    },
  },
  plugins: [],
}
