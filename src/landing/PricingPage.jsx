import { useId, useState } from 'react'
import { Link } from '../components/Link'
import { DEFAULT_TRIAL_DAYS, formatMoney, planHref, priceForInterval, usePlans } from '../lib/plans'
import { ROUTES } from '../router'
import { SiteNav } from './SiteNav'
import { Footer } from './sections/Closing'
import { ContactExpert, Pricing } from './sections/Pricing'
import { asset } from './styles'

const COMPARISON = [
  ['Locations', '1', 'Up to 3', 'Unlimited'],
  ['Branded ordering website', true, true, true],
  ['Kitchen order station', true, true, true],
  ['Your own iOS and Android app', '—', true, true],
  ['Loyalty points', 'Basic', 'Custom tiers and perks', 'Custom tiers and perks'],
  ['SMS promotions', '—', true, true],
  ['POS integration', '—', true, true],
  ['Analytics', 'Basic dashboard', 'Full live analytics', 'Branch-by-branch'],
  ['Catering and wholesale orders', '—', '—', true],
  ['Support', 'Standard', 'Priority', 'Dedicated manager'],
  ['Commission and setup', '0% · free', '0% · free', '0% · free'],
]

// [key, name, fallback per-month price on yearly billing, note]
const PLANS = [
  ['startup', 'Startup', 99, ''],
  ['growth', 'Growth', 249, ' · most popular'],
  ['business_suite', 'Business Suite', null, ''],
]

/** Header price: the API's yearly per-month figure when loaded, the typed one otherwise. */
function headerPrice(plans, key, fallback) {
  if (fallback == null) return 'from $499/mo'
  const year = priceForInterval(plans, key, 'year')
  return `${year ? formatMoney(year.monthlyEquivalent, year.currency) : `$${fallback}`}/mo`
}

/** Trial length used in the page copy, from the Growth yearly price. */
const trialDaysOf = (plans) => priceForInterval(plans, 'growth', 'year')?.trialDays ?? DEFAULT_TRIAL_DAYS

function CellValue({ value }) {
  if (value === true) {
    return <img src={asset('pricing-page/check.svg')} alt="Included" width={22} height={22} className="h-[calc(22*var(--u))] w-[calc(22*var(--u))]" />
  }
  return <span>{value}</span>
}

function ComparePlans({ planState }) {
  return (
    <section aria-labelledby="compare-title" className="mx-auto h-[calc(967*var(--u))] w-full max-w-[calc(1920*var(--u))] px-[calc(160*var(--u))]">
      <h2 id="compare-title" className="text-center font-malibu text-[length:calc(36*var(--u))] leading-[calc(54*var(--u))] text-primary">
        compare plans at a glance
      </h2>
      <div className="mt-[calc(40*var(--u))] overflow-hidden rounded-[calc(24*var(--u))] border border-line bg-white">
        <div className="grid h-[calc(100*var(--u))] grid-cols-[35%_21.666%_21.666%_21.668%] bg-primary-light text-[length:calc(16*var(--u))] leading-normal text-ink">
          <div className="flex items-center px-[calc(32*var(--u))] font-semibold">Features</div>
          {PLANS.map(([key, name, fallback, note]) => (
            <div key={key} className="flex flex-col items-center justify-center gap-[calc(4*var(--u))] text-center">
              <strong className="text-[length:calc(18*var(--u))]">{name}</strong>
              <span className="text-[length:calc(14*var(--u))] opacity-70">{headerPrice(planState.plans, key, fallback)}{note}</span>
            </div>
          ))}
        </div>
        {COMPARISON.map(([feature, ...values]) => (
          <div key={feature} className="grid h-[calc(61*var(--u))] grid-cols-[35%_21.666%_21.666%_21.668%] border-t border-line text-[length:calc(16*var(--u))] leading-normal text-ink">
            <div className="flex items-center px-[calc(32*var(--u))] font-medium">{feature}</div>
            {values.map((value, index) => (
              <div key={index} className={`flex items-center justify-center text-center ${index === 1 ? 'bg-primary-light/55' : ''}`}>
                <CellValue value={value} />
              </div>
            ))}
          </div>
        ))}
        <div className="grid h-[calc(101*var(--u))] grid-cols-[35%_21.666%_21.666%_21.668%] border-t border-line">
          <div />
          <CompareCta to={planHref(planState, 'startup', 'year')} label="Start for Free" />
          <CompareCta to={planHref(planState, 'growth', 'year')} label="Start for Free" primary />
          <CompareCta to={ROUTES.contact} label="Get a quote" />
        </div>
      </div>
    </section>
  )
}

