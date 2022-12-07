/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
            /*https://www.youtube.com/watch?v=kap8xrWMNDM&ab_channel=simonswiss */
            /*https://tailwindcss.com/docs/guides/nextjs*/
  ],
  theme: {
  
    extend: {
      fontSize:{
        "3xl": '1.953rem',
        "4xl": '2.441rem',
        "5xl": '3.052rem',
      }
    },
    
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("daisyui"),
    require('@tailwindcss/forms'),
  ],
}
