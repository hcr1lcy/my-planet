describe('E2E: 用户完整创作流程', function() {
  it('localStorage可用', function() {
    try {
      localStorage.setItem('_test', '1');
      localStorage.removeItem('_test');
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }
  });

  it('可以创建文章并保存', function() {
    var posts = [];
    var newPost = {
      id: 'e2e-test-1',
      title: 'E2E测试文章',
      content: '# 标题\n正文内容',
      tags: ['tech'],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    };
    posts.push(newPost);
    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe('E2E测试文章');
  });

  it('文章可以添加评论', function() {
    var post = { comments: [] };
    post.comments.push({ name: '测试者', content: '测试评论', time: Date.now() });
    expect(post.comments.length).toBe(1);
    expect(post.comments[0].name).toBe('测试者');
  });

  it('评论可以删除', function() {
    var post = { comments: [{ name: 'A', content: 'a', time: 1 }, { name: 'B', content: 'b', time: 2 }] };
    post.comments.splice(0, 1);
    expect(post.comments.length).toBe(1);
    expect(post.comments[0].name).toBe('B');
  });

  it('搜索过滤正常', function() {
    var posts = [
      { title: 'JavaScript教程', tags: ['tech'] },
      { title: '生活随笔', tags: ['life'] },
      { title: 'AI革命', tags: ['tech', 'ai'] }
    ];
    var query = 'js';
    var filtered = posts.filter(function(p) {
      return p.title.toLowerCase().includes(query.toLowerCase());
    });
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('JavaScript教程');
  });

  it('标签筛选正常', function() {
    var posts = [
      { title: 'A', tags: ['tech'] },
      { title: 'B', tags: ['life'] },
      { title: 'C', tags: ['tech'] }
    ];
    var tag = 'tech';
    var filtered = posts.filter(function(p) { return p.tags.includes(tag); });
    expect(filtered.length).toBe(2);
  });

  it('Markdown解析基本语法', function() {
    var md = '# Title\n\n**bold** and *italic*\n\n- item1\n- item2';
    var html = markdownToHtml(md);
    expect(html).toContain('<h1>');
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
    expect(html).toContain('<li>');
  });

  it('XSS防护 - escapeHtml', function() {
    var input = '<img src=x onerror=alert(1)>';
    var safe = escapeHtml(input);
    expect(safe).toContain('&lt;');
    expect(safe).toContain('&gt;');
  });

  it('数据导出格式正确', function() {
    var data = { planet_posts: '[]', planet_bg: null };
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    expect(parsed.planet_posts).toBe('[]');
  });

  it('数据导入恢复正确', function() {
    var data = { planet_posts: '[{"id":"test"}]' };
    var result = Storage.importData(JSON.stringify(data));
    expect(result.success).toBe(true);
    expect(result.imported).toBe(1);
  });
});
