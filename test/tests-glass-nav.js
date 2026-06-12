describe('GlassNav: 初始化', function() {
  it('GlassNav对象存在', function() {
    expect(typeof GlassNav).toBe('object');
  });

  it('GlassNav有init方法', function() {
    expect(typeof GlassNav.init).toBe('function');
  });

  it('GlassNav有bindEvents方法', function() {
    expect(typeof GlassNav.bindEvents).toBe('function');
  });

  it('GlassNav有onScroll方法', function() {
    expect(typeof GlassNav.onScroll).toBe('function');
  });

  it('GlassNav有updateHighlight方法', function() {
    expect(typeof GlassNav.updateHighlight).toBe('function');
  });

  it('GlassNav有hideHighlight方法', function() {
    expect(typeof GlassNav.hideHighlight).toBe('function');
  });

  it('GlassNav有createRipple方法', function() {
    expect(typeof GlassNav.createRipple).toBe('function');
  });
});

describe('GlassNav: CSS类', function() {
  it('nav-glass类定义存在', function() {
    var style = document.styleSheets;
    var found = false;
    for (var i = 0; i < style.length; i++) {
      try {
        var rules = style[i].cssRules || style[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j].selectorText && rules[j].selectorText.indexOf('nav-glass') !== -1) {
            found = true;
            break;
          }
        }
      } catch (e) {}
      if (found) break;
    }
    expect(found).toBe(true);
  });

  it('nav-ripple类定义存在', function() {
    var style = document.styleSheets;
    var found = false;
    for (var i = 0; i < style.length; i++) {
      try {
        var rules = style[i].cssRules || style[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j].selectorText && rules[j].selectorText.indexOf('nav-ripple') !== -1) {
            found = true;
            break;
          }
        }
      } catch (e) {}
      if (found) break;
    }
    expect(found).toBe(true);
  });
});

describe('GlassNav: 滚动状态', function() {
  it('onScroll添加scrolled类', function() {
    var nav = document.querySelector('nav');
    if (!nav) {
      nav = document.createElement('nav');
      document.body.appendChild(nav);
    }
    GlassNav.nav = nav;
    window.scrollTo(0, 100);
    GlassNav.onScroll();
    expect(nav.classList.contains('scrolled')).toBe(true);
  });

  it('滚动回顶部移除scrolled类', function() {
    var nav = document.querySelector('nav');
    if (!nav) {
      nav = document.createElement('nav');
      document.body.appendChild(nav);
    }
    GlassNav.nav = nav;
    window.scrollTo(0, 0);
    GlassNav.onScroll();
    expect(nav.classList.contains('scrolled')).toBe(false);
  });
});

describe('GlassNav: 高光追踪', function() {
  it('updateHighlight设置CSS变量', function() {
    GlassNav.updateHighlight(150);
    var val = document.documentElement.style.getPropertyValue('--nav-highlight-x');
    expect(val).toBe('150px');
  });

  it('hideHighlight重置CSS变量', function() {
    GlassNav.hideHighlight();
    var val = document.documentElement.style.getPropertyValue('--nav-highlight-x');
    expect(val).toBe('-300px');
  });
});

describe('GlassNav: 波纹效果', function() {
  it('createRipple创建波纹元素', function() {
    var nav = document.querySelector('nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.style.position = 'relative';
      nav.style.overflow = 'hidden';
      document.body.appendChild(nav);
    }
    GlassNav.nav = nav;
    var event = { clientX: 100, clientY: 50 };
    GlassNav.createRipple(event);
    var ripple = nav.querySelector('.nav-ripple');
    expect(!!ripple).toBe(true);
    if (ripple) ripple.remove();
  });
});

describe('GlassNav: CSS变量', function() {
  it('glass-blur变量存在', function() {
    var val = getComputedStyle(document.documentElement).getPropertyValue('--glass-blur').trim();
    expect(val).toBeTruthy();
  });

  it('glass-bg变量存在', function() {
    var val = getComputedStyle(document.documentElement).getPropertyValue('--glass-bg').trim();
    expect(val).toBeTruthy();
  });

  it('glass-border变量存在', function() {
    var val = getComputedStyle(document.documentElement).getPropertyValue('--glass-border').trim();
    expect(val).toBeTruthy();
  });
});

describe('GlassNav: 减弱动画支持', function() {
  it('CSS包含prefers-reduced-motion', function() {
    var style = document.styleSheets;
    var found = false;
    for (var i = 0; i < style.length; i++) {
      try {
        var rules = style[i].cssRules || style[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j] instanceof CSSMediaRule && rules[j].conditionText && rules[j].conditionText.indexOf('prefers-reduced-motion') !== -1) {
            found = true;
            break;
          }
        }
      } catch (e) {}
      if (found) break;
    }
    expect(found).toBe(true);
  });
});

describe('GlassNav: 降级支持', function() {
  it('CSS包含@supports降级', function() {
    var style = document.styleSheets;
    var found = false;
    for (var i = 0; i < style.length; i++) {
      try {
        var rules = style[i].cssRules || style[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j] instanceof CSSSupportsRule && rules[j].conditionText && rules[j].conditionText.indexOf('backdrop-filter') !== -1) {
            found = true;
            break;
          }
        }
      } catch (e) {}
      if (found) break;
    }
    expect(found).toBe(true);
  });
});
