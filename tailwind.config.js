/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode using a CSS class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#007aff',
          dark: '#34c759',
        },
        bg: {
          light: '#ffffff',
          dark: '#121212',
        },
        text: {
          light: '#333333',
          dark: '#e5e5e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
