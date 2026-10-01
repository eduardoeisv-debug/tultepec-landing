// Compartido entre el formulario "Comparte tu memoria" y la sección pública
// "Memorias de la comunidad", para que ambos usen las mismas categorías.

// Opciones del <select> en el formulario (primera persona).
export const RELATIONSHIP_OPTIONS = [
  { value: "vecino", label: "Vivo en Tultepec" },
  { value: "familia_pirotecnica", label: "Mi familia se dedica a la pirotecnia" },
  { value: "visitante", label: "He visitado la feria o el pueblo" },
  { value: "otro", label: "Otro" },
];

// Etiquetas para mostrar junto a cada memoria publicada (tercera persona).
export const RELATIONSHIP_DISPLAY_LABELS = {
  vecino: "Vive en Tultepec",
  familia_pirotecnica: "Familia dedicada a la pirotecnia",
  visitante: "Ha visitado la feria o el pueblo",
  otro: "Comunidad de Tultepec",
};
