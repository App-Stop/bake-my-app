import { useEffect } from 'react'
import { BusinessTools } from './sections/BusinessTools'
import { Footer, Ready } from './sections/Closing'
import { CostCalculator } from './sections/CostCalculator'
import { Customize } from './sections/Customize'
import { Faq } from './sections/Faq'
import { Features } from './sections/Features'
import { FreeMonth } from './sections/FreeMonth'
import { Hero } from './sections/Hero'
import { Pricing } from './sections/Pricing'
import { Solutions } from './sections/Solutions'
import { Values } from './sections/Values'
import { useModals } from './useModals'

const PROMO_SEEN_KEY = 'bma-promo-seen'
const SCROLL_THRESHOLD = 300

/** Shows the first-month-free popup once per browser session after some scrolling has been done. */
function usePromoOnScroll() {
  const { openPromo } = useModals()
  useEffect(() => {
    try {
      if (sessionStorage.getItem(PROMO_SEEN_KEY)) return
    } catch {
      // Storage unavailable (private mode): proceed with in-memory check.
    }

    let triggered = false

    const handleScroll = () => {
      if (triggered) return
      if (window.scrollY > SCROLL_THRESHOLD) {
        triggered = true
        try {
          sessionStorage.setItem(PROMO_SEEN_KEY, '1')
        } catch {
          // ignore
        }
        window.removeEventListener('scroll', handleScroll)
        openPromo()
      }
    }

    if (window.scrollY > SCROLL_THRESHOLD) {
      handleScroll()
      return
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [openPromo])
}

/** Marketing landing page at "/" — built from the Figma "Landing" frame (1920 wide). */
export function LandingPage() {
  usePromoOnScroll()
  return (
    <div className="landing-page min-w-80 overflow-x-clip bg-white font-sans text-ink">
      <Hero />
      <main>
        <Solutions />
        <BusinessTools />
        <Features />
        <FreeMonth />
        <Customize />
        <Values />
        <CostCalculator />
        <Pricing />
        <Faq />
        <Ready />
      </main>
      <Footer />
    </div>
  )
}
