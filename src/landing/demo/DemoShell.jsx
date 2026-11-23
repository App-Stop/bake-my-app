import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ComputerIcon, SmartPhone01Icon, Tablet01Icon } from '@hugeicons/core-free-icons'
import { Link } from '../../components/Link'
import { GROWTH_CHECKOUT, ROUTES } from '../../router'
import { DEMO_UNIT, useElementSize, useScaleTo } from './demoScale'
import { BakeryDecorations, CustomizationRail, MobileCustomizationBar } from '../../components/BakeryBackdrop'
import { brandTheme, setDemoBrandColor, useDemoBrand } from './demoBrand'
import { DEVICES, usePreviewDevice } from './demoDevice'
import { Icon, StatusBar } from '../../preview/phone'
import { DeviceToggle } from '../../preview/DeviceToggle'
import statusLevels from '../../assets/status-levels.svg'
import './demo-preview-mobile.css'

const DEMO_TABS = [
  { label: 'Customer Website', short: 'Website', to: ROUTES.demoWebsite },
  { label: 'Admin Portal', short: 'Admin', to: ROUTES.demoAdmin },
  { label: 'Staff Portal', short: 'Staff', to: ROUTES.demoStaff },
  { label: 'Customer Mobile App', short: 'Mobile App', to: ROUTES.demoMobile },
]

// Where the bar sits in the 1920×1174 demo frames (76 tall, 40 from the bottom).
const BAR_TOP = 1058

/*
 * Framed previews. Each device draws its content on a canvas of the device's CSS width (iPhone 17
 * Pro 402 × 874, iPad mini 744 × 1133) scaled to the frame, under that device's status bar.
 */
const FRAMES = {
  mobile: { width: 402, height: 874 },
  tablet: { width: 744, height: 1133 },
}
const DEVICE_ICONS = { desktop: ComputerIcon, tablet: Tablet01Icon, mobile: SmartPhone01Icon }
const DEVICE_LABELS = { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' }

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

/** Desktop demo bar's device switch, drawn in Figma px like the rest of the bar. */
function BarDeviceToggle({ devices }) {
  const { device, options, setDevice } = usePreviewDevice(devices)
  if (options.length < 2) return null
  return (
    <div role="tablist" aria-label="Preview device" className={`h-[calc(76*var(--d))] shrink-0 gap-[calc(4*var(--d))] ${BAR_PILL}`}>
      {options.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={device === id}
          aria-label={`${DEVICE_LABELS[id]} preview`}
          title={`${DEVICE_LABELS[id]} preview`}
          onClick={() => setDevice(id)}
          className={`flex h-full w-[calc(64*var(--d))] items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
            device === id ? 'bg-primary-light text-primary' : 'text-ink hover:bg-surface'
          }`}
        >
          <Icon icon={DEVICE_ICONS[id]} size={24} className="size-[calc(24*var(--d))]" />
        </button>
      ))}
    </div>
  )
}

/** Demo switcher + offer bar along the bottom of the demo screens. */
export function DemoBar({ active, devices = DEVICES }) {
  const timeLeft = useMidnightCountdown()

  return (
    <div className="flex max-w-full flex-wrap items-center justify-center gap-[calc(16*var(--d))] drop-shadow-[0_calc(20*var(--d))_calc(30*var(--d))_rgba(0,0,0,0.3)]">
      <Link to={ROUTES.home} className={`h-[calc(76*var(--d))] shrink-0 ${BAR_PILL}`}>
        <span className={`px-[calc(20*var(--d))] py-[calc(10*var(--d))] font-medium text-ink ${BAR_TEXT}`}>Home</span>
      </Link>

      <BarDeviceToggle devices={devices} />

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
          to={GROWTH_CHECKOUT}
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
      <Link to={GROWTH_CHECKOUT}>Continue to Checkout</Link>
    </div>
  </div>
}

/** iPad status bar (time left, levels right), drawn on the 744 × 36 iPad mini canvas. */
function TabletStatusBar() {
  return (
    <div className="flex h-[36px] w-[744px] items-center justify-between px-[15px] pt-[2px]">
      <span className="font-sf text-[16px] leading-none font-semibold text-black">9:41</span>
      <img src={statusLevels} alt="" width={78.8} height={12} className="h-[12px] w-[78.8px]" />
    </div>
  )
}

/** Largest frame of `device` that fits `width` × `height`, never above the device's own size. */
function fitFrame(device, width, height) {
  const frame = FRAMES[device]
  const frameWidth = Math.max(0, Math.min(frame.width, width, (height * frame.width) / frame.height))
  return { width: frameWidth, height: (frameWidth * frame.height) / frame.width }
}

/**
 * An iframe the size of the device canvas with the page's stylesheets mirrored in, so content
 * using viewport breakpoints (`sm:`, `lg:`) lays out for the device rather than the browser
 * window. `children` render into it through a portal and stay in this React tree.
 */
function DeviceViewport({ width, height, style, children }) {
  const [body, setBody] = useState(null)
  const frame = useRef(null)

  useEffect(() => {
    const doc = frame.current?.contentDocument
    if (!doc) return
    doc.open()
    // Phones and tablets overlay their scrollbars, so the preview reserves no width for them.
    doc.write('<!doctype html><html><head><meta charset="utf-8"><style>*{scrollbar-width:none}*::-webkit-scrollbar{display:none}</style></head><body></body></html>')
    doc.close()
    const sync = () => {
      doc.head.querySelectorAll('[data-mirrored]').forEach((node) => node.remove())
      document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
        const copy = node.cloneNode(true)
        copy.setAttribute('data-mirrored', '')
        doc.head.appendChild(copy)
      })
    }
    sync()
    // Development servers add and replace style tags as modules load.
    const observer = new MutationObserver(sync)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true })
    const root = doc.createElement('div')
    root.className = 'demo-viewport-root'
    root.style.height = '100%'
    doc.documentElement.style.height = '100%'
    Object.assign(doc.body.style, { margin: '0', height: '100%', overflow: 'hidden' })
    doc.body.appendChild(root)
    setBody(root)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <iframe ref={frame} title="Device preview" className="block border-0" style={{ width, height }} />
      {body && createPortal(<div className="brand-scope h-full font-sans text-ink" style={style}>{children}</div>, body)}
    </>
  )
}

