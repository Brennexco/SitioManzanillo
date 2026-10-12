/* visor.js — Visor Geoespacial: capas, herramientas de medición, ficha de playa, modo Atlas y Satélite real (Leaflet) */
(function () {
  var IW = GEO.iw, IH = GEO.ih, NS = 'http://www.w3.org/2000/svg';
  var VC = { Alta: '#ef4444', Media: '#f59e0b', Baja: '#22c55e' };
  var S = { mode: 'atlas', on: {}, tool: null, pts: [], done: [], sel: null, map: null, L: null, groups: {}, drawGrp: null, spots: [] };
  var stage = $('#contenido'), atlas = $('#vz-atlas'), sat = $('#vz-sat');
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- utilidades geográficas ---------- */
  function hav(a, b) { var R = 6371, d2r = Math.PI / 180, dLa = (b.lat - a.lat) * d2r, dLo = (b.lng - a.lng) * d2r, x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * d2r) * Math.cos(b.lat * d2r) * Math.sin(dLo / 2) * Math.sin(dLo / 2); return 2 * R * Math.asin(Math.sqrt(x)); }
  function pathKm(p) { var d = 0; for (var i = 1; i < p.length; i++) d += hav(p[i - 1], p[i]); return d; }
  function areaKm2(p) { var la0 = p[0].lat * Math.PI / 180, k = 111.32, a = 0; var q = p.map(function (x) { return [(x.lng - p[0].lng) * k * Math.cos(la0), (x.lat - p[0].lat) * k]; }); for (var i = 0; i < q.length; i++) { var j = (i + 1) % q.length; a += q[i][0] * q[j][1] - q[j][0] * q[i][1]; } return Math.abs(a / 2); }
  function fD(km) { return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(2) + ' km'; }
  function fA(k2) { return k2 < 1 ? (k2 * 100).toFixed(1) + ' ha' : k2.toFixed(2) + ' km²'; }
  function fLL(p) { return Math.abs(p.lat).toFixed(4) + '° ' + (p.lat >= 0 ? 'N' : 'S') + ', ' + Math.abs(p.lng).toFixed(4) + '° ' + (p.lng >= 0 ? 'E' : 'O'); }
  function inPoly(p, pts) { var c = false; for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) { if (((pts[i][1] > p[1]) !== (pts[j][1] > p[1])) && (p[0] < (pts[j][0] - pts[i][0]) * (p[1] - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0])) c = !c; } return c; }
  function spotPos(p) { if (p.fx != null) return [p.fx, p.fy]; var q = ll2px(p.lat, p.lng); return [q[0] / IW, q[1] / IH]; }
  /* posiciones de las fichas sin fx/fy dentro de la imagen */
  PLAYAS.forEach(function (p) { if (p.nombre === 'Playa La Audiencia') { p.fx = .09; p.fy = .17; } if (p.nombre === 'Punta Chica') { p.fx = .26; p.fy = .68; } });

  /* ---------- Panel de capas ---------- */
  $('#vz-layers').innerHTML = CAPAS.map(function (c) { return '<label class="vz-layer"><input type="checkbox" data-id="' + c.id + '"><span>' + c.nombre + '</span><i style="background:' + c.color + '"></i></label>'; }).join('');
  $('#vz-goto').innerHTML = '<option value="">Seleccionar…</option>' + PLAYAS.map(function (p, i) { return '<option value="' + i + '">' + p.nombre + '</option>'; }).join('');

  /* ---------- Modo Atlas: SVG + marcadores ---------- */
  var svg = $('#vz-svg'), ptsBox = $('#vz-pts'), spotsBox = $('#vz-spots');
  var sh = '';
  CAPAS.forEach(function (c) {
    var g = '';
    c.feats.forEach(function (f) {
      if (f.t === 'poly') g += '<polygon points="' + f.pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + f.c + '" stroke="' + f.c + '"' + (f.dash ? ' stroke-dasharray="7 5"' : '') + '><title>' + esc(f.l) + '</title></polygon>';
      else if (f.t === 'line') g += '<polyline points="' + f.pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="' + f.c + '" stroke-width="' + (f.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + (f.dash ? ' stroke-dasharray="9 6"' : '') + ' style="vector-effect:non-scaling-stroke"><title>' + esc(f.l) + '</title></polyline>';
      else if (f.t === 'pt') ptsBox.insertAdjacentHTML('beforeend', '<div class="vz-pt ' + (f.shape || '') + '" data-l="' + c.id + '" title="' + esc(f.l) + '" style="left:' + f.p[0] / IW * 100 + '%;top:' + f.p[1] / IH * 100 + '%;background:' + f.c + '"></div>');
    });
    sh += '<g class="lg" data-l="' + c.id + '">' + g + '</g>';
  });
  sh += '<g id="vz-draw"></g>'; svg.innerHTML = sh;
  var drawBox = document.createElement('div'); drawBox.id = 'vz-drawpts'; drawBox.style.cssText = 'position:absolute;inset:0;pointer-events:none'; ptsBox.appendChild(drawBox);
  PLAYAS.forEach(function (p, i) { var q = spotPos(p); spotsBox.insertAdjacentHTML('beforeend', '<button class="vz-spot" data-i="' + i + '" title="' + esc(p.nombre) + '" aria-label="' + esc(p.nombre) + '" style="left:' + q[0] * 100 + '%;top:' + q[1] * 100 + '%"></button>'); });
  spotsBox.addEventListener('click', function (e) { var b = e.target.closest('.vz-spot'); if (b) { e.stopPropagation(); if (S.tool) return; selectBeach(+b.dataset.i); } });

  var pz = PanZoom(atlas, $('#vz-inner'), {
    aspect: IW / IH, max: 10, onChange: scaleBar,
    onClick: function (fx, fy, ev) { if (S.mode === 'atlas' && !ev.target.closest('[data-nodrag],.vz-spot')) mapClick(px2ll(fx * IW, fy * IH), [fx * IW, fy * IH]); }
  });
  atlas.addEventListener('pointermove', function (e) { var l = pz.local(e); if (l[0] < 0 || l[0] > 1 || l[1] < 0 || l[1] > 1) return; $('#vz-coords').textContent = 'Coordenadas: ' + fLL(px2ll(l[0] * IW, l[1] * IH)); });

  /* ---------- Escala ---------- */
  function scaleBar() {
    var kmpx; if (!pz) return;
    if (S.mode === 'atlas') kmpx = GEO.kmPerPx / (pz.state.w * pz.state.s / IW);
    else if (S.map) { var c = S.map.getCenter(); kmpx = 156.54303 * Math.cos(c.lat * Math.PI / 180) / Math.pow(2, S.map.getZoom()); }
    else return;
    var nice = [.05, .1, .25, .5, 1, 2, 5, 10, 20, 50], len = nice[0];
    nice.forEach(function (n) { if (n / kmpx <= 190) len = n; });
    $('#vz-bar').style.width = Math.max(40, len / kmpx) + 'px'; $('#vz-scale-l').style.width = Math.max(40, len / kmpx) + 'px';
    $('#vz-s1').textContent = ''; $('#vz-s2').textContent = (len < 1 ? len * 1000 + ' m' : len + ' km');
  }

  /* ---------- Capas ---------- */
  function layersChanged() {
    $$('.vz-layer input').forEach(function (c) { S.on[c.dataset.id] = c.checked; });
    $$('#vz-svg .lg').forEach(function (g) { g.classList.toggle('on', !!S.on[g.dataset.l]); });
    $$('.vz-pt').forEach(function (d) { d.classList.toggle('on', !!S.on[d.dataset.l]); });
    $$('.vz-spot').forEach(function (b) { var p = PLAYAS[+b.dataset.i], v = S.on.vulnerabilidad; b.style.background = v ? VC[p.vuln] : ''; b.style.boxShadow = v ? '0 0 0 5px ' + VC[p.vuln] + '55,0 2px 10px rgba(0,0,0,.6)' : ''; });
    var h = '';
    CAPAS.forEach(function (c) { if (S.on[c.id]) h += '<b>' + c.nombre + '</b>' + c.leyenda.map(function (l) { return '<i style="background:' + l[1] + '"></i>' + l[0]; }).join('<br>') + '<br>'; });
    $('#vz-legend').innerHTML = h; $('#vz-legend').classList.toggle('hide', !h);
    if (S.mode === 'sat') satLayers();
  }
  $('#vz-layers').addEventListener('change', layersChanged);

  /* ---------- Ficha de playa ---------- */
  function selectBeach(i, fly) {
    var p = PLAYAS[i]; S.sel = i;
    $$('.vz-spot').forEach(function (b) { b.classList.toggle('sel', +b.dataset.i === i); });
    $('#vz-card').innerHTML = '<button class="cx" aria-label="Cerrar">✕</button><h3>' + p.nombre + '</h3><div class="r"><span>Tipo:</span><b>' + p.tipo + '</b></div><div class="r"><span>Longitud:</span><b>' + p.longitud + '</b></div><div class="r"><span>Pendiente:</span><b>' + p.pendiente + '</b></div><div class="r"><span>Vulnerabilidad:</span><b style="color:' + VC[p.vuln] + '">' + p.vuln + '</b></div><a class="go" href="#" id="vz-ficha">Ver ficha completa</a>';
    $('#vz-card').classList.remove('hide');
    $('#vz-card .cx').onclick = function () { $('#vz-card').classList.add('hide'); };
    $('#vz-ficha').onclick = function (e) { e.preventDefault(); ficha(i); };
    if (fly) { if (S.mode === 'atlas') { var q = spotPos(p); pz.flyTo(q[0], q[1], 3); } else if (S.map) S.map.flyTo([p.lat, p.lng], 15); }
  }
  function ficha(i) {
    var p = PLAYAS[i], vb = (window.VULN_BEACHES || []).filter(function (b) { return b.nombre === p.nombre; })[0];
    openModal('<span class="badge">Ficha de sitio</span><h3>' + p.nombre + '</h3><p>' + p.tipo + ' del litoral de Manzanillo, Colima.</p><div class="vf-grid"><div><span>Tipo</span><b>' + p.tipo + '</b></div><div><span>Longitud</span><b>' + p.longitud + '</b></div><div><span>Pendiente</span><b>' + p.pendiente + '</b></div><div><span>Vulnerabilidad</span><b style="color:' + VC[p.vuln] + '">' + p.vuln + '</b></div><div><span>Latitud</span><b>' + p.lat.toFixed(4) + '° N</b></div><div><span>Longitud geográfica</span><b>' + Math.abs(p.lng).toFixed(4) + '° O</b></div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">' + (vb ? '<a class="btn btn-primary btn-sm" href="vulnerabilidad.html#' + slug(p.nombre) + '">Ver índice de vulnerabilidad</a>' : '') + '<a class="btn btn-outline btn-sm" href="modelos-3d.html">Modelos 3D</a><a class="btn btn-ghost btn-sm" href="datos-resultados.html">Datos del sitio</a></div><p class="modal-note">Valores demostrativos: sustitúyelos por los resultados del proyecto en js/data/playas.js.</p>');
  }
  $('#vz-goto').onchange = function () { if (this.value !== '') selectBeach(+this.value, true); };

  /* ---------- Herramientas ---------- */
  function tip(h) { var t = $('#vz-tip'); t.classList.toggle('hide', !h); if (h) t.innerHTML = h; }
  function measureUI() {
    var t = '';
    if (S.tool === 'dist') t = S.pts.length > 1 ? 'Distancia: <b>' + fD(pathKm(S.pts)) + '</b>' : 'Haz clic en el mapa para trazar una ruta';
    else if (S.tool === 'area') t = S.pts.length > 2 ? 'Área: <b>' + fA(areaKm2(S.pts)) + '</b> · perímetro ' + fD(pathKm(S.pts.concat([S.pts[0]]))) : 'Marca al menos 3 vértices';
    else if (S.tool === 'info') t = 'Haz clic en cualquier punto para consultar su información';
    if (S.tool === 'dist' || S.tool === 'area') t += '<br><button data-a="fin">TERMINAR</button><button data-a="undo">DESHACER</button><button data-a="clr">BORRAR</button>';
    tip(t);
  }
  $('#vz-tip').addEventListener('click', function (e) { var a = e.target.dataset.a; if (!a) return; if (a === 'fin' && S.pts.length > 1) { S.done.push({ pts: S.pts, closed: S.tool === 'area' }); S.pts = []; } if (a === 'undo') S.pts.pop(); if (a === 'clr') { S.pts = []; S.done = []; } draw(); measureUI(); });
  function setTool(t) {
    if (t === 'print') { window.print(); return; }
    S.tool = S.tool === t ? null : t; S.pts = [];
    $$('.vz-tool').forEach(function (b) { b.classList.toggle('on', b.dataset.tool === S.tool); });
    stage.classList.toggle('tool', !!S.tool); if (!S.tool) $('#vz-card').dataset.x = '';
    if (!S.tool) tip(''); else measureUI(); draw();
  }
  $('#vz-tools').addEventListener('click', function (e) { var b = e.target.closest('.vz-tool'); if (b) setTool(b.dataset.tool); });
  document.addEventListener('keydown', function (e) { if (!S.tool) return; if (e.key === 'Escape') setTool(S.tool); if (e.key === 'Enter' && S.pts.length > 1) { S.done.push({ pts: S.pts, closed: S.tool === 'area' }); S.pts = []; draw(); measureUI(); } });

  function infoAt(ll) {
    var px = ll2px(ll.lat, ll.lng), best = null, bd = 1e9;
    PLAYAS.forEach(function (p) { var d = hav(ll, p); if (d < bd) { bd = d; best = p; } });
    var geo = 'Sin clasificar', uso = 'Sin clasificar';
    CAPAS.forEach(function (c) { if (c.id === 'geologia' || c.id === 'uso') c.feats.forEach(function (f) { if (inPoly(px, f.pts)) { if (c.id === 'geologia') geo = f.l; else uso = f.l; } }); });
    return '<b>Información del punto</b><br>' + fLL(ll) + '<br>Sitio más cercano: <b>' + best.nombre + '</b> (' + fD(bd) + ')<br>Vulnerabilidad: <b style="color:' + VC[best.vuln] + '">' + best.vuln + '</b> · Geología: ' + geo + ' · Uso de suelo: ' + uso + '<br><small style="color:var(--muted)">Capas temáticas ilustrativas</small>';
  }
  function mapClick(ll) {
    if (!S.tool) return;
    if (S.tool === 'info') { tip(infoAt(ll) + '<br><button data-a="x">CERRAR</button>'); return; }
    S.pts.push(ll); draw(); measureUI();
  }
  $('#vz-tip').addEventListener('click', function (e) { if (e.target.dataset.a === 'x') tip(''); });

  /* ---------- Dibujo de mediciones (atlas y satélite) ---------- */
  function draw() {
    var all = S.done.map(function (d) { return { pts: d.pts, closed: d.closed, fin: true }; }); if (S.pts.length) all.push({ pts: S.pts, closed: S.tool === 'area', fin: false });
    if (S.mode === 'atlas') {
      var g = '', dots = '';
      all.forEach(function (d) {
        var xy = d.pts.map(function (p) { return ll2px(p.lat, p.lng); }), tag = d.closed && xy.length > 2 ? 'polygon' : 'polyline';
        g += '<' + tag + ' points="' + xy.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + (tag === 'polygon' ? 'rgba(45,212,191,.22)' : 'none') + '" stroke="#2dd4bf" stroke-width="2.5" style="vector-effect:non-scaling-stroke"' + (d.fin ? '' : ' stroke-dasharray="6 4"') + '/>';
        xy.forEach(function (p) { dots += '<i class="vz-m" style="left:' + p[0] / IW * 100 + '%;top:' + p[1] / IH * 100 + '%"></i>'; });
        var last = xy[xy.length - 1], lab = d.closed ? (d.pts.length > 2 ? fA(areaKm2(d.pts)) : '') : (d.pts.length > 1 ? fD(pathKm(d.pts)) : '');
        if (lab) dots += '<span class="vz-ml" style="left:' + last[0] / IW * 100 + '%;top:' + last[1] / IH * 100 + '%">' + lab + '</span>';
      });
      $('#vz-draw').innerHTML = g; drawBox.innerHTML = dots;
    } else if (S.map) {
      var L = S.L; if (S.drawGrp) S.drawGrp.clearLayers(); else S.drawGrp = L.layerGroup().addTo(S.map);
      all.forEach(function (d) {
        var ll = d.pts.map(function (p) { return [p.lat, p.lng]; });
        if (d.closed && ll.length > 2) L.polygon(ll, { color: '#2dd4bf', weight: 2.5, fillOpacity: .22, dashArray: d.fin ? null : '6 4', interactive: false }).addTo(S.drawGrp); else L.polyline(ll, { color: '#2dd4bf', weight: 2.5, dashArray: d.fin ? null : '6 4', interactive: false }).addTo(S.drawGrp);
        ll.forEach(function (p) { L.circleMarker(p, { radius: 4, color: '#04121f', weight: 2, fillColor: '#2dd4bf', fillOpacity: 1, interactive: false }).addTo(S.drawGrp); });
      });
    }
  }

  /* ---------- Modo Satélite real (Leaflet, requiere internet) ---------- */
  var LCSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css', LJS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
  function loadLeaflet(cb, fail) {
    if (window.L) return cb();
    var css = $('#leaflet-css'); css.href = LCSS; css.disabled = false;
    var s = document.createElement('script'); s.src = LJS; s.onload = cb; s.onerror = fail; document.head.appendChild(s);
  }
  function initSat() {
    var L = S.L = window.L;
    S.map = L.map('vz-map', { zoomControl: false, attributionControl: true, maxZoom: 19 });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Imágenes © Esri, Maxar, Earthstar Geographics' }).addTo(S.map);
    var a = px2ll(0, 0), b = px2ll(IW, IH); S.map.fitBounds([[b.lat, a.lng], [a.lat, b.lng]]);
    PLAYAS.forEach(function (p, i) { S.spots[i] = L.circleMarker([p.lat, p.lng], { radius: 9, color: '#fff', weight: 3, fillColor: '#2dd4bf', fillOpacity: 1 }).bindTooltip(p.nombre).on('click', function (e) { L.DomEvent.stopPropagation(e); if (!S.tool) selectBeach(i); }).addTo(S.map); });
    S.map.on('click', function (e) { mapClick({ lat: e.latlng.lat, lng: e.latlng.lng }); });
    S.map.on('mousemove', function (e) { $('#vz-coords').textContent = 'Coordenadas: ' + fLL(e.latlng); });
    S.map.on('zoomend moveend', scaleBar);
    satLayers();
  }
  function satLayers() {
    if (!S.map) return; var L = S.L;
    CAPAS.forEach(function (c) {
      if (!S.groups[c.id]) {
        var g = S.groups[c.id] = L.layerGroup();
        c.feats.forEach(function (f) {
          var ll = f.pts ? f.pts.map(function (p) { var q = px2ll(p[0], p[1]); return [q.lat, q.lng]; }) : null;
          if (f.t === 'poly') L.polygon(ll, { color: f.c, weight: 2, fillOpacity: .25, dashArray: f.dash ? '7 5' : null }).bindTooltip(f.l).addTo(g);
          else if (f.t === 'line') L.polyline(ll, { color: f.c, weight: f.w || 2, dashArray: f.dash ? '9 6' : null }).bindTooltip(f.l).addTo(g);
          else if (f.t === 'pt') { var q = px2ll(f.p[0], f.p[1]); L.circleMarker([q.lat, q.lng], { radius: 6, color: '#fff', weight: 2, fillColor: f.c, fillOpacity: 1 }).bindTooltip(f.l).addTo(g); }
        });
      }
      var has = S.map.hasLayer(S.groups[c.id]); if (S.on[c.id] && !has) S.groups[c.id].addTo(S.map); if (!S.on[c.id] && has) S.map.removeLayer(S.groups[c.id]);
    });
    if (!S.warned && CAPAS.some(function (c) { return S.on[c.id]; })) { S.warned = true; toast('Sobre el satélite las capas temáticas son ilustrativas y aún no están georreferenciadas.'); }
    S.spots.forEach(function (m, i) { var v = S.on.vulnerabilidad; m.setStyle({ fillColor: v ? VC[PLAYAS[i].vuln] : '#2dd4bf' }); });
  }
  function setMode(m) {
    if (m === S.mode) return;
    var go = function () {
      S.mode = m; S.pts = []; S.done = [];
      atlas.classList.toggle('hide', m !== 'atlas'); sat.classList.toggle('hide', m !== 'sat');
      $$('.vz-mode button').forEach(function (b) { b.classList.toggle('on', b.dataset.mode === m); });
      if (m === 'sat') { if (!S.map) initSat(); else { S.map.invalidateSize(); satLayers(); } } else { pz.fit(false); }
      setTimeout(scaleBar, 60); draw(); if (S.tool) measureUI();
    };
    if (m === 'sat' && !S.map) { toast('Cargando mapa satelital…'); loadLeaflet(go, function () { toast('No se pudo cargar el satélite. Revisa tu conexión a internet.'); }); } else go();
  }
  $('.vz-mode').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setMode(b.dataset.mode); });

  /* ---------- Zoom, panel, descarga ---------- */
  $('#vz-in').onclick = function () { S.mode === 'atlas' ? pz.zoomBy(1.5) : S.map.zoomIn(); };
  $('#vz-out').onclick = function () { S.mode === 'atlas' ? pz.zoomBy(1 / 1.5) : S.map.zoomOut(); };
  $('#vz-home').onclick = function () { if (S.mode === 'atlas') pz.reset(); else { var a = px2ll(0, 0), b = px2ll(IW, IH); S.map.fitBounds([[b.lat, a.lng], [a.lat, b.lng]]); } };
  function panel(show) { document.body.classList.toggle('panel-off', !show); $('#vz-reopen').classList.toggle('hide', show); setTimeout(function () { pz.fit(false); if (S.map) S.map.invalidateSize(); }, 30); }
  $('#vz-close').onclick = function () { panel(false); }; $('#vz-reopen').onclick = function () { panel(true); };
  if (window.innerWidth < 860) panel(false);

  $('#vz-download').onclick = function () {
    if (S.mode === 'sat') { toast('Para guardar la vista satelital usa «Imprimir mapa» (Guardar como PDF).'); return; }
    var img = $('#vz-inner img'), c = document.createElement('canvas'); c.width = img.naturalWidth || 2082; c.height = img.naturalHeight || 1514;
    var ctx = c.getContext('2d'), k = c.width / IW; ctx.drawImage(img, 0, 0, c.width, c.height);
    CAPAS.forEach(function (cp) {
      if (!S.on[cp.id]) return;
      cp.feats.forEach(function (f) {
        ctx.strokeStyle = ctx.fillStyle = f.c; ctx.lineWidth = (f.w || 2) * k * 1.2; ctx.setLineDash(f.dash ? [9 * k, 6 * k] : []);
        if (f.t === 'poly' || f.t === 'line') { ctx.beginPath(); f.pts.forEach(function (p, i) { i ? ctx.lineTo(p[0] * k, p[1] * k) : ctx.moveTo(p[0] * k, p[1] * k); }); if (f.t === 'poly') { ctx.closePath(); ctx.globalAlpha = .26; ctx.fill(); ctx.globalAlpha = 1; } ctx.stroke(); }
        else { ctx.setLineDash([]); ctx.beginPath(); ctx.arc(f.p[0] * k, f.p[1] * k, 6 * k, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 * k; ctx.stroke(); }
      });
    });
    PLAYAS.forEach(function (p) { var q = spotPos(p); ctx.beginPath(); ctx.arc(q[0] * c.width, q[1] * c.height, 9 * k, 0, 7); ctx.fillStyle = S.on.vulnerabilidad ? VC[p.vuln] : '#2dd4bf'; ctx.fill(); ctx.lineWidth = 3 * k; ctx.strokeStyle = '#fff'; ctx.stroke(); });
    ctx.fillStyle = 'rgba(4,18,31,.8)'; ctx.fillRect(0, c.height - 46 * k, c.width, 46 * k); ctx.fillStyle = '#fff'; ctx.font = (16 * k) + 'px sans-serif'; ctx.fillText('Atlas Digital del Litoral de Manzanillo · PAPIIT IF100926 · capas ilustrativas', 16 * k, c.height - 17 * k);
    try { c.toBlob(function (b) { if (!b) throw 0; saveAs('atlas-litoral-manzanillo-mapa.png', b); toast('Mapa descargado'); }); } catch (e) { toast('Tu navegador bloquea exportar el mapa desde archivos locales. Funciona al abrir el sitio con un servidor (Live Server) o en GitHub Pages.'); }
  };

  /* ---------- Inicio ---------- */
  selectBeach(0); scaleBar(); layersChanged();
  if (location.hash === '#medir') setTool('dist');
})();
