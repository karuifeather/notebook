/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode using a CSS class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#007aff', // Blue for light mode
          dark: '#60a5fa', // Darker blue for dark mode
        },
        bg: {
          light: '#ffffff', // White background in light mode
          dark: '#121212', // Dark background in dark mode
        },
        text: {
          light: '#333333', // Dark text in light mode
          dark: '#e5e5e5', // Light text in dark mode
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Default sans-serif font
        mono: ['JetBrains Mono', 'monospace'], // Default monospace font
      },
    },
  },
  plugins: [require('@tailwindcss/typography')], // Enables better typography support
};
