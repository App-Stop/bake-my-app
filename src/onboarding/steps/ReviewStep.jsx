import { HugeiconsIcon } from '@hugeicons/react'
import { CroissantIcon } from '@hugeicons/core-free-icons'
import { getStoreSummary } from '../../preview/storeSummary'
import { StepShell } from '../StepShell'

function CheckCircle({ done }) {
  return done ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12Z" fill="#554CF1" />
      <path d="M8 12.5L10.5 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="#6A6A6A" strokeWidth="1.5" />
      <path d="M8 12.5L10.5 15L16 9" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 rounded-[20px] bg-surface p-5 leading-normal">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="truncate text-xl font-semibold text-ink">{value}</p>
    </div>
  )
}

export function ReviewStep({ state, actions, onBack }) {
  const { shop, brandColor, menu, delivery } = state
  const summary = getStoreSummary(state)
  const productCount = menu.item.name.trim() ? 1 : 0
  const categoryCount = menu.category.trim() ? 1 : 0

  const checklist = [
    { label: 'Shop name', done: !!shop.name.trim() },
    { label: 'Shop logo', done: !!shop.logo },
    { label: 'Brand color', done: brandColor !== '#554cf1' },
    { label: 'Menu categories & products', done: productCount > 0 && categoryCount > 0 },
    { label: 'Delivery fee & tax rates', done: !!delivery.fee.trim() && !!delivery.taxRate.trim() },
    { label: 'Add 10 total products', done: false },
    { label: 'Setup discounts and offer', done: false },
  ]

  return (
    <StepShell
      step={4}
      title="Review and launch"
      description="Everything look good? You can always make changes from your dashboard after launching."
      onBack={onBack}
      onNext={actions.launch}
      nextLabel="Launch your store"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <div className="flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[120px] bg-brand text-on-brand">
            {shop.logo ? (
              <img src={shop.logo} alt="" className="size-full bg-white object-contain p-1.5" />
            ) : (
              <HugeiconsIcon icon={CroissantIcon} size={38.4} color="currentColor" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 leading-normal">
            <p className="truncate text-xl font-semibold text-ink">{shop.name || 'Your shop'}</p>
            <p className="text-sm text-muted">{shop.tagline || 'Add a tagline in step 1'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <StatCard label="Products" value={productCount} />
            <StatCard label="Categories" value={categoryCount} />
          </div>
          <div className="flex gap-2.5">
            <StatCard label="Delivery Fee" value={summary.deliveryFeeLabel} />
            <StatCard label="Tax" value={`${summary.taxRate}% ${summary.taxLabel}`} />
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {checklist.map(({ label, done }) => (
          <li key={label} className="flex items-center gap-3.5">
            <CheckCircle done={done} />
            <span className={`text-base leading-normal ${done ? 'text-ink' : 'text-muted'}`}>{label}</span>
          </li>
        ))}
      </ul>
    </StepShell>
  )
}
