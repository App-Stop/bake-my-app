import { useEffect, useRef, useState } from 'react'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { DEMO_UNIT, useElementSize, useIsDesktop, useScaleTo } from './demoScale'
import { BakeryDecorations, CustomizationRail, MobileCustomizationBar } from '../../components/BakeryBackdrop'
import { brandTheme, setDemoBrandColor, useDemoBrand } from './demoBrand'

const DEMO_TABS = [
  { label: 'Customer Website', short: 'Website', to: ROUTES.demoWebsite },
  { label: 'Admin Portal', short: 'Admin', to: ROUTES.demoAdmin },
  { label: 'Staff Portal', short: 'Staff', to: ROUTES.demoStaff },
  { label: 'Customer Mobile App', short: 'Mobile App', to: ROUTES.demoMobile },
]

// Where the bar sits in the 1920×1174 demo frames (76 tall, 40 from the bottom).
const BAR_TOP = 1058

/** Hours and minutes left until local midnight, as "23H 59M" — the offer's daily countdown. */
function useMidnightCountdown() {
  const format = () => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const minutes = Math.max(0, Math.floor((midnight - now) / 60000))
    return `${Math.floor(minutes / 60)}H ${String(minutes % 60).padStart(2, '0')}M`
  }
  const [left, setLeft] = useState(format)
  useEffect(() => {
    const id = setInterval(() => setLeft(format()), 15000)
    return () => clearInterval(id)
  }, [])
  return left
}


const BAR_PILL = 'flex items-center justify-center rounded-[calc(60*var(--d))] bg-white p-[calc(10*var(--d))]'
const BAR_TEXT = 'text-[length:calc(16*var(--d))] leading-normal'

