import { useId } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  BiscuitIcon,
  Bread04Icon,
  CakeIcon,
  Coffee02Icon,
  CroissantIcon,
  Cupcake02Icon,
  DonutIcon,
  Happy01Icon,
  ShoppingBasket03Icon,
  Store01Icon,
} from '@hugeicons/core-free-icons'
import statusLevels from '../assets/status-levels.svg'

/** Frosted-glass pill used across the storefront header and cards. */
export const glass = 'border-[0.6px] border-white bg-white/40 backdrop-blur-[6px]'

export function Icon({ icon, size, className = '', strokeWidth }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={`shrink-0 ${className}`}
    />
  )
}

/** iPhone 17 Pro frame at 60% scale (241.2 × 524.4), matching the Figma mockups. */
export function PhoneFrame({ label, children }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative h-[524.4px] w-[241.2px] shrink-0 overflow-clip rounded-[30px] bg-white font-inter shadow-[0_12px_40px_-16px_rgba(17,17,17,0.18)]"
    >
      {children}
      <StatusBar />
    </div>
  )
}

function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[34px] items-center px-[5.4px] pt-[1.4px]">
      <div className="flex min-w-px flex-1 items-center justify-center pr-[3.6px]">
        <span className="font-sf text-[10.2px] leading-[13.2px] font-semibold text-black">9:41</span>
      </div>
      <div className="h-[22.2px] w-[75px] shrink-0 rounded-[60px] bg-black" />
      <div className="flex min-w-px flex-1 items-center justify-center">
        <img src={statusLevels} alt="" width={51.2} height={7.8} className="h-[7.8px] w-[51.2px]" />
      </div>
    </div>
  )
}

/** Soft brand-colored glow behind the Home header (Figma "BG Glow"). */
export function BgGlow() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <div className="pointer-events-none absolute top-[-98.77px] left-[-36.6px] h-[161.535px] w-[297.6px]">
      <svg
        className="absolute inset-[-112.15%_-60.87%_-112.15%_-44.36%] block size-auto"
        width="610.759"
        height="523.858"
        viewBox="0 0 610.759 523.858"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <g opacity="0.8">
          <g filter={`url(#${id}a)`}>
            <circle cx="348.83" cy="261.929" r="80.7677" fill="var(--brand)" />
          </g>
          <g filter={`url(#${id}b)`}>
            <ellipse cx="188.1" cy="275.729" rx="56.1" ry="55.8" fill="var(--brand)" />
          </g>
        </g>
        <defs>
          <filter id={`${id}a`} x="86.9" y="0" width="523.858" height="523.858" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="90.5807" />
          </filter>
          <filter id={`${id}b`} x="0" y="87.929" width="376.2" height="375.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="66" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

const ROLLING_ICONS = [
  CroissantIcon,
  DonutIcon,
  BiscuitIcon,
  Cupcake02Icon,
  CakeIcon,
  Coffee02Icon,
  Bread04Icon,
  CroissantIcon,
]

function TabPill({ active, icon, label, badge, rolling }) {
  if (active) {
    return (
      <div className="relative flex h-[32.4px] w-[72px] shrink-0 items-center justify-center gap-[3.6px] overflow-clip rounded-[60px] bg-brand text-on-brand">
        {rolling ? (
          <>
            <div className="absolute top-[7.8px] left-[13.8px] flex flex-col gap-[10.8px] animate-icon-roll">
              {ROLLING_ICONS.map((i, idx) => (
                <Icon key={idx} icon={i} size={16.8} />
              ))}
            </div>
            <span className="absolute top-[16.1px] left-[46.2px] -translate-x-1/2 -translate-y-1/2 text-[8.4px] leading-normal font-semibold whitespace-nowrap">
              {label}
            </span>
          </>
        ) : (
          <>
            <Icon icon={icon} size={16.8} />
            <span className="text-[8.4px] leading-normal font-semibold whitespace-nowrap">{label}</span>
          </>
        )}
      </div>
    )
  }
  return (
    <div className="relative flex size-[32.4px] shrink-0 items-center justify-center rounded-[60px] bg-white text-ink">
      <Icon icon={icon} size={16.8} />
      {badge && (
        <span className="absolute top-[calc(50%-7.8px)] left-[calc(50%+8.4px)] size-[3.6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
      )}
    </div>
  )
}

/** Floating bottom navigation with the frosted gradient backdrop. */
export function TabBar({ active, children }) {
  return (
    <div className="absolute bottom-0 left-0 flex w-full items-end justify-center bg-linear-to-b from-white/0 via-white/26 via-40% to-white/60 to-75% px-[15px] pt-[9.6px] pb-[12.6px] backdrop-blur-[1.8px]">
      {children}
      <nav className="relative isolate flex items-center justify-center gap-[2.4px] rounded-[60px]">
        <TabPill active={active === 'home'} rolling icon={Store01Icon} label="Home" />
        <TabPill active={active === 'cart'} icon={ShoppingBasket03Icon} label="Cart" badge={active !== 'cart'} />
        <TabPill icon={Happy01Icon} label="Me" />
      </nav>
    </div>
  )
}
