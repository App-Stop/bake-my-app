import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ChartColumnBigIcon,
  PackagingIcon,
  PaintBoardIcon,
  Store01Icon,
} from '@hugeicons/core-free-icons'
import { CheckCircle, CtaPair, Deco } from '../ui'
import { CONTAINER, GAP, TYPE, asset } from '../styles'

const TABS = [
  { id: 'analytics', label: 'Live Analytics', icon: ChartColumnBigIcon },
  { id: 'branches', label: 'Multi-Branch Fleet', icon: Store01Icon },
  { id: 'orders', label: 'Manage Orders', icon: PackagingIcon },
  { id: 'customization', label: 'Customization', icon: PaintBoardIcon },
]

const TAB_CONTENT = {
  analytics: {
    title: 'know your numbers before your coffee cools',
    description:
      "See today's sales, average ticket and best sellers live, from your laptop, iPad or phone. Run one shop or ten from a single login.",
    highlights: [
      'Live revenue, with month-over-month trends',
      'Your top sellers by category, so you know what to bake more of',
      'Shift logs and branch-by-branch results',
    ],
    label: 'See my sales live',
    demoLabel: 'Try admin portal',
    image: 'manage-dashboard.png',
    alt: 'Business dashboard showing live revenue, orders and branch health',
  },
  branches: {
    title: 'Manage 1 location or 10 from one screen.',
    description:
      'Run Downtown Bakery, West End Branch, or your catering kitchen from a single dashboard. See performance by location and route customer delivery orders automatically to the nearest oven.',
    highlights: [
      'Live location status and daily sales per branch',
      'Automatic geo-routing to the closest branch',
      'Branch-specific staff credentials and kitchen displays',
    ],
    label: 'Get for your Business',
    demoLabel: 'Launch Demo',
    image: 'business-tools-branches.svg',
    alt: 'Multi-branch dashboard showing location status, sales, active orders and performance',
  },
  orders: {
    title: 'Track orders from placement to doorstep.',
    description:
      'Complete oversight over every customer order. Filter between active, completed, and canceled tickets. See customer contact info, delivery address, and payment method in one clean table.',
    highlights: [
      'Quick status updates: Preparing, Ready, Dispatched, Delivered',
      'Card vs. Cash indicator for delivery drivers',
      'Search receipts by customer name or order number instantly',
    ],
    label: 'Get for your Business',
    demoLabel: 'Launch Demo',
    image: 'business-tools-orders.svg',
    alt: 'Order management dashboard showing revenue, branch totals and customer orders',
  },
  customization: {
    title: "Full control over your bakery's digital store.",
    description:
      'Set up your shop in minutes. Pick your brand color (#C15400), set weekly business hours for each day, define delivery radiuses, and toggle audible kitchen chimes for incoming orders.',
    highlights: [
      'Upload your logo and choose custom brand colors',
      'Set weekly opening hours and holiday schedules',
      'Configure delivery boundaries and minimum order amounts',
    ],
    label: 'Get for your Business',
    demoLabel: 'Launch Demo',
    image: 'business-tools-customization.svg',
    alt: 'Bakery customization dashboard showing store details, hours and order settings',
  },
}

export function BusinessTools() {
  const [active, setActive] = useState(TABS[0].id)
  const content = TAB_CONTENT[active]

  const handleTabKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return

    event.preventDefault()
    const currentIndex = TABS.findIndex((tab) => tab.id === active)
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? TABS.length - 1
          : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length
    const nextTab = TABS[nextIndex]

    setActive(nextTab.id)
    document.getElementById(`business-tab-${nextTab.id}`)?.focus()
  }

  return (
    <section
      id="business-tools"
      className="relative mt-[max(80*var(--m),160*var(--u))] scroll-mt-10"
    >
      <Deco src="deco-cupcake.svg" x={159.03} y={-54.5} size={101.93} rotate={-14.1} />
      <Deco src="deco-cake.svg" x={1685.79} y={87} size={113.3} rotate={27.5} />
      <div className={`relative flex flex-col items-center ${GAP[60]} ${CONTAINER}`}>
        <div className={`flex max-w-[calc(976*var(--px))] flex-col items-center text-center ${GAP[30]}`}>
          <h2 className={`text-primary ${TYPE.h2}`}>manage, operate and grow your business</h2>
          <p className={`max-w-[calc(824*var(--px))] text-ink ${TYPE.body}`}>
            Everything you need to run your bakery operations from your laptop, iPad, or phone. Real data, real
            control, zero technical headaches.
          </p>
        </div>

        <div role="tablist" aria-label="Business tools" className="flex w-full gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`business-tab-${tab.id}`}
                aria-controls="business-tools-panel"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={`relative flex min-w-max flex-1 items-center justify-center gap-3 overflow-clip rounded-[calc(60*var(--px))] px-3 py-5 text-[length:max(16*var(--m),20*var(--u))] leading-normal whitespace-nowrap transition-colors ${
                  selected ? 'bg-primary-light font-semibold text-primary' : 'font-medium text-body hover:bg-primary-light/50'
                }`}
              >
                <HugeiconsIcon icon={tab.icon} size={32} color="currentColor" className="size-[max(24*var(--m),32*var(--u))] shrink-0" />
                {tab.label}
                {selected && (
                  <span className="absolute top-[calc(50%+35*var(--px))] left-0 h-0.5 w-[67.82%] -translate-y-1/2 bg-primary" />
                )}
              </button>
            )
          })}
        </div>

        <div
          id="business-tools-panel"
          role="tabpanel"
          aria-labelledby={`business-tab-${active}`}
          className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-[4.024%]"
        >
          <div className={`flex w-full flex-col lg:w-[46.59%] ${GAP[40]}`}>
            <div className="flex flex-col gap-4 leading-normal text-ink lg:min-h-[calc(226*var(--u))]">
              <h3 className="text-[length:max(28*var(--m),40*var(--u))] font-bold">{content.title}</h3>
              <p className="text-[length:max(16*var(--m),20*var(--u))] font-medium">
                {content.description}
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {content.highlights.map((text) => (
                <li key={text} className="flex items-center gap-2.5">
                  <CheckCircle className="size-[max(24*var(--m),32*var(--u))]" />
                  <span className="text-[length:max(16*var(--m),20*var(--u))] leading-normal font-semibold text-ink">{text}</span>
                </li>
              ))}
            </ul>
            <CtaPair label={content.label} demoLabel={content.demoLabel} />
          </div>
          <img
            key={content.image}
            src={asset(content.image)}
            alt={content.alt}
            loading="lazy"
            className="h-auto w-full lg:w-[49.39%]"
          />
        </div>
      </div>
    </section>
  )
}
