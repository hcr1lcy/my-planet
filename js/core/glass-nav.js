var GlassNav = {
  nav: null,
  lastScrollY: 0,
  ticking: false,

  init: function() {
    this.nav = document.querySelector('nav');
    if (!this.nav) return;
    this.nav.classList.add('nav-glass');
    this.bindEvents();
    this.onScroll();
  },

  bindEvents: function() {
    var self = this;

    window.addEventListener('scroll', function() {
      self.lastScrollY = window.scrollY;
      if (!self.ticking) {
        window.requestAnimationFrame(function() {
          self.onScroll();
          self.ticking = false;
        });
        self.ticking = true;
      }
    }, { passive: true });

    this.nav.addEventListener('mousemove', function(e) {
      var rect = self.nav.getBoundingClientRect();
      var x = e.clientX - rect.left;
      self.updateHighlight(x);
    });

    this.nav.addEventListener('mouseleave', function() {
      self.hideHighlight();
    });

    this.nav.addEventListener('click', function(e) {
      self.createRipple(e);
    });
  },

  onScroll: function() {
    var scrolled = window.scrollY > 50;
    if (scrolled) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  },

  updateHighlight: function(x) {
    document.documentElement.style.setProperty('--nav-highlight-x', x + 'px');
  },

  hideHighlight: function() {
    document.documentElement.style.setProperty('--nav-highlight-x', '-300px');
  },

  createRipple: function(e) {
    var ripple = document.createElement('span');
    ripple.className = 'nav-ripple';
    var rect = this.nav.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.nav.appendChild(ripple);
    ripple.addEventListener('animationend', function() {
      ripple.remove();
    });
  }
};

document.addEventListener('DOMContentLoaded', function() {
  GlassNav.init();
});
