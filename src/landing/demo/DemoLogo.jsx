import { asset } from '../styles'
import { useDemoBrand } from './demoBrand'

/**
 * The store logo in the demos: the visitor's uploaded logo from setup when there is one, otherwise
 * the exported Bake My App logo tinted with `tint` (the active demo brand color by default).
 */
export function DemoLogo({ className = '', label = 'Bake My App', tint = 'bg-brand' }) {
  const { logo } = useDemoBrand()
  if (logo) return <img src={logo} alt={label} className={`shrink-0 object-contain ${className}`} />

  const mask = `url("${asset('demo/bma-logo.svg')}") center / contain no-repeat`

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block shrink-0 ${tint} ${className}`}
      style={{ WebkitMask: mask, mask }}
    />
  )
}
