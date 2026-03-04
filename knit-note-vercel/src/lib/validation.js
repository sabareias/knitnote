/**
 * Server-side validation allowlists for SQL injection defense in depth.
 * Only these values are accepted; any other input is rejected before reaching the DB.
 */
export const ALLOWED_CATEGORIES = ["Clothing", "Accessory", "Home", "Other"];
export const ALLOWED_CRAFTS = ["Knit", "Crochet"];

export function isAllowedCategory(value) {
  return typeof value === "string" && ALLOWED_CATEGORIES.includes(value);
}

export function isAllowedCraft(value) {
  return typeof value === "string" && ALLOWED_CRAFTS.includes(value);
}
