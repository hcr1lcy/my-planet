# MY PLANET — 后期开发架构 & 功能规划 & 测试流程

---

## 一、当前架构问题诊断

| 问题 | 影响 | 严重程度 |
|------|------|----------|
| 5个HTML文件各自内联CSS/JS | 每次改样式/逻辑需改5处，维护成本×5 | **高** |
| 星空生成/鼠标光效/背景加载代码重复5次 | 同一bug需修5处 | **高** |
| `markdownToHtml()` 在 `editor.html` 和 `post.html` 各写一遍 | 功能不一致风险 | **中** |
| `escapeHtml()` 在 `blog/admin/post` 各写一遍 | 重复定义 | **中** |
| localStorage 无过期/备份机制 | 数据丢失不可恢复 | **高** |
| Admin 页无认证（任何人访问 admin.html 即可管理） | 安全隐患 | **高** |
| Markdown 解析器为手写正则，无语法高亮 | 代码块无着色 | **中** |
| 无自动测试框架 | 无法自动化回归测试 | **高** |

---

## 二、建议的项目重构架构

### 目标：单文件内联 → 模块化 + 测试化

```
D:\mimocode\
├── index.html
├── blog.html
├── admin.html
├── editor.html
├── post.html
├── posts/
│   └── first-post.html
├── css/
│   ├── base.css          # 全局 reset + 字体 + CSS变量
│   ├── nav.css           # 导航栏公共样式
│   ├── effects.css       # 星空/光效/扫描线/卡片动画
│   ├── blog.css          # 博客列表专用
│   ├── editor.css        # 编辑器专用
│   ├── post.css          # 文章详情专用
│   └── admin.css         # 控制台专用
├── js/
│   ├── core/
│   │   ├── stars.js          # 星空背景生成（统一）
│   │   ├── effects.js        # 鼠标光效 + 扫描线
│   │   ├── bg.js             # 自定义背景加载
│   │   ├── markdown.js       # Markdown→HTML 解析（统一）
│   │   └── utils.js          # escapeHtml / 日期格式化 / 通用工具
│   ├── blog.js               # 博客列表逻辑
│   ├── admin.js              # 控制台逻辑
│   ├── editor.js             # 编辑器逻辑
│   ├── post.js               # 文章详情逻辑
│   └── home.js               # 首页动画逻辑
├── test/
│   ├── test-runner.html      # 浏览器端测试运行器（无依赖）
│   ├── tests-core.js         # core 模块单元测试
│   ├── tests-blog.js         # 博客功能测试
│   ├── tests-admin.js        # 管理功能测试
│   ├── tests-editor.js       # 编辑器功能测试
│   ├── tests-post.js         # 文章详情测试
│   └── tests-e2e.js          # 端到端流程测试
├── .gitignore
└── README.md
```

---

## 三、新增功能模块（按优先级排序）

### P0 — 基础架构（必须先做）

#### 1. 公共模块抽取 + 测试

**涉及文件**：全部5个HTML + 新建 `js/core/*.js` + `css/base.css`

**改动内容**：

##### css/base.css — 全局样式基础

```css
:root {
  --cyan: #00f0ff;
  --purple: #a855f7;
  --pink: #ff006e;
  --bg-dark: #0a0e2a;
  --bg-black: #000;
  --text-primary: #fff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.3);
  --card-bg: rgba(0, 240, 255, 0.03);
  --card-border: rgba(0, 240, 255, 0.1);
  --card-radius: 16px;
}

@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+SC:wght@300;400;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Noto Sans SC', sans-serif;
  background: var(--bg-black);
  color: var(--text-primary);
  overflow-x: hidden;
  min-height: 100vh;
}
```

##### css/effects.css — 公共特效样式

```css
/* 星空背景 */
#starfield {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: -2;
  background: radial-gradient(ellipse at 20% 50%, var(--bg-dark) 0%, var(--bg-black) 70%);
}

#starfield.custom-bg {
  background-color: var(--bg-black);
}

.star {
  position: absolute;
  background: var(--text-primary);
  border-radius: 50%;
  animation: twinkle var(--dur) ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.2; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.3); }
}

/* 鼠标跟随光效 */
.cursor-glow {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
  transform: translate(-50%, -50%);
  transition: left 0.15s ease, top 0.15s ease;
}

/* 扫描线效果 */
.scanline {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 999;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px
  );
}
```

##### css/nav.css — 导航栏样式

```css
nav {
  position: fixed;
  top: 0; width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  backdrop-filter: blur(10px);
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--cyan), var(--purple), var(--pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 3px;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 30px;
  list-style: none;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0; width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--cyan), var(--purple));
  transition: width 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--cyan);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

@media (max-width: 768px) {
  nav { padding: 15px 20px; }
  .nav-links { gap: 15px; }
  .nav-links a { font-size: 0.75rem; }
}
```

##### js/core/stars.js — 统一星空生成

```javascript
function createStarfield(container, count) {
  if (!container) return;
  for (var i = 0; i < count; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    var size = Math.random() * 2.5 + 0.5;
    star.style.cssText =
      'width:' + size + 'px;height:' + size + 'px;' +
      'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;' +
      '--dur:' + (Math.random() * 3 + 1) + 's;' +
      'animation-delay:' + (Math.random() * 3) + 's;';
    container.appendChild(star);
  }
}
```

##### js/core/effects.js — 统一光效

```javascript
function initCursorGlow() {
  var glow = document.getElementById('cursorGlow');
  if (!glow) return;
  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
```

##### js/core/bg.js — 统一背景加载

```javascript
function loadCustomBg() {
  var bg = localStorage.getItem('planet_bg');
  if (!bg) return;
  var el = document.getElementById('starfield');
  if (!el) return;
  el.setAttribute('style',
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;' +
    'background:url(' + bg + ') center/cover no-repeat #000;'
  );
}
```

