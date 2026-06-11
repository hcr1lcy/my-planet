var staticPosts = [
  {
    id: 'first-post',
    title: '星际航行的第一步：从零搭建个人星球',
    date: '2026.06.11',
    tags: ['tech', 'design'],
    readTime: '5 min',
    excerpt: '在数字宇宙中创建一颗属于自己的星球需要什么？本文记录了从构思到实现的完整过程。',
    isStatic: true,
  },
  {
    id: 'ai-revolution',
    title: 'AI 时代的编程：当代码开始自我进化',
    date: '2026.05.28',
    tags: ['ai', 'tech'],
    readTime: '8 min',
    excerpt: '大语言模型正在重新定义软件开发的边界。从 Copilot 到全自动编码agent。',
    isStatic: true,
  },
  {
    id: 'minimal-design',
    title: '极简主义的设计哲学：Less is More',
    date: '2026.05.15',
    tags: ['design'],
    readTime: '6 min',
    excerpt: '在信息过载的时代，如何通过极简设计让用户聚焦于内容本身？',
    isStatic: true,
  },
  {
    id: 'remote-work',
    title: '远程工作两年：我的数字游牧生活',
    date: '2026.04.20',
    tags: ['life'],
    readTime: '7 min',
    excerpt: '从咖啡厅到共享办公空间，两年的远程工作让我重新定义了工作与生活的边界。',
    isStatic: true,
  },
  {
    id: 'web3-future',
    title: 'Web3 是泡沫还是未来？一个开发者的观察',
    date: '2026.03.10',
    tags: ['tech'],
    readTime: '9 min',
    excerpt: '剥离炒作与泡沫，从技术架构和用户体验的角度重新审视Web3。',
    isStatic: true,
  },
];

function getDynamicPosts() {
  var posts = getPosts();
  return posts.filter(function(p) { return p.status === 'published'; }).map(function(p) {
    return {
      id: p.id,
      title: p.title,
      date: formatDate(p.createdAt),
      tags: p.tags || [],
      readTime: Math.max(1, Math.ceil(p.content.length / 500)) + ' min',
      excerpt: p.content.replace(/[#*`>\-\[\]]/g, '').slice(0, 120) + '...',
      isStatic: false,
    };
  });
}

function getAllPosts() {
  return staticPosts.concat(getDynamicPosts());
}

function renderPosts(filter, search) {
  filter = filter || 'all';
  search = search || '';
  var container = document.getElementById('postsContainer');
  var filtered = getAllPosts();

  if (filter !== 'all') {
    filtered = filtered.filter(function(p) { return p.tags.includes(filter); });
  }
  if (search) {
    var q = search.toLowerCase();
    filtered = filtered.filter(function(p) {
      return p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(function(t) { return t.includes(q); });
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">\uD83D\uDEF8</div><p>未找到匹配的日志记录</p></div>';
    return;
  }

  container.innerHTML = filtered.map(function(post) {
    var href = post.isStatic ? 'posts/' + post.id + '.html' : 'post.html?id=' + post.id;
    var tagsHtml = post.tags.map(function(t) {
      return '<span class="post-tag">' + t.toUpperCase() + '</span>';
    }).join('');
    return '<a href="' + href + '" class="post-card">' +
      '<div class="post-meta">' +
        '<span class="post-date">' + post.date + '</span>' +
        '<div class="post-tags">' + tagsHtml + '</div>' +
        '<span class="post-read-time">\u23F1 ' + post.readTime + '</span>' +
      '</div>' +
      '<h2>' + escapeHtml(post.title) + '</h2>' +
      '<p class="post-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
      '<span class="read-more">READ MORE</span>' +
    '</a>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  renderPosts();

  document.querySelectorAll('.tag-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tag-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderPosts(btn.getAttribute('data-tag'), document.getElementById('searchInput').value);
    });
  });

  document.getElementById('searchInput').addEventListener('input', function(e) {
    var activeTag = document.querySelector('.tag-btn.active');
    renderPosts(activeTag ? activeTag.getAttribute('data-tag') : 'all', e.target.value);
  });

  createStarfield(document.getElementById('starfield'), 150);
  initCursorGlow();
  loadCustomBg();
});
