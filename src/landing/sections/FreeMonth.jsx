import { useModals } from '../useModals'
import { asset } from '../styles'

/*
 * Faint bakery icons (Figma "BG elements"): `x`/`y`/`box` are the rotated bounding box and `size`
 * the icon itself, in Figma px from the 1920-wide frame's top-left.
 */
const ICONS = [
  { src: 'croissant.svg', x: 29.22, y: 19.23, box: 61.547, size: 56, transform: 'rotate(-6deg)' },
  { src: 'donut.svg', x: 39.04, y: 180.04, box: 57.92, size: 56, transform: 'rotate(2deg)' },
  { src: 'cake-flipped.svg', x: 157.6, y: 76.61, box: 58.788, size: 48, transform: 'rotate(-165deg) scaleY(-1)' },
  { src: 'cupcake-flipped.svg', x: 222.89, y: 179.89, box: 62.225, size: 44, transform: 'rotate(-135deg) scaleY(-1)' },
  { src: 'biscuit-flipped.svg', x: 322.45, y: 87.45, box: 33.097, size: 32, transform: 'rotate(2deg) scaleY(-1)' },
  { src: 'biscuit.svg', x: 1554, y: 112, box: 32, size: 32 },
  { src: 'cupcake.svg', x: 1607.37, y: 192.37, box: 47.263, size: 44, transform: 'rotate(4.42deg)' },
  { src: 'cake.svg', x: 1691.62, y: 43.62, box: 52.754, size: 48, transform: 'rotate(-6deg)' },
  { src: 'coffee.svg', x: 1823, y: 172, box: 61.547, size: 56, transform: 'rotate(-6deg)' },
  { src: 'bread.svg', x: 1852, y: 24, box: 57.92, size: 56, transform: 'rotate(2deg)' },
]

/** Glowing "waves" (472×546, turned on its side) framing each end of the banner. */
function Waves({ src, x, flip }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 flex h-[calc(472*var(--u))] w-[calc(546*var(--u))] -translate-y-1/2 items-center justify-center"
      style={{ left: `calc(${x} * var(--u))` }}
    >
      <div className="relative h-[calc(546*var(--u))] w-[calc(472*var(--u))] flex-none" style={{ transform: `rotate(-90deg)${flip ? ' scaleY(-1)' : ''}` }}>
        <div className="absolute inset-[-134.98%_-126.91%_-89.38%_-127.12%]">
          <img src={asset(`promo/${src}`)} alt="" loading="lazy" className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  )
}

/** Dark "first month, completely free!" banner (Figma 1920×276). */
export function FreeMonth() {
  const { openPromo } = useModals()
  return (
    <section aria-labelledby="free-month-title" data-nav-theme="dark" className="relative z-10 overflow-hidden bg-[#232050]">
      <div className="relative mx-auto flex max-w-[1920px] flex-col items-center justify-center gap-[max(24*var(--m),80*var(--u))] px-5 py-[max(56*var(--m),100*var(--u))] md:flex-row md:px-[calc(200*var(--u))]">
        <Waves src="waves-left.svg" x={-89} flip />
        <Waves src="waves-right.svg" x={1407} />
        {ICONS.map(({ src, x, y, box, size, transform }) => (
          <div
            key={src}
            aria-hidden="true"
            className="pointer-events-none absolute hidden items-center justify-center md:flex"
            style={{
              left: `calc(${x} * var(--u))`,
              top: `calc(${y} * var(--u))`,
              width: `calc(${box} * var(--u))`,
              height: `calc(${box} * var(--u))`,
            }}
          >
            <img
              src={asset(`promo/${src}`)}
              alt=""
              width={size}
              height={size}
              loading="lazy"
              className="max-w-none shrink-0 select-none"
              style={{ width: `calc(${size} * var(--u))`, height: `calc(${size} * var(--u))`, transform }}
            />
          </div>
        ))}

        <h2
          id="free-month-title"
          className="relative text-center font-malibu text-[length:max(32*var(--m),48*var(--u))] leading-normal font-normal text-primary-light md:whitespace-nowrap"
        >
          first month, completely free!
        </h2>
        <button
          type="button"
          onClick={openPromo}
          className="relative shrink-0 rounded-full bg-white px-[max(24*var(--m),40*var(--u))] py-[max(14*var(--m),20*var(--u))] text-[length:max(18*var(--m),24*var(--u))] leading-normal font-bold whitespace-nowrap text-primary transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          CLAIM OFFER
        </button>
      </div>
    </section>
  )
}
