import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ROUTES, navigate } from '../router'
import { asset } from './styles'
import { ModalsContext } from './useModals'

export function ModalsProvider({ children }) {
  const [open, setOpen] = useState(null)
  const [closing, setClosing] = useState(false)
  const show = useCallback((modal) => {
    setClosing(false)
    setOpen(modal)
  }, [])
  const close = useCallback(() => setClosing(true), [])
  const finishClose = useCallback(() => {
    setOpen(null)
    setClosing(false)
  }, [])
  const value = useMemo(
    () => ({
      openPromo: () => show('promo'),
      openDemo: () => show('demo'),
      openExitOffer: () => show('exit-offer'),
      close,
    }),
    [close, show],
  )

  return (
    <ModalsContext.Provider value={value}>
      {children}
      {open === 'promo' && <PromoModal onClose={close} closing={closing} onClosed={finishClose} />}
      {open === 'demo' && <DemoModal onClose={close} closing={closing} onClosed={finishClose} />}
      {open === 'exit-offer' && <ExitOfferModal onClose={close} closing={closing} onClosed={finishClose} />}
    </ModalsContext.Provider>
  )
}

/**
 * Centered dialog over a dimmed page. Sizes use `--px` (inside `.landing-page`), so the Figma
 * 1920 sizes scale down with the viewport on desktop and stay 1× below it.
 */
function Modal({ label, onClose, onClosed, closing, className = '', children }) {
  const overlayRef = useRef(null)
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

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      if (closing) onClosed()
      return undefined
    }

    const context = gsap.context(() => {
      if (closing) {
        gsap.timeline({ onComplete: onClosed })
          .to(panelRef.current, { autoAlpha: 0, scale: 0.95, y: 18, duration: 0.22, ease: 'power2.in' })
          .to(overlayRef.current, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, '<')
      } else {
        gsap.set(overlayRef.current, { autoAlpha: 0 })
        gsap.set(panelRef.current, { autoAlpha: 0, scale: 0.94, y: 22 })
        gsap.timeline()
          .to(overlayRef.current, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' })
          .to(panelRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, ease: 'back.out(1.35)' }, 0.04)
      }
    }, overlayRef)

    return () => context.revert()
  }, [closing, onClosed])

  return (
    <div ref={overlayRef} className="landing-page fixed inset-0 z-[100] overflow-y-auto bg-black/60 font-sans text-ink backdrop-blur-sm">
      <div
        className="flex min-h-full items-center justify-center px-4 pt-16 pb-6 sm:pt-32 lg:py-[calc(140*var(--px))]"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          className={`relative rounded-3xl sm:rounded-[calc(40*var(--px))] bg-white shadow-[0_calc(20*var(--px))_calc(60*var(--px))_rgba(0,0,0,0.3)] outline-none ${className}`}
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
      className={`absolute z-10 size-6 sm:size-[calc(32*var(--px))] transition-opacity hover:opacity-60 ${className}`}
    >
      <img src={asset('promo/close.svg')} alt="" width={32} height={32} className="size-full" />
    </button>
  )
}

/** "first month, completely free!" popup (Figma "Popup"). */
function PromoModal({ onClose, closing, onClosed }) {
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
      closing={closing}
      onClosed={onClosed}
      className="flex w-[min(calc(500*var(--px)),calc(100vw-32px))] max-w-[340px] flex-col gap-5 px-6 pt-16 pb-6 sm:max-w-none sm:gap-10 sm:px-10 sm:pt-[calc(120*var(--px))] sm:pb-10"
    >
      <CloseButton onClose={onClose} className="top-3 right-3 sm:top-[calc(30*var(--px))] sm:right-[calc(30*var(--px))]" />
      {/* Waving mascot pokes out above the card (217×218 in Figma). */}
      <img
        src={asset('promo/mascot.png')}
        alt=""
        aria-hidden="true"
        width={217}
        height={218}
        className="pointer-events-none absolute top-[-56px] left-1/2 h-[120px] w-[120px] -translate-x-1/2 object-contain select-none sm:top-[calc(-106*var(--px))] sm:left-[calc(50%-0.5*var(--px))] sm:h-[calc(218*var(--px))] sm:w-[calc(217*var(--px))] sm:max-w-none"
      />
      <div className="flex w-full flex-col items-center gap-2 sm:gap-5 text-center leading-normal">
        <h2 id={titleId} className="w-full font-malibu text-2xl sm:text-[length:calc(36*var(--px))] leading-tight sm:leading-normal font-normal text-primary">
          first month, completely free!
        </h2>
        <p className="w-full text-sm sm:text-base text-ink opacity-80 leading-relaxed sm:leading-normal">
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
          className="w-full rounded-full bg-primary-light px-5 py-3 sm:px-10 sm:py-5 text-center text-sm sm:text-base leading-normal text-ink shadow-[inset_0_0_0_1px_white] outline-none placeholder:text-ink/40 focus-visible:shadow-[inset_0_0_0_1px_var(--color-primary)]"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-primary px-5 py-3 sm:px-10 sm:py-5 text-sm sm:text-base leading-normal font-semibold text-white transition hover:brightness-110"
        >
          Claim Offer
        </button>
      </form>
    </Modal>
  )
}

/** Exit confirmation shown when a user leaves the store setup flow. */
function ExitOfferModal({ onClose, closing, onClosed }) {
  const titleId = useId()

  const leaveSetup = () => {
    onClose()
    navigate(ROUTES.home)
  }

  return (
    <Modal
      label="First month free before you go"
      onClose={onClose}
      closing={closing}
      onClosed={onClosed}
      className="flex w-[min(500px,calc(100vw-32px))] flex-col items-center gap-10 px-6 pt-[120px] pb-10 sm:px-10"
    >
      <CloseButton onClose={onClose} className="top-[30px] right-[30px]" />
      <img
        src={asset('contact/message-sent.svg')}
        alt=""
        aria-hidden="true"
        width={217}
        height={218}
        className="pointer-events-none absolute top-[-106px] left-1/2 h-[218px] w-[217px] max-w-none -translate-x-1/2 scale-x-[-1] select-none"
      />

      <div className="flex w-full flex-col items-center gap-5 text-center">
        <h2 id={titleId} className="w-full font-malibu text-[length:clamp(30px,7vw,36px)] leading-[44px] text-primary">
          Before you go, your first month&apos;s on us.
        </h2>
        <p className="w-full text-base leading-normal text-ink/80">
          Get your bakery managed and live with all the tools and perks you need—plus your first month free.
        </p>
      </div>

      <div aria-labelledby={titleId} className="flex w-full flex-col items-center gap-[30px]">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-primary px-10 py-5 text-base leading-normal font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Claim Offer
        </button>
        <button
          type="button"
          onClick={leaveSetup}
          className="text-base leading-normal font-medium text-muted transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          No thanks
        </button>
      </div>
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
function DemoModal({ onClose, closing, onClosed }) {
  const open = (demo) => {
    onClose()
    navigate(demo.to)
  }

  return (
    <Modal
      label="Preview a demo"
      onClose={onClose}
      closing={closing}
      onClosed={onClosed}
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