/** Demo switcher + offer bar along the bottom of the demo screens. */
export function DemoBar({ active }) {
  const timeLeft = useMidnightCountdown()

  return (
    <div className="flex max-w-full flex-wrap items-center justify-center gap-[calc(16*var(--d))] drop-shadow-[0_calc(20*var(--d))_calc(30*var(--d))_rgba(0,0,0,0.3)]">
      <Link to={ROUTES.home} className={`h-[calc(76*var(--d))] shrink-0 ${BAR_PILL}`}>
        <span className={`px-[calc(20*var(--d))] py-[calc(10*var(--d))] font-medium text-ink ${BAR_TEXT}`}>Home</span>
      </Link>

      <nav aria-label="Demos" className={`w-[calc(991*var(--d))] max-w-full ${BAR_PILL}`}>
        {DEMO_TABS.map((tab) => {
          const current = tab.label === active
          return (
            <Link
              key={tab.label}
              to={tab.to}
              aria-current={current ? 'page' : undefined}
              className={`flex min-w-px flex-1 items-center justify-center rounded-full px-[calc(20*var(--d))] text-center transition-colors ${BAR_TEXT} ${
                current
                  ? 'bg-primary-light py-[calc(16*var(--d))] font-bold text-primary'
                  : 'py-[calc(10*var(--d))] font-medium text-ink hover:bg-surface'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className={`relative shrink-0 gap-[calc(16*var(--d))] pl-[calc(24*var(--d))] ${BAR_PILL}`}>
        <p className="absolute top-[calc(-22*var(--d))] left-[calc(86*var(--d))] flex items-center justify-center gap-[calc(10*var(--d))] rounded-t-[calc(10*var(--d))] bg-white px-[calc(10*var(--d))] pt-[calc(4*var(--d))] text-[length:calc(12*var(--d))] leading-normal whitespace-nowrap">
          <span className="font-semibold text-body">LIMITED TIME</span>
          <span className="font-bold tracking-[calc(0.24*var(--d))] text-primary">{timeLeft}</span>
        </p>
        <p className={`font-medium whitespace-nowrap text-ink ${BAR_TEXT}`}>1st MONTH FREE</p>
        <Link
          to={ROUTES.checkout}
          className={`shrink-0 rounded-full bg-primary px-[calc(32*var(--d))] py-[calc(16*var(--d))] font-bold whitespace-nowrap text-white transition hover:brightness-110 ${BAR_TEXT}`}
        >
          Continue to Checkout
        </Link>
      </div>
    </div>
  )
}

/**
 * Phone version of the demo bar: a sheet along the bottom of the screen with the demo switcher
 * (scrolls sideways when it doesn't fit) above the offer and checkout button.
 */
export function MobileDemoBar({ active }) {
  const timeLeft = useMidnightCountdown()
  const tabs = useRef(null)

  // Keep the current demo's tab in view when the switcher scrolls.
  useEffect(() => {
    const nav = tabs.current
    const tab = nav?.querySelector('[aria-current="page"]')
    if (tab) nav.scrollLeft = tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2
  }, [active])

  const pill = 'shrink-0 rounded-full px-3.5 py-2 text-[13px] leading-normal whitespace-nowrap transition-colors'

  return (
    <div className="w-full rounded-t-[24px] bg-white px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <nav ref={tabs} aria-label="Demos" className="relative -mx-3 flex gap-1.5 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link to={ROUTES.home} className={`${pill} border border-line font-medium text-ink hover:bg-surface`}>
          Home
        </Link>
        {DEMO_TABS.map((tab) => {
          const current = tab.label === active
          return (
            <Link
              key={tab.label}
              to={tab.to}
              aria-current={current ? 'page' : undefined}
              aria-label={tab.label}
              className={`${pill} ${current ? 'bg-primary-light font-semibold text-primary' : 'bg-surface font-medium text-ink hover:bg-line'}`}
            >
              {tab.short}
            </Link>
          )
        })}
      </nav>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0 leading-tight">
          <p className="text-[13px] font-semibold text-ink">1st MONTH FREE</p>
          <p className="mt-0.5 text-[11px] whitespace-nowrap text-body">
            LIMITED TIME <span className="font-bold tracking-[0.02em] text-primary">{timeLeft}</span>
          </p>
        </div>
        <Link
          to={ROUTES.checkout}
          className="shrink-0 rounded-full bg-primary px-5 py-3 text-sm leading-normal font-bold whitespace-nowrap text-white transition hover:brightness-110"
        >
          Continue to Checkout
        </Link>
      </div>
    </div>
  )
}

/**
 * Rounded app window (admin and staff demos), `width` × `height` Figma px. On desktop `children`
 * render `contentWidth` px wide (default: the window's width) and are scaled to fit, so an app
 * designed for a wider screen keeps its own layout. On phones the window fills the space it is
 * given and the app renders at that size (magnified by `mobileZoom`), so it uses its phone layout.
 */
export function DemoWindow({ width, height, contentWidth = width, mobileZoom = 1, children }) {
  const ref = useRef(null)
  const desktop = useIsDesktop()
  const scale = useScaleTo(ref, contentWidth)
  const size = useElementSize(ref)

  const content = desktop
    ? { width: contentWidth, height: (height * contentWidth) / width, transform: `scale(${scale})` }
    : { width: size.width / mobileZoom, height: size.height / mobileZoom, transform: mobileZoom === 1 ? undefined : `scale(${mobileZoom})` }

  return (
    <div
      ref={ref}
      className="relative overflow-clip bg-surface shadow-[0_calc(3.2*var(--d))_calc(24*var(--d))_rgba(0,0,0,0.1)] max-lg:size-full max-lg:rounded-[20px] lg:h-(--h) lg:w-(--w) lg:shrink-0 lg:rounded-[calc(32*var(--d))]"
      style={{ '--w': `calc(${width} * var(--d))`, '--h': `calc(${height} * var(--d))` }}
    >
      <div className="absolute top-0 left-0 origin-top-left" style={content}>
        {(desktop || size.width > 0) && children}
      </div>
    </div>
  )
}

/**
 * A demo frame: `children` (e.g. a phone or app window) placed `top` Figma px down and `height`
 * tall, with the demo bar at its Figma position below. On phones the page is exactly one screen
 * tall: the color bar on top, the demo inset below it, and the mobile demo bar at the bottom.
 */
export function DemoPage({ title, active, top, height, children }) {
  const { color } = useDemoBrand()

  return (
    <div
      className={`relative flex flex-col items-center overflow-hidden bg-primary-light font-sans text-ink max-lg:h-dvh lg:min-h-dvh lg:px-4 ${DEMO_UNIT}`}
      style={{ '--top': `calc(${top} * var(--d))`, '--gap': `calc(${BAR_TOP - top - height} * var(--d))` }}
    >
      <BakeryDecorations />
      <CustomizationRail color={color} onChange={setDemoBrandColor} />
      <div className="relative z-10 w-full px-4 pt-3 lg:hidden">
        <MobileCustomizationBar color={color} onChange={setDemoBrandColor} />
      </div>
      <main className="relative flex flex-1 flex-col items-center max-lg:min-h-0 max-lg:w-full max-lg:px-7 max-lg:pt-4 max-lg:pb-5 lg:mt-(--top)">
        <h1 className="sr-only">{title}</h1>
        <div className="brand-scope max-lg:flex max-lg:min-h-0 max-lg:w-full max-lg:flex-1 max-lg:items-center max-lg:justify-center" style={brandTheme(color)}>
          {children}
        </div>
      </main>
      <div className="relative z-10 w-full lg:hidden">
        <MobileDemoBar active={active} />
      </div>
      <div className="mb-[calc(40*var(--d))] flex max-w-full justify-center max-lg:hidden lg:mt-(--gap)">
        <DemoBar active={active} />
      </div>
    </div>
  )
}
