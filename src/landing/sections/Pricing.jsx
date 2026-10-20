import { useState } from 'react'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { MinusSignIcon } from '@hugeicons/core-free-icons'
import { ArrowIcon, CheckCircle, Deco, Icon } from '../ui'
import { CONTAINER, GAP, TYPE, asset } from '../styles'

const PLANS = [
  {
    name: 'Startup',
    description: 'For a neighborhood bakery that wants to start taking direct orders.',
    rates: { yearly: 99, monthly: 199 },
    alternateRate: 129,
    limited: true,
    cta: 'Start for Free',
    features: [
      '1 location',
      'Branded ordering website on your own domain',
      'Kitchen order station that runs on any iPad, Android tablet or touch monitor',
      'Apple Pay and Google Pay checkout',
      'Basic loyalty points',
      'Order confirmations and receipts',
      'Basic sales dashboard',
      '0% commission and free setup',
      'First month free on yearly billing',
    ],
    included: 9,
    more: { label: 'Learn more', tone: 'text-ink' },
  },
  {
    name: 'Growth',
    description: 'For cafes ready for their own app and repeat customers.',
    rates: { yearly: 249, monthly: 349 },
    alternateRate: 299,
    limited: true,
    cta: 'Start for Free',
    features: [
      'Everything in Starter plus',
      'Up to 3 locations',
      'Your own branded iOS and Android app, published for you',
      'Push notifications',
      'Custom loyalty tiers and member perks',
      'SMS promotions and alerts, with a monthly credit bundle',
      'One-tap upsells at checkout',
      'POS integration',
      'Full live analytics: revenue, ticket size and best sellers',
      'Priority support',
    ],
    included: 10,
    more: { label: 'See all 45+ features', tone: 'text-primary' },
    featured: true,
  },
  {
    name: 'Business Suite',
    description: 'For bakery groups, multi-location cafes and commissaries.',
    price: { yearly: 'from $499', monthly: 'from $599' },
    priceSuffix: '/mo',
    priceNote: 'custom quote',
    cta: 'Get a quote',
    features: [
      'Everything in Growth plus',
      'Unlimited locations',
      'Apps with location picker across all branches',
      'Central menu and pricing control for every branch',
      'Catering, wholesale and commissary orders',
      'Branch-by-branch analytics and shift audit logs',
      'Custom integrations',
      'Dedicated account manager',
      'Launch strategy call',
      'Addons',
      'Extra location: $79/mo',
      'Extra SMS credits',
      'Gift cards',
      'Launch marketing kit with in-store QR signage and social graphics',
    ],
    included: 14,
    more: { label: 'See all 66+ features', tone: 'text-primary' },
  },
]

const BILLING = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly', badge: 'save 2 months' },
]

