import { useState } from 'react'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { MinusSignIcon } from '@hugeicons/core-free-icons'
import { ArrowIcon, CheckCircle, Icon } from '../ui'
import { CONTAINER, GAP, TYPE, asset } from '../styles'

const FEATURES = [
  'Custom font, images, logo, theme',
  'Order tracking, and updates to customers',
  'AI based offers & rewards system',
  'Integration with your existing POS',
  'Customizable banners & popups',
  'SEO and enhanced suggestions',
  'Inventory & orders management ',
  'Loyalty wallet and rewards system',
  'Hosted directly to your domain',
  'Customizable upsells and featured items',
]

/*
 * First month free on the Startup and Growth plans: `regular` is the struck-through price per
 * billing period (yearly saves 50%), with `strike` the Figma strike-through line drawn over it.
 */
const PLANS = [
  {
    name: 'Startup',
    description: 'Ideal for neighborhood bakeries launching direct digital pre-orders and pickup.',
    regular: { yearly: 89, monthly: 178 },
    strike: 'pricing/strike-89.svg',
    cta: 'Start for Free',
    features: FEATURES,
    included: 5,
    more: { label: 'Learn more', tone: 'text-ink' },
  },
  {
    name: 'Growth',
    description: 'More customized and scaled up to match your growing cafe business',
    regular: { yearly: 149, monthly: 298 },
    strike: 'pricing/strike-149.svg',
    cta: 'Start for Free',
    features: FEATURES,
    included: 8,
    more: { label: 'See all 45+ features', tone: 'text-primary' },
    featured: true,
  },
  {
    name: 'Business Suite',
    description: 'For artisan bakery groups, multi-location cafes, and commissary roasteries.',
    price: '$$$',
    priceNote: 'You decide the price',
    cta: 'Get a quote',
    // Same list, ordered as in the design, with everything included.
    features: [0, 1, 5, 2, 3, 4, 6, 8, 7, 9].map((i) => FEATURES[i]),
    included: 10,
    more: { label: 'See all 66+ features', tone: 'text-primary' },
  },
]

const BILLING = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly', badge: 'save 50%' },
]

