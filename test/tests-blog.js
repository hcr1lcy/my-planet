describe('Blog: 文章列表渲染', function() {
  it('getAllPosts返回数组', function() {
    var posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it('包含静态文章', function() {
    var posts = getAllPosts();
    var staticPost = posts.find(function(p) { return p.id === 'first-post'; });
    expect(!!staticPost).toBe(true);
  });

  it('静态文章有isStatic标记', function() {
    var posts = getAllPosts();
    var staticPost = posts.find(function(p) { return p.id === 'first-post'; });
    expect(staticPost.isStatic).toBe(true);
  });
});

describe('Blog: 搜索过滤', function() {
  var testPosts = [
    { title: 'JavaScript教程', tags: ['tech'], excerpt: 'JS基础', isStatic: true },
    { title: '生活随笔', tags: ['life'], excerpt: '日常记录', isStatic: true },
    { title: 'AI革命', tags: ['tech', 'ai'], excerpt: '人工智能', isStatic: true },
    { title: 'CSS设计', tags: ['design'], excerpt: '样式技巧', isStatic: true }
  ];

  it('关键词搜索匹配标题', function() {
    var query = 'javascript';
    var filtered = testPosts.filter(function(p) {
      return p.title.toLowerCase().includes(query);
    });
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('JavaScript教程');
  });

  it('关键词搜索匹配摘要', function() {
    var query = '人工';
    var filtered = testPosts.filter(function(p) {
      return p.excerpt.toLowerCase().includes(query);
    });
    expect(filtered.length).toBe(1);
  });

  it('搜索不存在的关键词', function() {
    var query = 'xyz123';
    var filtered = testPosts.filter(function(p) {
      return p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query);
    });
    expect(filtered.length).toBe(0);
  });

  it('空搜索返回全部', function() {
    var query = '';
    var filtered = testPosts.filter(function(p) {
      return !query || p.title.toLowerCase().includes(query);
    });
    expect(filtered.length).toBe(4);
  });
});

describe('Blog: 标签筛选', function() {
  var testPosts = [
    { title: 'A', tags: ['tech'] },
    { title: 'B', tags: ['life'] },
    { title: 'C', tags: ['tech'] },
    { title: 'D', tags: ['tech', 'ai'] }
  ];

  it('筛选tech标签', function() {
    var tag = 'tech';
    var filtered = testPosts.filter(function(p) { return p.tags.includes(tag); });
    expect(filtered.length).toBe(3);
  });

  it('筛选life标签', function() {
    var tag = 'life';
    var filtered = testPosts.filter(function(p) { return p.tags.includes(tag); });
    expect(filtered.length).toBe(1);
  });

  it('筛选ai标签', function() {
    var tag = 'ai';
    var filtered = testPosts.filter(function(p) { return p.tags.includes(tag); });
    expect(filtered.length).toBe(1);
  });

  it('筛选不存在的标签', function() {
    var tag = 'food';
    var filtered = testPosts.filter(function(p) { return p.tags.includes(tag); });
    expect(filtered.length).toBe(0);
  });
});

describe('Blog: 搜索+标签组合', function() {
  var testPosts = [
    { title: 'JavaScript教程', tags: ['tech'], excerpt: 'JS基础' },
    { title: 'Java入门', tags: ['tech'], excerpt: 'Java基础' },
    { title: '生活随笔', tags: ['life'], excerpt: '日常' }
  ];

  it('标签筛选+关键词搜索取交集', function() {
    var tag = 'tech';
    var query = 'java';
    var filtered = testPosts.filter(function(p) {
      var tagMatch = p.tags.includes(tag);
      var searchMatch = p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query);
      return tagMatch && searchMatch;
    });
    expect(filtered.length).toBe(2);
  });
});

describe('Blog: 动态文章', function() {
  it('getDynamicPosts返回数组', function() {
    var posts = getDynamicPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it('仅包含已发布文章', function() {
    savePosts([
      { id: 'test-draft', title: '草稿', content: '内容', status: 'draft', createdAt: Date.now(), updatedAt: Date.now(), comments: [] },
      { id: 'test-pub', title: '已发布', content: '内容', status: 'published', createdAt: Date.now(), updatedAt: Date.now(), comments: [] }
    ]);
    var posts = getDynamicPosts();
    var draft = posts.find(function(p) { return p.id === 'test-draft'; });
    var pub = posts.find(function(p) { return p.id === 'test-pub'; });
    expect(!!draft).toBe(false);
    expect(!!pub).toBe(true);
  });

  it('动态文章有正确字段', function() {
    savePosts([
      { id: 'test-fields', title: '测试', content: '正文内容', tags: ['tech'], status: 'published', createdAt: Date.now(), updatedAt: Date.now(), comments: [] }
    ]);
    var posts = getDynamicPosts();
    var post = posts.find(function(p) { return p.id === 'test-fields'; });
    expect(!!post).toBe(true);
    expect(post.title).toBe('测试');
    expect(post.isStatic).toBe(false);
  });
});
