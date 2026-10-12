/* layout.js — inyecta encabezado y pie de página compartidos en todas las páginas */
(function () {
  var S = window.SITE, page = document.body.dataset.page || 'inicio';
  var link = function (id) { return S.paginas.filter(function (p) { return p.id === id; })[0].href; };

  var header =
    '<a class="skip-link" href="#contenido">Saltar al contenido</a>' +
    '<header class="site-header" id="site-header"><div class="header-inner">' +
      '<a class="brand" href="index.html" aria-label="Inicio — ' + S.nombre + '">' +
        '<img src="assets/img/logos/unam.png" alt="UNAM">' +
        '<span class="brand-sep"></span>' +
        '<span class="brand-fi"><b>' + S.proyecto + '</b>Facultad de<br>Ingeniería</span>' +
      '</a>' +
      '<nav class="nav" id="nav" aria-label="Principal">' +
        S.paginas.map(function (p) { return '<a href="' + p.href + '"' + (p.id === page ? ' class="active" aria-current="page"' : '') + '>' + p.label + '</a>'; }).join('') +
      '</nav>' +
      '<button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span></button>' +
    '</div></header>';

  var footer =
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand"><img src="assets/img/logos/unam.png" alt="UNAM">' +
          '<h3 style="font-size:1.05rem;margin-bottom:8px">' + S.nombre + '</h3>' +
          '<p>Infraestructura académica digital interactiva para el análisis geoespacial de la vulnerabilidad costera en Manzanillo, Colima, con fotogrametría, modelado 3D y análisis remoto multitemporal.</p></div>' +
        '<div class="footer-col"><h4>Explorar</h4>' +
          ['visor', 'modelos', 'timeline', 'vulnerabilidad'].map(function (id) { return '<a href="' + link(id) + '">→ ' + S.paginas.filter(function (p) { return p.id === id; })[0].label + '</a>'; }).join('') + '</div>' +
        '<div class="footer-col"><h4>Recursos</h4>' +
          ['datos', 'proyecto', 'participantes', 'multimedia'].map(function (id) { return '<a href="' + link(id) + '">→ ' + S.paginas.filter(function (p) { return p.id === id; })[0].label + '</a>'; }).join('') + '</div>' +
        '<div class="footer-col"><h4>Contacto</h4>' +
          '<a href="mailto:' + S.correo + '">' + S.correo + '</a>' +
          '<li>' + S.institucion + '<br>Ciudad de México</li>' +
          '<li style="margin-top:8px">Proyecto ' + S.proyecto + '</li></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© <span id="year"></span> Universidad Nacional Autónoma de México. Todos los derechos reservados.</span>' +
      '<span>Con el apoyo del programa PAPIIT · DGAPA-UNAM</span></div>' +
    '</div></footer>' +
    '<button class="to-top" id="to-top" aria-label="Volver arriba">↑</button>' +
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>' +
    '<div class="modal" id="modal" role="dialog" aria-modal="true"><div class="modal-box"><button class="modal-x" aria-label="Cerrar" data-close>✕</button><div id="modal-body"></div></div></div>';

  var h = document.getElementById('app-header'); if (h) h.outerHTML = header;
  var f = document.getElementById('app-footer'); if (f) f.outerHTML = footer; else document.body.insertAdjacentHTML('beforeend', footer.replace(/<footer[\s\S]*?<\/footer>/, ''));
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
