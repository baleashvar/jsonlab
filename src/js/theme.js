const icons = {
  light: '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>',
  dark: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
};
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.className = theme;
if(document.getElementById('theme-icon')) {
  document.getElementById('theme-icon').innerHTML = icons[theme];
}
if(document.getElementById('theme-toggle')) {
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const newTheme = document.documentElement.className === 'dark' ? 'light' : 'dark';
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
    const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.innerHTML = icons[newTheme];
  }
  });
}
