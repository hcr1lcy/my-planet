var Animations = {
  init: function() {
    this.initSectionObserver();
    this.initPageTransition();
  },

  initSectionObserver: function() {
    var sections = document.querySelectorAll('.fade-in-section');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(function(section) {
      observer.observe(section);
    });
  },

  initPageTransition: function() {
    document.body.classList.add('page-transition');
  }
};
