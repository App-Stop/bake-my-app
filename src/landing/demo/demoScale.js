import { useLayoutEffect, useState, useSyncExternalStore } from 'react'

/**
 * `--d` is one Figma px of the 1920×1174 demo frames, shrinking so the whole frame fits the
 * viewport's width and height on desktop. Below lg the demos switch to their phone layouts, where
 * `--d` only sizes decorations and the phone mockup.
 */
export const DEMO_UNIT = '[--d:min(1px,calc(100vw/1174))] lg:[--d:min(1px,calc(100vw/1920),calc(100dvh/1174))]'

const DESKTOP_QUERY = '(min-width: 64rem)'
const subscribe = (onChange) => {
  const query = window.matchMedia(DESKTOP_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** True from the lg breakpoint up, where the demos show their framed desktop layouts. */
export function useIsDesktop() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP_QUERY).matches, () => true)
}

/** Scale that maps `baseWidth` px of content onto the element's current width. */
export function useScaleTo(ref, baseWidth) {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    const update = () => setScale(el.offsetWidth / baseWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, baseWidth])
  return scale
}

/** The element's current size in px, kept in sync as it resizes. */
export function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}
