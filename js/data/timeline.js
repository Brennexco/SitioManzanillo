/* Datos de la Línea del Tiempo.
   IMAGES: una imagen por año. Mientras no existan las ortofotos reales de cada año, se usan imágenes de referencia
   (real:false). Para publicar una imagen real: copia el archivo a assets/img/timeline/ y cambia src y real:true.
   STATS: valores ACUMULADOS desde 2008 (demostrativos) — el sitio calcula la diferencia entre dos años. */
window.TIMELINE = {
  years: ['2008', '2012', '2015', '2020', '2024', 'Actualidad'],
  images: {
    '2008':       { src: 'assets/img/timeline/litoral-a.jpg', key: 'a', real: false },
    '2012':       { src: 'assets/img/timeline/litoral-a.jpg', key: 'a', real: false },
    '2015':       { src: 'assets/img/timeline/litoral-b.jpg', key: 'b', real: false },
    '2020':       { src: 'assets/img/timeline/litoral-b.jpg', key: 'b', real: false },
    '2024':       { src: 'assets/img/timeline/litoral-b.jpg', key: 'b', real: false },
    'Actualidad': { src: 'assets/img/timeline/litoral-b.jpg', key: 'b', real: false }
  },
  uso: { a: 'assets/img/timeline/uso-a.png', b: 'assets/img/timeline/uso-b.png' },
  infra: { a: 'assets/img/timeline/infra-a.png', b: 'assets/img/timeline/infra-b.png' },
  stats: {   // [área erosionada (ha), área acumulada (ha), retroceso máximo (m)]
    '2008': [0, 0, 0], '2012': [4.1, 1.8, 6.3], '2015': [9.6, 4.1, 12.0],
    '2020': [19.5, 10.7, 27.9], '2024': [25.0, 13.0, 33.0], 'Actualidad': [27.4, 14.2, 35.6]
  },
  /* Línea de costa extraída automáticamente de cada imagen de referencia (trazos SVG) */
  coast: {"a": {"w": 600, "h": 551, "paths": ["M314,4 L324,7 L325,14 L300,36 L269,47 L261,66 L260,75 L265,110 L275,110 L280,115 L291,119 L296,123 L297,129 L293,136 L276,139 L271,135 L272,127 L270,124 L263,120 L259,123 L261,132 L254,139 L256,152 L246,168 L238,196 L240,217 L244,222 L243,234 L248,245 L256,248 L261,258 L268,264 L269,276 L279,282 L286,292 L307,302 L315,301 L338,311 L340,323 L333,334 L334,338 L343,343 L357,346 L366,355 L373,371 L385,374 L394,379 L400,386 L415,392 L446,397 L448,408 L452,411 L471,402 L480,402 L487,406 L495,405 L507,410 L517,409 L523,425 L536,429 L539,439 L547,441 L550,455 L563,459 L581,472 L585,471 L588,464 L595,463", "M496,4 L504,16 L503,23 L477,26 L462,19 L456,14 L452,4", "M385,4 L374,8 L360,8 L355,4"]}, "b": {"w": 600, "h": 525, "paths": ["M107,190 L103,193 L104,201 L98,207 L96,214 L88,218 L86,230 L75,237 L75,249 L64,258 L64,267 L61,271 L50,273 L36,264 L14,265 L4,260", "M595,378 L583,373 L579,365 L567,363 L564,355 L556,354 L548,342 L539,335 L538,328 L529,314 L519,310 L511,303 L499,303 L490,312 L480,316 L456,306 L445,306 L413,299 L392,304 L393,313 L388,317 L384,315 L382,309 L376,307 L355,308 L352,312 L349,333 L319,347 L319,354 L326,360 L319,375 L321,379 L332,383 L334,386 L332,394 L335,401 L333,404 L328,405 L327,409 L338,414 L339,418 L336,422 L326,422 L321,415 L304,411 L293,418 L289,417 L286,411 L283,410 L273,416 L258,405 L258,390 L260,387 L267,385 L268,379 L264,373 L261,372 L253,376 L248,372 L249,355 L257,344 L256,337 L251,334 L247,336 L243,343 L239,373 L232,374 L226,364 L223,363 L219,366 L219,380 L229,384 L229,391 L217,399 L212,406 L199,408 L197,411 L198,418 L195,422 L179,420 L175,415 L174,408 L191,394 L193,390 L192,375 L187,366 L177,365 L174,359 L170,358 L161,363 L157,362 L148,353 L147,346 L154,332 L154,325 L150,316 L160,310 L163,296 L172,291 L182,293 L186,290 L185,280 L172,277 L170,274 L176,260 L185,251 L186,247 L182,241 L175,241 L162,253 L158,265 L154,267 L139,268 L133,264 L124,264 L106,257 L103,251 L107,245 L116,237 L128,234 L131,230 L130,225 L118,221 L111,200 L111,193 L108,191"]}}
};
