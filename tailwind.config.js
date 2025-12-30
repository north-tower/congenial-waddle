/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ASOS-inspired color scheme: Black, White, minimal grays
        primary: {
          DEFAULT: '#000000', // Pure black
          dark: '#000000',
          light: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#e31e24', // ASOS red for CTAs/sales
          dark: '#c41e3a',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [],
}


