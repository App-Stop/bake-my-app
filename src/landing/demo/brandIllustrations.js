// Explicit opt-in: product photos, logos, maps, QR codes and phone/hand artwork
// must never inherit the experimental whole-image filter.
const ILLUSTRATIONS = new Set([
  '13cd8.png', // Placing-order receipt.
  'edec3.png', // Preparing-order bag.
  'delivered-check.png',
  'f4a92.png',
  'ba908.png',
  '74b7e.png',
  'cart-delivery.png',
  'rider-arrived.png',
  'rider-tip.png',
  'pickup-store.png',
  'pickup-timing.png',
  '6252b.svg', // Supporting glow backgrounds.
  '70bc1.svg',
  '6a563.svg',
  'a4fb5.svg',
  'delivered-glow.svg',
])

export function brandIllustrationProps(file, props = {}) {
  if (!ILLUSTRATIONS.has(file)) return props
  return {
    ...props,
    className: [props.className, 'brand-illustration'].filter(Boolean).join(' '),
    'data-brand-illustration': true,
  }
}
