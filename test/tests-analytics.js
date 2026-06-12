describe('Analytics: 基础功能', function() {
  afterEach(function() {
    localStorage.removeItem('planet_views');
  });

  it('Analytics对象存在', function() {
    expect(typeof Analytics).toBe('object');
  });

  it('Analytics有recordView方法', function() {
    expect(typeof Analytics.recordView).toBe('function');
  });

  it('Analytics有getViews方法', function() {
    expect(typeof Analytics.getViews).toBe('function');
  });

  it('Analytics有getTotalViews方法', function() {
    expect(typeof Analytics.getTotalViews).toBe('function');
  });

  it('Analytics有getViewsByPost方法', function() {
    expect(typeof Analytics.getViewsByPost).toBe('function');
  });

  it('Analytics有getViewsByDate方法', function() {
    expect(typeof Analytics.getViewsByDate).toBe('function');
  });

  it('Analytics有drawChart方法', function() {
    expect(typeof Analytics.drawChart).toBe('function');
  });
});

describe('Analytics: 浏览记录', function() {
  afterEach(function() {
    localStorage.removeItem('planet_views');
  });

  it('recordView记录浏览', function() {
    Analytics.recordView('post-1');
    var views = Analytics.getViews();
    expect(views.length).toBe(1);
    expect(views[0].id).toBe('post-1');
  });

  it('同一篇文章多次浏览', function() {
    Analytics.recordView('post-1');
    Analytics.recordView('post-1');
    Analytics.recordView('post-1');
    expect(Analytics.getTotalViews()).toBe(3);
  });

  it('不同文章浏览', function() {
    Analytics.recordView('post-1');
    Analytics.recordView('post-2');
    Analytics.recordView('post-1');
    expect(Analytics.getTotalViews()).toBe(3);
  });

  it('getViews返回数组', function() {
    var views = Analytics.getViews();
    expect(Array.isArray(views)).toBe(true);
  });

  it('无浏览数据时返回空数组', function() {
    localStorage.removeItem('planet_views');
    var views = Analytics.getViews();
    expect(views.length).toBe(0);
  });

  it('getTotalViews返回总数', function() {
    Analytics.recordView('a');
    Analytics.recordView('b');
    expect(Analytics.getTotalViews()).toBe(2);
  });
});

describe('Analytics: 按文章统计', function() {
  afterEach(function() {
    localStorage.removeItem('planet_views');
  });

  it('getViewsByPost返回Top5', function() {
    Analytics.recordView('a');
    Analytics.recordView('a');
    Analytics.recordView('a');
    Analytics.recordView('b');
    Analytics.recordView('b');
    var top = Analytics.getViewsByPost();
    expect(top.length).toBe(2);
    expect(top[0][0]).toBe('a');
    expect(top[0][1]).toBe(3);
  });

  it('按浏览量降序排列', function() {
    Analytics.recordView('a');
    Analytics.recordView('b');
    Analytics.recordView('b');
    Analytics.recordView('c');
    Analytics.recordView('c');
    Analytics.recordView('c');
    var top = Analytics.getViewsByPost();
    expect(top[0][0]).toBe('c');
    expect(top[1][0]).toBe('b');
  });

  it('最多返回5篇', function() {
    for (var i = 0; i < 10; i++) {
      Analytics.recordView('post-' + i);
    }
    var top = Analytics.getViewsByPost();
    expect(top.length).toBe(5);
  });
});

describe('Analytics: 按日期统计', function() {
  afterEach(function() {
    localStorage.removeItem('planet_views');
  });

  it('getViewsByDate返回对象', function() {
    var data = Analytics.getViewsByDate(7);
    expect(typeof data).toBe('object');
  });

  it('统计今天浏览', function() {
    Analytics.recordView('a');
    Analytics.recordView('a');
    var today = new Date().toISOString().slice(0, 10);
    var data = Analytics.getViewsByDate(1);
    expect(data[today]).toBe(2);
  });

  it('7天内数据', function() {
    Analytics.recordView('a');
    var data = Analytics.getViewsByDate(7);
    var total = Object.values(data).reduce(function(a, b) { return a + b; }, 0);
    expect(total).toBe(1);
  });
});

describe('Analytics: 图表绘制', function() {
  it('drawChart不崩溃（无canvas）', function() {
    Analytics.drawChart('nonexistent', 7);
    expect(true).toBe(true);
  });

  it('drawChart有canvas时执行', function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'testChart';
    canvas.width = 400;
    canvas.height = 200;
    document.body.appendChild(canvas);
    Analytics.recordView('a');
    Analytics.drawChart('testChart', 7);
    document.body.removeChild(canvas);
    expect(true).toBe(true);
  });
});
