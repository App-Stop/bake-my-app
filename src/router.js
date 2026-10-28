import { useEffect, useState } from 'react'

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/success',
  contact: '/contact',
  app: '/app',
  comingSoon: '/coming-soon',
  demoMobile: '/demo/mobile-app',
  demoWebsite: '/demo/website',
  demoAdmin: '/demo/admin',
  demoStaff: '/demo/staff',
}

/** `replace` swaps the current history entry, e.g. when redirecting away from an invalid URL. */
export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname + window.location.search + window.location.hash) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  // 'instant': plain scrollTo follows the CSS `scroll-behavior: smooth`, which the page swap interrupts.
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

export function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const onChange = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  return pathname
}

/** The current query string as URLSearchParams, kept in sync with navigation. */
export function useSearchParams() {
  const [search, setSearch] = useState(() => window.location.search)

  useEffect(() => {
    const onChange = () => setSearch(window.location.search)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  return new URLSearchParams(search)
}
