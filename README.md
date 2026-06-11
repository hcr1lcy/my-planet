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
├── index.html              # 首页
├── blog.html               # 博客列表
├── admin.html              # 控制台
├── editor.html             # 编辑器
├── post.html               # 文章详情
├── posts/
│   └── first-post.html     # 示例静态文章
├── css/
│   ├── base.css            # 全局变量 + reset + 字体
│   ├── nav.css             # 导航栏
│   ├── effects.css         # 星空/光效/扫描线
│   ├── animations.css      # 淡入/交错/页面过渡
│   ├── home.css            # 首页专用
│   ├── blog.css            # 博客列表专用
│   ├── admin.css           # 控制台专用
│   ├── editor.css          # 编辑器专用
│   └── post.css            # 文章详情专用
├── js/
│   ├── core/
│   │   ├── utils.js        # escapeHtml/date/getPosts/savePosts/generateId
│   │   ├── stars.js        # createStarfield()
│   │   ├── effects.js      # initCursorGlow()
│   │   ├── bg.js           # loadCustomBg()
│   │   ├── markdown.js     # markdownToHtml()
│   │   ├── auth.js         # Auth (SHA-256认证)
│   │   ├── storage.js      # Storage (导出/导入/备份)
│   │   ├── theme.js        # ThemeManager (暗/亮切换)
│   │   ├── animations.js   # Animations (IntersectionObserver)
│   │   └── analytics.js    # Analytics (阅读统计)
│   ├── blog.js             # 博客列表逻辑
│   ├── admin.js            # 控制台逻辑
│   ├── editor.js           # 编辑器逻辑
│   ├── post.js             # 文章详情逻辑
│   └── home.js             # 首页动画逻辑
├── test/
│   ├── test-runner.html    # 浏览器端测试运行器
│   ├── tests-core.js       # 核心模块测试
│   └── tests-e2e.js        # 端到端测试
├── .gitignore
├── README.md
└── FUTURE_PLAN.md          # 后续开发规划
```

---

## 数据存储

| Key | 说明 |
|-----|------|
| `planet_posts` | 文章数据（JSON 数组） |
| `planet_bg` | 首页自定义背景图片（URL 或 base64） |
| `planet_posts_backup` | 文章自动备份 |
| `planet_admin_hash` | 管理员密码 SHA-256 哈希 |
| `planet_theme` | 主题设置（dark/light） |
| `planet_views` | 阅读统计 |

---

## 测试

浏览器打开 `test/test-runner.html` 运行所有测试。

---

## 开发记录

| 提交 | 内容 |
|------|------|
| `2ea60e9` | 初始科幻星球首页 |
| `e0059db` | 博客系统 |
| `acce1f1` | 完整博客 CRUD + 评论 |
| `d7712e7` | 统一导航栏 |
| `c337dff` | 修复导航跳转 |
| `aa4d70f` | 添加项目 README |
| `ee8ff7e` | 首页背景自定义 |
| `b4725f6` | 重写背景系统 |
| `f1bc380` | 模块化重构（Phase 1） |
