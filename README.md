# Atlas Digital del Litoral de Manzanillo
Proyecto PAPIIT IF100926 · Facultad de Ingeniería, UNAM. Sitio estático (HTML + CSS + JS), sin instalación ni build.

## Estructura
```
index.html · proyecto.html · visor.html · modelos-3d.html · linea-del-tiempo.html
vulnerabilidad.html · datos-resultados.html · participantes.html · multimedia.html
css/    tokens, base, layout, components  +  css/pages/<pagina>.css
js/     components/ (layout, ui, mapview) · data/ (TODOS los datos editables) · pages/<pagina>.js · main.js
assets/ img/ · video/ · docs/ · modelos/ · icons/
```
Cada página tiene su propio HTML, CSS y JS. El encabezado y pie se inyectan desde `js/components/layout.js`.

## Cómo verlo en tu computadora
- Con VS Code: extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.
- O con Python: `python -m http.server 8000` dentro de la carpeta y abrir http://localhost:8000
- Doble clic en `index.html` también funciona, pero el navegador bloquea (por seguridad) las descargas PNG de mapas/comparación y la textura del modelo 3D desde archivos locales.

## Publicar en GitHub Pages
1. Crea un repositorio y sube **el contenido** de esta carpeta (que `index.html` quede en la raíz).
2. Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. Tu sitio queda en `https://<usuario>.github.io/<repositorio>/`.

## Qué editar (todo en `js/data/`)
| Archivo | Contenido |
|---|---|
| `site.js` | Nombre, **correo de contacto**, menú |
| `playas.js` | Fichas de playas del visor y **puntajes de vulnerabilidad** (demostrativos) |
| `capas.js` | Geometrías de las capas del visor (ilustrativas) |
| `timeline.js` | Años, imágenes por año (`real:true` al usar ortofotos reales), cifras de erosión/acumulación |
| `modelos.js` | Modelos 3D: escribe el ID de **Sketchfab** en `sketchfab` |
| `datos.js` | Repositorio: pon el archivo en `assets/docs/` y su ruta en `archivo` |
| `participantes.js` | Equipo (correo, enlace, biografía, fotos en `assets/img/equipo/`) |
| `multimedia.js` | Galería; videos en `assets/video/` y ruta en `video` |

**Video del inicio:** coloca `assets/video/drone-manzanillo.mp4` (si no existe se muestra la imagen con efecto).

## Pendiente de datos reales
Puntajes y confianza de vulnerabilidad, cifras y ortofotos de la línea del tiempo, geometrías de capas y coordenadas del visor, IDs de Sketchfab, archivos descargables, correo, y datos de técnicos/estudiantes/colaboradores ("Por confirmar").

## Dependencias externas (requieren internet)
Google Fonts, three.js r128 (visor 3D), Leaflet + Esri World Imagery (modo "Satélite real").
