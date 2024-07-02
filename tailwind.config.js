/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: "14px", // Устанавливаем базовый размер шрифта
      },
      transitionProperty: {
        "max-height": "max-height",
      },
      maxHeight: {
        0: "0",
        full: "100%",
      },
    },
  },
  plugins: [],
};
