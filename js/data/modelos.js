/* Modelos 3D. Para usar Sketchfab escribe el ID del modelo en "sketchfab" (la parte final de la URL del modelo).
   Si sketchfab está vacío, el sitio muestra un visor 3D integrado con un terreno de demostración. */
window.MODELOS = [
  { id: 'playa-la-audiencia',  nombre: 'Playa La Audiencia',        cat: 'playas',        sitio: 'La Audiencia',  lugar: 'Manzanillo, Colima', tecnica: 'Fotogrametría UAV',          resolucion: '5 cm/píxel',  año: 2024, vertices: '2.4 M', tags: ['Fotogrametría', 'RTK', 'Playa'],            img: 'assets/img/modelos/playa-la-audiencia.jpg',        sketchfab: '' },
  { id: 'acantilado-punta-chica', nombre: 'Acantilado Punta Chica', cat: 'acantilados',   sitio: 'Punta Chica',   lugar: 'Manzanillo, Colima', tecnica: 'Fotogrametría UAV',          resolucion: '3 cm/píxel',  año: 2023, vertices: '3.8 M', tags: ['Fotogrametría', 'UAV', 'Acantilado'],      img: 'assets/img/modelos/acantilado-punta-chica.jpg',     sketchfab: '' },
  { id: 'playa-olas-altas',    nombre: 'Playa Olas Altas',          cat: 'playas',        sitio: 'Olas Altas',    lugar: 'Manzanillo, Colima', tecnica: 'Escáner terrestre',          resolucion: '2 cm/píxel',  año: 2024, vertices: '5.1 M', tags: ['Escáner 3D', 'Erosión'],                    img: 'assets/img/modelos/playa-olas-altas.jpg',           sketchfab: '' },
  { id: 'bahia-de-santiago',   nombre: 'Bahía de Santiago',         cat: 'fotogrametria', sitio: 'Santiago',      lugar: 'Manzanillo, Colima', tecnica: 'Fotogrametría aérea',        resolucion: '15 cm/píxel', año: 2023, vertices: '8.2 M', tags: ['Fotogrametría aérea', 'Bahía'],             img: 'assets/img/modelos/bahia-de-santiago.jpg',          sketchfab: '' },
  { id: 'punta-san-pedrito',   nombre: 'Punta San Pedrito',         cat: 'formaciones',   sitio: 'San Pedrito',   lugar: 'Manzanillo, Colima', tecnica: 'Fotogrametría UAV',          resolucion: '4 cm/píxel',  año: 2024, vertices: '3.1 M', tags: ['Fotogrametría', 'RTK', 'Formación rocosa'], img: 'assets/img/modelos/punta-san-pedrito.jpg',          sketchfab: '' },
  { id: 'modelo-topografico-miramar', nombre: 'Modelo Topográfico Miramar', cat: 'topograficos', sitio: 'Miramar', lugar: 'Manzanillo, Colima', tecnica: 'Fotogrametría + topografía', resolucion: '5 cm/píxel',  año: 2024, vertices: '1.9 M', tags: ['MDE', 'Topografía', 'Alta vulnerabilidad'], img: 'assets/img/modelos/modelo-topografico-miramar.jpg', sketchfab: '' }
];
window.MODELOS_CATS = [
  ['todas', 'Todas'], ['playas', 'Playas'], ['acantilados', 'Acantilados'], ['formaciones', 'Formaciones'],
  ['perfiles', 'Perfiles costeros'], ['fotogrametria', 'Fotogrametría aérea'], ['topograficos', 'Modelos topográficos']
];
