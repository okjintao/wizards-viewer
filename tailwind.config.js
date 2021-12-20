const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        haze: '#1c3b4b',
        lake: '#007872',
        magestic: '#6c3c74',
        raspberry: '#f44c7c',
        skull: '#afb7c3',
        cave: '#2f2f2f',
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
