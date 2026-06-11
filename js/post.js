function renderPost(post) {
  document.title = post.title + ' | My Planet';
  var postArea = document.getElementById('postArea');
  var tagsHtml = (post.tags || []).map(function(t) {
    return '<span class="article-tag">' + escapeHtml(t.toUpperCase()) + '</span>';
  }).join('');

  postArea.innerHTML =
    '<article class="article-header">' +
      '<a href="blog.html" class="back-link">\u2190 返回日志列表</a>' +
      '<div class="article-meta">' +
        '<span class="article-date">' + formatDate(post.createdAt) + '</span>' +
        '<div class="article-tags">' + tagsHtml + '</div>' +
      '</div>' +
      '<h1>' + escapeHtml(post.title) + '</h1>' +
    '</article>' +
    '<div class="article-content">' + markdownToHtml(post.content) + '</div>' +
    '<div class="comments-section">' +
      '<div class="comments-title">COMMENTS <span class="comments-count" id="commentCount">' + (post.comments || []).length + '</span></div>' +
      '<div class="comment-form">' +
        '<div class="comment-form-row"><input type="text" id="commentName" placeholder="你的名字"></div>' +
        '<textarea id="commentContent" placeholder="写下你的评论..."></textarea>' +
        '<button class="btn-submit" onclick="addComment()">发送</button>' +
      '</div>' +
      '<div class="comment-list" id="commentList"></div>' +
    '</div>';

  renderComments(post);
}

function renderComments(post) {
  var list = document.getElementById('commentList');
  var comments = post.comments || [];
  document.getElementById('commentCount').textContent = comments.length;

  if (comments.length === 0) {
    list.innerHTML = '<div class="no-comments">还没有评论，来说点什么吧</div>';
    return;
  }

  list.innerHTML = comments.sort(function(a, b) { return b.time - a.time; }).map(function(c, i) {
    return '<div class="comment-item">' +
      '<button class="comment-delete" onclick="deleteComment(' + i + ')\">\u2715</button>' +
      '<div class="comment-header">' +
        '<div class="comment-avatar">' + escapeHtml(c.name.charAt(0).toUpperCase()) + '</div>' +
        '<span class="comment-author">' + escapeHtml(c.name) + '</span>' +
        '<span class="comment-time">' + formatDateTime(c.time) + '</span>' +
      '</div>' +
      '<div class="comment-body">' + escapeHtml(c.content) + '</div>' +
    '</div>';
  }).join('');
}

function addComment() {
  var name = document.getElementById('commentName').value.trim();
  var content = document.getElementById('commentContent').value.trim();
  if (!name || !content) return;

  var params = new URLSearchParams(window.location.search);
  var postId = params.get('id');
  var posts = getPosts();
  var idx = posts.findIndex(function(p) { return p.id === postId; });
  if (idx === -1) return;

  if (!posts[idx].comments) posts[idx].comments = [];
  posts[idx].comments.push({ name: name, content: content, time: Date.now() });
  savePosts(posts);
  renderPost(posts[idx]);
  document.getElementById('commentContent').value = '';
}

function deleteComment(index) {
  var params = new URLSearchParams(window.location.search);
  var postId = params.get('id');
  var posts = getPosts();
  var idx = posts.findIndex(function(p) { return p.id === postId; });
  if (idx === -1) return;
  posts[idx].comments.splice(index, 1);
  savePosts(posts);
  renderPost(posts[idx]);
}

document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var postId = params.get('id');
  var postArea = document.getElementById('postArea');

  if (!postId) {
    postArea.innerHTML = '<div class="not-found"><div class="icon">\uD83D\uDCE1</div><p>未指定文章</p></div>';
    return;
  }

  var posts = getPosts();
  var post = posts.find(function(p) { return p.id === postId; });
  if (!post) {
    postArea.innerHTML = '<div class="not-found"><div class="icon">\uD83D\uDEF8</div><p>文章未找到</p></div>';
    return;
  }

  renderPost(post);
  createStarfield(document.getElementById('starfield'), 120);
  initCursorGlow();
  loadCustomBg();
});