function BillingToggle({ billing, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="flex w-[min(calc(460*var(--px)),100%)] items-center rounded-full bg-surface p-1"
    >
      {BILLING.map(({ key, label, badge }) => {
        const active = billing === key
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(key)}
            className={`flex min-w-px flex-1 items-center justify-center gap-1.5 rounded-[calc(60*var(--px))] px-3 py-4 text-[length:max(18*var(--m),20*var(--u))] leading-normal whitespace-nowrap transition ${
              active ? 'bg-primary font-semibold text-white' : 'font-medium text-body hover:text-ink'
            }`}
          >
            {label}
            {badge && (
              <span
                className={`rounded-[calc(20*var(--px))] px-3 py-1 font-malibu text-xs tracking-[calc(0.24*var(--px))] ${
                  active ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

const PRICE = 'font-malibu text-[length:max(48*var(--m),64*var(--u))] whitespace-nowrap'

function PlanPrice({ plan, billing }) {
  const { featured, regular } = plan
  if (!regular) {
    return (
      <div className="relative flex flex-col leading-normal">
        <p className={`${PRICE} text-ink`}>{plan.price}</p>
        <p className="text-base text-ink opacity-80">{plan.priceNote}</p>
      </div>
    )
  }
  const price = `$${regular[billing]}`
  return (
    <div className="relative flex flex-col leading-normal">
      <div className="flex items-center gap-5">
        <p className={`${PRICE} ${featured ? 'text-primary' : 'text-ink'}`}>FREE</p>
        <p className={`relative ${PRICE} text-dash`}>
          <span className="sr-only">instead of </span>
          {price}
          <img
            src={asset(plan.strike)}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-[calc(50%+3*var(--px))] left-0 h-[calc(4*var(--px))] w-full -translate-y-1/2"
          />
        </p>
        <span className="-ml-0.5 shrink-0 rounded-[calc(4*var(--px))] bg-[#ea0101] px-1 py-0.5 text-[length:calc(10*var(--px))] leading-normal font-bold tracking-[calc(0.6*var(--px))] whitespace-nowrap text-white">
          LIMITED TIME!
        </span>
      </div>
      <p className="text-base text-ink opacity-80">
        For first month, then {price}/mo billed {billing}
      </p>
    </div>
  )
}

function PlanCard({ plan, billing }) {
  const { featured } = plan
  return (
    <div
      className={`relative flex h-full flex-col gap-9 overflow-hidden rounded-[calc(40*var(--px))] bg-white p-[calc(30*var(--px))] shadow-[inset_0_0_0_1px_var(--color-line)]`}
    >
      {featured && (
        // Soft "waves" glow at the top of the featured card (export overflows the card, clipped here).
        <img
          src={asset('pricing-glow.png')}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(-122*var(--u))] left-[-27.43%] h-auto w-[154.69%] max-w-none select-none"
        />
      )}
      <div className="relative flex flex-col gap-2.5 leading-normal text-ink">
        <h3 className="text-[length:max(20*var(--m),24*var(--u))] font-semibold">{plan.name}</h3>
        <p className="text-base opacity-80">{plan.description}</p>
      </div>
      <PlanPrice plan={plan} billing={billing} />
      <Link
        to={plan.regular ? ROUTES.app : ROUTES.comingSoon}
        className={`relative flex w-full items-center justify-center gap-2.5 rounded-full p-5 text-[length:max(18*var(--m),20*var(--u))] leading-normal font-semibold whitespace-nowrap transition ${
          featured
            ? 'bg-primary text-white hover:brightness-110'
            : 'text-primary shadow-[inset_0_0_0_1px_var(--color-primary)] hover:bg-primary-light'
        }`}
      >
        {plan.cta}
        <ArrowIcon className="size-6" />
      </Link>
      <ul className="relative flex flex-col gap-5">
        {plan.features.map((feature, i) => {
          const included = i < plan.included
          return (
            <li key={feature} className="flex items-center gap-2">
              {included ? <CheckCircle /> : <Icon icon={MinusSignIcon} className="size-6 text-subtle" />}
              <span className={`text-base leading-normal font-medium ${included ? 'text-ink' : 'text-subtle'}`}>
                <span className="sr-only">{included ? 'Included: ' : 'Not included: '}</span>
                {feature}
              </span>
            </li>
          )
        })}
      </ul>
      <Link
        to={ROUTES.comingSoon}
        className={`relative flex items-center gap-2.5 self-start py-2.5 text-base leading-normal font-semibold transition-opacity hover:opacity-75 ${plan.more.tone}`}
      >
        {plan.more.label}
        <ArrowIcon className="size-6" />
      </Link>
    </div>
  )
}

/** "Not sure what to choose?" banner under the plans. */
function ContactExpert() {
  return (
    <div className="flex w-full flex-col items-center gap-8 overflow-clip rounded-[calc(40*var(--px))] bg-primary-light p-[calc(30*var(--px))] md:flex-row md:gap-[max(32*var(--m),120*var(--u))]">
      <div className="flex min-w-px flex-1 flex-col items-center gap-[max(20*var(--m),40*var(--u))] sm:flex-row">
        <img
          src={asset('pricing/expert-mascot.svg')}
          alt=""
          aria-hidden="true"
          width={151.2}
          height={151.2}
          className="size-[max(112*var(--m),151.2*var(--u))] shrink-0 select-none"
        />
        <div className="flex min-w-px flex-1 flex-col gap-2.5 text-ink">
          <h3 className="text-[length:max(20*var(--m),24*var(--u))] leading-normal font-bold">Not sure what to choose?</h3>
          <p className="text-[length:max(16*var(--m),20*var(--u))] leading-[1.6] opacity-80">
            Our experts will help you find the right plan for your bakery business, whether you’re just starting out,
            growing, or scaling up. Reach out.
          </p>
        </div>
      </div>
      <Link
        to={ROUTES.comingSoon}
        className="shrink-0 rounded-full bg-primary px-[max(24*var(--m),40*var(--u))] py-[max(14*var(--m),20*var(--u))] text-[length:max(18*var(--m),20*var(--u))] leading-normal font-semibold whitespace-nowrap text-white transition hover:brightness-110"
      >
        Contact an expert
      </Link>
    </div>
  )
}

/** "baked to grow", with the last letters growing (64 → 82px in Figma, all on a 74px line). */
function Title() {
  return (
    <h2 className={TYPE.h2}>
      baked to g<span className="text-[1.09375em]">r</span>
      <span className="text-[1.1875em]">o</span>
      <span className="text-[1.28125em]">w</span>
    </h2>
  )
}

export function Pricing() {
  const [billing, setBilling] = useState('yearly')
  return (
    <section id="pricing" className="mt-[max(80*var(--m),180*var(--u))] scroll-mt-10">
      <div className={`flex flex-col items-center ${GAP[80]} ${CONTAINER}`}>
        <div className={`flex max-w-[calc(878*var(--px))] flex-col items-center text-center text-ink ${GAP[30]}`}>
          <Title />
          <p className={TYPE.body}>
            Free implementation. Fair flat monthly fees. No order commissions, no hidden percentages, and no long-term contracts.
          </p>
        </div>
        <BillingToggle billing={billing} onChange={setBilling} />
        <div className="flex w-full flex-col gap-5">
          <div className="grid w-full grid-cols-1 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-y-5">
            {PLANS.map((plan) => (
              <div key={plan.name} className="relative">
                {plan.featured && (
                  <p className="absolute top-[calc(-24*var(--px))] left-1/2 -translate-x-1/2 rounded-t-[calc(20*var(--px))] bg-primary px-3 pt-1 pb-0.5 font-malibu text-xs leading-normal tracking-[calc(0.24*var(--px))] whitespace-nowrap text-white">
                    MOST POPULAR
                  </p>
                )}
                <PlanCard plan={plan} billing={billing} />
              </div>
            ))}
          </div>
          <ContactExpert />
        </div>
      </div>
    </section>
  )
}
