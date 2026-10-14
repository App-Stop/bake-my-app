import { useEffect } from 'react'
import App from './App.jsx'
import { ComingSoonPage } from './landing/ComingSoonPage.jsx'
import { LandingPage } from './landing/LandingPage.jsx'
import { AdminDemo } from './landing/demo/AdminDemo.jsx'
import { MobileAppDemo } from './landing/demo/MobileAppDemo.jsx'
import { StaffDemo } from './landing/demo/StaffDemo.jsx'
import { WebsiteDemo } from './landing/demo/WebsiteDemo.jsx'
import { ModalsProvider } from './landing/modals.jsx'
import { ROUTES, usePathname } from './router'

const PAGES = {
  [ROUTES.home]: { Page: LandingPage, title: 'Bake My App — Your café, beautifully baked' },
  [ROUTES.app]: { Page: App, title: 'Bake My App — Set up your store' },
  [ROUTES.comingSoon]: { Page: ComingSoonPage, title: 'Bake My App — Coming soon' },
  [ROUTES.demoMobile]: { Page: MobileAppDemo, title: 'Bake My App — Customer app demo' },
  [ROUTES.demoWebsite]: { Page: WebsiteDemo, title: 'Bake My App — Customer website demo' },
  [ROUTES.demoAdmin]: { Page: AdminDemo, title: 'Bake My App — Admin portal demo' },
  [ROUTES.demoStaff]: { Page: StaffDemo, title: 'Bake My App — Staff portal demo' },
}

/**
 * "/" is the landing page, "/app" the web app (onboarding + dashboard), "/coming-soon" the CTA stub,
 * "/demo/…" the product demos. Landing modals (promo, demo picker) are available on every page.
 */
export function Root() {
  const pathname = usePathname()
  const route = PAGES[pathname.replace(/\/+$/, '') || '/'] ?? PAGES[ROUTES.home]

  useEffect(() => {
    document.title = route.title
  }, [route])

  return (
    <ModalsProvider>
      <route.Page />
    </ModalsProvider>
  )
}
