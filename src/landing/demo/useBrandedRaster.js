import { useEffect, useState } from 'react'

// Tint only explicitly selected Figma rasters that have no palette export. Preserve
// the hand, product photography, phone casing and alpha in the app mockups.
const cache = new Map()
const pending = new Map()
const isPromo = src => typeof src === 'string' && /^\/figma\/customer-website\/(mobile\/)?((app|checkout)-phone-hand|pickup-timing)\.png$/.test(src)

function tintPromo(src, color) {
  const key = `${src}:${color}`
  if (!pending.has(key)) pending.set(key, (async () => {
    const image = new Image()
    image.src = src
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(image, 0, 0)
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
    const target = [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16))
    const swatch = document.createElement('canvas').getContext('2d')
    swatch.fillStyle = `color-mix(in oklab, ${color} 8%, white)`
    swatch.fillRect(0, 0, 1, 1)
    const light = swatch.getImageData(0, 0, 1, 1).data
    for (let i = 0; i < pixels.data.length; i += 4) {
      const [red, green, blue] = pixels.data.slice(i, i + 3)
      const high = Math.max(red, green, blue)
      const low = Math.min(red, green, blue)
      if (blue !== high || blue - red < 4 || blue - green < 4 || high - low < 8) continue
      const hue = 60 * ((red - green) / (high - low) + 4)
      if (hue < 225 || hue > 275) continue
      if (Math.abs(red - 238) + Math.abs(green - 240) + Math.abs(blue - 253) < 7) {
        for (let channel = 0; channel < 3; channel++) pixels.data[i + channel] = light[channel]
        continue
      }
      const amount = Math.min(1, (high - low) / 156)
      const base = high - 241 * amount
      for (let channel = 0; channel < 3; channel++) pixels.data[i + channel] = Math.max(0, Math.min(255, base + target[channel] * amount))
    }
    context.putImageData(pixels, 0, 0)
    cache.set(key, canvas.toDataURL('image/png'))
  })().catch(() => cache.set(key, src)))
  return pending.get(key)
}

export function useBrandedRaster(src, color) {
  const [, loaded] = useState(0)
  const themed = isPromo(src)
  const key = `${src}:${color}`
  useEffect(() => {
    if (!themed || cache.has(key)) return
    let live = true
    tintPromo(src, color).then(() => { if (live) loaded(value => value + 1) })
    return () => { live = false }
  }, [src, color, key, themed])
  return themed ? cache.get(key) : src
}
