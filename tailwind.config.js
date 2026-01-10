export default {
  content: [
    './index.html',
    './tools/**/*.html',
    './ai-tools/**/*.html', 
    './blog/**/*.html',
    './about/**/*.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6'
      }
    }
  },
  plugins: []
};
