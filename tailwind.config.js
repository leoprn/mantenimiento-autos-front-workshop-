/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FAC139',
        'primary-hover': '#e0a825',
        'primary-light': '#FCD975',
        'primary-dark': '#d8991e',
      },
    },
  },
  plugins: [],
}

