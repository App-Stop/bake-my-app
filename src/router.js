import { useEffect, useState } from 'react'

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/success',
  contact: '/contact',
  comingSoon: '/coming-soon',
  demoMobile: '/demo/mobile-app',
  demoWebsite: '/demo/website',
  demoAdmin: '/demo/admin',
  demoStaff: '/demo/staff',
}

/** Public demo destinations used by the preview picker. */
export const DEMO_ROUTES = {
  website: ROUTES.demoWebsite,
  admin: ROUTES.demoAdmin,
  employee: ROUTES.demoStaff,
  mobile: ROUTES.demoMobile,
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

/** Checkout with the Growth plan (billed yearly) picked: where the "Start for Free" and primary CTAs go. */
export const GROWTH_CHECKOUT = `${ROUTES.checkout}?plan=growth&interval=year`
