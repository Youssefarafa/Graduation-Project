/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js",],
  theme: {
    extend: {
colors: {
        'plant-primary': {
          light: '#4CAF50', // Vibrant green for light mode
          dark: '#81C784', // Lighter green for dark mode
        },
        'plant-secondary': {
          light: '#26A69A', // Teal for light mode
          dark: '#4DB6AC', // Lighter teal for dark mode
        },
        'plant-accent': {
          light: '#FFCA28', // Warm yellow for light mode
          dark: '#cc9c00', // Softer yellow for dark mode
          hoverr: '#e6b001'
        },
        'plant-dark': {
          light: '#1A3C34', // Deep forest green for light mode
          dark: '#B0BEC5', // Light gray for dark mode text
        },
        'plant-light': {
          light: '#E8F5E9', // Pale green for light mode
          dark: '#14532d', // Dark slate for dark mode backgrounds
        },
      },
      animation: {
        'shake': 'shake 0.3s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        }
      },
      fontSize: {
        'xxs': '0.5rem'
      },
      fontFamily: {
        'Philosopher': ['Philosopher', 'sans-serif'],
        'Roboto': ['Roboto', 'sans-serif'],
        'Quicksand': ['Quicksand', 'sans-serif'],
        'Poppins': ['Poppins', 'sans-serif'],
        'Signika': ['Signika', 'sans-serif'],
        'Inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'lines-notfound': "url('./assets/Images/LinesNotFound.svg')",
      },
      screens: {
        'smmd': '700px',
        'lgxl': '1150px',
        'xl2xl': '1300px',
      },
      backgroundSize: {
        '50%': '50%',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}

