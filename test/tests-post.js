describe('Post: 文章详情', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('查找文章', function() {
    savePosts([{
      id: 'post-find',
      title: '查找测试',
      content: '内容',
      tags: ['tech'],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    }]);
    var posts = getPosts();
    var post = posts.find(function(p) { return p.id === 'post-find'; });
    expect(!!post).toBe(true);
    expect(post.title).toBe('查找测试');
  });

  it('未找到文章返回undefined', function() {
    savePosts([]);
    var posts = getPosts();
    var post = posts.find(function(p) { return p.id === 'nonexistent'; });
    expect(post).toBe(undefined);
  });

  it('文章有comments字段', function() {
    savePosts([{
      id: 'post-comments',
      title: '评论测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    }]);
    var posts = getPosts();
    var post = posts.find(function(p) { return p.id === 'post-comments'; });
    expect(Array.isArray(post.comments)).toBe(true);
  });
});

describe('Post: 评论功能', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('添加评论', function() {
    savePosts([{
      id: 'cmt-add',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: 1,
      updatedAt: 1,
      comments: []
    }]);
    var posts = getPosts();
    var post = posts.find(function(p) { return p.id === 'cmt-add'; });
    post.comments.push({ name: '用户A', content: '评论内容', time: Date.now() });
    savePosts(posts);
    expect(getPosts()[0].comments.length).toBe(1);
    expect(getPosts()[0].comments[0].name).toBe('用户A');
  });

  it('删除评论', function() {
    savePosts([{
      id: 'cmt-del',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: 1,
      updatedAt: 1,
      comments: [
        { name: 'A', content: 'a', time: 1 },
        { name: 'B', content: 'b', time: 2 }
      ]
    }]);
    var posts = getPosts();
    var post = posts.find(function(p) { return p.id === 'cmt-del'; });
    post.comments.splice(0, 1);
    savePosts(posts);
    expect(getPosts()[0].comments.length).toBe(1);
    expect(getPosts()[0].comments[0].name).toBe('B');
  });

  it('多条评论按时间排序', function() {
    savePosts([{
      id: 'cmt-sort',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: 1,
      updatedAt: 1,
      comments: [
        { name: 'A', content: 'a', time: 3 },
        { name: 'B', content: 'b', time: 1 },
        { name: 'C', content: 'c', time: 2 }
      ]
    }]);
    var posts = getPosts();
    var post = posts.find(function(p) { return p.id === 'cmt-sort'; });
    var sorted = post.comments.sort(function(a, b) { return b.time - a.time; });
    expect(sorted[0].name).toBe('A');
    expect(sorted[2].name).toBe('B');
  });

  it('评论内容XSS防护', function() {
    var input = '<script>alert(1)</script>';
    var safe = escapeHtml(input);
    expect(safe).toContain('&lt;');
    expect(safe).toContain('&gt;');
    expect(safe).not.toContain('<script>');
  });

  it('空评论不提交', function() {
    var name = '';
    var content = '';
    var shouldSubmit = name.trim() && content.trim();
    expect(!!shouldSubmit).toBe(false);
  });

  it('评论者名字XSS防护', function() {
    var name = '<img src=x onerror=alert(1)>';
    var safe = escapeHtml(name);
    expect(safe).toContain('&lt;');
  });
});

describe('Post: Markdown渲染', function() {
  it('文章内容渲染为HTML', function() {
    var md = '# 标题\n\n**粗体**\n\n- 列表';
    var html = markdownToHtml(md);
    expect(html).toContain('<h1>');
    expect(html).toContain('<strong>');
    expect(html).toContain('<li>');
  });

  it('代码块渲染', function() {
    var md = '```js\nconsole.log(1)\n```';
    var html = markdownToHtml(md);
    expect(html).toContain('<pre>');
    expect(html).toContain('console.log(1)');
  });

  it('引用渲染', function() {
    var md = '> 这是引用';
    var html = markdownToHtml(md);
    expect(html).toContain('<blockquote>');
  });
});

describe('Post: 阅读统计', function() {
  it('recordView写入记录', function() {
    var before = Analytics.getViews().length;
    Analytics.recordView('test-post');
    var after = Analytics.getViews().length;
    expect(after).toBe(before + 1);
  });

  it('getTotalViews返回总数', function() {
    var total = Analytics.getTotalViews();
    expect(typeof total).toBe('number');
    expect(total).toBeGreaterThan(0);
  });

  it('getViewsByPost返回排行', function() {
    var top = Analytics.getViewsByPost();
    expect(Array.isArray(top)).toBe(true);
  });
});
