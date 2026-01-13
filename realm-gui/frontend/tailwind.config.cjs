/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#6366F1",
        "background-light": "#F8FAFC",
        "background-dark": "#0F172A",
        "background-slate": "#F8FAFC",
        "financial": "#FBBF24",
        "private": "#A855F7",
        "tech": "#6366F1",
        "social": "#EF4444"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "1.5rem",
        "3xl": "24px",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
