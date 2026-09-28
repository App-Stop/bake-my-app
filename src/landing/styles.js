/** Files exported from Figma live in public/landing/. */
export const asset = (name) => `${import.meta.env.BASE_URL}landing/${name}`

/*
 * Fluid scale: every value equals the Figma size at 1920px wide and shrinks with the viewport
 * (px / 19.2 = vw, or `n * var(--u)`) down to a readable floor. Kept as literal strings so
 * Tailwind can see them.
 */
export const PAGE_X = 'px-[clamp(20px,7.292vw,140px)]'
export const CONTAINER = `mx-auto w-full max-w-[1920px] ${PAGE_X}`

export const TYPE = {
  display: 'font-malibu text-[clamp(44px,5vw,96px)] leading-[1.1042] font-normal',
  h2: 'font-malibu text-[clamp(36px,3.333vw,64px)] leading-[1.1563] font-normal',
  h3: 'font-malibu text-[clamp(32px,2.5vw,48px)] leading-[1.125] font-normal',
  lead: 'text-[clamp(18px,1.25vw,24px)] leading-normal font-medium',
  body: 'text-[clamp(16px,1.042vw,20px)] leading-normal font-medium',
}

export const GAP = {
  30: 'gap-[clamp(20px,1.563vw,30px)]',
  40: 'gap-[clamp(24px,2.083vw,40px)]',
  60: 'gap-[clamp(32px,3.125vw,60px)]',
  80: 'gap-[clamp(40px,4.167vw,80px)]',
}
