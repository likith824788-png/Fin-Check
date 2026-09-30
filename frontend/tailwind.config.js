/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Extracted from the financial background image ────────
        background: 'transparent',
        surface: '#FFFFFF',

        // Mint/Emerald greens (matching the bar chart bars)
        mint: {
          50:  '#F0FAF5',
          100: '#D6F2E5',
          200: '#AADECA',
          300: '#7BBFA0',
          400: '#5BAD8F',
          500: '#3D9E78',
          600: '#087F5B',   // ← primary brand
          700: '#066347',
          800: '#04503A',
          900: '#02382A',
        },

        // Rose/Pink (matching the flowing waves)
        rose: {
          50:  '#FFF5F5',
          100: '#FFE4E4',
          200: '#F4C5C5',
          300: '#E8A5A5',
          400: '#D98B8B',
          500: '#C97070',
          600: '#B85555',
          700: '#9A3E3E',
          800: '#7B2D2D',
          900: '#5C1E1E',
        },

        // Gold (matching the coins)
        gold: {
          50:  '#FFFBF0',
          100: '#FFF3CC',
          200: '#FFE099',
          300: '#F5C842',
          400: '#D4A843',
          500: '#B8911E',
          600: '#9A7A10',
        },

        // Legacy compatibility
        navy: {
          900: '#1A2E2A',
          800: '#243D38',
          700: '#2F4F49',
          600: '#3D6B63',
          500: '#5A8A81',
        },
        brand: {
          dark: '#087F5B',
          emerald: '#3D9E78',
          mint: '#D6F2E5',
          'mint-light': '#EBF9F2',
          pink: '#FFE4E4',
          'pink-light': '#FFF5F5',
          'pink-border': '#F4C5C5',
          'pink-accent': '#C97070',
        },
        status: {
          consistent:     '#087F5B',
          'consistent-bg':'rgba(8,127,91,0.10)',
          explained:      '#2563EB',
          'explained-bg': 'rgba(37,99,235,0.10)',
          potential:      '#D4A843',
          'potential-bg': 'rgba(212,168,67,0.12)',
          unresolved:     '#C97070',
          'unresolved-bg':'rgba(201,112,112,0.12)',
        },
        border: 'rgba(8,127,91,0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle':  '0 1px 4px rgba(8,127,91,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card':    '0 4px 20px rgba(8,127,91,0.10), 0 1px 6px rgba(0,0,0,0.04)',
        'glow':    '0 0 20px rgba(8,127,91,0.18)',
        'glow-rose':'0 0 20px rgba(201,112,112,0.18)',
        'drawer':  '-4px 0 24px rgba(8,127,91,0.10)',
        'modal':   '0 20px 50px rgba(8,127,91,0.15), 0 8px 16px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
