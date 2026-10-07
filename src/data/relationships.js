// Compartido entre el formulario "Comparte tu memoria" y la sección pública
// "Memorias de la comunidad", para que ambos usen las mismas categorías.
// Las etiquetas son bilingües ({ es, en }) y se leen con `pick()`.

// Opciones del <select> en el formulario (primera persona).
export const RELATIONSHIP_OPTIONS = [
  { value: "vecino", label: { es: "Vivo en Tultepec", en: "I live in Tultepec" } },
  { value: "familia_pirotecnica", label: { es: "Mi familia se dedica a la pirotecnia", en: "My family works in fireworks" } },
  { value: "visitante", label: { es: "He visitado la feria o el pueblo", en: "I've visited the fair or the town" } },
  { value: "otro", label: { es: "Otro", en: "Other" } },
];

// Etiquetas para mostrar junto a cada memoria publicada (tercera persona).
export const RELATIONSHIP_DISPLAY_LABELS = {
  vecino: { es: "Vive en Tultepec", en: "Lives in Tultepec" },
  familia_pirotecnica: { es: "Familia dedicada a la pirotecnia", en: "Family works in fireworks" },
  visitante: { es: "Ha visitado la feria o el pueblo", en: "Has visited the fair or the town" },
  otro: { es: "Comunidad de Tultepec", en: "Tultepec community" },
};
