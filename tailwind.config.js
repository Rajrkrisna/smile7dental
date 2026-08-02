/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#00264d',
          800: '#003366',
          700: '#004884', // Primary Logo Deep Royal Blue
        },
        sky: {
          500: '#1e88e5', // Secondary Logo Electric Sky Blue
          400: '#38b6ff',
          300: '#70cbff',
        },
        teal: {
          600: '#1d6f84',
          500: '#268199', // Logo Cyan Teal
          400: '#3eb4ce',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          900: '#0f172a',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 20px 40px -15px rgba(0, 72, 132, 0.07)',
        'apple-hover': '0 30px 60px -15px rgba(0, 72, 132, 0.15)',
        'blue-glow': '0 0 30px rgba(30, 136, 229, 0.3)',
      }
    },
  },
  plugins: [],
}
