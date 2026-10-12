/* inicio.js */
(function () {
  /* Video del dron: si assets/video/drone-manzanillo.mp4 existe, se reproduce; si no, queda la imagen animada */
  var media = $('#hero-media'), vid = $('#hero-video'), tog = $('#video-toggle');
  if (vid) {
    var ok = function () { media.classList.add('playing'); if (tog) tog.hidden = false; };
    vid.addEventListener('playing', ok);
    var src = vid.querySelector('source'); if (src) src.addEventListener('error', function () { vid.remove(); });
    var p = vid.play && vid.play(); if (p && p.catch) p.catch(function () {});
    if (tog) tog.addEventListener('click', function () { if (vid.paused) { vid.play(); tog.textContent = '❚❚'; } else { vid.pause(); tog.textContent = '▶'; } });
  }
  var sh = $('#hud-share'); if (sh) sh.addEventListener('click', function () { var u = location.href.split('#')[0]; if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { toast('✅ Enlace copiado'); }, function () { prompt('Copia el enlace:', u); }); else prompt('Copia el enlace:', u); });

  /* Partículas suaves (efecto océano) */
  var cv = $('#hero-fx');
  if (cv && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    var ctx = cv.getContext('2d'), pts = [], W, H;
    var size = function () { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    size(); addEventListener('resize', size);
    for (var i = 0; i < 46; i++) pts.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .5, v: Math.random() * .0004 + .00015, a: Math.random() * .5 + .15 });
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(function (p) { p.y -= p.v; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); } ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 6.283); ctx.fillStyle = 'rgba(120,240,225,' + p.a + ')'; ctx.fill(); });
      if (!document.hidden) requestAnimationFrame(draw); else setTimeout(draw, 500);
    })();
  }

  /* Showcase interactivo */
  var SHOW = [
    { t: 'Visor geoespacial', d: 'Activa capas, mide distancias y áreas, consulta cada punto del territorio.', img: 'assets/img/mapas/visor-base.jpg', href: 'visor.html', cta: 'Abrir el visor' },
    { t: 'Modelos 3D', d: 'Explora playas, acantilados y perfiles costeros desde cualquier ángulo.', img: 'assets/img/modelos/playa-la-audiencia.jpg', href: 'modelos-3d.html', cta: 'Ver modelos' },
    { t: 'Línea del tiempo', d: 'Compara años con un deslizador y visualiza erosión y evolución territorial.', img: 'assets/img/timeline/litoral-b.jpg', href: 'linea-del-tiempo.html', cta: 'Comparar años' },
    { t: 'Vulnerabilidad costera', d: 'Mapas con índices y variables ambientales, recalculables en tiempo real.', img: 'assets/img/mapas/vulnerabilidad.jpg', href: 'vulnerabilidad.html', cta: 'Ver el análisis' }
  ];
  var tabs = $('#show-tabs'), view = $('#show-view'), cur = 0, timer;
  function showSet(i, user) {
    cur = i; var s = SHOW[i];
    $$('.show-tab', tabs).forEach(function (b, j) { b.classList.toggle('active', j === i); b.setAttribute('aria-selected', j === i); });
    view.innerHTML = '<img src="' + s.img + '" alt="' + s.t + '"><div class="show-cap"><div><h3>' + s.t + '</h3><p>' + s.d + '</p></div><a class="btn btn-primary btn-sm" href="' + s.href + '">' + s.cta + ' →</a></div>';
    clearTimeout(timer); if (!user) timer = setTimeout(function () { showSet((cur + 1) % SHOW.length); }, 6000);
  }
  if (tabs) {
    tabs.innerHTML = SHOW.map(function (s, i) { return '<button class="show-tab" role="tab"><h3>' + s.t + '</h3><p>' + s.d + '</p></button>'; }).join('');
    $$('.show-tab', tabs).forEach(function (b, i) { b.addEventListener('click', function () { showSet(i, true); }); });
    showSet(0);
  }

  /* Playas */
  var lv = VULN_LEVELS, grid = $('#beach-grid');
  if (grid) {
    grid.innerHTML = VULN_BEACHES.map(function (b, i) {
      var v = b.sub.reduce(function (a, c) { return a + c; }, 0) / b.sub.length, L = lv.filter(function (l) { return v < l[0]; })[0];
      return '<a class="beach card hover reveal" style="--c:' + L[2] + ';--w:' + (v * 100) + '%;--d:' + (i * .07) + 's" href="vulnerabilidad.html#' + slug(b.nombre) + '"><h3>' + b.nombre + '</h3>' +
        '<div class="score">' + v.toFixed(2) + ' <small>/ 1</small></div><div class="meter"><i></i></div>' +
        '<span class="pill" style="background:' + L[2] + ';align-self:flex-start">' + L[1] + '</span><span class="go">Ver ficha →</span></a>';
    }).join('');
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .3 });
    $$('.beach', grid).forEach(function (e) { io.observe(e); });
  }

  /* Instituciones */
  var ir = $('#inst-row');
  if (ir) ir.innerHTML = PARTICIPANTES.instituciones.map(function (x, i) { return '<a class="inst-chip reveal" style="--d:' + i * .06 + 's" href="participantes.html#instituciones"><b>' + x.icono + '</b><span>' + x.nombre + '</span></a>'; }).join('');
  /* Los elementos creados por JS necesitan observarse para el revelado */
  var io2 = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io2.unobserve(x.target); } }); }, { threshold: .1 });
  $$('.inst-chip.reveal,.beach.reveal').forEach(function (e) { io2.observe(e); });
})();
