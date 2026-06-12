var commentSpamKey = 'planet_comment_spam';
var SPAM_LIMIT = 3;
var SPAM_WINDOW = 5 * 60 * 1000;

function getCommentSpam() {
  try {
    return JSON.parse(localStorage.getItem(commentSpamKey) || '[]');
  } catch (e) {
    return [];
  }
}

function checkSpam() {
  var now = Date.now();
  var spam = getCommentSpam().filter(function(t) { return now - t < SPAM_WINDOW; });
  localStorage.setItem(commentSpamKey, JSON.stringify(spam));
  return spam.length >= SPAM_LIMIT;
}

function recordComment() {
  var spam = getCommentSpam();
  spam.push(Date.now());
  localStorage.setItem(commentSpamKey, JSON.stringify(spam));
}

function escapeMarkdownText(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderPost(post) {
  document.title = post.title + ' | My Planet';
  var postArea = document.getElementById('postArea');
  var tagsHtml = (post.tags || []).map(function(t) {
    return '<span class="article-tag">' + escapeHtml(t.toUpperCase()) + '</span>';
  }).join('');
  var wordCount = post.content.replace(/\s/g, '').length;
  var readTime = Math.max(1, Math.ceil(wordCount / 500));

  postArea.innerHTML =
    '<article class="article-header">' +
      '<a href="blog.html" class="back-link">\u2190 返回日志列表</a>' +
      '<div class="article-meta">' +
        '<span class="article-date">' + formatDate(post.createdAt) + '</span>' +
        '<span class="article-readtime">\u23F1 约 ' + readTime + ' 分钟 · ' + wordCount + ' 字</span>' +
        '<div class="article-tags">' + tagsHtml + '</div>' +
      '</div>' +
      '<h1>' + escapeHtml(post.title) + '</h1>' +
    '</article>' +
    '<div class="article-content">' + markdownToHtml(post.content) + '</div>' +
    '<div class="comments-section">' +
      '<div class="comments-title">COMMENTS <span class="comments-count" id="commentCount">' + (post.comments || []).length + '</span></div>' +
      '<div class="comment-form">' +
        '<div class="comment-form-row"><input type="text" id="commentName" placeholder="你的名字"></div>' +
        '<textarea id="commentContent" placeholder="写下你的评论... (支持 Markdown)"></textarea>' +
        '<div class="comment-form-hint">支持 **加粗**、*斜体*、`代码` 等 Markdown 语法</div>' +
        '<button class="btn-submit" onclick="addComment()">发送</button>' +
      '</div>' +
      '<div class="comment-list" id="commentList"></div>' +
    '</div>';

  renderComments(post);
}

function renderCommentItem(c, index, depth) {
  depth = depth || 0;
  var avatarChar = c.name ? c.name.charAt(0).toUpperCase() : '?';
  var bodyHtml = markdownToHtml(escapeMarkdownText(c.content));
  var reactions = c.reactions || {};
  var reactionKeys = ['👍', '❤️', '🔥'];
  var reactionsHtml = reactionKeys.map(function(r) {
    var count = reactions[r] || 0;
    return '<button class="reaction-btn' + (count > 0 ? ' active' : '') + '" onclick="addReaction(' + index + ', \'' + r + '\')">' + r + (count > 0 ? ' ' + count : '') + '</button>';
  }).join('');

  var replyBtn = depth < 2 ? '<button class="reply-btn" onclick="showReplyForm(' + index + ')">回复</button>' : '';
  var replyFormHtml = '<div class="reply-form" id="replyForm-' + index + '" style="display:none;">' +
    '<input type="text" id="replyName-' + index + '" placeholder="你的名字">' +
    '<textarea id="replyContent-' + index + '" placeholder="回复内容..."></textarea>' +
    '<button class="btn-submit" onclick="submitReply(' + index + ')">发送回复</button>' +
  '</div>';

  var children = (c.replies || []);
  var childrenHtml = children.map(function(reply, ri) {
    return renderCommentItem(reply, index + '_' + ri, depth + 1);
  }).join('');

  return '<div class="comment-item' + (depth > 0 ? ' comment-reply' : '') + '" data-index="' + index + '">' +
    '<button class="comment-delete" onclick="deleteComment(' + index + ')\">\u2715</button>' +
    '<div class="comment-header">' +
      '<div class="comment-avatar">' + avatarChar + '</div>' +
      '<span class="comment-author">' + escapeHtml(c.name) + '</span>' +
      '<span class="comment-time">' + formatDateTime(c.time) + '</span>' +
    '</div>' +
    '<div class="comment-body">' + bodyHtml + '</div>' +
    '<div class="comment-actions">' +
      '<div class="comment-reactions">' + reactionsHtml + '</div>' +
      replyBtn +
    '</div>' +
    replyFormHtml +
    (childrenHtml ? '<div class="comment-replies">' + childrenHtml + '</div>' : '') +
  '</div>';
}

function renderComments(post) {
  var list = document.getElementById('commentList');
  var comments = post.comments || [];
  document.getElementById('commentCount').textContent = comments.length;

  if (comments.length === 0) {
    list.innerHTML = '<div class="no-comments">还没有评论，来说点什么吧</div>';
    return;
  }

  var sorted = comments.slice().sort(function(a, b) { return b.time - a.time; });
  list.innerHTML = sorted.map(function(c, i) {
    return renderCommentItem(c, i, 0);
  }).join('');
}

function showReplyForm(index) {
  var form = document.getElementById('replyForm-' + index);
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
}

function submitReply(index) {
  var nameEl = document.getElementById('replyName-' + index);
  var contentEl = document.getElementById('replyContent-' + index);
  if (!nameEl || !contentEl) return;
  var name = nameEl.value.trim();
  var content = contentEl.value.trim();
  if (!name || !content) return;

  var params = new URLSearchParams(window.location.search);
  var postId = params.get('id');
  var posts = getPosts();
  var idx = posts.findIndex(function(p) { return p.id === postId; });
  if (idx === -1) return;

  var comment = posts[idx].comments[index];
  if (!comment.replies) comment.replies = [];
  comment.replies.push({ name: name, content: content, time: Date.now(), reactions: {}, replies: [] });

  savePosts(posts);
  renderPost(posts[idx]);
}

function addReaction(commentIndex, emoji) {
  var params = new URLSearchParams(window.location.search);
  var postId = params.get('id');
  var posts = getPosts();
  var idx = posts.findIndex(function(p) { return p.id === postId; });
  if (idx === -1) return;

  var comment = posts[idx].comments[commentIndex];
  if (!comment.reactions) comment.reactions = {};
  comment.reactions[emoji] = (comment.reactions[emoji] || 0) + 1;

  savePosts(posts);
  renderPost(posts[idx]);
}

function addComment() {
  var name = document.getElementById('commentName').value.trim();
  var content = document.getElementById('commentContent').value.trim();
  if (!name || !content) return;

  if (checkSpam()) {
    showToast('评论太频繁，请稍后再试');
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var postId = params.get('id');
  var posts = getPosts();
  var idx = posts.findIndex(function(p) { return p.id === postId; });
  if (idx === -1) return;

  if (!posts[idx].comments) posts[idx].comments = [];
  posts[idx].comments.push({ name: name, content: content, time: Date.now(), reactions: {}, replies: [] });
  savePosts(posts);
  recordComment();
  renderPost(posts[idx]);
  document.getElementById('commentContent').value = '';
  showToast('评论已发送');
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
  Analytics.recordView(postId);
  createStarfield(document.getElementById('starfield'), 120);
  initCursorGlow();
  loadCustomBg();
});
