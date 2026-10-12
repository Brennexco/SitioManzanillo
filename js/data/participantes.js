/* Equipo del proyecto. Completa email / url con los datos reales (si están vacíos los íconos avisan que no hay dato).
   Las fichas de Técnicos, Estudiantes y Colaboradores son marcadores de posición ("Por confirmar"). */
window.PARTICIPANTES = {
  investigadores: [
    { nombre: 'Dra. Blanca Estela Pérez Hernández', rol: 'Responsable académica', inst: 'Facultad de Ingeniería, UNAM', foto: 'assets/img/equipo/blanca-estela-perez.jpg', email: '', url: '', destacado: true,
      bio: 'Coordina el proyecto PAPIIT y la integración de los productos científicos del Atlas Digital del Litoral de Manzanillo.' },
    { nombre: 'Dr. José Luis Arcega Cervantes',    rol: 'Investigador',  inst: 'Facultad de Ingeniería, UNAM', foto: 'assets/img/equipo/jose-luis-arcega.jpg', email: '', url: '',
      bio: 'Participa en el análisis geoespacial y en la evaluación de la vulnerabilidad costera del litoral de Manzanillo.' },
    { nombre: 'Dra. Karem Caballero Rodríguez',    rol: 'Investigadora', inst: 'Facultad de Ingeniería, UNAM', foto: 'assets/img/equipo/karem-caballero.jpg', email: '', url: '',
      bio: 'Participa en el análisis multitemporal y en el procesamiento de los datos del proyecto.' },
    { nombre: 'Dr. Martín Jesús Sánchez Muñoz',    rol: 'Investigador',  inst: 'Facultad de Ingeniería, UNAM', foto: 'assets/img/equipo/martin-jesus-sanchez.jpg', email: '', url: '',
      bio: 'Participa en el levantamiento de información de campo y en el modelado tridimensional del litoral.' }
  ],
  tecnicos: [
    { nombre: 'Por confirmar', rol: 'Técnico académico', inst: 'Levantamiento con dron RTK', placeholder: true, bio: 'Espacio reservado para el personal técnico del proyecto.' },
    { nombre: 'Por confirmar', rol: 'Técnico académico', inst: 'Procesamiento fotogramétrico', placeholder: true, bio: 'Espacio reservado para el personal técnico del proyecto.' },
    { nombre: 'Por confirmar', rol: 'Técnico académico', inst: 'Sistemas de Información Geográfica', placeholder: true, bio: 'Espacio reservado para el personal técnico del proyecto.' }
  ],
  estudiantes: [
    { nombre: 'Por confirmar', rol: 'Estudiante de posgrado',      inst: 'Modelado 3D', placeholder: true, bio: 'Espacio reservado para estudiantes participantes.' },
    { nombre: 'Por confirmar', rol: 'Estudiante de posgrado',      inst: 'Análisis geoespacial', placeholder: true, bio: 'Espacio reservado para estudiantes participantes.' },
    { nombre: 'Por confirmar', rol: 'Estudiante de licenciatura',  inst: 'Trabajo de campo', placeholder: true, bio: 'Espacio reservado para estudiantes participantes.' }
  ],
  instituciones: [
    { nombre: 'Facultad de Ingeniería', rol: 'UNAM', inst: 'Institución responsable', icono: 'FI' },
    { nombre: 'Instituto de Ciencias Aplicadas y Tecnología (ICAT)', rol: 'UNAM', inst: 'Institución participante', icono: 'ICAT' },
    { nombre: 'Instituto de Ciencias del Mar y Limnología', rol: 'UNAM', inst: 'Institución participante', icono: 'ICML' },
    { nombre: 'Colegio de Postgraduados, Chapingo', rol: 'Colpos', inst: 'Institución participante', icono: 'CP' },
    { nombre: 'Universidad Autónoma Metropolitana, Iztapalapa', rol: 'UAM-I', inst: 'Institución participante', icono: 'UAM' }
  ],
  colaboradores: [
    { nombre: 'Por confirmar', rol: 'Colaborador', inst: 'Colaboración externa', placeholder: true, bio: 'Espacio reservado para colaboradores externos del proyecto.' },
    { nombre: 'Por confirmar', rol: 'Colaborador', inst: 'Colaboración externa', placeholder: true, bio: 'Espacio reservado para colaboradores externos del proyecto.' }
  ]
};
