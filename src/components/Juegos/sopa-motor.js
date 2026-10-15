// Lógica de la sopa de letras, sin DOM -- misma idea que memorama-motor.js:
// el componente (SopaDeLetras.jsx) solo dibuja y delega aquí generar el
// tablero y validar lo que la persona selecciona.

export const TAM = 12;

// Sin acentos ni Ñ: el tablero solo usa A-Z. Cada idioma tiene su propia
// lista (las palabras en inglés no son traducción literal, son las que
// una persona esperaría encontrar en una sopa de letras en inglés).
export const PALABRAS = {
  es: ["PIROTECNIA", "CASTILLO", "COHETE", "TULTEPEC", "TORITO", "POLVORA", "FERIA", "ARTESANO", "LUCES", "FUEGO"],
  en: ["FIREWORKS", "CASTILLO", "ROCKET", "TULTEPEC", "TORITO", "GUNPOWDER", "FAIR", "ARTISAN", "LIGHTS", "FIRE"],
};

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// [fila, columna] por paso: derecha, abajo, diagonal abajo-derecha y
// diagonal arriba-derecha. Las palabras también se aceptan al revés
// (ver buscarPalabra), así que las otras cuatro direcciones ya quedan
// cubiertas al seleccionar de fin a inicio.
const DIRECCIONES = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
];

function colocar(grid, palabra, azar) {
  for (let intento = 0; intento < 300; intento++) {
    const [df, dc] = DIRECCIONES[Math.floor(azar() * DIRECCIONES.length)];
    const f = Math.floor(azar() * TAM);
    const c = Math.floor(azar() * TAM);
    const ff = f + df * (palabra.length - 1);
    const cf = c + dc * (palabra.length - 1);
    if (ff < 0 || ff >= TAM || cf < 0 || cf >= TAM) continue;

    let cabe = true;
    for (let i = 0; i < palabra.length; i++) {
      const actual = grid[f + df * i][c + dc * i];
      if (actual !== "" && actual !== palabra[i]) {
        cabe = false;
        break;
      }
    }
    if (!cabe) continue;

    for (let i = 0; i < palabra.length; i++) grid[f + df * i][c + dc * i] = palabra[i];
    return true;
  }
  return false;
}

// Devuelve una matriz TAM x TAM de letras con todas las palabras dentro.
// Las más largas se colocan primero (después ya queda poco espacio libre
// para ellas); si alguna no cabe tras 300 intentos, se vuelve a empezar
// con un tablero nuevo en vez de dejar una sopa imposible de terminar.
export function generarTablero(palabras, azar = Math.random) {
  const orden = [...palabras].sort((a, b) => b.length - a.length);
  for (let vuelta = 0; vuelta < 50; vuelta++) {
    const grid = Array.from({ length: TAM }, () => Array(TAM).fill(""));
    if (!orden.every((p) => colocar(grid, p, azar))) continue;
    for (let f = 0; f < TAM; f++) {
      for (let c = 0; c < TAM; c++) {
        if (grid[f][c] === "") grid[f][c] = LETRAS[Math.floor(azar() * LETRAS.length)];
      }
    }
    return grid;
  }
  throw new Error("No se pudo generar la sopa de letras");
}

// Línea recta (horizontal, vertical o diagonal) entre dos celdas.
// null si no están alineadas o si es la misma celda.
export function trazarLinea(tablero, inicio, fin) {
  const difF = fin.f - inicio.f;
  const difC = fin.c - inicio.c;
  if (difF === 0 && difC === 0) return null;
  if (difF !== 0 && difC !== 0 && Math.abs(difF) !== Math.abs(difC)) return null;

  const df = Math.sign(difF);
  const dc = Math.sign(difC);
  const largo = Math.max(Math.abs(difF), Math.abs(difC)) + 1;
  const celdas = [];
  let texto = "";
  for (let i = 0; i < largo; i++) {
    const f = inicio.f + df * i;
    const c = inicio.c + dc * i;
    celdas.push(`${f}-${c}`);
    texto += tablero[f][c];
  }
  return { celdas, texto };
}

// La palabra de la lista (aún sin encontrar) que coincide con el texto,
// leído al derecho o al revés. null si ninguna.
export function buscarPalabra(texto, palabras, halladas) {
  const alReves = [...texto].reverse().join("");
  return palabras.find((p) => !halladas.includes(p) && (p === texto || p === alReves)) ?? null;
}
