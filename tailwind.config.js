/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js",],
  theme: {
    extend: {
      fontSize:{
        'xxs':'0.5rem'
      },
      fontFamily: {
        'Philosopher': ['Philosopher', 'sans-serif'],
        'Roboto':['Roboto','sans-serif'],
        'Quicksand':['Quicksand','sans-serif'],
        'Poppins':['Poppins','sans-serif'],
      },
      backgroundImage: {
        'lines-notfound': "url('./assets/Images/LinesNotFound.svg')",
      },
      screens:{
        'smmd': '700px',
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}

