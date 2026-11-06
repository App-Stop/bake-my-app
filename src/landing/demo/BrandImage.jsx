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

export function BrandImage({ src, alt = '', ...props }) {
  const { color } = useDemoBrand()
  const file = files[src?.split('/').at(-1)]
  const themed = file ? `/assets/3d/${presetColor(color).slice(1)}/${encodeURIComponent(file)}` : src
  return <img {...props} src={themed} alt={alt} />
}
