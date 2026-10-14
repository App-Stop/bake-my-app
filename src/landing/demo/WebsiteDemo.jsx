import { useLayoutEffect, useRef, useState } from 'react'
import { INITIAL_STATE } from '../../onboarding/useOnboardingState'
import { DESKTOP_WIDTH, DesktopScreen } from '../../preview/DesktopScreen'
import { getStoreSummary } from '../../preview/storeSummary'
import { DemoBar } from './DemoShell'
import { DEMO_UNIT } from './demoScale'

const SUMMARY = getStoreSummary(INITIAL_STATE)

/**
 * Customer website demo (Figma "Landing" 123:3947): the storefront website fills the viewport —
 * the same screen as the desktop preview, scaled from its 641.2px design width — with the demo bar
 * floating over it.
 */
export function WebsiteDemo() {
  const ref = useRef(null)
  const [size, setSize] = useState({ scale: 1, height: 0 })

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
    <div ref={ref} className={`fixed inset-0 overflow-hidden bg-white font-sans text-ink ${DEMO_UNIT}`}>
      <h1 className="sr-only">Bakery customer website demo</h1>
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${size.scale})` }}>
        {size.height > 0 && <DesktopScreen summary={SUMMARY} height={size.height} framed={false} />}
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-[calc(40*var(--d))] flex justify-center">
        <div className="pointer-events-auto">
          <DemoBar active="Customer Website" />
        </div>
      </div>
    </div>
  )
}
