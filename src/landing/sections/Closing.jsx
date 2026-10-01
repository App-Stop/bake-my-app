import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { Facebook01Icon, InstagramIcon, Linkedin01Icon, TwitterIcon } from '@hugeicons/core-free-icons'
import { Composite, CtaPair, Icon } from '../ui'
import { CONTAINER, GAP, TYPE, asset } from '../styles'

export function Ready() {
  return (
    <section aria-labelledby="ready-title" className="relative mt-[max(80*var(--m),131*var(--u))]">
      <img src={asset('wave-top.svg')} alt="" aria-hidden="true" className="relative block h-auto w-full select-none" />
      <div className="-mt-px overflow-hidden bg-primary">
        <div
          className={`flex flex-col items-center py-[max(64*var(--m),120*var(--u))] lg:flex-row ${GAP[80]} ${CONTAINER}`}
        >
          <div className={`flex w-full min-w-px flex-col text-white lg:flex-1 ${GAP[30]}`}>
            <h2 id="ready-title" className={TYPE.display}>
              ready to bake
              <br />
              your app?
            </h2>
            <div className={`flex flex-col ${GAP[40]}`}>
              <p className={TYPE.lead}>
                Give your regulars the convenience of ordering ahead on mobile while keeping 100% of your earnings.
              </p>
              <CtaPair tone="purple" size="lg" />
            </div>
          </div>
          {/* Export is 647px tall and starts 43px above the 736×567 box; its right edge runs off-screen. */}
          <Composite
            src={asset('ready-devices.png')}
            alt="Customer app on a phone and the business dashboard on a tablet"
            box={{ w: 736, h: 567 }}
            art={{ x: 0, y: -43, h: 647 }}
            className="w-full max-w-[calc(736*var(--px))] shrink-0 lg:w-[44.88%] lg:max-w-none"
          />
        </div>
      </div>
    </section>
  )
}

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Customer App', href: '#solution' },
      { label: 'Customer Website', href: '#solution' },
      { label: 'Kitchen Order Station', href: '#solution' },
      { label: 'Business Dashboard', href: '#business-tools' },
      { label: 'Loyalty & Rewards', href: '#features' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'For Bakeries', to: ROUTES.comingSoon },
      { label: 'For Cafés', to: ROUTES.comingSoon },
      { label: 'Multi-Branch Chains', to: ROUTES.comingSoon },
      { label: 'Commissary Kitchens', to: ROUTES.comingSoon },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: ROUTES.comingSoon },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Blog', to: ROUTES.comingSoon },
      { label: 'Careers', to: ROUTES.comingSoon },
      { label: 'Contact Us', to: ROUTES.comingSoon },
    ],
  },
]

const SOCIALS = [
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'Twitter', icon: TwitterIcon },
  { label: 'LinkedIn', icon: Linkedin01Icon },
  { label: 'Facebook', icon: Facebook01Icon },
]

function FooterLink({ link, className }) {
  return link.to ? (
    <Link to={link.to} className={className}>
      {link.label}
    </Link>
  ) : (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  )
}

export function Footer() {
  return (
    <footer className="-mt-px bg-primary text-white">
      <div
        className={`flex flex-col items-center gap-[max(40*var(--m),60*var(--u))] pt-[max(56*var(--m),80*var(--u))] pb-[max(40*var(--m),60*var(--u))] ${CONTAINER}`}
      >
        <img src={asset('logo-footer.svg')} alt="Bake my App" width={210} height={153} className="h-auto w-[max(150*var(--m),210*var(--u))]" />
        <div className="flex w-full flex-col items-center gap-[max(40*var(--m),60*var(--u))]">
          <nav
            aria-label="Footer"
            className="grid w-full grid-cols-1 gap-10 text-[length:max(16*var(--m),20*var(--u))] leading-normal sm:grid-cols-3 sm:gap-[max(24*var(--m),160*var(--u))]"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col items-center gap-5 text-center">
                <p className="font-semibold tracking-[calc(2*var(--px))] uppercase opacity-40">{column.title}</p>
                <ul className="flex flex-col items-center gap-3.5 font-medium">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} className="transition-opacity hover:opacity-75" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <ul className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <Link
                  to={ROUTES.comingSoon}
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] transition hover:bg-white/30"
                >
                  <Icon icon={social.icon} className="size-[calc(18*var(--px))]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px w-full bg-white opacity-20" />
        <div className="flex w-full flex-col items-center justify-between gap-4 text-sm leading-normal md:flex-row">
          <p className="opacity-60">© 2026 Bake my App, Inc. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
              <li key={label}>
                <Link to={ROUTES.comingSoon} className="opacity-60 transition-opacity hover:opacity-100">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