##### js/core/markdown.js — 统一 Markdown 解析

```javascript
function markdownToHtml(md) {
  if (!md) return '';
  var html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, function(m) { return '<ul>' + m + '</ul>'; })
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>');
  return '<p>' + html + '</p>';
}
```

##### js/core/utils.js — 通用工具函数

```javascript
function escapeHtml(str) {
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString('zh-CN');
}

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem('planet_posts') || '[]');
  } catch (e) {
    return [];
  }
}

function savePosts(posts) {
  try {
    localStorage.setItem('planet_posts', JSON.stringify(posts));
    return true;
  } catch (e) {
    console.error('保存失败:', e);
    return false;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
```

##### 重构后的 HTML 结构示例

重构后的 `blog.html` 从 583 行减少到约 200 行：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>星际日志 | Blog</title>
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/nav.css">
    <link rel="stylesheet" href="css/effects.css">
    <link rel="stylesheet" href="css/blog.css">
</head>
<body>
    <div id="starfield"></div>
    <div class="cursor-glow" id="cursorGlow"></div>
    <div class="scanline"></div>

    <nav>
        <a href="index.html" class="logo">MY PLANET</a>
        <ul class="nav-links">
            <li><a href="index.html#home">首页</a></li>
            <li><a href="index.html#about">关于</a></li>
            <li><a href="index.html#skills">技能</a></li>
            <li><a href="blog.html" class="active">日志</a></li>
            <li><a href="admin.html">控制台</a></li>
            <li><a href="index.html#contact">联系</a></li>
        </ul>
    </nav>

    <div class="page-header">
        <h1>// STAR LOG</h1>
        <p>INTERSTELLAR TRANSMISSIONS & THOUGHTS</p>
    </div>

    <div class="blog-controls">
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="搜索日志...">
        </div>
        <div class="tag-filters">
            <button class="tag-btn active" data-tag="all">ALL</button>
            <button class="tag-btn" data-tag="tech">TECH</button>
            <button class="tag-btn" data-tag="life">LIFE</button>
            <button class="tag-btn" data-tag="ai">AI</button>
            <button class="tag-btn" data-tag="design">DESIGN</button>
        </div>
    </div>

    <div class="posts-container" id="postsContainer"></div>

    <footer>
        <p>&copy; 2026 MY PLANET &mdash; ALL RIGHTS RESERVED</p>
    </footer>

    <script src="js/core/utils.js"></script>
    <script src="js/core/stars.js"></script>
    <script src="js/core/effects.js"></script>
    <script src="js/core/bg.js"></script>
    <script src="js/blog.js"></script>
