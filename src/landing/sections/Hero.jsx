import { CtaPair } from '../ui'
import { GAP, TYPE, WAVE, asset } from '../styles'
import { SiteNav } from '../SiteNav'

export function Hero() {
  return (
    <>
      <header data-nav-theme="dark" className="relative overflow-hidden bg-primary">
        <SiteNav />
        {/* hero-fit (index.css) also scales the hero by viewport height on desktop. */}
        <div className="hero-fit relative mx-auto max-w-[1920px] pt-[max(92*var(--m),136*var(--u))]">
          {/*
            The reduced desktop design clips the device collage into a 1920×400 strip. On desktop it is
            sized in --u (not %), so when the hero is height-limited the collage shrinks and stays centred.
          */}
          <div className="relative overflow-hidden aspect-[800/544] md:aspect-[1920/386] lg:aspect-auto lg:h-[calc(400*var(--u))]">
            <img
              src={asset('hero-devices.png')}
              alt="Bake my App on a kitchen tablet, a customer's phone and the business dashboard"
              width={3840}
              height={1250}
              loading="eager"
              fetchPriority="high"
              className="absolute top-[-0.500%] left-[-72%] h-auto w-[254.125%] max-w-none select-none md:left-[-1.5%] md:w-[105.885%] lg:left-[calc(50%-988.8*var(--u))] lg:w-[calc(2033*var(--u))]"
            />
          </div>

          <div className={`relative z-10 mt-[calc(10*var(--u))] flex flex-col items-center px-5 text-center text-white ${GAP[30]}`}>
            <h1 className={`relative w-full max-w-[calc(906*var(--px))] ${TYPE.hero}`}>
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
              <p className={TYPE.heroLead}>
                Your own branded app, ordering website, kitchen screen and sales dashboard. Live in 48 hours, with
                0% commission on every order.
              </p>
              <CtaPair tone="purple" size="md" align="center" note="Free setup. No contracts. We do the techy part." />
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
        className={`-mt-[2px] ${WAVE}`}
      />
    </>
  )
}
