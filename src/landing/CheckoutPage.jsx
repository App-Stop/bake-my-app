import { useEffect, useId, useRef, useState } from 'react'
import { Honeypot } from '../components/Honeypot'
import { Link } from '../components/Link'
import { ApiError, api } from '../lib/api'
import { CHECKOUT_PLANS, formatDaysFromNow, formatMoney, priceForInterval, usePlans } from '../lib/plans'
import { readUtm } from '../lib/utm'
import { ROUTES, navigate, useSearchParams } from '../router'
import { asset } from './styles'

const checkoutAsset = (name) => asset(`checkout/${name}`)

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

function SummaryRow({ label, value, muted = false }) {
  return (
    <div className={`flex items-start justify-between gap-4 text-[length:max(12px,calc(14*var(--u)))] leading-normal font-medium ${muted ? 'text-white/80' : 'text-white'}`}>
      <span>{label}</span><span className="whitespace-nowrap">{value}</span>
    </div>
  )
}

function SummaryPanel({ name, terms, loading }) {
  const placeholder = '—'
  return (
    <section className="flex justify-center bg-[#232050] px-6 py-12 text-white lg:w-1/2 lg:justify-end lg:pt-[calc(96*var(--u))] lg:pr-[calc(120*var(--u))] lg:pb-10">
      <div className="flex w-full max-w-[calc(400*var(--u))] flex-col gap-8" aria-busy={loading}>
        <Link to={ROUTES.pricing} aria-label="Back to pricing" className="flex items-center gap-3 self-start">
          <img src={checkoutAsset('back.svg')} alt="" width={20} height={20} />
          <img src={checkoutAsset('logo.svg')} alt="Bake my App" width={49.412} height={36} />
        </Link>
        <div className="flex flex-col gap-1.5">
          <p className="text-[length:max(12px,calc(16*var(--u)))] font-medium text-white/80">Subscribe to {name}</p>
          <div className="flex items-baseline gap-2">
            <strong className="text-[length:max(12px,calc(36*var(--u)))] leading-normal font-semibold">{terms?.dueToday ?? placeholder}</strong>
            <span className="text-[length:max(12px,calc(14*var(--u)))] font-medium text-white/70">due today</span>
          </div>
          <p className="text-[length:max(12px,calc(14*var(--u)))] text-white/70">
            {!terms
              ? loading ? 'Loading plan details…' : 'Plan details are unavailable right now.'
              : terms.trial
                ? `Then ${terms.amount} per ${terms.per} starting ${terms.chargeDate}`
                : `Then ${terms.amount} per ${terms.per}`}
          </p>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <strong className="text-[length:max(12px,calc(14*var(--u)))] font-medium">Bake my App · {name}</strong>
              <span className="text-[length:max(12px,calc(12*var(--u)))] text-white/65">{terms?.billed ?? placeholder}</span>
            </div>
            <span className="text-[length:max(12px,calc(14*var(--u)))] font-medium whitespace-nowrap">{terms?.amount ?? placeholder}</span>
          </div>
          <div className="h-px bg-white/20" />
          <SummaryRow label="Subtotal" value={terms?.amount ?? placeholder} />
          {terms?.trial && <SummaryRow label={`${terms.trialDays}-day free trial`} value={`–${terms.amount}`} muted />}
          <div className="h-px bg-white/20" />
          <SummaryRow label="Total due today" value={terms?.dueToday ?? placeholder} />
        </div>
        <div className="flex items-center gap-4 pt-4 text-[length:max(12px,calc(12*var(--u)))] text-white/60 lg:mt-auto">
          <span className="font-medium">Powered by stripe</span><span className="h-3.5 w-px bg-white/30" />
          <Link to={ROUTES.comingSoon}>Terms</Link><Link to={ROUTES.comingSoon}>Privacy</Link>
        </div>
      </div>
    </section>
  )
}

const inputClass = 'h-11 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-[length:max(12px,calc(15*var(--u)))] font-normal text-[#30313d] shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#87888f] focus:border-primary aria-invalid:border-red-600'
const errorClass = 'text-[length:max(12px,calc(13*var(--u)))] leading-normal font-normal text-red-600'
const textClass = 'text-[length:max(12px,calc(12*var(--u)))] leading-normal text-[#6d6e78]'