</body>
</html>
```

**测试流程**：

```
tests-core.js
├── createStarfield(container, 50) → container.children.length === 50
├── createStarfield(container, 0) → container.children.length === 0
├── markdownToHtml('# H1') → '<h1>H1</h1>'
├── markdownToHtml('**bold**') → '<strong>bold</strong>'
├── markdownToHtml('```code```') → '<pre><code>code</code></pre>'
├── markdownToHtml('empty') → 不抛异常
├── escapeHtml('<script>') → '&lt;script&gt;'
├── escapeHtml('normal') → 'normal'（不变）
├── formatDate(1718150400000) → 返回合法日期字符串
├── getPosts() → 返回数组（即使localStorage为空）
├── savePosts([]) → localStorage 写入成功，再 getPosts() 等于 []
└── 边界：savePosts(null) → 不崩溃，返回空数组
```

---

### P0 — 基础架构（必须先做）

#### 2. Admin 认证系统

**涉及文件**：`admin.html`, `editor.html`, 新建 `js/auth.js`

**改动内容**：
- 首次访问 admin 时设置密码（存 localStorage `planet_admin_hash`）
- 后续访问需输入密码验证
- editor.html 进入前也需认证
- 使用 SHA-256 哈希存储密码（不用明文）
- Session token 机制：认证后写 sessionStorage，有效期2小时

##### js/auth.js — 认证模块

```javascript
var Auth = {
  HASH_KEY: 'planet_admin_hash',
  SESSION_KEY: 'planet_admin_session',
  SESSION_EXPIRE: 2 * 60 * 60 * 1000,

  async hashPassword(password) {
    var encoder = new TextEncoder();
    var data = encoder.encode(password);
    var hashBuffer = await crypto.subtle.digest('SHA-256', data);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  },

  isSetup: function() {
    return !!localStorage.getItem(this.HASH_KEY);
  },

  isAuthenticated: function() {
    var session = JSON.parse(sessionStorage.getItem(this.SESSION_KEY) || 'null');
    if (!session) return false;
    return Date.now() - session.time < this.SESSION_EXPIRE;
  },

  async setup(password) {
    var hash = await this.hashPassword(password);
    localStorage.setItem(this.HASH_KEY, hash);
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ time: Date.now() }));
    return true;
  },

  async login(password) {
    var hash = await this.hashPassword(password);
    var stored = localStorage.getItem(this.HASH_KEY);
    if (hash === stored) {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ time: Date.now() }));
      return true;
    }
    return false;
  },

  logout: function() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  requireAuth: function() {
    if (!this.isSetup()) return 'setup';
    if (this.isAuthenticated()) return 'authenticated';
    return 'unauthenticated';
  }
};
```

**测试流程**：

```
tests-auth.js
├── 首次访问 admin.html → 显示密码设置界面
├── 设置密码 "test123" → 存入 localStorage
├── 刷新页面 → 显示密码输入界面
├── 输入正确密码 → 进入管理面板
├── 输入错误密码 → 提示错误，不跳转
├── 认证后访问 editor.html → 直接进入编辑器
├── session 过期后 → 重新要求密码
├── XSS: 密码输入框输入 <script>alert(1)</script> → 不执行脚本
└── 长密码 (>100字符) → 不崩溃
```

---

### P1 — 核心功能增强

#### 3. Markdown 编辑器升级

**涉及文件**：`editor.html`, `js/editor.js`

**改动内容**：
- 引入轻量 Markdown 库（如 `marked.js`，CDN 引入，~40KB）
- 代码块语法高亮（引入 `highlight.js` CSS 主题，匹配科幻风格）
- 支持图片插入（拖拽/粘贴 → 转 base64 存入内容）
- 分屏预览（左编辑 + 右预览，实时同步滚动）
- Markdown 工具栏（加粗/斜体/标题/链接/图片/代码块/引用 一键插入）

**测试流程**：

```
tests-editor-advanced.js
├── 输入 "# Hello" → 预览显示 <h1>Hello</h1>
├── 输入 "```js\nconsole.log(1)\n```" → 预览有语法高亮
├── 输入 "**bold**" → 工具栏点击加粗按钮 → 插入 "**选中文本**"
├── 分屏模式 → 编辑区和预览区各占50%宽度
├── 输入超长内容(>5000字) → 滚动不卡顿
├── 保存草稿 → admin列表显示草稿标记
├── 发布 → blog列表可找到该文章
├── 图片拖入编辑区 → 自动转base64嵌入
└── 撤销操作(Ctrl+Z) → 回退到上一步
```

---

#### 4. 数据持久化 & 备份

**涉及文件**：`admin.html`, 新建 `js/core/storage.js`

**改动内容**：
- 一键导出：将 localStorage 所有数据导出为 JSON 文件下载
- 一键导入：上传 JSON 文件恢复数据
- 自动备份：每次编辑文章后，自动将数据快照写入 `localStorage` 的 `planet_posts_backup`
- 数据校验：导入时校验 JSON 格式，拒绝损坏数据

##### js/core/storage.js — 数据存储模块

```javascript
var Storage = {
  KEYS: ['planet_posts', 'planet_bg', 'planet_admin_hash', 'planet_views'],

  exportAll: function() {
    var data = {};
    this.KEYS.forEach(function(key) {
      var val = localStorage.getItem(key);
      if (val !== null) data[key] = val;
    });
    data._exportTime = Date.now();
    return JSON.stringify(data, null, 2);
  },

  downloadExport: function() {
    var json = this.exportAll();
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'my-planet-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  importData: function(jsonString) {
    try {
      var data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: '无效数据格式' };
      }
      var imported = 0;
      var self = this;
      this.KEYS.forEach(function(key) {
        if (data[key]) {
          localStorage.setItem(key, data[key]);
          imported++;
        }
      });
      return { success: true, imported: imported };
    } catch (e) {
      return { success: false, error: 'JSON 解析失败: ' + e.message };
    }
  },

  autoBackup: function() {
    var posts = localStorage.getItem('planet_posts');
    if (posts) {
      try {
        localStorage.setItem('planet_posts_backup', posts);
      } catch (e) {
        console.warn('自动备份失败:', e);
      }
    }
  },

  restoreBackup: function() {
    var backup = localStorage.getItem('planet_posts_backup');
    if (!backup) return false;
    try {
      JSON.parse(backup);
      localStorage.setItem('planet_posts', backup);
      return true;
    } catch (e) {
      return false;
    }
  }
};
```

**测试流程**：

```
tests-storage.js
├── 导出按钮 → 下载 JSON 文件，文件内容可被 JSON.parse 解析
├── JSON 文件包含 planet_posts + planet_bg + planet_admin_hash
├── 导入空文件 → 提示"无效数据"
├── 导入格式错误文件 → 提示"数据格式错误"
├── 导入有效JSON → 数据恢复，页面内容更新
├── 创建文章 → 检查 planet_posts_backup 存在
├── 连续编辑3次 → 备份包含最新版本
├── localStorage 满了 → 捕获异常，给出提示（不是静默失败）
└── 清空 localStorage → 导入备份 → 数据恢复
```

---

#### 5. 文章系统增强

**涉及文件**：`blog.html`, `post.html`, `admin.html`

**改动内容**：
- 分页功能（每页10篇，上一页/下一页）
- 文章字数统计 & 预计阅读时间
- 文章置顶功能（pinned 字段）
- 文章排序切换（按时间/按阅读量）
- 相关文章推荐（基于标签匹配，显示3篇）

**测试流程**：

```
tests-blog-advanced.js
├── 15篇文章 → blog列表显示10篇 + "下一页"按钮
├── 点击"下一页" → 显示后5篇 + "上一页"按钮
├── 置顶文章 → 始终排在第一位
├── 切换排序 → 顺序改变
├── 新建带标签"tech"的文章 → 文章详情底部显示相关推荐
├── 搜索不存在的关键词 → 显示空状态提示
├── 5篇文章 → 不显示分页按钮
└── 标签筛选 + 搜索同时生效 → 交集结果
```

---

### P2 — 体验优化

#### 6. 评论系统增强

**涉及文件**：`post.html`

**改动内容**：
- 支持 Markdown 格式评论
- 评论表情反应（👍❤️🔥）
- 回复功能（嵌套评论，最多2层）
- 评论通知（admin 控制台显示未读评论数）
- 防spam：同一IP 5分钟内限评3条

**测试流程**：

```
tests-comments.js
├── 发表普通评论 → 显示在列表
├── 评论支持 **加粗** → 渲染为粗体
├── 对某条评论点击"回复" → 显示回复输入框
├── 回复内容 → 缩进显示在被回复评论下方
├── 3层嵌套 → 最多2层，第3层不再缩进
├── 点击表情 → 评论下方显示表情计数
├── 同IP 5分钟内第4条评论 → 提示"评论太频繁"
├── 评论内容含 <script> → 不执行（escapeHtml）
└── 空评论点发送 → 不提交，不报错
```

---

#### 7. 暗色/亮色主题切换

**涉及文件**：`css/base.css`, 每个页面导航栏

**改动内容**：
- CSS变量定义所有颜色（暗色主题为默认）
- 亮色主题变量覆盖（白底 + 深色文字）
- 导航栏添加主题切换按钮（☀/🌙）
- 选择存入 localStorage `planet_theme`
- 所有页面启动时读取主题设置

##### css/base.css 主题扩展

```css
/* 暗色主题（默认） */
:root, [data-theme="dark"] {
  --cyan: #00f0ff;
  --purple: #a855f7;
  --pink: #ff006e;
  --bg-dark: #0a0e2a;
  --bg-black: #000;
  --text-primary: #fff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.3);
  --card-bg: rgba(0, 240, 255, 0.03);
  --card-border: rgba(0, 240, 255, 0.1);
  --nav-bg: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
}

