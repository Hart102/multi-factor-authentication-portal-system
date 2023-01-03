/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../public/*.html"],
  theme: {
    screens: {
      xsm: '375px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',



      // md: '480px',
      // lg: '768px',
      // l: '976px',
      // xl: '1440px',
    },
    extend: {
      colors: {
        // lightAsh: "rgba(247, 243, 243)",
        lightAsh: "#e5e4f3",
        blue: "#003e9f",
        lightBlue: "#006e9f",
        redColor: "#ff0000",
        'black-rgba': 'rgba(0, 0, 0, 0.8)',
        blackBg: '#16121b',


        // Dashboard colors 
        // LightGrayishCyan: 'hsl(180, 52%, 96%)',
        // LightGrayishCyanFilter: 'hsl(180, 31%, 95%)',
        // DarkGrayishCyan: 'hsl(180, 8%, 52%)',
        // VeryDarkGrayishCyan: 'hsl(180, 14%, 20%)',
      }
    },
  },
  plugins: [],
}
