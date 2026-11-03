import { useEffect, useRef } from 'react'
import { mobileAssets } from './mobileAssets'

const D = mobileAssets.detail

export function Glyph({ src, className = '' }) { return <img className={`ma-glyph ${className}`} src={src} alt="" /> }
export function Action({ children, onClick, className = '', ...props }) { return <button type="button" className={`ma-action ${className}`} onClick={onClick} {...props}>{children}</button> }

export function Sheet({ title, onClose, children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const before = document.activeElement
    const el = ref.current
    el?.focus()
    return () => { if (before instanceof HTMLElement && before.isConnected) before.focus() }
  }, [])
  return <div className="ma-overlay" onClick={onClose}>
    <section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`ma-sheet ${className}`} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      if (e.key !== 'Tab') return
      const nodes = [...ref.current.querySelectorAll('button:not(:disabled), input, textarea, select, [tabindex="0"]')]
      const first = nodes[0], last = nodes.at(-1)
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first?.focus() }
    }}>
      <Action className="ma-close ma-round ma-glass" aria-label={`Close ${title}`} onClick={onClose}><Glyph src={D.imgX} /></Action>
      {children}
    </section>
  </div>
}

