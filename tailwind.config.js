/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js",],
  theme: {
    extend: {
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