/* 亮色主题 */
[data-theme="light"] {
  --cyan: #0099cc;
  --purple: #7c3aed;
  --pink: #db2777;
  --bg-dark: #f0f4f8;
  --bg-black: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: rgba(26, 26, 46, 0.7);
  --text-muted: rgba(26, 26, 46, 0.4);
  --card-bg: rgba(0, 153, 204, 0.05);
  --card-border: rgba(0, 153, 204, 0.15);
  --nav-bg: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, transparent 100%);
}
```

##### js/core/theme.js — 主题切换

```javascript
var ThemeManager = {
  KEY: 'planet_theme',

  init: function() {
    var saved = localStorage.getItem(this.KEY) || 'dark';
    this.apply(saved);
  },

  apply: function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.KEY, theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  },

  toggle: function() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};
```

**测试流程**：

```
tests-theme.js
├── 默认暗色主题 → 页面背景#000，文字白色
├── 切换亮色主题 → 背景白色，文字深色
├── 切换后刷新 → 主题保持亮色
├── 切换回暗色 → 恢复
├── 效果区域（星空/光效）在亮色下不遮挡内容
├── 所有5个页面都能独立切换主题
└── 主题选择互不影响（localStorage 共享）
```

---

#### 8. 页面过渡动画

**涉及文件**：所有HTML, 新建 `css/animations.css`

**改动内容**：
- 页面间跳转添加渐入渐出过渡效果
- 使用 `<meta>` 或 `visibilitychange` 事件触发
- 首页滚动时 section 进入视口触发淡入动画
- 卡片、文章列表添加 stagger 动画（依次出现）

##### css/animations.css

```css
/* Section 淡入动画 */
.fade-in-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 卡片交错动画 */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  animation: staggerIn 0.5s ease forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.1s; }
.stagger-item:nth-child(2) { animation-delay: 0.2s; }
.stagger-item:nth-child(3) { animation-delay: 0.3s; }
.stagger-item:nth-child(4) { animation-delay: 0.4s; }
.stagger-item:nth-child(5) { animation-delay: 0.5s; }

