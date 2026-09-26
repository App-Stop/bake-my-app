import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import logo from '../assets/logo.svg'
import { BackButton, PrimaryButton } from '../components/buttons'

/** Shown after "Launch your store" — not in the Figma flow, kept in the same visual language. */
export function LaunchedScreen({ state, onEdit, onStartOver }) {
  return (
    <div className="flex w-full flex-col gap-[60px]">
      <header className="flex items-center justify-between">
        <img src={logo} alt="Bake My App" width={84} height={61.2} className="h-[61.2px] w-[84px]" />
        <p className="rounded-[20px] bg-primary-light px-3 py-1.5 text-sm leading-normal font-medium tracking-[0.28px] text-primary uppercase">
          Store live
        </p>
      </header>

      <section className="flex flex-col gap-10">
        <div className="flex size-[60px] items-center justify-center rounded-full bg-primary-light text-primary">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} color="currentColor" />
        </div>
        <div className="flex flex-col gap-2.5 leading-normal">
          <h1 className="text-[32px] font-semibold text-ink xl:text-4xl">
            {state.shop.name || 'Your store'} is live!
          </h1>
          <p className="text-base text-muted">
            Customers can now browse your menu and place orders. Head to your dashboard to add more
            products, set up discounts and track orders.
          </p>
        </div>
        <div className="flex items-start justify-end gap-2.5">
          <BackButton onClick={onEdit} />
          <PrimaryButton onClick={onStartOver}>Start a new store</PrimaryButton>
        </div>
      </section>
    </div>
  )
}
