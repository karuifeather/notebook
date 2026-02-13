/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode using a CSS class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        landing: '72rem' /* 1152px – main content */,
        'landing-narrow': '48rem' /* 768px – text/CTAs */,
      },
      colors: {
        accent: 'var(--accent)',
        accentHover: 'var(--accent-hover)',
        accentSoft: 'var(--accent-soft)',
        accentRing: 'var(--accent-ring)',
        danger: 'var(--danger)',
        success: 'var(--success)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        fg: 'var(--text)',
        icon: 'var(--icon)',
        iconMuted: 'var(--icon-muted)',
        iconActive: 'var(--icon-active)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Default sans-serif font
        mono: ['JetBrains Mono', 'monospace'], // Default monospace font
      },
    },
  },
  plugins: [require('@tailwindcss/typography')], // Enables better typography support
};
