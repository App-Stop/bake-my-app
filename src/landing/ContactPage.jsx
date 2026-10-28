import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowDown01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { Honeypot } from '../components/Honeypot'
import { Link } from '../components/Link'
import { api } from '../lib/api'
import { readUtm } from '../lib/utm'
import { ROUTES } from '../router'
import { Footer } from './sections/Closing'
import { SiteNav } from './SiteNav'
import { Icon } from './ui'
import { asset } from './styles'
import { useModals } from './useModals'
import { useLandingMotion } from './useLandingMotion'

const TOPICS = [
  'Apps and online ordering',
  'Plans and pricing',
  'Existing customer support',
  'Partnerships',
  'Something else',
]

// API field names this form shows errors for.
const FIELD_NAMES = ['name', 'email', 'phone', 'businessName', 'topic', 'message', 'consent']

function RouteCard({ title, children, soft = false, links }) {
  return (
    <article
      className={`flex w-full flex-col gap-4 rounded-[calc(32*var(--px))] p-[max(22*var(--m),28*var(--u))] ${
        soft ? 'bg-primary-light' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.16)]'
      }`}
    >
      <h3 className="text-lg leading-normal font-bold text-ink">{title}</h3>
      <p className="text-sm leading-6 text-body">{children}</p>
      <div className="flex flex-col items-start gap-3">
        {links.map((link) =>
          link.onClick ? (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className="group flex items-center gap-3 text-left text-sm leading-normal font-bold text-primary"
            >
              {link.label}
              <Icon icon={ArrowRight02Icon} className="size-6 transition-transform group-hover:translate-x-1" />
            </button>
          ) : link.to ? (
            <Link
              key={link.label}
              to={link.to}
              className="group flex items-center gap-3 text-sm leading-normal font-bold text-primary"
            >
              {link.label}
              <Icon icon={ArrowRight02Icon} className="size-6 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="group flex items-center gap-3 text-sm leading-normal font-bold text-primary"
            >
              {link.label}
              <Icon icon={ArrowRight02Icon} className="size-6 transition-transform group-hover:translate-x-1" />
            </a>
          ),
        )}
      </div>
    </article>
  )
}

function Field({ label, required, error, errorId, children }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label className="flex flex-col gap-2 text-sm leading-normal font-medium text-ink">
        <span>{label}{required ? ' *' : ''}</span>
        {children}
      </label>
      {error && <span id={errorId} role="alert" className="text-xs leading-normal text-red-600">{error}</span>}
    </div>
  )
}

