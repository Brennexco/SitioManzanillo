/* Playas y variables de vulnerabilidad.
   Todos los valores de vulnerabilidad son DEMOSTRATIVOS: sustitúyelos por los resultados del proyecto. */
window.PLAYAS = [   // ficha del visor
  { nombre: 'Playa Olas Altas',     lat: 19.0551, lng: -104.3133, tipo: 'Playa arenosa', longitud: '1.25 km', pendiente: '2.3°', vuln: 'Alta',  fx: .43, fy: .57 },
  { nombre: 'Playa La Audiencia',   lat: 19.1137, lng: -104.3972, tipo: 'Playa arenosa', longitud: '0.85 km', pendiente: '1.8°', vuln: 'Media' },
  { nombre: 'Playa Miramar',        lat: 19.1006, lng: -104.3620, tipo: 'Playa arenosa', longitud: '3.2 km',  pendiente: '3.1°', vuln: 'Alta',  fx: .55, fy: .73 },
  { nombre: 'Playa Santiago',       lat: 19.1043, lng: -104.3556, tipo: 'Playa mixta',   longitud: '1.6 km',  pendiente: '2.7°', vuln: 'Media', fx: .27, fy: .18 },
  { nombre: 'Playa Las Brisas',     lat: 19.0905, lng: -104.3118, tipo: 'Playa arenosa', longitud: '0.65 km', pendiente: '1.5°', vuln: 'Baja',  fx: .34, fy: .36 },
  { nombre: 'Punta Chica',          lat: 19.1105, lng: -104.3745, tipo: 'Acantilado',    longitud: '0.4 km',  pendiente: '35°',  vuln: 'Alta' },
  { nombre: 'Bahía de Manzanillo',  lat: 19.0700, lng: -104.3050, tipo: 'Bahía',         longitud: '8.5 km',  pendiente: '1.1°', vuln: 'Baja',  fx: .33, fy: .52 }
];
window.VULN_VARS = ['Erosión costera', 'Pendiente del terreno', 'Tipo de roca / sedimento', 'Oleaje y exposición', 'Huracanes históricos', 'Uso de suelo'];
window.VULN_LEVELS = [[.2, 'Muy baja', '#2f9e2f'], [.4, 'Baja', '#8ccf1f'], [.6, 'Media', '#f2c500'], [.8, 'Alta', '#f28a00'], [2, 'Muy alta', '#e02424']];
window.VULN_BEACHES = [  // sub = valores normalizados 0–1 por variable (mismo orden que VULN_VARS)
  { nombre: 'Playa Santiago',   fx: .145, fy: .165, conf: 78, sub: [.15, .30, .20, .18, .25, .18] },
  { nombre: 'Playa Miramar',    fx: .335, fy: .35,  conf: 85, sub: [.85, .55, .70, .80, .75, .67] },
  { nombre: 'Playa Las Brisas', fx: .43,  fy: .53,  conf: 82, sub: [.95, .80, .85, .90, .90, .88] },
  { nombre: 'Playa Olas Altas', fx: .405, fy: .70,  conf: 80, sub: [.60, .45, .50, .62, .55, .52] },
  { nombre: 'Playa Azul',       fx: .70,  fy: .86,  conf: 74, sub: [.50, .35, .40, .55, .52, .50] }
];
