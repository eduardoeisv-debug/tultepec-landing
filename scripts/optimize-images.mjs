// Convierte las fotos originales de la Galería (assets-originales/galeria/
// <categoria>/, fuera de /public a propósito -- no hace falta servirlas
// nunca, solo queremos poder regenerar public/images/ si cambia algo) a
// WebP y genera sus miniaturas para la cuadrícula. Se corre a mano una
// sola vez por cambio de fotos (no en cada build): `node scripts/optimize-images.mjs`.
//
// Por cada NN.<jpg|jpeg|png|jfif|webp> en assets-originales/galeria/<categoria>/
// deja en public/images/<categoria>/:
//   NN.webp              -- hasta 1280px de ancho (conserva proporción),
//                            para el visor ampliado (lightbox). Meta: <200KB.
//   thumbs/NN.webp        -- 400x400 cuadrado (recorte por contenido vía
//                            sharp.strategy.attention), para la cuadrícula
//                            (1x). Meta: <40KB.
//   thumbs/NN@2x.webp     -- 800x800 cuadrado, mismo recorte (2x/retina).
//
// El recorte a cuadrado (no solo un resize por ancho) es a propósito: la
// cuadrícula ya muestra cada miniatura en una celda cuadrada de 130px con
// object-fit:cover (ver GaleriaOverlay.css), así que una foto en retrato
// "ancho 400px" seguía siendo alta y pesada -- recortarla a cuadrado en el
// servidor manda menos bytes por la misma foto que el navegador iba a
// recortar de todos modos.
import { mkdir, readdir, rename, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE_DIR = path.join(ROOT, "assets-originales", "galeria");
const IMAGES_DIR = path.join(ROOT, "public", "images");

const CATEGORIES = ["toritos", "castillos-monumentales", "san-juan-de-dios", "talleres-familiares", "mojigangas"];
const SOURCE_EXT = /^\d+\.(jpe?g|png|jfif|webp)$/i;

const FULL_MAX_WIDTH = 1280;
const FULL_QUALITY = 80;
const FULL_TARGET_KB = 200;
const THUMB_SIZE = 400;
// 60, no 75 -- a 75 (y todavía a 68) las 6 fotos más detalladas de
// castillos-monumentales quedaban por arriba de la meta de 40KB; a este
// tamaño de exhibición (celda de 130px) la diferencia no se nota.
const THUMB_QUALITY = 55;
const THUMB_TARGET_KB = 40;

let totalBefore = 0;
let totalAfter = 0;
const sobrePeso = [];

async function processFile(srcDir, categoryDir, thumbsDir, filename) {
  const srcPath = path.join(srcDir, filename);
  const numero = filename.match(/^(\d+)\./)[1];
  const before = (await stat(srcPath)).size;
  totalBefore += before;

  const fullPath = path.join(categoryDir, `${numero}.webp`);
  const thumbPath = path.join(thumbsDir, `${numero}.webp`);
  const thumb2xPath = path.join(thumbsDir, `${numero}@2x.webp`);

  const base = sharp(srcPath).rotate(); // auto-orienta según EXIF antes de medir/recortar
  await base
    .clone()
    .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: FULL_QUALITY })
    .toFile(`${fullPath}.tmp`);
  await base
    .clone()
    .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: THUMB_QUALITY })
    .toFile(`${thumbPath}.tmp`);
  await base
    .clone()
    .resize({ width: THUMB_SIZE * 2, height: THUMB_SIZE * 2, fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: THUMB_QUALITY })
    .toFile(`${thumb2xPath}.tmp`);

  await rename(`${fullPath}.tmp`, fullPath);
  await rename(`${thumbPath}.tmp`, thumbPath);
  await rename(`${thumb2xPath}.tmp`, thumb2xPath);

  const fullSize = (await stat(fullPath)).size;
  const thumbSize = (await stat(thumbPath)).size;
  const thumb2xSize = (await stat(thumb2xPath)).size;
  totalAfter += fullSize + thumbSize + thumb2xSize;

  if (fullSize > FULL_TARGET_KB * 1024) sobrePeso.push(`${numero}.webp (full): ${(fullSize / 1024).toFixed(0)}KB > ${FULL_TARGET_KB}KB`);
  if (thumbSize > THUMB_TARGET_KB * 1024) sobrePeso.push(`${numero}.webp (thumb): ${(thumbSize / 1024).toFixed(0)}KB > ${THUMB_TARGET_KB}KB`);

  console.log(
    `  ${filename} -> ${numero}.webp  ${(before / 1024).toFixed(0)}KB -> full ${(fullSize / 1024).toFixed(0)}KB, thumb ${(thumbSize / 1024).toFixed(0)}KB, thumb2x ${(thumb2xSize / 1024).toFixed(0)}KB`
  );
}

async function main() {
  for (const categoria of CATEGORIES) {
    const srcDir = path.join(SOURCE_DIR, categoria);
    const categoryDir = path.join(IMAGES_DIR, categoria);
    const thumbsDir = path.join(categoryDir, "thumbs");
    await mkdir(thumbsDir, { recursive: true });

    const archivos = (await readdir(srcDir, { withFileTypes: true }))
      .filter((e) => e.isFile() && SOURCE_EXT.test(e.name))
      .map((e) => e.name)
      .sort();

    console.log(`\n${categoria} (${archivos.length} fotos)`);
    for (const filename of archivos) {
      await processFile(srcDir, categoryDir, thumbsDir, filename);
    }
  }

  console.log(`\nTotal original:            ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total generado (full+2 miniaturas): ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  if (sobrePeso.length) {
    console.log(`\n${sobrePeso.length} archivo(s) por arriba de la meta de peso:`);
    sobrePeso.forEach((s) => console.log(`  ${s}`));
  } else {
    console.log("\nTodos los archivos quedaron dentro de la meta de peso.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