/**
 * Draws `children(height)` on a `width` px canvas scaled to fill this element; `height` is the
 * canvas height in canvas px, so the content lays out for the frame's actual proportions.
 * `isolate` renders into a device-sized viewport so viewport breakpoints match the device.
 */
function DeviceCanvas({ width, isolate, theme, children }) {
  const ref = useRef(null)
  const size = useElementSize(ref)
  const scale = size.width / width
  const height = size.height / scale
  return (
    <div ref={ref} className="relative overflow-hidden bg-white">
      {size.width > 0 && size.height > 0 && (
        <div className="absolute top-0 left-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
          {isolate ? <DeviceViewport width={width} height={height} style={theme}>{children(height)}</DeviceViewport> : children(height)}
        </div>
      )}
    </div>
  )
}

/**
 * iPhone or iPad mockup sized `width` px wide: the device's status bar above `screen` (a
 * `(device, height) => content` renderer drawn on the device canvas) or, without one, `children`.
 */
function DeviceFrame({ device, color, width, statusBar, screen, isolate, children }) {
  const tablet = device === 'tablet'
  const frame = FRAMES[device]
  // The iPhone status bar is drawn at the 241.2px phone scale, the iPad one at 744px.
  const barScale = tablet ? width / 744 : width / 241.2
  const barHeight = tablet ? 36 * barScale : 34 * barScale
  return (
    <div
      className={`brand-scope demo-mobile-frame ${tablet ? 'demo-tablet-frame' : ''}`}
      style={{ ...brandTheme(color), width, height: (width * frame.height) / frame.width, ...(tablet && { borderRadius: Math.max(14, width * 0.034) }) }}
    >
      {statusBar && (
        <div className="demo-mobile-statusbar" style={{ height: barHeight }}>
          <div style={tablet ? { transform: `scale(${barScale})` } : { width: 241.2, height: 34, transform: `scale(${barScale})` }}>
            {tablet ? <TabletStatusBar /> : <StatusBar />}
          </div>
        </div>
      )}
      <div className="demo-mobile-screen">
        {screen ? <DeviceCanvas width={frame.width} isolate={isolate} theme={brandTheme(color)}>{(height) => screen(device, height)}</DeviceCanvas> : children}
      </div>
    </div>
  )
}

/**
 * Page chrome for visitors on phones and tablets. Every demo sits in the same iPhone mockup as
 * the mobile app, or the matching iPad mockup when Tablet is chosen.
 */
