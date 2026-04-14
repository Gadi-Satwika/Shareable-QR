/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      darkest: "#0D1B2A", // The deepest navy in the arch
      petrol: "#1F4959",  // The dark teal/blue
      slate: "#5C7C89",   // The mid-tone blue-grey
      charcoal: "#242424", // The neutral dark
      softWhite: "#FFFFFF",
    }
  },
},
  plugins: [],
}