/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    /*https://www.youtube.com/watch?v=kap8xrWMNDM&ab_channel=simonswiss */
    /*https://tailwindcss.com/docs/guides/nextjs*/
  ],
  theme: {
    extend: {
      fontSize: {
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      colors: {
        darkPurple: "#140223",
        accent: "",
        mainColor: "",
        secondaryColor: "rgb(243 232 255 / var(--tw-bg-opacity, 1))",
        darkBackground: "",

        errorBackgroundColor: "rgb(30 41 59 / var(--tw-bg-opacity, 1))",
        errorTextColor: "rgb(255 255 255 / var(--tw-bg-opacity, 1))",
        errorBorderColor: "rgb(241 245 249 / var(--tw-bg-opacity, 1))",

        buttonBackgroundColor: "",
        buttonTextColor: "",
        buttonBorderColor: "",

        //22043b
      },
      fontFamily: {},
      width: {
        "30rem": "40rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui"),
    require("@tailwindcss/forms"),
  ],
};
