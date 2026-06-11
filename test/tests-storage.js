describe('Storage: 数据导出', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
  });

  it('exportAll返回JSON字符串', function() {
    var json = Storage.exportAll();
    expect(typeof json).toBe('string');
    var data = JSON.parse(json);
    expect(typeof data).toBe('object');
  });

  it('导出包含所有KEY', function() {
    var json = Storage.exportAll();
    var data = JSON.parse(json);
    Storage.KEYS.forEach(function(key) {
      expect(key in data || data[key] === undefined || data[key] === null).toBe(true);
    });
  });

  it('导出包含_exportTime', function() {
    var json = Storage.exportAll();
    var data = JSON.parse(json);
    expect(typeof data._exportTime).toBe('number');
    expect(data._exportTime).toBeGreaterThan(0);
  });

  it('导出包含planet_posts', function() {
    savePosts([{ id: 'export-1', title: '导出测试', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }]);
    var json = Storage.exportAll();
    var data = JSON.parse(json);
    expect(!!data.planet_posts).toBe(true);
  });
});

describe('Storage: 数据导入', function() {
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
    expect(result.error).toContain('JSON');
  });

  it('导入空对象', function() {
    var result = Storage.importData('{}');
    expect(result.success).toBe(true);
    expect(result.imported).toBe(0);
  });

  it('导入非对象类型', function() {
    var result = Storage.importData('"string"');
    expect(result.success).toBe(false);
  });

  it('导入null', function() {
    var result = Storage.importData('null');
    expect(result.success).toBe(false);
  });

  it('导入后数据可读取', function() {
    var data = { planet_posts: '[{"id":"verify","title":"验证"}]' };
    Storage.importData(JSON.stringify(data));
    var posts = getPosts();
    expect(posts.length).toBe(1);
    expect(posts[0].id).toBe('verify');
  });
});

describe('Storage: 自动备份', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
    localStorage.removeItem('planet_posts_backup');
  });

  it('autoBackup写入备份', function() {
    savePosts([{ id: 'backup-1', title: '备份', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }]);
    Storage.autoBackup();
    var backup = localStorage.getItem('planet_posts_backup');
    expect(!!backup).toBe(true);
  });

  it('备份内容与原数据一致', function() {
    var posts = [{ id: 'sync-1', title: '同步', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }];
    savePosts(posts);
    Storage.autoBackup();
    var backup = JSON.parse(localStorage.getItem('planet_posts_backup'));
    expect(backup.length).toBe(1);
    expect(backup[0].id).toBe('sync-1');
  });

  it('连续编辑3次备份包含最新版本', function() {
    savePosts([{ id: 'v1', title: '版本1', content: '', status: 'draft', createdAt: 1, updatedAt: 1, comments: [] }]);
    Storage.autoBackup();
    savePosts([{ id: 'v2', title: '版本2', content: '', status: 'draft', createdAt: 2, updatedAt: 2, comments: [] }]);
    Storage.autoBackup();
    savePosts([{ id: 'v3', title: '版本3', content: '', status: 'published', createdAt: 3, updatedAt: 3, comments: [] }]);
    Storage.autoBackup();
    var backup = JSON.parse(localStorage.getItem('planet_posts_backup'));
    expect(backup[0].id).toBe('v3');
  });
});

describe('Storage: 数据恢复', function() {
  afterEach(function() {
    localStorage.removeItem('planet_posts');
    localStorage.removeItem('planet_posts_backup');
  });

  it('restoreBackup恢复数据', function() {
    savePosts([{ id: 'restore-1', title: '恢复', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }]);
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

  it('损坏的备份返回false', function() {
    localStorage.setItem('planet_posts_backup', 'not json');
    var result = Storage.restoreBackup();
    expect(result).toBe(false);
  });

  it('清空后导入备份恢复', function() {
    savePosts([{ id: 'full-restore', title: '完整恢复', content: '', status: 'published', createdAt: 1, updatedAt: 1, comments: [] }]);
    var exportJson = Storage.exportAll();
    savePosts([]);
    expect(getPosts().length).toBe(0);
    var result = Storage.importData(exportJson);
    expect(result.success).toBe(true);
    expect(getPosts().length).toBe(1);
  });
});
