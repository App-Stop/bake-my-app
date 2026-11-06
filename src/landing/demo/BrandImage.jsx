import { useEffect, useState } from 'react'
import { useDemoBrand } from './demoBrand'
import { presetColor } from '../../lib/brandPalette'

const boy = 'Creating_delivery_boy_icon_2K_202609021121 '
const files = {
  '4c52b.png': 'image 10.png',
  '5be80.png': 'image 10.png',
  'f4a92.png': 'image 10-2.png', 'cart-delivery.png': 'image 10-2.png',
  'ba908.png': boy + '2-7.png', 'pickup-store.png': boy + '2-7.png', '966b9.png': boy + '2-7.png',
  '74b7e.png': boy + '2-6.png', '13cd8.png': 'image 10-1.png',
  '0874f.png': 'image 11.png', 'edec3.png': 'image 11.png',
  '49aee.png': 'image 10-4.png', 'delivered-check.png': 'image 10-4.png',
  'ca1e0.png': 'image 10-3.png', 'rider-arrived.png': 'image 10-3.png',
  'a5103.png': boy + '2-4.png', 'rider-tip.png': boy + '2-4.png',
  '64be0.png': boy + '2.png', '96a05.png': boy + '2-1.png',
  '90e89.png': boy + '2-3.png', '294af.png': boy + '2-2.png',
}

// Figma exported the mobile SVGs (header glows etc.) with the Figma purple baked in;
// they're fetched once and re-filled with the demo's brand color.
const FIGMA_PURPLE = /#554CF1/gi
const svgText = new Map() // src -> SVG markup ('' when it has nothing to recolor or failed to load)
const pending = new Map() // src -> in-flight fetch

function loadSvg(src) {
  if (!pending.has(src)) {
    pending.set(src, fetch(src)
      .then((r) => (r.ok ? r.text() : ''))
      .catch(() => '')
      .then((text) => { svgText.set(src, /#554CF1/i.test(text) ? text : '') }))
  }
  return pending.get(src)
}

function useBrandSvg(src, color) {
  const recolorable = typeof src === 'string' && src.startsWith('/assets/mobile/') && src.endsWith('.svg')
  const [, loaded] = useState(0)
  useEffect(() => {
    if (!recolorable || svgText.has(src)) return
    let live = true
    loadSvg(src).then(() => { if (live) loaded((n) => n + 1) })
    return () => { live = false }
  }, [src, recolorable])
  if (!recolorable) return src
  // Render nothing until loaded, so the purple original never flashes in.
  if (!svgText.has(src)) return undefined
  const text = svgText.get(src)
  if (!text) return src
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text.replace(FIGMA_PURPLE, color))}`
}

export function BrandImage({ src, alt = '', ...props }) {
  const { color } = useDemoBrand()
  const file = files[src?.split('/').at(-1)]
  const svg = useBrandSvg(src, color)
  const themed = file ? `/assets/3d/${presetColor(color).slice(1)}/${encodeURIComponent(file)}` : svg
  return <img {...props} src={themed} alt={alt} />
}
