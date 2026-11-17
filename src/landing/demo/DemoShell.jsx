import { useEffect, useRef, useState } from 'react'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { DEMO_UNIT, useElementSize, useIsDesktop, useScaleTo } from './demoScale'
import { BakeryDecorations, CustomizationRail, MobileCustomizationBar } from '../../components/BakeryBackdrop'
import { brandTheme, setDemoBrandColor, useDemoBrand } from './demoBrand'
import './demo-preview-mobile.css'

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
 * Mobile demo switcher and offer bar, shared by the four preview pages.
 */
export function MobileDemoBar({ active }) {
  const timeLeft = useMidnightCountdown()
  const mobileTabs = [DEMO_TABS[3], ...DEMO_TABS.slice(0, 3)]
  return <div className="demo-mobile-bar">
    <nav aria-label="Demos" className="demo-mobile-tabs">
      {mobileTabs.map(tab => <Link key={tab.label} to={tab.to} aria-current={tab.label === active ? 'page' : undefined} aria-label={tab.label}>{tab.short}</Link>)}
    </nav>
    <div className="demo-mobile-offer">
      <div><p><strong>{timeLeft}</strong> <span>REMAINING</span></p><b>1st MONTH FREE</b></div>
      <Link to={ROUTES.checkout}>Continue to Checkout</Link>
    </div>
  </div>
}

/** Shared mobile page chrome. Demo content remains independent of the page layout. */
function MobileDemoPage({ title, active, color, children }) {
  const stage = useRef(null)
  const { width, height } = useElementSize(stage)
  // Fit the preview to the space left by the actual controls, including safe areas and text wrapping.
  const phoneWidth = Math.max(0, Math.min(402, width, height * 402 / 874))

  return <div className="demo-mobile-page">
    <header className="demo-mobile-header"><Link to={ROUTES.home}>Back to Home</Link></header>
    <main ref={stage} className="demo-mobile-stage">
      <h1 className="sr-only">{title}</h1>
      <div className="brand-scope demo-mobile-frame" style={{ ...brandTheme(color), width: phoneWidth, height: phoneWidth * 874 / 402 }}>{children}</div>
    </main>
    <footer className="demo-mobile-controls">
      <MobileCustomizationBar color={color} onChange={setDemoBrandColor} />
      <MobileDemoBar active={active} />
    </footer>
  </div>
}

/**
 * Rounded app window (admin and staff demos), `width` × `height` Figma px. On desktop `children`
 * render `contentWidth` px wide (default: the window's width) and are scaled to fit, so an app
 * designed for a wider screen keeps its own layout. On phones the window fills the space it is
 * given and the existing app renders on a 402 × 874 canvas scaled into the preview frame.
 */
export function DemoWindow({ width, height, contentWidth = width, children }) {
  const ref = useRef(null)
  const desktop = useIsDesktop()
  const scale = useScaleTo(ref, desktop ? contentWidth : 402)

  const content = desktop
    ? { width: contentWidth, height: (height * contentWidth) / width, transform: `scale(${scale})` }
    : { width: 402, height: 874, transform: `scale(${scale})` }

  return (
    <div
      ref={ref}
      className="demo-window relative overflow-clip bg-surface shadow-[0_calc(3.2*var(--d))_calc(24*var(--d))_rgba(0,0,0,0.1)] max-lg:size-full max-lg:rounded-[20px] lg:h-(--h) lg:w-(--w) lg:shrink-0 lg:rounded-[calc(32*var(--d))]"
      style={{ '--w': `calc(${width} * var(--d))`, '--h': `calc(${height} * var(--d))` }}
    >
      <div className="absolute top-0 left-0 origin-top-left" style={content}>
        {children}
      </div>
    </div>
  )
}

/**
 * A demo frame: `children` (e.g. a phone or app window) placed `top` Figma px down and `height`
 * tall, with the demo bar at its Figma position below. Phones use the dedicated mobile page shell.
 */
export function DemoPage({ title, active, top, height, children }) {
  const { color } = useDemoBrand()
  const desktop = useIsDesktop()
  if (!desktop) return <MobileDemoPage title={title} active={active} color={color}>{children}</MobileDemoPage>

  return (
    <div
      className={`relative flex flex-col items-center overflow-hidden bg-primary-light font-sans text-ink max-lg:h-dvh lg:min-h-dvh lg:px-4 ${DEMO_UNIT}`}
      style={{ '--top': `calc(${top} * var(--d))`, '--gap': `calc(${BAR_TOP - top - height} * var(--d))` }}
    >
      <BakeryDecorations />
      <CustomizationRail color={color} onChange={setDemoBrandColor} />
      <main className={`relative flex flex-1 flex-col items-center max-lg:min-h-0 max-lg:w-full max-lg:px-7 max-lg:pt-4 max-lg:pb-5 lg:mt-(--top)`}>
        <h1 className="sr-only">{title}</h1>
        <div className="brand-scope max-lg:flex max-lg:min-h-0 max-lg:w-full max-lg:flex-1 max-lg:items-center max-lg:justify-center" style={brandTheme(color)}>
          {children}
        </div>
      </main>
      <div className="mb-[calc(40*var(--d))] flex max-w-full justify-center max-lg:hidden lg:mt-(--gap)">
        <DemoBar active={active} />
      </div>
    </div>
  )
}
