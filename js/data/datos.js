/* Repositorio científico. Para enlazar el archivo real: copia el archivo a assets/docs/ y escribe la ruta en "archivo".
   Si "archivo" está vacío, el botón descarga una ficha de metadatos (CSV). */
window.DATOS = [
  { nombre: 'Mapa geológico',               desc: 'Mapa geológico del litoral de Manzanillo',         año: 2024, formato: 'PDF',  tamaño: '6.4 MB', tipo: 'Mapas',          sitio: 'General',       categoria: 'Cartografía',        archivo: '' },
  { nombre: 'Perfiles de playa',            desc: 'Perfiles topográficos de playas seleccionadas',    año: 2024, formato: 'SHP',  tamaño: '5.2 MB', tipo: 'Perfiles',       sitio: 'Olas Altas',    categoria: 'Datos SIG',          archivo: '' },
  { nombre: 'Ortomosaico 2024',             desc: 'Ortomosaico puntual de resolución 5 cm',           año: 2024, formato: 'TIFF', tamaño: '1.2 GB', tipo: 'Ortomosaicos',   sitio: 'La Audiencia',  categoria: 'Imágenes',           archivo: '' },
  { nombre: 'Análisis de vulnerabilidad',   desc: 'Índice de vulnerabilidad costera',                 año: 2024, formato: 'PDF',  tamaño: '3.1 MB', tipo: 'Informes',       sitio: 'Miramar',       categoria: 'Análisis',           archivo: '' },
  { nombre: 'Base de datos sedimentológica', desc: 'Base de datos de muestras de sedimentos',         año: 2023, formato: 'XLSX', tamaño: '2.7 MB', tipo: 'Tablas',         sitio: 'General',       categoria: 'Bases de datos',     archivo: '' },
  { nombre: 'Artículo: Dinámica costera',   desc: 'Evolución multitemporal del litoral',              año: 2023, formato: 'PDF',  tamaño: '2.3 MB', tipo: 'Artículos',      sitio: 'General',       categoria: 'Publicaciones',      archivo: '' },
  { nombre: 'Modelo digital de elevación',  desc: 'MDE del litoral de Manzanillo',                    año: 2023, formato: 'TIFF', tamaño: '996 MB', tipo: 'Datos SIG',      sitio: 'General',       categoria: 'Modelos digitales',  archivo: '' }
];
