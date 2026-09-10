(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Active nav highlighting
     ------------------------------------------------------------------ */
  function setActiveNav() {
    var links = document.querySelectorAll('.nav-link');
    var path = location.pathname.toLowerCase();
    var current = (path.split('/').pop() || 'index.html');
    if (current === '') current = 'index.html';
    var inProjectDetail = path.indexOf('/projects/') !== -1;

    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var hrefFile = href.split('/').pop().toLowerCase();
      var isMatch = hrefFile === current;
      var isProjectsWhileInDetail = inProjectDetail && hrefFile === 'projects.html';

      if (isMatch || isProjectsWhileInDetail) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  function setFooterYear() {
    var el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     Local time readout
     ------------------------------------------------------------------ */
  function startClock() {
    var el = document.getElementById('localTime');
    if (!el) return;

    function tick() {
      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();
      var s = now.getSeconds();
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      el.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
     Mobile hamburger menu
     ------------------------------------------------------------------ */
  function initHamburger() {
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------
     Page fade transition on internal link navigation
     ------------------------------------------------------------------ */
  function initPageTransitions() {
    if (!prefersReducedMotion) {
      document.body.classList.add('page-fade-in');
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;
      if (href.charAt(0) === '#') return;
      if (link.hasAttribute('download')) return;
      if (link.target && link.target !== '' && link.target !== '_self') return;
      if (link.hasAttribute('rel') && link.getAttribute('rel').indexOf('external') !== -1) return;

      var url;
      try {
        url = new URL(href, location.href);
      } catch (err) {
        return;
      }

      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;

      if (prefersReducedMotion) return;

      e.preventDefault();
      document.body.classList.add('page-fade-out');
      setTimeout(function () {
        location.href = url.href;
      }, 200);
    });
  }

  /* ------------------------------------------------------------------
     Boot sequence splash (first visit per session only)
     ------------------------------------------------------------------ */
  function initSplash() {
    var alreadyShown;
    try {
      alreadyShown = sessionStorage.getItem('splashShown');
    } catch (err) {
      alreadyShown = 'true';
    }

    if (alreadyShown) return;

    try {
      sessionStorage.setItem('splashShown', 'true');
    } catch (err) {}

    var splash = document.createElement('div');
    splash.id = 'splash-screen';

    var inner = document.createElement('div');
    inner.className = 'splash-inner';
    splash.appendChild(inner);
    document.body.appendChild(splash);

    var lines = [
      { text: 'system check: ok', className: 'splash-line' },
      { text: 'loading portfolio...', className: 'splash-line' },
      { text: 'Welcome to my portfolio', className: 'splash-line splash-welcome' }
    ];

    function finishAndRemove() {
      setTimeout(function () {
        splash.classList.add('is-hidden');
        setTimeout(function () {
          if (splash.parentNode) splash.parentNode.removeChild(splash);
        }, 550);
      }, 700);
    }

    if (prefersReducedMotion) {
      lines.forEach(function (line) {
        var p = document.createElement('p');
        p.className = line.className;
        p.textContent = line.text;
        inner.appendChild(p);
      });
      finishAndRemove();
      return;
    }

    var lineIndex = 0;
    var charIndex = 0;
    var typeSpeed = 32;

    function typeNextLine() {
      if (lineIndex >= lines.length) {
        var cursor = inner.querySelector('.splash-cursor');
        if (cursor) cursor.remove();
        finishAndRemove();
        return;
      }

      var lineDef = lines[lineIndex];
      var p = inner.querySelector('.splash-line[data-active="1"]');
      if (!p) {
        p = document.createElement('p');
        p.className = lineDef.className;
        p.setAttribute('data-active', '1');
        inner.appendChild(p);
        var cursor = document.createElement('span');
        cursor.className = 'splash-cursor';
        p.appendChild(cursor);
      }

      if (charIndex <= lineDef.text.length) {
        var cursorEl = p.querySelector('.splash-cursor');
        p.textContent = lineDef.text.slice(0, charIndex);
        if (cursorEl) p.appendChild(cursorEl);
        charIndex++;
        setTimeout(typeNextLine, typeSpeed);
      } else {
        p.removeAttribute('data-active');
        var finishedCursor = p.querySelector('.splash-cursor');
        if (finishedCursor) finishedCursor.remove();
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextLine, 260);
      }
    }

    typeNextLine();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    setFooterYear();
    startClock();
    initHamburger();
    initPageTransitions();
    initSplash();
  });
})();
