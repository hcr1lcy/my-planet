document.addEventListener('DOMContentLoaded', function() {
  createStarfield(document.getElementById('starfield'), 200);
  initCursorGlow();
  loadCustomBg();
  ThemeManager.init();
  Animations.init();

  // 数字递增动画
  function animateNumbers() {
    document.querySelectorAll('.stat-number').forEach(function(el) {
      var target = +el.getAttribute('data-target');
      var duration = 2000;
      var start = performance.now();
      function update(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + '+';
      }
      requestAnimationFrame(update);
    });
  }

  // 技能条动画
  function animateSkillBars() {
    document.querySelectorAll('.skill-fill').forEach(function(bar) {
      var rect = bar.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        bar.style.width = bar.getAttribute('data-width') + '%';
      }
    });
  }

  // Intersection Observer
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (entry.target.querySelector('.stat-number')) animateNumbers();
        animateSkillBars();
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section').forEach(function(s) { observer.observe(s); });

  // 导航平滑滚动
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 卡片浮动效果
  document.querySelectorAll('.card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-5px) perspective(500px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'translateY(0) perspective(500px) rotateY(0) rotateX(0)';
    });
  });
});
