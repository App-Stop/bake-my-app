import { CtaPair } from '../ui'
import { GAP, TYPE, asset } from '../styles'

const VALUES = [
  {
    image: 'value-no-commission.png',
    size: 303,
    title: 'no comission',
    text: 'Delivery aggregators take 30% on every order. With Bake my app, your customers order directly from you and you keep every single dollar.',
  },
  {
    image: 'value-live-48h.png',
    size: 300,
    title: 'live in 48h',
    text: 'Send us your menu, logo, and photos. We set up your mobile apps, configure your web storefront, and submit to Apple and Google for you.',
  },
  {
    image: 'value-easy-setup.png',
    size: 300,
    title: 'easy setup',
    text: 'No expensive proprietary POS hardware leases. The kitchen display runs smoothly on any iPad, Android tablet, or existing touch monitor in your shop.',
  },
]

export function Values() {
  return (
    // The top wave overlaps the bottom of the customize panel by 102px, as in Figma.
    <section aria-label="Why Bake my App" className="relative -mt-[calc(102*var(--u))]">
      <img src={asset('wave-top.svg')} alt="" aria-hidden="true" className="relative block h-auto w-full select-none" />
      <div className="-mt-px bg-primary">
        <div
          className={`mx-auto flex max-w-[1920px] flex-col items-center px-[max(20*var(--m),52*var(--u))] py-[max(64*var(--m),160*var(--u))] ${GAP[80]}`}
        >
          <div className="grid w-full grid-cols-1 gap-[max(48*var(--m),60*var(--u))] text-white md:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="flex flex-col items-center gap-5 text-center">
                <img
                  src={asset(value.image)}
                  alt=""
                  loading="lazy"
                  className="h-auto"
                  style={{ width: `max(calc(200 * var(--m)), calc(${value.size} * var(--u)))` }}
                />
                <h3 className={`whitespace-nowrap ${TYPE.h3}`}>{value.title}</h3>
                <p className={TYPE.body}>{value.text}</p>
              </div>
            ))}
          </div>
          <CtaPair tone="purple" size="lg" />
        </div>
      </div>
      <img
        src={asset('wave-bottom.svg')}
        alt=""
        aria-hidden="true"
        className="relative -mt-[calc(2*var(--u))] block h-auto w-full select-none"
      />
    </section>
  )
}
