import { useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Pen01Icon } from '@hugeicons/core-free-icons'
import logo from '../assets/logo.svg'
import { PrimaryButton } from '../components/buttons'
import { SectionLabel, TextField, UploadBox } from '../components/form'
import { extractPalette, normalizeHex } from '../lib/color'
import { navigate, ROUTES } from '../router'

const PRESETS = [
  { name: 'Pink', hex: '#ff1fad' },
  { name: 'Violet', hex: '#903bff' },
  { name: 'Green', hex: '#00c064' },
  { name: 'Cyan', hex: '#00c9c6' },
  { name: 'Red', hex: '#f30000' },
  { name: 'Orange', hex: '#f96c00' },
  { name: 'Blue', hex: '#0095ff' },
  { name: 'Yellow', hex: '#edba00' },
]

const FALLBACK_LOGO_COLORS = ['#efbb00', '#a7921b', '#8fa200']

function ColorSwatch({ hex, name, selected, onSelect }) {
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
      style={{ backgroundColor: hex }}
    />
  )
}

function BrandColorPicker({ state, actions }) {
  const { brandColor, shop } = state
  const [palette, setPalette] = useState({ logo: null, colors: FALLBACK_LOGO_COLORS })
  const [draft, setDraft] = useState(null)
  const colorInputRef = useRef(null)
  const suggested = shop.logo && palette.logo === shop.logo ? palette.colors : FALLBACK_LOGO_COLORS
  const hexDraft = draft ?? brandColor.slice(1).toUpperCase()
  const isSelected = (hex) => hex.toLowerCase() === brandColor.toLowerCase()

  useEffect(() => {
    if (!shop.logo) return
    let cancelled = false
    extractPalette(shop.logo).then((colors) => {
      if (!cancelled) setPalette({ logo: shop.logo, colors: colors.length ? colors : FALLBACK_LOGO_COLORS })
    })
    return () => {
      cancelled = true
    }
  }, [shop.logo])

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-col gap-2.5">
        <SectionLabel>Brand Color</SectionLabel>
        <div role="radiogroup" aria-label="Brand colors" className="flex flex-wrap gap-2.5">
          {PRESETS.map((preset) => (
            <ColorSwatch
              key={preset.hex}
              {...preset}
              selected={isSelected(preset.hex)}
              onSelect={actions.setBrandColor}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 min-[1200px]:grid-cols-2 min-[1200px]:gap-[30px]">
        <div className="min-w-0">
          <SectionLabel>Based from your logo</SectionLabel>
          <div role="radiogroup" aria-label="Colors from your logo" className="mt-2.5 flex flex-wrap gap-2.5">
            {suggested.map((hex) => (
              <ColorSwatch
                key={hex}
                hex={hex}
                selected={isSelected(hex)}
                onSelect={actions.setBrandColor}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <SectionLabel>Custom</SectionLabel>
          <div className="mt-2.5 flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Open color picker"
              onClick={() => colorInputRef.current?.click()}
              className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              style={{
                background:
                  'conic-gradient(#ff00a6, #6600ff, #006fff, #00e78b, #99db00, #ff7b00, #ff0000, #ff00a6)',
              }}
            >
              <HugeiconsIcon icon={Pen01Icon} size={20} color="white" />
              <input
                ref={colorInputRef}
                type="color"
                tabIndex={-1}
                value={brandColor}
                onChange={(event) => actions.setBrandColor(event.target.value)}
                className="pointer-events-none absolute inset-0 opacity-0"
              />
            </button>
            <label className="flex h-10 min-w-0 items-center rounded-[10px] border border-line bg-white px-3 focus-within:border-primary">
              <span className="sr-only">Custom brand color</span>
              <input
                value={`#${hexDraft.replace(/^#/, '')}`}
                maxLength={7}
                spellCheck={false}
                aria-invalid={!normalizeHex(hexDraft)}
                onChange={(event) => {
                  const next = event.target.value.replace('#', '').toUpperCase()
                  setDraft(next)
                  const normalized = normalizeHex(next)
                  if (normalized && next.length === 6) actions.setBrandColor(normalized)
                }}
                onBlur={() => {
                  const normalized = normalizeHex(hexDraft)
                  if (normalized) actions.setBrandColor(normalized)
                  setDraft(null)
                }}
                className="w-full min-w-[72px] bg-transparent text-base text-ink uppercase outline-none"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OnboardingScreen({ state, actions }) {
  const { shop } = state
  const setShopField = (field) => (event) => actions.updateShop({ [field]: event.target.value })

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[700px] flex-col px-6 py-[30px] min-[1200px]:px-[30px]">
      <header className="flex items-center justify-between">
        <img src={logo} alt="Bake My App" width={84} height={61.2} className="h-[61.2px] w-[84px]" />
        <button
          type="button"
          onClick={() => navigate(ROUTES.home)}
          className="rounded-full px-5 py-4 text-base text-body transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          Back to Home
        </button>
      </header>

      <section className="mt-[60px] flex flex-col gap-10" aria-labelledby="onboarding-title">
        <div className="flex flex-col gap-2.5">
          <h1 id="onboarding-title" className="text-[32px] leading-normal font-semibold text-ink min-[1200px]:text-4xl">
            Tell us about your shop
          </h1>
          <p className="text-base leading-normal text-muted">
            Basic details so we can set up your storefront. You can change everything later.
          </p>
        </div>

        <div className="flex items-start gap-6 min-[1200px]:gap-10">
          <div className="w-[140px] shrink-0 min-[1200px]:w-40">
            <SectionLabel>Company Logo</SectionLabel>
            <UploadBox
              className="mt-2.5 h-[140px] w-[140px] bg-surface min-[1200px]:h-40 min-[1200px]:w-40"
              value={shop.logo}
              onChange={(logoValue) => actions.updateShop({ logo: logoValue })}
              accept="image/png,image/jpeg,image/svg+xml"
              title="Drop it here or click to upload"
              label="Upload company logo"
            />
            <p className="mt-2.5 text-center text-xs leading-normal text-muted">
              PNG, JPG, or SVG<br />512x512 recommended
            </p>
          </div>

          <BrandColorPicker state={state} actions={actions} />
        </div>

        <div className="flex flex-col gap-5">
          <TextField
            label="Shop Name"
            value={shop.name}
            onChange={setShopField('name')}
            autoComplete="organization"
            required
          />
          <div className="grid grid-cols-2 gap-3 min-[1200px]:gap-5">
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

        <div className="flex items-center justify-end gap-2.5 pb-[30px]">
          <button
            type="button"
            onClick={actions.launch}
            className="rounded-full px-5 py-4 text-base font-semibold text-body transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
          >
            Skip for now
          </button>
          <PrimaryButton className="py-4" onClick={actions.launch} disabled={!shop.name.trim()}>
            Launch my Store
          </PrimaryButton>
        </div>
      </section>
    </div>
  )
}
