import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-primary px-5 py-2.5 text-base leading-normal font-semibold whitespace-nowrap text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 ${className}`}
      {...props}
    >
      {children}
      <HugeiconsIcon icon={ArrowRight02Icon} size={24} color="currentColor" />
    </button>
  )
}

export function BackButton(props) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center justify-center gap-2.5 rounded-full px-5 py-2.5 text-base leading-normal font-semibold whitespace-nowrap text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      {...props}
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" />
      Back
    </button>
  )
}
