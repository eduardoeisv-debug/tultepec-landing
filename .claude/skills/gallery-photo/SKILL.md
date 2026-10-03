---
name: gallery-photo
description: Use when the user adds, replaces, or asks about photos in one of the gallery categories (public/images/<categoria>/) — castillos-monumentales, san-juan-de-dios, talleres-familiares, toritos, mojigangas — or when a gallery album isn't showing a photo that should be there.
---

# Fotos de galería — Tultepec landing

Cada categoría del mosaico del Hero tiene su propia carpeta en
`public/images/<slug>/`, con fotos numeradas `01`, `02`, `03`... El código
(`src/hooks/useGalleryImages.js` + `src/lib/imageProbe.js`) prueba cada
número con varias extensiones (`jpg`, `jpeg`, `png`, `webp`, `jfif`, en ese
orden) y muestra las que sí existen, en orden numérico. No hace falta tocar
código para agregar o quitar fotos — solo el archivo en la carpeta correcta.

## Al revisar una foto nueva que el usuario agregó

1. Verifica el archivo con `ls -la public/images/<categoria>/` — **revisa
   la extensión exacta**. Es un error común que el usuario suba un archivo
   sin extensión (p. ej. `14` en vez de `14.jpg`); en ese caso el sistema de
   sondeo nunca lo va a encontrar y la foto no aparecerá en la galería,
   aunque el archivo exista. Avísale al usuario si ves esto.
2. Nunca uses la herramienta Read directamente sobre un archivo `.jfif` —
   no se renderiza como imagen y gasta contexto mostrando bytes crudos.
   Para ver el contenido de una foto sin gastar contexto, usa un script de
   Playwright que abra la galería en el navegador y tome una captura de
   `.gallery-modal__grid` (o de `.mosaic-tile` individual) — eso sí se puede
   leer con la herramienta Read como imagen normal.
3. Si la imagen es un gráfico/logo/ilustración (no una foto real de la
   tradición) colada en una carpeta de fotos reales, coméntaselo al usuario
   antes de desplegarla — no encaja temáticamente y puede tener el mismo
   problema de derechos de autor que otras imágenes de referencia que ha
   compartido en el chat.

## Reusar una foto de galería en otra parte del sitio

Varias secciones (Hero de fondo, FAQ, logo del header en su momento) ya
usan fotos de estas mismas carpetas directamente por ruta
(`/images/<categoria>/<numero>.<ext>`), en vez de duplicar archivos. Prefiere
ese patrón sobre subir una copia nueva a otra carpeta.

## Imágenes externas (pegadas en el chat o de bancos de stock)

- Antes de usar una imagen que el usuario pegó en el chat, revisa si tiene
  marca de agua visible (Adobe Stock, Canva, etc.) — si la tiene, no se
  puede usar: explícaselo y ofrece una alternativa (foto propia de su
  galería, o una ilustración hecha a mano en SVG).
- No asumas que puedes acceder al archivo real de una imagen pegada en el
  chat — a veces sí hay un archivo local accesible (en el directorio de
  `images` del scratchpad de la sesión) y a veces no. Verifícalo con `ls`
  antes de prometer que la vas a usar.
- No hay ninguna herramienta de generación de imágenes con IA disponible en
  este entorno — si el usuario pide "generar" una imagen o un logo nuevo
  desde cero, la única opción real es construirlo a mano como SVG.
