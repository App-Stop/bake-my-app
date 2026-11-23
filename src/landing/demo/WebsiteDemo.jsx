import { useLayoutEffect, useRef, useState } from 'react'
import { INITIAL_STATE } from './useDemoState.js'
import { DESKTOP_WIDTH } from '../../preview/DesktopScreen'
import { getStoreSummary } from '../../preview/storeSummary'
import { WebsiteStorefront } from './WebsiteStorefront'
import { DemoBar, DemoPage } from './DemoShell'
import { BakeryDecorations, CustomizationRail } from '../../components/BakeryBackdrop'
import { brandTheme, setDemoBrandColor, useDemoBrand } from './demoBrand'
import { usePreviewDevice } from './demoDevice'

const SUMMARY = getStoreSummary(INITIAL_STATE)

/**
 * Customer website demo (Figma "Landing" 123:3947). The desktop preview fills the viewport with
 * the storefront website — the same screen as the desktop preview, scaled from its design width —
 * under the floating demo bar. Tablet (iPad mini, 261:336–261:4625) and phone (402px, 246:2508–)
 * previews draw the website's own responsive layout inside the device frame.
 */
export function WebsiteDemo() {
  const { viewer, device } = usePreviewDevice()
  const { logo } = useDemoBrand()
  if (viewer === 'desktop' && device === 'desktop') return <DesktopWebsiteDemo />

  return (
    <DemoPage
      title="Bakery customer website demo"
      active="Customer Website"
      top={100}
      height={850}
      screen={(frame, height) => <WebsiteStorefront key={frame} mobile tablet={frame === 'tablet'} summary={SUMMARY} logo={logo} height={height} />}
    />
  )
}

function DesktopWebsiteDemo() {
  const ref = useRef(null)
  const [size, setSize] = useState({ scale: 1, height: 0 })
  const { color, logo } = useDemoBrand()

  useLayoutEffect(() => {
    const el = ref.current
    const update = () => {
      const scale = el.clientWidth / DESKTOP_WIDTH
      setSize({ scale, height: el.clientHeight / scale })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden bg-primary-light font-sans text-ink [--d:min(1px,calc(100vw/1920),calc(100dvh/1174))]">
      <BakeryDecorations />
      <CustomizationRail color={color} onChange={setDemoBrandColor} />
      <h1 className="sr-only">Bakery customer website demo</h1>
      <div
        ref={ref}
        className="brand-scope absolute top-[calc(100*var(--d))] left-1/2 z-10 h-[calc(850*var(--d))] w-[calc(1382*var(--d))] -translate-x-1/2 overflow-hidden rounded-[calc(32*var(--d))] bg-white shadow-[0_calc(3.2*var(--d))_calc(24*var(--d))_rgba(0,0,0,0.1)]"
        style={brandTheme(color)}
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${size.scale})` }}>
          {size.height > 0 && <WebsiteStorefront summary={SUMMARY} logo={logo} height={size.height} />}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-[calc(40*var(--d))] z-30 flex justify-center">
        <div className="pointer-events-auto">
          <DemoBar active="Customer Website" />
        </div>
      </div>
    </div>
  )
}
