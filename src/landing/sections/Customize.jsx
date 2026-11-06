import { GoldDecorations } from '../GoldDecorations'
import { BRAND_COLORS as PRESETS } from '../../lib/brandPalette'
import { useLayoutEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { readableTextOn } from '../../lib/color'
import { DEFAULT_BRAND_COLOR, INITIAL_STATE } from '../../onboarding/useOnboardingState'
import { CartScreen } from '../../preview/CartScreen'
import { HomeScreen } from '../../preview/HomeScreen'
import { DESKTOP_HEIGHT, DESKTOP_WIDTH, DesktopScreen } from '../../preview/DesktopScreen'
import { DeviceToggle } from '../../preview/PreviewPanel'
import { getStoreSummary } from '../../preview/storeSummary'
import { CtaPair, Deco } from '../ui'
import { GAP, TYPE } from '../styles'

// The two storefront phones render at 1× as 522.4 × 524.4; Figma shows them at 1.2× (626.84 wide).
// The desktop (website) preview is fitted to the same stage width.
const STAGES = {
  mobile: { width: 522.4, height: 524.4 },
  desktop: { width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT },
}
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

/** Scales the 1× preview (`width` px wide) to whatever width the stage box gets. */
function useFitScale(ref, width) {
  const [scale, setScale] = useState(1.2)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, width])
  return scale
}

export function Customize() {
  const [color, setColor] = useState(DEFAULT_BRAND_COLOR)
  const [device, setDevice] = useState('mobile')
  const stageRef = useRef(null)
  const stage = STAGES[device]
  const scale = useFitScale(stageRef, stage.width)

  const isSelected = (hex) => hex === color
  const choose = setColor

  const brandVars = {
    '--brand': color,
    '--brand-light': `color-mix(in oklab, ${color} 10%, white)`,
    '--on-brand': readableTextOn(color),
  }

  return (
    <section id="customize" className="relative scroll-mt-10">
      <GoldDecorations variant={4} />
      <Deco src="deco-donut-2.svg" x={101.34} y={0} size={114.89} rotate={30.26} />
      <Deco src="deco-coffee.svg" x={789} y={880} size={105.93} rotate={-18.09} />
      <div className="relative mx-auto flex max-w-[calc(1920*var(--u))] flex-col lg:flex-row">
        <div
          className={`flex flex-col px-[max(20*var(--m),140*var(--u))] pt-[max(80*var(--m),130*var(--u))]  lg:w-[50.52%] lg:pr-[calc(20*var(--u))] lg:pb-0 ${GAP[60]}`}
        >
          <div className={`flex flex-col ${GAP[40]}`}>
            <div className={`flex flex-col text-ink ${GAP[30]}`}>
              <h2 className={TYPE.h2}>it should look like your cafe, not ours</h2>
              <p className={TYPE.body}>
                Your colors, fonts, icon, menu, rewards and notifications. Everything matches your brand.
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

            </div>
          </div>
          <CtaPair label="Make it look like my cafe" demoLabel="Try it live" />
        </div>

        {/* Live preview; the gray panel bleeds to the right edge on wide screens. */}
        <div className="brand-scope flex flex-col items-center bg-surface pt-[max(48*var(--m),150*var(--u))] pb-16 lg:w-[49.48%] lg:pb-0 lg:shadow-[0_0_0_100vmax_var(--color-surface)] lg:[clip-path:inset(0_-100vmax_0_0)]" style={brandVars}>
          <div className="relative w-[min(626.84px,calc(100%-32px))] lg:w-[calc(626.84*var(--u))]" style={{ aspectRatio: `${STAGES.mobile.width} / ${STAGES.mobile.height}` }}>
            <div
              ref={stageRef}
              className="absolute top-1/2 left-0 w-full -translate-y-1/2"
              style={{ aspectRatio: `${stage.width} / ${stage.height}` }}
            >
              {device === 'mobile' ? (
                <div
                  className="landing-unscaled absolute top-0 left-0 flex origin-top-left items-start gap-10"
                  style={{ width: stage.width, height: stage.height, transform: `scale(${scale})` }}
                >
                  <HomeScreen summary={SUMMARY} logo={null} />
                  <CartScreen summary={SUMMARY} />
                </div>
              ) : (
                <div
                  className="landing-unscaled absolute top-0 left-0 origin-top-left"
                  style={{ width: stage.width, height: stage.height, transform: `scale(${scale})` }}
                >
                  <DesktopScreen summary={SUMMARY} />
                </div>
              )}
            </div>
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
