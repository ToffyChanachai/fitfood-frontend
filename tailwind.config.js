/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-orange': '#EF9122',  
        'custom-dashboard': '#EAEAEA',  
        'custom-orange-hover': '#DC851D',
        'custom-orange-box': '#FFB539',
      },
      fontFamily: {
        prompt: ['"Prompt"', 'sans-serif'],      },
    },
  },
  plugins: [],
}

