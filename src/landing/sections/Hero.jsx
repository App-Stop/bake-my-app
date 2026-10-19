import { CtaPair } from '../ui'
import { GAP, TYPE, asset } from '../styles'
import { SiteNav } from '../SiteNav'

export function Hero() {
  return (
    <>
      <header data-nav-theme="dark" className="relative overflow-hidden bg-primary">
        <SiteNav />
        <div className="relative mx-auto max-w-[1920px] pt-[max(96*var(--m),140*var(--u))]">
          {/* Devices strip (1920×544 in Figma). Phones show its middle 800px; md+ shows it all. */}
          <div className="relative aspect-[800/544] md:aspect-[1920/544]">
            <img
              src={asset('hero-devices.webp')}
              alt="Bake my App on a kitchen tablet, a customer's phone and the business dashboard"
              width={3840}
              height={1197}
              loading="eager"
              fetchPriority="high"
              className="absolute top-[-0.735%] left-[-72%] h-auto w-[254.125%] max-w-none select-none md:left-[-1.5%] md:w-[105.885%]"
            />
          </div>

          <div className={`relative z-10 mt-[calc(10*var(--u))] flex flex-col items-center px-5 text-center text-white ${GAP[30]}`}>
            <h1 className={`relative w-full max-w-[calc(1368*var(--px))] ${TYPE.display}`}>
              <span className="block md:whitespace-nowrap">everything to run your</span>
              <span className="block md:whitespace-nowrap">cafe, baked into one</span>
              <img
                src={asset('sparkle-right.svg')}
                alt=""
                aria-hidden="true"
                className="absolute -top-[0.104em] right-[0.19em] hidden w-[0.495em] md:block"
              />
              <img
                src={asset('sparkle-left.svg')}
                alt=""
                aria-hidden="true"
                className="absolute top-[1.58em] left-[1.08em] hidden w-[0.952em] md:block"
              />
            </h1>
            <div className={`flex max-w-[calc(966*var(--px))] flex-col items-center ${GAP[40]}`}>
              <p className={TYPE.lead}>
                Your own branded app, ordering website, kitchen screen and sales dashboard. Live in 48 hours, with
                0% commission on every order.
              </p>
              <CtaPair tone="purple" size="lg" align="center" note="Free setup. No contracts. We do the techy part." />
            </div>
          </div>
        </div>
      </header>
      <img
        data-nav-theme="dark"
        src={asset('hero-wave.svg')}
        alt=""
        aria-hidden="true"
        width={1920}
        height={311}
        loading="eager"
        fetchPriority="high"
        className="relative -mt-[calc(2*var(--u))] block h-auto w-full select-none"
      />
    </>
  )
}
