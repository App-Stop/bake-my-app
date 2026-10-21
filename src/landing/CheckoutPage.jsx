import { useState } from 'react'
import { Link } from '../components/Link'
import { ROUTES, navigate } from '../router'
import { asset } from './styles'

const checkoutAsset = (name) => asset(`checkout/${name}`)

function SummaryRow({ label, value, muted = false }) {
  return (
    <div className={`flex items-start justify-between text-[14px] leading-normal font-medium ${muted ? 'text-white/80' : 'text-white'}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  )
}

function SummaryPanel({ plan, price }) {
  return (
    <section className="flex justify-center bg-[#232050] px-6 py-12 text-white lg:w-1/2 lg:justify-end lg:pt-[96px] lg:pr-[120px] lg:pb-10">
      <div className="flex w-full max-w-[400px] flex-col gap-8">
        <Link to={ROUTES.pricing} aria-label="Back to pricing" className="flex items-center gap-3 self-start">
          <img src={checkoutAsset('back.svg')} alt="" width={20} height={20} />
          <img src={checkoutAsset('logo.svg')} alt="Bake my App" width={49.412} height={36} />
        </Link>
        <div className="flex flex-col gap-1.5 whitespace-nowrap">
          <p className="text-[16px] font-medium text-white/80">Subscribe to {plan}</p>
          <div className="flex items-baseline gap-2">
            <strong className="text-[36px] leading-normal font-semibold">$0.00</strong>
            <span className="text-[14px] font-medium text-white/70">due today</span>
          </div>
          <p className="text-[14px] text-white/70">Then ${price}.00 per month starting November 20, 2026</p>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <strong className="text-[14px] font-medium">Bake my App · {plan}</strong>
              <span className="text-[12px] text-white/65">Billed monthly</span>
            </div>
            <span className="text-[14px] font-medium">${price}.00</span>
          </div>
          <div className="h-px bg-white/20" />
          <SummaryRow label="Subtotal" value={`$${price}.00`} />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 self-start rounded-md bg-white/20 px-2 py-1 text-[12px] font-semibold">
                <img src={checkoutAsset('tag.svg')} alt="" width={14} height={14} />
                FIRSTMONTH
                <img src={checkoutAsset('close.svg')} alt="" width={12} height={12} />
              </span>
              <span className="text-[12px] text-white/65">100% off for 1 month</span>
            </div>
            <span className="text-[14px] font-medium">–${price}.00</span>
          </div>
          <SummaryRow label="Tax" value="$0.00" muted />
          <div className="h-px bg-white/20" />
          <SummaryRow label="Total due today" value="$0.00" />
        </div>
        <div className="flex items-center gap-4 pt-4 text-[12px] text-white/60 lg:mt-auto">
          <span className="font-medium">Powered by stripe</span><span className="h-3.5 w-px bg-white/30" />
          <Link to={ROUTES.comingSoon}>Terms</Link><Link to={ROUTES.comingSoon}>Privacy</Link>
        </div>
      </div>
    </section>
  )
}

function Wallets() {
  return (
    <div className="flex h-11 w-full gap-3">
      <button type="button" className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md bg-black text-[17px] font-semibold text-white">
        <img src={checkoutAsset('apple.svg')} alt="Apple" width={16.842} height={20} /> Pay
      </button>
      <button type="button" className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md bg-black text-[17px] font-semibold text-white">
        <span className="relative size-[21px] overflow-hidden">
          {['google-1.svg', 'google-2.svg', 'google-3.svg', 'google-4.svg'].map((name) => <img key={name} src={checkoutAsset(name)} alt="" width={21} height={21} className="absolute inset-0" />)}
        </span>
        Pay
      </button>
      <button type="button" className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md bg-[#00d66f] text-[#011e0f]">
        <span className="text-[14px] font-medium">Pay with</span><strong className="text-[17px]">link</strong>
      </button>
    </div>
  )
}

const inputClass = 'h-11 w-full border border-[#e0e0e0] bg-white px-3 text-[15px] text-[#30313d] shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#87888f] focus:z-10 focus:border-primary'

function Label({ children }) {
  return <label className="flex flex-col gap-1.5 text-[14px] leading-normal font-medium text-[#30313d]">{children}</label>
}

function PaymentForm({ price }) {
  const [save, setSave] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    navigate(ROUTES.app)
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-[440px] flex-col gap-6" aria-label="Payment details">
      <Wallets />
      <div className="flex items-center gap-3 text-[14px] text-[#6d6e78]"><span className="h-px flex-1 bg-black/10" /><span>Or pay with card</span><span className="h-px flex-1 bg-black/10" /></div>
      <Label>Email<input required type="email" defaultValue="owner@sunrisebakery.com" className={`${inputClass} rounded-md font-normal`} /></Label>
      <Label>
        Card information
        <span className="flex flex-col">
          <span className="relative flex">
            <input required inputMode="numeric" placeholder="1234 1234 1234 1234" className={`${inputClass} rounded-t-md pr-36 font-normal`} />
            <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 gap-1 text-[9px] font-bold text-white">
              <i className="rounded-[3px] bg-[#1a1f71] px-1 py-0.5 not-italic">VISA</i><i className="rounded-[3px] bg-[#eb001b] px-1 py-0.5 not-italic">MC</i><i className="rounded-[3px] bg-[#2e77bc] px-1 py-0.5 not-italic">AMEX</i><i className="rounded-[3px] bg-[#f58220] px-1 py-0.5 not-italic">DISC</i>
            </span>
          </span>
          <span className="-mt-px flex">
            <input required placeholder="MM / YY" className={`${inputClass} w-1/2 rounded-bl-md font-normal`} />
            <span className="relative -ml-px w-1/2"><input required placeholder="CVC" className={`${inputClass} rounded-br-md pr-11 font-normal`} /><img src={checkoutAsset('cvc.svg')} alt="" width={24} height={16} className="pointer-events-none absolute top-3.5 right-3" /></span>
          </span>
        </span>
      </Label>
      <Label>Cardholder name<input required placeholder="Full name on card" className={`${inputClass} rounded-md font-normal`} /></Label>
      <Label>
        Country or region
        <span className="flex flex-col">
          <span className="relative"><select defaultValue="United States" className={`${inputClass} appearance-none rounded-t-md font-normal`}><option>United States</option><option>Canada</option><option>United Kingdom</option></select><img src={checkoutAsset('chevron.svg')} alt="" width={12} height={12} className="pointer-events-none absolute top-4 right-3" /></span>
          <input required placeholder="ZIP" className={`${inputClass} -mt-px rounded-b-md font-normal`} />
        </span>
      </Label>
      <button type="button" onClick={() => setSave(!save)} className="flex w-full items-start gap-3 rounded-md border border-[#e0e0e0] px-4 py-3.5 text-left">
        <span className={`mt-px flex size-4 shrink-0 items-center justify-center rounded border ${save ? 'border-primary bg-primary text-white' : 'border-[#87888f] bg-white'}`}>{save ? '✓' : ''}</span>
        <span className="flex flex-col gap-0.5"><strong className="text-[14px] font-medium text-[#30313d]">Save my information for faster checkout</strong><span className="text-[13px] leading-normal text-[#6d6e78]">Pay securely at Bake my App and everywhere Link is accepted.</span></span>
      </button>
      <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-[16px] font-semibold text-white shadow-[0_4px_12px_rgba(84,77,242,0.25)]">
        <img src={checkoutAsset('lock.svg')} alt="" width={14} height={14} /> Start trial
      </button>
      <p className="text-center text-[12px] leading-normal text-[#6d6e78]">By subscribing, you authorize Bake my App to charge you ${price}.00 per month starting November 20, 2026, according to their terms, until you cancel. You can cancel anytime before then and won’t be charged.</p>
    </form>
  )
}

export function CheckoutPage() {
  const requestedPlan = new URLSearchParams(window.location.search).get('plan')
  const growth = requestedPlan === 'growth'
  const plan = growth ? 'Growth' : 'Startup'
  const price = growth ? 249 : 99

  return (
    <main className="flex min-h-dvh flex-col bg-white font-inter lg:flex-row">
      <SummaryPanel plan={plan} price={price} />
      <div className="flex justify-center px-6 py-12 lg:w-1/2 lg:justify-start lg:pt-[96px] lg:pl-[120px]">
        <PaymentForm price={price} />
      </div>
    </main>
  )
}
