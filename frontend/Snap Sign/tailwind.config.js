// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        // Optional: override default sans
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
