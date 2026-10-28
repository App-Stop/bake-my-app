import { ROUTES } from '../router'
import { Pill } from './ui'
import { GAP, TYPE, asset } from './styles'
import { SiteNav } from './SiteNav'

/**
 * Where Stripe returns the visitor once payment details are accepted. It never calls the API to
 * "confirm" anything: the backend hears about the subscription from Stripe directly, sometimes a few
 * seconds after this page opens.
 */
export function CheckoutSuccessPage() {
  return (
    <div className="landing-page flex min-h-full flex-col bg-primary font-sans text-white">
      <header className="h-[max(90*var(--m),90*var(--u))]">
        <SiteNav forceDark />
      </header>

      <main className={`flex flex-1 flex-col items-center justify-center px-5 py-20 text-center ${GAP[30]}`}>
        <img
          src={asset('contact/message-sent.svg')}
          alt=""
          aria-hidden="true"
          width={217}
          height={218}
          className="h-[max(140*var(--m),218*var(--u))] w-auto scale-x-[-1] select-none"
        />
        <h1 className={TYPE.display}>you&apos;re in!</h1>
        <div className={`flex max-w-[calc(760*var(--px))] flex-col items-center ${GAP[40]}`}>
          <p className={TYPE.lead}>
            Thanks for subscribing to Bake My App. Our team will contact you shortly to set up your bakery&apos;s store.
          </p>
          <div className={`flex flex-wrap items-center justify-center ${GAP[30]}`}>
            <Pill to={ROUTES.home} variant="white" size="lg">
              Back to home
            </Pill>
            <Pill to={ROUTES.contact} variant="glass" size="lg">
              Contact us
            </Pill>
          </div>
        </div>
      </main>
    </div>
  )
}
