/* modelos-3d.js — galería filtrable + visor 3D (Sketchfab si hay ID, three.js integrado si no) */
(function () {
  var M = window.MODELOS, CATS = window.MODELOS_CATS, st = { cat: 'todas', q: '', sitio: '', orden: 'rec', cur: 0, list: [] };
  var T = { ready: false, loading: false, wire: false, exag: 1 };
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var res = function (m) { var n = parseFloat(m.resolucion); return isNaN(n) ? 99 : n; };

  function cats() {
    $('#cat-list').innerHTML = CATS.map(function (c) { var n = c[0] === 'todas' ? M.length : M.filter(function (m) { return m.cat === c[0]; }).length; return '<button class="cat-item' + (st.cat === c[0] ? ' on' : '') + '" data-c="' + c[0] + '"><span>' + c[1] + '</span><small>' + n + '</small></button>'; }).join('');
  }
  $('#cat-list').addEventListener('click', function (e) { var b = e.target.closest('.cat-item'); if (!b) return; st.cat = b.dataset.c; cats(); render(); });
  var sitios = {}; M.forEach(function (m) { sitios[m.sitio] = 1; });
  $('#m-sitio').innerHTML += Object.keys(sitios).sort().map(function (s) { return '<option>' + s + '</option>'; }).join('');
  $('#m-q').oninput = function () { st.q = norm(this.value); render(); };
  $('#m-sitio').onchange = function () { st.sitio = this.value; render(); };
  $('#m-orden').onchange = function () { st.orden = this.value; render(); };

  function render() {
    var l = M.filter(function (m) { return (st.cat === 'todas' || m.cat === st.cat) && (!st.sitio || m.sitio === st.sitio) && (!st.q || norm(m.nombre + ' ' + m.sitio + ' ' + m.tecnica + ' ' + m.tags.join(' ')).indexOf(st.q) >= 0); });
    l.sort(function (a, b) { return st.orden === 'az' ? a.nombre.localeCompare(b.nombre) : st.orden === 'res' ? res(a) - res(b) : (b['año'] - a['año']) || a.nombre.localeCompare(b.nombre); });
    st.list = l;
    $('#m-count').textContent = l.length + ' modelo' + (l.length === 1 ? '' : 's');
    $('#mod-grid').innerHTML = l.length ? l.map(function (m, i) { return '<article class="mcard card hover" data-i="' + i + '" tabindex="0" role="button" aria-label="Ver modelo ' + m.nombre + '"><div class="im"><img src="' + m.img + '" alt="' + m.nombre + '" loading="lazy"></div><div class="bd"><h3>' + m.nombre + '</h3><small>Modelo 3D · ' + m['año'] + '</small><span class="btn btn-outline btn-sm">Ver modelo</span></div></article>'; }).join('') : '<div class="empty">No hay modelos con esos filtros.</div>';
  }
  $('#mod-grid').addEventListener('click', function (e) { var c = e.target.closest('.mcard'); if (c) open(+c.dataset.i); });
  $('#mod-grid').addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.dataset.i) open(+e.target.dataset.i); });

  /* ---------- modal ---------- */
  function msg(t) { var m = $('#mv-msg'); m.style.display = t ? 'flex' : 'none'; m.innerHTML = t || ''; }
  function open(i) {
    st.cur = i; var m = st.list[i], cat = CATS.filter(function (c) { return c[0] === m.cat; })[0];
    $('#mv-cat').textContent = cat ? cat[1] : ''; $('#mv-title').textContent = m.nombre; $('#mv-lugar').textContent = m.lugar;
    $('#mv-tec').textContent = m.tecnica; $('#mv-res').textContent = m.resolucion; $('#mv-año').textContent = m['año']; $('#mv-ver').textContent = m.vertices;
    $('#mv-tags').innerHTML = m.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
    var sk = $('#mv-sk'), ifr = $('#mv-ifr'), host = $('#m3d');
    $('#mv').classList.add('on'); document.body.style.overflow = 'hidden';
    if (m.sketchfab) {
      host.hidden = true; $('#mv-tools').hidden = true; $('#mv-hint').hidden = true; ifr.hidden = false; ifr.setAttribute('allow', 'autoplay; fullscreen; xr-spatial-tracking'); ifr.allowFullscreen = true; ifr.src = 'https://sketchfab.com/models/' + m.sketchfab + '/embed?autostart=1&ui_theme=dark';
      sk.hidden = false; sk.href = 'https://sketchfab.com/models/' + m.sketchfab; $('#mv-obj').hidden = true; $('#mv-note').textContent = 'Visualización 3D interactiva con Sketchfab.'; msg(''); return;
    }
    ifr.hidden = true; sk.hidden = true; host.hidden = false; $('#mv-tools').hidden = false; $('#mv-hint').hidden = false; $('#mv-obj').hidden = false;
    $('#mv-note').textContent = 'Terreno 3D generado a partir de la imagen del sitio (demostración). Para publicar el modelo real escribe su ID de Sketchfab en js/data/modelos.js.';
    msg('Cargando visor 3D…');
    ensureThree(function () { try { go(m); } catch (e) { msg('No se pudo iniciar el visor 3D (¿WebGL desactivado?).'); } }, function () { msg('No se pudo cargar three.js. Revisa tu conexión a internet.'); });
  }
  function close() { $('#mv').classList.remove('on'); document.body.style.overflow = ''; $('#mv-ifr').removeAttribute('src'); cancelAnimationFrame(T.raf); }
  $('#mv-x').onclick = close; $('#mv').addEventListener('click', function (e) { if (e.target.id === 'mv') close(); });
  document.addEventListener('keydown', function (e) { if (!$('#mv').classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') nav(1); if (e.key === 'ArrowLeft') nav(-1); });
  function nav(d) { open((st.cur + d + st.list.length) % st.list.length); }
  $('#mv-prev').onclick = function () { nav(-1); }; $('#mv-next').onclick = function () { nav(1); };

  /* ---------- three.js ---------- */
  function loadScript(src, ok, err) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = err; document.head.appendChild(s); }
  function ensureThree(ok, err) {
    if (window.THREE && THREE.OrbitControls) return ok();
    var ctl = function () { loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js', ok, err); };
    if (window.THREE) return ctl();
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', ctl, function () { loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js', ctl, err); });
  }
  function init() {
    var host = $('#m3d'); T.scene = new THREE.Scene(); T.cam = new THREE.PerspectiveCamera(45, 1, .1, 200);
    T.ren = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); T.ren.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); host.appendChild(T.ren.domElement);
    T.scene.add(new THREE.AmbientLight(0xffffff, .65)); var dl = new THREE.DirectionalLight(0xffffff, .9); dl.position.set(6, 10, 4); T.scene.add(dl);
    T.ctrl = new THREE.OrbitControls(T.cam, T.ren.domElement); T.ctrl.enableDamping = true; T.ctrl.dampingFactor = .08; T.ctrl.autoRotate = true; T.ctrl.autoRotateSpeed = .9; T.ctrl.maxPolarAngle = Math.PI * .495;
    window.addEventListener('resize', resize); T.ready = true;
  }
  function resize() { if (!T.ren) return; var h = $('#mv-view'), w = h.clientWidth, hh = h.clientHeight; if (!w) return; T.ren.setSize(w, hh); T.cam.aspect = w / hh; T.cam.updateProjectionMatrix(); }
  function reset() { T.cam.position.set(9, 8, 11); T.cam.lookAt(0, 0, 0); T.ctrl.target.set(0, 0, 0); T.ctrl.update(); }
  function loop() { T.raf = requestAnimationFrame(loop); T.ctrl.update(); T.ren.render(T.scene, T.cam); }
  function go(m) {
    if (!T.ready) init(); resize(); build(m); T.exag = 1; $('#t-ex').value = 1; $('#t-ev').textContent = '1.0×'; apply(); reset(); T.ctrl.autoRotate = true; $('#t-rot').classList.add('on'); msg(''); cancelAnimationFrame(T.raf); loop();
  }
  function build(m) {
    var img = new Image(), N = 140;
    var make = function (d, im) {
      var lum = new Float32Array(N * N), sd = st.cur * 1.7 + 1;
      for (var i = 0; i < N * N; i++) { if (d) lum[i] = (.299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2]) / 255; else { var u = (i % N) / N, v = Math.floor(i / N) / N, h = .5 + .22 * Math.sin(u * 6 + sd) * Math.cos(v * 5 - sd) + .14 * Math.sin(u * 13 + v * 9 + sd * 2) + .07 * Math.sin(u * 27 - v * 21 + sd), sea = Math.max(0, 1 - u * 1.3 + .15 * Math.sin(v * 7 + sd)); lum[i] = Math.max(.05, h - .45 * sea); } }
      var sm = new Float32Array(N * N);
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { var s = 0, n = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var yy = y + dy, xx = x + dx; if (yy >= 0 && yy < N && xx >= 0 && xx < N) { s += lum[yy * N + xx]; n++; } } sm[y * N + x] = s / n; }
      var geo = new THREE.PlaneGeometry(10, 10, N - 1, N - 1); geo.rotateX(-Math.PI / 2); T.base = sm; T.geo = geo; T.N = N;
      var mat;
      if (d) { var cv = document.createElement('canvas'); cv.width = cv.height = 512; cv.getContext('2d').drawImage(im, 0, 0, 512, 512); mat = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(cv), roughness: .92, side: THREE.DoubleSide, wireframe: T.wire }); }
      else { var col = new Float32Array(N * N * 3); for (var q = 0; q < N * N; q++) { var hv = sm[q], c = hv < .3 ? [.05, .33, .45] : hv < .4 ? [.86, .78, .55] : hv < .6 ? [.25, .5, .25] : [.45, .4, .35]; col[q * 3] = c[0]; col[q * 3 + 1] = c[1]; col[q * 3 + 2] = c[2]; } geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, side: THREE.DoubleSide, wireframe: T.wire }); }
      if (T.mesh) { T.scene.remove(T.mesh); T.mesh.geometry.dispose(); T.mesh.material.dispose(); }
      T.mesh = new THREE.Mesh(geo, mat); T.scene.add(T.mesh); apply();
    };
    img.onload = function () { var c = document.createElement('canvas'); c.width = c.height = N, d = null; var x = c.getContext('2d', { willReadFrequently: true }); var d = null; try { x.drawImage(img, 0, 0, N, N); d = x.getImageData(0, 0, N, N).data; } catch (e) { d = null; } make(d, img); };
    img.onerror = function () { make(null, img); }; img.src = m.img;
  }
  function apply() { if (!T.geo) return; var p = T.geo.attributes.position; for (var i = 0; i < T.N * T.N; i++) p.setY(i, (T.base[i] - .35) * 1.7 * T.exag); p.needsUpdate = true; T.geo.computeVertexNormals(); }
  $('#t-rot').onclick = function () { T.ctrl.autoRotate = !T.ctrl.autoRotate; this.classList.toggle('on', T.ctrl.autoRotate); };
  $('#t-wire').onclick = function () { T.wire = !T.wire; if (T.mesh) T.mesh.material.wireframe = T.wire; this.classList.toggle('on', T.wire); };
  $('#t-ex').oninput = function () { T.exag = parseFloat(this.value); $('#t-ev').textContent = T.exag.toFixed(1) + '×'; apply(); };
  $('#t-reset').onclick = function () { reset(); };
  $('#t-full').onclick = function () { var el = $('#mv-view'); if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen(); };
  document.addEventListener('fullscreenchange', function () { setTimeout(resize, 150); });
  $('#t-shot').onclick = function () { try { T.ren.render(T.scene, T.cam); saveAs('modelo-3d-' + slug(st.list[st.cur].nombre) + '.png', T.ren.domElement.toDataURL('image/png')); toast('Captura guardada'); } catch (e) { toast('No se pudo guardar la captura.'); } };
  $('#mv-obj').onclick = function () {
    if (!T.geo) { toast('Espera a que cargue el modelo.'); return; }
    var N = T.N, p = T.geo.attributes.position, nm = st.list[st.cur].nombre, o = '# ' + nm + ' — malla de demostración · Atlas Digital del Litoral de Manzanillo\n', i, j;
    for (i = 0; i < N * N; i++) o += 'v ' + p.getX(i).toFixed(4) + ' ' + p.getY(i).toFixed(4) + ' ' + p.getZ(i).toFixed(4) + '\n';
    for (j = 0; j < N - 1; j++) for (i = 0; i < N - 1; i++) { var a = j * N + i + 1, b = a + 1, c = a + N, d = c + 1; o += 'f ' + a + ' ' + c + ' ' + b + '\nf ' + b + ' ' + c + ' ' + d + '\n'; }
    saveAs(slug(nm) + '.obj', new Blob([o], { type: 'text/plain' })); toast('Malla OBJ descargada');
  };

  cats(); render();
  var hid = (location.hash || '').slice(1); if (hid) { var k = st.list.map(function (m) { return m.id; }).indexOf(hid); if (k >= 0) open(k); }
})();
