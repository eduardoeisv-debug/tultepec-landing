// Contenido de la pestaña "Quiénes somos" de la ventana "Relatos
// Escritos": la historia de cómo se formó el grupo "Memorias de mi
// Pueblo" y quiénes lo integran. Todos los campos de texto son bilingües
// ({ es, en }).
//
// TODO -- IMPORTANTE: nada de esto tiene todavía el texto real. Deja
// cada constante como está (null o []) hasta pegar la historia real;
// QuienesSomosTab.jsx muestra un estado vacío cuidado ("Pronto
// compartiremos la historia...") mientras no haya datos, y NUNCA texto
// de relleno ni inventado. Para publicar la historia real:
//
// 1. CITA: una frase corta y representativa del grupo, para mostrarse
//    grande en la parte de arriba. Ejemplo de forma (no de contenido):
//    CITA = { es: "...", en: "..." };
//
// 2. HITOS: la línea de tiempo de cómo se formó el grupo. Un arreglo de
//    objetos, cada uno con una etapa/año, un título corto y una frase:
//    HITOS = [
//      { etapa: { es: "2019", en: "2019" },
//        titulo: { es: "...", en: "..." },
//        texto: { es: "...", en: "..." } },
//      ...
//    ];
//
// 3. INTEGRANTES: las personas que forman el grupo. `foto` es opcional
//    (ruta dentro de public/, p.ej. "/images/grupo/nombre.jpg"); si se
//    omite, se muestra un marcador con la inicial del nombre.
//    INTEGRANTES = [
//      { nombre: "...", rol: { es: "...", en: "..." }, foto: null },
//      ...
//    ];
//
// 4. CIERRE: la frase de cierre antes del botón que lleva a "Los libros".
//    CIERRE = { es: "...", en: "..." };

export const CITA = null;

export const HITOS = [];

export const INTEGRANTES = [];

export const CIERRE = null;
