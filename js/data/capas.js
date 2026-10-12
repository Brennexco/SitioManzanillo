/* Capas temáticas del Visor Geoespacial.
   Las geometrías están en coordenadas de la imagen base (1100 × 800) y son ILUSTRATIVAS: sustitúyelas por tus
   shapefiles/GeoJSON reales. GEO convierte coordenadas de imagen ↔ lat/lng (aproximado). */
window.GEO = { iw: 1100, ih: 800, lon0: -104.4050, lat0: 19.1155, dlon: 0.1167, dlat: 0.0802, kmPerPx: 12.25 / 1100 };
(function () {
  function bez(p0, c1, c2, p3, n) { var o = []; for (var i = 0; i <= n; i++) { var t = i / n, u = 1 - t; o.push([u*u*u*p0[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*p3[0], u*u*u*p0[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*p3[1]]); } return o; }
  function ell(cx, cy, rx, ry) { var o = []; for (var i = 0; i < 36; i++) { var a = i / 36 * 6.2832; o.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return o; }
  function rect(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
  function prof(x, y, ang) { var a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a); return [[x - dx * 16, y - dy * 16], [x + dx * 26, y + dy * 26]]; }
  window.CAPAS = [
    { id: 'geologia', nombre: 'Geología', color: '#facc15', leyenda: [['Depósitos aluviales / litorales', '#facc15'], ['Rocas volcánicas', '#b45309'], ['Rocas intrusivas', '#f472b6']], feats: [
      { t: 'poly', c: '#facc15', l: 'Depósitos aluviales / litorales', pts: [[335,405],[430,395],[500,420],[555,480],[600,560],[620,650],[585,640],[560,540],[500,470],[430,430],[340,435]] },
      { t: 'poly', c: '#b45309', l: 'Rocas volcánicas', pts: [[480,250],[700,230],[800,330],[760,420],[560,420],[500,330]] },
      { t: 'poly', c: '#f472b6', l: 'Rocas intrusivas', pts: [[780,430],[1060,430],[1060,710],[780,710]] }] },
    { id: 'geomorfologia', nombre: 'Geomorfología', color: '#a3e635', leyenda: [['Planicie costera', '#38bdf8'], ['Lomeríos', '#a3e635'], ['Sierra', '#fb923c']], feats: [
      { t: 'poly', c: '#38bdf8', l: 'Planicie costera', pts: ell(470, 440, 150, 70) }, { t: 'poly', c: '#a3e635', l: 'Lomeríos', pts: ell(900, 170, 150, 90) }, { t: 'poly', c: '#fb923c', l: 'Sierra', pts: ell(650, 260, 170, 120) }] },
    { id: 'perfiles', nombre: 'Perfiles de playa', color: '#facc15', leyenda: [['Transectos P1–P8', '#facc15']], feats: [
      [400,423,90],[445,433,101],[490,455,114],[530,497,127],[565,548,150],[588,612,178],[160,170,88],[240,174,80]].map(function (p, i) { return { t: 'line', c: '#facc15', w: 3, l: 'Perfil P' + (i + 1), pts: prof(p[0], p[1], p[2]) }; }) },
    { id: 'sedimentologia', nombre: 'Sedimentología', color: '#f59e0b', leyenda: [['Muestra de sedimento', '#f59e0b']], feats: [
      [408,432,'#fde68a','Arena media'],[470,452,'#fcd34d','Arena media'],[515,486,'#f59e0b','Arena gruesa'],[557,545,'#d97706','Arena gruesa / grava'],[582,598,'#b45309','Grava'],[585,640,'#fcd34d','Arena media'],[200,176,'#fde68a','Arena fina'],[255,178,'#fde68a','Arena fina']].map(function (p) { return { t: 'pt', c: p[2], l: 'Muestra: ' + p[3], p: [p[0], p[1]] }; }) },
    { id: 'mineralogia', nombre: 'Mineralogía', color: '#a78bfa', leyenda: [['Asociación mineral', '#a78bfa']], feats: [
      [395,412,'Magnetita–ilmenita'],[455,426,'Cuarzo–feldespato'],[505,460,'Cuarzo–feldespato'],[548,512,'Anfíbol–piroxeno'],[573,566,'Anfíbol–piroxeno']].map(function (p) { return { t: 'pt', shape: 'diamond', c: '#a78bfa', l: 'Asociación: ' + p[2], p: [p[0], p[1]] }; }) },
    { id: 'costas', nombre: 'Líneas de costa', color: '#e8fffb', leyenda: [['Línea de costa', '#e8fffb']], feats: [
      [[60,150],[75,168],[105,178],[135,172],[180,166],[230,168],[262,178],[290,200],[315,232],[327,262],[322,292],[300,312]],
      [[345,430],[385,422],[425,425],[462,440],[498,462],[528,495],[556,530],[576,565],[590,600],[588,640],[578,660]],
      [[205,520],[240,500],[285,478],[320,490],[360,545],[340,578],[290,590],[240,598],[210,585],[195,545],[205,520]],
      [[690,680],[730,710],[760,745],[800,790]]].map(function (l) { return { t: 'line', c: '#e8fffb', w: 2.5, l: 'Línea de costa', pts: l }; }) },
    { id: 'vulnerabilidad', nombre: 'Vulnerabilidad', color: '#f28a00', leyenda: [['Baja', '#22c55e'], ['Media', '#f59e0b'], ['Alta', '#ef4444']], feats: [], especial: 'vuln' },
    { id: 'uso', nombre: 'Uso de suelo', color: '#22c55e', leyenda: [['Urbano', '#ef4444'], ['Turístico', '#f97316'], ['Forestal', '#22c55e'], ['Agrícola / suelo desnudo', '#d4a373']], feats: [
      { t: 'poly', c: '#ef4444', l: 'Urbano', pts: [[310,395],[440,380],[480,430],[470,470],[330,440]] }, { t: 'poly', c: '#f97316', l: 'Turístico', pts: [[60,130],[240,125],[260,165],[120,170]] },
      { t: 'poly', c: '#22c55e', l: 'Forestal', pts: [[600,40],[1000,60],[1050,380],[700,300]] }, { t: 'poly', c: '#d4a373', l: 'Agrícola / suelo desnudo', pts: [[850,200],[1000,250],[980,330],[860,300]] }] },
    { id: 'ortomosaicos', nombre: 'Ortomosaicos', color: '#2dd4bf', leyenda: [['Cobertura de ortomosaico', '#2dd4bf']], feats: [
      { t: 'poly', c: '#2dd4bf', dash: 1, l: 'Ortomosaico 2024 · La Audiencia', pts: rect(60, 118, 205, 66) }, { t: 'poly', c: '#2dd4bf', dash: 1, l: 'Ortomosaico 2024 · Miramar', pts: rect(500, 520, 160, 150) }] },
    { id: 'huracanes', nombre: 'Huracanes históricos', color: '#c084fc', leyenda: [['Trayectoria (ilustrativa)', '#c084fc']], feats: [
      { t: 'line', c: '#c084fc', dash: 1, w: 3, l: 'Trayectoria A (ilustrativa)', pts: bez([30,780],[150,650],[300,560],[420,455], 24) },
      { t: 'line', c: '#c084fc', dash: 1, w: 3, l: 'Trayectoria B (ilustrativa)', pts: bez([0,520],[100,480],[160,380],[250,300], 24) },
      { t: 'line', c: '#c084fc', dash: 1, w: 3, l: 'Trayectoria C (ilustrativa)', pts: bez([200,800],[320,740],[440,700],[575,640], 24) }] }
  ];
  window.px2ll = function (x, y) { return { lng: GEO.lon0 + x / GEO.iw * GEO.dlon, lat: GEO.lat0 - y / GEO.ih * GEO.dlat }; };
  window.ll2px = function (lat, lng) { return [(lng - GEO.lon0) / GEO.dlon * GEO.iw, (GEO.lat0 - lat) / GEO.dlat * GEO.ih]; };
})();
