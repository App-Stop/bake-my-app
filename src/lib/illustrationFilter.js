import { hexToRgb, normalizeHex } from './color.js'

const SOURCE_COLOR = '#554cf1'

function hsl(hex) {
  const [r, g, b] = hexToRgb(hex).map(channel => channel / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const lightness = (max + min) / 2
  if (!delta) return { hue: 0, saturation: 0, lightness }
  let hue = max === r ? (g - b) / delta : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  hue = (hue * 60 + 360) % 360
  return { hue, saturation: delta / (1 - Math.abs(2 * lightness - 1)), lightness }
}

const source = hsl(SOURCE_COLOR)
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/**
 * Experimental whole-image tint for the original purple 3D artwork.
 * Hue rotation preserves neutral pixels; saturation and brightness also affect
 * whites and other colors. Bounds keep extreme brand colors from losing all
 * shading. This approximates a brand color rather than replacing individual pixels.
 */
export function illustrationFilter(color) {
  const hex = normalizeHex(color)
  if (!hex || hex === SOURCE_COLOR) return 'none'
  const target = hsl(hex)
  const hue = target.saturation ? (target.hue - source.hue + 540) % 360 - 180 : 0
  const saturation = clamp(target.saturation / source.saturation, 0, 2)
  const brightness = clamp(target.lightness / source.lightness, .35, 1.5)
  return `hue-rotate(${hue.toFixed(2)}deg) saturate(${saturation.toFixed(3)}) brightness(${brightness.toFixed(3)})`
}
