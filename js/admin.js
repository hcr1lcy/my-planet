var deleteTargetId = null;

function renderPosts() {
  var posts = getPosts();
  var list = document.getElementById('postList');
  var published = posts.filter(function(p) { return p.status === 'published'; }).length;
  var drafts = posts.filter(function(p) { return p.status === 'draft'; }).length;

  document.getElementById('totalCount').textContent = posts.length;
  document.getElementById('publishedCount').textContent = published;
  document.getElementById('draftCount').textContent = drafts;

  if (posts.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="icon">\uD83D\uDCE1</div><p>还没有任何文章<br>点击 "NEW POST" 开始创作</p></div>';
    return;
  }

  list.innerHTML = posts.sort(function(a, b) { return b.updatedAt - a.updatedAt; }).map(function(post) {
    var tagsStr = (post.tags || []).map(function(t) { return t.toUpperCase(); }).join(', ') || '无标签';
    var commentCount = (post.comments || []).length;
    var statusLabel = post.status === 'published' ? '\u2705 已发布' : '\uD83D\uDCDD 草稿';
    return '<div class="post-item">' +
      '<div class="post-status ' + post.status + '"></div>' +
      '<div class="post-info">' +
        '<h3>' + escapeHtml(post.title) + '</h3>' +
        '<div class="meta">' +
          '<span>\uD83D\uDCC5 ' + formatDate(post.updatedAt) + '</span>' +
          '<span>\uD83C\uDFF7 ' + tagsStr + '</span>' +
          '<span>\uD83D\uDCAC ' + commentCount + ' 条评论</span>' +
          '<span>' + statusLabel + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="post-actions">' +
        '<a href="editor.html?id=' + post.id + '" class="btn-edit">编辑</a>' +
        (post.status === 'published' ? '<a href="post.html?id=' + post.id + '" class="btn-view" target="_blank">查看</a>' : '') +
        '<button class="btn-delete" onclick="openDeleteModal(\'' + post.id + '\')">删除</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').classList.add('show');
}

function closeModal() {
  deleteTargetId = null;
  document.getElementById('deleteModal').classList.remove('show');
}

function confirmDelete() {
  if (!deleteTargetId) return;
  var posts = getPosts();
  posts = posts.filter(function(p) { return p.id !== deleteTargetId; });
  savePosts(posts);
  Storage.autoBackup();
  closeModal();
  renderPosts();
}

function loadBgSettings() {
  var bg = localStorage.getItem('planet_bg');
  var preview = document.getElementById('bgPreview');
  var urlInput = document.getElementById('bgUrl');
  if (bg) {
    preview.style.backgroundImage = 'url(' + bg + ')';
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
    preview.innerHTML = '';
    urlInput.value = bg.startsWith('data:') ? '(已上传本地图片)' : bg;
    urlInput.disabled = bg.startsWith('data:');
  }
}

function applyBgUrl() {
  var url = document.getElementById('bgUrl').value.trim();
  if (!url || url === '(已上传本地图片)') return;
  try {
    localStorage.setItem('planet_bg', url);
    loadBgSettings();
    showToast('背景已应用');
  } catch (err) {
    alert('保存失败：' + err.message);
  }
}

function handleBgFile(e) {
  var file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return; }
  if (file.size > 1.5 * 1024 * 1024) { alert('图片不能超过 1.5MB'); return; }
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      localStorage.setItem('planet_bg', ev.target.result);
      loadBgSettings();
      showToast('背景已保存 (' + Math.round(file.size / 1024) + 'KB)');
    } catch (err) {
      alert('保存失败：' + err.message);
    }
  };
  reader.readAsDataURL(file);
}

function resetBg() {
  localStorage.removeItem('planet_bg');
  document.getElementById('bgPreview').style.backgroundImage = 'none';
  document.getElementById('bgPreview').innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">当前背景预览</span>';
  document.getElementById('bgUrl').value = '';
  showToast('已恢复默认背景');
}

function exportData() {
  Storage.downloadExport();
  showToast('数据已导出');
}

function importData(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    var result = Storage.importData(ev.target.result);
    if (result.success) {
      showToast('已导入 ' + result.imported + ' 项数据');
      renderPosts();
    } else {
      alert('导入失败：' + result.error);
    }
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', function() {
  renderPosts();
  loadBgSettings();
  createStarfield(document.getElementById('starfield'), 100);
  initCursorGlow();
  loadCustomBg();
  document.getElementById('bgFile').addEventListener('change', handleBgFile);
});