function MessageSentModal({ email, onClose }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const [closing, setClosing] = useState(false)
  const requestClose = useCallback(() => setClosing(true), [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [requestClose])

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      if (closing) onClose()
      return undefined
    }

    const context = gsap.context(() => {
      if (closing) {
        gsap.timeline({ onComplete: onClose })
          .to(dialogRef.current, { autoAlpha: 0, scale: 0.95, y: 18, duration: 0.22, ease: 'power2.in' })
          .to(overlayRef.current, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, '<')
      } else {
        gsap.set(overlayRef.current, { autoAlpha: 0 })
        gsap.set(dialogRef.current, { autoAlpha: 0, scale: 0.94, y: 22 })
        gsap.timeline()
          .to(overlayRef.current, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' })
          .to(dialogRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, ease: 'back.out(1.35)' }, 0.04)
      }
    }, overlayRef)

    return () => context.revert()
  }, [closing, onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111]/85 px-4 pt-[106px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-sent-title"
        aria-describedby="message-sent-description"
        tabIndex={-1}
        className="relative flex min-h-[274px] w-full max-w-[500px] flex-col items-center justify-center rounded-[40px] bg-white px-8 pt-[120px] pb-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] outline-none sm:px-10"
      >
        <img
          src={asset('contact/message-sent.svg')}
          alt=""
          aria-hidden="true"
          width="217"
          height="218"
          className="pointer-events-none absolute top-[-106px] left-1/2 h-[218px] w-[217px] max-w-none -translate-x-1/2 scale-x-[-1] select-none"
        />
        <div className="flex w-full flex-col items-center gap-5">
          <h2 id="message-sent-title" className="w-full font-malibu text-4xl leading-normal text-primary">
            we heard you
          </h2>
          <p id="message-sent-description" className="w-full text-base leading-normal text-ink/80">
            Our team will reach out to you soon<br />via your email <strong className="font-semibold">{email}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

const controlClass =
  'w-full rounded-[calc(28*var(--px))] border-0 bg-white px-[max(18*var(--m),22*var(--u))] py-4 text-sm leading-6 text-ink outline-none placeholder:text-[#68667b] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

/** `?topic=Plans%20and%20pricing` preselects a topic; anything not in TOPICS is ignored. */
function topicFromUrl() {
  const topic = new URLSearchParams(window.location.search).get('topic')
  return TOPICS.includes(topic) ? topic : ''
}

function EnquiryForm() {
  const idPrefix = useId()
  const [sentEmail, setSentEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({}) // { email: 'Enter a valid email address', ... }
  const [formError, setFormError] = useState('') // errors that belong to no single field
  const inFlight = useRef(false) // blocks a second submit before the disabled state renders

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
    if (inFlight.current) return
    const form = event.currentTarget // read it before any await
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()

    inFlight.current = true
    setSending(true)
    setErrors({})
    setFormError('')
    try {
      await api.post('/v1/leads', {
        source: 'contact_form',
        name: data.get('name'),
        email,
        phone: data.get('phone'),
        businessName: data.get('business'),
        topic: data.get('topic'),
        message: data.get('message'),
        consent: data.get('consent') === 'on',
        website: data.get('website'), // honeypot, must stay empty
        utm: readUtm(),
      })
      form.reset()
      setSentEmail(email)
    } catch (error) {
      const fieldErrors = error.fieldErrors ?? {}
      setErrors(fieldErrors)
      // Field errors for inputs this form doesn't have would otherwise be invisible.
      const shown = Object.keys(fieldErrors).some((name) => FIELD_NAMES.includes(name))
      if (!shown) setFormError(error.message || 'Something went wrong. Please try again.')
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }

  return (
    <>
      <form
        onSubmit={submit}
        onChange={clearError}
        aria-labelledby="contact-form-title"
        aria-busy={sending}
        className="relative flex min-w-0 flex-1 flex-col gap-10 rounded-[calc(32*var(--px))] bg-primary-light p-[max(24*var(--m),40*var(--u))]"
      >
      <div className="flex flex-col gap-2">
        <h2 id="contact-form-title" className="font-malibu text-[length:max(32*var(--m),36*var(--u))] leading-[1.22] text-primary">
          what&apos;s cooking?
        </h2>
        <p className="text-sm leading-6 text-[#68667b]">Tell us a little about you and how we can help.</p>
        <p className="text-xs leading-normal text-[#68667b]">Fields marked * are required.</p>
      </div>

      <Honeypot />

      <div className="flex flex-col gap-5 sm:flex-row">
        <Field label="Your name" required {...fieldError('name')}>
          <input className={controlClass} name="name" placeholder="What should we call you?" autoComplete="name" required minLength={2} maxLength={120} {...errorProps('name')} />
        </Field>
        <Field label="Email address" required {...fieldError('email')}>
          <input className={controlClass} type="email" name="email" placeholder="Where can we reply?" autoComplete="email" required maxLength={254} {...errorProps('email')} />
        </Field>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        <Field label="Phone or WhatsApp" {...fieldError('phone')}>
          <input className={controlClass} type="tel" name="phone" placeholder="+92 300 1234567" autoComplete="tel" maxLength={25} {...errorProps('phone')} />
        </Field>
        <Field label="Business name" {...fieldError('businessName')}>
          <input className={controlClass} name="business" placeholder="Your bakery or café name" autoComplete="organization" maxLength={160} {...errorProps('businessName')} />
        </Field>
      </div>

      <Field label="What can we help with?" required {...fieldError('topic')}>
        <span className="relative block">
          <select className={`${controlClass} appearance-none pr-14 text-[#68667b]`} name="topic" defaultValue={topicFromUrl()} required {...errorProps('topic')}>
            <option value="" disabled>Select an enquiry topic</option>
            {TOPICS.map((topic) => <option key={topic}>{topic}</option>)}
          </select>
          <Icon
            icon={ArrowDown01Icon}
            strokeWidth={2.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2 text-primary"
          />
        </span>
      </Field>

      <Field label="Your message" required {...fieldError('message')}>
        <textarea
          className={`${controlClass} min-h-[calc(156*var(--px))] resize-y rounded-[calc(24*var(--px))]`}
          name="message"
          placeholder="Tell us about your business, your question, or what you’d like to do next…"
          required
          maxLength={4000}
          {...errorProps('message')}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-sm leading-[21px] text-body">
          <input
            type="checkbox"
            name="consent"
            required
            className="contact-consent mt-0.5 size-6 shrink-0 appearance-none rounded-[5px] border-[1.5px] border-black bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            {...errorProps('consent')}
          />
          <span>
            I agree to Bake my App using my details to respond to this enquiry, as described in the{' '}
            <Link to={ROUTES.comingSoon} className="text-primary underline">Privacy Policy</Link>. *
          </span>
        </label>
        {errors.consent && (
          <span id={`${idPrefix}-consent-error`} role="alert" className="text-xs leading-normal text-red-600">{errors.consent}</span>
        )}
      </div>

      {formError && <p role="alert" className="text-sm leading-normal text-red-600">{formError}</p>}

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-[max(20*var(--m),30*var(--u))]">
        <button
          type="submit"
          disabled={sending}
          className="group flex shrink-0 items-center justify-center gap-4 rounded-full bg-primary px-7 py-4 text-base leading-normal font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70 disabled:hover:brightness-100"
        >
          {sending ? 'Sending…' : 'Send message'}
          <Icon icon={ArrowRight02Icon} className="size-6 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="text-xs leading-5 text-[#68667b]">
          Straight to our team.<br />No sales pitch, just a conversation.
        </p>
      </div>
      </form>
      {sentEmail && <MessageSentModal email={sentEmail} onClose={() => setSentEmail('')} />}
    </>
  )
}

export function ContactPage() {
  const { openDemo } = useModals()
  const pageRef = useRef(null)
  useLandingMotion(pageRef)

  return (
    <div ref={pageRef} className="landing-page min-w-80 overflow-x-clip bg-white font-sans text-ink">
      {/* The last term keeps the whole wave inside the header above 1920px, where --u stops growing but the wave doesn't. */}
      <header data-nav-theme="dark" className="relative h-[max(390*var(--m),520*var(--u),calc(192*var(--u)+100vw*327/1920+2px))] overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[max(270*var(--m),347*var(--u))] bg-primary" />
        <img
          src={asset('contact/hero-wave.svg')}
          alt=""
          aria-hidden="true"
          width="1920"
          height="327"
          loading="eager"
          fetchPriority="high"
          className="absolute top-[max(115*var(--m),192*var(--u))] left-1/2 h-auto w-[max(1400*var(--m),calc(100%+2px))] max-w-none -translate-x-1/2 select-none"
        />
        <SiteNav forceDark />
        <div className="relative z-10 mx-auto flex max-w-[calc(1920*var(--u))] flex-col items-center gap-[max(16*var(--m),30*var(--u))] px-5 pt-[max(118*var(--m),140*var(--u))] text-center text-white">
          <h1 className="font-malibu text-[length:max(52*var(--m),96*var(--u))] leading-[1.1042]">let&apos;s talk shop.</h1>
          <p className="max-w-[calc(760*var(--px))] text-[length:max(16*var(--m),24*var(--u))] leading-normal font-medium">
            A question, a big idea, or a little help with the techy part?<br className="hidden sm:block" /> Tell us what&apos;s cooking. We&apos;re here for your business.
          </p>
        </div>
      </header>

      {/* Text-size floors apply to the page content only; the nav and footer keep the landing scale. */}
      <main className="contact-page">
        <section
          aria-labelledby="contact-intro-title"
          className="mx-auto flex max-w-[calc(1920*var(--u))] flex-col gap-12 px-[max(20*var(--m),160*var(--u))] py-[max(56*var(--m),80*var(--u))] lg:flex-row lg:items-start lg:gap-[calc(200*var(--u))]"
        >
          <div className="flex w-full shrink-0 flex-col gap-[max(24*var(--m),30*var(--u))] lg:w-[calc(500*var(--u))]">
            <div className="flex flex-col gap-4">
              <h2 id="contact-intro-title" className="font-malibu text-[length:max(36*var(--m),42*var(--u))] leading-[1.19] text-primary">
                your business.<br />your next chapter.
              </h2>
              <p className="text-base leading-7 text-[#68667b]">
                From your first branded app to a busier kitchen, let&apos;s find the right ingredients for your bakery or café.
              </p>
            </div>
            <RouteCard
              title="New to Bake my App?"
              soft
              links={[
                { label: 'Explore pricing', to: ROUTES.pricing },
                { label: 'Try a live bakery app', onClick: openDemo },
              ]}
            >
              Curious about apps, online ordering or the right plan? Ask us in the form, or take a look around.
            </RouteCard>
            <RouteCard
              title="Already baking with us?"
              links={[{ label: "Let's sort out the techy part", href: '#contact-form-title' }]}
            >
              Choose “Existing customer support” in the form. Include your business name and what you need a hand with.
            </RouteCard>
          </div>
          <EnquiryForm />
        </section>
      </main>

      {/* In flow (not a fixed-height box) so the strip's height always follows the wave's width. */}
      <div className="overflow-hidden">
        <img
          src={asset('contact/footer-wave.svg')}
          alt=""
          aria-hidden="true"
          width="1920"
          height="371"
          loading="lazy"
          className="relative left-1/2 block h-auto w-[max(1000*var(--m),calc(100%+2px))] max-w-none select-none [transform:translateX(-50%)_scaleY(-1)]"
        />
      </div>
      <div className="relative -mt-[2px]"><Footer /></div>
    </div>
  )
}
