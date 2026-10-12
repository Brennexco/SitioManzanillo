/* linea-del-tiempo.js — comparador antes/después, selección de años, capas, información y exportación */
(function () {
  var TL = window.TIMELINE, Y = TL.years, st = { a: Y.indexOf('2012'), b: Y.indexOf('2020'), pos: 50, play: null, on: { costa: true } };
  if (st.a < 0) st.a = 0; if (st.b < 0) st.b = Y.length - 1;
  var stage = $('#tl-stage'), sideA = $('#side-a'), sideB = $('#side-b'), handle = $('#tl-handle');
  var N = function (y) { return +y || 2026; };            // "Actualidad" se trata como año en curso
  var label = function (y) { return y; };

  /* ---------- eje de años ---------- */
  function axis() {
    $('#tl-axis').innerHTML = Y.map(function (y, i) { return '<button class="tl-yr' + (i === st.a ? ' base' : '') + (i === st.b ? ' comp' : '') + '" data-i="' + i + '" aria-label="Comparar con ' + y + '"><small>' + (i === st.a ? 'Base' : '') + '</small><span>' + y + '</span><i></i></button>'; }).join('');
    $('#tl-base').innerHTML = Y.map(function (y, i) { return '<option value="' + i + '"' + (i === st.a ? ' selected' : '') + '>' + y + '</option>'; }).join('');
    $('#tl-comp').innerHTML = $('#tl-base').innerHTML.replace(' selected', ''); $('#tl-comp').value = st.b;
  }
  $('#tl-axis').addEventListener('click', function (e) { var b = e.target.closest('.tl-yr'); if (!b) return; set(st.a, +b.dataset.i); });
  $('#tl-base').onchange = function () { set(+this.value, st.b); }; $('#tl-comp').onchange = function () { set(st.a, +this.value); };
  $('#tl-swap').onclick = function () { set(st.b, st.a, true); };
  function set(a, b, noSort) {
    if (!noSort && a > b) { var t = a; a = b; b = t; }  // el año base siempre es el más antiguo
    if (a === b) { b = Math.min(Y.length - 1, a + 1); if (b === a) a = Math.max(0, a - 1); }
    st.a = a; st.b = b; axis(); paint();
  }

  /* ---------- pintar lados y capas ---------- */
  function parse(d) { var pts = []; (d.match(/-?\d+(\.\d+)?,-?\d+(\.\d+)?/g) || []).forEach(function (p) { var q = p.split(','); pts.push([+q[0], +q[1]]); }); return pts; }
  function sideHTML(key, other) {
    var c = TL.coast[key], vb = '0 0 ' + c.w + ' ' + c.h, h = '';
    if (st.on.uso && TL.uso[key]) h += '<image href="' + TL.uso[key] + '" width="' + c.w + '" height="' + c.h + '" preserveAspectRatio="none" opacity=".75"/>';
    if (st.on.infra && TL.infra && TL.infra[key]) h += '<image href="' + TL.infra[key] + '" width="' + c.w + '" height="' + c.h + '" preserveAspectRatio="none"/>';
    if (st.on.orto) h += '<rect x="' + c.w * .08 + '" y="' + c.h * .12 + '" width="' + c.w * .84 + '" height="' + c.h * .76 + '" fill="rgba(45,212,191,.06)" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="9 6" vector-effect="non-scaling-stroke"/><text x="' + (c.w * .08 + 8) + '" y="' + (c.h * .12 + 20) + '" fill="#5eead4" font-size="14" font-weight="700">Cobertura de ortomosaico (ilustrativa)</text>';
    if (st.on.eros && key === 'b') {   // segmentos ilustrativos de erosión/acumulación a lo largo de la costa más reciente
      var ds = TL.coast.b.paths, s = TL.stats[Y[st.b]], sa = TL.stats[Y[st.a]], e = s[0] - sa[0], ac = s[1] - sa[1], shareE = e / Math.max(.01, e + ac), n = 0;
      ds.forEach(function (d) { var p = parse(d); for (var i = 0; i < p.length - 1; i += 14) { var seg = p.slice(i, i + 15); if (seg.length < 2) continue; var r = (Math.sin(n * 12.9898 + i) * 43758.5453) % 1; r = r < 0 ? r + 1 : r; n++; var col = r < shareE ? '#ef4444' : '#22c55e'; h += '<polyline points="' + seg.map(function (q) { return q.join(','); }).join(' ') + '" fill="none" stroke="' + col + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".8" vector-effect="non-scaling-stroke"/>'; } });
    }
    if (st.on.costa) TL.coast[key].paths.forEach(function (d) { h += '<path d="' + d + '" fill="none" stroke="#fde047" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>'; });
    if (st.on.perf) { var P = [[.28,.55,0],[.34,.62,10],[.41,.72,25],[.5,.8,40],[.58,.78,60]]; P.forEach(function (p, i) { var x = p[0] * c.w, y = p[1] * c.h, a = p[2] * Math.PI / 180; h += '<line x1="' + (x - Math.cos(a) * 18) + '" y1="' + (y - Math.sin(a) * 18) + '" x2="' + (x + Math.cos(a) * 30) + '" y2="' + (y + Math.sin(a) * 30) + '" stroke="#facc15" stroke-width="3" vector-effect="non-scaling-stroke"/><text x="' + (x + 8) + '" y="' + (y - 8) + '" fill="#fff" font-size="13" font-weight="700">P' + (i + 1) + '</text>'; }); }
    return { vb: vb, html: h };
  }
  function paint() {
    var A = TL.images[Y[st.a]], B = TL.images[Y[st.b]];
    [[sideA, A, 'a'], [sideB, B, 'b']].forEach(function (x) { var el = x[0], im = x[1], img = el.querySelector('img'), s = sideHTML(im.key); if (img.getAttribute('src') !== im.src) img.src = im.src; img.alt = 'Litoral de Manzanillo, ' + Y[x[2] === 'a' ? st.a : st.b]; var svg = el.querySelector('svg'); svg.setAttribute('viewBox', s.vb); svg.innerHTML = s.html; });
    $('#lab-a').textContent = Y[st.a]; $('#lab-b').textContent = Y[st.b];
    info(); var prov = !A.real || !B.real;
    $('#tl-note').innerHTML = (prov ? '<b style="color:var(--warn)">Imágenes provisionales:</b> mientras no se cargan las ortofotos de cada año se usan imágenes de referencia. ' : '') + 'Las capas de línea de costa, erosión/acumulación, perfiles y ortomosaico son ilustrativas; las cifras de la tabla son demostrativas. Reemplázalas en <code>js/data/timeline.js</code>.';
  }
  function info() {
    var a = TL.stats[Y[st.a]], b = TL.stats[Y[st.b]], ero = b[0] - a[0], acu = b[1] - a[1], ret = b[2] - a[2], yrs = N(Y[st.b]) - N(Y[st.a]);
    $('#tl-info').innerHTML = '<div class="inf-row"><span>Periodo</span><b>' + Y[st.a] + ' – ' + Y[st.b] + '</b></div><div class="inf-row"><span>Años comparados</span><b>' + yrs + '</b></div><div class="inf-row ero"><span>Área erosionada</span><b>' + ero.toFixed(1) + ' ha</b></div><div class="inf-row acu"><span>Área acumulada</span><b>' + acu.toFixed(1) + ' ha</b></div><div class="inf-row ret"><span>Retroceso máximo</span><b>' + ret.toFixed(1) + ' m</b></div><div class="inf-row"><span>Tasa de retroceso</span><b>' + (yrs ? (ret / yrs).toFixed(1) : '0') + ' m/año</b></div>';
  }
  $$('.chk input').forEach(function (c) { c.addEventListener('change', function () { st.on[c.dataset.l] = c.checked; paint(); }); });

  /* ---------- comparador ---------- */
  function setPos(p) { st.pos = Math.max(0, Math.min(100, p)); sideA.style.clipPath = 'inset(0 ' + (100 - st.pos) + '% 0 0)'; handle.style.left = st.pos + '%'; handle.setAttribute('aria-valuenow', Math.round(st.pos)); }
  var drag = false, fromEvt = function (e) { var r = stage.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width * 100); };
  stage.addEventListener('pointerdown', function (e) { drag = true; try { stage.setPointerCapture(e.pointerId); } catch (x) {} fromEvt(e); stop(); });
  stage.addEventListener('pointermove', function (e) { if (drag) fromEvt(e); }); stage.addEventListener('pointerup', function () { drag = false; }); stage.addEventListener('pointercancel', function () { drag = false; });
  handle.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') setPos(st.pos - 3); if (e.key === 'ArrowRight') setPos(st.pos + 3); });

  /* ---------- reproducir ---------- */
  function stop() { if (st.play) { clearInterval(st.play); st.play = null; $('#tl-play').textContent = '▶ Reproducir'; } }
  $('#tl-play').onclick = function () {
    if (st.play) return stop();
    this.textContent = '❚❚ Pausar'; set(0, 1);
    st.play = setInterval(function () { if (st.b >= Y.length - 1) { stop(); return; } set(st.a, st.b + 1); }, 1700);
  };

  /* ---------- descargar comparación (PNG) ---------- */
  function cover(ctx, img, W, H) { var s = Math.max(W / img.naturalWidth, H / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s; ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h); return { s: s, ox: (W - w) / 2, oy: (H - h) / 2 }; }
  $('#tl-dl').onclick = function () {
    var W = 1600, H = Math.round(W / (stage.clientWidth / stage.clientHeight)), c = document.createElement('canvas'); c.width = W; c.height = H; var ctx = c.getContext('2d');
    var ia = sideA.querySelector('img'), ib = sideB.querySelector('img');
    function side(img, key, x0, x1) {
      ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip(); var m = cover(ctx, img, W, H), co = TL.coast[key], k = Math.max(W / co.w, H / co.h), ox = (W - co.w * k) / 2, oy = (H - co.h * k) / 2;
      if (st.on.costa) { ctx.setTransform(k, 0, 0, k, ox, oy); ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3 / k; co.paths.forEach(function (d) { ctx.stroke(new Path2D(d)); }); ctx.setTransform(1, 0, 0, 1, 0, 0); }
      ctx.restore();
    }
    try {
      var x = W * st.pos / 100; side(ib, TL.images[Y[st.b]].key, 0, W); side(ia, TL.images[Y[st.a]].key, 0, x);
      ctx.fillStyle = '#fff'; ctx.fillRect(x - 2, 0, 4, H); ctx.font = '600 44px sans-serif';
      [[Y[st.a], 30], [Y[st.b], W - 30 - ctx.measureText(Y[st.b]).width - 40]].forEach(function (l) { ctx.fillStyle = 'rgba(6,17,31,.85)'; ctx.fillRect(l[1], 28, ctx.measureText(l[0]).width + 40, 70); ctx.fillStyle = '#fff'; ctx.fillText(l[0], l[1] + 20, 77); });
      ctx.fillStyle = 'rgba(6,17,31,.8)'; ctx.fillRect(0, H - 50, W, 50); ctx.fillStyle = '#fff'; ctx.font = '22px sans-serif'; ctx.fillText('Atlas Digital del Litoral de Manzanillo · PAPIIT IF100926 · comparación ' + Y[st.a] + ' – ' + Y[st.b], 24, H - 17);
      c.toBlob(function (b) { if (!b) return toast('No se pudo generar la imagen.'); saveAs('comparacion-' + Y[st.a] + '-' + Y[st.b] + '.png', b); toast('Comparación descargada'); });
    } catch (e) { toast('Tu navegador bloquea exportar imágenes desde archivos locales. Funciona al abrir el sitio con un servidor (Live Server) o en GitHub Pages.'); }
  };

  axis(); setPos(50); paint();
})();
