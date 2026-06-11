describe('Editor: 文章创建', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('生成唯一ID', function() {
    var id1 = generateId();
    var id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('创建文章并保存', function() {
    var posts = getPosts();
    var newPost = {
      id: generateId(),
      title: '编辑器测试',
      content: '# 标题\n\n正文',
      tags: ['tech'],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    };
    posts.push(newPost);
    savePosts(posts);
    expect(getPosts().length).toBe(1);
    expect(getPosts()[0].title).toBe('编辑器测试');
  });

  it('保存草稿', function() {
    var posts = getPosts();
    posts.push({
      id: generateId(),
      title: '草稿测试',
      content: '草稿内容',
      tags: [],
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    });
    savePosts(posts);
    var saved = getPosts();
    expect(saved[0].status).toBe('draft');
  });
});

describe('Editor: 文章编辑', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('更新文章标题', function() {
    savePosts([{
      id: 'edit-1',
      title: '原标题',
      content: '内容',
      tags: ['tech'],
      status: 'published',
      createdAt: 1,
      updatedAt: 1,
      comments: []
    }]);
    var posts = getPosts();
    posts[0].title = '新标题';
    posts[0].updatedAt = Date.now();
    savePosts(posts);
    expect(getPosts()[0].title).toBe('新标题');
  });

  it('更新文章内容', function() {
    savePosts([{
      id: 'edit-2',
      title: '标题',
      content: '原内容',
      tags: [],
      status: 'published',
      createdAt: 1,
      updatedAt: 1,
      comments: []
    }]);
    var posts = getPosts();
    posts[0].content = '# 新内容\n\n更新了';
    savePosts(posts);
    expect(getPosts()[0].content).toContain('新内容');
  });

  it('更新文章标签', function() {
    savePosts([{
      id: 'edit-3',
      title: '标题',
      content: '内容',
      tags: ['tech'],
      status: 'published',
      createdAt: 1,
      updatedAt: 1,
      comments: []
    }]);
    var posts = getPosts();
    posts[0].tags = ['tech', 'life', 'design'];
    savePosts(posts);
    expect(getPosts()[0].tags.length).toBe(3);
  });

  it('更新文章状态', function() {
    savePosts([{
      id: 'edit-4',
      title: '标题',
      content: '内容',
      tags: [],
      status: 'draft',
      createdAt: 1,
      updatedAt: 1,
      comments: []
    }]);
    var posts = getPosts();
    posts[0].status = 'published';
    savePosts(posts);
    expect(getPosts()[0].status).toBe('published');
  });
});

describe('Editor: Markdown预览', function() {
  it('标题语法', function() {
    var result = markdownToHtml('# H1');
    expect(result).toContain('<h1>');
  });

  it('粗体语法', function() {
    var result = markdownToHtml('**bold**');
    expect(result).toContain('<strong>bold</strong>');
  });

  it('代码块语法', function() {
    var result = markdownToHtml('```js\ncode\n```');
    expect(result).toContain('<pre>');
    expect(result).toContain('<code>');
  });

  it('链接语法', function() {
    var result = markdownToHtml('[text](http://example.com)');
    expect(result).toContain('href="http://example.com"');
  });

  it('列表语法', function() {
    var result = markdownToHtml('- item1\n- item2');
    expect(result).toContain('<li>');
    expect(result).toContain('<ul>');
  });

  it('引用语法', function() {
    var result = markdownToHtml('> quote');
    expect(result).toContain('<blockquote>');
  });

  it('空内容不崩溃', function() {
    markdownToHtml('');
    markdownToHtml(null);
    markdownToHtml(undefined);
    expect(true).toBe(true);
  });
});

describe('Editor: 自动备份', function() {
  it('保存后触发备份', function() {
    savePosts([{
      id: 'backup-test',
      title: '测试',
      content: '内容',
      tags: [],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    }]);
    Storage.autoBackup();
    var backup = localStorage.getItem('planet_posts_backup');
    expect(!!backup).toBe(true);
  });
});
