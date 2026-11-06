export const BRAND_COLORS = [
  ['Pink', '#FF1FAD'], ['Violet', '#903BFF'], ['Green', '#00C064'],
  ['Cyan', '#00B4B2'], ['Red', '#F30000'], ['Orange', '#F96C00'],
  ['Blue', '#0095FF'], ['Yellow', '#C9B500'], ['Rose', '#D70048'], ['Brown', '#BD4A15'],
].map(([name, hex]) => ({ name, hex }))
export const DEFAULT_COLOR = '#BD4A15'
export function presetColor(value) {
  return BRAND_COLORS.find(({ hex }) => hex === String(value).toUpperCase())?.hex ?? DEFAULT_COLOR
}