function CompareCta({ to, label, primary = false }) {
  return (
    <div className={`flex items-center justify-center ${primary ? 'bg-primary-light/55' : ''}`}>
      <Link
        to={to}
        className={`flex h-[calc(64*var(--u))] w-[calc(282*var(--u))] items-center justify-center gap-[calc(10*var(--u))] rounded-full text-[length:calc(16*var(--u))] font-semibold ${primary ? 'bg-primary text-white' : 'border border-primary text-primary'}`}
      >
        {label}
        <img src={asset(primary ? 'pricing-page/arrow-white.svg' : 'pricing-page/arrow-outline.svg')} alt="" width={24} height={24} className="h-[calc(24*var(--u))] w-[calc(24*var(--u))]" />
      </Link>
    </div>
  )
}

const STEPS = [
  ['1', 'Pick your plan', (trialDays) => `Start on Startup or Growth today with a ${trialDays}-day free trial. Cancel anytime before it ends.`],
  ['2', 'Send us your menu', 'Share your menu, logo and photos. We build your website, apps and kitchen screen for you.'],
  ['3', 'Go live and keep 100%', 'We publish to the App Store and Google Play. Customers order direct and you keep every dollar.'],
]

function GetStarted({ planState }) {
  const trialDays = trialDaysOf(planState.plans)
  return (
    <section aria-labelledby="steps-title" className="mx-auto flex h-[calc(545*var(--u))] w-full max-w-[calc(1920*var(--u))] flex-col items-center px-[calc(160*var(--u))]">
      <h2 id="steps-title" className="font-malibu text-[length:calc(56*var(--u))] leading-[calc(71*var(--u))] text-primary">live in 3 easy steps</h2>
      <p className="mt-[calc(12*var(--u))] text-[length:calc(18*var(--u))] leading-normal text-ink">No developers, no new hardware. We do the techy part.</p>
      <div className="mt-[calc(48*var(--u))] grid h-[calc(248*var(--u))] w-full grid-cols-3 gap-[calc(24*var(--u))]">
        {STEPS.map(([number, title, copy]) => (
          <article key={number} className="flex flex-col gap-[calc(16*var(--u))] rounded-[calc(32*var(--u))] bg-primary-light p-[calc(32*var(--u))]">
            <p className="font-malibu text-[length:calc(56*var(--u))] leading-normal text-primary">{number}</p>
            <h3 className="text-[length:calc(22*var(--u))] leading-normal font-bold text-ink">{title}</h3>
            <p className="text-[length:calc(16*var(--u))] leading-[1.5] text-[#68667b]">{typeof copy === 'function' ? copy(trialDays) : copy}</p>
          </article>
        ))}
      </div>
      <div className="mt-[calc(48*var(--u))] flex flex-col items-center gap-[calc(12*var(--u))]">
        <div className="flex gap-[calc(16*var(--u))]">
          <Link to={planHref(planState, 'growth', 'year')} className="flex items-center gap-[calc(8*var(--u))] rounded-full bg-primary px-[calc(32*var(--u))] py-[calc(16*var(--u))] text-[length:calc(16*var(--u))] font-semibold text-white">
            Start for Free <img src={asset('pricing-page/arrow-small-white.svg')} alt="" width={20} height={20} className="h-[calc(20*var(--u))] w-[calc(20*var(--u))]" />
          </Link>
          <Link to={ROUTES.demoMobile} className="flex items-center gap-[calc(8*var(--u))] rounded-full border-[1.5px] border-primary px-[calc(32*var(--u))] py-[calc(16*var(--u))] text-[length:calc(16*var(--u))] font-semibold text-primary">
            Try a live bakery app <img src={asset('pricing-page/arrow-small-purple.svg')} alt="" width={20} height={20} className="h-[calc(20*var(--u))] w-[calc(20*var(--u))]" />
          </Link>
        </div>
        <p className="text-[length:calc(13*var(--u))] text-[#68667b]">{trialDays}-day free trial. Cancel anytime.</p>
      </div>
    </section>
  )
}

