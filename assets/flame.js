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
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
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
      var toggle = function (open) {
        var isOpen = open === undefined ? !drawer.classList.contains('is-open') : open;
        drawer.classList.toggle('is-open', isOpen);
        burger.classList.toggle('is-open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      };
      burger.addEventListener('click', function () { toggle(); });
      drawer.addEventListener('click', function (e) {
        if (e.target === drawer || e.target.hasAttribute('data-flame-drawer-close') || e.target.closest('a')) toggle(false);
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
    }

    /* ---- Reviews marquee: auto-scroll, pause on hover/drag ---- */
    var track = document.querySelector('[data-flame-marquee]');
    if (track && !reduce) {
      var speed = 0.4; // px per frame
      var paused = false;
      var raf;
      // duplicate content for a seamless loop
      track.innerHTML += track.innerHTML;
      var step = function () {
        if (!paused) {
          track.scrollLeft += speed;
          if (track.scrollLeft >= track.scrollWidth / 2) track.scrollLeft -= track.scrollWidth / 2;
        }
        raf = requestAnimationFrame(step);
      };
      track.addEventListener('mouseenter', function () { paused = true; });
      track.addEventListener('mouseleave', function () { paused = false; });
      track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
      track.addEventListener('touchend', function () { paused = false; }, { passive: true });
      raf = requestAnimationFrame(step);
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
