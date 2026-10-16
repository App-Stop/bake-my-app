import { ROUTES } from '../router'
import { DemoPill, Pill } from './ui'
import { GAP, TYPE } from './styles'
import { SiteNav } from './SiteNav'

/** Destination for every "Get your …" CTA until checkout/onboarding for real customers exists. */
export function ComingSoonPage() {
  return (
    <div className="landing-page flex min-h-full flex-col bg-primary font-sans text-white">
      <header className="h-[max(90*var(--m),90*var(--u))]">
        <SiteNav forceDark />
      </header>

      <main className={`flex flex-1 flex-col items-center justify-center px-5 py-20 text-center ${GAP[30]}`}>
        <h1 className={TYPE.display}>
          fresh out
          <br />
          of the oven soon
        </h1>
        <div className={`flex max-w-[calc(760*var(--px))] flex-col items-center ${GAP[40]}`}>
          <p className={TYPE.lead}>
            We&apos;re putting the finishing touches on getting your own branded app. In the meantime, take the full
            demo for a spin.
          </p>
          <div className={`flex flex-wrap items-center justify-center ${GAP[30]}`}>
            <DemoPill variant="white" size="lg" />
            <Pill to={ROUTES.home} variant="glass" size="lg">
              Back to home
            </Pill>
          </div>
        </div>
      </main>
    </div>
  )
}
