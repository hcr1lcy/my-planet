describe('Admin: 文章管理', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('空列表渲染不崩溃', function() {
    savePosts([]);
    var posts = getPosts();
    expect(posts.length).toBe(0);
  });

  it('添加文章', function() {
    var posts = getPosts();
    posts.push({
      id: 'admin-test-1',
      title: '管理测试',
      content: '内容',
      tags: ['tech'],
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    });
    savePosts(posts);
    expect(getPosts().length).toBe(1);
  });

  it('删除文章', function() {
    savePosts([
      { id: 'del-1', title: 'A', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] },
      { id: 'del-2', title: 'B', content: '', status: 'draft', createdAt: 2, updatedAt: 2, comments: [] }
    ]);
    var posts = getPosts().filter(function(p) { return p.id !== 'del-1'; });
    savePosts(posts);
    expect(getPosts().length).toBe(1);
    expect(getPosts()[0].id).toBe('del-2');
  });

  it('统计已发布和草稿数量', function() {
    savePosts([
      { id: 's1', title: 'A', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] },
      { id: 's2', title: 'B', content: '', status: 'published', createdAt: 2, updatedAt: 2, comments: [] },
      { id: 's3', title: 'C', content: '', status: 'draft', createdAt: 3, updatedAt: 3, comments: [] }
    ]);
    var posts = getPosts();
    var published = posts.filter(function(p) { return p.status === 'published'; }).length;
    var drafts = posts.filter(function(p) { return p.status === 'draft'; }).length;
    expect(published).toBe(2);
    expect(drafts).toBe(1);
  });
});

describe('Admin: 数据导出', function() {
  it('exportAll返回JSON字符串', function() {
    var json = Storage.exportAll();
    expect(typeof json).toBe('string');
    var data = JSON.parse(json);
    expect(typeof data).toBe('object');
  });

  it('导出包含planet_posts', function() {
    savePosts([{ id: 'export-test', title: '导出测试', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }]);
    var json = Storage.exportAll();
    var data = JSON.parse(json);
    expect(!!data.planet_posts).toBe(true);
  });

  it('导出包含_exportTime', function() {
    var json = Storage.exportAll();
    var data = JSON.parse(json);
    expect(!!data._exportTime).toBe(true);
  });
});

describe('Admin: 数据导入', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('导入有效JSON', function() {
    var data = { planet_posts: '[{"id":"import-1","title":"导入测试"}]' };
    var result = Storage.importData(JSON.stringify(data));
    expect(result.success).toBe(true);
    expect(result.imported).toBe(1);
  });

  it('导入无效JSON', function() {
    var result = Storage.importData('not valid json');
    expect(result.success).toBe(false);
  });

  it('导入空对象', function() {
    var result = Storage.importData('{}');
    expect(result.success).toBe(true);
    expect(result.imported).toBe(0);
  });

  it('导入后数据可读取', function() {
    var data = { planet_posts: '[{"id":"verify","title":"验证"}]' };
    Storage.importData(JSON.stringify(data));
    var posts = getPosts();
    expect(posts.length).toBe(1);
    expect(posts[0].id).toBe('verify');
  });
});

describe('Admin: 自动备份', function() {
  it('autoBackup写入备份', function() {
    savePosts([{ id: 'backup-test', title: '备份', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }]);
    Storage.autoBackup();
    var backup = localStorage.getItem('planet_posts_backup');
    expect(!!backup).toBe(true);
  });

  it('restoreBackup恢复数据', function() {
    savePosts([{ id: 'restore-test', title: '恢复', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }]);
    Storage.autoBackup();
    savePosts([]);
    expect(getPosts().length).toBe(0);
    var restored = Storage.restoreBackup();
    expect(restored).toBe(true);
    expect(getPosts().length).toBe(1);
  });

  it('无备份时restoreBackup返回false', function() {
    localStorage.removeItem('planet_posts_backup');
    var result = Storage.restoreBackup();
    expect(result).toBe(false);
  });
});
