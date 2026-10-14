import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { ROUTES, navigate } from '../router'
import { asset } from './styles'
import { ModalsContext } from './useModals'

export function ModalsProvider({ children }) {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const value = useMemo(
    () => ({ openPromo: () => setOpen('promo'), openDemo: () => setOpen('demo'), close }),
    [close],
  )

  return (
    <ModalsContext.Provider value={value}>
      {children}
      {open === 'promo' && <PromoModal onClose={close} />}
      {open === 'demo' && <DemoModal onClose={close} />}
    </ModalsContext.Provider>
  )
}

/**
 * Centered dialog over a dimmed page. Sizes use `--px` (inside `.landing-page`), so the Figma
 * 1920 sizes scale down with the viewport on desktop and stay 1× below it.
 */
function Modal({ label, onClose, className = '', children }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus({ preventScroll: true })
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [onClose])

  return (
    <div className="landing-page fixed inset-0 z-[100] overflow-y-auto bg-black/60 font-sans text-ink backdrop-blur-sm">
      <div
        className="flex min-h-full items-center justify-center px-4 pt-32 pb-6 lg:py-[calc(140*var(--px))]"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          className={`relative rounded-[calc(40*var(--px))] bg-white shadow-[0_calc(20*var(--px))_calc(60*var(--px))_rgba(0,0,0,0.3)] outline-none ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function CloseButton({ onClose, className }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className={`absolute z-10 size-[calc(32*var(--px))] transition-opacity hover:opacity-60 ${className}`}
    >
      <img src={asset('promo/close.svg')} alt="" width={32} height={32} className="size-full" />
    </button>
  )
}

/** "first month, completely free!" popup (Figma "Popup"). */
function PromoModal({ onClose }) {
  const titleId = useId()
  const [email, setEmail] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onClose()
    navigate(ROUTES.app)
  }

  return (
    <Modal
      label="First month free offer"
      onClose={onClose}
      className="flex w-[min(calc(500*var(--px)),100%)] flex-col gap-10 px-10 pt-[calc(120*var(--px))] pb-10"
    >
      <CloseButton onClose={onClose} className="top-[calc(30*var(--px))] right-[calc(30*var(--px))]" />
      {/* Waving mascot pokes out above the card (217×218 in Figma). */}
      <img
        src={asset('promo/mascot.png')}
        alt=""
        aria-hidden="true"
        width={217}
        height={218}
        className="pointer-events-none absolute top-[calc(-106*var(--px))] left-[calc(50%-0.5*var(--px))] h-[calc(218*var(--px))] w-[calc(217*var(--px))] max-w-none -translate-x-1/2 object-contain select-none"
      />
      <div className="flex w-full flex-col items-center gap-5 text-center leading-normal">
        <h2 id={titleId} className="w-full font-malibu text-[length:calc(36*var(--px))] font-normal text-primary">
          first month, completely free!
        </h2>
        <p className="w-full text-base text-ink opacity-80">
          Get your bakery managed and live with all the tools and perks you need—plus your first month free.
        </p>
      </div>
      <form onSubmit={submit} aria-labelledby={titleId} className="flex w-full flex-col gap-2.5">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          aria-label="Email address"
          className="w-full rounded-full bg-primary-light px-10 py-5 text-center text-base leading-normal text-ink shadow-[inset_0_0_0_1px_white] outline-none placeholder:text-ink/40 focus-visible:shadow-[inset_0_0_0_1px_var(--color-primary)]"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-primary px-10 py-5 text-base leading-normal font-semibold text-white transition hover:brightness-110"
        >
          Claim Offer
        </button>
      </form>
    </Modal>
  )
}

// Each card's artwork, positioned in % of the 392×256 card background.
const WAVES = (
  <div className="pointer-events-none absolute top-0 left-[calc(50%+0.33*var(--px))] h-[213.28%] w-[179.08%] -translate-x-1/2">
    <div className="absolute inset-[0_-43.3%_-56.41%_-43.45%]">
      <img src={asset('demo/card-waves.svg')} alt="" className="block size-full max-w-none" />
    </div>
  </div>
)

const DEMOS = [
  {
    key: 'mobile',
    title: 'Bakery Customer App',
    to: ROUTES.demoMobile,
    art: (
      <>
        <div className="absolute inset-[9.37%_29.85%_-37.24%_29.73%]">
          <img src={asset('demo/card-iphone-frame.png')} alt="" className="absolute inset-0 size-full max-w-none" />
        </div>
        <div className="absolute inset-[11.36%_31.47%_-35.17%_31.32%]">
          <img
            src={asset('demo/card-iphone-screen.png')}
            alt=""
            className="absolute inset-0 size-full max-w-none rounded-[calc(23.178*var(--px))] object-cover"
          />
        </div>
      </>
    ),
  },
  {
    key: 'website',
    title: 'Bakery Customer Website',
    to: ROUTES.demoWebsite,
    art: (
      <div className="absolute top-[calc(50%+46.48%)] left-1/2 h-[174.22%] w-[82.14%] -translate-1/2 overflow-hidden rounded-[calc(10*var(--px))] shadow-[0_calc(6*var(--px))_calc(60*var(--px))_rgba(85,76,241,0.4)]">
        <img src={asset('demo/card-website.png')} alt="" className="absolute top-[0.07%] left-0 h-[171.38%] w-full max-w-none" />
      </div>
    ),
  },
  {
    key: 'admin',
    title: 'Bakery Admin Panel',
    to: ROUTES.demoAdmin,
    art: (
      <div className="absolute top-1/2 left-[calc(50%-0.5*var(--px))] h-[87.5%] w-[82.4%] -translate-1/2 shadow-[0_calc(4*var(--px))_calc(30*var(--px))_rgba(0,0,0,0.1)]">
        <img src={asset('demo/card-admin.png')} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
      </div>
    ),
  },
  {
    key: 'employee',
    title: 'Bakery Employee Panel',
    to: ROUTES.demoStaff,
    art: (
      <div className="absolute top-1/2 left-[calc(50%-0.5*var(--px))] h-[87.5%] w-[82.4%] -translate-1/2 overflow-hidden rounded-[calc(4*var(--px))] shadow-[0_calc(4*var(--px))_calc(30*var(--px))_rgba(0,0,0,0.1)]">
        <img src={asset('demo/card-employee.png')} alt="" className="absolute top-[-5.1%] left-0 h-[107.62%] w-full max-w-none" />
      </div>
    ),
  },
]

/** "preview a demo" picker (Figma "Demo"). */
function DemoModal({ onClose }) {
  const open = (demo) => {
    onClose()
    navigate(demo.to)
  }

  return (
    <Modal
      label="Preview a demo"
      onClose={onClose}
      className="flex w-[min(calc(900*var(--px)),100%)] flex-col items-center gap-10 p-4 sm:p-10"
    >
      <CloseButton onClose={onClose} className="top-4 right-4 sm:top-10 sm:right-10" />
      <h2 className="px-10 font-malibu text-[length:min(calc(40*var(--px)),8vw)] leading-normal font-normal whitespace-nowrap text-primary">
        preview a demo
      </h2>
      <ul className="grid w-full grid-cols-1 gap-5 drop-shadow-[0_calc(10*var(--px))_calc(60*var(--px))_rgba(85,76,241,0.1)] sm:grid-cols-2">
        {DEMOS.map((demo) => (
          <li key={demo.key}>
            <button
              type="button"
              onClick={() => open(demo)}
              className="group flex w-full flex-col gap-1.5 rounded-[calc(20*var(--px))] bg-white px-1 pt-1 pb-1.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="relative aspect-[392/256] w-full overflow-clip rounded-[calc(16*var(--px))] bg-primary-light">
                {WAVES}
                <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.03]">{demo.art}</div>
              </div>
              <span className="w-full px-3.5 py-2.5 text-base leading-normal font-bold text-ink">{demo.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
