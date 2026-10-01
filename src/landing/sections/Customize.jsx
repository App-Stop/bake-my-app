import { useLayoutEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { normalizeHex, readableTextOn } from '../../lib/color'
import { DEFAULT_BRAND_COLOR, INITIAL_STATE } from '../../onboarding/useOnboardingState'
import { CartScreen } from '../../preview/CartScreen'
import { HomeScreen } from '../../preview/HomeScreen'
import { DesktopPreviewPlaceholder, DeviceToggle } from '../../preview/PreviewPanel'
import { getStoreSummary } from '../../preview/storeSummary'
import { CtaPair, Deco } from '../ui'
import { GAP, TYPE } from '../styles'

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

const SUGGESTED = ['#efbb00', '#a7921b', '#8fa200']

// The two storefront phones render at 1× as 522.4 × 524.4; Figma shows them at 1.2× (626.84 wide).
const STAGE_WIDTH = 522.4
const STAGE_HEIGHT = 524.4
const SUMMARY = getStoreSummary(INITIAL_STATE)

function Swatch({ hex, label, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label ?? hex.toUpperCase()}
      title={label ? `${label} · ${hex.toUpperCase()}` : hex.toUpperCase()}
      onClick={() => onSelect(hex)}
      style={{ backgroundColor: hex }}
      className={`flex size-[max(48*var(--m),68*var(--u))] shrink-0 items-center justify-center rounded-full shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? 'border-2 border-ink' : ''
      }`}
    >
      {selected && (
        <HugeiconsIcon icon={Tick02Icon} size={32} strokeWidth={2.5} color={readableTextOn(hex)} className="size-[47%]" />
      )}
    </button>
  )
}

function ColorGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[length:max(18*var(--m),20*var(--u))] leading-normal font-semibold text-ink">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2.5">
        {children}
      </div>
    </div>
  )
}

/** Scales the 1× phone pair to whatever width the stage box gets. */
function useFitScale(ref) {
  const [scale, setScale] = useState(1.2)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / STAGE_WIDTH))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return scale
}

export function Customize() {
  const [color, setColor] = useState(DEFAULT_BRAND_COLOR)
  const [draft, setDraft] = useState(null)
  const [device, setDevice] = useState('mobile')
  const stageRef = useRef(null)
  const scale = useFitScale(stageRef)

  const hexDraft = draft ?? color.slice(1).toUpperCase()
  const hexValid = normalizeHex(hexDraft) !== null
  const isSelected = (hex) => hex === color
  const customSelected = ![...PRESETS.map((p) => p.hex), ...SUGGESTED].some(isSelected)

  const choose = (hex) => {
    setColor(hex)
    setDraft(null)
  }

  const brandVars = {
    '--brand': color,
    '--brand-light': `color-mix(in oklab, ${color} 10%, white)`,
    '--on-brand': readableTextOn(color),
  }

  return (
    <section id="customize" className="relative scroll-mt-10">
      <Deco src="deco-donut-2.svg" x={101.34} y={57} size={114.89} rotate={30.26} />
      <Deco src="deco-coffee.svg" x={789} y={1102.09} size={105.93} rotate={-18.09} />
      <div className="relative mx-auto flex max-w-[1920px] flex-col lg:flex-row">
        <div
          className={`flex flex-col px-[max(20*var(--m),140*var(--u))] pt-[max(80*var(--m),205*var(--u))] pb-16 lg:w-[50.52%] lg:pr-[calc(20*var(--u))] lg:pb-0 ${GAP[80]}`}
        >
          <div className={`flex flex-col ${GAP[40]}`}>
            <div className={`flex flex-col text-ink ${GAP[30]}`}>
              <h2 className={TYPE.h2}>Customize your way</h2>
              <p className={TYPE.body}>
                Customize every part of your app to match your café—from colors, fonts, and icons to menus, loyalty
                rewards, notifications, and more. Make it completely your own and create an experience your
                customers will love.
              </p>
            </div>

            <div className={`flex flex-col ${GAP[40]}`}>
              <ColorGroup label="Presets">
                {PRESETS.map((preset) => (
                  <Swatch
                    key={preset.hex}
                    hex={preset.hex}
                    label={preset.name}
                    selected={isSelected(preset.hex)}
                    onSelect={choose}
                  />
                ))}
              </ColorGroup>
              <ColorGroup label="Suggested colors">
                {SUGGESTED.map((hex) => (
                  <Swatch key={hex} hex={hex} selected={isSelected(hex)} onSelect={choose} />
                ))}
              </ColorGroup>
              <div className="flex flex-col gap-2.5">
                <p className="text-[length:max(18*var(--m),20*var(--u))] leading-normal font-semibold text-ink">Custom</p>
                <div className="flex items-start gap-2.5">
                  <Swatch hex={color} label="Custom color" selected={customSelected} onSelect={choose} />
                  <label
                    className={`flex w-[calc(200*var(--px))] flex-col justify-center gap-1 rounded-full border bg-white px-5 pt-2.5 pb-3 leading-normal transition-colors focus-within:border-primary ${
                      hexValid ? 'border-line' : 'border-[#f30000]'
                    }`}
                  >
                    <span className="text-xs font-medium text-muted">Hex Code</span>
                    <input
                      value={hexDraft}
                      maxLength={7}
                      spellCheck={false}
                      aria-invalid={!hexValid}
                      onChange={(e) => {
                        const next = e.target.value.replace('#', '').toUpperCase()
                        setDraft(next)
                        const hex = normalizeHex(next)
                        if (hex) setColor(hex)
                      }}
                      onBlur={() => setDraft(null)}
                      className="w-full bg-transparent text-base text-ink outline-none"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <CtaPair label="Get Customized App" />
        </div>

        {/* Live preview; the gray panel bleeds to the right edge on wide screens. */}
        <div className="brand-scope flex flex-col items-center bg-surface pt-[max(48*var(--m),236*var(--u))] pb-16 lg:min-h-[calc(1331*var(--u))] lg:w-[49.48%] lg:pb-0 lg:shadow-[0_0_0_100vmax_var(--color-surface)] lg:[clip-path:inset(0_-100vmax_0_0)]" style={brandVars}>
          <div
            ref={stageRef}
            className="relative w-[min(626.84px,calc(100%-32px))] lg:w-[calc(626.84*var(--u))]"
            style={{ aspectRatio: `${STAGE_WIDTH} / ${STAGE_HEIGHT}` }}
          >
            {device === 'mobile' ? (
              <div
                className="landing-unscaled absolute top-0 left-0 flex origin-top-left items-start gap-10"
                style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}
              >
                <HomeScreen summary={SUMMARY} logo={null} />
                <CartScreen summary={SUMMARY} />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <DesktopPreviewPlaceholder />
              </div>
            )}
          </div>
          <div className="mt-[max(32*var(--m),58.12*var(--u))] flex items-center gap-5">
            <p className="text-xl leading-normal font-medium text-ink">Preview</p>
            <DeviceToggle device={device} onChange={setDevice} />
          </div>
        </div>
      </div>
    </section>
  )
}
