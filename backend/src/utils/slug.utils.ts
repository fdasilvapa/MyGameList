export const generateSlug = (text: string): string => {
  return text
    .toString() // Garante que é string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/[\s_-]+/g, "-") // Troca espaços por hifens
    .replace(/^-+|-+$/g, ""); // Remove hifens sobrando nas pontas
};
