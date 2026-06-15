// ==============================================================
//  src/utils/cn.js
//  Tailwind class birleştirme yardımcısı (clsx benzeri, minimal)
// ==============================================================

/**
 * Falsy değerleri filtreler ve class string'lerini birleştirir.
 * @param  {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
