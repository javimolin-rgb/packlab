# Packlab Studio — v3

Aplicación estática original para diseño conceptual de packaging. No está afiliada a Pacdora.

## Funciones
- Interfaz responsive en español.
- Vista 3D interactiva con Three.js (órbita, zoom y modelos conceptuales de caja, botella, bolsa y vaso).
- Editor de texto, color, acabado y dimensiones.
- Carga de imagen local para la maqueta de respaldo.
- Guardado y recuperación de proyectos en `localStorage`.
- Exportación PNG de la vista 3D (si Three.js carga) o vista conceptual de respaldo.
- Generador de troquel 2D conceptual con líneas de corte, pliegue y medidas.
- Exportación SVG editable del troquel.
- Fallback CSS si WebGL o el CDN no está disponible.

## Publicar en GitHub Pages
Sube `index.html`, `styles.css`, `app.js` y `README.md` a la raíz de tu repositorio. Luego ve a **Settings → Pages**, selecciona **Deploy from a branch**, `main` y `/ (root)`.

## Limitaciones importantes
La escena 3D y el troquel son prototipos conceptuales, no archivos certificados para producción. La plantilla SVG es una base genérica de caja; aunque muestra las dimensiones introducidas, no calcula automáticamente todos los parámetros de ingeniería, gramaje, tolerancias, pestañas de cierre, sangrado o compensación por material. Solicita validación a tu proveedor antes de fabricar. La vista 3D necesita conexión a internet para descargar Three.js desde jsDelivr.
