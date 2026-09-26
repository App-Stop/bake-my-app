import { useEffect, useRef, useState } from 'react'
import { SectionLabel } from '../../components/form'
import { extractPalette, normalizeHex } from '../../lib/color'
import { StepShell } from '../StepShell'

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

function Swatch({ hex, name, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name ?? hex}
      title={name ? `${name} · ${hex.toUpperCase()}` : hex.toUpperCase()}
      onClick={() => onSelect(hex)}
      style={{ backgroundColor: hex }}
      className={`size-[68px] shrink-0 rounded-[10px] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? 'border-2 border-ink' : ''
      }`}
    />
  )
}

export function BrandColorStep({ state, actions, onBack, onNext }) {
  const { brandColor, shop } = state
  // Draft text only exists while the user is typing; otherwise the field mirrors the brand color.
  const [draft, setDraft] = useState(null)
  const hexDraft = draft ?? brandColor.slice(1).toUpperCase()
  const [palette, setPalette] = useState({ logo: null, colors: [] })
  const suggested = shop.logo && palette.logo === shop.logo ? palette.colors : []
  const colorInputRef = useRef(null)

  useEffect(() => {
    if (!shop.logo) return
    let cancelled = false
    extractPalette(shop.logo).then((colors) => {
      if (!cancelled) setPalette({ logo: shop.logo, colors })
    })
    return () => {
      cancelled = true
    }
  }, [shop.logo])

  const hexValid = normalizeHex(hexDraft) !== null
  const isSelected = (hex) => hex.toLowerCase() === brandColor
  const customSelected = ![...PRESETS.map((p) => p.hex), ...suggested].some(isSelected)

  return (
    <StepShell
      step={1}
      title="Choose your brand color"
      description="Pick a primary color that matches your bakery's personality. This will be used for buttons, headers, and accents in your storefront."
      onBack={onBack}
      onNext={onNext}
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Presets</SectionLabel>
          <div role="radiogroup" aria-label="Preset colors" className="flex flex-wrap gap-2.5">
            {PRESETS.map((preset) => (
              <Swatch
                key={preset.hex}
                {...preset}
                selected={isSelected(preset.hex)}
                onSelect={actions.setBrandColor}
              />
            ))}
          </div>
        </div>

        {suggested.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Suggested color based from your logo</SectionLabel>
            <div role="radiogroup" aria-label="Colors from your logo" className="flex flex-wrap gap-2.5">
              {suggested.map((hex) => (
                <Swatch
                  key={hex}
                  hex={hex}
                  selected={isSelected(hex)}
                  onSelect={actions.setBrandColor}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <SectionLabel>Custom</SectionLabel>
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              aria-label="Open color picker"
              onClick={() => colorInputRef.current?.click()}
              style={{ backgroundColor: brandColor }}
              className={`relative size-[68px] shrink-0 rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                customSelected ? 'border-2 border-ink' : ''
              }`}
            >
              <input
                ref={colorInputRef}
                type="color"
                tabIndex={-1}
                value={brandColor}
                onChange={(e) => actions.setBrandColor(e.target.value)}
                className="pointer-events-none absolute inset-0 size-full opacity-0"
              />
            </button>
            <label
              className={`flex w-[200px] flex-col justify-center gap-1 rounded-[10px] border bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-primary ${
                hexValid ? 'border-line' : 'border-[#f30000]'
              }`}
            >
              <span className="text-xs leading-normal font-medium text-muted">Hex Code</span>
              <input
                value={hexDraft}
                maxLength={7}
                spellCheck={false}
                aria-invalid={!hexValid}
                onChange={(e) => {
                  const next = e.target.value.replace('#', '').toUpperCase()
                  setDraft(next)
                  const hex = normalizeHex(next)
                  if (hex && next.length === 6) actions.setBrandColor(hex)
                }}
                onBlur={() => {
                  const hex = normalizeHex(hexDraft)
                  if (hex) actions.setBrandColor(hex)
                  setDraft(null)
                }}
                className="w-full min-w-0 bg-transparent text-base leading-normal text-ink uppercase outline-none"
              />
            </label>
          </div>
        </div>
      </div>
    </StepShell>
  )
}
