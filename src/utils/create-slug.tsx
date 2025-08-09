export function createSlug(username: string): string {
  return username
    .normalize('NFD') // Decompõe caracteres acentuados (ex: ç, à)
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .replace(/--+/g, '-') // Substitui múltiplos hifens por um único
    .replace(/[^a-zA-Z0-9\-]/g, '') // Remove caracteres especiais
    .toLowerCase() // Converte para minúsculo (opcional)
    .trim(); // Remove espaços no início e no final
}