var POSTS_PER_PAGE = 10;
var currentPage = 1;
var currentSort = 'date';
var currentFilter = 'all';
var currentSearch = '';
var currentView = 'timeline';
var expandedYears = {};
var expandedMonths = {};

var staticPosts = [
  {
    id: 'first-post',
    title: '星际航行的第一步：从零搭建个人星球',
    date: '2026.06.11',
    tags: ['tech', 'design'],
    readTime: '5 min',
    excerpt: '在数字宇宙中创建一颗属于自己的星球需要什么？本文记录了从构思到实现的完整过程。',
    isStatic: true,
    pinned: false,
    createdAt: 1718064000000,
  },
  {
    id: 'ai-revolution',
    title: 'AI 时代的编程：当代码开始自我进化',
    date: '2026.05.28',
    tags: ['ai', 'tech'],
    readTime: '8 min',
    excerpt: '大语言模型正在重新定义软件开发的边界。从 Copilot 到全自动编码agent。',
    isStatic: true,
    pinned: false,
    createdAt: 1716854400000,
  },
  {
    id: 'minimal-design',
    title: '极简主义的设计哲学：Less is More',
    date: '2026.05.15',
    tags: ['design'],
    readTime: '6 min',
    excerpt: '在信息过载的时代，如何通过极简设计让用户聚焦于内容本身？',
    isStatic: true,
    pinned: false,
    createdAt: 1715731200000,
  },
  {
    id: 'remote-work',
    title: '远程工作两年：我的数字游牧生活',
    date: '2026.04.20',
    tags: ['life'],
    readTime: '7 min',
    excerpt: '从咖啡厅到共享办公空间，两年的远程工作让我重新定义了工作与生活的边界。',
    isStatic: true,
    pinned: false,
    createdAt: 1713571200000,
  },
  {
    id: 'web3-future',
    title: 'Web3 是泡沫还是未来？一个开发者的观察',
    date: '2026.03.10',
    tags: ['tech'],
    readTime: '9 min',
    excerpt: '剥离炒作与泡沫，从技术架构和用户体验的角度重新审视Web3。',
    isStatic: true,
    pinned: false,
    createdAt: 1710028800000,
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
      pinned: !!p.pinned,
      createdAt: p.createdAt,
    };
  });
}

function getAllPosts() {
  return staticPosts.concat(getDynamicPosts());
}

