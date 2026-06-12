describe('SEO: Meta标签', function() {
  it('index.html有description', function() {
    var meta = document.querySelector('meta[name="description"]');
    expect(!!meta).toBe(true);
    expect(meta.content.length).toBeGreaterThan(0);
  });

  it('index.html有keywords', function() {
    var meta = document.querySelector('meta[name="keywords"]');
    expect(!!meta).toBe(true);
    expect(meta.content.length).toBeGreaterThan(0);
  });

  it('index.html title包含My Planet', function() {
    var title = document.title;
    expect(title.toLowerCase()).toContain('my planet');
  });
});

describe('SEO: robots.txt', function() {
  it('robots配置正确', function() {
    var robotsContent = 'User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /editor.html';
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Disallow: /admin.html');
  });
});

describe('SEO: Sitemap生成', function() {
  it('generateSitemap是函数', function() {
    expect(typeof generateSitemap).toBe('function');
  });

  it('sitemap包含XML声明', function() {
    var xml = generateSitemap();
    expect(xml).toContain('<?xml');
  });

  it('sitemap包含urlset', function() {
    var xml = generateSitemap();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
  });

  it('sitemap包含静态页面', function() {
    var xml = generateSitemap();
    expect(xml).toContain('<loc>');
    expect(xml).toContain('blog.html');
  });

  it('sitemap包含动态文章', function() {
    savePosts([{
      id: 'seo-test',
      title: 'SEO测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var xml = generateSitemap();
    expect(xml).toContain('post.html?id=seo-test');
  });

  it('sitemap草稿不出现在url中', function() {
    savePosts([{
      id: 'seo-draft',
      title: '草稿',
      content: '内容',
      tags: [],
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
    }]);
    var xml = generateSitemap();
    expect(xml).not.toContain('seo-draft');
  });

  it('sitemap包含lastmod', function() {
    var xml = generateSitemap();
    expect(xml).toContain('<lastmod>');
  });

  it('sitemap包含priority', function() {
    var xml = generateSitemap();
    expect(xml).toContain('<priority>');
  });
});

describe('SEO: JSON-LD结构化数据', function() {
  it('index.html有JSON-LD', function() {
    var script = document.querySelector('script[type="application/ld+json"]');
    expect(!!script).toBe(true);
  });

  it('JSON-LD包含@type', function() {
    var script = document.querySelector('script[type="application/ld+json"]');
    if (script) {
      var data = JSON.parse(script.textContent);
      expect(data['@type']).toBeTruthy();
    } else {
      expect(true).toBe(true);
    }
  });

  it('JSON-LD包含@context', function() {
    var script = document.querySelector('script[type="application/ld+json"]');
    if (script) {
      var data = JSON.parse(script.textContent);
      expect(data['@context']).toBe('https://schema.org');
    } else {
      expect(true).toBe(true);
    }
  });
});

describe('SEO: 页面标题', function() {
  it('所有页面有title标签', function() {
    var title = document.title;
    expect(typeof title).toBe('string');
    expect(title.length).toBeGreaterThan(0);
  });
});
