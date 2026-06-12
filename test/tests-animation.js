describe('Animations: Animations对象', function() {
  it('Animations对象存在', function() {
    expect(typeof Animations).toBe('object');
  });

  it('Animations有init方法', function() {
    expect(typeof Animations.init).toBe('function');
  });

  it('Animations有initSectionObserver方法', function() {
    expect(typeof Animations.initSectionObserver).toBe('function');
  });

  it('Animations有initPageTransition方法', function() {
    expect(typeof Animations.initPageTransition).toBe('function');
  });
});

describe('Animations: CSS类', function() {
  it('fade-in-section类定义存在', function() {
    var style = document.styleSheets;
    var found = false;
    for (var i = 0; i < style.length; i++) {
      try {
        var rules = style[i].cssRules || style[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j].selectorText && rules[j].selectorText.indexOf('fade-in-section') !== -1) {
            found = true;
            break;
          }
        }
      } catch (e) {}
      if (found) break;
    }
    expect(found).toBe(true);
  });

  it('stagger-item类定义存在', function() {
    var style = document.styleSheets;
    var found = false;
    for (var i = 0; i < style.length; i++) {
      try {
        var rules = style[i].cssRules || style[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j].selectorText && rules[j].selectorText.indexOf('stagger-item') !== -1) {
            found = true;
            break;
          }
        }
      } catch (e) {}
      if (found) break;
    }
    expect(found).toBe(true);
  });

  it('page-transition类定义存在', function() {
    var style = document.styleSheets;
    var found = false;
    for (var i = 0; i < style.length; i++) {
      try {
        var rules = style[i].cssRules || style[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j].selectorText && rules[j].selectorText.indexOf('page-transition') !== -1) {
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

describe('Animations: IntersectionObserver', function() {
  it('IntersectionObserver存在', function() {
    expect(typeof IntersectionObserver).toBe('function');
  });

  it('initSectionObserver不崩溃', function() {
    Animations.initSectionObserver();
    expect(true).toBe(true);
  });
});

describe('Animations: 页面过渡', function() {
  it('initPageTransition添加page-transition类', function() {
    document.body.classList.remove('page-transition');
    Animations.initPageTransition();
    expect(document.body.classList.contains('page-transition')).toBe(true);
  });
});

describe('Animations: 减弱动画支持', function() {
  it('CSS包含prefers-reduced-motion媒体查询', function() {
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
