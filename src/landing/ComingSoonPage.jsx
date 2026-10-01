import { Link } from '../components/Link'
import { ROUTES } from '../router'
import { Pill } from './ui'
import { GAP, TYPE, asset } from './styles'

/** Destination for every "Get your …" CTA until checkout/onboarding for real customers exists. */
export function ComingSoonPage() {
  return (
    <div className="landing-page flex min-h-full flex-col bg-primary font-sans text-white">
      <header className="flex justify-center px-5 pt-2.5">
        <div className="flex w-[min(calc(1211*var(--px)),100%)] items-center justify-between rounded-[calc(60*var(--px))] bg-[rgba(45,45,45,0.1)] px-5 py-[calc(15*var(--px))] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]">
          <Link to={ROUTES.home} aria-label="Back to Bake my App home" className="shrink-0">
            <img src={asset('logo-nav.svg')} alt="Bake my App" width={111} height={51} className="h-[calc(51*var(--px))] w-[calc(111*var(--px))]" />
          </Link>
          <Link to={ROUTES.home} className="text-base leading-normal font-medium transition-opacity hover:opacity-75">
            Back to home
          </Link>
        </div>
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
            <Pill to={ROUTES.app} variant="white" size="lg" arrow>
              Launch Demo
            </Pill>
            <Pill to={ROUTES.home} variant="glass" size="lg">
              Back to home
            </Pill>
          </div>
        </div>
      </main>
    </div>
  )
}
