/* datos-resultados.js — repositorio filtrable, ordenable y descargable */
(function () {
  var D = window.DATOS, st = { tipo: '', sitio: '', año: '', cat: '', q: '', k: 'año', dir: -1 };
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var uniq = function (k) { var o = {}; D.forEach(function (d) { o[d[k]] = 1; }); return Object.keys(o).sort(function (a, b) { return k === 'año' ? b - a : a.localeCompare(b); }); };
  function fill(id, k, all) { $('#' + id).innerHTML = '<option value="">' + all + '</option>' + uniq(k).map(function (v) { return '<option>' + v + '</option>'; }).join(''); }
  fill('f-tipo', 'tipo', 'Todos los tipos'); fill('f-sitio', 'sitio', 'Todos los sitios'); fill('f-año', 'año', 'Todos los años'); fill('f-cat', 'categoria', 'Todas las categorías');
  [['f-tipo', 'tipo'], ['f-sitio', 'sitio'], ['f-año', 'año'], ['f-cat', 'cat']].forEach(function (p) { $('#' + p[0]).onchange = function () { st[p[1]] = this.value; render(); }; });
  $('#f-q').oninput = function () { st.q = norm(this.value); render(); };
  $('#f-clear').onclick = function () { st.tipo = st.sitio = st.año = st.cat = st.q = ''; ['f-tipo', 'f-sitio', 'f-año', 'f-cat', 'f-q'].forEach(function (i) { $('#' + i).value = ''; }); render(); };
  $$('#dat-table th[data-k]').forEach(function (th) {
    var go = function () { var k = th.dataset.k; st.dir = st.k === k ? -st.dir : 1; st.k = k; render(); };
    th.onclick = go; th.onkeydown = function (e) { if (e.key === 'Enter') go(); };
  });
  var sizeMB = function (s) { var n = parseFloat(s), u = /GB/i.test(s) ? 1024 : /KB/i.test(s) ? 1 / 1024 : 1; return n * u; };
  function render() {
    var l = D.filter(function (d) { return (!st.tipo || d.tipo === st.tipo) && (!st.sitio || d.sitio === st.sitio) && (!st.año || String(d['año']) === st.año) && (!st.cat || d.categoria === st.cat) && (!st.q || norm(d.nombre + ' ' + d.desc + ' ' + d.formato).indexOf(st.q) >= 0); });
    l.sort(function (a, b) { var x = a[st.k], y = b[st.k]; if (st.k === 'tamaño') { x = sizeMB(x); y = sizeMB(y); } var r = typeof x === 'number' ? x - y : String(x).localeCompare(String(y)); return r * st.dir || a.nombre.localeCompare(b.nombre); });
    $$('#dat-table th[data-k]').forEach(function (th) { th.classList.toggle('asc', th.dataset.k === st.k && st.dir > 0); th.classList.toggle('desc', th.dataset.k === st.k && st.dir < 0); });
    $('#f-count').textContent = l.length + ' de ' + D.length + ' productos';
    $('#dat-body').innerHTML = l.length ? l.map(function (d) { return '<tr><td><b>' + d.nombre + '</b></td><td class="d">' + d.desc + '</td><td>' + d['año'] + '</td><td><span class="fmt">' + d.formato + '</span></td><td>' + d['tamaño'] + '</td><td><button class="dl-btn" data-n="' + D.indexOf(d) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>Descargar</button></td></tr>'; }).join('') : '<tr><td colspan="6"><div class="empty">Ningún producto coincide con los filtros.</div></td></tr>';
  }
  $('#dat-body').addEventListener('click', function (e) {
    var b = e.target.closest('.dl-btn'); if (!b) return; var d = D[+b.dataset.n];
    if (d.archivo) { saveAs(d.archivo.split('/').pop(), d.archivo); toast('Descargando ' + d.nombre); return; }
    var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
    var csv = '﻿campo,valor\n' + [['Producto', d.nombre], ['Descripción', d.desc], ['Año', d['año']], ['Formato', d.formato], ['Tamaño', d['tamaño']], ['Tipo', d.tipo], ['Sitio', d.sitio], ['Categoría', d.categoria], ['Proyecto', 'PAPIIT IF100926 — Atlas Digital del Litoral de Manzanillo'], ['Nota', 'Ficha de metadatos: el archivo original aún no está publicado en el sitio']].map(function (r) { return q(r[0]) + ',' + q(r[1]); }).join('\n');
    saveAs('ficha-' + slug(d.nombre) + '.csv', new Blob([csv], { type: 'text/csv;charset=utf-8' })); toast('Se descargó la ficha de metadatos (el archivo original aún no está cargado).');
  });
  $('#dat-mail').href = 'mailto:' + (window.SITE && SITE.correo || '') + '?subject=' + encodeURIComponent('Consulta — Atlas Digital del Litoral de Manzanillo');
  render();
})();
