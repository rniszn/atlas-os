/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        atlas: {
          void: '#030712',
          glass: 'rgba(15, 23, 42, 0.72)',
          cyan: '#22d3ee',
          violet: '#a78bfa',
          green: '#34d399',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        'drawer-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'drawer-in': 'drawer-in 0.35s ease-out forwards',
      },
    },
  },
  plugins: [],
};
