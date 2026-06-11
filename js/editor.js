var currentPost = null;

function save(status) {
  var title = document.getElementById('postTitle').value.trim();
  var content = document.getElementById('postContent').value.trim();
  var tagsStr = document.getElementById('postTags').value.trim();
  var tags = tagsStr ? tagsStr.split(/[,，]/).map(function(t) { return t.trim().toLowerCase(); }).filter(Boolean) : [];

  if (!title) { showToast('请输入标题'); return; }
  if (!content) { showToast('请输入内容'); return; }

  var posts = getPosts();

  if (currentPost) {
    var idx = posts.findIndex(function(p) { return p.id === currentPost.id; });
    if (idx !== -1) {
      posts[idx] = Object.assign({}, posts[idx], { title: title, content: content, tags: tags, status: status, updatedAt: Date.now() });
    }
  } else {
    var newPost = {
      id: generateId(), title: title, content: content, tags: tags, status: status,
      createdAt: Date.now(), updatedAt: Date.now(), comments: []
    };
    posts.unshift(newPost);
    currentPost = newPost;
  }

  savePosts(posts);
  Storage.autoBackup();
  showToast(status === 'published' ? '已发布！' : '草稿已保存');
}

function switchTab(tab) {
  document.querySelectorAll('.editor-tab').forEach(function(t) { t.classList.remove('active'); });
  var textarea = document.getElementById('postContent');
  var preview = document.getElementById('previewArea');

  if (tab === 'edit') {
    document.querySelectorAll('.editor-tab')[0].classList.add('active');
    textarea.style.display = 'block';
    preview.style.display = 'none';
  } else {
    document.querySelectorAll('.editor-tab')[1].classList.add('active');
    textarea.style.display = 'none';
    preview.style.display = 'block';
    preview.innerHTML = markdownToHtml(textarea.value);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var editId = params.get('id');

  if (editId) {
    var posts = getPosts();
    currentPost = posts.find(function(p) { return p.id === editId; });
    if (currentPost) {
      document.getElementById('editorTitle').textContent = '// EDIT POST';
      document.getElementById('postTitle').value = currentPost.title;
      document.getElementById('postTags').value = (currentPost.tags || []).join(', ');
      document.getElementById('postContent').value = currentPost.content;
    }
  }

  createStarfield(document.getElementById('starfield'), 80);
  loadCustomBg();
});
