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
├── index.html              # 首页（含主题切换+RSS链接+JSON-LD+Service Worker注册）
├── blog.html               # 博客列表（分页+排序+置顶+主题切换+RSS链接+动画）
├── admin.html              # 控制台（置顶管理+主题切换+阅读统计仪表板）
├── editor.html             # 编辑器（分屏预览+工具栏+图片拖拽+主题切换+RSS链接）
├── post.html               # 文章详情（Markdown评论+回复+表情反应+主题切换+浏览统计+Open Graph+动画）
├── feed.html               # RSS订阅源生成器
├── sitemap.html            # 站点地图生成器
├── robots.txt              # 爬虫协议
├── manifest.json           # PWA清单文件
├── sw.js                   # Service Worker（缓存策略）
├── icons/
│   ├── icon-192.svg        # PWA图标 192x192
│   └── icon-512.svg        # PWA图标 512x512
├── posts/
│   └── first-post.html     # 示例静态文章
├── css/
│   ├── base.css            # 全局变量 + reset + 字体 + 主题变量 + 玻璃材质变量
│   ├── glass-nav.css       # 液态玻璃导航栏样式（Apple OS 风格）
│   ├── nav.css             # 基础导航栏样式（回退）
│   ├── effects.css         # 星空/光效/扫描线（含亮色主题适配）
│   ├── animations.css      # 淡入/交错/页面过渡（含减弱动画支持）
│   ├── home.css            # 首页专用
│   ├── blog.css            # 博客列表专用（分页+排序+置顶样式）
│   ├── admin.css           # 控制台专用（置顶按钮+统计面板样式）
│   ├── editor.css          # 编辑器专用（分屏+工具栏样式）
│   └── post.css            # 文章详情专用（评论+回复+反应样式）
├── js/
│   ├── core/
│   │   ├── utils.js        # escapeHtml/date/getPosts/savePosts/generateId
│   │   ├── stars.js        # createStarfield()
│   │   ├── effects.js      # initCursorGlow()
│   │   ├── bg.js           # loadCustomBg()
│   │   ├── markdown.js     # markdownToHtml()
│   │   ├── auth.js         # Auth (SHA-256认证)
│   │   ├── storage.js      # Storage (导出/导入/备份)
│   │   ├── theme.js        # ThemeManager (暗/亮切换+持久化)
│   │   ├── animations.js   # Animations (IntersectionObserver+页面过渡)
│   │   ├── glass-nav.js    # GlassNav (液态玻璃导航栏交互)
│   │   └── analytics.js    # Analytics (阅读统计+图表)
│   ├── blog.js             # 博客列表逻辑（分页+排序+置顶）
│   ├── admin.js            # 控制台逻辑（置顶管理+统计面板）
│   ├── editor.js           # 编辑器逻辑
│   ├── post.js             # 文章详情逻辑（Markdown评论+回复+表情+防spam+浏览记录）
│   └── home.js             # 首页动画逻辑
├── test/
│   ├── test-runner.html    # 浏览器端测试运行器
│   ├── tests-core.js       # 核心模块测试
│   ├── tests-blog.js       # 博客基础测试
│   ├── tests-blog-advanced.js  # 博客高级功能测试（分页+排序+置顶）
│   ├── tests-admin.js      # 管理功能测试
│   ├── tests-editor.js     # 编辑器基础测试
│   ├── tests-editor-advanced.js  # 编辑器高级功能测试（marked+hljs+分屏）
│   ├── tests-post.js       # 文章详情测试
│   ├── tests-comments.js   # 评论系统测试（Markdown+回复+表情+防spam）
│   ├── tests-auth.js       # 认证模块测试
│   ├── tests-storage.js    # 数据存储测试
│   ├── tests-theme.js      # 主题切换测试
│   ├── tests-analytics.js  # 阅读统计测试
│   ├── tests-rss.js        # RSS订阅测试
│   ├── tests-seo.js        # SEO优化测试
│   ├── tests-pwa.js        # PWA测试
│   ├── tests-animation.js  # 动画测试
│   ├── tests-glass-nav.js  # 液态玻璃导航栏测试
│   └── tests-e2e.js        # 端到端测试
├── .gitignore
├── README.md
└── FUTURE_PLAN.md          # 后续开发规划
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
| `planet_posts` | 文章数据（JSON 数组，含 pinned/comments/reactions 字段） |
| `planet_bg` | 首页自定义背景图片（URL 或 base64） |
| `planet_posts_backup` | 文章自动备份 |
| `planet_admin_hash` | 管理员密码 SHA-256 哈希 |
| `planet_theme` | 主题设置（dark/light） |
| `planet_views` | 阅读统计 |
| `planet_comment_spam` | 评论防 spam 时间戳记录 |

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
| - | Phase 3: Markdown 编辑器升级（marked.js + highlight.js + 分屏预览 + 工具栏 + 图片拖拽） |
| - | Phase 4: 文章分页/排序/置顶 + 评论增强（Markdown评论 + 嵌套回复 + 表情反应 + 防spam） |
| - | Phase 5: 暗色/亮色主题切换（CSS变量主题 + ThemeManager + 所有页面导航栏切换按钮） |
| - | Phase 6: 阅读统计仪表板 + RSS（Top5排行 + Canvas图表 + 时间筛选 + RSS订阅源生成） |
| - | Bug fix: feed.xml 重命名为 feed.html（.xml 扩展名导致浏览器以 XML 模式解析 HTML 内容报错） |
| - | Phase 7: SEO优化（meta标签 + Open Graph + JSON-LD + sitemap生成器 + robots.txt） |
| - | Phase 8: PWA支持 + 页面过渡动画（manifest.json + Service Worker + 动画模块 + 减弱动画支持） |
| - | Bug fix: 编辑器亮色模式文字颜色 + 联系方式颜色（硬编码白色替换为CSS变量） |
| - | 功能增强: 发布后跳转 + 编辑器文件导入/导出 |
| - | 新增: 液态玻璃导航栏（Apple OS 风格 Liquid Glass - 毛玻璃+动态光影+滚动响应+波纹效果） |

## 开发规范

| 规则 | 说明 |
|------|------|
| 文件扩展名 | 生成器/动态页面用 `.html`；静态 XML 文件内容必须严格自闭合 |
| 新文件验证 | 创建后必须在浏览器中实际打开验证，不能只跑逻辑测试 |
