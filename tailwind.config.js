/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f7f9f5',  // Very light green/white
          100: '#edf2e8', // Mist
          200: '#dce6d5', // Pale Leaf
          300: '#c2d4b6', // Sage
          400: '#9ebd8d', // Light Moss
          500: '#7da367', // Fresh Grass
          600: '#5e8249', // Forest Green
          700: '#4a663a', // Deep Moss
          800: '#3d5231', // Dark Canopy
          900: '#33442b', // Night Forest
        },
        earth: {
          50: '#fbf7f3',
          100: '#f5efe6',
          200: '#eaddc8',
          300: '#dbc1a0',
          400: '#c9a076', // Sand
          500: '#b88454', // Wood
          600: '#a86d44', // Bark
          700: '#8c5638', // Dark Wood
          800: '#734832', // Soil
          900: '#5e3c2b', // Deep Earth
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'], // Assuming we might want a nicer display font, sticking to sans for now
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
