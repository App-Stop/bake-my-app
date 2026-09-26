import { useLayoutEffect, useRef, useState } from 'react'
import { ComputerIcon, SmartPhone01Icon } from '@hugeicons/core-free-icons'
import { getStoreSummary } from './storeSummary'
import { CartScreen } from './CartScreen'
import { HomeScreen } from './HomeScreen'
import { Icon } from './phone'

// Two 241.2px phones, 40px apart — the group is 522.4 × 524.4 in the 1440×1024 frame.
const STAGE_WIDTH = 522.4
const STAGE_HEIGHT = 524.4
const HEADER_SPACE = 110

/** Scales the phone pair to fit the panel: 1× at the 1440×1024 design size, larger on big screens. */
function useStageScale(ref) {
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const padX = Math.min(94, Math.max(24, width * 0.132))
      const next = Math.min((width - padX * 2) / STAGE_WIDTH, (height - HEADER_SPACE * 2) / STAGE_HEIGHT)
      setScale(Math.max(0.5, Math.min(1.5, next)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return scale
}

function DeviceToggle({ device, onChange }) {
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
          className={`flex w-[60px] items-center justify-center rounded-full px-1 py-2 text-ink transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
            device === id ? 'bg-white' : 'hover:bg-white/50'
          }`}
        >
          <Icon icon={icon} size={20} />
        </button>
      ))}
    </div>
  )
}

export function PreviewPanel({ state }) {
  const panelRef = useRef(null)
  const scale = useStageScale(panelRef)
  const [device, setDevice] = useState('mobile')
  const summary = getStoreSummary(state)

  return (
    <aside
      ref={panelRef}
      aria-label="Live storefront preview"
      className="relative h-full w-[49.3%] shrink-0 overflow-hidden bg-surface"
    >
      <div className="absolute top-10 left-1/2 flex -translate-x-1/2 items-center gap-5">
        <p className="text-xl leading-normal font-medium text-ink">Preview</p>
        <DeviceToggle device={device} onChange={setDevice} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {device === 'mobile' ? (
          <div
            className="flex shrink-0 items-start gap-10 transition-transform duration-200"
            style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}
          >
            <HomeScreen summary={summary} logo={state.shop.logo} />
            <CartScreen summary={summary} />
          </div>
        ) : (
          <div className="mx-10 flex max-w-[420px] flex-col items-center gap-2 rounded-[20px] border border-dashed border-dash bg-white px-8 py-10 text-center leading-normal">
            <Icon icon={ComputerIcon} size={30} className="text-subtle" />
            <p className="text-sm text-body">Desktop preview is coming soon</p>
            <p className="text-xs text-muted">Switch back to mobile to see your storefront update live.</p>
          </div>
        )}
      </div>
    </aside>
  )
}
