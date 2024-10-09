const withMT = require("@material-tailwind/react/utils/withMT");
const { HiColorSwatch } = require("react-icons/hi");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primaryBg: "#f1f1f1",
        greenbtnColor: "#557c55",
        purpleColor: "#7d449c",
        redBtn: "#ec4f54",
        darkGray: "#e7e7e7",
        tablehead: "#8B9AAB"
      }
    },
  },
  plugins: [],
});