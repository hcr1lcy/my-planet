var Storage = {
  KEYS: ['planet_posts', 'planet_bg', 'planet_admin_hash', 'planet_views'],

  exportAll: function() {
    var data = {};
    this.KEYS.forEach(function(key) {
      var val = localStorage.getItem(key);
      if (val !== null) data[key] = val;
    });
    data._exportTime = Date.now();
    return JSON.stringify(data, null, 2);
  },

  downloadExport: function() {
    var json = this.exportAll();
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'my-planet-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  importData: function(jsonString) {
    try {
      var data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: '无效数据格式' };
      }
      var imported = 0;
      var self = this;
      this.KEYS.forEach(function(key) {
        if (data[key]) {
          localStorage.setItem(key, data[key]);
          imported++;
        }
      });
      return { success: true, imported: imported };
    } catch (e) {
      return { success: false, error: 'JSON 解析失败: ' + e.message };
    }
  },

  autoBackup: function() {
    var posts = localStorage.getItem('planet_posts');
    if (posts) {
      try {
        localStorage.setItem('planet_posts_backup', posts);
      } catch (e) {
        console.warn('自动备份失败:', e);
      }
    }
  },

  restoreBackup: function() {
    var backup = localStorage.getItem('planet_posts_backup');
    if (!backup) return false;
    try {
      JSON.parse(backup);
      localStorage.setItem('planet_posts', backup);
      return true;
    } catch (e) {
      return false;
    }
  }
};
