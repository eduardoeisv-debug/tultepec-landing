# Cómo actualizar "Memorias de mi pueblo"

El contenido de la pestaña "Memorias de mi pueblo" (los 6 relatos, 2 por
cada uno de los 3 libros) sale de un solo archivo:

```
Documentos/Memorias_Libros.docx
```

Ese Word es la única fuente de esos textos. Nadie edita a mano el
archivo `src/data/memorias.json` que usa la página -- ese archivo se
genera automáticamente a partir del Word cada vez que el sitio se
compila (en Vercel, y también en tu computadora con `npm run dev` o
`npm run build`).

## Cómo editar el Word

1. Abre `Documentos/Memorias_Libros.docx` en Word.
2. El documento tiene 6 bloques, cada uno empieza con un párrafo como
   **"Memorias de mi Pueblo 1 - 1"** (libro 1, memoria 1), seguido de:
   - una línea con el género (por ejemplo "Antología Narrativa,")
   - la palabra "Fragmentos:"
   - el título del relato
   - el nombre de quien lo escribió (puede traer un apodo entre
     comillas y la edad, por ejemplo: `Sofía Montes Linares "Chofi", 79
     años`)
   - los fragmentos del relato, cada uno en su propio párrafo
3. Para corregir una errata, cambiar un título o ajustar un fragmento,
   edita el texto directamente ahí -- el formato (negritas, etc.) no
   importa, el script lee el **orden** de los párrafos, no el estilo.
4. Guarda el archivo (Ctrl+S) sin cambiar el nombre ni la carpeta.
5. **Importante:** cierra el Word después de guardar. Mientras el
   archivo está abierto, Word crea un archivo temporal que empieza con
   `~$` -- el script lo ignora, pero si el Word real sigue abierto el
   script puede leer una versión vieja o bloqueada del archivo.

## Cómo generar el JSON

Desde la carpeta del proyecto, en una terminal:

```
npm run build:memorias
```

Esto lee el Word y reescribe `src/data/memorias.json`. Si todo salió
bien, verás algo como:

```
[build-memorias] OK -- 6 memorias (3 libros x 2) escritas en src\data\memorias.json
```

**No hace falta correrlo a mano antes de subir cambios a Vercel** -- ya
está conectado para correr solo, automáticamente, antes de `npm run
dev` y antes de `npm run build` (incluyendo el build que hace Vercel en
cada despliegue). Solo corre el comando manualmente si quieres ver el
resultado en tu computadora antes de subirlo.

## Errores que puede mostrar el script

El script nunca "adivina" -- si algo en el Word no tiene la forma
esperada, se detiene con un mensaje claro en vez de publicar algo
incorrecto. Mensajes posibles y qué hacer:

- **"No encontré el archivo..."** — el Word no está en
  `Documentos/Memorias_Libros.docx`, o se renombró/movió.
- **"No encontré ningún encabezado con la forma 'Memorias de mi Pueblo
  N - N'..."** — revisa que los 6 encabezados existan y tengan esa
  forma (el número de libro, un guion, el número de memoria).
- **"Bloque '...': esperaba el párrafo 'Fragmentos:' justo después del
  género..."** — falta la línea "Fragmentos:" en ese bloque, o el
  género y "Fragmentos:" quedaron en el mismo párrafo (deben ser dos
  párrafos separados).
- **"Bloque '...': esperaba título, autor y al menos un fragmento..."**
  — a ese bloque le falta contenido después de "Fragmentos:".
- **"Bloque '...': el párrafo '...' parece un subtítulo de fragmento
  (es corto) pero no está seguido de un párrafo largo..."** — el
  script asume que un párrafo corto justo antes de uno largo es el
  subtítulo de ese fragmento; si un párrafo corto queda "suelto" (al
  final, o seguido de otro párrafo corto), no sabe qué hacer con él.
  Revisa si de verdad es un subtítulo (y le falta su fragmento debajo)
  o si debería unirse al párrafo anterior/siguiente.
- **"El libro N debería tener exactamente 2 memorias..."** / **"...no
  tiene título/autor/ningún fragmento"** — validación final: deben ser
  3 libros con 2 memorias cada uno, todas completas.

Si ves cualquiera de estos mensajes, corrige el Word según la pista y
vuelve a correr `npm run build:memorias`. El sitio sigue mostrando el
último JSON válido que se generó hasta que el script vuelva a correr
sin errores.
