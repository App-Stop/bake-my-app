import { ROUTES } from '../../router'
import { Pill } from '../ui'
import { GAP, TYPE, asset } from '../styles'

const FEATURES = [
  {
    image: 'feature-points.webp',
    alt: 'Loyalty wallet with earned points and milestones',
    title: 'Points that pull them back.',
    text: 'Rewards, personal deals and member-only perks.',
  },
  {
    image: 'feature-ordering.webp',
    alt: 'Product page and delivered order confirmation',
    title: 'Ordering in a few taps.',
    text: 'Browse, pick and pay, from anywhere, anytime.',
  },
  {
    image: 'feature-alerts.webp',
    alt: 'Promotional push notifications on a lock screen',
    title: 'Texts that fill tables.',
    text: 'Send a quick SMS about a slow-afternoon deal or a fresh batch.',
  },
]

function Card({ image, alt, className = '', children }) {
  const imageSize = image === 'feature-web.webp' ? { width: 1998, height: 852 } : { width: 971, height: 852 }
  return (
    <div className={`flex h-full flex-col gap-3 rounded-[calc(30*var(--px))] bg-white px-1 pt-1 pb-5 ${className}`}>
      <img {...imageSize} src={asset(image)} alt={alt} loading="lazy" className="h-auto w-full rounded-[calc(26*var(--px))]" />
      {children}
    </div>
  )
}

function CardText({ title, children, align = 'center' }) {
  return (
    <div className={`flex flex-col gap-2.5 leading-normal text-ink ${align === 'center' ? 'text-center' : ''}`}>
      <h3 className="text-[length:max(20*var(--m),24*var(--u))] font-semibold">{title}</h3>
      <p className="text-base opacity-80">{children}</p>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-10 bg-primary-light">
      <div
        className={`mx-auto flex max-w-[calc(1920*var(--u))] flex-col items-center px-[max(20*var(--m),200*var(--u))] py-[max(56*var(--m),100*var(--u))] ${GAP[60]}`}
      >
        <div className={`flex max-w-[calc(878*var(--px))] flex-col items-center text-center text-primary ${GAP[30]}`}>
          <h2 className={` ${TYPE.featureTitle}`}>built for the regulars you already have</h2>
        </div>

        <div className="grid w-full grid-cols-1 items-stretch gap-5 md:grid-flow-dense md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} image={feature.image} alt={feature.alt}>
              <div className="p-4">
                <CardText title={feature.title}>{feature.text}</CardText>
              </div>
            </Card>
          ))}

          <Card
            image="feature-web.webp"
            alt="Web storefront with product page and cart"
            className="md:col-span-2"
          >
            <div className="flex flex-col gap-5 px-[calc(30*var(--px))] py-4 md:flex-row md:items-center md:gap-[max(24*var(--m),120*var(--u))]">
              <div className="min-w-0 flex-1">
                <CardText title="The web gets it all too" align="left">
                  Website customers earn the same points and rewards.
                </CardText>
              </div>
              <Pill to={ROUTES.pricing} size="sm" className="self-start md:self-auto">
                Get your Website
              </Pill>
            </div>
          </Card>

          <Card image="feature-upsells.webp" alt="Cart with suggested add-ons">
            <div className="p-4">
              <CardText title="Upsells that feel helpful">
                Extra shot? Caramel drizzle? Added with one tap at checkout.
              </CardText>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
