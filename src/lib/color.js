const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

/** Returns "#rrggbb" (lowercase) or null when the input is not a valid hex color. */
export function normalizeHex(value) {
  const match = HEX_RE.exec(String(value).trim())
  if (!match) return null
  let hex = match[1]
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('')
  return `#${hex.toLowerCase()}`
}

export function hexToRgb(hex) {
  const n = parseInt(normalizeHex(hex).slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Picks white or near-black text, whichever reads better on the given background. */
export function readableTextOn(hex) {
  const l = relativeLuminance(hex)
  const contrastWhite = 1.05 / (l + 0.05)
  const contrastInk = (l + 0.05) / (relativeLuminance('#111111') + 0.05)
  return contrastWhite >= contrastInk ? '#ffffff' : '#111111'
}

/**
 * Extracts up to `count` prominent, reasonably saturated colors from an image URL.
 * Used for the "Suggested color based from your logo" row.
 */
export function extractPalette(src, count = 3) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const size = 48
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, size, size)
      const { data } = ctx.getImageData(0, 0, size, size)

      const buckets = new Map()
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
        if (a < 128) continue
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        // Skip near-white, near-black and grey pixels.
        if (max > 240 && min > 225) continue
        if (max < 30) continue
        if (max - min < 28) continue
        const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
        const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 }
        bucket.n += 1
        bucket.r += r
        bucket.g += g
        bucket.b += b
        buckets.set(key, bucket)
      }

      const ranked = [...buckets.values()]
        .sort((a, b) => b.n - a.n)
        .map(({ n, r, g, b }) => [Math.round(r / n), Math.round(g / n), Math.round(b / n)])

      const picked = []
      for (const rgb of ranked) {
        const distinct = picked.every(
          (p) => Math.hypot(p[0] - rgb[0], p[1] - rgb[1], p[2] - rgb[2]) > 60,
        )
        if (distinct) picked.push(rgb)
        if (picked.length === count) break
      }
      resolve(picked.map(rgbToHex))
    }
    img.onerror = () => resolve([])
    img.src = src
  })
}
