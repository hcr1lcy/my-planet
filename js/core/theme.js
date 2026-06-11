var ThemeManager = {
  KEY: 'planet_theme',

  init: function() {
    var saved = localStorage.getItem(this.KEY) || 'dark';
    this.apply(saved);
  },

  apply: function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.KEY, theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  },

  toggle: function() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};
