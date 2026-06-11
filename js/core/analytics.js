var Analytics = {
  VIEWS_KEY: 'planet_views',

  recordView: function(postId) {
    var views = this.getViews();
    views.push({ id: postId, time: Date.now() });
    try {
      localStorage.setItem(this.VIEWS_KEY, JSON.stringify(views));
    } catch (e) {
      console.warn('记录浏览失败:', e);
    }
  },

  getViews: function() {
    try {
      return JSON.parse(localStorage.getItem(this.VIEWS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  getTotalViews: function() {
    return this.getViews().length;
  },

  getViewsByPost: function() {
    var views = this.getViews();
    var counts = {};
    views.forEach(function(v) {
      counts[v.id] = (counts[v.id] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(function(a, b) { return b[1] - a[1]; })
      .slice(0, 5);
  },

  getViewsByDate: function(days) {
    var views = this.getViews();
    var cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    var counts = {};
    views.filter(function(v) { return v.time > cutoff; }).forEach(function(v) {
      var date = new Date(v.time).toISOString().slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  },

  drawChart: function(canvasId, days) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var data = this.getViewsByDate(days);
    var dates = Object.keys(data).sort();
    var values = dates.map(function(d) { return data[d]; });
    var max = Math.max.apply(null, values.concat([1]));

    var w = canvas.width;
    var h = canvas.height;
    var padding = 40;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padding + (h - padding * 2) * i / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    if (dates.length < 2) return;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    dates.forEach(function(date, i) {
      var x = padding + (w - padding * 2) * i / (dates.length - 1);
      var y = h - padding - (values[i] / max) * (h - padding * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
};