function sortPosts(posts, sortBy) {
  return posts.slice().sort(function(a, b) {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

function groupPostsByTime(posts) {
  var groups = {};
  posts.forEach(function(post) {
    var d = new Date(post.createdAt);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var monthKey = year + '-' + (month < 10 ? '0' : '') + month;
    var monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
    if (!groups[year]) groups[year] = {};
    if (!groups[year][monthKey]) groups[year][monthKey] = { name: monthNames[month - 1], posts: [] };
    groups[year][monthKey].posts.push(post);
  });
  return groups;
}

function toggleYear(year) {
  expandedYears[year] = !expandedYears[year];
  renderTimeline();
}

function toggleMonth(key) {
  expandedMonths[key] = !expandedMonths[key];
  renderTimeline();
}

function renderTimeline() {
  var container = document.getElementById('postsContainer');
  var filtered = getAllPosts();

  if (currentFilter !== 'all') {
    filtered = filtered.filter(function(p) { return p.tags.includes(currentFilter); });
  }
  if (currentSearch) {
    var q = currentSearch.toLowerCase();
    filtered = filtered.filter(function(p) {
      return p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(function(t) { return t.includes(q); });
    });
  }

  filtered = sortPosts(filtered, currentSort);
  var groups = groupPostsByTime(filtered);
  var years = Object.keys(groups).sort(function(a, b) { return b - a; });

  if (years.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">\uD83D\uDEF8</div><p>未找到匹配的日志记录</p></div>';
    renderPagination({ page: 1, totalPages: 0, total: 0 });
    return;
  }

  var totalCount = filtered.length;
  container.innerHTML = '<div class="timeline-stats">共 ' + totalCount + ' 篇日志 · ' + years.length + ' 个年份</div>' +
    '<div class="timeline-tree">' +
    years.map(function(year) {
      var yearExpanded = expandedYears[year] !== false;
      var months = Object.keys(groups[year]).sort().reverse();
      var yearCount = months.reduce(function(sum, mk) { return sum + groups[year][mk].posts.length; }, 0);

      var monthsHtml = months.map(function(mk) {
        var m = groups[year][mk];
        var monthExpanded = expandedMonths[mk] !== false;
        var postsHtml = m.posts.map(function(post) {
          var href = post.isStatic ? 'posts/' + post.id + '.html' : 'post.html?id=' + post.id;
          var tagsHtml = post.tags.map(function(t) {
            return '<span class="tl-tag">' + t.toUpperCase() + '</span>';
          }).join('');
          var pinnedBadge = post.pinned ? '<span class="tl-pinned">PINNED</span>' : '';
          return '<a href="' + href + '" class="tl-post">' +
            '<div class="tl-post-dot"></div>' +
            '<div class="tl-post-content">' +
              '<div class="tl-post-meta">' + pinnedBadge + '<span class="tl-post-date">' + post.date + '</span><span class="tl-post-time">\u23F1 ' + post.readTime + '</span></div>' +
              '<h3 class="tl-post-title">' + escapeHtml(post.title) + '</h3>' +
              '<p class="tl-post-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
              '<div class="tl-post-tags">' + tagsHtml + '</div>' +
            '</div>' +
          '</a>';
        }).join('');

        return '<div class="tl-month">' +
          '<div class="tl-month-header" onclick="toggleMonth(\'' + mk + '\')">' +
            '<span class="tl-month-arrow ' + (monthExpanded ? 'expanded' : '') + '">\u25B6</span>' +
            '<span class="tl-month-name">' + m.name + '</span>' +
            '<span class="tl-month-count">' + m.posts.length + ' 篇</span>' +
          '</div>' +
          '<div class="tl-month-posts ' + (monthExpanded ? 'expanded' : '') + '">' + postsHtml + '</div>' +
        '</div>';
      }).join('');

      return '<div class="tl-year">' +
        '<div class="tl-year-header" onclick="toggleYear(' + year + ')">' +
          '<span class="tl-year-arrow ' + (yearExpanded ? 'expanded' : '') + '">\u25B6</span>' +
          '<span class="tl-year-name">' + year + '</span>' +
          '<span class="tl-year-count">' + yearCount + ' 篇</span>' +
        '</div>' +
        '<div class="tl-year-months ' + (yearExpanded ? 'expanded' : '') + '">' + monthsHtml + '</div>' +
      '</div>';
    }).join('') +
    '</div>';

  renderPagination({ page: 1, totalPages: 1, total: totalCount });
}

function renderPosts(filter, search) {
  filter = filter || 'all';
  search = search || '';
  currentFilter = filter;
  currentSearch = search;

  if (currentView === 'timeline') {
    renderTimeline();
    return;
  }

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

  filtered = sortPosts(filtered, currentSort);
  var paginated = paginatePosts(filtered, currentPage);

  if (paginated.items.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">\uD83D\uDEF8</div><p>未找到匹配的日志记录</p></div>';
    renderPagination({ page: 1, totalPages: 0, total: 0 });
    return;
  }

  container.innerHTML = paginated.items.map(function(post) {
    var href = post.isStatic ? 'posts/' + post.id + '.html' : 'post.html?id=' + post.id;
    var tagsHtml = post.tags.map(function(t) {
      return '<span class="post-tag">' + t.toUpperCase() + '</span>';
    }).join('');
    var pinnedBadge = post.pinned ? '<span class="post-pinned">PINNED</span>' : '';
    return '<a href="' + href + '" class="post-card">' +
      '<div class="post-meta">' +
        pinnedBadge +
        '<span class="post-date">' + post.date + '</span>' +
        '<div class="post-tags">' + tagsHtml + '</div>' +
        '<span class="post-read-time">\u23F1 ' + post.readTime + '</span>' +
      '</div>' +
      '<h2>' + escapeHtml(post.title) + '</h2>' +
      '<p class="post-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
      '<span class="read-more">READ MORE</span>' +
    '</a>';
  }).join('');

  renderPagination(paginated);
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelector('.view-btn[data-view="' + view + '"]').classList.add('active');
  renderPosts(currentFilter, currentSearch);
}

document.addEventListener('DOMContentLoaded', function() {
  renderPosts();

  document.querySelectorAll('.tag-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tag-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentPage = 1;
      renderPosts(btn.getAttribute('data-tag'), document.getElementById('searchInput').value);
    });
  });

  document.getElementById('searchInput').addEventListener('input', function(e) {
    var activeTag = document.querySelector('.tag-btn.active');
    currentPage = 1;
    renderPosts(activeTag ? activeTag.getAttribute('data-tag') : 'all', e.target.value);
  });

  var sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      currentSort = this.value;
      currentPage = 1;
      renderPosts(currentFilter, currentSearch);
    });
  }

  document.querySelectorAll('.view-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      switchView(btn.getAttribute('data-view'));
    });
  });

  createStarfield(document.getElementById('starfield'), 150);
  initCursorGlow();
  loadCustomBg();
});
