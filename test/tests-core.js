describe('Core: createStarfield', function() {
  it('创建50颗星', function() {
    var container = document.createElement('div');
    createStarfield(container, 50);
    expect(container.children.length).toBe(50);
  });

  it('创建0颗星', function() {
    var container = document.createElement('div');
    createStarfield(container, 0);
    expect(container.children.length).toBe(0);
  });

  it('container为null不崩溃', function() {
    createStarfield(null, 10);
    expect(true).toBe(true);
  });
});

describe('Core: markdownToHtml', function() {
  it('解析H1标题', function() {
    var result = markdownToHtml('# H1');
    expect(result).toContain('<h1>');
    expect(result).toContain('H1');
  });

  it('解析H2标题', function() {
    var result = markdownToHtml('## H2');
    expect(result).toContain('<h2>');
  });

  it('解析H3标题', function() {
    var result = markdownToHtml('### H3');
    expect(result).toContain('<h3>');
  });

  it('解析粗体', function() {
    var result = markdownToHtml('**bold**');
    expect(result).toContain('<strong>bold</strong>');
  });

  it('解析斜体', function() {
    var result = markdownToHtml('*italic*');
    expect(result).toContain('<em>italic</em>');
  });

  it('解析代码块', function() {
    var result = markdownToHtml('```code```');
    expect(result).toContain('<pre><code>code</code></pre>');
  });

  it('解析行内代码', function() {
    var result = markdownToHtml('`code`');
    expect(result).toContain('<code>code</code>');
  });

  it('解析引用', function() {
    var result = markdownToHtml('> quote');
    expect(result).toContain('<blockquote>');
  });

  it('解析列表', function() {
    var result = markdownToHtml('- item1\n- item2');
    expect(result).toContain('<li>');
    expect(result).toContain('<ul>');
  });

  it('解析分隔线', function() {
    var result = markdownToHtml('---');
    expect(result).toContain('<hr>');
  });

  it('解析链接', function() {
    var result = markdownToHtml('[link](http://example.com)');
    expect(result).toContain('href="http://example.com"');
  });

  it('空输入不抛异常', function() {
    markdownToHtml('');
    markdownToHtml(null);
    markdownToHtml(undefined);
    expect(true).toBe(true);
  });

  it('HTML实体转义', function() {
    var result = markdownToHtml('<script>alert(1)</script>');
    expect(result).toContain('&lt;script&gt;');
  });
});

describe('Core: escapeHtml', function() {
  it('转义HTML标签', function() {
    var result = escapeHtml('<script>alert(1)</script>');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });

  it('普通文本不变', function() {
    var result = escapeHtml('hello world');
    expect(result).toBe('hello world');
  });

  it('转义引号', function() {
    var result = escapeHtml('"test"');
    expect(result).toContain('&quot;');
  });
});

describe('Core: formatDate / formatDateTime', function() {
  it('formatDate返回有效日期', function() {
    var result = formatDate(1718150400000);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formatDateTime返回有效日期时间', function() {
    var result = formatDateTime(1718150400000);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('Core: getPosts / savePosts', function() {
  it('getPosts返回数组', function() {
    localStorage.removeItem('planet_posts');
    var result = getPosts();
    expect(Array.isArray(result)).toBe(true);
  });

  it('savePosts写入后getPosts返回正确数据', function() {
    savePosts([{ id: 'test', title: 'Test' }]);
    var result = getPosts();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('test');
  });

  it('savePosts(null)不崩溃', function() {
    savePosts(null);
    expect(true).toBe(true);
  });

  it('savePosts返回true', function() {
    var result = savePosts([]);
    expect(result).toBe(true);
  });
});

describe('Core: generateId', function() {
  it('生成唯一ID', function() {
    var id1 = generateId();
    var id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('返回字符串', function() {
    var id = generateId();
    expect(typeof id).toBe('string');
  });
});

describe('Core: loadCustomBg', function() {
  it('无背景时不崩溃', function() {
    localStorage.removeItem('planet_bg');
    loadCustomBg();
    expect(true).toBe(true);
  });

  it('有背景时设置starfield样式', function() {
    var container = document.createElement('div');
    container.id = 'starfield';
    document.body.appendChild(container);
    localStorage.setItem('planet_bg', 'http://example.com/bg.jpg');
    loadCustomBg();
    var style = container.getAttribute('style');
    expect(style).toContain('example.com/bg.jpg');
    document.body.removeChild(container);
    localStorage.removeItem('planet_bg');
  });
});

describe('Core: Auth', function() {
  it('isSetup返回布尔值', function() {
    var result = Auth.isSetup();
    expect(typeof result).toBe('boolean');
  });

  it('requireAuth返回有效状态', function() {
    var result = Auth.requireAuth();
    expect(result === 'setup' || result === 'authenticated' || result === 'unauthenticated').toBe(true);
  });
});

describe('Core: Storage', function() {
  it('exportAll返回JSON字符串', function() {
    var result = Storage.exportAll();
    expect(typeof result).toBe('string');
    var parsed = JSON.parse(result);
    expect(typeof parsed).toBe('object');
  });

  it('importData处理无效JSON', function() {
    var result = Storage.importData('not json');
    expect(result.success).toBe(false);
  });

  it('importData处理空对象', function() {
    var result = Storage.importData('{}');
    expect(result.success).toBe(true);
    expect(result.imported).toBe(0);
  });

  it('autoBackup不崩溃', function() {
    Storage.autoBackup();
    expect(true).toBe(true);
  });
});
