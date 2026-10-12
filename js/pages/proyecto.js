/* proyecto.js — metodología interactiva, scroll-spy, instituciones y productos */
(function () {
  var steps = window.METODO || [];
  function show(i) {
    $$('.step').forEach(function (b, j) { b.classList.toggle('on', j === i); });
    var s = steps[i];
    $('#step-detail').innerHTML = '<h4>' + (i + 1) + '. ' + s.t + '</h4><p>' + s.d + '</p><ul>' + s.l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
  }
  $$('.step').forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.i); }); });
  show(0);
  var P = window.PARTICIPANTES;
  if (P) $('#inst-list').innerHTML = P.instituciones.map(function (x) { return '<div class="inst-chip"><i>' + x.icono + '</i><b>' + x.nombre + '</b></div>'; }).join('');
  var D = window.DATOS || [], tipos = {};
  D.forEach(function (d) { tipos[d.tipo] = (tipos[d.tipo] || 0) + 1; });
  $('#prod-grid').innerHTML = Object.keys(tipos).map(function (t) { return '<div class="prod"><b>' + t + '</b><small>' + tipos[t] + ' producto' + (tipos[t] > 1 ? 's' : '') + '</small></div>'; }).join('');
  /* scroll-spy */
  var links = $$('#proy-nav a'), secs = links.map(function (a) { return $(a.getAttribute('href')); });
  function spy() { var y = window.scrollY + 160, cur = 0; secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; }); links.forEach(function (a, i) { a.classList.toggle('on', i === cur); }); }
  window.addEventListener('scroll', spy, { passive: true }); spy();
  links.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var t = $(a.getAttribute('href')); window.scrollTo({ top: t.offsetTop - 90, behavior: 'smooth' }); history.replaceState(null, '', a.getAttribute('href')); }); });
})();
