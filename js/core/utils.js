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

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2500);
}
