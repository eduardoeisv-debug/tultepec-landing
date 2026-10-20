// Genera public/galeria/manifest.json a partir de lo que YA está en
// public/images/<categoria>/ (las fotos optimizadas por
// scripts/optimize-images.mjs, commiteadas al repo) -- reemplaza el
// sondeo en tiempo real que hacía useGaleriaImages.js (HEAD por cada
// extensión posible, "01.jpg", "01.jpeg"... hasta el primer hueco). Ese
// sondeo confundía cualquier error de red real (paquete perdido, conexión
// reiniciada -- normal en datos móviles) con "esta foto no existe", y
// cortaba ahí el resto de la categoría aunque hubiera más fotos después.
// Con un manifest fijo, generado en build, no hay ninguna petición de
// red cuyo fallo se pueda confundir con "no existe": la lista ya se
// conoce de antemano.
//
// Se corre en "prebuild" (ver package.json) -- Vercel lo regenera en
// cada deploy a partir de public/images/, que SÍ está en git (no
// depende de assets-originales/, que también está en git pero no hace
// falta leer aquí). Si una carpeta de categoría no tiene ninguna foto, o
// si sharp no puede leer alguna, el script termina con código de salida
// distinto de cero -- eso detiene el build/deploy en vez de dejar un
// manifest incompleto en silencio (antes, con el sondeo, exactamente
// ese tipo de falla silenciosa era el bug).
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_CATEGORIES } from "../src/data/galeria.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OUTPUT_PATH = path.join(ROOT, "public", "galeria", "manifest.json");

const FULL_RE = /^(\d+)\.webp$/;

async function existe(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function buildCategoria(cat, ordenInicial) {
  const categoryDir = path.join(IMAGES_DIR, cat.folder);
  const thumbsDir = path.join(categoryDir, "thumbs");

  let entradas;
  try {
    entradas = await readdir(categoryDir, { withFileTypes: true });
  } catch (err) {
    throw new Error(`No se pudo leer public/images/${cat.folder}/ (${err.message}). ¿Falta correr scripts/optimize-images.mjs?`);
  }

  const archivos = entradas
    .filter((e) => e.isFile() && FULL_RE.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  if (archivos.length === 0) {
    throw new Error(
      `public/images/${cat.folder}/ no tiene ninguna foto (*.webp) -- carpeta de categoría vacía. Corre scripts/optimize-images.mjs o quita "${cat.folder}" de IMAGE_CATEGORIES en src/data/galeria.js si ya no aplica.`
    );
  }

  const fotos = [];
  let orden = ordenInicial;
  for (const filename of archivos) {
    const numero = filename.match(FULL_RE)[1];
    const fullPath = path.join(categoryDir, filename);
    const thumbPath = path.join(thumbsDir, filename);
    const thumb2xPath = path.join(thumbsDir, filename.replace(".webp", "@2x.webp"));

    if (!(await existe(thumbPath)) || !(await existe(thumb2xPath))) {
      throw new Error(
        `public/images/${cat.folder}/thumbs/${numero}.webp (o su @2x) no existe, pero ${filename} sí -- el manifest apuntaría a una miniatura rota. Vuelve a correr scripts/optimize-images.mjs.`
      );
    }

    let metadata;
    try {
      metadata = await sharp(fullPath).metadata();
    } catch (err) {
      throw new Error(`No se pudo leer ${fullPath} con sharp (archivo dañado o no es una imagen válida): ${err.message}`);
    }
    if (!metadata.width || !metadata.height) {
      throw new Error(`${fullPath}: sharp no devolvió ancho/alto válidos.`);
    }

    fotos.push({
      id: `${cat.folder}/${numero}`,
      folder: cat.folder,
      chip: cat.chip,
      categoryLabel: cat.label,
      orden: orden++,
      src: `/images/${cat.folder}/${filename}`,
      thumbSrc: `/images/${cat.folder}/thumbs/${filename}`,
      thumb2xSrc: `/images/${cat.folder}/thumbs/${filename.replace(".webp", "@2x.webp")}`,
      width: metadata.width,
      height: metadata.height,
    });
  }

  return fotos;
}

async function main() {
  const todas = [];
  for (const cat of IMAGE_CATEGORIES) {
    const fotos = await buildCategoria(cat, todas.length);
    todas.push(...fotos);
    console.log(`  ${cat.folder}: ${fotos.length} fotos`);
  }

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), photos: todas }, null, 2));

  console.log(`\npublic/galeria/manifest.json generado -- ${todas.length} fotos en total.`);
}

main().catch((err) => {
  console.error(`\nERROR generando el manifest de la galería:\n${err.message}`);
  process.exit(1);
});
