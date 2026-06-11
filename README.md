# MY PLANET - 科幻个人星球主题网站

> GitHub Pages: https://hcr1lcy.github.io/my-planet/
> GitHub Repo: https://github.com/hcr1lcy/my-planet

---

## 技术栈

- 纯静态站点，无框架依赖
- HTML5 + CSS3 + Vanilla JavaScript
- 数据存储：localStorage（浏览器本地）
- 部署：GitHub Pages（main 分支）

---

## 文件结构

```
D:\mimocode\
├── index.html          # 首页（星球主页 + 关于 + 技能 + 旅程 + 联系）
├── blog.html           # 博客列表页（支持搜索/标签筛选，合并静态+动态文章）
├── admin.html          # 控制台（文章管理：查看/编辑/删除）
├── editor.html         # 编辑器（新建/编辑文章，Markdown + 实时预览）
├── post.html           # 文章详情页（动态文章 + 评论功能）
├── posts/
│   └── first-post.html # 示例静态文章
├── .gitignore          # 忽略 blog/ 目录（Hexo 项目，独立仓库）
└── README.md           # 本文档
```

---

## 页面详情

### index.html - 首页
- **锚点区域**: `#home` `#about` `#skills` `#journey` `#contact`
- **特效**: 星空背景(200颗星)、旋转星球+星环+卫星、鼠标跟随光效、扫描线
- **动画**: 数字递增、技能条填充、卡片3D悬浮
- **JS逻辑**: 导航平滑滚动（仅拦截 `#` 锚点链接，外部链接正常跳转）

### blog.html - 博客列表
- **数据来源**: 静态文章数组 `staticPosts` + localStorage 动态文章 `getDynamicPosts()`
- **功能**: 关键词搜索、标签筛选(ALL/TECH/LIFE/AI/DESIGN)
- **链接规则**: 静态文章 → `posts/{id}.html`，动态文章 → `post.html?id={id}`

### admin.html - 控制台
- **功能**: 显示所有文章（已发布/草稿）、编辑、删除（带确认弹窗）
- **数据**: 从 localStorage 读取 `planet_posts`
- **统计**: 总数、已发布数、草稿数

### editor.html - 编辑器
- **新建**: URL 无 `id` 参数
- **编辑**: URL 带 `?id=xxx` 参数，自动填充已有内容
- **功能**: Markdown 编写、实时预览切换、保存草稿、发布
- **数据**: 写入 localStorage `planet_posts`

### post.html - 文章详情
- **来源**: URL 参数 `?id=xxx`，从 localStorage 查找
- **功能**: Markdown 渲染、评论（发表/删除）
- **数据**: 评论存储在 `planet_posts[idx].comments` 数组中

### posts/first-post.html - 静态示例文章
- 硬编码的示例文章，不依赖 localStorage

---

## 导航栏（统一结构）

所有页面导航栏一致，共 6 项：

```
首页 | 关于 | 技能 | 日志 | 控制台 | 联系
```

- **index.html**: 锚点链接 `#home` `#about` `#skills`，外部链接 `blog.html` `admin.html`，锚点 `#contact`
- **其他页面**: 链接回 `index.html#xxx`
- **当前页**: 对应链接加 `class="active"`
- **logo**: `<a href="index.html" class="logo">MY PLANET</a>`

⚠️ **重要**: index.html 的 JS 只拦截 `#` 开头的锚点做平滑滚动，不拦截外部页面链接

---

## 数据模型

### localStorage key: `planet_posts`

```json
[
  {
    "id": "生成的唯一ID",
    "title": "文章标题",
    "content": "Markdown 内容",
    "tags": ["tech", "life"],
    "status": "published" | "draft",
    "createdAt": 1718150400000,
    "updatedAt": 1718150400000,
    "comments": [
      {
        "name": "用户名",
        "content": "评论内容",
        "time": 1718150400000
      }
    ]
  }
]
```

---

## 视觉设计规范

- **主色**: `#00f0ff`（青色）、`#a855f7`（紫色）、`#ff006e`（粉色）
- **背景**: 纯黑 `#000` + 径向渐变 `#0a0e2a`
- **字体**: Orbitron（标题/英文）、Noto Sans SC（正文/中文）
- **卡片**: 半透明背景 + 1px 边框 + 圆角 16px
- **效果**: 扫描线、鼠标跟随光效、星星闪烁动画

---

## 开发记录

| 日期 | 提交 | 内容 |
|------|------|------|
| 2026-06-11 | `2ea60e9` | 初始科幻星球首页 |
| 2026-06-11 | `e0059db` | 添加博客系统（列表页+示例文章） |
| 2026-06-11 | `acce1f1` | 完整博客 CRUD + 评论 + 控制台 + 编辑器 |
| 2026-06-11 | `d7712e7` | 统一所有页面导航栏 |
| 2026-06-11 | `c337dff` | 修复导航跳转（JS 仅拦截锚点链接） |

---

## 已知问题 & 解决方案

### 1. 导航链接跳转不了
**原因**: index.html 的 JS 对所有 `nav-links a` 执行了 `e.preventDefault()`，包括外部页面链接
**解决**: 改为仅拦截 `href` 以 `#` 开头的链接

### 2. blog/ 目录被误提交为 submodule
**原因**: `blog/` 是独立的 Hexo 项目（有自己的 `.git`）
**解决**: 添加到 `.gitignore`，用 `git rm --cached blog` 移除

### 3. GitHub Pages 访问需要代理
**环境**: 中国大陆网络，GitHub 连接超时
**代理**: `http://127.0.0.1:7896`（Clash Verge 端口）
**设置**: `git config --global http.proxy http://127.0.0.1:7896`

---

## 常见修改任务

### 添加新页面
1. 创建 HTML 文件，复制任一现有页面的导航栏和基础样式
2. 导航栏中当前页加 `class="active"`
3. 在所有页面的导航栏中添加新链接

### 修改导航栏
需同时修改以下文件的 `<nav>` 区域：
- `index.html`
- `blog.html`
- `admin.html`
- `editor.html`
- `post.html`
- `posts/first-post.html`

### 添加新的静态文章
1. 在 `posts/` 目录创建 `{id}.html`
2. 在 `blog.html` 的 `staticPosts` 数组中添加条目
3. 导航栏复制其他页面的统一结构

### 修改全局样式
- 主色变量: `#00f0ff` `#a855f7` `#ff006e`
- 各页面 CSS 独立，需分别修改（或抽取公共 CSS 文件）
