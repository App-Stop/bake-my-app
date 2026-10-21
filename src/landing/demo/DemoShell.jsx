import { useEffect, useRef, useState } from 'react'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { DEMO_UNIT, useScaleTo } from './demoScale'
import { BakeryDecorations, CustomizationRail } from '../../components/BakeryBackdrop'
import { brandTheme, setDemoBrandColor, useDemoBrand } from './demoBrand'

const DEMO_TABS = [
  { label: 'Customer Mobile App', to: ROUTES.demoMobile },
  { label: 'Customer Website', to: ROUTES.demoWebsite },
  { label: 'Admin Portal', to: ROUTES.demoAdmin },
  { label: 'Staff Portal', to: ROUTES.demoStaff },
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
 * Rounded app window (admin and staff demos), `width` × `height` Figma px. `children` render
 * `contentWidth` px wide (default: the window's width) and are scaled to fit, so an app designed
 * for a wider screen keeps its own layout.
 */
export function DemoWindow({ width, height, contentWidth = width, children }) {
  const ref = useRef(null)
  const scale = useScaleTo(ref, contentWidth)
  return (
    <div
      ref={ref}
      className="relative shrink-0 overflow-clip rounded-[calc(32*var(--d))] bg-surface shadow-[0_calc(3.2*var(--d))_calc(24*var(--d))_rgba(0,0,0,0.1)]"
      style={{ width: `calc(${width} * var(--d))`, height: `calc(${height} * var(--d))` }}
    >
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: contentWidth, height: (height * contentWidth) / width, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

/**
 * A demo frame: `children` (e.g. a phone or app window) placed `top` Figma px down and `height`
 * tall, with the demo bar at its Figma position below.
 */
export function DemoPage({ title, active, top, height, children }) {
  const { color } = useDemoBrand()

  return (
    <div className={`relative flex min-h-dvh flex-col items-center overflow-hidden bg-primary-light px-4 font-sans text-ink ${DEMO_UNIT}`}>
      <BakeryDecorations />
      <CustomizationRail color={color} onChange={setDemoBrandColor} />
      <main className="flex flex-1 flex-col items-center" style={{ marginTop: `calc(${top} * var(--d))` }}>
        <h1 className="sr-only">{title}</h1>
        <div className="brand-scope" style={brandTheme(color)}>
          {children}
        </div>
      </main>
      <div
        className="mb-[calc(40*var(--d))] flex max-w-full justify-center"
        style={{ marginTop: `calc(${BAR_TOP - top - height} * var(--d))` }}
      >
        <DemoBar active={active} />
      </div>
    </div>
  )
}
