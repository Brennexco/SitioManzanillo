
// ══ MODELOS SEARCH ══
function searchModelos(q) {
  q = (q||'').toLowerCase();
  document.querySelectorAll('.modelo-card').forEach(function(card){
    var name = card.querySelector('.modelo-name');
    var text = name ? name.textContent.toLowerCase() : '';
    card.style.display = (!q || text.includes(q)) ? 'block' : 'none';
  });
}

// ══ VISOR SHARE ══
function shareVisor() {
  var url = window.location.href;
  if(navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function(){
      var tip = document.createElement('div');
      tip.textContent = '✅ Enlace copiado al portapapeles';
      tip.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(45,212,191,0.95);color:#0a0f1a;padding:10px 24px;border-radius:6px;font-size:12px;font-weight:700;z-index:9999;animation:fadeUp .3s ease;';
      document.body.appendChild(tip);
      setTimeout(function(){ tip.remove(); }, 2500);
    });
  }
}

// ══ DATOS FILTERS ══
function applyFilters() {
  // placeholder - in real use would filter table rows
  var rows = document.querySelectorAll('.datos-row');
  rows.forEach(function(r){ r.style.display='table-row'; });
}
function clearFilters() {
  ['filter-tipo','filter-playa','filter-año','filter-cat'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.selectedIndex = 0;
  });
  applyFilters();
}

// ══ PROYECTO SECTIONS ══
function showProyecto(section, el) {
  // hide all sections
  document.querySelectorAll('.proy-section').forEach(function(s){ s.style.display='none'; });
  // show target
  var target = document.getElementById('proy-'+section);
  if(target) {
    target.style.display='block';
    // re-trigger animations
    target.querySelectorAll('.sr').forEach(function(el){ el.classList.remove('vis'); });
    setTimeout(function(){
      target.querySelectorAll('.sr').forEach(function(el){ el.classList.add('vis'); });
    }, 50);
  }
  // update sidebar active
  document.querySelectorAll('.proyecto-sidebar .sidebar-item').forEach(function(i){ i.classList.remove('active'); });
  if(el) el.classList.add('active');
  // scroll body to top
  var body = document.querySelector('.proyecto-body');
  if(body) body.scrollTop = 0;
}

// ══════════════════════════════════════════
// NAVEGACIÓN
// ══════════════════════════════════════════
function goTo(id) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nav-link').forEach(function(n){ n.classList.remove('active'); });
  var pg = document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  var idx = {inicio:0,proyecto:1,visor:2,modelos:3,timeline:4,vulnerabilidad:5,datos:6,participantes:7,multimedia:8};
  var links = document.querySelectorAll('.nav-link');
  if(links[idx[id]]) links[idx[id]].classList.add('active');
  window.scrollTo(0,0);
  if(id==='inicio') { animHero(); }
  if(id==='visor') { setTimeout(function(){ loadLeafletAndInit(); }, 150); }
  // Trigger scroll-reveal on page switch
  setTimeout(function(){
    var p = document.getElementById('page-'+id);
    if(!p) return;
    p.querySelectorAll('.sr').forEach(function(el){ el.classList.add('vis'); });
    p.querySelectorAll('.sr-child').forEach(function(el,i){
      setTimeout(function(){ el.classList.add('vis'); }, i*70);
    });
  }, 80);
}

