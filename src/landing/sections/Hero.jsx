import { useEffect, useState } from 'react'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { CtaPair } from '../ui'
import { GAP, TYPE, asset } from '../styles'

const NAV_LINKS = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Business Tools', href: '#business-tools' },
  { label: 'Customize', href: '#customize' },
  { label: 'Contact Us', href: '#faq' },
]

function Nav() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      const elements = document.querySelectorAll('[data-nav-theme]')
      const navY = 40
      let activeTheme = 'light'
      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= navY && rect.bottom >= navY) {
          activeTheme = el.getAttribute('data-nav-theme') || 'light'
          break
        }
      }
      setIsDark(activeTheme === 'dark')
    }

    checkTheme()
    window.addEventListener('scroll', checkTheme, { passive: true })
    window.addEventListener('resize', checkTheme, { passive: true })
    return () => {
      window.removeEventListener('scroll', checkTheme)
      window.removeEventListener('resize', checkTheme)
    }
  }, [])

  return (
    <nav
      aria-label="Main"
      className={`fixed top-2.5 left-1/2 z-50 flex w-[min(calc(1211*var(--px)),calc(100%-32px))] -translate-x-1/2 items-center justify-between rounded-[calc(60*var(--px))] px-5 py-[calc(15*var(--px))] transition-all duration-300 backdrop-blur-xl ${
        isDark
          ? 'bg-[#2D2D2D]/10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] backdrop-saturate-150'
          : 'bg-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(0,0,0,0.08)]'
      }`}
    >
      <Link to={ROUTES.home} aria-label="Bake my App home" className="shrink-0">
        <img
          src={asset(isDark ? 'logo-nav.svg' : 'logo-nav-dark.svg')}
          alt="Bake my App"
          width={111}
          height={51}
          className="h-[calc(51*var(--px))] w-[calc(111*var(--px))]"
        />
      </Link>
      <ul
        className={`hidden items-center gap-[max(28*var(--m),60*var(--u))] text-base leading-normal font-medium whitespace-nowrap transition-colors duration-300 lg:flex ${
          isDark ? 'text-white' : 'text-ink'
        }`}
      >
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`transition-colors ${
                isDark ? 'hover:opacity-75' : 'hover:text-primary'
              }`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <Link
        to={ROUTES.app}
        className={`shrink-0 rounded-full px-5 py-2.5 text-base leading-normal font-bold whitespace-nowrap transition-all duration-300 ${
          isDark
            ? 'bg-white text-primary hover:bg-white/90'
            : 'bg-primary text-white hover:brightness-110 shadow-sm'
        }`}
      >
        Start for Free
      </Link>
    </nav>
  )
}

export function Hero() {
  return (
    <>
      <header data-nav-theme="dark" className="relative overflow-hidden bg-primary">
        <Nav />
        <div className="relative mx-auto max-w-[1920px] pt-[max(96*var(--m),140*var(--u))]">
          {/* Devices strip (1920×544 in Figma). Phones show its middle 800px; md+ shows it all. */}
          <div className="relative aspect-[800/544] md:aspect-[1920/544]">
            <img
              src={asset('hero-devices.png')}
              alt="Bake my App on a kitchen tablet, a customer's phone and the business dashboard"
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
        className="relative -mt-[calc(2*var(--u))] block h-auto w-full select-none"
      />
    </>
  )
}
