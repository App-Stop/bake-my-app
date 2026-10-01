import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { CtaPair } from '../ui'
import { GAP, TYPE, asset } from '../styles'

const NAV_LINKS = [
  { label: 'Solution', href: '#solution' },
  { label: 'Features', href: '#features' },
  { label: 'Business Tools', href: '#business-tools' },
  { label: 'Customize', href: '#customize' },
  { label: 'Pricing', href: '#pricing' },
]

function Nav() {
  return (
    <nav
      aria-label="Main"
      className="fixed top-2.5 left-1/2 z-50 flex w-[min(calc(1211*var(--px)),calc(100%-32px))] -translate-x-1/2 items-center justify-between rounded-[calc(60*var(--px))] bg-[#2D2D2D]/10 px-5 py-[calc(15*var(--px))] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] backdrop-blur-xl backdrop-saturate-150"
    >
      <Link to={ROUTES.home} aria-label="Bake my App home" className="shrink-0">
        <img src={asset('logo-nav.svg')} alt="Bake my App" width={111} height={51} className="h-[calc(51*var(--px))] w-[calc(111*var(--px))]" />
      </Link>
      <ul className="hidden items-center gap-[max(28*var(--m),60*var(--u))] text-base leading-normal font-medium whitespace-nowrap text-white lg:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="transition-opacity hover:opacity-75">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <Link
        to={ROUTES.comingSoon}
        className="shrink-0 rounded-full bg-white px-5 py-2.5 text-base leading-normal font-bold whitespace-nowrap text-primary transition hover:bg-white/90"
      >
        Get your App
      </Link>
    </nav>
  )
}

export function Hero() {
  return (
    <>
      <header className="relative overflow-hidden bg-primary">
        <Nav />
        <div className="relative mx-auto max-w-[1920px] pt-[max(96*var(--m),140*var(--u))]">
          {/* Devices strip (1920×544 in Figma). Phones show its middle 800px; md+ shows it all. */}
          <div className="relative aspect-[800/544] md:aspect-[1920/544]">
            <img
              src={asset('hero-devices.png')}
              alt="Bake my App on a kitchen tablet, a customer's phone and the business dashboard"
              className="absolute top-[-0.735%] left-[-84.125%] h-auto w-[254.125%] max-w-none select-none md:left-[-5.885%] md:w-[105.885%]"
            />
          </div>

          <div className={`relative z-10 mt-[calc(10*var(--u))] flex flex-col items-center px-5 text-center text-white ${GAP[30]}`}>
            <h1 className={`relative max-w-[calc(1368*var(--px))] ${TYPE.display}`}>
              everything to run
              <br />
              your cafe
              <img
                src={asset('sparkle-right.svg')}
                alt=""
                aria-hidden="true"
                className="absolute top-[-0.104em] left-[calc(50%+4.876em)] hidden w-[0.495em] md:block"
              />
              <img
                src={asset('sparkle-left.svg')}
                alt=""
                aria-hidden="true"
                className="absolute top-[1.104em] left-[calc(50%-3.73em)] hidden w-[0.952em] md:block"
              />
            </h1>
            <div className={`flex max-w-[calc(966*var(--px))] flex-col items-center ${GAP[40]}`}>
              <p className={TYPE.lead}>
                Your own white-label iOS &amp; Android ordering app, touch kitchen display system (KDS), and
                multi-branch admin control deck — beautifully baked together.
              </p>
              <CtaPair tone="purple" size="lg" />
            </div>
          </div>
        </div>
      </header>
      <img
        src={asset('hero-wave.svg')}
        alt=""
        aria-hidden="true"
        className="relative -mt-[calc(2*var(--u))] block h-auto w-full select-none"
      />
    </>
  )
}
