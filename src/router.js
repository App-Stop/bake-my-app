import { useEffect, useState } from 'react'

export const ROUTES = {
  home: '/',
  app: '/app',
  comingSoon: '/coming-soon',
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
