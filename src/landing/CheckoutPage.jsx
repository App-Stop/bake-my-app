import { GoldDecorations } from './GoldDecorations'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft02Icon, SquareLock02Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Honeypot } from '../components/Honeypot'
import { Link } from '../components/Link'
import { ApiError, api } from '../lib/api'
import { CHECKOUT_PLANS, formatDaysFromNow, formatMoney, priceForInterval, usePlans } from '../lib/plans'
import { readUtm } from '../lib/utm'
import { ROUTES, navigate, useSearchParams } from '../router'
import { readSavedContact } from '../onboarding/useOnboardingState'
import { Icon } from './ui'
import { asset } from './styles'

const INTERVALS = ['month', 'year']
const FALLBACK_NAMES = { startup: 'Startup', growth: 'Growth' } // shown while the plans load
const FIELD_NAMES = ['email', 'name', 'businessName', 'phone', 'consent'] // API fields with an input here

/** Only ever send the visitor to Stripe over HTTPS, whatever the API returns. */
function isStripeUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && (url.hostname === 'stripe.com' || url.hostname.endsWith('.stripe.com'))
  } catch {
    return false
  }
}

/** What the visitor pays and when, from the API price. The server decides the real charge; this only describes it. */
function checkoutTerms(price, interval) {
  const trial = price.trialDays > 0
  const money = (cents) => formatMoney(cents, price.currency, true)
  return {
    trial,
    trialDays: price.trialDays,
    amount: money(price.amount),
    dueToday: money(trial ? 0 : price.amount),
    chargeDate: trial ? formatDaysFromNow(price.trialDays) : null,
    per: interval === 'year' ? 'year' : 'month',
    billed: interval === 'year' ? 'Billed yearly' : 'Billed monthly',
  }
}

const CARD = 'flex flex-col gap-6 rounded-[32px] bg-white p-6 shadow-[0_12px_40px_rgba(85,76,241,0.08)] sm:p-8'
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const INTERVAL_LABELS = { month: 'Pay monthly', year: 'Pay yearly' }

/** A numbered step heading at the top of a white card. */
function StepHeading({ step, id, title, hint }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
        {step}
      </span>
      <div className="flex flex-col">
        <h2 id={id} className="text-lg leading-tight font-bold text-ink">{title}</h2>
        {hint && <p className="text-sm leading-normal text-muted">{hint}</p>}
      </div>
    </div>
  )
}

