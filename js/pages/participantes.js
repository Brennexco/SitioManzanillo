/* participantes.js — pestañas, búsqueda, ficha en ventana y directorio completo */
(function () {
  var P = window.PARTICIPANTES;
  var TABS = [['investigadores', 'Investigadores'], ['tecnicos', 'Técnicos'], ['estudiantes', 'Estudiantes'], ['colaboradores', 'Colaboradores'], ['instituciones', 'Instituciones']];
  var st = { tab: 'investigadores', q: '' };
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>', LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>', USER = '<svg viewBox="0 0 40 40" fill="currentColor"><circle cx="20" cy="15" r="8"/><path d="M5 38c0-9 7-14 15-14s15 5 15 14z"/></svg>';
  var ini = function (n) { return n.replace(/^(Dra?\.)\s*/, '').split(' ').slice(0, 2).map(function (w) { return w[0]; }).join(''); };

  $('#par-tabs').innerHTML = TABS.map(function (t) { return '<button class="tab" role="tab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('');
  $('#par-tabs').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) setTab(b.dataset.t); });
  $('#par-q').oninput = function () { st.q = norm(this.value); render(); };
  function setTab(t) { st.tab = t; $$('#par-tabs .tab').forEach(function (b) { b.classList.toggle('active', b.dataset.t === t); b.setAttribute('aria-selected', b.dataset.t === t); }); render(); history.replaceState(null, '', t === 'investigadores' ? location.pathname : '#' + t); }
  function photo(p, big) { if (p.foto) return '<div class="ph"><img src="' + p.foto + '" alt="' + p.nombre + '" loading="lazy"></div>'; if (p.icono) return '<div class="ph ph-i">' + p.icono + '</div>'; return '<div class="ph ph-p">' + USER + '</div>'; }
  function render() {
    var l = (P[st.tab] || []).filter(function (p) { return !st.q || norm(p.nombre + ' ' + p.rol + ' ' + p.inst).indexOf(st.q) >= 0; });
    $('#par-grid').innerHTML = l.length ? l.map(function (p, i) {
      return '<button class="pcd card hover' + (p.placeholder ? ' ph-card' : '') + '" data-i="' + i + '"><div style="display:contents">' + photo(p) + '</div><h3>' + p.nombre + '</h3><div class="rol' + (p.destacado ? ' dest' : '') + '">' + p.rol + '</div><div class="ins">' + p.inst + '</div>' + (p.placeholder || p.icono ? '' : '<div class="ico"><span class="' + (p.email ? 'on' : '') + '" title="Correo">' + MAIL + '</span><span class="' + (p.url ? 'on' : '') + '" title="Perfil">' + LINK + '</span></div>') + '</button>';
    }).join('') : '<div class="empty">No hay resultados.</div>';
    $('#par-grid')._l = l;
  }
  $('#par-grid').addEventListener('click', function (e) { var c = e.target.closest('.pcd'); if (!c) return; ficha($('#par-grid')._l[+c.dataset.i]); });
  function ficha(p) {
    var links = (p.email ? '<a class="btn btn-primary btn-sm" href="mailto:' + p.email + '">Enviar correo</a>' : '') + (p.url ? '<a class="btn btn-outline btn-sm" href="' + p.url + '" target="_blank" rel="noopener">Perfil académico</a>' : '');
    openModal('<div class="pm">' + photo(p).replace('class="ph"', 'class="ph"') + '<div><span class="badge">' + p.rol + '</span><h3>' + p.nombre + '</h3><p style="color:var(--teal);margin:0">' + p.inst + '</p><p>' + (p.bio || '') + '</p><div class="pm-links">' + (links || '<span style="color:var(--muted);font-size:.85rem">Datos de contacto por confirmar.</span>') + '</div></div></div>');
  }
  $('#par-all').onclick = function () {
    var h = '<span class="badge">Directorio</span><h3>Todos los participantes</h3>';
    TABS.forEach(function (t) { h += '<div class="dir-sec">' + t[1] + '</div>' + P[t[0]].map(function (p) { return '<div class="dir-row"><b>' + p.nombre + '</b><span>' + (p.placeholder ? 'Por confirmar' : p.rol + ' · ' + p.inst) + '</span></div>'; }).join(''); });
    openModal(h);
  };
  var h = (location.hash || '').slice(1); setTab(TABS.some(function (t) { return t[0] === h; }) ? h : 'investigadores');
})();