function BillingToggle({ billing, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="flex w-full max-w-[calc(460*var(--px))] items-center rounded-full bg-surface p-1"
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
            className={`flex min-w-px flex-1 flex-wrap items-center justify-center gap-1.5 rounded-[calc(60*var(--px))] px-3 py-4 text-[length:max(18*var(--m),20*var(--u))] leading-normal transition ${
              active ? 'bg-primary font-semibold text-white' : 'font-medium text-body hover:text-ink'
            }`}
          >
            {label}
            {badge && (
              <span
                className={`whitespace-nowrap rounded-[calc(20*var(--px))] px-3 py-1 font-sans text-xs tracking-[calc(0.24*var(--px))] ${
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
  const { featured, rates } = plan
  if (!rates) {
    return (
      <div className="relative flex flex-col leading-normal">
        <div className="flex items-baseline gap-1">
          <p className={`${PRICE} text-ink`}>{plan.price[billing]}</p>
          <span className="text-base text-ink">{plan.priceSuffix}</span>
        </div>
        <p className="text-base text-ink opacity-80">{plan.priceNote}</p>
      </div>
    )
  }
  const price = `$${rates[billing]}`
  return (
    <div className="relative flex flex-col leading-normal">
      <div className="flex items-center gap-2">
        <p className={`${PRICE} ${featured ? 'text-primary' : 'text-ink'}`}>{price}</p>
        <span className="text-base text-ink">/mo</span>
        {plan.limited && (
          <span className="shrink-0 rounded-[calc(4*var(--px))] bg-[#ea0101] px-1 py-0.5 text-[length:calc(10*var(--px))] leading-normal font-bold tracking-[calc(0.6*var(--px))] whitespace-nowrap text-white">
            LIMITED TIME!
          </span>
        )}
      </div>
      <p className="text-base text-ink opacity-80">
        {billing === 'yearly'
          ? `billed yearly, or $${plan.alternateRate} month to month`
          : `billed month to month, or $${plan.rates.yearly}/mo billed yearly`}
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
          src={asset('pricing-glow.webp')}
          alt=""
          aria-hidden="true"
          width={1067}
          height={1078}
          loading="lazy"
          className="pointer-events-none absolute top-[calc(-122*var(--u))] left-[-27.43%] h-auto w-[154.69%] max-w-none select-none"
        />
      )}
      <div className="relative flex flex-col gap-2.5 leading-normal text-ink">
        <h3 className="text-[length:max(20*var(--m),24*var(--u))] font-semibold">{plan.name}</h3>
        <p className="text-base opacity-80">{plan.description}</p>
      </div>
      <PlanPrice plan={plan} billing={billing} />
      <Link
        to={plan.rates ? ROUTES.app : ROUTES.contact}
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
          const isGroupLabel = feature.startsWith('Everything in ')
          return (
            <li key={feature} className="flex items-center gap-2">
              {!isGroupLabel && (included ? <CheckCircle /> : <Icon icon={MinusSignIcon} className="size-6 text-subtle" />)}
              <span className={`text-base leading-normal font-medium ${included ? 'text-ink' : 'text-subtle'}`}>
                {!isGroupLabel && <span className="sr-only">{included ? 'Included: ' : 'Not included: '}</span>}
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
          loading="lazy"
          className="size-[max(112*var(--m),151.2*var(--u))] shrink-0 select-none"
        />
        <div className="flex min-w-px flex-1 flex-col gap-2.5 text-ink">
          <h3 className="text-[length:max(20*var(--m),24*var(--u))] leading-normal font-bold">Not sure what to choose?</h3>
          <p className="text-[length:max(16*var(--m),20*var(--u))] leading-[1.6] opacity-80">
            Tell us about your shop and we&apos;ll point you to the right plan. No sales pitch.
          </p>
        </div>
      </div>
      <Link
        to={ROUTES.contact}
        className="shrink-0 rounded-full bg-primary px-[max(24*var(--m),40*var(--u))] py-[max(14*var(--m),20*var(--u))] text-[length:max(18*var(--m),20*var(--u))] leading-normal font-semibold whitespace-nowrap text-white transition hover:brightness-110"
      >
        Help me pick a plan
      </Link>
    </div>
  )
}

/** "baked to grow", with the last letters growing (64 → 82px in Figma, all on a 74px line). */
function Title() {
  return (
    <h2 className="font-malibu text-[length:max(36*var(--m),64*var(--u))] leading-[1.1563] font-normal lg:whitespace-nowrap">
      baked to g<span className="text-[1.09375em]">r</span>
      <span className="text-[1.1875em]">o</span>
      <span className="text-[1.28125em]">w</span>, priced to stay fair
    </h2>
  )
}

export function Pricing() {
  const [billing, setBilling] = useState('yearly')
  return (
    <section id="pricing" className="relative mt-[max(80*var(--m),180*var(--u))] scroll-mt-10">
      <Deco src="deco-biscuit.svg" x={159.03} y={-54.5} size={101.93} rotate={-14.1} />
      <div className={`flex flex-col items-center ${GAP[80]} ${CONTAINER}`}>
        <div className={`flex max-w-[calc(878*var(--px))] flex-col items-center text-center text-ink lg:max-w-none ${GAP[30]}`}>
          <Title />
          <p className={TYPE.body}>
            Free setup. Flat monthly fee. 0% commission. Cancel anytime.
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
