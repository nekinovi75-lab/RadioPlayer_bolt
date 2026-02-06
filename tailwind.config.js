/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          light: 'hsl(var(--primary-light))',
          dark: 'hsl(var(--primary-dark))',
        },
        'theme-bg': 'hsl(var(--background))',
        'theme-card': 'hsl(var(--card))',
        'theme-text': 'hsl(var(--text))',
        'theme-border': 'hsl(var(--border))',
      },
    },
  },
  plugins: [],
};
