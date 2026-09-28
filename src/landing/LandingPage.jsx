import { BusinessTools } from './sections/BusinessTools'
import { Footer, Ready } from './sections/Closing'
import { Customize } from './sections/Customize'
import { Faq } from './sections/Faq'
import { Features } from './sections/Features'
import { Hero } from './sections/Hero'
import { Pricing } from './sections/Pricing'
import { Solutions } from './sections/Solutions'
import { Values } from './sections/Values'

/** Marketing landing page at "/" — built from the Figma "Landing" frame (1920 wide). */
export function LandingPage() {
  return (
    <div className="landing-page min-w-80 overflow-x-clip bg-white font-sans text-ink">
      <Hero />
      <main>
        <Solutions />
        <BusinessTools />
        <Features />
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