const FAQS = [
  ['Is setup really free?', 'Yes. We build your website, apps and kitchen screen and submit them to the App Store and Google Play at no extra cost. You only pay your monthly plan.'],
  ['What happens after my free month?', 'Your selected plan begins automatically. We will remind you before billing starts, and you can cancel at any time.'],
  ['Do you take a cut of my orders?', 'No. Bake my App charges 0% commission, so every dollar from every direct order stays with you.'],
  ['Can I switch plans or cancel anytime?', 'Yes. You can move between plans or cancel whenever you need, without long-term contracts.'],
  ['I have more than one location. Which plan fits?', 'Growth supports up to three locations. Business Suite is designed for larger groups and unlimited locations.'],
]

function PricingFaqItem({ item, open, onToggle }) {
  const answerId = useId()
  return (
    <button type="button" aria-expanded={open} aria-controls={answerId} onClick={onToggle} className={`flex w-full items-start gap-[calc(20*var(--u))] rounded-[calc(40*var(--u))] bg-primary-light p-[calc(30*var(--u))] text-left ${open ? 'h-[calc(142*var(--u))]' : 'h-[calc(92*var(--u))]'}`}>
      <span className="flex min-w-0 flex-1 flex-col gap-[calc(10*var(--u))] text-ink">
        <strong className="text-[length:calc(16*var(--u))] leading-normal">{item[0]}</strong>
        {open && <span id={answerId} className="text-[length:calc(16*var(--u))] leading-[1.5] opacity-80">{item[1]}</span>}
      </span>
      <img src={asset(open ? 'pricing-page/faq-close.svg' : 'pricing-page/faq-plus.svg')} alt="" width={20} height={20} className="h-[calc(20*var(--u))] w-[calc(20*var(--u))] shrink-0" />
    </button>
  )
}

function PricingFaq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="mx-auto grid h-[calc(590*var(--u))] w-full max-w-[calc(1920*var(--u))] grid-cols-[630fr_900fr] gap-[calc(70*var(--u))] px-[calc(160*var(--u))]">
      <div className="flex flex-col gap-[calc(60*var(--u))] text-ink">
        <div className="flex flex-col gap-[calc(10*var(--u))]">
          <h2 className="font-malibu text-[length:calc(36*var(--u))] leading-[calc(50*var(--u))]">frequently baked questions</h2>
          <p className="text-[length:calc(20*var(--u))] leading-[1.6] font-medium">Straight answers on plans, billing and getting started.</p>
        </div>
        <div className="flex flex-col items-start gap-[calc(20*var(--u))]">
          <p className="text-[length:calc(20*var(--u))] leading-[1.6] font-medium">Need to know something else?</p>
          <Link to={ROUTES.contact} className="flex items-center gap-[calc(10*var(--u))] rounded-full border border-white bg-primary-light px-[calc(40*var(--u))] py-[calc(20*var(--u))] text-[length:calc(20*var(--u))] font-semibold">
            Contact Us <img src={asset('pricing-page/arrow-contact.svg')} alt="" width={32} height={32} className="h-[calc(32*var(--u))] w-[calc(32*var(--u))]" />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-[calc(20*var(--u))]">
        {FAQS.map((item, index) => <PricingFaqItem key={item[0]} item={item} open={open === index} onToggle={() => setOpen(open === index ? -1 : index)} />)}
      </div>
    </section>
  )
}

export function PricingPage() {
  const planState = usePlans()
  return (
    <div className="landing-page min-w-80 overflow-x-clip bg-white font-sans text-ink">
      <SiteNav forceLight />
      <main className="flex flex-col gap-[calc(140*var(--u))] pt-[calc(134*var(--u))]">
        <Pricing standalone showExpert={false} />
        <ComparePlans planState={planState} />
        <GetStarted planState={planState} />
        <div className="mx-auto h-[calc(211.2*var(--u))] w-full max-w-[calc(1920*var(--u))] px-[calc(160*var(--u))]">
          <ContactExpert mascot="pricing-page/expert-mascot.svg" />
        </div>
        <PricingFaq />
      </main>
      {/* The export is the Figma group before its vertical flip: purple wave rising into the footer. */}
      <div className="mt-[calc(6*var(--u))]">
        <img src={asset('pricing-page/footer-wave.svg')} alt="" aria-hidden="true" width={1920} height={371} className="block h-auto w-full max-w-none -scale-y-100" />
      </div>
      <Footer figmaPricingAssets />
    </div>
  )
}
