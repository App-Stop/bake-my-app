import { ComputerIcon, SmartPhone01Icon, Tablet01Icon } from '@hugeicons/core-free-icons'
import { Icon } from './phone'

const DEVICE_OPTIONS = {
  mobile: { icon: SmartPhone01Icon, label: 'Mobile preview' },
  tablet: { icon: Tablet01Icon, label: 'Tablet preview' },
  desktop: { icon: ComputerIcon, label: 'Desktop preview' },
}

/** Preview device switch; `options` lists the devices to offer, in display order. */
export function DeviceToggle({ device, onChange, options = ['mobile', 'desktop'], className = '' }) {
  return (
    <div role="tablist" aria-label="Preview device" className={`flex items-start rounded-full border border-line-strong bg-line p-0.5 ${className}`}>
      {options.map((id) => ({ id, ...DEVICE_OPTIONS[id] })).map(({ id, icon, label }) => (
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

