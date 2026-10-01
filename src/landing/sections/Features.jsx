import { ROUTES } from '../../router'
import { Pill } from '../ui'
import { GAP, TYPE, asset } from '../styles'

const FEATURES = [
  {
    image: 'feature-points.png',
    alt: 'Loyalty wallet with earned points and milestones',
    title: 'Points that bring them back.',
    text: 'Keep customers coming back with points, personalized deals, and exclusive member perks.',
  },
  {
    image: 'feature-ordering.png',
    alt: 'Product page and delivered order confirmation',
    title: 'Easy & Simple Ordering',
    text: 'Let customers browse your menu and place orders directly from their phone — anytime, anywhere.',
  },
  {
    image: 'feature-alerts.png',
    alt: 'Promotional push notifications on a lock screen',
    title: 'SMS / Alerts Updates',
    text: "Send targeted promotions and real-time updates straight to your customers' phones.",
  },
]

function Card({ image, alt, className = '', children }) {
  return (
    <div className={`flex flex-col gap-3 rounded-[calc(30*var(--px))] bg-white px-1 pt-1 pb-5 ${className}`}>
      <img src={asset(image)} alt={alt} loading="lazy" className="h-auto w-full rounded-[calc(26*var(--px))]" />
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
    <section id="features" className="mt-[max(80*var(--m),160*var(--u))] scroll-mt-10 bg-primary-light">
      <div
        className={`mx-auto flex max-w-[1920px] flex-col items-center px-[max(20*var(--m),200*var(--u))] py-[max(56*var(--m),100*var(--u))] ${GAP[60]}`}
      >
        <div className={`flex max-w-[calc(878*var(--px))] flex-col items-center text-center text-ink ${GAP[30]}`}>
          <h2 className={`lg:whitespace-nowrap ${TYPE.h2}`}>features customers love</h2>
          <p className={TYPE.body}>
            Every screen is designed to make ordering easy, earn repeat visits, and keep your customers informed.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 items-center gap-5 md:grid-flow-dense md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} image={feature.image} alt={feature.alt}>
              <div className="p-4">
                <CardText title={feature.title}>{feature.text}</CardText>
              </div>
            </Card>
          ))}

          <Card
            image="feature-web.png"
            alt="Web storefront with product page and cart"
            className="md:col-span-2"
          >
            <div className="flex flex-col gap-5 px-[calc(30*var(--px))] py-4 md:flex-row md:items-center md:gap-[max(24*var(--m),120*var(--u))]">
              <div className="min-w-0 flex-1">
                <CardText title="All the same perks, on the web too" align="left">
                  Customers get all the perks of mobile ordering on the web too — including easy ordering, points,
                  and rewards.
                </CardText>
              </div>
              <Pill to={ROUTES.comingSoon} size="sm" className="self-start md:self-auto">
                Get your Website
              </Pill>
            </div>
          </Card>

          <Card image="feature-upsells.png" alt="Cart with suggested add-ons">
            <div className="p-4">
              <CardText title="Upsells that feel helpful.">
                Customers easily add caramel sauce, extra espresso, or seasonal pastries with one tap before
                checkout.
              </CardText>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
