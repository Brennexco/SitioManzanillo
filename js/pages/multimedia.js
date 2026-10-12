/* multimedia.js — galería filtrable con lightbox (fotos y videos) */
(function () {
  var M = window.MULTIMEDIA, C = window.MULTIMEDIA_CATS, st = { cat: 'todas', all: false, list: [] }, LIM = 8;
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  $('#mm-tabs').innerHTML = C.map(function (c) { return '<button class="tab" role="tab" data-c="' + c[0] + '">' + c[1] + '</button>'; }).join('');
  $('#mm-tabs').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) { st.cat = b.dataset.c; st.all = false; render(); } });
  function render() {
    $$('#mm-tabs .tab').forEach(function (b) { b.classList.toggle('active', b.dataset.c === st.cat); });
    st.list = M.filter(function (m) { return st.cat === 'todas' || m.cat.split(' ').indexOf(st.cat) >= 0; });
    var shown = st.all ? st.list : st.list.slice(0, LIM), isVid = function (m) { return m.cat.split(' ').indexOf('videos') >= 0; };
    $('#mm-grid').innerHTML = shown.map(function (m, i) { return '<button class="mi" data-i="' + i + '" aria-label="' + m.titulo + '"><img src="' + m.src + '" alt="' + m.titulo + '" loading="lazy">' + (isVid(m) ? '<span class="pl">' + PLAY + '</span><span class="kd">Video</span>' : '') + '<span class="cap">' + m.titulo + '</span></button>'; }).join('') || '<div class="empty">No hay elementos en esta categoría.</div>';
    $('#mm-count').textContent = shown.length + ' de ' + st.list.length + ' elementos';
    $('#mm-all').textContent = st.list.length > LIM && !st.all ? 'Ver galería completa' : 'Abrir en pantalla completa';
    $('#mm-all').hidden = !st.list.length;
  }
  function open(i) { openLightbox(st.list.map(function (m) { return { src: m.src, title: m.titulo + (m.cat.split(' ').indexOf('videos') >= 0 && !m.video ? ' (video por cargar)' : ''), video: m.video || '' }; }), i); }
  $('#mm-grid').addEventListener('click', function (e) { var b = e.target.closest('.mi'); if (b) open(+b.dataset.i); });
  $('#mm-all').onclick = function () { if (st.list.length > LIM && !st.all) { st.all = true; render(); } else open(0); };
  render();
})();