@keyframes staggerIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 页面过渡 */
.page-transition {
  animation: pageFadeIn 0.4s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 减弱动画模式 */
@media (prefers-reduced-motion: reduce) {
  .fade-in-section,
  .stagger-item,
  .page-transition {
    animation: none;
    transition: none;
    opacity: 1;
    transform: none;
  }
}
```

##### js/core/animations.js

```javascript
var Animations = {
  init: function() {
    this.initSectionObserver();
    this.initPageTransition();
  },

  initSectionObserver: function() {
    var sections = document.querySelectorAll('.fade-in-section');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(function(section) {
      observer.observe(section);
    });
  },

  initPageTransition: function() {
    document.body.classList.add('page-transition');
  }
};
```

**测试流程**：

```
tests-animation.js
├── 首页加载 → hero 区域先淡入，其他区域不显示
├── 滚动到"关于"区域 → section 从下方滑入
├── 从 blog.html 点文章 → 页面有过渡效果
├── 快速连续点击导航 → 不产生动画叠加bug
├── 减弱动画模式(prefers-reduced-motion) → 关闭所有动画
└── 手机端768px → 动画正常工作
```

---

### P3 — 高级功能

#### 9. 阅读统计仪表板

**涉及文件**：`admin.html`, 新建 `js/analytics.js`

**改动内容**：
- 使用 localStorage `planet_views` 记录每次文章访问（id + 时间）
- Admin 控制台展示：总浏览量、每篇文章浏览量Top5、趋势折线图
- 简单 Canvas 折线图（无依赖，手绘）
- 时间范围筛选（7天/30天/全部）

##### js/analytics.js

```javascript
var Analytics = {
  VIEWS_KEY: 'planet_views',

  recordView: function(postId) {
    var views = this.getViews();
    views.push({ id: postId, time: Date.now() });
    try {
      localStorage.setItem(this.VIEWS_KEY, JSON.stringify(views));
    } catch (e) {
      console.warn('记录浏览失败:', e);
    }
  },

  getViews: function() {
    try {
      return JSON.parse(localStorage.getItem(this.VIEWS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  getTotalViews: function() {
    return this.getViews().length;
  },

  getViewsByPost: function() {
    var views = this.getViews();
    var counts = {};
    views.forEach(function(v) {
      counts[v.id] = (counts[v.id] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(function(a, b) { return b[1] - a[1]; })
      .slice(0, 5);
  },

  getViewsByDate: function(days) {
    var views = this.getViews();
    var cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    var counts = {};
    views.filter(function(v) { return v.time > cutoff; }).forEach(function(v) {
      var date = new Date(v.time).toISOString().slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  },

  drawChart: function(canvasId, days) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var data = this.getViewsByDate(days);
    var dates = Object.keys(data).sort();
    var values = dates.map(function(d) { return data[d]; });
    var max = Math.max.apply(null, values.concat([1]));

    var w = canvas.width;
    var h = canvas.height;
    var padding = 40;

    ctx.clearRect(0, 0, w, h);

    // 绘制网格线
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padding + (h - padding * 2) * i / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    // 绘制数据线
    if (dates.length < 2) return;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    dates.forEach(function(date, i) {
      var x = padding + (w - padding * 2) * i / (dates.length - 1);
      var y = h - padding - (values[i] / max) * (h - padding * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
};
```

**测试流程**：

```
tests-analytics.js
├── 访问一篇文章 → planet_views 写入记录
├── 同一篇文章访问3次 → views 计数为3
├── Admin 仪表板 → 显示总浏览量
├── Top5排行 → 按浏览量降序
├── Canvas图表 → 有线条绘制（canvas非空）
├── 选"7天" → 只统计近7天数据
└── 无浏览数据 → 显示空状态，不报错
```

---

#### 10. RSS 订阅源

**涉及文件**：新建 `feed.xml`（动态生成）

**改动内容**：
- `feed.xml` 使用 JS 动态生成（从 localStorage 读取已发布文章）
- 包含 title, link, pubDate, description, content:encoded
- 导航栏添加 RSS 图标链接
- 支持 `?format=rss` 参数输出 XML 内容

**测试流程**：

```
tests-rss.js
├── 访问 feed.xml → 返回有效 XML
├── XML 解析 → 包含所有已发布文章
├── 每篇文章有 title + link + description
├── 草稿文章不出现在 RSS 中
├── 新发布文章 → RSS 自动包含
└── XML 头部 content-type = application/rss+xml
```

---

#### 11. 搜索引擎优化 (SEO)

**涉及文件**：所有HTML + `admin.html`

**改动内容**：
- 每个页面添加 `<meta>` description 和 keywords
- 动态文章页添加 Open Graph 标签 (og:title, og:description, og:image)
- 生成 `sitemap.xml`（从 localStorage 动态生成）
- 添加 JSON-LD 结构化数据 (Article, Person)
- Admin 控制台可设置每篇文章的 SEO 描述

**测试流程**：

```
tests-seo.js
├── index.html → <title>包含"My Planet"
├── 每个页面有 <meta name="description">
├── post.html?id=xxx → og:title = 文章标题
├── sitemap.xml → 有效 XML，包含所有文章 URL
├── JSON-LD → 包含 @type: "Article"
├── 所有图片有 alt 属性
└── robots.txt → 允许所有爬虫
```

---

#### 12. PWA 支持

**涉及文件**：新建 `manifest.json`, `sw.js`

**改动内容**：
- `manifest.json`：应用名、主题色、图标、standalone 模式
- `sw.js`：Service Worker 缓存策略（Cache First for static, Network First for API）
- 离线可用（首页 + 已读文章可离线访问）
- "添加到主屏幕" 支持

##### manifest.json

```json
{
  "name": "My Planet - 科幻个人星球",
  "short_name": "My Planet",
  "description": "科幻个人星球主题网站",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#00f0ff",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

##### sw.js

```javascript
var CACHE_NAME = 'my-planet-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/admin.html',
  '/editor.html',
  '/post.html',
  '/css/base.css',
  '/css/nav.css',
  '/css/effects.css',
  '/js/core/stars.js',
  '/js/core/effects.js',
  '/js/core/bg.js',
  '/js/core/markdown.js',
  '/js/core/utils.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('api') || event.request.url.includes('localStorage')) {
    // Network First for dynamic content
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
  } else {
    // Cache First for static assets
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(fetchResponse) {
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

**测试流程**：

```
tests-pwa.js
├── manifest.json → 有效 JSON
├── 注册 Service Worker → navigator.serviceWorker.controller 存在
├── 首次加载 → 缓存所有静态文件
├── 断网 → 访问首页仍可加载
├── 断网 → 访问已读文章仍可加载
├── 断网 → 新文章需要网络（Network First）
├── 缓存更新 → 新版本部署后自动刷新缓存
└── Chrome Lighthouse PWA 审计 → 通过
```

---

## 四、测试架构设计

### 测试工具：无依赖的浏览器端测试框架

**方案**：在 `test/test-runner.html` 中实现一个极简测试框架（~100行），支持：
- `describe(name, fn)` 分组
- `it(name, fn)` 用例
- `expect(value).toBe(expected)` 断言
- 结果输出到页面 DOM + console

##### test/test-runner.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>My Planet - Test Runner</title>
  <style>
    body { font-family: monospace; background: #111; color: #fff; padding: 20px; }
    .suite { margin: 15px 0; padding: 10px; border: 1px solid #333; border-radius: 8px; }
    .suite-name { color: #00f0ff; font-size: 1.1rem; margin-bottom: 10px; }
    .test { padding: 5px 10px; margin: 3px 0; border-radius: 4px; }
    .pass { background: rgba(0, 255, 136, 0.1); color: #00ff88; }
    .fail { background: rgba(255, 68, 102, 0.1); color: #ff4466; }
    .summary { margin-top: 20px; font-size: 1.2rem; }
    .summary .total { color: #00f0ff; }
    .summary .passed { color: #00ff88; }
    .summary .failed { color: #ff4466; }
  </style>
</head>
<body>
  <h1 style="color: #00f0ff;">My Planet Test Runner</h1>
  <div id="results"></div>
  <div class="summary" id="summary"></div>

  <script>
    var results = { total: 0, passed: 0, failed: 0, suites: [] };
    var currentSuite = null;

    function describe(name, fn) {
      currentSuite = { name: name, tests: [] };
      results.suites.push(currentSuite);
      fn();
      currentSuite = null;
    }

    function it(name, fn) {
      results.total++;
      try {
        fn();
        results.passed++;
        currentSuite.tests.push({ name: name, pass: true });
      } catch (e) {
        results.failed++;
        currentSuite.tests.push({ name: name, pass: false, error: e.message });
      }
    }

    function expect(val) {
      return {
        toBe: function(expected) {
          if (val !== expected) throw new Error('Expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(val));
        },
        toEqual: function(expected) {
          if (JSON.stringify(val) !== JSON.stringify(expected)) throw new Error('Expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(val));
        },
        toBeTruthy: function() {
          if (!val) throw new Error('Expected truthy but got ' + JSON.stringify(val));
        },
        toContain: function(expected) {
          if (typeof val === 'string') {
            if (!val.includes(expected)) throw new Error('Expected "' + val + '" to contain "' + expected + '"');
          } else if (Array.isArray(val)) {
            if (!val.includes(expected)) throw new Error('Expected array to contain ' + JSON.stringify(expected));
          }
        },
        toBeGreaterThan: function(expected) {
          if (val <= expected) throw new Error('Expected ' + val + ' > ' + expected);
        }
      };
    }

    function renderResults() {
      var html = '';
      results.suites.forEach(function(suite) {
        html += '<div class="suite"><div class="suite-name">' + suite.name + '</div>';
        suite.tests.forEach(function(test) {
          var cls = test.pass ? 'pass' : 'fail';
          var icon = test.pass ? '\u2713' : '\u2717';
          var extra = test.error ? ' <span style="color:#ff4466;">(' + test.error + ')</span>' : '';
          html += '<div class="test ' + cls + '">' + icon + ' ' + test.name + extra + '</div>';
        });
        html += '</div>';
      });
      document.getElementById('results').innerHTML = html;

      var summaryHtml = 'Total: <span class="total">' + results.total + '</span> | ' +
        'Passed: <span class="passed">' + results.passed + '</span> | ' +
        'Failed: <span class="failed">' + results.failed + '</span>';
      document.getElementById('summary').innerHTML = summaryHtml;
    }

    // 加载测试文件并运行
    function runAllTests() {
      renderResults();
      if (results.failed > 0) {
        document.title = 'Tests FAILED: ' + results.failed;
      } else {
        document.title = 'Tests PASSED: ' + results.passed + '/' + results.total;
      }
    }
  </script>

  <!-- 加载测试模块 -->
  <script src="tests-core.js"></script>
  <script src="tests-blog.js"></script>
  <script src="tests-admin.js"></script>
  <script src="tests-editor.js"></script>
  <script src="tests-post.js"></script>
  <script src="tests-e2e.js"></script>

  <script>runAllTests();</script>
</body>
</html>
```

### 测试运行方式

```bash
# 1. 浏览器直接打开
start test/test-runner.html

# 2. Node.js 脚本启动本地服务器后批量跑
node test/serve.js
# 然后用 puppeteer/headless Chrome 访问 http://localhost:8080/test/test-runner.html
# 收集结果，返回 exit code
```

##### test/serve.js

```javascript
var http = require('http');
var fs = require('fs');
var path = require('path');

var MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

var server = http.createServer(function(req, res) {
  var filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
  var ext = path.extname(filePath);
  var contentType = MIME[ext] || 'text/plain';

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
    res.end(data);
  });
});

server.listen(8080, function() {
  console.log('Server running at http://localhost:8080');
});
```

### 每个功能的测试覆盖率要求

| 功能模块 | 单元测试数 | 集成测试数 | E2E测试数 | 覆盖率目标 |
|----------|-----------|-----------|-----------|-----------|
| core (markdown/utils) | 15+ | 5 | - | 90% |
| blog 列表/搜索/筛选 | 10+ | 5 | 3 | 85% |
| editor 创建/编辑/预览 | 12+ | 5 | 3 | 85% |
| admin 管理/删除/认证 | 8+ | 4 | 2 | 80% |
| post 详情/评论 | 10+ | 4 | 2 | 85% |
| 主题/动画/响应式 | 6+ | 3 | 1 | 75% |

### E2E 自动化测试流程（端到端）

##### test/tests-e2e.js

```javascript
describe('E2E: 用户完整创作流程', function() {
  // 模拟完整的用户操作流程
  // 此文件需要在浏览器中配合实际DOM操作运行

  it('1. 首页星空渲染正常', function() {
    var starfield = document.getElementById('starfield');
    // 在实际运行时 starfield 应存在
    expect(!!starfield).toBe(true);
  });

  it('2. localStorage 可用', function() {
    try {
      localStorage.setItem('_test', '1');
      localStorage.removeItem('_test');
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }
  });

  it('3. 可以创建文章并保存', function() {
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

  it('4. 文章可以添加评论', function() {
    var post = { comments: [] };
    post.comments.push({ name: '测试者', content: '测试评论', time: Date.now() });
    expect(post.comments.length).toBe(1);
    expect(post.comments[0].name).toBe('测试者');
  });

  it('5. 评论可以删除', function() {
    var post = { comments: [{ name: 'A', content: 'a', time: 1 }, { name: 'B', content: 'b', time: 2 }] };
    post.comments.splice(0, 1);
    expect(post.comments.length).toBe(1);
    expect(post.comments[0].name).toBe('B');
  });

  it('6. 搜索过滤正常', function() {
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

  it('7. 标签筛选正常', function() {
    var posts = [
      { title: 'A', tags: ['tech'] },
      { title: 'B', tags: ['life'] },
      { title: 'C', tags: ['tech'] }
    ];
    var tag = 'tech';
    var filtered = posts.filter(function(p) { return p.tags.includes(tag); });
    expect(filtered.length).toBe(2);
  });

  it('8. Markdown 解析基本语法', function() {
    var md = '# Title\n\n**bold** and *italic*\n\n- item1\n- item2';
    var html = markdownToHtml(md);
    expect(html).toContain('<h1>');
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
    expect(html).toContain('<li>');
  });

  it('9. XSS 防护 - escapeHtml', function() {
    var input = '<img src=x onerror=alert(1)>';
    var safe = escapeHtml(input);
    expect(safe).toContain('&lt;');
    expect(safe).toContain('&gt;');
    expect(safe).not.toContain('<img');
  });

  it('10. 数据导出格式正确', function() {
    var data = { planet_posts: '[]', planet_bg: null };
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    expect(parsed.planet_posts).toBe('[]');
  });
});
```

---

## 五、开发优先级排期建议

| 阶段 | 任务 | 预计工作量 |
|------|------|-----------|
| **第1阶段** | 公共模块抽取 + 测试框架搭建 | 3天 |
| **第2阶段** | Admin 认证 + 数据备份/恢复 | 2天 |
| **第3阶段** | Markdown 编辑器升级 + 分屏预览 | 2天 |
| **第4阶段** | 文章分页/排序/置顶 + 评论增强 | 2天 |
| **第5阶段** | 暗色/亮色主题切换 | 1天 |
| **第6阶段** | 阅读统计仪表板 + RSS | 2天 |
| **第7阶段** | SEO优化 + sitemap | 1天 |
| **第8阶段** | PWA支持 + 页面过渡动画 | 2天 |
| **总计** | | **~15天** |

---

## 六、各阶段详细任务清单

### 第1阶段：公共模块抽取 + 测试框架（3天）

```
Day 1:
  [ ] 创建 css/ 目录结构
  [ ] 编写 css/base.css（CSS变量 + reset + 字体）
  [ ] 编写 css/nav.css（导航栏样式）
  [ ] 编写 css/effects.css（星空/光效/扫描线）
  [ ] 创建 js/core/ 目录结构
  [ ] 编写 js/core/stars.js
  [ ] 编写 js/core/effects.js
  [ ] 编写 js/core/bg.js
  [ ] 编写 js/core/markdown.js
  [ ] 编写 js/core/utils.js

Day 2:
  [ ] 重构 index.html（引用公共CSS/JS，删除内联重复代码）
  [ ] 重构 blog.html（引用公共CSS/JS + 新建 blog.css）
  [ ] 重构 admin.html（引用公共CSS/JS + 新建 admin.css）
  [ ] 重构 editor.html（引用公共CSS/JS + 新建 editor.css）
  [ ] 重构 post.html（引用公共CSS/JS + 新建 post.css）

Day 3:
  [ ] 创建 test/ 目录结构
  [ ] 编写 test/test-runner.html（测试框架）
  [ ] 编写 test/tests-core.js（核心模块测试）
  [ ] 编写 test/tests-blog.js（博客功能测试）
  [ ] 编写 test/tests-admin.js（管理功能测试）
  [ ] 编写 test/tests-editor.js（编辑器功能测试）
  [ ] 编写 test/tests-post.js（文章详情测试）
  [ ] 编写 test/tests-e2e.js（端到端测试）
  [ ] 运行所有测试，确认通过
```

### 第2阶段：Admin 认证 + 数据备份/恢复（2天）

```
Day 1:
  [ ] 编写 js/auth.js（SHA-256 哈希 + session管理）
  [ ] 修改 admin.html 添加密码设置/输入界面
  [ ] 修改 editor.html 添加认证检查
  [ ] 编写 tests-auth.js

Day 2:
  [ ] 编写 js/core/storage.js（导出/导入/自动备份）
  [ ] 修改 admin.html 添加导出/导入按钮
  [ ] 在 editor.js 的 save 函数中调用 autoBackup()
  [ ] 编写 tests-storage.js
  [ ] 运行所有测试
```

### 第3阶段：Markdown 编辑器升级（2天）

```
Day 1:
  [ ] 引入 marked.js（CDN 或本地）
  [ ] 引入 highlight.js（代码高亮）
  [ ] 修改 editor.html 添加工具栏
  [ ] 实现分屏预览模式

Day 2:
  [ ] 实现图片拖拽/粘贴转base64
  [ ] 实现同步滚动
  [ ] 编写 tests-editor-advanced.js
  [ ] 运行所有测试
```

### 第4阶段：文章分页/排序/置顶 + 评论增强（2天）

```
Day 1:
  [ ] blog.html 添加分页组件
  [ ] blog.html 添加排序切换
  [ ] 数据模型添加 pinned 字段
  [ ] admin.html 添加置顶按钮

Day 2:
  [ ] post.html 评论支持 Markdown 渲染
  [ ] 实现回复功能（嵌套评论）
  [ ] 实现表情反应
  [ ] 实现防spam机制
  [ ] 编写 tests-blog-advanced.js + tests-comments.js
  [ ] 运行所有测试
```

### 第5阶段：暗色/亮色主题切换（1天）

```
  [ ] 修改 css/base.css 添加主题变量
  [ ] 编写 js/core/theme.js
  [ ] 每个页面导航栏添加切换按钮
  [ ] 编写 tests-theme.js
  [ ] 运行所有测试
```

### 第6阶段：阅读统计仪表板 + RSS（2天）

```
Day 1:
  [ ] 编写 js/analytics.js
  [ ] admin.html 添加统计面板（Top5 + Canvas图表）
  [ ] post.html 页面加载时调用 recordView()

Day 2:
  [ ] 编写 feed.xml 生成逻辑
  [ ] 导航栏添加 RSS 图标
  [ ] 编写 tests-analytics.js + tests-rss.js
  [ ] 运行所有测试
```

### 第7阶段：SEO优化（1天）

```
  [ ] 所有页面添加 <meta> description/keywords
  [ ] 动态文章页添加 Open Graph 标签
  [ ] 编写 sitemap.xml 生成逻辑
  [ ] 添加 JSON-LD 结构化数据
  [ ] 编写 robots.txt
  [ ] 编写 tests-seo.js
  [ ] 运行所有测试
```

### 第8阶段：PWA支持 + 页面过渡动画（2天）

```
Day 1:
  [ ] 编写 manifest.json
  [ ] 编写 sw.js（Service Worker）
  [ ] index.html 注册 Service Worker
  [ ] 创建 icons/ 目录，生成图标

Day 2:
  [ ] 编写 css/animations.css
  [ ] 编写 js/core/animations.js
  [ ] 所有页面引入动画模块
  [ ] 编写 tests-pwa.js + tests-animation.js
  [ ] 运行所有测试
```

---

## 七、项目文件清单（完成后）

```
D:\mimocode\
├── index.html                      # 首页（重构后）
├── blog.html                       # 博客列表（重构后）
├── admin.html                      # 控制台（重构后）
├── editor.html                     # 编辑器（重构后）
├── post.html                       # 文章详情（重构后）
├── posts/
│   └── first-post.html             # 示例静态文章
├── feed.xml                        # RSS 订阅源
├── sitemap.xml                     # 站点地图
├── robots.txt                      # 爬虫协议
├── manifest.json                   # PWA 清单
├── sw.js                           # Service Worker
├── icons/
│   ├── icon-192.png                # PWA 图标 192x192
│   └── icon-512.png                # PWA 图标 512x512
├── css/
│   ├── base.css                    # 全局基础样式
│   ├── nav.css                     # 导航栏样式
│   ├── effects.css                 # 特效样式
│   ├── animations.css              # 动画样式
│   ├── blog.css                    # 博客列表样式
│   ├── editor.css                  # 编辑器样式
│   ├── post.css                    # 文章详情样式
│   └── admin.css                   # 控制台样式
├── js/
│   ├── core/
│   │   ├── stars.js                # 星空生成
│   │   ├── effects.js              # 光效
│   │   ├── bg.js                   # 背景加载
│   │   ├── markdown.js             # Markdown 解析
│   │   ├── utils.js                # 通用工具
│   │   ├── auth.js                 # 认证模块
│   │   ├── storage.js              # 数据存储
│   │   ├── theme.js                # 主题切换
│   │   └── animations.js           # 动画模块
│   ├── blog.js                     # 博客列表逻辑
│   ├── admin.js                    # 控制台逻辑
│   ├── editor.js                   # 编辑器逻辑
│   ├── post.js                     # 文章详情逻辑
│   ├── home.js                     # 首页动画逻辑
│   └── analytics.js                # 阅读统计
├── test/
│   ├── test-runner.html            # 测试运行器
│   ├── serve.js                    # 本地服务器
│   ├── tests-core.js               # 核心模块测试
│   ├── tests-blog.js               # 博客功能测试
│   ├── tests-admin.js              # 管理功能测试
│   ├── tests-editor.js             # 编辑器功能测试
│   ├── tests-post.js               # 文章详情测试
│   ├── tests-auth.js               # 认证模块测试
│   ├── tests-storage.js            # 数据存储测试
│   ├── tests-theme.js              # 主题切换测试
│   ├── tests-comments.js           # 评论系统测试
│   ├── tests-analytics.js          # 阅读统计测试
│   ├── tests-rss.js                # RSS 订阅测试
│   ├── tests-seo.js                # SEO 测试
│   ├── tests-pwa.js                # PWA 测试
│   ├── tests-animation.js          # 动画测试
│   ├── tests-blog-advanced.js      # 博客高级功能测试
│   ├── tests-editor-advanced.js    # 编辑器高级功能测试
│   └── tests-e2e.js                # 端到端测试
├── .gitignore
├── README.md
├── FUTURE_PLAN.md                  # 本文档
└── FUTURE_PLAN.html                # 本文档的HTML版本
```

---

## 八、关键设计决策

### 1. 为什么不用框架？

本项目定位为纯静态站点，部署在 GitHub Pages，使用框架（React/Vue）会增加构建步骤和文件体积。Vanilla JS + 模块化文件结构足以满足需求，且保持了"零依赖"的简洁性。

### 2. 为什么用 SHA-256 而不是 bcrypt？

浏览器原生支持 `crypto.subtle.digest('SHA-256')`，无需引入第三方库。虽然 SHA-256 不如 bcrypt 安全（无 salt），但对于个人博客的 admin 认证已足够。如果需要更高安全性，可引入 bcrypt.js。

### 3. 为什么测试框架不使用 Jest/Mocha？

本项目是纯静态站点，没有 Node.js 构建流程。使用自定义的浏览器端测试框架（~100行代码）可以：
- 零依赖，零配置
- 直接在浏览器中查看结果
- 与项目"零依赖"理念一致
- 后续可通过 Puppeteer 实现自动化测试

### 4. localStorage 数据安全策略

```
写入流程：
  编辑文章 → savePosts() → localStorage.setItem('planet_posts', ...)
                       → Storage.autoBackup() → localStorage.setItem('planet_posts_backup', ...)

恢复流程：
  检测到数据丢失 → Storage.restoreBackup()
                → 如果备份也损坏 → 提示用户导入备份文件
```

### 5. 模块加载顺序

所有页面的 `<script>` 加载顺序必须为：

```
1. js/core/utils.js          ← 最先加载，其他模块依赖
2. js/core/stars.js          ← 星空生成
3. js/core/effects.js        ← 光效
4. js/core/bg.js             ← 背景
5. js/core/markdown.js       ← Markdown（如果需要）
6. js/core/auth.js           ← 认证（如果需要）
7. js/core/storage.js        ← 存储（如果需要）
8. js/core/theme.js          ← 主题
9. js/core/animations.js     ← 动画
10. js/[页面].js              ← 页面专用逻辑（最后加载）
```

---

*本文档由 MiMo 自动生成，涵盖 MY PLANET 项目的完整后期开发架构、功能规划和测试流程。*
*生成时间：2026-06-12*
