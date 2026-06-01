(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof IntersectionObserver === 'undefined') return;

  document.documentElement.classList.add('reveal-on');

  function init() {
    try {
      var cont = document.getElementById('main-cont');
      if (!cont) return;

      var targets = [];

      Array.from(cont.children).forEach(function (el) {
        if (el.tagName === 'H1') return;
        if (el.id === 'footer') return;
        var style = el.getAttribute('style') || '';
        if (style.indexOf('height') !== -1 && el.children.length === 0) return;

        if (el.classList.contains('timeline')) {
          Array.from(el.querySelectorAll('.timeline-entry')).forEach(function (entry) {
            targets.push(entry);
          });
        } else {
          targets.push(el);
        }
      });

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      targets.forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
      });
    } catch (e) {
      document.documentElement.classList.remove('reveal-on');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
