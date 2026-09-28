import logo from '../assets/logo.svg'
import { BackButton, PrimaryButton } from '../components/buttons'

export const TOTAL_STEPS = 5

function ProgressBar({ step }) {
  return (
    <div className="flex w-full items-center gap-2.5" aria-hidden="true">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className={`h-1 min-w-px flex-1 rounded-[10px] transition-colors duration-300 ${
            i === step ? 'bg-primary' : i < step ? 'bg-ink' : 'bg-ink/20'
          }`}
        />
      ))}
    </div>
  )
}

/** Shared chrome for every onboarding step: logo, step pill, progress, heading, nav. */
export function StepShell({
  step,
  title,
  description,
  children,
  onBack,
  onNext,
  onSkip,
  nextLabel = 'Continue',
  nextDisabled = false,
}) {
  return (
    <div className="flex w-full flex-col gap-[60px]">
      <header className="flex items-center justify-between">
        <img src={logo} alt="Bake My App" width={84} height={61.2} className="h-[61.2px] w-[84px]" />
        <div className="flex items-center gap-3">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-medium text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Skip to Dashboard &rarr;
            </button>
          )}
          <p className="rounded-[20px] bg-primary-light px-3 py-1.5 text-center text-sm leading-normal font-medium tracking-[0.28px] text-primary uppercase">
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-10" aria-labelledby="step-title">
        <ProgressBar step={step} />

        <div className="flex flex-col gap-2.5 leading-normal">
          <h1 id="step-title" className="text-[32px] font-semibold text-ink xl:text-4xl">
            {title}
          </h1>
          <p className="text-base text-muted">{description}</p>
        </div>

        {children}

        <div className="flex items-start justify-end gap-2.5">
          {onBack && <BackButton onClick={onBack} />}
          <PrimaryButton onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </PrimaryButton>
        </div>
      </section>
    </div>
  )
}
