/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nastaleeq: ['"Jameel Noori Nastaleeq"', '"Noto Nastaliq Urdu"', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        ink: {
          50:  '#f8f7f4',
          100: '#f0ede6',
          200: '#ddd8cc',
          300: '#c4bdb0',
          400: '#a09690',
          500: '#7d7168',
          600: '#5c524a',
          700: '#433b34',
          800: '#2e2720',
          900: '#1a1410',
        }
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [],
}
