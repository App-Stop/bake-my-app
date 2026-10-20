import { useMemo, useState } from 'react'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { Deco } from '../ui'
import { CONTAINER, TYPE } from '../styles'

const WEEKS_PER_YEAR = 52
const MONTHS_PER_YEAR = 12
const GROWTH_MONTHLY_PRICE = 249
const GROWTH_ANNUAL_COST = GROWTH_MONTHLY_PRICE * MONTHS_PER_YEAR

const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const SLIDERS = [
  {
    id: 'orders',
    label: 'Orders per week on delivery apps',
    min: 10,
    max: 250,
    step: 10,
    initial: 150,
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'orderValue',
    label: 'Average Order value',
    min: 5,
    max: 45,
    step: 1,
    initial: 25,
    format: (value) => MONEY.format(value),
  },
  {
    id: 'commission',
    label: 'Commission the app charges',
    min: 10,
    max: 30,
    step: 1,
    initial: 25,
    format: (value) => `${value}%`,
  },
  {
    id: 'moved',
    label: 'Orders to move to your own app',
    min: 0,
    max: 100,
    step: 5,
    initial: 25,
    format: (value) => `${value}%`,
  },
]

function CalculatorSlider({ config, value, onChange }) {
  const progress = ((value - config.min) / (config.max - config.min)) * 100

  return (
    <div className="flex min-h-[calc(134*var(--px))] w-full flex-1 flex-col justify-center gap-5 overflow-hidden rounded-[calc(40*var(--px))] bg-primary-light p-[max(20*var(--m),30*var(--u))]">
      <div className="flex w-full items-center gap-5">
        <label
          htmlFor={`cost-${config.id}`}
          className="min-w-0 flex-1 text-base leading-normal font-semibold text-ink"
        >
          {config.label}
        </label>
        <output
          htmlFor={`cost-${config.id}`}
          className="shrink-0 font-malibu text-[length:max(18*var(--m),20*var(--u))] leading-normal text-primary"
        >
          {config.format(value)}
        </output>
      </div>
      <input
        id={`cost-${config.id}`}
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="cost-calculator-range"
        style={{ '--range-progress': `${progress}%` }}
      />
    </div>
  )
}

function ResultRow({ label, value }) {
  return (
    <div className="flex w-full items-start justify-between gap-4 text-base leading-normal text-white">
      <span className="min-w-0 font-normal">{label}</span>
      <strong className="shrink-0 text-right font-semibold">{value}</strong>
    </div>
  )
}

export function CostCalculator() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(SLIDERS.map((slider) => [slider.id, slider.initial])),
  )

  const calculation = useMemo(() => {
    const annualOrderRevenue = values.orders * values.orderValue * WEEKS_PER_YEAR
    const commissionLostYear = annualOrderRevenue * (values.commission / 100)
    const commissionLostMonth = commissionLostYear / MONTHS_PER_YEAR
    const commissionRecoveredYear = commissionLostYear * (values.moved / 100)
    const netAnnualSavings = Math.max(0, commissionRecoveredYear - GROWTH_ANNUAL_COST)
    const recoveredPerMonth = commissionRecoveredYear / MONTHS_PER_YEAR
    const paybackMonths = recoveredPerMonth > 0 ? GROWTH_ANNUAL_COST / recoveredPerMonth : Infinity

    return {
      commissionLostMonth,
      commissionLostYear,
      netAnnualSavings,
      payback:
        paybackMonths <= 1
          ? 'Under 1 Month'
          : Number.isFinite(paybackMonths)
            ? `${Math.ceil(paybackMonths)} Months`
            : '—',
    }
  }, [values])

  const savings = MONEY.format(Math.round(calculation.netAnnualSavings))

  return (
    <section
      id="cost-calculator"
      aria-labelledby="cost-calculator-title"
      className="relative mt-[max(110*var(--m),160*var(--u))] mb-[max(96*var(--m),144*var(--u))] scroll-mt-10"
    >
      <Deco src="deco-croissant.svg" x={1796} y={-49.5} />
      <div className={CONTAINER}>
        <div className="mx-auto flex w-full max-w-[calc(1308*var(--px))] flex-col items-center gap-[max(32*var(--m),40*var(--u))]">
          <div className="flex w-full max-w-[calc(810*var(--px))] flex-col items-center gap-[max(20*var(--m),30*var(--u))] text-center text-ink">
            <h2 id="cost-calculator-title" className={TYPE.h2}>
              how much are delivery apps costing you?
            </h2>
            <p className={TYPE.body}>Move the sliders to see what you&apos;d keep.</p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-8 lg:flex-row lg:justify-between lg:gap-0">
            <div className="flex w-full flex-col gap-2.5 lg:w-[calc(644*var(--px))]">
              {SLIDERS.map((slider) => (
                <CalculatorSlider
                  key={slider.id}
                  config={slider}
                  value={values[slider.id]}
                  onChange={(value) => setValues((current) => ({ ...current, [slider.id]: value }))}
                />
              ))}
            </div>

            <div className="flex min-h-[calc(566*var(--px))] w-full flex-col justify-between gap-8 overflow-hidden rounded-[calc(40*var(--px))] bg-primary px-[max(24*var(--m),40*var(--u))] py-[max(28*var(--m),36*var(--u))] lg:w-[calc(540*var(--px))]">
              <div className="flex flex-col gap-5 text-white">
                <p className="text-[length:max(20*var(--m),24*var(--u))] leading-normal font-semibold">
                  You could save upto
                </p>
                <div className="flex flex-col">
                  <p
                    aria-live="polite"
                    className="font-malibu text-[length:max(48*var(--m),64*var(--u))] leading-normal"
                  >
                    {savings}
                  </p>
                  <p className="text-base leading-normal opacity-80">every year with Bake my App Growth</p>
                </div>
              </div>

              <ResultRow label="Commission lost per month" value={MONEY.format(calculation.commissionLostMonth)} />
              <ResultRow label="Commission lost per year" value={MONEY.format(calculation.commissionLostYear)} />
              <ResultRow label="Bake my app growth per year" value={MONEY.format(GROWTH_ANNUAL_COST)} />
              <ResultRow label="Pays for itself in" value={calculation.payback} />

              <div className="flex w-full flex-col gap-4">
                <Link
                  to={ROUTES.app}
                  className="flex w-full items-center justify-center rounded-full bg-white p-5 text-[length:max(18*var(--m),20*var(--u))] leading-normal font-semibold text-primary transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Keep my {savings}
                </Link>
                <p className="text-center text-sm leading-normal italic text-white opacity-80">
                  Estimate only. Actual saving depend on your fees and order mix
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
