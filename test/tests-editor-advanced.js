describe('Editor Advanced: Markdown工具栏', function() {
  it('insertMd插入粗体', function() {
    var ta = document.createElement('textarea');
    ta.value = 'text';
    ta.selectionStart = 0;
    ta.selectionEnd = 4;
    document.body.appendChild(ta);
    insertMd.call(null, '**', '**');
    expect(ta.value).toContain('**text**');
    document.body.removeChild(ta);
  });

  it('insertMd无选中文本时插入占位符', function() {
    var ta = document.createElement('textarea');
    ta.value = '';
    ta.selectionStart = 0;
    ta.selectionEnd = 0;
    document.body.appendChild(ta);
    insertMd.call(null, '**', '**');
    expect(ta.value).toContain('**');
    document.body.removeChild(ta);
  });

  it('insertLine插入标题前缀', function() {
    var ta = document.createElement('textarea');
    ta.value = 'text';
    ta.selectionStart = 0;
    ta.selectionEnd = 0;
    document.body.appendChild(ta);
    insertLine.call(null, '# ');
    expect(ta.value).toContain('# ');
    document.body.removeChild(ta);
  });

  it('insertCode插入代码块', function() {
    var ta = document.createElement('textarea');
    ta.value = '';
    ta.selectionStart = 0;
    ta.selectionEnd = 0;
    document.body.appendChild(ta);
    insertCode.call(null);
    expect(ta.value).toContain('```');
    document.body.removeChild(ta);
  });

  it('insertLink插入链接', function() {
    var ta = document.createElement('textarea');
    ta.value = '';
    ta.selectionStart = 0;
    ta.selectionEnd = 0;
    document.body.appendChild(ta);
    insertLink.call(null);
    expect(ta.value).toContain('[');
    expect(ta.value).toContain(']');
    expect(ta.value).toContain('(');
    document.body.removeChild(ta);
  });
});

describe('Editor Advanced: marked.js集成', function() {
  it('marked对象存在', function() {
    expect(typeof marked).toBe('object');
  });

  it('marked.parse解析标题', function() {
    var result = marked.parse('# Hello');
    expect(result).toContain('<h1>');
    expect(result).toContain('Hello');
  });

  it('marked.parse解析粗体', function() {
    var result = marked.parse('**bold**');
    expect(result).toContain('<strong>');
    expect(result).toContain('bold');
  });

  it('marked.parse解析代码块', function() {
    var result = marked.parse('```js\nconsole.log(1)\n```');
    expect(result).toContain('<pre>');
    expect(result).toContain('console.log(1)');
  });

  it('marked.parse解析列表', function() {
    var result = marked.parse('- item1\n- item2');
    expect(result).toContain('<li>');
    expect(result).toContain('<ul>');
  });

  it('marked.parse解析链接', function() {
    var result = marked.parse('[link](http://example.com)');
    expect(result).toContain('href="http://example.com"');
  });

  it('marked.parse空输入不崩溃', function() {
    marked.parse('');
    marked.parse(null);
    marked.parse(undefined);
    expect(true).toBe(true);
  });
});

describe('Editor Advanced: 分屏模式', function() {
  it('splitContainer存在', function() {
    var el = document.getElementById('splitContainer');
    expect(!!el).toBe(true);
  });

  it('editorPane存在', function() {
    var el = document.getElementById('editorPane');
    expect(!!el).toBe(true);
  });

  it('previewPane存在', function() {
    var el = document.getElementById('previewPane');
    expect(!!el).toBe(true);
  });
});

describe('Editor Advanced: 高亮.js集成', function() {
  it('hljs对象存在', function() {
    expect(typeof hljs).toBe('object');
  });

  it('hljs.highlightElement是函数', function() {
    expect(typeof hljs.highlightElement).toBe('function');
  });
});

describe('Editor Advanced: 图片处理', function() {
  it('handleImageFile是函数', function() {
    expect(typeof handleImageFile).toBe('function');
  });

  it('dropOverlay存在', function() {
    var el = document.getElementById('dropOverlay');
    expect(!!el).toBe(true);
  });
});

describe('Editor Advanced: 预览更新', function() {
  it('updatePreview是函数', function() {
    expect(typeof updatePreview).toBe('function');
  });

  it('previewArea存在', function() {
    var el = document.getElementById('previewArea');
    expect(!!el).toBe(true);
  });
});
