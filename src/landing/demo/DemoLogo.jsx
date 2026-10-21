import { asset } from '../styles'

/** The exported Bake My App logo, tinted with the active demo brand color. */
export function DemoLogo({ className = '', label = 'Bake My App' }) {
  const mask = `url("${asset('demo/bma-logo.svg')}") center / contain no-repeat`

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block shrink-0 bg-brand ${className}`}
      style={{ WebkitMask: mask, mask }}
    />
  )
}
