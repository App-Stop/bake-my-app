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
    <div className={`flex flex-col gap-3 rounded-[30px] bg-white px-1 pt-1 pb-5 ${className}`}>
      <img src={asset(image)} alt={alt} loading="lazy" className="h-auto w-full rounded-[26px]" />
      {children}
    </div>
  )
}

function CardText({ title, children, align = 'center' }) {
  return (
    <div className={`flex flex-col gap-2.5 leading-normal text-ink ${align === 'center' ? 'text-center' : ''}`}>
      <h3 className="text-[clamp(20px,1.875vw,24px)] font-semibold">{title}</h3>
      <p className="text-base opacity-80">{children}</p>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="mt-[clamp(80px,calc(160*var(--u)),160px)] scroll-mt-10 bg-primary-light">
      <div
        className={`mx-auto flex max-w-[1920px] flex-col items-center px-[clamp(20px,calc(200*var(--u)),200px)] py-[clamp(56px,calc(100*var(--u)),100px)] ${GAP[60]}`}
      >
        <div className={`flex max-w-[878px] flex-col items-center text-center text-ink ${GAP[30]}`}>
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
            <div className="flex flex-col gap-5 px-[30px] py-4 md:flex-row md:items-center md:gap-[clamp(24px,calc(120*var(--u)),120px)]">
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
