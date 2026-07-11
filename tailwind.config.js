/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3f926a",
        light_100: "#fefefe",
        light_200: "#eaeaea",
        dark_100: "#282828",
        dark_200: "#1e1e1e",
        dark_300: "#bbbbbb",
        dark_400: "#5c5c5c",
        dark_500: "#9a9999",
        lemon: "#8c9346",
      },
      fontFamily: {
        mRegular: ["MRegular"],
        mSemiBold: ["MSemiBold"],
        mBold: ["MBold"],
      },
    },
  },
  plugins: [],
};
