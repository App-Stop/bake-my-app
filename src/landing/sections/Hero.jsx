import { CtaPair } from '../ui'
import { GAP, TYPE, WAVE, asset } from '../styles'
import { SiteNav } from '../SiteNav'

export function Hero() {
  return (
    <>
      <header data-nav-theme="dark" className="relative overflow-hidden bg-primary">
        <SiteNav />
        <div className="relative mx-auto max-w-[calc(1920*var(--u))] pt-[max(92*var(--m),136*var(--u))]">
          {/*
            The device collage is exported on the 1920 frame (1920×464). From md up it is shown at that
            width in a 1920×440 strip, tall enough for the lowest hand (y=439), so no device is clipped.
            On desktop the container is always 1920 * --u wide, so the same % sizing follows --u and the
            collage shrinks and stays centred when the page is height-limited. Mobile frames just the phone.
          */}
          <div className="relative overflow-hidden aspect-[800/544] md:aspect-[1920/440]">
            <img
              src={asset('hero-devices.png')}
              alt="Bake my App on a kitchen tablet, a customer's phone and the business dashboard"
              width={1920}
              height={464}
              loading="eager"
              fetchPriority="high"
              className="absolute top-[-0.500%] left-[-72%] h-auto w-[254.125%] max-w-none select-none md:top-0 md:left-0 md:w-full"
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
