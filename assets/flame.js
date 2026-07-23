/* Lumisca — premium interactions (flame.js)
   Progressive enhancement only: with JS off, everything is visible/usable. */
(function () {
  var root = document.documentElement;
  root.classList.add('flame-js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ---- Scroll reveal ---- */
    var revealEls = [].slice.call(document.querySelectorAll('.flame-reveal'));
    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ---- Header: transparent -> solid on scroll ---- */
    var hd = document.querySelector('[data-flame-header]');
    if (hd) {
      var onScroll = function () {
        if (window.scrollY > 40) hd.classList.add('is-scrolled');
        else hd.classList.remove('is-scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Mobile drawer ---- */
    var burger = document.querySelector('[data-flame-burger]');
    var drawer = document.querySelector('[data-flame-drawer]');
    if (burger && drawer) {
      var panel = drawer.querySelector('.flame-drawer__panel') || drawer;
      var getFocusable = function () {
        return [].slice.call(panel.querySelectorAll('a[href],button:not([disabled])'))
          .filter(function (el) { return el.offsetParent !== null; });
      };
      var toggle = function (open) {
        var isOpen = open === undefined ? !drawer.classList.contains('is-open') : open;
        drawer.classList.toggle('is-open', isOpen);
        burger.classList.toggle('is-open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen) { var f = getFocusable(); if (f.length) f[0].focus(); }
        else { burger.focus(); }
      };
      burger.addEventListener('click', function () { toggle(); });
      drawer.addEventListener('click', function (e) {
        if (e.target === drawer || e.target.hasAttribute('data-flame-drawer-close') || e.target.closest('a')) toggle(false);
      });
      document.addEventListener('keydown', function (e) {
        if (!drawer.classList.contains('is-open')) return;
        if (e.key === 'Escape') { toggle(false); return; }
        if (e.key === 'Tab') {
          var f = getFocusable();
          if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    /* ---- Announcement rotator (fade) ---- */
    var ann = document.querySelector('[data-flame-announce]');
    if (ann) {
      var items = [].slice.call(ann.querySelectorAll('.flame-announce__item'));
      if (items.length > 1) {
        var i = 0;
        setInterval(function () {
          items[i].classList.remove('is-active');
          i = (i + 1) % items.length;
          items[i].classList.add('is-active');
        }, 4000);
      }
    }
  });
})();
