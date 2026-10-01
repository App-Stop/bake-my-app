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

const HIGHLIGHTS = [
  'Live revenue metrics with month-over-month growth trends',
  'See which category item is selling more',
  'Shift audit logs, monitoring and live data analytics',
]

export function BusinessTools() {
  const [active, setActive] = useState(TABS[0].id)

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
                aria-selected={selected}
                onClick={() => setActive(tab.id)}
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

        <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-[4.024%]">
          <div className={`flex w-full flex-col lg:w-[46.59%] ${GAP[40]}`}>
            <div className="flex flex-col gap-4 leading-normal text-ink">
              <h3 className="text-[length:max(28*var(--m),40*var(--u))] font-bold">Daily revenue &amp; item velocity at a glance.</h3>
              <p className="text-[length:max(16*var(--m),20*var(--u))] font-medium">
                Check your numbers in real time. Know your gross sales ($1,247.50 today), average ticket size, and
                exactly how many classic butter croissants and caramel macchiatos were sold.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {HIGHLIGHTS.map((text) => (
                <li key={text} className="flex items-center gap-2.5">
                  <CheckCircle className="size-[max(24*var(--m),32*var(--u))]" />
                  <span className="text-[length:max(16*var(--m),20*var(--u))] leading-normal font-semibold text-ink">{text}</span>
                </li>
              ))}
            </ul>
            <CtaPair label="Get for your business" />
          </div>
          <img
            src={asset('manage-dashboard.png')}
            alt="Business dashboard showing revenue, orders and branch health"
            loading="lazy"
            className="h-auto w-full lg:w-[49.39%]"
          />
        </div>
      </div>
    </section>
  )
}
