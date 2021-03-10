module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },

    extend: {
      colors: {
        b: {
          DEFAULT: "#5a727d",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
