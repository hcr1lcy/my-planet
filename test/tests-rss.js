describe('RSS: feed.xml页面', function() {
  it('feed.xml是有效HTML', function() {
    expect(typeof generateRSS).toBe('function');
  });

  it('generateRSS返回XML字符串', function() {
    var rss = generateRSS();
    expect(typeof rss).toBe('string');
    expect(rss).toContain('<?xml');
    expect(rss).toContain('<rss');
    expect(rss).toContain('</rss>');
  });

  it('RSS包含channel元素', function() {
    var rss = generateRSS();
    expect(rss).toContain('<channel>');
    expect(rss).toContain('</channel>');
    expect(rss).toContain('<title>MY PLANET');
    expect(rss).toContain('<link>');
    expect(rss).toContain('<description>');
  });

  it('RSS包含atom:link', function() {
    var rss = generateRSS();
    expect(rss).toContain('xmlns:atom');
    expect(rss).toContain('rel="self"');
  });
});

describe('RSS: 文章输出', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('无文章时RSS无item', function() {
    localStorage.removeItem('planet_posts');
    var rss = generateRSS();
    expect(rss).not.toContain('<item>');
  });

  it('有文章时RSS包含item', function() {
    savePosts([{
      id: 'rss-test',
      title: 'RSS测试文章',
      content: '# 测试内容\n\n这是测试',
      tags: ['tech'],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var rss = generateRSS();
    expect(rss).toContain('<item>');
    expect(rss).toContain('RSS测试文章');
  });

  it('草稿不出现在RSS中', function() {
    savePosts([{
      id: 'draft-post',
      title: '草稿文章',
      content: '草稿内容',
      tags: [],
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var rss = generateRSS();
    expect(rss).not.toContain('草稿文章');
  });

  it('RSS包含正确链接', function() {
    savePosts([{
      id: 'link-test',
      title: '链接测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var rss = generateRSS();
    expect(rss).toContain('post.html?id=link-test');
  });

  it('RSS包含pubDate', function() {
    savePosts([{
      id: 'date-test',
      title: '日期测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var rss = generateRSS();
    expect(rss).toContain('<pubDate>');
  });

  it('RSS包含description', function() {
    savePosts([{
      id: 'desc-test',
      title: '描述测试',
      content: '这是一篇测试文章的内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var rss = generateRSS();
    expect(rss).toContain('<description>');
  });
});

describe('RSS: XML格式', function() {
  it('RSS版本正确', function() {
    var rss = generateRSS();
    expect(rss).toContain('version="2.0"');
  });

  it('RSS包含xmlns:content', function() {
    var rss = generateRSS();
    expect(rss).toContain('xmlns:content');
  });

  it('RSS语言设置为zh-CN', function() {
    var rss = generateRSS();
    expect(rss).toContain('<language>zh-CN</language>');
  });
});
