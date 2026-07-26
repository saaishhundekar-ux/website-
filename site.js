// ISIRI Seeds — shared behaviour for all pages

// Mobile menu
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('nav');
  var backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !nav) return;

  function closeMenu() {
    toggle.classList.remove('open');
    nav.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var opening = !nav.classList.contains('open');
    toggle.classList.toggle('open', opening);
    nav.classList.toggle('open', opening);
    if (backdrop) backdrop.classList.toggle('show', opening);
    toggle.setAttribute('aria-expanded', String(opening));
  });

  if (backdrop) backdrop.addEventListener('click', closeMenu);
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
})();

// Header shadow on scroll
window.addEventListener('scroll', function () {
  var header = document.querySelector('header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

// Highlight current page in nav
(function () {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
})();

// Reveal-on-scroll animations
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { observer.observe(el); });
})();

// Homepage hero background slider
(function () {
  var slider = document.querySelector('.hero-slider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.hs-slide');
  if (!slides.length) return;
  var dotsWrap = slider.querySelector('.hs-dots');
  var label = slider.querySelector('.hs-croplabel span');
  var current = 0;
  var timer = null;
  var dots = [];

  if (dotsWrap) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { show(i); restart(); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function show(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    if (label) label.textContent = slides[current].getAttribute('data-label') || '';
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { show(current + 1); }, 5000);
  }

  var prev = slider.querySelector('.hs-prev');
  var next = slider.querySelector('.hs-next');
  if (prev) prev.addEventListener('click', function () { show(current - 1); restart(); });
  if (next) next.addEventListener('click', function () { show(current + 1); restart(); });

  restart();
})();

// Gallery lightbox (runs only on gallery page)
(function () {
  var lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  var lightboxImg = lightbox.querySelector('img');
  var closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    img.parentElement.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

// Contact form success banner (?sent=1 after FormSubmit redirect)
(function () {
  var banner = document.querySelector('.form-success');
  if (!banner) return;
  if (new URLSearchParams(window.location.search).get('sent') === '1') {
    banner.classList.add('show');
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
