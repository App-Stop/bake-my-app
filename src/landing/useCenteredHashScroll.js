import { useEffect } from 'react'

/** Vertical offset from in-flight reveal animations (useLandingMotion slides content up into place). */
function pendingShift(el, section) {
  let shift = 0
  for (let node = el; node && node !== section; node = node.parentElement) {
    const { transform } = getComputedStyle(node)
    if (transform !== 'none') shift += new DOMMatrix(transform).m42
  }
  return shift
}

/** Box around what's actually visible in a section (text, images, controls), ignoring its padding and decorations. */
function contentRect(section) {
  const rects = [...section.querySelectorAll('h2, h3, p, img, a, button, [role="tabpanel"]')]
    .filter((el) => !el.closest('[aria-hidden="true"]'))
    .map((el) => {
      const r = el.getBoundingClientRect()
      const shift = pendingShift(el, section)
      return { top: r.top - shift, bottom: r.bottom - shift, width: r.width, height: r.height }
    })
    .filter((r) => r.width > 0 && r.height > 0)
  if (!rects.length) return section.getBoundingClientRect()
  const top = Math.min(...rects.map((r) => r.top))
  return { top, height: Math.max(...rects.map((r) => r.bottom)) - top }
}

/** Scroll target that centres the section's content below the fixed nav, or tops it there if it's taller. */
function centeredTop(section) {
  const navBottom = document.querySelector('nav[aria-label="Main"]')?.getBoundingClientRect().bottom ?? 0
  const rect = contentRect(section)
  const available = window.innerHeight - navBottom
  const offset = rect.height <= available ? navBottom + (available - rect.height) / 2 : navBottom + 16
  return window.scrollY + rect.top - offset
}

function scrollToSection(id, behavior) {
  const section = id && document.getElementById(id)
  if (!section) return false
  window.scrollTo({ top: centeredTop(section), behavior })
  return true
}

// 'instant', not 'auto': 'auto' defers to the page's CSS `scroll-behavior: smooth`.
const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth')

/** In-page section links (and arriving at /#section) land with the section centred on screen. */
export function useCenteredHashScroll() {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest?.('a[href^="#"]')
      const id = link?.getAttribute('href').slice(1)
      if (!scrollToSection(id, smooth())) return
      event.preventDefault()
      history.pushState(null, '', `#${id}`)
    }

    // Arriving from another page (e.g. /contact → /#pricing): the browser jumps to the anchor's top
    // once the page has loaded, so centre after that and after fonts settle the layout.
    let frame
    const initialId = decodeURIComponent(window.location.hash.slice(1))
    const centreInitial = () =>
      document.fonts.ready.then(() => {
        frame = requestAnimationFrame(() => scrollToSection(initialId, 'instant'))
      })
    if (initialId) {
      if (document.readyState === 'complete') centreInitial()
      else window.addEventListener('load', centreInitial, { once: true })
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('load', centreInitial)
      cancelAnimationFrame(frame)
    }
  }, [])
}
