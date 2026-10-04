(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach(function (el) {
    var delay = el.getAttribute('data-delay');
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    var to = parseInt(el.getAttribute('data-to'), 10) || 0;
    if (reduced) { el.textContent = to; return; }
    var dur = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-to'); });
  }

  /* ---------- Header state ---------- */
  var header = document.getElementById('header');
  var fab = document.querySelector('.fab');

  function onScroll() {
    var y = window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 24);
    if (fab) fab.classList.toggle('is-visible', y > 620);
  }
  onScroll();

  /* ---------- Parallax ---------- */
  var pxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function applyParallax() {
    var vh = window.innerHeight;
    pxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
      var rect = el.getBoundingClientRect();
      var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }

  function handleScroll() {
    onScroll();
    if (!ticking && !reduced && window.innerWidth > 720) {
      ticking = true;
      requestAnimationFrame(applyParallax);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 720 || reduced) {
      pxEls.forEach(function (el) { el.style.transform = ''; });
    } else {
      applyParallax();
    }
  });
  if (!reduced && window.innerWidth > 720) applyParallax();

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
      }
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
      }
    });
  }

  /* ---------- Smooth scroll with sticky-header offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Lead form modal (Яндекс.Формы) ---------- */
  var modal = document.getElementById('formModal');
  var frame = document.getElementById('formFrame');
  var openers = document.querySelectorAll('[data-form-open]');
  var lastFocused = null;

  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    var src = frame && frame.getAttribute('data-src');

    if (location.protocol === 'file:' && src) {
      window.open(src, '_blank', 'noopener');
      return;
    }

    lastFocused = document.activeElement;
    if (frame && !frame.getAttribute('src')) {
      frame.setAttribute('src', src);
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var close = modal.querySelector('.modal__close');
    if (close) close.focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    setTimeout(function () {
      if (frame) frame.removeAttribute('src');
    }, 400);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  openers.forEach(function (el) {
    el.addEventListener('click', openModal);
  });

  if (modal) {
    modal.querySelectorAll('[data-form-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }
})();
