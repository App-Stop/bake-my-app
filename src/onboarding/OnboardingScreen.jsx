import { useRef, useState } from 'react'
import logo from '../assets/logo.svg'
import { PrimaryButton } from '../components/buttons'
import { SectionLabel, TextField, UploadBox } from '../components/form'
import { Honeypot } from '../components/Honeypot'
import { Link } from '../components/Link'
import { api } from '../lib/api'
import { BRAND_COLORS as PRESETS, MOBILE_BRAND_COLORS } from '../lib/brandPalette'
import { readUtm } from '../lib/utm'
import { useModals } from '../landing/useModals'
import { DEMO_ROUTES, navigate, ROUTES } from '../router'
import './onboarding-mobile.css'

function ColorSwatch({ hex, name, selected, onSelect, order }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name ?? hex}
      title={`${name ? `${name} - ` : ''}${hex.toUpperCase()}`}
      onClick={() => onSelect(hex)}
      className={`size-10 shrink-0 rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? 'ring-2 ring-ink ring-offset-2' : ''
      }`}
      style={{ backgroundColor: hex, '--mobile-order': order }}
    />
  )
}

function BrandColorPicker({ state, actions }) {
  const { brandColor } = state
  const isSelected = (hex) => hex === brandColor

  return (
    <div className="setup-colors min-w-0 flex-1">
      <div className="flex flex-col gap-2.5">
        <SectionLabel>Brand Color</SectionLabel>
        <div role="radiogroup" aria-label="Brand colors" className="setup-swatches flex flex-wrap gap-2.5">
          {PRESETS.map((preset) => (
            <ColorSwatch
              key={preset.hex}
              {...preset}
              order={MOBILE_BRAND_COLORS.findIndex(color => color.hex === preset.hex)}
              selected={isSelected(preset.hex)}
              onSelect={actions.setBrandColor}
            />
          ))}
        </div>
      </div>


    </div>
  )
}

/**
 * Tells the sales team about the shop. Fire-and-forget: the visitor moves on whatever the API says.
 * The logo stays in the browser; the API needs an email to follow up, so without one nothing is sent.
 */
function sendShopLead({ shop, brandColor }, trap) {
  const email = shop.email.trim()
  if (!email) return
  api
    .post('/v1/leads', {
      source: 'shop_setup',
      email,
      phone: shop.phone.trim(),
      businessName: shop.name.trim(),
      message: `Brand colour: ${brandColor.toUpperCase()}`,
      consent: true, // the consent line is shown next to the button
      website: trap,
      utm: readUtm(),
    })
    .catch(() => {})
}

