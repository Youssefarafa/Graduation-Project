/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js",],
  theme: {
    extend: {
      fontFamily: {
        'Philosopher': ['Philosopher', 'sans-serif'],
        'Roboto':['Roboto','sans-serif']
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

