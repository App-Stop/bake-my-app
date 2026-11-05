import { useRef } from 'react'
import { MobileStorefront } from './MobileStorefront'
import { asset } from '../styles'
import { useDemoBrand } from './demoBrand'
import { DemoPage } from './DemoShell'
import { useScaleTo } from './demoScale'

// The storefront phone renders at 241.2 × 524.4 (60% of the 402 × 874 iPhone) and is scaled up to
// fill the screen inside the bezel.
const PHONE_WIDTH = 241.2
const PHONE_HEIGHT = 524.4

// Demo phone size in Figma px: the screen (inside the bezel) keeps the iPhone's 402:874 ratio.
const BEZEL = 10
const SCREEN_WIDTH = 440
const SCREEN_HEIGHT = (SCREEN_WIDTH * PHONE_HEIGHT) / PHONE_WIDTH
const FRAME_HEIGHT = SCREEN_HEIGHT + 2 * BEZEL
const FRAME_TOP = 40

/** iPhone with a lavender bezel; the storefront home screen is scaled to fill the screen inside it. */
function DemoPhone() {
  const screen = useRef(null)
  // Measured inside the bezel, so the app is never wider (or taller) than the space it's shown in.
  const scale = useScaleTo(screen, PHONE_WIDTH)
  const { logo } = useDemoBrand()

  return (
    <div
      className="brand-scope relative shrink-0 rounded-[calc(68*var(--d))] bg-primary-light"
      style={{
        width: `calc(${SCREEN_WIDTH + 2 * BEZEL} * var(--d))`,
        height: `calc(${FRAME_HEIGHT} * var(--d))`,
        padding: `calc(${BEZEL} * var(--d))`,
      }}
    >
      <div ref={screen} className="relative size-full overflow-clip rounded-[calc(58*var(--d))] bg-white">
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
          <MobileStorefront logo={logo} mark={asset('demo/logo-mark.svg')} />
        </div>
      </div>
    </div>
  )
}

/** Customer mobile app demo (Figma "Landing", 1920×1174). */
export function MobileAppDemo() {
  return (
    <DemoPage title="Bakery customer app demo" active="Customer Mobile App" top={FRAME_TOP} height={FRAME_HEIGHT}>
      <DemoPhone />
    </DemoPage>
  )
}
