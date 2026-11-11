/* Galería multimedia. cat = categorías separadas por espacio (fotografias, videos, drones, campo, laboratorio).
   Fotografías de campo reales proporcionadas por el equipo (carpeta "Galería de fotos" del Drive).
   Para videos reales: copia el archivo a assets/video/ y escribe la ruta en "video". */
window.MULTIMEDIA = [
  { src: 'assets/img/campo/01-panoramica-bahia.jpg',        titulo: 'Panorámica de la bahía desde el mirador',        cat: 'fotografias',          video: '' },
  { src: 'assets/img/campo/02-gnss-mirador.jpg',            titulo: 'Levantamiento GNSS en el mirador',               cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/03-gnss-playa.jpg',              titulo: 'Medición con antena GNSS en la playa',           cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/04-gnss-laguna.jpg',             titulo: 'Levantamiento GNSS junto a la laguna costera',   cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/05-medicion-playa.jpg',          titulo: 'Trabajo de campo en la línea de playa',          cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/06-topografia-estacion.jpg',     titulo: 'Nivelación topográfica con trípode',             cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/07-equipo-rescate.jpg',          titulo: 'Equipo de trabajo con personal de rescate',      cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/08-muestreo-lodo.jpg',           titulo: 'Muestreo en zona de lodo costero',               cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/09-escalera-campo.jpg',          titulo: 'Acceso a puntos de medición en campo',           cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/10-control-dron.jpg',            titulo: 'Control del dron en la playa',                   cat: 'drones campo fotografias', video: '' },
  { src: 'assets/img/campo/11-recorrido-playa.jpg',         titulo: 'Recorrido del equipo por la playa',              cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/12-medicion-gnss.jpg',           titulo: 'Colocación de antena GNSS en la arena',          cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/13-vehiculo-gnss.jpg',           titulo: 'Traslado de equipo GNSS en vehículo de campo',   cat: 'campo fotografias',    video: '' },
  { src: 'assets/img/campo/14-operador-dron.jpg',           titulo: 'Operación de dron en el litoral',                cat: 'drones campo fotografias', video: '' },
  { src: 'assets/img/campo/15-dron-playa.jpg',              titulo: 'Vuelo de dron frente a la playa',                cat: 'drones campo fotografias', video: '' }
];
window.MULTIMEDIA_CATS = [['todas', 'Todas'], ['fotografias', 'Fotografías'], ['videos', 'Vídeos'], ['drones', 'Drones'], ['campo', 'Trabajo de campo'], ['laboratorio', 'Laboratorio']];
