/* Repositorio científico. Para enlazar el archivo real: copia el archivo a assets/docs/ y escribe la ruta en "archivo".
   Si "archivo" está vacío, el botón descarga una ficha de metadatos (CSV). */
window.DATOS = [
  { nombre: 'Mapa geológico', desc: 'Mapa geológico de la Bahía de Santiago, Manzanillo', año: 2026, formato: 'PDF', tamaño: '2.2 MB', tipo: 'Mapas', sitio: 'Bahía de Santiago', categoria: 'Cartografía', archivo: 'assets/docs/mapas/mapa-geologico.pdf' },
  { nombre: 'Mapa de batimetría', desc: 'Batimetría de la Bahía de Santiago (plataforma, talud y zona abisal)', año: 2026, formato: 'PDF', tamaño: '1.4 MB', tipo: 'Mapas', sitio: 'Bahía de Santiago', categoria: 'Cartografía', archivo: 'assets/docs/mapas/mapa-batimetria.pdf' },
  { nombre: 'Crecimiento urbano 2003–2018', desc: 'Expansión de la mancha urbana en la Bahía de Manzanillo', año: 2026, formato: 'PDF', tamaño: '2.0 MB', tipo: 'Mapas', sitio: 'Bahía de Santiago', categoria: 'Cartografía', archivo: 'assets/docs/mapas/mapa-crecimiento-urbano.pdf' },
  { nombre: 'Cambio de uso de suelo y vegetación', desc: 'Cambio de uso de suelo y vegetación 2003–2018 (INEGI Serie III y VII)', año: 2026, formato: 'PDF', tamaño: '2.0 MB', tipo: 'Mapas', sitio: 'Bahía de Santiago', categoria: 'Cartografía', archivo: 'assets/docs/mapas/mapa-uso-y-cambio-de-suelo.pdf' },
  { nombre: 'Puntos de muestreo en campo', desc: 'Área de estudio y puntos de muestreo, Bahía de Santiago', año: 2026, formato: 'PDF', tamaño: '1.1 MB', tipo: 'Mapas', sitio: 'Bahía de Santiago', categoria: 'Cartografía', archivo: 'assets/docs/mapas/mapa-puntos-de-muestreo.pdf' },
  { nombre: 'Perfiles de playa',            desc: 'Perfiles topográficos de playas seleccionadas',    año: 2024, formato: 'SHP',  tamaño: '5.2 MB', tipo: 'Perfiles',       sitio: 'Olas Altas',    categoria: 'Datos SIG',          archivo: '' },
  { nombre: 'Ortomosaico 2024',             desc: 'Ortomosaico puntual de resolución 5 cm',           año: 2024, formato: 'TIFF', tamaño: '1.2 GB', tipo: 'Ortomosaicos',   sitio: 'La Audiencia',  categoria: 'Imágenes',           archivo: '' },
  { nombre: 'Análisis de vulnerabilidad',   desc: 'Índice de vulnerabilidad costera',                 año: 2024, formato: 'PDF',  tamaño: '3.1 MB', tipo: 'Informes',       sitio: 'Miramar',       categoria: 'Análisis',           archivo: '' },
  { nombre: 'Base de datos sedimentológica', desc: 'Base de datos de muestras de sedimentos',         año: 2023, formato: 'XLSX', tamaño: '2.7 MB', tipo: 'Tablas',         sitio: 'General',       categoria: 'Bases de datos',     archivo: '' },
  { nombre: 'Artículo: Dinámica costera',   desc: 'Evolución multitemporal del litoral',              año: 2023, formato: 'PDF',  tamaño: '2.3 MB', tipo: 'Artículos',      sitio: 'General',       categoria: 'Publicaciones',      archivo: '' },
  { nombre: 'Modelo digital de elevación',  desc: 'MDE del litoral de Manzanillo',                    año: 2023, formato: 'TIFF', tamaño: '996 MB', tipo: 'Datos SIG',      sitio: 'General',       categoria: 'Modelos digitales',  archivo: '' }
];

/* Mapas temáticos (vista previa en la página). Provienen de la carpeta «Mapas temáticos» del Drive. */
window.MAPAS_TEMATICOS = [
  { titulo: 'Mapa geológico', img: 'assets/img/mapas-tematicos/geologico.jpg', pdf: 'assets/docs/mapas/mapa-geologico.pdf' },
  { titulo: 'Mapa de batimetría', img: 'assets/img/mapas-tematicos/batimetria.jpg', pdf: 'assets/docs/mapas/mapa-batimetria.pdf' },
  { titulo: 'Crecimiento urbano 2003–2018', img: 'assets/img/mapas-tematicos/crecimiento-urbano.jpg', pdf: 'assets/docs/mapas/mapa-crecimiento-urbano.pdf' },
  { titulo: 'Cambio de uso de suelo y vegetación', img: 'assets/img/mapas-tematicos/uso-y-cambio-de-suelo.jpg', pdf: 'assets/docs/mapas/mapa-uso-y-cambio-de-suelo.pdf' },
  { titulo: 'Puntos de muestreo en campo', img: 'assets/img/mapas-tematicos/puntos-de-muestreo.jpg', pdf: 'assets/docs/mapas/mapa-puntos-de-muestreo.pdf' }
];
