import { CtaPair } from '../ui'
import { GAP, TYPE, WAVE, asset } from '../styles'

const VALUES = [
  {
    image: 'value-no-commission.webp',
    size: 303,
    title: 'we do the setup',
    text: 'Send your menu, logo and photos. We build your apps and website and handle the App Store and Google Play submissions.',
  },
  {
    image: 'value-live-48h.webp',
    size: 300,
    title: 'keep every dollar',
    text: 'Delivery apps can take up to 30% of every order. With your own app, customers order straight from you, and the full amount is yours.',
  },
  {
    image: 'value-easy-setup.webp',
    size: 300,
    title: 'no new hardware',
    text: 'Send us your menu, logo, and photos. We set up your mobile apps, configure your web storefront, and submit to Apple and Google for you.',
  },
]

export function Values() {
  return (
    // The top wave overlaps the bottom of the customize panel by 102px, as in Figma.
    <section aria-label="Why Bake my App" className="relative mt-20">
      <img src={asset('wave-top.svg')} alt="" aria-hidden="true" width={1920} height={371} loading="lazy" className={WAVE} />
      <div data-nav-theme="dark" className="relative -mt-[2px] bg-primary">
        <div
          className={`mx-auto flex max-w-[calc(1920*var(--u))] flex-col items-center px-[max(20*var(--m),52*var(--u))] py-[max(32*var(--m),64*var(--u))] ${GAP[80]}`}
        >
          <div className="grid w-full grid-cols-1 gap-[max(48*var(--m),60*var(--u))] text-white md:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="flex flex-col items-center gap-5 text-center">
                <img
                  src={asset(value.image)}
                  alt=""
                  width={value.size}
                  height={value.size}
                  loading="lazy"
                  className="h-auto"
                  style={{ width: `max(calc(200 * var(--m)), calc(${value.size} * var(--u)))` }}
                />
                <h3 className={`whitespace-nowrap ${TYPE.h3}`}>{value.title}</h3>
                <p className={TYPE.body}>{value.text}</p>
              </div>
            ))}
          </div>
          <CtaPair tone="purple" size="lg" note="No card needed. Cancel anytime." />
        </div>
      </div>
      <img
        src={asset('wave-bottom.svg')}
        alt=""
        aria-hidden="true"
        width={1920}
        height={243}
        loading="lazy"
        className={`z-10 -mt-[2px] ${WAVE}`}
      />
    </section>
  )
}