function Field({ label, error, errorId, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex flex-col gap-1.5 text-[length:max(12px,calc(14*var(--u)))] leading-normal font-medium text-[#30313d]">
        {label}
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
      aria-label="Your details"
      aria-busy={sending}
      className="relative flex w-full max-w-[calc(440*var(--u))] flex-col gap-6"
    >
      <Honeypot />
      <Field label="Email" {...fieldError('email')}>
        <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@yourbakery.com" className={inputClass} {...errorProps('email')} />
      </Field>
      <Field label="Your name" {...fieldError('name')}>
        <input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Full name" className={inputClass} {...errorProps('name')} />
      </Field>
      <Field label="Business name" {...fieldError('businessName')}>
        <input name="business" maxLength={160} autoComplete="organization" placeholder="Your bakery or café name" className={inputClass} {...errorProps('businessName')} />
      </Field>
      <Field label="Phone or WhatsApp (optional)" {...fieldError('phone')}>
        <input name="phone" type="tel" maxLength={25} autoComplete="tel" placeholder="+92 300 1234567" className={inputClass} {...errorProps('phone')} />
      </Field>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-[length:max(12px,calc(14*var(--u)))] leading-normal text-[#30313d]">
          <input name="consent" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-primary" {...errorProps('consent')} />
          <span>
            I agree to the{' '}
            <a href={ROUTES.comingSoon} target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms</a>
            {' '}and the{' '}
            <a href={ROUTES.comingSoon} target="_blank" rel="noopener noreferrer" className="text-primary underline">Privacy Policy</a>
          </span>
        </label>
        {errors.consent && <span id={`${idPrefix}-consent-error`} role="alert" className={errorClass}>{errors.consent}</span>}
      </div>

      {formError && (
        <p role="alert" className={`${errorClass} text-[length:max(13px,calc(14*var(--u)))]`}>
          {formError.message}{' '}
          {[400, 409].includes(formError.status) && <Link to={ROUTES.contact} className="font-medium underline">Contact us</Link>}
        </p>
      )}

      <button
        type="submit"
        disabled={sending || !terms}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-[length:max(12px,calc(16*var(--u)))] font-semibold text-white shadow-[0_4px_12px_rgba(84,77,242,0.25)] transition disabled:cursor-not-allowed disabled:opacity-70 aria-busy:cursor-wait"
        aria-busy={sending}
      >
        <img src={checkoutAsset('lock.svg')} alt="" width={14} height={14} />
        {sending ? 'Redirecting to secure payment…' : 'Continue to secure payment'}
      </button>
      <p className={`text-center ${textClass}`}>
        {!terms
          ? 'You will enter your card on Stripe’s secure page.'
          : terms.trial
            ? `You will enter your card on Stripe’s secure page. You will not be charged until ${terms.chargeDate}. Cancel anytime before then.`
            : `You will enter your card on Stripe’s secure page and be charged ${terms.amount} today, then every ${terms.per} until you cancel.`}
      </p>
    </form>
  )
}

function CheckoutUnavailable() {
  return (
    <div role="alert" className="flex w-full max-w-[calc(440*var(--u))] flex-col gap-4 rounded-md border border-[#e0e0e0] p-6 text-[length:max(13px,calc(15*var(--u)))] leading-normal text-[#30313d]">
      <p>Online checkout is not available right now. Please contact us and we&apos;ll get you set up.</p>
      <Link to={ROUTES.contact} className="self-start rounded-md bg-primary px-5 py-3 font-semibold text-white">
        Contact us
      </Link>
    </div>
  )
}

/** `/checkout?plan=<startup|growth>&interval=<month|year>`: collects contact details, then hands off to Stripe Checkout. */
export function CheckoutPage() {
  const params = useSearchParams()
  const planKey = params.get('plan')
  const interval = INTERVALS.includes(params.get('interval')) ? params.get('interval') : 'year'
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
    <main className="checkout-page flex min-h-dvh flex-col bg-white font-inter lg:flex-row">
      <SummaryPanel name={name} terms={terms} loading={!plans && !failed} />
      <div className="flex justify-center px-6 py-12 lg:w-1/2 lg:justify-start lg:pt-[calc(96*var(--u))] lg:pl-[calc(120*var(--u))]">
        {unavailable ? <CheckoutUnavailable /> : <CheckoutForm planKey={planKey} interval={interval} terms={terms} />}
      </div>
    </main>
  )
}
