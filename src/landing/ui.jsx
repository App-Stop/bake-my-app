import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, FavouriteIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Link } from '../components/Link'
import { ROUTES } from '../router'
import { useModals } from './useModals'
import { GAP, asset } from './styles'

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
  lg: 'text-[length:max(18*var(--m),24*var(--u))] px-[max(24*var(--m),40*var(--u))] py-[max(14*var(--m),20*var(--u))]',
  md: 'text-[length:max(12*var(--m),18*var(--u))] px-[max(16*var(--m),32*var(--u))] py-[max(12*var(--m),18*var(--u))]',
  sm: 'text-[length:calc(16*var(--px))] px-[max(24*var(--m),40*var(--u))] py-[max(12*var(--m),16*var(--u))]',
}

export function ArrowIcon({ className = 'size-[max(24*var(--m),32*var(--u))]' }) {
  return <HugeiconsIcon icon={ArrowRight02Icon} size={32} color="currentColor" className={`shrink-0 ${className}`} />
}

/** Rounded CTA: a link when given `to`, otherwise a button (`onClick`). */
export function Pill({ to, onClick, variant = 'primary', size = 'md', arrow = false, className = '', children }) {
  const classes = `inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full leading-normal font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  const content = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  )
  return to ? (
    <Link to={to} onClick={onClick} className={classes}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  )
}

/** "Launch Demo" CTA: opens the "preview a demo" picker. */
export function DemoPill({ label = 'Launch Demo', ...props }) {
  const { openDemo } = useModals()
  return (
    <Pill {...props} onClick={openDemo} arrow>
      {label}
    </Pill>
  )
}

/**
 * "Get …" CTA (web app onboarding) + "Launch Demo" (demo picker), as used in every section, with the
 * "FIRST MONTH FREE*" note underneath (left aligned, or centered with `align="center"`).
 */
export function CtaPair({
  label = 'Bake my app free for a month',
  demoLabel = 'Try a live bakery app',
  note = 'FIRST MONTH FREE*',
  tone = 'light',
  size = 'md',
  align = 'start',
  demoClassName = '',
  buttonRowClassName = '',
}) {
  const onPurple = tone === 'purple'
  const centered = align === 'center'
  return (
    <div className={`flex flex-col gap-2.5 ${centered ? 'items-center' : 'items-start'}`}>
      <div className={`flex flex-wrap items-center ${centered ? 'justify-center' : ''} ${GAP[30]} ${buttonRowClassName}`}>
        <Pill to={ROUTES.app} variant={onPurple ? 'white' : 'primary'} size={size}>
          {label}
        </Pill>
        <DemoPill label={demoLabel} variant={tone === 'light' ? 'soft' : 'glass'} size={size} className={demoClassName} />
      </div>
      <p className={`text-base leading-normal italic opacity-80 ${tone === 'light' ? 'text-ink' : 'text-white'}`}>
        {note}
      </p>
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
 * Faint bakery icon floating around the page, exported from Figma as an 84×84 SVG. `x`/`y`/`size`
 * are the Figma bounding box (px) relative to the parent full-width section — larger than 84 when
 * the icon is rotated; `--u` is 1px at 1920 and shrinks with the viewport.
 */
export function Deco({ src, x, y, size = 84, rotate = 0 }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute hidden items-center justify-center md:flex"
      style={{
        left: `calc(50% + ${x - 960} * var(--u))`,
        top: `calc(${y} * var(--u))`,
        width: `calc(${size} * var(--u))`,
        height: `calc(${size} * var(--u))`,
      }}
    >
      <img
        src={asset(src)}
        alt=""
        width={84}
        height={84}
        loading="lazy"
        className="max-w-none shrink-0 select-none"
        style={{ width: 'calc(84 * var(--u))', height: 'calc(84 * var(--u))', rotate: `${rotate}deg` }}
      />
    </div>
  )
}

/** Heart bullet with a bold title and supporting line (customer app / website lists). */
export function HeartItem({ title, children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="flex shrink-0 items-center justify-center px-0.5 py-1">
        <span className="flex size-[max(24*var(--m),32*var(--u))] items-center justify-center rounded-full bg-primary text-white">
          <Icon icon={FavouriteIcon} filled className="size-[56%]" />
        </span>
      </span>
      <div className="flex min-w-px flex-1 flex-col gap-1.5 leading-normal text-ink">
        <p className="text-[length:max(18*var(--m),20*var(--u))] font-bold">{title}</p>
        <p className="text-base opacity-80">{children}</p>
      </div>
    </li>
  )
}
