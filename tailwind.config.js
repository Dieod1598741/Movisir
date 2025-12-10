/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        panelAppear: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        'panel-appear': 'panelAppear 0.2s ease-out',
      },
      zIndex: {
        'base': '0',
        'deco': '10',
        'panel': '20',
        'floating': '30',
        'nav': '40',
        'modal': '50',
        'toast': '60',
        'max': '9999',
      },
    },
  },
  plugins: [],
}