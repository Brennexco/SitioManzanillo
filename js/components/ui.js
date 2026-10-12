/* ui.js — utilidades de interfaz: toast, modal, revelado, contadores, menú, lightbox */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  window.$ = $; window.$$ = $$;

  /* Toast */
  var tt;
  window.toast = function (msg) { var t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2800); };

  /* Modal */
  window.openModal = function (html) { var m = $('#modal'); $('#modal-body').innerHTML = html; m.classList.add('on'); document.body.style.overflow = 'hidden'; var x = $('.modal-x', m); if (x) x.focus(); };
  window.closeModal = function () { var m = $('#modal'); if (m) m.classList.remove('on'); document.body.style.overflow = document.body.classList.contains('map-page') ? 'hidden' : ''; };
  document.addEventListener('click', function (e) { var m = $('#modal'); if (m && (e.target === m || e.target.hasAttribute('data-close'))) window.closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.closeModal(); });

  /* Descarga de archivos / blobs */
  window.saveAs = function (name, data) {
    var a = document.createElement('a'), url = typeof data === 'string' ? data : URL.createObjectURL(data);
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    if (typeof data !== 'string') setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };
  window.slug = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };

  /* Menú móvil, encabezado con scroll y botón "subir" */
  function initNav() {
    var t = $('#nav-toggle'), body = document.body;
    if (t) {
      t.addEventListener('click', function () { var o = body.classList.toggle('nav-open'); t.setAttribute('aria-expanded', o); });
      $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { body.classList.remove('nav-open'); }); });
    }
    var h = $('#site-header'), up = $('#to-top');
    var on = function () { var y = window.pageYOffset; if (h) h.classList.toggle('scrolled', y > 10); if (up) up.classList.toggle('on', y > 700); };
    window.addEventListener('scroll', on, { passive: true }); on();
    if (up) up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* Revelado al hacer scroll */
  function initReveal() {
    var els = $$('.reveal'); if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Contadores animados: <span data-count="120" data-suffix="+"> */
  function initCounters() {
    var els = $$('[data-count]'); if (!els.length) return;
    var run = function (el) {
      var to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null, dur = 1400;
      var step = function (t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e) + suf; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }); }, { threshold: .5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Lightbox reutilizable: openLightbox(items, index) con items = [{src,title,meta,video}] */
  var LB = { items: [], i: 0 };
  function lbBuild() {
    if ($('#lightbox')) return;
    document.body.insertAdjacentHTML('beforeend',
      '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Galería"><button class="lb-x" aria-label="Cerrar">✕</button>' +
      '<div class="lb-stage"><button class="lb-nav lb-prev" aria-label="Anterior">‹</button><div id="lb-media"></div><button class="lb-nav lb-next" aria-label="Siguiente">›</button></div>' +
      '<div class="lb-info" id="lb-info"></div><div class="lb-thumbs" id="lb-thumbs"></div></div>');
    var lb = $('#lightbox');
    $('.lb-x', lb).onclick = window.closeLightbox; $('.lb-prev', lb).onclick = function () { window.lbGo(-1); }; $('.lb-next', lb).onclick = function () { window.lbGo(1); };
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) window.closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') window.closeLightbox(); if (e.key === 'ArrowRight') window.lbGo(1); if (e.key === 'ArrowLeft') window.lbGo(-1); });
    var sx = null; lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var d = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(d) > 50) window.lbGo(d < 0 ? 1 : -1); }, { passive: true });
  }
  function lbShow() {
    var it = LB.items[LB.i]; if (!it) return;
    $('#lb-media').innerHTML = it.video ? '<video src="' + it.video + '" poster="' + it.src + '" controls autoplay playsinline></video>' : '<img src="' + it.src + '" alt="' + (it.title || '') + '">';
    $('#lb-info').innerHTML = (it.title || '') + '<small>' + (LB.i + 1) + ' / ' + LB.items.length + (it.meta ? ' · ' + it.meta : '') + '</small>';
    $$('#lb-thumbs img').forEach(function (t, j) { t.classList.toggle('on', j === LB.i); if (j === LB.i) t.scrollIntoView({ block: 'nearest', inline: 'center' }); });
    var many = LB.items.length > 1; $('.lb-prev').style.display = $('.lb-next').style.display = many ? '' : 'none';
  }
  window.openLightbox = function (items, i) {
    lbBuild(); LB.items = items; LB.i = i || 0;
    $('#lb-thumbs').innerHTML = items.map(function (it, j) { return '<img src="' + it.src + '" alt="" data-i="' + j + '">'; }).join('');
    $$('#lb-thumbs img').forEach(function (t) { t.onclick = function () { LB.i = +t.dataset.i; lbShow(); }; });
    $('#lightbox').classList.add('on'); document.body.style.overflow = 'hidden'; lbShow();
  };
  window.lbGo = function (d) { LB.i = (LB.i + d + LB.items.length) % LB.items.length; lbShow(); };
  window.closeLightbox = function () { var l = $('#lightbox'); if (l) { l.classList.remove('on'); var v = $('video', l); if (v) v.pause(); } document.body.style.overflow = ''; };

  document.addEventListener('DOMContentLoaded', function () { initNav(); initReveal(); initCounters(); });
})();