// ══════════════════════════════════════════
// SIDEBAR / TABS
// ══════════════════════════════════════════
function activeSidebar(el) {
  var sb = el.closest('.proyecto-sidebar');
  if(sb) sb.querySelectorAll('.sidebar-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
}
function filterModelos(el, cat) {
  document.querySelectorAll('.cat-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
  document.querySelectorAll('.modelo-card').forEach(function(card){
    card.style.display = (cat==='todas' || card.dataset.cat===cat) ? 'block' : 'none';
  });
}
function setYear(wrap, pct, year) {
  document.querySelectorAll('.tl-dot').forEach(function(d){
    d.classList.remove('active'); d.style.background=''; d.style.borderColor=''; d.style.boxShadow='';
  });
  document.querySelectorAll('.tl-year').forEach(function(y){ y.classList.remove('active'); });
  wrap.querySelector('.tl-dot').classList.add('active');
  wrap.querySelector('.tl-year').classList.add('active');
  var prog = document.getElementById('tl-prog');
  if(prog) prog.style.width = pct+'%';
  var years = ['2008','2012','2015','2020','2024'];
  var i = years.indexOf(year);
  var ly = years[Math.max(0,i-1)];
  var el1=document.getElementById('tl-left-label'), el2=document.getElementById('tl-right-label'), elp=document.getElementById('tl-period');
  if(el1) el1.textContent=ly; if(el2) el2.textContent=year; if(elp) elp.textContent=ly+'–'+year;
}
function filterDatos(el) {
  document.querySelectorAll('.filter-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
}
function activePart(el, section) {
  document.querySelectorAll('.part-tab').forEach(function(t){ t.classList.remove('active'); });
  el.classList.add('active');
  document.querySelectorAll('.part-section').forEach(function(s){ s.style.display='none'; });
  var target = document.getElementById('part-'+section);
  if(target) {
    target.style.display='block';
    target.querySelectorAll('.sr,.sr-child').forEach(function(el){ el.classList.remove('vis'); });
    setTimeout(function(){
      target.querySelectorAll('.sr').forEach(function(el){ el.classList.add('vis'); });
      target.querySelectorAll('.sr-child').forEach(function(el,i){ setTimeout(function(){ el.classList.add('vis'); }, i*70); });
    }, 50);
  }
}
function activeMulti(el, cat) {
  document.querySelectorAll('.multi-tab').forEach(function(t){ t.classList.remove('active'); });
  el.classList.add('active');
  document.querySelectorAll('[data-cat]').forEach(function(card){
    if(!cat || cat==='todas') { card.style.display='block'; return; }
    card.style.display = card.dataset.cat.includes(cat) ? 'block' : 'none';
  });
}

// ══════════════════════════════════════════
// MODELOS 3D
// ══════════════════════════════════════════
var modelosData = [
  { name:'Playa La Audiencia', eyebrow:'Modelo 3D · Playa · Manzanillo', tags:['Fotogrametría','RTK','Playa'], tecnica:'Fotogrametría UAV', resolucion:'5 cm/píxel', año:'2024', vertices:'2.4M', sketchfab:'https://sketchfab.com/models/2cca7a1d52224f919b0d0f15fab55b68/embed?autostart=1&ui_theme=dark', sketchfab_url:'https://sketchfab.com/models/2cca7a1d52224f919b0d0f15fab55b68' },
  { name:'Acantilado Punta Chica', eyebrow:'Modelo 3D · Acantilado', tags:['Fotogrametría','UAV','Acantilado'], tecnica:'Fotogrametría UAV', resolucion:'3 cm/píxel', año:'2023', vertices:'3.8M', sketchfab:'https://sketchfab.com/models/f27db40d8b8340b3893fdbad67c5d2b0/embed?autostart=1&ui_theme=dark', sketchfab_url:'https://sketchfab.com/models/f27db40d8b8340b3893fdbad67c5d2b0' },
  { name:'Playa Olas Altas', eyebrow:'Modelo 3D · Playa', tags:['Escáner 3D','Erosión'], tecnica:'Escáner terrestre', resolucion:'2 cm/píxel', año:'2024', vertices:'5.1M', sketchfab:'https://sketchfab.com/models/2ac2f24b5fe14d709fa8a2e712d30e51/embed?autostart=1&ui_theme=dark', sketchfab_url:'https://sketchfab.com/models/2ac2f24b5fe14d709fa8a2e712d30e51' },
  { name:'Bahía de Manzanillo', eyebrow:'Modelo 3D · Topografía', tags:['MDE','Batimetría'], tecnica:'Fotogrametría + Batimetría', resolucion:'15 cm/píxel', año:'2023', vertices:'8.2M', sketchfab:'https://sketchfab.com/models/d8c89a4db1464c4ebb3d0b461e2a6c0f/embed?autostart=1&ui_theme=dark', sketchfab_url:'https://sketchfab.com/models/d8c89a4db1464c4ebb3d0b461e2a6c0f' },
  { name:'Punta San Pedrito', eyebrow:'Modelo 3D · Formación rocosa', tags:['Fotogrametría','RTK'], tecnica:'Fotogrametría UAV', resolucion:'4 cm/píxel', año:'2024', vertices:'3.1M', sketchfab:'https://sketchfab.com/models/7e9c4b0ba2fc4d6a99e6e12a6a421f4c/embed?autostart=1&ui_theme=dark', sketchfab_url:'https://sketchfab.com/models/7e9c4b0ba2fc4d6a99e6e12a6a421f4c' },
  { name:'Playa Miramar', eyebrow:'Modelo 3D · Playa · Alta Vulnerabilidad', tags:['Fotogrametría','Alta vulnerabilidad'], tecnica:'Fotogrametría UAV', resolucion:'5 cm/píxel', año:'2024', vertices:'1.9M', sketchfab:'https://sketchfab.com/models/a5e59ecff7d14fc0a99c2a0db2d9a7d5/embed?autostart=1&ui_theme=dark', sketchfab_url:'https://sketchfab.com/models/a5e59ecff7d14fc0a99c2a0db2d9a7d5' }
];
var currentModeloIdx = 0;
function openModelo(idx) {
  currentModeloIdx = idx;
  var m = modelosData[idx];
  document.getElementById('modal-title').textContent = m.name;
  document.getElementById('modal-eyebrow').textContent = m.eyebrow;
  document.getElementById('modal-tecnica').textContent = m.tecnica;
  document.getElementById('modal-resolucion').textContent = m.resolucion;
  document.getElementById('modal-año').textContent = m.año;
  document.getElementById('modal-vertices').textContent = m.vertices;
  document.getElementById('modal-tags-wrap').innerHTML = m.tags.map(function(t){ return '<span class="tag" style="font-size:10px;padding:3px 10px;">'+t+'</span>'; }).join('');
  var iframe = document.getElementById('modal-iframe');
  var fallback = document.getElementById('modal-fallback');
  iframe.src = m.sketchfab;
  iframe.style.display='block'; fallback.style.display='none';
  var modal = document.getElementById('modelo-modal');
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  document.onkeydown = function(e){ if(e.key==='Escape') closeModeloModal(); };
}
function closeModeloModal() {
  document.getElementById('modelo-modal').classList.remove('open');
  document.body.style.overflow='';
  document.getElementById('modal-iframe').src='';
  document.onkeydown=null;
}
function openSketchfab() { window.open(modelosData[currentModeloIdx].sketchfab_url,'_blank'); }

// ══════════════════════════════════════════
// LEAFLET / VISOR
// ══════════════════════════════════════════
var visorMap=null, baseLayers={}, activeBasemap='satellite';
var vulnLayer=null, costaLayer=null, perfilesLayer=null;
var activeToolMode=null, measurePoints=[], measureLine=null, measureMarkers=[];
var playasData=[
  {name:"Playa Olas Altas",lat:19.0551,lng:-104.3133,tipo:"Playa arenosa",longitud:"1.25 km",pendiente:"2.3°",vuln:"Alta",vulnClass:"lpop-alta"},
  {name:"Playa La Audiencia",lat:19.0721,lng:-104.3389,tipo:"Playa arenosa",longitud:"0.85 km",pendiente:"1.8°",vuln:"Media",vulnClass:"lpop-media"},
  {name:"Playa Miramar",lat:19.0482,lng:-104.3267,tipo:"Playa arenosa",longitud:"3.2 km",pendiente:"3.1°",vuln:"Alta",vulnClass:"lpop-alta"},
  {name:"Playa Santiago",lat:19.0621,lng:-104.3512,tipo:"Playa mixta",longitud:"1.6 km",pendiente:"2.7°",vuln:"Media",vulnClass:"lpop-media"},
  {name:"Playa Las Brisas",lat:19.0671,lng:-104.3298,tipo:"Playa arenosa",longitud:"0.65 km",pendiente:"1.5°",vuln:"Baja",vulnClass:"lpop-baja"},
  {name:"Punta Chica",lat:19.0812,lng:-104.3445,tipo:"Acantilado",longitud:"0.4 km",pendiente:"35°",vuln:"Alta",vulnClass:"lpop-alta"},
  {name:"Bahía de Manzanillo",lat:19.0598,lng:-104.3201,tipo:"Bahía",longitud:"8.5 km",pendiente:"1.1°",vuln:"Baja",vulnClass:"lpop-baja"},
];
function loadLeafletAndInit() {
  if(window.L){ initVisorMap(); return; }
  var css=document.createElement('link'); css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(css);
  var js=document.createElement('script'); js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  js.onload=function(){ initVisorMap(); };
  js.onerror=function(){
    var js2=document.createElement('script'); js2.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    js2.onload=function(){ initVisorMap(); }; document.head.appendChild(js2);
  };
  document.head.appendChild(js);
}
function initVisorMap() {
  if(visorMap) return;
  if(!window.L){ setTimeout(initVisorMap,200); return; }
  visorMap=L.map('visor-map-leaflet',{center:[19.062,-104.335],zoom:13,zoomControl:true});
  baseLayers.satellite=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Esri',maxZoom:19});
  baseLayers.osm=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'Carto',maxZoom:19});
  baseLayers.satellite.addTo(visorMap);
  playasData.forEach(function(p){
    var vc={Alta:'#ef4444',Media:'#f97316',Baja:'#22c55e'};
    var c=vc[p.vuln]||'#fff';
    var icon=L.divIcon({className:'',html:'<div style="width:13px;height:13px;border-radius:50%;background:'+c+';border:2px solid rgba(255,255,255,.85);box-shadow:0 0 10px '+c+';"></div>',iconSize:[13,13],iconAnchor:[6,6]});
    var pop='<div class="lpop-title">'+p.name+'</div><div class="lpop-row"><span class="lpop-label">Tipo:</span><span class="lpop-val">'+p.tipo+'</span></div><div class="lpop-row"><span class="lpop-label">Longitud:</span><span class="lpop-val">'+p.longitud+'</span></div><div class="lpop-row"><span class="lpop-label">Pendiente:</span><span class="lpop-val">'+p.pendiente+'</span></div><div class="lpop-row"><span class="lpop-label">Vulnerabilidad:</span><span class="lpop-val '+p.vulnClass+'">'+p.vuln+'</span></div><span class="lpop-link">Ver ficha →</span>';
    L.marker([p.lat,p.lng],{icon:icon}).bindPopup(pop,{maxWidth:220}).addTo(visorMap);
  });
  vulnLayer=L.layerGroup();
  [{coords:[[19.048,-104.330],[19.052,-104.318],[19.058,-104.312],[19.053,-104.308],[19.045,-104.320]],color:'#ef4444'},
   {coords:[[19.060,-104.340],[19.068,-104.330],[19.074,-104.322],[19.066,-104.315],[19.056,-104.328]],color:'#f97316'},
   {coords:[[19.072,-104.355],[19.080,-104.342],[19.086,-104.335],[19.078,-104.328],[19.068,-104.340]],color:'#eab308'},
   {coords:[[19.052,-104.350],[19.060,-104.342],[19.068,-104.338],[19.062,-104.330],[19.050,-104.340]],color:'#22c55e'}
  ].forEach(function(z){ L.polygon(z.coords,{color:z.color,fillColor:z.color,fillOpacity:.32,weight:2}).addTo(vulnLayer); });
  costaLayer=L.layerGroup();
  L.polyline([[19.042,-104.312],[19.048,-104.318],[19.053,-104.326],[19.058,-104.334],[19.063,-104.341],[19.069,-104.349],[19.075,-104.357],[19.081,-104.364]],{color:'#2dd4bf',weight:2.5,opacity:.9,dashArray:'6,4'}).addTo(costaLayer);
  perfilesLayer=L.layerGroup();
  [[[19.0551,-104.3180],[19.0521,-104.3133]],[[19.0601,-104.3260],[19.0571,-104.3210]],[[19.0651,-104.3340],[19.0621,-104.3290]]].forEach(function(p){
    L.polyline(p,{color:'#eab308',weight:2,opacity:.85}).addTo(perfilesLayer);
  });
  vulnLayer.addTo(visorMap); costaLayer.addTo(visorMap); perfilesLayer.addTo(visorMap);
  document.getElementById('lyr-vuln').addEventListener('change',function(){ this.checked?vulnLayer.addTo(visorMap):visorMap.removeLayer(vulnLayer); });
  document.getElementById('lyr-costa').addEventListener('change',function(){ this.checked?costaLayer.addTo(visorMap):visorMap.removeLayer(costaLayer); });
  document.getElementById('lyr-perfiles').addEventListener('change',function(){ this.checked?perfilesLayer.addTo(visorMap):visorMap.removeLayer(perfilesLayer); });
  visorMap.on('contextmenu',function(){ cancelMeasure(); });
}
function setBasemap(type) {
  if(!visorMap||!window.L) return;
  Object.values(baseLayers).forEach(function(l){ try{visorMap.removeLayer(l);}catch(e){} });
  baseLayers[type].addTo(visorMap); activeBasemap=type;
  if(document.getElementById('lyr-vuln').checked) vulnLayer.addTo(visorMap);
  if(document.getElementById('lyr-costa').checked) costaLayer.addTo(visorMap);
  if(document.getElementById('lyr-perfiles').checked) perfilesLayer.addTo(visorMap);
  document.getElementById('btn-sat').style.background=type==='satellite'?'rgba(45,212,191,1)':'rgba(13,21,32,0.9)';
  document.getElementById('btn-sat').style.color=type==='satellite'?'#0a0f1a':'rgba(255,255,255,0.7)';
  document.getElementById('btn-osm').style.background=type==='osm'?'rgba(45,212,191,1)':'rgba(13,21,32,0.9)';
  document.getElementById('btn-osm').style.color=type==='osm'?'#0a0f1a':'rgba(255,255,255,0.7)';
}
function visorTool(tool) {
  document.querySelectorAll('.tool-item').forEach(function(t){ t.classList.remove('active-tool'); });
  if(activeToolMode===tool){ activeToolMode=null; document.getElementById('measure-tip').style.display='none'; cancelMeasure(); if(visorMap) visorMap.off('click',measureClick); return; }
  activeToolMode=tool;
  document.getElementById('tool-'+tool).classList.add('active-tool');
  if(tool==='distancia'||tool==='area') {
    document.getElementById('measure-tip').style.display='block';
    document.getElementById('measure-txt').textContent=tool==='distancia'?'Haz clic para medir distancia (2 puntos)':'Haz clic para medir área (3+ puntos)';
    measurePoints=[]; if(visorMap) visorMap.on('click',measureClick);
  } else if(tool==='info') {
    document.getElementById('measure-tip').style.display='block';
    document.getElementById('measure-txt').textContent='Haz clic en cualquier punto del mapa';
    if(visorMap) visorMap.on('click',infoClick);
  }
}
function measureClick(e) {
  if(!visorMap||!window.L) return;
  measurePoints.push(e.latlng);
  var m=L.circleMarker(e.latlng,{radius:5,color:'#2dd4bf',fillColor:'#2dd4bf',fillOpacity:1}).addTo(visorMap);
  measureMarkers.push(m);
  if(activeToolMode==='distancia'&&measurePoints.length===2) {
    var d=visorMap.distance(measurePoints[0],measurePoints[1]);
    if(measureLine) visorMap.removeLayer(measureLine);
    measureLine=L.polyline(measurePoints,{color:'#2dd4bf',weight:2,dashArray:'5,5'}).addTo(visorMap);
    document.getElementById('measure-txt').textContent='📏 '+(d<1000?Math.round(d)+' m':(d/1000).toFixed(2)+' km');
    visorMap.off('click',measureClick); activeToolMode=null;
    document.getElementById('tool-distancia').classList.remove('active-tool');
  } else if(activeToolMode==='area'&&measurePoints.length>=3) {
    if(measureLine) visorMap.removeLayer(measureLine);
    measureLine=L.polygon(measurePoints,{color:'#2dd4bf',fillColor:'#2dd4bf',fillOpacity:.15,weight:2}).addTo(visorMap);
    var area=0,pts=measurePoints;
    for(var i=0;i<pts.length;i++){ var j=(i+1)%pts.length; area+=pts[i].lng*pts[j].lat-pts[j].lng*pts[i].lat; }
    var areaM2=Math.abs(area/2)*111320*111320;
    document.getElementById('measure-txt').textContent='⬛ '+(areaM2/1e6).toFixed(3)+' km² (aprox)';
  }
}
function infoClick(e) {
  if(!window.L) return;
  L.popup().setLatLng(e.latlng).setContent('<div class="lpop-title">Información del punto</div><div class="lpop-row"><span class="lpop-label">Lat:</span><span class="lpop-val">'+e.latlng.lat.toFixed(5)+'° N</span></div><div class="lpop-row"><span class="lpop-label">Lng:</span><span class="lpop-val">'+e.latlng.lng.toFixed(5)+'° O</span></div>').openOn(visorMap);
  visorMap.off('click',infoClick); document.getElementById('measure-tip').style.display='none';
  document.getElementById('tool-info').classList.remove('active-tool'); activeToolMode=null;
}
function cancelMeasure() {
  measurePoints=[]; measureMarkers.forEach(function(m){ if(visorMap) try{visorMap.removeLayer(m);}catch(e){} });
  measureMarkers=[]; if(measureLine&&visorMap) try{visorMap.removeLayer(measureLine);}catch(e){} measureLine=null;
}
function toggleVisorPanel() {
  var p=document.querySelector('#page-visor .visor-panel');
  if(p) p.style.display=p.style.display==='none'?'':'none';
}

// ══════════════════════════════════════════
// PARTICLES
// ══════════════════════════════════════════
function initPX() {
  var c=document.getElementById('px-canvas'); if(!c) return;
  var ctx=c.getContext('2d');
  function resize(){ c.width=c.offsetWidth; c.height=c.offsetHeight; } resize();
  window.addEventListener('resize',resize);
  var pts=Array.from({length:60},function(){ return {x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+.5,vx:(Math.random()-.5)*.35,vy:-(Math.random()*.45+.1),a:Math.random()*.45+.1}; });
  (function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(function(p){
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(45,212,191,'+p.a+')'; ctx.fill();
      pts.forEach(function(q){ var dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy); if(d<110){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.strokeStyle='rgba(45,212,191,'+(0.07*(1-d/110))+')'; ctx.lineWidth=.8; ctx.stroke(); } });
      p.x+=p.vx; p.y+=p.vy;
      if(p.y<-5){ p.y=c.height+5; p.x=Math.random()*c.width; }
      if(p.x<-5) p.x=c.width+5; if(p.x>c.width+5) p.x=-5;
    });
    requestAnimationFrame(draw);
  })();
}

