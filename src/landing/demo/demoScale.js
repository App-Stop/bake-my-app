import { useLayoutEffect, useState } from 'react'

/**
 * `--d` is one Figma px of the 1920×1174 demo frames, shrinking so the whole frame fits the
 * viewport's width and height on desktop.
 */
export const DEMO_UNIT = '[--d:min(1px,calc(100vw/1174))] lg:[--d:min(1px,calc(100vw/1920),calc(100dvh/1174))]'

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
