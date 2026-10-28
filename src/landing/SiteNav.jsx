import { useEffect, useState } from 'react'
import { Link } from '../components/Link'
import { ROUTES } from '../router'
import { asset } from './styles'

const NAV_LINKS = [
  { label: 'Savings Calculator', href: '#cost-calculator' },
  { label: 'Customize', href: '#customize' },
  { label: 'Business Tools', href: '#business-tools' },
  { label: 'Pricing', to: ROUTES.pricing },
]

export function SiteNav({ forceDark = false, forceLight = false }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (forceDark || forceLight) return

    const checkTheme = () => {
      const navY = 40
      const activeSection = [...document.querySelectorAll('[data-nav-theme]')].find((element) => {
        const rect = element.getBoundingClientRect()
        return rect.top <= navY && rect.bottom >= navY
      })
      setIsDark(activeSection?.getAttribute('data-nav-theme') === 'dark')
    }

    checkTheme()
    window.addEventListener('scroll', checkTheme, { passive: true })
    window.addEventListener('resize', checkTheme, { passive: true })
    return () => {
      window.removeEventListener('scroll', checkTheme)
      window.removeEventListener('resize', checkTheme)
    }
  }, [forceDark, forceLight])

  const darkTheme = forceDark || (!forceLight && isDark)
  const homePath = window.location.pathname === '/' || window.location.pathname === ''
  const sectionHref = (href) => (homePath ? href : `/${href}`)

  return (
    <nav
      aria-label="Main"
      className={`fixed top-2.5 left-1/2 z-50 flex w-[min(calc(1211*var(--px)),calc(100%-32px))] -translate-x-1/2 items-center justify-between rounded-[calc(60*var(--px))] border border-black/10 px-5 py-[calc(14*var(--px))] transition-all duration-300 backdrop-blur-xl ${
        darkTheme
          ? 'bg-[#2D2D2D]/10 backdrop-saturate-150'
          : 'bg-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
      }`}
    >
      <Link
        to={ROUTES.home}
        aria-label="Bake my App home"
        className="flex h-[calc(51*var(--px))] w-[calc(69.0639*var(--px))] shrink-0 items-center lg:w-[calc(164*var(--px))] lg:pl-[calc(20.4*var(--px))]"
      >
        <img
          src={asset(darkTheme ? 'site-nav-logo.svg' : 'pricing-page/nav-logo.svg')}
          alt="Bake my App"
          width={69.0639}
          height={49.8798}
          className={`block h-auto w-[calc(69.0639*var(--px))] shrink-0 ${darkTheme ? 'brightness-0 invert' : ''}`}
        />
      </Link>

      <ul
        className={`hidden items-center gap-[calc(60*var(--px))] text-base leading-normal font-medium whitespace-nowrap transition-colors duration-300 lg:flex ${
          darkTheme ? 'text-white' : 'text-ink'
        }`}
      >
        {NAV_LINKS.map((link) => (
          <li key={link.to || link.href}>
            {link.to ? (
              <Link to={link.to} className="transition-opacity hover:opacity-75">{link.label}</Link>
            ) : (
              <a href={sectionHref(link.href)} className="transition-opacity hover:opacity-75">{link.label}</a>
            )}
          </li>
        ))}
      </ul>

      <div className="flex shrink-0 items-center gap-[calc(10*var(--px))]">
        <Link
          to={ROUTES.contact}
          className={`hidden rounded-full px-5 py-2.5 text-base leading-normal font-semibold whitespace-nowrap transition-colors lg:block ${
            darkTheme ? 'bg-white/10 text-white hover:bg-white/20' : 'border border-primary bg-white text-primary hover:bg-primary-light'
          }`}
        >
          Contact Us
        </Link>
        <Link
          to={ROUTES.pricing}
          className={`rounded-full px-5 py-2.5 text-base leading-normal font-bold whitespace-nowrap transition-all duration-300 ${
            darkTheme ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-white hover:brightness-110'
          }`}
        >
          Start for Free
        </Link>
      </div>
    </nav>
  )
}