// ══════════════════════════════════════════
// WAVES
// ══════════════════════════════════════════
function initWaves() {
  var t=0;
  (function tick(){
    t+=.012;
    var s=Math.sin,c=Math.cos;
    var w1=document.getElementById('wv1'),w2=document.getElementById('wv2'),w3=document.getElementById('wv3');
    if(w1) w1.setAttribute('d','M0,'+(42+s(t)*14)+' C240,'+(72+c(t+.8)*10)+' 480,'+(18+s(t+1.2)*12)+' 720,'+(45+c(t)*10)+' C960,'+(68+s(t+2)*9)+' 1200,'+(22+c(t+.5)*11)+' 1440,'+(42+s(t+1.8)*10)+' L1440,90 L0,90Z');
    if(w2) w2.setAttribute('d','M0,'+(55+c(t+.5)*10)+' C200,'+(20+s(t+1)*12)+' 500,'+(72+c(t+1.5)*8)+' 800,'+(52+s(t+.5)*10)+' C1050,'+(32+c(t+1)*10)+' 1280,'+(65+s(t+2.2)*8)+' 1440,'+(55+c(t+1)*9)+' L1440,90 L0,90Z');
    if(w3) w3.setAttribute('d','M0,72 Q360,'+(62+s(t*.8)*7)+' 720,'+(74+c(t*.7)*5)+' Q1080,'+(66+s(t*.9)*7)+' 1440,72 L1440,90 L0,90Z');
    requestAnimationFrame(tick);
  })();
}

