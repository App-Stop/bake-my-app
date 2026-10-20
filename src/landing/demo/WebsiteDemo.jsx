import { useLayoutEffect, useRef, useState } from 'react'
import { INITIAL_STATE } from '../../onboarding/useOnboardingState'
import { DESKTOP_WIDTH, DesktopScreen } from '../../preview/DesktopScreen'
import { getStoreSummary } from '../../preview/storeSummary'
import { DemoBar } from './DemoShell'
import { BakeryDecorations, CustomizationRail } from '../../components/BakeryBackdrop'
import { readableTextOn } from '../../lib/color'

const SUMMARY = getStoreSummary(INITIAL_STATE)

/**
 * Customer website demo (Figma "Landing" 123:3947): the storefront website fills the viewport —
 * the same screen as the desktop preview, scaled from its 641.2px design width — with the demo bar
 * floating over it.
 */
export function WebsiteDemo() {
  const ref = useRef(null)
  const [size, setSize] = useState({ scale: 1, height: 0 })
  const [brandColor, setBrandColor] = useState('#554cf1')

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
    <div
      className="brand-scope fixed inset-0 overflow-hidden bg-primary-light font-sans text-ink [--d:min(1px,calc(100vw/1920),calc(100dvh/1174))]"
      style={{
        '--brand': brandColor,
        '--brand-light': `color-mix(in oklab, ${brandColor} 8%, white)`,
        '--on-brand': readableTextOn(brandColor),
        '--color-primary': brandColor,
        '--color-primary-light': `color-mix(in oklab, ${brandColor} 8%, white)`,
      }}
    >
      <BakeryDecorations />
      <CustomizationRail color={brandColor} onChange={setBrandColor} />
      <h1 className="sr-only">Bakery customer website demo</h1>
      <div
        ref={ref}
        className="absolute top-[calc(100*var(--d))] left-1/2 z-10 h-[calc(850*var(--d))] w-[calc(1382*var(--d))] -translate-x-1/2 overflow-hidden rounded-[calc(32*var(--d))] bg-white shadow-[0_calc(3.2*var(--d))_calc(24*var(--d))_rgba(0,0,0,0.1)]"
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${size.scale})` }}>
          {size.height > 0 && <DesktopScreen summary={SUMMARY} height={size.height} framed={false} />}
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
