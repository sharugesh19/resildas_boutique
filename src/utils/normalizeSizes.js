// src/utils/normalizeSizes.js
//
// Converts any legacy/malformed `sizes` value into the canonical
// [{ size, stock }] shape used everywhere in admin + storefront.
// Handles: old plain-string arrays, already-correct object arrays,
// and garbage (null/undefined/non-array) without throwing.

export function normalizeSizes(sizes) {
  if (!Array.isArray(sizes)) return [];

  return sizes
    .map((s) => {
      if (typeof s === 'string') {
        const trimmed = s.trim();
        return trimmed ? { size: trimmed, stock: 10 } : null;
      }
      if (s && typeof s === 'object' && typeof s.size === 'string' && s.size.trim()) {
        return { size: s.size.trim(), stock: Number(s.stock) || 0 };
      }
      return null; // drop anything unrecognizable instead of crashing
    })
    .filter(Boolean);
}