function DevicePage({ title, active, color, device, options, setDevice, statusBar, screen, isolate, children }) {
  const stage = useRef(null)
  const { width, height } = useElementSize(stage)
  // Fit the preview to the space left by the actual controls, including safe areas and text wrapping.
  const frame = fitFrame(device, width, height)

  return <div className="demo-mobile-page" data-device={device}>
    <header className="demo-mobile-header">
      <Link to={ROUTES.home}>Back to Home</Link>
      {options.length > 1 || screen ? <DeviceToggle device={device} onChange={setDevice} options={[...options].reverse()} className="demo-device-toggle" /> : null}
    </header>
    <main ref={stage} className="demo-mobile-stage">
      <h1 className="sr-only">{title}</h1>
      <DeviceFrame device={device} color={color} width={frame.width} statusBar={statusBar} screen={screen} isolate={isolate}>{children}</DeviceFrame>
    </main>
    <footer className="demo-mobile-controls">
      <MobileCustomizationBar color={color} onChange={setDemoBrandColor} />
      <MobileDemoBar active={active} />
    </footer>
  </div>
}

/** Desktop page showing a tablet or phone preview, framed between the top and the demo bar. */
function FramedDesktopPage({ title, active, color, device, devices, statusBar, screen, isolate, children }) {
  const stage = useRef(null)
  const { width, height } = useElementSize(stage)
  const frame = fitFrame(device, width, height)
  return (
    <div className={`fixed inset-0 overflow-hidden bg-primary-light font-sans text-ink ${DEMO_UNIT}`}>
      <BakeryDecorations />
      <CustomizationRail color={color} onChange={setDemoBrandColor} />
      <main ref={stage} className="absolute inset-x-[calc(200*var(--d))] top-[calc(40*var(--d))] bottom-[calc(156*var(--d))] z-10 flex items-center justify-center">
        <h1 className="sr-only">{title}</h1>
        <DeviceFrame device={device} color={color} width={frame.width} statusBar={statusBar} screen={screen} isolate={isolate}>{children}</DeviceFrame>
      </main>
      <div className="pointer-events-none absolute inset-x-4 bottom-[calc(40*var(--d))] z-30 flex justify-center">
        <div className="pointer-events-auto">
          <DemoBar active={active} devices={devices} />
        </div>
      </div>
    </div>
  )
}

/**
 * Rounded app window (admin and staff demos) on the desktop page, `width` × `height` Figma px.
 * `children` render `contentWidth` px wide (default: the window's width) and are scaled to fit, so
 * an app designed for a wider screen keeps its own layout.
 */
export function DemoWindow({ width, height, contentWidth = width, children }) {
  const ref = useRef(null)
  const scale = useScaleTo(ref, contentWidth)

  return (
    <div
      ref={ref}
      className="demo-window relative h-(--h) w-(--w) shrink-0 overflow-clip rounded-[calc(32*var(--d))] bg-surface shadow-[0_calc(3.2*var(--d))_calc(24*var(--d))_rgba(0,0,0,0.1)]"
      style={{ '--w': `calc(${width} * var(--d))`, '--h': `calc(${height} * var(--d))` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: contentWidth, height: (height * contentWidth) / width, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * A demo page. On desktop, `children` (e.g. an app window) sit `top` Figma px down and `height`
 * tall with the demo bar at its Figma position below. Tablet and phone previews draw
 * `screen(device, height)` — or, for single-device demos, `children` — inside a device frame.
 * `devices` lists the previews the demo supports; visitors choose among those their device allows.
 * `isolate` gives framed screens a device-sized viewport, for apps styled with viewport breakpoints.
 */
export function DemoPage({ title, active, top, height, statusBar = true, devices = DEVICES, screen, isolate = false, children }) {
  const { color } = useDemoBrand()
  const { viewer, device, options, setDevice } = usePreviewDevice(devices)
  const framed = { title, active, color, device, statusBar, screen, isolate, children }

  if (viewer !== 'desktop') {
    // Single-device demos keep their own content; the rest frame their screen for the device.
    return <DevicePage {...framed} options={options} setDevice={setDevice} device={devices.length > 1 ? device : 'mobile'} />
  }
  if (device !== 'desktop' && devices.includes('desktop')) return <FramedDesktopPage {...framed} devices={devices} />

  return (
    <div
      className={`relative flex min-h-dvh flex-col items-center overflow-hidden bg-primary-light px-4 font-sans text-ink ${DEMO_UNIT}`}
      style={{ '--top': `calc(${top} * var(--d))`, '--gap': `calc(${BAR_TOP - top - height} * var(--d))` }}
    >
      <BakeryDecorations />
      <CustomizationRail color={color} onChange={setDemoBrandColor} />
      <main className="relative mt-(--top) flex flex-1 flex-col items-center">
        <h1 className="sr-only">{title}</h1>
        <div className="brand-scope" style={brandTheme(color)}>
          {children}
        </div>
      </main>
      <div className="mt-(--gap) mb-[calc(40*var(--d))] flex max-w-full justify-center">
        <DemoBar active={active} devices={devices} />
      </div>
    </div>
  )
}
