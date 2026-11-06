const ICONS = ['deco-croissant.svg', 'deco-cake.svg', 'deco-bread.svg', 'deco-donut.svg', 'deco-biscuit.svg', 'deco-cupcake.svg']

/** Noninteractive bakery accents kept in the outer gutters, clear of page content. */
export function GoldDecorations({ variant = 0 }) {
  return <div className="gold-decorations" aria-hidden="true">
    {[0, 1, 2, 3].map((index) => <img key={index} src={`/landing/${ICONS[(index + variant) % ICONS.length]}`} alt="" loading="lazy" style={{ top: `${12 + Math.floor(index / 2) * 60}%`, [index % 2 ? 'right' : 'left']: '1.5%', transform: `rotate(${index % 2 ? 24 : -18}deg)` }} />)}
  </div>
}
