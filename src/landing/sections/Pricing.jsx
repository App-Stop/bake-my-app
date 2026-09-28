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

const PLANS = [
  {
    name: 'Startup',
    description: 'Ideal for neighborhood bakeries launching direct digital pre-orders and pickup.',
    price: '$89',
    priceNote: '/month billed yearly',
    cta: 'Get Started',
    features: FEATURES,
    included: 5,
    more: { label: 'Learn more', tone: 'text-ink' },
  },
  {
    name: 'Growth',
    description: 'More customized and scaled up to match your growing cafe business',
    price: '$149',
    priceNote: '/month billed yearly',
    cta: 'Get Started',
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

function PlanCard({ plan }) {
  const { featured } = plan
  return (
    <div
      className={`relative flex h-full flex-col gap-9 overflow-hidden rounded-[40px] bg-white p-[30px] shadow-[inset_0_0_0_1px_var(--color-line)]`}
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
        <h3 className="text-[clamp(20px,1.25vw,24px)] font-semibold">{plan.name}</h3>
        <p className="text-base opacity-80">{plan.description}</p>
      </div>
      <div className="relative flex flex-col leading-normal">
        <p className={`font-malibu text-[clamp(48px,3.333vw,64px)] ${featured ? 'text-primary' : 'text-ink'}`}>
          {plan.price}
        </p>
        <p className="text-base text-ink opacity-80">{plan.priceNote}</p>
      </div>
      <Link
        to={ROUTES.comingSoon}
        className={`relative flex w-full items-center justify-center gap-2.5 rounded-full p-5 text-[clamp(18px,1.042vw,20px)] leading-normal font-semibold whitespace-nowrap transition ${
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

export function Pricing() {
  return (
    <section id="pricing" className="mt-[clamp(80px,calc(180*var(--u)),180px)] scroll-mt-10">
      <div className={`flex flex-col items-center ${GAP[80]} ${CONTAINER}`}>
        <div className={`flex max-w-[878px] flex-col items-center text-center text-ink ${GAP[30]}`}>
          <h2 className={TYPE.h2}>baked to grow</h2>
          <p className={TYPE.body}>
            Fair flat monthly fees. No order commissions, no hidden percentages, and no long-term contracts.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-y-5">
          {PLANS.map((plan) => (
            <div key={plan.name} className="relative">
              {plan.featured && (
                <p className="absolute top-[-24px] left-1/2 -translate-x-1/2 rounded-t-[20px] bg-primary px-3 pt-1 pb-0.5 font-malibu text-xs leading-normal tracking-[0.24px] whitespace-nowrap text-white">
                  MOST POPULAR
                </p>
              )}
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
