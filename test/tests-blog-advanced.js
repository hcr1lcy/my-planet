describe('Blog Advanced: 分页功能', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('分页变量存在', function() {
    expect(typeof POSTS_PER_PAGE).toBe('number');
    expect(POSTS_PER_PAGE).toBe(10);
  });

  it('paginatePosts返回正确结构', function() {
    var posts = [];
    for (var i = 0; i < 25; i++) {
      posts.push({ id: 'p' + i, title: 'Post ' + i, pinned: false, createdAt: i });
    }
    var result = paginatePosts(posts, 1);
    expect(result.items.length).toBe(10);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(1);
  });

  it('paginatePosts最后一页', function() {
    var posts = [];
    for (var i = 0; i < 25; i++) {
      posts.push({ id: 'p' + i, title: 'Post ' + i });
    }
    var result = paginatePosts(posts, 3);
    expect(result.items.length).toBe(5);
    expect(result.page).toBe(3);
  });

  it('paginatePosts空数组', function() {
    var result = paginatePosts([], 1);
    expect(result.items.length).toBe(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it('goToPage是函数', function() {
    expect(typeof goToPage).toBe('function');
  });
});

describe('Blog Advanced: 排序功能', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('sortPosts按时间排序', function() {
    var posts = [
      { id: 'a', createdAt: 100, pinned: false },
      { id: 'b', createdAt: 300, pinned: false },
      { id: 'c', createdAt: 200, pinned: false },
    ];
    var sorted = sortPosts(posts, 'date');
    expect(sorted[0].id).toBe('b');
    expect(sorted[1].id).toBe('c');
    expect(sorted[2].id).toBe('a');
  });

  it('sortPosts置顶文章排在最前', function() {
    var posts = [
      { id: 'a', createdAt: 100, pinned: false },
      { id: 'b', createdAt: 50, pinned: true },
      { id: 'c', createdAt: 200, pinned: false },
    ];
    var sorted = sortPosts(posts, 'date');
    expect(sorted[0].id).toBe('b');
    expect(sorted[1].id).toBe('c');
  });

  it('sortPosts多篇置顶按时间排序', function() {
    var posts = [
      { id: 'a', createdAt: 300, pinned: true },
      { id: 'b', createdAt: 100, pinned: true },
      { id: 'c', createdAt: 200, pinned: false },
    ];
    var sorted = sortPosts(posts, 'date');
    expect(sorted[0].id).toBe('a');
    expect(sorted[1].id).toBe('b');
  });

  it('sortPosts不修改原数组', function() {
    var posts = [
      { id: 'a', createdAt: 100, pinned: false },
      { id: 'b', createdAt: 300, pinned: false },
    ];
    sortPosts(posts, 'date');
    expect(posts[0].id).toBe('a');
  });
});

describe('Blog Advanced: 标签筛选', function() {
  it('静态文章包含所有预设标签', function() {
    var allPosts = getAllPosts();
    var tags = {};
    allPosts.forEach(function(p) {
      p.tags.forEach(function(t) { tags[t] = true; });
    });
    expect(tags['tech']).toBeTruthy();
    expect(tags['life']).toBeTruthy();
    expect(tags['ai']).toBeTruthy();
    expect(tags['design']).toBeTruthy();
  });

  it('getAllPosts返回数组', function() {
    var posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });
});

describe('Blog Advanced: 置顶字段', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('新文章默认不置顶', function() {
    savePosts([{
      id: 'new-post',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
      pinned: false,
    }]);
    var posts = getPosts();
    expect(posts[0].pinned).toBe(false);
  });

  it('可以设置文章置顶', function() {
    savePosts([{
      id: 'pin-post',
      title: '置顶文章',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
      pinned: true,
    }]);
    var posts = getPosts();
    expect(posts[0].pinned).toBe(true);
  });
});
