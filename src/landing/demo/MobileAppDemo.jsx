import { useRef } from 'react'
import { INITIAL_STATE } from '../../onboarding/useOnboardingState'
import { HomeScreen } from '../../preview/HomeScreen'
import { getStoreSummary } from '../../preview/storeSummary'
import { asset } from '../styles'
import { useDemoBrand } from './demoBrand'
import { DemoPage } from './DemoShell'
import { useScaleTo } from './demoScale'

const SUMMARY = getStoreSummary(INITIAL_STATE)

// The storefront phone renders at 241.2 wide (60% of the 402 iPhone); the demo shows it at 402.
const PHONE_WIDTH = 241.2

/** iPhone with a 10px lavender bezel; the storefront home screen is scaled to fill it. */
function DemoPhone() {
  const ref = useRef(null)
  const scale = useScaleTo(ref, PHONE_WIDTH)
  const { logo } = useDemoBrand()

  return (
    <div
      ref={ref}
      className="brand-scope relative h-[calc(874*var(--d))] w-[calc(402*var(--d))] shrink-0 overflow-clip rounded-[calc(60*var(--d))] border-[calc(10*var(--d))] border-primary-light bg-white"
    >
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        <HomeScreen summary={SUMMARY} logo={logo} mark={asset('demo/logo-mark.svg')} address="742 Evergreen Terrace, Texas" />
      </div>
    </div>
  )
}

/** Customer mobile app demo (Figma "Landing", 1920×1174). */
export function MobileAppDemo() {
  return (
    <DemoPage title="Bakery customer app demo" active="Customer Mobile App" top={74} height={874}>
      <DemoPhone />
    </DemoPage>
  )
}