// ══════════════════════════════════════════
// HERO ENTRANCE
// ══════════════════════════════════════════
function animHero() {
  var seq=[{id:'h-badge',d:80},{id:'h-sm',d:200},{id:'h-lg',d:340},{id:'h-desc',d:500},{id:'h-btns',d:650},{id:'h-scroll',d:900},{id:'fc-1',d:750},{id:'fc-2',d:900},{id:'fc-3',d:620}];
  seq.forEach(function(e){ setTimeout(function(){ var el=document.getElementById(e.id); if(el) el.classList.add('vis'); },e.d); });
  setTimeout(function(){
    document.querySelectorAll('.fcard').forEach(function(c,i){ setTimeout(function(){ c.style.opacity='1'; c.style.transform='none'; },i*70); });
  },300);
}

// ══════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════
function initSR() {
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('vis');
      e.target.querySelectorAll('.sr-child').forEach(function(c){ c.classList.add('vis'); });
      if(e.target.id==='stats-bar') runCounters();
    });
  },{threshold:.14});
  document.querySelectorAll('.sr, #stats-bar').forEach(function(el){ io.observe(el); });
}

// ══════════════════════════════════════════
// COUNTERS
// ══════════════════════════════════════════
var countersRan=false;
function runCounters() {
  if(countersRan) return; countersRan=true;
  document.querySelectorAll('.stat-num[data-target]').forEach(function(el){
    var target=+el.dataset.target, suffix=el.dataset.suffix||'';
    var cur=0, step=Math.ceil(target/45);
    var t=setInterval(function(){ cur=Math.min(cur+step,target); el.textContent=cur+suffix; if(cur>=target) clearInterval(t); },35);
  });
}

