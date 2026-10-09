// Convierte Documentos/Memorias_Libros.docx -> src/data/memorias.json en
// tiempo de compilación (no en el navegador). Se corre solo mediante
// "npm run build:memorias", y automáticamente antes de "dev"/"build" (ver
// los scripts "predev"/"prebuild" en package.json), para que el sitio
// siempre sirva la versión más reciente del Word.
//
// No modifica el texto del documento (ni ortografía ni puntos
// suspensivos): solo recorta espacios al inicio/fin de cada párrafo. Si
// algo no se puede interpretar con seguridad, el script falla con un
// mensaje que señala el bloque y el motivo -- nunca adivina.

import { readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import mammoth from "mammoth";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DOCX_PATH = path.join(ROOT, "Documentos", "Memorias_Libros.docx");
const OUTPUT_PATH = path.join(ROOT, "src", "data", "memorias.json");

// Un párrafo corto justo antes de uno largo es el subtítulo de ese
// fragmento (ver PASO 1 del encargo). 100 caracteres separa con margen
// los subtítulos reales del corpus (el más largo, "La música: ¡Para
// reír, bailar y cantar!", mide 40) de los fragmentos más cortos (el más
// corto mide ~125).
const SUBTITLE_MAX_LENGTH = 100;

const HEADER_RE = /^memorias\s+de\s+mi\s+pueblo\s+(\d+)\s*-\s*(\d+)\s*$/i;
const FRAGMENTOS_LABEL_RE = /^fragmentos:?$/i;

function fail(message) {
  console.error(`\n[build-memorias] ${message}\n`);
  process.exit(1);
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Un párrafo de Word == un <p> de mammoth. Se descartan los vacíos (el
// documento trae varios) sin tocar el contenido de los que sí tienen texto.
function extractParagraphs(html) {
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)];
  return matches
    .map((m) => decodeEntities(m[1].replace(/<[^>]+>/g, "")).trim())
    .filter((text) => text.length > 0);
}

function splitIntoBlocks(paragraphs) {
  const headerIndexes = [];
  paragraphs.forEach((p, i) => {
    if (HEADER_RE.test(p)) headerIndexes.push(i);
  });

  if (headerIndexes.length === 0) {
    fail(
      'No encontré ningún encabezado con la forma "Memorias de mi Pueblo N - N" en el documento. ' +
        "Revisa que Documentos/Memorias_Libros.docx tenga los 6 bloques esperados."
    );
  }

  return headerIndexes.map((start, i) => {
    const end = i + 1 < headerIndexes.length ? headerIndexes[i + 1] : paragraphs.length;
    return paragraphs.slice(start, end);
  });
}

// Separa "Nombre Apellido "Apodo", NN años" en { autor, autorNota } --
// solo cuando el renglón trae una comilla (recta o tipográfica); si no,
// el renglón completo es el autor, tal cual.
function splitAutor(line) {
  const quoteMatch = line.match(/["“]/);
  if (!quoteMatch || quoteMatch.index === 0) {
    return { autor: line };
  }
  return {
    autor: line.slice(0, quoteMatch.index).trim(),
    autorNota: line.slice(quoteMatch.index).trim(),
  };
}

// Agrupa los párrafos de fragmentos en { subtitulo?, texto }, aplicando
// la regla "corto seguido de largo = subtítulo de ese fragmento".
function parseFragmentos(paragraphs, etiqueta) {
  const fragmentos = [];
  let i = 0;
  while (i < paragraphs.length) {
    const current = paragraphs[i];
    const next = paragraphs[i + 1];
    const isShort = current.length <= SUBTITLE_MAX_LENGTH;
    const nextIsLong = next != null && next.length > SUBTITLE_MAX_LENGTH;

    if (isShort && nextIsLong) {
      fragmentos.push({ subtitulo: current, texto: next });
      i += 2;
    } else if (isShort) {
      fail(
        `Bloque "${etiqueta}": el párrafo "${current}" parece un subtítulo de fragmento (es corto) pero no está seguido ` +
          "de un párrafo largo que sea su fragmento. No puedo interpretarlo con seguridad -- revisa el Word."
      );
    } else {
      fragmentos.push({ texto: current });
      i += 1;
    }
  }
  return fragmentos;
}

function parseBlock(paragraphs) {
  const header = paragraphs[0];
  const match = header.match(HEADER_RE);
  const libro = Number(match[1]);
  const numero = Number(match[2]);
  const etiqueta = header;
  const id = `${libro}-${numero}`;

  if (paragraphs.length < 2) {
    fail(`Bloque "${etiqueta}": no encontré ningún párrafo después del encabezado (falta el género).`);
  }
  const genero = paragraphs[1];

  if (paragraphs.length < 3 || !FRAGMENTOS_LABEL_RE.test(paragraphs[2])) {
    fail(
      `Bloque "${etiqueta}": esperaba el párrafo "Fragmentos:" justo después del género ("${genero}"), ` +
        `pero encontré "${paragraphs[2] ?? "(nada)"}".`
    );
  }

  const body = paragraphs.slice(3);
  if (body.length === 0) {
    fail(`Bloque "${etiqueta}": no hay contenido después de "Fragmentos:".`);
  }

  // Excepción documentada para la memoria 2-1: título general + subtítulo
  // general antes del autor (ver PASO 1 del encargo). El resto de los
  // bloques no tiene ese subtítulo general.
  const isException = libro === 2 && numero === 1;

  let titulo;
  let subtitulo;
  let autorLine;
  let restBody;

  if (isException) {
    if (body.length < 4) {
      fail(
        `Bloque "${etiqueta}": es la excepción documentada (título + subtítulo + autor + fragmentos), ` +
          "pero no encontré suficientes párrafos para esa forma."
      );
    }
    [titulo, subtitulo, autorLine, ...restBody] = body;
  } else {
    if (body.length < 3) {
      fail(`Bloque "${etiqueta}": esperaba título, autor y al menos un fragmento después de "Fragmentos:".`);
    }
    [titulo, autorLine, ...restBody] = body;
  }

  const { autor, autorNota } = splitAutor(autorLine);
  const fragmentos = parseFragmentos(restBody, etiqueta);

  const memoria = { id, libro, numero, etiqueta, genero, titulo, autor };
  if (subtitulo) memoria.subtitulo = subtitulo;
  if (autorNota) memoria.autorNota = autorNota;
  memoria.fragmentos = fragmentos;
  return memoria;
}

function validate(memorias) {
  const libros = new Map();
  for (const m of memorias) {
    if (!libros.has(m.libro)) libros.set(m.libro, []);
    libros.get(m.libro).push(m);
  }

  const librosEsperados = [1, 2, 3];
  const librosEncontrados = [...libros.keys()].sort((a, b) => a - b);
  if (librosEncontrados.length !== 3 || librosEsperados.some((l) => !libros.has(l))) {
    fail(`Esperaba exactamente los libros 1, 2 y 3; encontré: ${librosEncontrados.join(", ") || "(ninguno)"}.`);
  }

  for (const libro of librosEsperados) {
    const items = libros.get(libro);
    if (items.length !== 2) {
      fail(`El libro ${libro} debería tener exactamente 2 memorias; encontré ${items.length}.`);
    }
    for (const m of items) {
      if (!m.titulo) fail(`Memoria "${m.etiqueta}" no tiene título.`);
      if (!m.autor) fail(`Memoria "${m.etiqueta}" no tiene autor.`);
      if (!m.fragmentos || m.fragmentos.length === 0) fail(`Memoria "${m.etiqueta}" no tiene ningún fragmento.`);
      for (const f of m.fragmentos) {
        if (!f.texto) fail(`Memoria "${m.etiqueta}" tiene un fragmento sin texto.`);
      }
    }
  }
}

async function main() {
  try {
    await access(DOCX_PATH);
  } catch {
    fail(`No encontré el archivo "${DOCX_PATH}". Verifica que Memorias_Libros.docx esté en la carpeta Documentos/.`);
  }

  const { value: html, messages } = await mammoth.convertToHtml({ path: DOCX_PATH });
  for (const msg of messages) {
    if (msg.type === "warning") console.warn(`[build-memorias] Word: ${msg.message}`);
  }

  const paragraphs = extractParagraphs(html);
  const blocks = splitIntoBlocks(paragraphs);
  const memorias = blocks.map(parseBlock);
  memorias.sort((a, b) => a.libro - b.libro || a.numero - b.numero);

  validate(memorias);

  await writeFile(OUTPUT_PATH, JSON.stringify(memorias, null, 2) + "\n", "utf8");
  console.log(`[build-memorias] OK -- ${memorias.length} memorias (3 libros x 2) escritas en ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main().catch((err) => {
  fail(`Error inesperado: ${err.stack || err.message}`);
});
