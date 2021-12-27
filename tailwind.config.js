const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        haze: '#6c3c74',
        sky: '#6b4c83',
        tower: '#397169',
        skull: '#afb7c3',
        cave: '#2f2f2f',
        depths: '#292929',
        raspberry: '#f44c7c',
      },
      fontFamily: {
        sans: ['New Rocker', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