export function OnboardingScreen({ state, actions }) {
  const { shop } = state
  const { openExitOffer } = useModals()
  const [trap, setTrap] = useState('') // hidden spam-trap field
  const launched = useRef(false) // a double click must not send the lead twice
  const setShopField = (field) => (event) => actions.updateShop({ [field]: event.target.value })

  const openDemo = () => {
    const picked = new URLSearchParams(window.location.search).get('demo')
    navigate(DEMO_ROUTES[picked] ?? ROUTES.demoWebsite)
  }
  const launch = () => {
    if (!launched.current) {
      launched.current = true
      sendShopLead(state, trap)
    }
    // Open the demo picked in the "preview a demo" modal; otherwise the first demo tab (Customer Website).
    openDemo()
  }

  return (
    // Phones stack the header and card in the page flow; from md up they sit at their Figma positions.
    <div className="onboarding-page relative mx-auto w-full max-w-[1440px] px-4 pt-5 pb-10 md:min-h-[calc(1024*var(--px))] md:px-6 md:py-0">
      <header className="setup-header relative flex h-14 items-center justify-center md:static md:block md:h-auto">
        <img src={logo} alt="Bake My App" width={100.25} height={73.04} className="h-[52px] w-auto md:absolute md:left-1/2 md:top-12 md:h-[calc(73.04*var(--px))] md:w-[calc(100.25*var(--px))] md:-translate-x-1/2" />
        <button
          type="button"
          onClick={openExitOffer}
          className="setup-back absolute top-1/2 left-0 -translate-y-1/2 rounded-full px-3 py-2.5 text-sm text-ink/60 transition-colors hover:bg-white/50 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary md:left-1/2 md:top-14 md:translate-y-0 md:-translate-x-[calc(410*var(--px))] md:px-5 md:py-4 md:text-base md:text-ink/50"
        >
          Back to Home
        </button>
      </header>

      <section className="setup-card relative mt-5 flex w-full flex-col gap-7 rounded-[28px] bg-white p-5 sm:p-8 md:absolute md:left-1/2 md:mt-0 md:top-[calc(162*var(--px))] md:w-[min(calc(820*var(--px)),calc(100%-48px))] md:-translate-x-1/2 md:gap-10 md:rounded-[calc(40*var(--px))] md:p-10" aria-labelledby="onboarding-title">
        <div className="setup-intro flex flex-col gap-2.5">
          <h1 id="onboarding-title" className="text-[26px] leading-tight font-semibold text-ink md:text-[length:calc(32*var(--px))] md:leading-normal min-[1200px]:text-4xl">
            Tell us about your shop
          </h1>
          <p className="text-base leading-normal text-muted">
            Basic details so we can set up your storefront. You can change everything later.
          </p>
        </div>

        <div className="setup-brand flex flex-col items-start gap-6 sm:flex-row min-[1200px]:gap-10">
          <div className="setup-upload w-[calc(140*var(--px))] shrink-0 min-[1200px]:w-40">
            <SectionLabel>Company Logo</SectionLabel>
            <UploadBox
              className="setup-upload-box mt-2.5 h-[calc(140*var(--px))] w-[calc(140*var(--px))] bg-surface min-[1200px]:h-40 min-[1200px]:w-40"
              value={shop.logo}
              onChange={(logoValue) => actions.updateShop({ logo: logoValue })}
              accept="image/png,image/jpeg,image/svg+xml"
              title="Drop it here or click to upload"
              label="Upload company logo"
            />
            <p className="setup-upload-hint mt-2.5 text-center text-xs leading-normal text-muted">
              PNG, JPG, or SVG <br className="max-md:hidden" /><span className="md:hidden">(</span>512×512 recommended<span className="md:hidden">)</span>
            </p>
          </div>

          <BrandColorPicker state={state} actions={actions} />
        </div>

        <div className="setup-fields flex flex-col gap-5">
          <TextField
            label="Shop Name"
            value={shop.name}
            onChange={setShopField('name')}
            autoComplete="organization"
            required
          />
          <div className="setup-contact-fields grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-3 min-[1200px]:gap-5">
            <TextField
              label="Email"
              type="email"
              value={shop.email}
              onChange={setShopField('email')}
              autoComplete="email"
            />
            <TextField
              label="Phone number"
              type="tel"
              value={shop.phone}
              onChange={setShopField('phone')}
              autoComplete="tel"
            />
          </div>
        </div>

        <Honeypot value={trap} onChange={setTrap} />

        <div className="setup-actions flex flex-col items-stretch gap-2.5 text-center sm:items-end sm:text-right">
          <div className="flex items-center justify-end gap-2.5 max-sm:[&>*]:w-full">
            <PrimaryButton className="setup-launch py-4" onClick={launch} disabled={!shop.name.trim()}>
              Launch my Store
            </PrimaryButton>
          </div>
          <button type="button" className="setup-skip md:hidden" onClick={openDemo}>Skip for now</button>
          {/* The API only accepts consent: true because this line is visible next to the button. */}
          <p className="setup-consent text-xs leading-normal text-muted max-md:hidden">
            By continuing you agree to our{' '}
            <Link to={ROUTES.comingSoon} className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
      <p className="setup-mobile-consent md:hidden">By continuing you agree to our <Link to={ROUTES.comingSoon} className="text-primary underline">Privacy Policy</Link>.</p>
    </div>
  )
}
