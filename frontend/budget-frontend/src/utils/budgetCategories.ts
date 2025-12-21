export function isFixedCategory(category: string) {
  const normalized = category.toLowerCase();
  return normalized.includes("fixed") || normalized.includes("vaste");
}
