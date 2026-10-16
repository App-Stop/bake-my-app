import { useLayoutEffect, useRef, useState } from 'react'
import { Cancel01Icon, ComputerIcon, SmartPhone01Icon } from '@hugeicons/core-free-icons'
import { navigate, ROUTES } from '../router'
import { DESKTOP_HEIGHT, DESKTOP_WIDTH, DesktopScreen } from './DesktopScreen'
import { getStoreSummary } from './storeSummary'
import { CartScreen } from './CartScreen'
import { HomeScreen } from './HomeScreen'
import { Icon } from './phone'

// Two 241.2px phones, 40px apart — the group is 522.4 × 524.4 in the 1440×1024 frame; the desktop
// website preview is 641.2 × 457.57 with 34.8px either side in the 710px panel.
const STAGES = {
  mobile: { width: 522.4, height: 524.4, padX: (width) => Math.min(94, Math.max(24, width * 0.132)) },
  desktop: { width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT, padX: () => 34.8 },
}
const HEADER_SPACE = 110

/** Scales the preview to fit the panel: 1× at the 1440×1024 design size, larger on big screens. */
function useStageScale(ref, stage) {
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const padX = stage.padX(width)
      const next = Math.min((width - padX * 2) / stage.width, (height - HEADER_SPACE * 2) / stage.height)
      setScale(Math.max(0.5, Math.min(1.5, next)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, stage])

  return scale
}

export function DeviceToggle({ device, onChange }) {
  const options = [
    { id: 'mobile', icon: SmartPhone01Icon, label: 'Mobile preview' },
    { id: 'desktop', icon: ComputerIcon, label: 'Desktop preview' },
  ]
  return (
    <div role="tablist" aria-label="Preview device" className="flex items-start rounded-full border border-line-strong bg-line p-0.5">
      {options.map(({ id, icon, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={device === id}
          aria-label={label}
          onClick={() => onChange(id)}
          className={`flex w-15 items-center justify-center rounded-full px-1 py-2 text-ink transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
            device === id ? 'bg-white' : 'hover:bg-white/50'
          }`}
        >
          <Icon icon={icon} size={20} className="size-5" />
        </button>
      ))}
    </div>
  )
}

export function PreviewPanel({ state }) {
  const panelRef = useRef(null)
  const [device, setDevice] = useState('mobile')
  const scale = useStageScale(panelRef, STAGES[device])
  const summary = getStoreSummary(state)

  return (
    <aside
      ref={panelRef}
      aria-label="Live storefront preview"
      className="relative h-full w-[49.3%] shrink-0 overflow-hidden bg-surface"
    >
      <div className="absolute top-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-5">
        <p className="text-xl leading-normal font-medium text-ink">Preview</p>
        <DeviceToggle device={device} onChange={setDevice} />
      </div>

      <button
        type="button"
        aria-label="Close onboarding"
        onClick={() => navigate(ROUTES.home)}
        className="absolute top-[30px] right-[30px] z-10 flex size-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Icon icon={Cancel01Icon} size={24} />
      </button>

      <div className="absolute inset-0 flex items-center justify-center">
        {device === 'mobile' ? (
          <div
            className="flex shrink-0 items-start gap-10 transition-transform duration-200"
            style={{ width: STAGES.mobile.width, height: STAGES.mobile.height, transform: `scale(${scale})` }}
          >
            <HomeScreen summary={summary} logo={state.shop.logo} />
            <CartScreen summary={summary} />
          </div>
        ) : (
          <div className="shrink-0 transition-transform duration-200" style={{ transform: `scale(${scale})` }}>
            <DesktopScreen summary={summary} logo={state.shop.logo} />
          </div>
        )}
      </div>
    </aside>
  )
}
