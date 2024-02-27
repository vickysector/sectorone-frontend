/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        "auth-screen": "calc(100vh - 40px)",
      },
      colors: {
        "primary-200": "#FFF8F1",
        "primary-base": "#FF6F1E",
        "input-border": "#D5D5D5",
        "input-container": "#F7F7F7",
        "text-description": "#676767",
        "text-disabled": "#00000040",
      },
      fontSize: {
        "heading-1": [
          //styleName: Heading/Heading 1;

          "38px",
          {
            //styleName: Heading/Heading 1;
            lineHeight: "46px",
            fontWeight: "600",
          },
        ],
        "LG-normal": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],

        "Base-normal": [
          "14px",
          {
            lineHeight: "22px",
            fontWeight: "400",
          },
        ],
      },
    },
  },
  plugins: [],
};