/** Lets the visitor change plan and billing without leaving checkout; the form keeps what they typed. */
function PlanSwitcher({ plans, planKey, interval, onChange }) {
  return (
    <section className={CARD} aria-labelledby="checkout-plan-title">
      <StepHeading step={1} id="checkout-plan-title" title="Choose your plan" hint="Switch plans or billing whenever you like." />
      <div role="radiogroup" aria-label="Plan" className="grid gap-3 sm:grid-cols-2">
        {CHECKOUT_PLANS.map((key) => {
          const active = key === planKey
          const price = priceForInterval(plans, key, interval)
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange({ plan: key, interval })}
              className={`relative flex flex-col items-start gap-1 rounded-[24px] border-2 py-4 pr-12 pl-5 text-left transition-colors ${FOCUS} ${
                active ? 'border-primary bg-primary-light' : 'border-line bg-white hover:border-primary/40'
              }`}
            >
              <span className="text-base font-bold text-ink">{plans?.[key]?.name ?? FALLBACK_NAMES[key]}</span>
              <span className="text-sm text-body">
                {price ? (
                  <><strong className="font-semibold text-primary">{formatMoney(price.monthlyEquivalent, price.currency)}</strong> / month</>
                ) : ' '}
              </span>
              <span
                aria-hidden="true"
                className={`absolute top-4 right-4 flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                  active ? 'border-primary bg-primary text-white' : 'border-line-strong bg-white text-transparent'
                }`}
              >
                <Icon icon={Tick02Icon} size={14} strokeWidth={3} />
              </span>
            </button>
          )
        })}
      </div>
      <div role="radiogroup" aria-label="Billing" className="grid grid-cols-2 rounded-full bg-surface p-1.5">
        {INTERVALS.map((key) => {
          const active = key === interval
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange({ plan: planKey, interval: key })}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${FOCUS} ${
                active ? 'bg-primary text-white shadow-[0_4px_12px_rgba(85,76,241,0.3)]' : 'text-body hover:text-ink'
              }`}
            >
              {INTERVAL_LABELS[key]}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ReceiptRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm leading-normal text-white/85">
      <span>{label}</span><span className="whitespace-nowrap">{value}</span>
    </div>
  )
}

/** The order "ticket": a purple receipt with a scalloped bottom edge. */
function OrderSummary({ name, terms, loading, className = '' }) {
  const placeholder = '—'
  return (
    <aside
      aria-label="Order summary"
      aria-busy={loading}
      className={`relative overflow-hidden rounded-t-[32px] bg-primary px-6 pt-8 pb-12 text-white sm:px-8 ${className}`}
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">Your order</p>
      <h2 className="mt-2 font-malibu text-4xl leading-tight font-normal">{name}</h2>
      <p className="text-sm text-white/75">
        {terms?.billed ?? (loading ? 'Loading plan details…' : 'Plan details are unavailable right now.')}
      </p>

      <div className="my-6 border-t-2 border-dashed border-white/25" />
      <div className="flex flex-col gap-3">
        <ReceiptRow label={`Bake my App · ${name}`} value={terms?.amount ?? placeholder} />
        {terms?.trial && <ReceiptRow label={`${terms.trialDays}-day free trial`} value={`–${terms.amount}`} />}
      </div>
      <div className="my-6 border-t-2 border-dashed border-white/25" />

      <div className="flex items-end justify-between gap-4">
        <span className="text-sm font-semibold">Due today</span>
        <strong className="text-4xl leading-none font-bold">{terms?.dueToday ?? placeholder}</strong>
      </div>
      {terms && (
        <p className="mt-5 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-normal text-white/90">
          {terms.trial
            ? `Free until ${terms.chargeDate}, then ${terms.amount} per ${terms.per}.`
            : `Then ${terms.amount} every ${terms.per}.`}{' '}
          Cancel anytime.
        </p>
      )}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3 bg-[radial-gradient(circle_at_50%_100%,var(--color-primary-light)_8px,transparent_8.5px)] bg-[length:22px_12px] bg-repeat-x"
      />
    </aside>
  )
}

const inputClass = 'h-12 w-full rounded-full border-2 border-transparent bg-surface px-5 text-sm font-normal text-ink outline-none transition-colors placeholder:text-placeholder hover:border-line focus:border-primary focus:bg-white aria-invalid:border-red-500 aria-invalid:bg-red-50'
const errorClass = 'px-1 text-xs leading-normal font-normal text-red-600'
const textClass = 'text-xs leading-normal text-muted'

function Field({ label, error, errorId, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label className="flex flex-col gap-2 text-sm leading-normal font-semibold text-ink">
        <span className="px-1">{label}</span>
        {children}
      </label>
      {error && <span id={errorId} role="alert" className={errorClass}>{error}</span>}
    </div>
  )
}

function CheckoutForm({ planKey, interval, terms }) {
  const idPrefix = useId()
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null) // { message, status }
  const inFlight = useRef(false) // blocks a second submit before the disabled state renders
  const [saved] = useState(readSavedContact) // details already given in the setup form

  // Coming back from Stripe with the browser's Back button restores this page with the
  // button still disabled. Re-enable it.
  useEffect(() => {
    const onShow = (event) => {
      if (!event.persisted) return
      inFlight.current = false
      setSending(false)
    }
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  const errorProps = (name) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${idPrefix}-${name}-error` : undefined,
  })
  const fieldError = (name) => ({ error: errors[name], errorId: `${idPrefix}-${name}-error` })

  // Editing a field clears its error.
  function clearError(event) {
    const name = event.target.name === 'business' ? 'businessName' : event.target.name
    if (!name || !errors[name]) return
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  async function submit(event) {
    event.preventDefault()
    if (inFlight.current || !terms) return
    const data = new FormData(event.currentTarget)

    inFlight.current = true
    setSending(true)
    setErrors({})
    setFormError(null)
    try {
      // No price, amount or trial is sent: the server decides them from the plan and interval.
      const { data: session } = await api.post('/v1/billing/checkout-sessions', {
        planKey,
        billingInterval: interval,
        email: String(data.get('email') || '').trim(),
        name: data.get('name'),
        businessName: data.get('business'),
        phone: data.get('phone'),
        consent: data.get('consent') === 'on',
        website: data.get('website'), // honeypot, must stay empty
        utm: readUtm(),
      })
      if (!isStripeUrl(session?.url)) throw new ApiError('Something went wrong. Please try again.')
      window.location.assign(session.url) // leave the button disabled: the page is closing
    } catch (error) {
      const fieldErrors = error.fieldErrors ?? {}
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).some((name) => FIELD_NAMES.includes(name))) {
        setFormError({ message: error.message || 'Something went wrong. Please try again.', status: error.status })
      }
      inFlight.current = false
      setSending(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      onChange={clearError}
      aria-labelledby="checkout-details-title"
      aria-busy={sending}
      className={`relative ${CARD}`}
    >
      <StepHeading step={2} id="checkout-details-title" title="Tell us about your bakery" hint="We’ll use this to set up your account." />
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" {...fieldError('name')}>
          <input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Full name" className={inputClass} {...errorProps('name')} />
        </Field>
        <Field label="Business name" {...fieldError('businessName')}>
          <input name="business" maxLength={160} autoComplete="organization" placeholder="Your bakery or café" defaultValue={saved.businessName} className={inputClass} {...errorProps('businessName')} />
        </Field>
        <Field label="Email" {...fieldError('email')}>
          <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@yourbakery.com" defaultValue={saved.email} className={inputClass} {...errorProps('email')} />
        </Field>
        <Field label="Phone or WhatsApp (optional)" {...fieldError('phone')}>
          <input name="phone" type="tel" maxLength={25} autoComplete="tel" placeholder="+92 300 1234567" defaultValue={saved.phone} className={inputClass} {...errorProps('phone')} />
        </Field>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm leading-normal text-body">
          <input
            name="consent"
            type="checkbox"
            required
            className="contact-consent mt-0.5 size-5 shrink-0 appearance-none rounded-[6px] border-[1.5px] border-line-strong bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            {...errorProps('consent')}
          />
          <span>
            I agree to the{' '}
            <a href={ROUTES.comingSoon} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Terms</a>
            {' '}and the{' '}
            <a href={ROUTES.comingSoon} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Privacy Policy</a>
          </span>
        </label>
        {errors.consent && <span id={`${idPrefix}-consent-error`} role="alert" className={errorClass}>{errors.consent}</span>}
      </div>

      {formError && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-normal text-red-700">
          {formError.message}{' '}
          {[400, 409].includes(formError.status) && <Link to={ROUTES.contact} className="font-semibold underline">Contact us</Link>}
        </p>
      )}

      <button
        type="submit"
        disabled={sending || !terms}
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white shadow-[0_8px_24px_rgba(85,76,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(85,76,241,0.4)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 aria-busy:cursor-wait ${FOCUS}`}
        aria-busy={sending}
      >
        <Icon icon={SquareLock02Icon} size={18} />
        {sending ? 'Taking you to payment…' : terms?.trial ? 'Start my free trial' : 'Continue to payment'}
      </button>
      <p className={`text-center ${textClass}`}>
        {!terms
          ? 'Card details are entered on a secure page from our payment partner, Stripe.'
          : terms.trial
            ? `Card details are entered on a secure page from our payment partner, Stripe. You won’t be charged until ${terms.chargeDate}. Cancel anytime before then.`
            : `Card details are entered on a secure page from our payment partner, Stripe. You’ll be charged ${terms.amount} today, then every ${terms.per} until you cancel.`}
      </p>
    </form>
  )
}

function CheckoutUnavailable() {
  return (
    <div role="alert" className={`${CARD} text-base leading-normal text-body`}>
      <p>Online checkout is not available right now. Please contact us and we&apos;ll get you set up.</p>
      <Link to={ROUTES.contact} className={`self-start rounded-full bg-primary px-6 py-3 font-semibold text-white ${FOCUS}`}>
        Contact us
      </Link>
    </div>
  )
}

const DEFAULT_PLAN = 'growth'

/**
 * `/checkout?plan=<startup|growth>&interval=<month|year>`: collects contact details, then hands off to Stripe Checkout.
 * With no plan in the URL it opens on Growth; the visitor can switch plan and billing here.
 */
export function CheckoutPage() {
  const params = useSearchParams()
  const planKey = params.get('plan') ?? DEFAULT_PLAN
  const interval = INTERVALS.includes(params.get('interval')) ? params.get('interval') : 'year'

  // Swap the URL in place (no new history entry, no scroll jump) so a reload or share keeps the choice.
  const choosePlan = ({ plan, interval: nextInterval }) => {
    window.history.replaceState(window.history.state, '', `${ROUTES.checkout}?plan=${plan}&interval=${nextInterval}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  const validPlan = CHECKOUT_PLANS.includes(planKey)
  const { plans, failed } = usePlans()

  // Business Suite is sold by quote and anything else isn't a plan: back to the plan cards.
  useEffect(() => {
    if (!validPlan) navigate(ROUTES.pricing, { replace: true })
  }, [validPlan])

  if (!validPlan) return null

  const price = priceForInterval(plans, planKey, interval)
  const unavailable = failed || (plans && !price?.purchasable)
  const terms = price ? checkoutTerms(price, interval) : null
  const name = plans?.[planKey]?.name ?? FALLBACK_NAMES[planKey]

  return (
    <main className="checkout-page min-h-dvh bg-primary-light font-sans text-ink">
      <GoldDecorations variant={4} />
      <div className="relative mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 pt-6 pb-16 sm:px-6 lg:gap-10 lg:pt-8">
        <header className="flex items-center justify-between gap-4">
          <Link to={ROUTES.home} aria-label="Bake my App home" className="shrink-0">
            <img src={asset('pricing-page/nav-logo.svg')} alt="Bake my App" width={69} height={50} className="h-auto w-[56px] sm:w-[69px]" />
          </Link>
          <Link
            to={ROUTES.pricing}
            className={`flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-colors hover:text-primary ${FOCUS}`}
          >
            <Icon icon={ArrowLeft02Icon} size={18} />
            Back to plans
          </Link>
        </header>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-malibu text-[40px] leading-[1.15] font-normal text-primary sm:text-[56px]">almost ready to bake</h1>
          <p className="max-w-[520px] text-base leading-normal text-body">
            Pick your plan, tell us about your bakery, and we’ll get your app in the oven.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <PlanSwitcher plans={plans} planKey={planKey} interval={interval} onChange={choosePlan} />
          <OrderSummary
            name={name}
            terms={terms}
            loading={!plans && !failed}
            className="lg:sticky lg:top-8 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          />
          {unavailable ? <CheckoutUnavailable /> : <CheckoutForm planKey={planKey} interval={interval} terms={terms} />}
        </div>
      </div>
    </main>
  )
}