// ══════════════════════════════════════════
// PARALLAX
// ══════════════════════════════════════════
document.addEventListener('mousemove',function(e){
  var hero=document.getElementById('hero-section'); if(!hero) return;
  var rect=hero.getBoundingClientRect(); if(e.clientY>rect.bottom) return;
  var px=(e.clientX/window.innerWidth-.5)*18, py=(e.clientY/window.innerHeight-.5)*10;
  var fc1=document.getElementById('fc-1'),fc2=document.getElementById('fc-2'),fc3=document.getElementById('fc-3');
  if(fc1) fc1.style.transform='translate('+(-px*.6)+'px,'+(-py*.4)+'px)';
  if(fc2) fc2.style.transform='translate('+(-px*.4)+'px,'+(-py*.6)+'px)';
  if(fc3) fc3.style.transform='translate('+(-px*.8)+'px,'+(-py*.3)+'px)';
  var land=document.querySelector('.hero-landscape');
  if(land) land.style.transform='scale(1.04) translate('+(px*.15)+'px,'+(py*.1)+'px)';
});

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
window.addEventListener('load',function(){
  document.querySelectorAll('.fcard').forEach(function(c){
    c.style.opacity='0'; c.style.transform='translateY(20px)';
    c.style.transition='opacity .5s ease, transform .5s ease, background .2s';
  });
  initPX(); initWaves(); animHero(); setTimeout(initSR,200);
});
