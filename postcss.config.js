module.exports = {
  plugins: {
    'postcss-font-magician': {
      variants: {
        Montserrat: {
          400: [woff2],
          600: [woff2],
          700: [woff2],
          800: [woff2],
        },
      },
      foundries: ['google'],
    },
  },
};
