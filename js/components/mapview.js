/* mapview.js — visor de imagen con zoom/arrastre (rueda, doble clic, pellizco).
   var pz = PanZoom(stage, inner, { aspect, max, onChange(state), onClick(fx, fy, ev) })
   inner recibe transform; las variables CSS --inv (=1/zoom) permiten marcadores de tamaño constante. */
window.PanZoom = function (stage, inner, opt) {
  opt = opt || {};
  var st = { x: 0, y: 0, s: 1, w: 0, h: 0 }, ptrs = {}, drag = null, pinch = null, aspect = opt.aspect || 1.375, MAX = opt.max || 8;
  function clamp() {
    var W = stage.clientWidth, H = stage.clientHeight, w = st.w * st.s, h = st.h * st.s;
    st.x = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, st.x));
    st.y = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, st.y));
  }
  function apply() {
    inner.style.transform = 'translate(' + st.x + 'px,' + st.y + 'px) scale(' + st.s + ')';
    inner.style.setProperty('--inv', 1 / st.s);
    if (opt.onChange) opt.onChange(st);
  }
  function fit(reset) {
    var W = stage.clientWidth, H = stage.clientHeight; if (!W || !H) return;
    var ow = st.w, w = Math.max(W, H * aspect); st.w = w; st.h = w / aspect;
    inner.style.width = st.w + 'px'; inner.style.height = st.h + 'px';
    if (reset || !ow) { st.s = 1; st.x = (W - st.w) / 2; st.y = (H - st.h) / 2; }
    clamp(); apply();
  }
  function zoomAt(px, py, ns) {
    ns = Math.max(1, Math.min(MAX, ns)); var k = ns / st.s;
    st.x = px - (px - st.x) * k; st.y = py - (py - st.y) * k; st.s = ns; clamp(); apply();
  }
  var api = {
    state: st, fit: fit,
    zoomBy: function (f) { zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, st.s * f); },
    reset: function () { fit(true); },
    flyTo: function (fx, fy, s) { var W = stage.clientWidth, H = stage.clientHeight; st.s = Math.min(MAX, s || 3); st.x = W / 2 - fx * st.w * st.s; st.y = H / 2 - fy * st.h * st.s; clamp(); apply(); },
    local: function (e) { var r = stage.getBoundingClientRect(); return [(e.clientX - r.left - st.x) / (st.w * st.s), (e.clientY - r.top - st.y) / (st.h * st.s)]; },
    enabled: true
  };
  stage.addEventListener('wheel', function (e) { if (!api.enabled) return; e.preventDefault(); var r = stage.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, st.s * (e.deltaY < 0 ? 1.18 : 1 / 1.18)); }, { passive: false });
  stage.addEventListener('dblclick', function (e) { if (!api.enabled || e.target.closest('[data-nodrag]')) return; var r = stage.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, st.s * 1.8); });
  stage.addEventListener('pointerdown', function (e) {
    if (!api.enabled || e.target.closest('[data-nodrag]') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    ptrs[e.pointerId] = [e.clientX, e.clientY];
    var ids = Object.keys(ptrs);
    if (ids.length === 1) { drag = { x: e.clientX, y: e.clientY, ox: st.x, oy: st.y, moved: false }; }
    else if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: st.s }; drag = null; }
  });
  stage.addEventListener('pointermove', function (e) {
    if (!ptrs[e.pointerId]) return; ptrs[e.pointerId] = [e.clientX, e.clientY];
    if (pinch) { var ids = Object.keys(ptrs); if (ids.length < 2) return; var a = ptrs[ids[0]], b = ptrs[ids[1]], r = stage.getBoundingClientRect(); zoomAt((a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top, pinch.s * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d); return; }
    if (!drag) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 4) { drag.moved = true; stage.classList.add('grabbing'); try { stage.setPointerCapture(e.pointerId); } catch (x) {} }
    if (drag.moved) { st.x = drag.ox + dx; st.y = drag.oy + dy; clamp(); apply(); }
  });
  function up(e) {
    if (!ptrs[e.pointerId]) return; delete ptrs[e.pointerId];
    if (pinch) { if (Object.keys(ptrs).length < 2) pinch = null; return; }
    stage.classList.remove('grabbing');
    if (drag && !drag.moved && e.type === 'pointerup' && opt.onClick) { var l = api.local(e); if (l[0] >= 0 && l[0] <= 1 && l[1] >= 0 && l[1] <= 1) opt.onClick(l[0], l[1], e); }
    drag = null;
  }
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  window.addEventListener('resize', function () { fit(false); });
  fit(true);
  return api;
};
