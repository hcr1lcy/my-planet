describe('Theme: ThemeManager基础', function() {
  afterEach(function() {
    localStorage.removeItem('planet_theme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('ThemeManager对象存在', function() {
    expect(typeof ThemeManager).toBe('object');
  });

  it('ThemeManager有init方法', function() {
    expect(typeof ThemeManager.init).toBe('function');
  });

  it('ThemeManager有apply方法', function() {
    expect(typeof ThemeManager.apply).toBe('function');
  });

  it('ThemeManager有toggle方法', function() {
    expect(typeof ThemeManager.toggle).toBe('function');
  });

  it('ThemeManager.KEY正确', function() {
    expect(ThemeManager.KEY).toBe('planet_theme');
  });
});

describe('Theme: 主题切换', function() {
  afterEach(function() {
    localStorage.removeItem('planet_theme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('默认主题为dark', function() {
    localStorage.removeItem('planet_theme');
    ThemeManager.init();
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  it('apply设置亮色主题', function() {
    ThemeManager.apply('light');
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('light');
  });

  it('apply设置暗色主题', function() {
    ThemeManager.apply('dark');
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  it('toggle从暗色切换到亮色', function() {
    ThemeManager.apply('dark');
    ThemeManager.toggle();
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('light');
  });

  it('toggle从亮色切换到暗色', function() {
    ThemeManager.apply('light');
    ThemeManager.toggle();
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  it('主题选择保存到localStorage', function() {
    ThemeManager.apply('light');
    var saved = localStorage.getItem('planet_theme');
    expect(saved).toBe('light');
  });

  it('init读取保存的主题', function() {
    localStorage.setItem('planet_theme', 'light');
    ThemeManager.init();
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});

describe('Theme: 按钮更新', function() {
  afterEach(function() {
    localStorage.removeItem('planet_theme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('暗色主题按钮显示太阳', function() {
    var btn = document.getElementById('themeToggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'themeToggle';
      document.body.appendChild(btn);
    }
    ThemeManager.apply('dark');
    expect(btn.textContent).toBe('\u2600\uFE0F');
  });

  it('亮色主题按钮显示月亮', function() {
    var btn = document.getElementById('themeToggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'themeToggle';
      document.body.appendChild(btn);
    }
    ThemeManager.apply('light');
    expect(btn.textContent).toBe('\uD83C\uDF19');
  });
});

describe('Theme: CSS变量', function() {
  afterEach(function() {
    localStorage.removeItem('planet_theme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('暗色主题背景为黑色', function() {
    ThemeManager.apply('dark');
    var bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-black').trim();
    expect(bg).toBe('#000');
  });

  it('亮色主题背景为白色', function() {
    ThemeManager.apply('light');
    var bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-black').trim();
    expect(bg).toBe('#ffffff');
  });

  it('暗色主题文字为白色', function() {
    ThemeManager.apply('dark');
    var color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    expect(color).toBe('#fff');
  });

  it('亮色主题文字为深色', function() {
    ThemeManager.apply('light');
    var color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    expect(color).toBe('#1a1a2e');
  });
});

describe('Theme: 主题持久化', function() {
  afterEach(function() {
    localStorage.removeItem('planet_theme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('切换后刷新保持主题', function() {
    ThemeManager.apply('light');
    var saved = localStorage.getItem('planet_theme');
    expect(saved).toBe('light');
    ThemeManager.init();
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('light');
  });

  it('多个页面共享主题设置', function() {
    ThemeManager.apply('light');
    var saved = localStorage.getItem('planet_theme');
    expect(saved).toBe('light');
    ThemeManager.init();
    var theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});
