// Convierte las fotos de la Galería (public/images/<categoria>/, las 5
// carpetas que lee IMAGE_CATEGORIES en src/data/galeria.js) a WebP y
// genera sus miniaturas para la cuadrícula. Se corre a mano una sola
// vez (no en cada build -- las fotos no cambian seguido, y sharp es
// una dependencia de desarrollo, no de runtime): `node scripts/optimize-images.mjs`.
//
// Por cada NN.<jpg|jpeg|png|jfif|webp> deja:
//   <categoria>/NN.webp              -- hasta 1200px de ancho, para el
//                                        visor ampliado (lightbox)
//   <categoria>/thumbs/NN.webp       -- hasta 400px, para la cuadrícula (1x)
//   <categoria>/thumbs/NN@2x.webp    -- hasta 800px, para la cuadrícula (2x/retina)
// y borra el archivo original si su extensión/ubicación ya no es la
// misma que el .webp nuevo (para que imageProbe.js no encuentre dos
// variantes de la misma foto). useGaleriaImages.js deriva thumbSrc/
// thumb2xSrc del src ya encontrado con un simple replace de ruta, así
// que no hace falta tocar ese hook por el cambio de nombre/carpeta.
import { mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IMAGES_DIR = path.join(ROOT, "public", "images");

const CATEGORIES = ["toritos", "castillos-monumentales", "san-juan-de-dios", "talleres-familiares", "mojigangas"];
const SOURCE_EXT = /^\d+\.(jpe?g|png|jfif|webp)$/i;

const FULL_MAX_WIDTH = 1200;
// Varias fotos de origen ya venían recomprimidas a baja calidad (WhatsApp/
// capturas de pantalla, .jfif) -- codificarlas a WebP con una calidad más
// alta que esa terminaba pesando MÁS que el original, no menos. 72/60 sigue
// viéndose bien a los tamaños en que de verdad se muestran (visor ampliado
// / cuadrícula de 130px) y sí reduce el peso en la mayoría de los casos.
const FULL_QUALITY = 72;
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 60;

let totalBefore = 0;
let totalAfter = 0;

async function processFile(categoryDir, thumbsDir, filename) {
  const srcPath = path.join(categoryDir, filename);
  const numero = filename.match(/^(\d+)\./)[1];
  const before = (await stat(srcPath)).size;
  totalBefore += before;

  const fullPath = path.join(categoryDir, `${numero}.webp`);
  const thumbPath = path.join(thumbsDir, `${numero}.webp`);
  const thumb2xPath = path.join(thumbsDir, `${numero}@2x.webp`);

  const base = sharp(srcPath).rotate(); // auto-orienta según EXIF antes de medir/recortar
  await base.clone().resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true }).webp({ quality: FULL_QUALITY }).toFile(`${fullPath}.tmp`);
  await base.clone().resize({ width: THUMB_WIDTH, withoutEnlargement: true }).webp({ quality: THUMB_QUALITY }).toFile(`${thumbPath}.tmp`);
  await base
    .clone()
    .resize({ width: THUMB_WIDTH * 2, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY })
    .toFile(`${thumb2xPath}.tmp`);

  // El original se borra DESPUÉS de que las 3 salidas ya se escribieron
  // bien (si algo truena a medio archivo arriba, el original sigue
  // intacto) -- y solo si de verdad es un archivo distinto al .webp
  // final (si alguien ya había guardado NN.webp a mano, sharp lee y
  // reescribe el mismo nombre, nada que borrar).
  const esMismoArchivo = srcPath === fullPath;
  await rename(`${fullPath}.tmp`, fullPath);
  await rename(`${thumbPath}.tmp`, thumbPath);
  await rename(`${thumb2xPath}.tmp`, thumb2xPath);
  if (!esMismoArchivo) await rm(srcPath);

  const after = (await stat(fullPath)).size + (await stat(thumbPath)).size + (await stat(thumb2xPath)).size;
  totalAfter += after;
  console.log(`  ${filename} -> ${numero}.webp  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (full+thumbs)`);
}

async function main() {
  for (const categoria of CATEGORIES) {
    const categoryDir = path.join(IMAGES_DIR, categoria);
    const thumbsDir = path.join(categoryDir, "thumbs");
    await mkdir(thumbsDir, { recursive: true });

    const archivos = (await readdir(categoryDir, { withFileTypes: true }))
      .filter((e) => e.isFile() && SOURCE_EXT.test(e.name))
      .map((e) => e.name)
      .sort();

    console.log(`\n${categoria} (${archivos.length} fotos)`);
    for (const filename of archivos) {
      await processFile(categoryDir, thumbsDir, filename);
    }
  }

  console.log(`\nTotal antes:   ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total después: ${(totalAfter / 1024 / 1024).toFixed(2)} MB (full + 2 miniaturas por foto)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
