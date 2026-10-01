import { useId, useState } from 'react'
import { ROUTES } from '../../router'
import { Cancel01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { Icon, Pill } from '../ui'

// Only the first answer exists in Figma; the rest restate what the page already promises.
const FAQS = [
  {
    q: 'What is included with my branded ordering app?',
    a: 'You get a white-label iOS and Android app with your logo, colors, menu, secure checkout, loyalty rewards, push notifications, and real-time order tracking. It connects with your web storefront, kitchen order station, and business dashboard so every order stays in sync.',
  },
  {
    q: 'How quickly can Bake my App launch my ordering system?',
    a: 'Most cafés go live within 48 hours. Send us your menu, logo, and photos — we set up your mobile apps, configure your web storefront, and handle the App Store and Google Play submissions for you.',
  },
  {
    q: 'Do you charge commission on customer orders?',
    a: 'No. You pay a flat monthly fee and keep 100% of every order. There are no order commissions, hidden percentages, or long-term contracts.',
  },
  {
    q: 'Can Bake my App work with my existing POS and hardware?',
    a: 'Yes. The kitchen order station runs on any iPad, Android tablet, or touch monitor you already own, and our plans include integration with your existing POS — no proprietary hardware leases.',
  },
  {
    q: 'Can I manage multiple bakery or café locations from one place?',
    a: 'Yes. The business dashboard shows every branch side by side — live revenue, orders, stock, and fleet health — so you can run all your locations from one login.',
  },
]

function FaqItem({ faq, open, onToggle }) {
  const id = useId()
  return (
    <div
      className={`flex w-full gap-5 overflow-clip rounded-[calc(40*var(--px))] bg-primary-light p-[max(20*var(--m),30*var(--u))] ${open ? 'items-start' : 'items-center'}`}
    >
      <div className="flex min-w-px flex-1 flex-col gap-2.5 text-base text-ink">
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={onToggle}
            className="w-full text-left leading-normal font-semibold focus-visible:underline focus-visible:outline-none"
          >
            {faq.q}
          </button>
        </h3>
        <p id={id} hidden={!open} className="leading-6 opacity-80">
          {faq.a}
        </p>
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onToggle}
        className={`flex shrink-0 items-center rounded-full p-1.5 transition-colors ${open ? 'bg-primary' : 'hover:bg-white'}`}
      >
        <Icon icon={open ? Cancel01Icon : PlusSignIcon} className={`size-5 ${open ? 'text-white' : 'text-ink'}`} />
      </button>
    </div>
  )
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section aria-labelledby="faq-title" className="mt-[max(80*var(--m),130*var(--u))]">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-10 px-[max(20*var(--m),160*var(--u))] lg:flex-row lg:gap-[calc(70*var(--u))]">
        <div className="flex min-w-px flex-1 flex-col gap-[max(32*var(--m),60*var(--u))]">
          <div className="flex flex-col gap-2.5 text-ink">
            <h2 id="faq-title" className="font-malibu text-[length:max(28*var(--m),36*var(--u))] leading-[1.389]">
              frequently baked questions
            </h2>
            <p className="text-[length:max(16*var(--m),20*var(--u))] leading-[1.6] font-medium">
              Everything you need to know about launching and running your branded bakery ordering experience.
            </p>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-[length:max(16*var(--m),20*var(--u))] leading-[1.6] font-medium text-ink">
              Need to know something else?
            </p>
            <Pill to={ROUTES.comingSoon} variant="soft" arrow>
              Contact Us
            </Pill>
          </div>
        </div>
        <div className="flex w-full flex-col gap-5 lg:w-[56.25%] lg:shrink-0">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
