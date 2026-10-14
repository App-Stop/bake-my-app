import { useEffect } from 'react'
import { BusinessTools } from './sections/BusinessTools'
import { Footer, Ready } from './sections/Closing'
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

/** Shows the first-month-free popup once per browser session, when the landing page loads. */
function usePromoOnLoad() {
  const { openPromo } = useModals()
  useEffect(() => {
    try {
      if (sessionStorage.getItem(PROMO_SEEN_KEY)) return
      sessionStorage.setItem(PROMO_SEEN_KEY, '1')
    } catch {
      // Storage unavailable (private mode): just show it.
    }
    openPromo()
  }, [openPromo])
}

/** Marketing landing page at "/" — built from the Figma "Landing" frame (1920 wide). */
export function LandingPage() {
  usePromoOnLoad()
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
        <Pricing />
        <Faq />
        <Ready />
      </main>
      <Footer />
    </div>
  )
}
