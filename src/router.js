import { useEffect, useState } from 'react'

export const ROUTES = {
  home: '/',
  contact: '/contact',
  app: '/app',
  comingSoon: '/coming-soon',
  demoMobile: '/demo/mobile-app',
  demoWebsite: '/demo/website',
  demoAdmin: '/demo/admin',
  demoStaff: '/demo/staff',
}

export function navigate(to) {
  if (to === window.location.pathname + window.location.search + window.location.hash) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
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
