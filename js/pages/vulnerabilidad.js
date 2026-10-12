/* vulnerabilidad.js — índice de vulnerabilidad: recálculo por variables, leyenda filtrable, ficha, metodología y ranking.
   Los puntajes son DEMOSTRATIVOS (js/data/playas.js → VULN_BEACHES). */
(function () {
  var B = window.VULN_BEACHES, V = window.VULN_VARS, LV = window.VULN_LEVELS, IW = 1100;
  var S = { vars: V.map(function () { return true; }), off: {}, sel: null };
  var stage = $('#contenido');
  function level(s) { for (var i = 0; i < LV.length; i++) if (s < LV[i][0]) return i; return LV.length - 1; }
  function score(b) { var sum = 0, n = 0; b.sub.forEach(function (v, i) { if (S.vars[i]) { sum += v; n++; } }); return n ? sum / n : 0; }
  var onVars = function () { return S.vars.filter(Boolean).length; };

  /* leyenda */
  function legend() {
    var cnt = LV.map(function () { return 0; }); B.forEach(function (b) { cnt[level(score(b))]++; });
    $('#vu-legend').innerHTML = LV.slice().reverse().map(function (l, k) { var i = LV.length - 1 - k; return '<button class="lg-row' + (S.off[i] ? ' off' : '') + '" data-i="' + i + '" title="Mostrar / ocultar nivel"><i style="background:' + l[2] + '"></i>' + l[1] + '<small>' + cnt[i] + ' sitio' + (cnt[i] === 1 ? '' : 's') + '</small></button>'; }).join('');
  }
  $('#vu-legend').addEventListener('click', function (e) { var b = e.target.closest('.lg-row'); if (!b) return; var i = +b.dataset.i; S.off[i] = !S.off[i]; legend(); marks(); });
  /* variables */
  $('#vu-vars').innerHTML = V.map(function (v, i) { return '<label class="vv"><input type="checkbox" data-i="' + i + '" checked><span>' + v + '</span></label>'; }).join('');
  $('#vu-vars').addEventListener('change', function (e) {
    var i = +e.target.dataset.i; S.vars[i] = e.target.checked;
    if (!onVars()) { S.vars[i] = true; e.target.checked = true; toast('Debe haber al menos una variable considerada.'); return; }
    legend(); marks(); if (S.sel != null) card(S.sel);
  });
  /* marcadores */
  function marks() {
    $('#vu-marks').innerHTML = B.map(function (b, i) { var l = level(score(b)); return '<button class="vu-mk' + (S.off[l] ? ' dim' : '') + (S.sel === i ? ' sel' : '') + '" data-i="' + i + '" style="left:' + b.fx * 100 + '%;top:' + b.fy * 100 + '%;background:' + LV[l][2] + '" aria-label="' + b.nombre + '"><b>' + b.nombre + '</b></button>'; }).join('');
  }
  $('#vu-marks').addEventListener('click', function (e) { var m = e.target.closest('.vu-mk'); if (m) select(+m.dataset.i); });
  function card(i) {
    var b = B[i], s = score(b), l = level(s), c = LV[l][2];
    $('#vu-card').innerHTML = '<button class="cx" aria-label="Cerrar">✕</button><h3>' + b.nombre + '</h3><div class="r"><span>Índice:</span><b style="color:' + c + '">' + LV[l][1] + '</b></div><div class="bar"><i style="width:' + s * 100 + '%;background:' + c + '"></i></div><div class="r"><span>Puntaje:</span><b>' + s.toFixed(2) + ' / 1</b></div><div class="r"><span>Nivel de confianza:</span><b>' + b.conf + '%</b></div><div class="r"><span>Variables:</span><b>' + onVars() + ' de ' + V.length + '</b></div><a class="go" href="#" id="vu-det">Ver detalle</a>';
    $('#vu-card').classList.remove('hide'); $('#vu-card .cx').onclick = function () { $('#vu-card').classList.add('hide'); S.sel = null; marks(); };
    $('#vu-det').onclick = function (e) { e.preventDefault(); detail(i); };
  }
  function select(i, fly) { S.sel = i; marks(); card(i); if (fly) pz.flyTo(B[i].fx, B[i].fy, 2.4); history.replaceState(null, '', '#' + slug(B[i].nombre)); }
  /* detalle */
  function detail(i) {
    var b = B[i], s = score(b), l = level(s), rows = V.map(function (v, k) { var c = LV[level(b.sub[k])][2]; return '<div class="bar-row" style="opacity:' + (S.vars[k] ? 1 : .4) + '"><span>' + v + '</span><i><b style="width:' + b.sub[k] * 100 + '%;background:' + c + '"></b></i><span>' + b.sub[k].toFixed(2) + '</span></div>'; }).join('');
    openModal('<span class="badge">Detalle de vulnerabilidad</span><h3>' + b.nombre + '</h3><p>Índice <b style="color:' + LV[l][2] + '">' + LV[l][1] + '</b> · puntaje <b>' + s.toFixed(2) + ' / 1</b> · nivel de confianza <b>' + b.conf + '%</b>.</p><h4 style="margin:18px 0 6px">Puntaje por variable (0–1)</h4>' + rows + '<p class="modal-note">Valores demostrativos. Sustitúyelos por los resultados del proyecto en js/data/playas.js. Las variables atenuadas no están consideradas en el índice actual.</p>');
  }
  $('#vu-met').onclick = function () {
    openModal('<span class="badge">Metodología</span><h3>Índice de vulnerabilidad costera</h3><p>El índice combina variables físicas y de exposición normalizadas entre 0 (mínima) y 1 (máxima vulnerabilidad). El puntaje de cada sitio es el promedio de las variables consideradas.</p><ol class="met-steps"><li><b>Selección de variables:</b> erosión costera, pendiente del terreno, tipo de roca/sedimento, oleaje y exposición, huracanes históricos y uso de suelo.</li><li><b>Normalización:</b> cada variable se reescala a 0–1 a partir de datos de campo, fotogrametría y análisis multitemporal.</li><li><b>Integración:</b> promedio de las variables activas (se puede ajustar en el panel).</li><li><b>Clasificación:</b> Muy baja &lt; 0.2 · Baja &lt; 0.4 · Media &lt; 0.6 · Alta &lt; 0.8 · Muy alta ≥ 0.8.</li><li><b>Nivel de confianza:</b> calidad y cobertura de los datos disponibles por sitio.</li></ol><p class="modal-note">Metodología descrita de forma general; ajusta el texto a la metodología final del proyecto.</p>');
  };
  $('#vu-rank').onclick = function () {
    var r = B.map(function (b, i) { return { i: i, s: score(b) }; }).sort(function (a, b) { return b.s - a.s; });
    openModal('<span class="badge">Ranking</span><h3>Sitios por vulnerabilidad</h3><p>De mayor a menor puntaje con las variables consideradas actualmente.</p>' + r.map(function (x, k) { var l = level(x.s); return '<div class="rk-row"><span class="rk-n">' + (k + 1) + '</span><button data-r="' + x.i + '">' + B[x.i].nombre + '</button><b>' + x.s.toFixed(2) + '</b><div class="rk-bar"><i style="width:' + x.s * 100 + '%;background:' + LV[l][2] + '"></i></div></div>'; }).join(''));
    $$('#modal-body [data-r]').forEach(function (b) { b.onclick = function () { closeModal(); select(+b.dataset.r, true); }; });
  };
  /* mapa */
  var pz = PanZoom($('#vu-view'), $('#vu-inner'), { aspect: 2094 / 1480, max: 8, onChange: scaleBar });
  function scaleBar() { if (!pz) return; var pxKm = pz.state.w * pz.state.s / 13.5, nice = [.25, .5, 1, 2, 5], len = nice[0]; nice.forEach(function (n) { if (n * pxKm <= 190) len = n; }); $('#vu-bar').style.width = len * pxKm + 'px'; $('#vu-sl').style.width = len * pxKm + 'px'; $('#vu-s2').textContent = len + ' km'; }
  $('#vu-in').onclick = function () { pz.zoomBy(1.5); }; $('#vu-out').onclick = function () { pz.zoomBy(1 / 1.5); }; $('#vu-home').onclick = function () { pz.reset(); };
  function panel(show) { document.body.classList.toggle('panel-off', !show); $('#vu-reopen').classList.toggle('hide', show); setTimeout(function () { pz.fit(false); }, 30); }
  $('#vu-reopen').onclick = function () { panel(true); };
  if (window.innerWidth < 860) panel(false);
  legend(); marks(); scaleBar();
  var hs = (location.hash || '').slice(1), k = B.map(function (b) { return slug(b.nombre); }).indexOf(hs);
  select(k >= 0 ? k : B.map(function (b) { return b.nombre; }).indexOf('Playa Miramar'), k >= 0);
})();
