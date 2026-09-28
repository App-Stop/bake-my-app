import { useEffect } from 'react'
import App from './App.jsx'
import { ComingSoonPage } from './landing/ComingSoonPage.jsx'
import { LandingPage } from './landing/LandingPage.jsx'
import { ROUTES, usePathname } from './router'

const PAGES = {
  [ROUTES.home]: { Page: LandingPage, title: 'Bake My App — Your café, beautifully baked' },
  [ROUTES.app]: { Page: App, title: 'Bake My App — Set up your store' },
  [ROUTES.comingSoon]: { Page: ComingSoonPage, title: 'Bake My App — Coming soon' },
}

/** "/" is the landing page, "/app" the web app (onboarding + dashboard), "/coming-soon" the CTA stub. */
export function Root() {
  const pathname = usePathname()
  const route = PAGES[pathname.replace(/\/+$/, '') || '/'] ?? PAGES[ROUTES.home]

  useEffect(() => {
    document.title = route.title
  }, [route])

  return <route.Page />
}
