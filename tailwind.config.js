/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        t: {
          bg: 'var(--bg)',
          card: 'var(--card)',
          'card-hover': 'var(--card-hover)',
          header: 'var(--header)',
          primary: 'var(--primary)',
          'primary-hover': 'var(--primary-hover)',
          'primary-subtle': 'var(--primary-subtle)',
          text: 'var(--text)',
          'text-secondary': 'var(--text-secondary)',
          'text-on-primary': 'var(--text-on-primary)',
          border: 'var(--border)',
          'input-bg': 'var(--input-bg)',
          danger: 'var(--danger)',
          'danger-hover': 'var(--danger-hover)',
          'danger-subtle': 'var(--danger-subtle)',
          success: 'var(--success)',
          'success-hover': 'var(--success-hover)',
          warning: 'var(--warning)',
          'warning-hover': 'var(--warning-hover)',
          'warning-subtle': 'var(--warning-subtle)',
          favorite: 'var(--favorite)',
          'favorite-hover': 'var(--favorite-hover)',
        },
      },
    },
  },
  plugins: [],
};
