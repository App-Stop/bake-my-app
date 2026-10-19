import { useEffect, useState } from 'react'

const MINIMUM_DISPLAY_TIME = 350
const MAXIMUM_WAIT_TIME = 12000

function waitForImage(image) {
  if (image.complete) return Promise.resolve()

  // Lazy images may not be requested until they approach the viewport. Preload a
  // copy so the loader can account for them without forcing their layout behavior.
  if (image.loading === 'lazy') {
    return new Promise((resolve) => {
      const preload = new Image()
      preload.onload = resolve
      preload.onerror = resolve
      preload.src = image.currentSrc || image.src
    })
  }

  return new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true })
    image.addEventListener('error', resolve, { once: true })
  })
}

/** Covers the initial render until the active page's fonts and imagery are ready. */
export function SiteLoader() {
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    let cancelled = false
    let hideTimer
    let unmountTimer
    const startedAt = performance.now()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.getElementById('root')?.setAttribute('aria-busy', 'true')

    const assetsReady = new Promise((resolve) => {
      requestAnimationFrame(() => {
        const images = [...document.images].map(waitForImage)
        const fonts = document.fonts?.ready ?? Promise.resolve()
        Promise.allSettled([fonts, ...images]).then(resolve)
      })
    })
    const timeout = new Promise((resolve) => window.setTimeout(resolve, MAXIMUM_WAIT_TIME))

    Promise.race([assetsReady, timeout]).then(() => {
      if (cancelled) return
      const remaining = Math.max(0, MINIMUM_DISPLAY_TIME - (performance.now() - startedAt))
      hideTimer = window.setTimeout(() => {
        if (cancelled) return
        setVisible(false)
        document.body.style.overflow = previousOverflow
        document.getElementById('root')?.removeAttribute('aria-busy')
        unmountTimer = window.setTimeout(() => setMounted(false), 300)
      }, remaining)
    })

    return () => {
      cancelled = true
      window.clearTimeout(hideTimer)
      window.clearTimeout(unmountTimer)
      document.body.style.overflow = previousOverflow
      document.getElementById('root')?.removeAttribute('aria-busy')
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      role="status"
      aria-label="Loading Bake My App"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-300 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div className="flex flex-col items-center gap-5 text-white">
        <img
          src={`${import.meta.env.BASE_URL}landing/site-nav-logo.svg`}
          alt=""
          aria-hidden="true"
          width="69"
          height="50"
          className="site-loader-logo h-auto w-[69px]"
        />
        <span className="h-1 w-24 overflow-hidden rounded-full bg-white/25">
          <span className="site-loader-progress block h-full w-1/2 rounded-full bg-white" />
        </span>
        <span className="sr-only">Loading fonts and images</span>
      </div>
    </div>
  )
}
