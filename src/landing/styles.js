/** Files exported from Figma live in public/landing/. */
export const asset = (name) => `${import.meta.env.BASE_URL}landing/${name}`

/*
 * Fluid scale: every value equals the Figma size at 1920px wide and shrinks with the viewport
 * (`n * var(--u)`), so smaller desktops show the same frame scaled down. `n * var(--m)` is the
 * readable floor, which only applies below the desktop layout (see index.css); fixed sizes use
 * `n * var(--px)`. Kept as literal strings so Tailwind can see them.
 */
export const PAGE_X = 'px-[max(20*var(--m),140*var(--u))]'
export const CONTAINER = `mx-auto w-full max-w-[1920px] ${PAGE_X}`

export const TYPE = {
  display: 'font-malibu text-[length:max(44*var(--m),96*var(--u))] leading-[1.1042] font-normal',
  hero: 'font-malibu text-[length:max(40*var(--m),64*var(--u))] leading-[1.21875] font-normal',
  ready: 'font-malibu text-[length:max(44*var(--m),80*var(--u))] leading-[1.325] font-normal',
  featureTitle: 'font-malibu text-[length:max(36*var(--m),64*var(--u))] leading-[1.40625] font-normal',
  kitchenTitle: 'font-malibu text-[length:max(36*var(--m),64*var(--u))] leading-[1.15625] font-normal',
  h2: 'font-malibu text-[length:max(34*var(--m),56*var(--u))] leading-[1.25] font-normal',
  h3: 'font-malibu text-[length:max(28*var(--m),36*var(--u))] leading-[1.5] font-normal',
  lead: 'text-[length:max(18*var(--m),24*var(--u))] leading-normal font-medium',
  heroLead: 'text-[length:max(17*var(--m),20*var(--u))] leading-normal font-medium',
  body: 'text-[length:max(16*var(--m),20*var(--u))] leading-normal font-medium',
}

export const GAP = {
  30: 'gap-[max(20*var(--m),30*var(--u))]',
  40: 'gap-[max(24*var(--m),40*var(--u))]',
  60: 'gap-[max(32*var(--m),60*var(--u))]',
  80: 'gap-[max(40*var(--m),80*var(--u))]',
}
