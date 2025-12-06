export default {
  content: ['./**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6'
      }
    }
  },
  plugins: [],
  safelist: [
    { pattern: /^(dark|grey|ocean):/ }
  ]
};
