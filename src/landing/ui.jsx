import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, FavouriteIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Link } from '../components/Link'
import { ROUTES } from '../router'
import { GAP } from './styles'

/** Hugeicons (stroke set) icon; `filled` paints the outline solid, for Figma's solid glyphs. */
export function Icon({ icon, size = 24, strokeWidth, filled = false, className = '', ...props }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={`shrink-0 ${filled ? '**:fill-current' : ''} ${className}`}
      {...props}
    />
  )
}

/** Solid brand circle with a white tick (Figma "checkmark-circle-02"). */
export function CheckCircle({ className = 'size-6' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center ${className}`}>
      <span className="flex size-[83%] items-center justify-center rounded-full bg-primary text-white">
        <Icon icon={Tick02Icon} strokeWidth={3} className="size-[62%]" />
      </span>
    </span>
  )
}

const VARIANTS = {
  white: 'bg-white text-primary hover:bg-white/90',
  glass: 'bg-white/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] hover:bg-white/30',
  primary: 'bg-primary text-white hover:brightness-110',
  soft: 'bg-primary-light text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] hover:bg-[#e2e5fc]',
  outline: 'text-primary shadow-[inset_0_0_0_1px_var(--color-primary)] hover:bg-primary-light',
}

const SIZES = {
  lg: 'text-[clamp(18px,1.25vw,24px)] px-[clamp(24px,2.083vw,40px)] py-[clamp(14px,1.042vw,20px)]',
  md: 'text-[clamp(16px,1.042vw,20px)] px-[clamp(24px,2.083vw,40px)] py-[clamp(14px,1.042vw,20px)]',
  sm: 'text-[16px] px-[clamp(24px,2.083vw,40px)] py-[clamp(12px,0.833vw,16px)]',
}

export function ArrowIcon({ className = 'size-[clamp(24px,1.667vw,32px)]' }) {
  return <HugeiconsIcon icon={ArrowRight02Icon} size={32} color="currentColor" className={`shrink-0 ${className}`} />
}

export function Pill({ to, variant = 'primary', size = 'md', arrow = false, className = '', children }) {
  return (
    <Link
      to={to}
      className={`inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full leading-normal font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
      {arrow && <ArrowIcon />}
    </Link>
  )
}

/** "Get …" CTA (coming soon) + "Launch Demo" (opens the web app), as used in every section. */
export function CtaPair({ label = 'Get your App', tone = 'light', size = 'md', demoClassName = '' }) {
  const onPurple = tone === 'purple'
  return (
    <div className={`flex flex-wrap items-center ${GAP[30]}`}>
      <Pill to={ROUTES.comingSoon} variant={onPurple ? 'white' : 'primary'} size={size}>
        {label}
      </Pill>
      <Pill
        to={ROUTES.app}
        variant={tone === 'light' ? 'soft' : 'glass'}
        size={size}
        arrow
        className={demoClassName}
      >
        Launch Demo
      </Pill>
    </div>
  )
}

/**
 * A Figma export whose render bounds (shadows, rotated children) overflow its layout box.
 * `box` is the layout box and `art` the exported image's rect relative to it, both in Figma px;
 * the wrapper scales fluidly and the image keeps its exact offset. Give `art.w` to size by
 * width, or only `art.h` when the export's width isn't fixed (e.g. clipped by the viewport).
 */
export function Composite({ src, alt = '', box, art, className = '' }) {
  const size = art.w
    ? { width: `${(art.w / box.w) * 100}%`, height: 'auto' }
    : { height: `${(art.h / box.h) * 100}%`, width: 'auto' }
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${box.w} / ${box.h}` }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="pointer-events-none absolute max-w-none select-none"
        style={{ left: `${(art.x / box.w) * 100}%`, top: `${(art.y / box.h) * 100}%`, ...size }}
      />
    </div>
  )
}

/**
 * Faint bakery icon floating around the page. `x`/`y`/`size` are Figma px relative to the
 * parent full-width section; `--u` is 1px at 1920 and shrinks with the viewport.
 */
export function Deco({ icon, x, y, size }) {
  return (
    <Icon
      icon={icon}
      filled
      aria-hidden="true"
      className="pointer-events-none absolute hidden text-[#eeedfe] md:block"
      style={{
        left: `calc(50% + ${x - 960} * var(--u))`,
        top: `calc(${y} * var(--u))`,
        width: `calc(${size} * var(--u))`,
        height: `calc(${size} * var(--u))`,
      }}
    />
  )
}

/** Heart bullet with a bold title and supporting line (customer app / website lists). */
export function HeartItem({ title, children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="flex shrink-0 items-center justify-center px-0.5 py-1">
        <span className="flex size-[clamp(24px,1.667vw,32px)] items-center justify-center rounded-full bg-primary text-white">
          <Icon icon={FavouriteIcon} filled className="size-[56%]" />
        </span>
      </span>
      <div className="flex min-w-px flex-1 flex-col gap-1.5 leading-normal text-ink">
        <p className="text-[clamp(18px,1.042vw,20px)] font-bold">{title}</p>
        <p className="text-base opacity-80">{children}</p>
      </div>
    </li>
  )
}
