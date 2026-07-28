/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14151A",
        inksoft: "#3B3E4A",
        amber: {
          DEFAULT: "#F7941D",
          deep: "#C9660A",
        },
        soft: "#F6F7F9",
        line: "#E7E8EC",
        muted: "#6B7280",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
      },
      boxShadow: {
        soft: "0 20px 40px -20px rgba(20,21,26,.25)",
      },
    },
  },
  plugins: [],
};
