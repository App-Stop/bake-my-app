import { useSyncExternalStore } from 'react'

/*
 * Which device previews a visitor can choose. A visitor can preview their own device class and
 * anything smaller: phones see Mobile only, tablets see Tablet and Mobile, desktops see all three.
 */
export const DEVICES = ['desktop', 'tablet', 'mobile']
const RANK = { mobile: 0, tablet: 1, desktop: 2 }

// Touch-only devices are classed by their shorter side, so rotating a phone or tablet never
// changes its class. Mouse and trackpad devices use the window width.
const TOUCH_QUERY = '(pointer: coarse) and (hover: none)'

function readViewer() {
  if (typeof window === 'undefined') return 'desktop'
  const { innerWidth: width, innerHeight: height } = window
  if (window.matchMedia(TOUCH_QUERY).matches) return Math.min(width, height) < 600 ? 'mobile' : 'tablet'
  return width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
}

function subscribeViewer(onChange) {
  const query = window.matchMedia(TOUCH_QUERY)
  window.addEventListener('resize', onChange)
  query.addEventListener('change', onChange)
  return () => {
    window.removeEventListener('resize', onChange)
    query.removeEventListener('change', onChange)
  }
}

/** The visitor's device class: 'mobile', 'tablet' or 'desktop'. */
export function useViewerDevice() {
  return useSyncExternalStore(subscribeViewer, readViewer, () => 'desktop')
}

// The chosen preview is shared by every demo for the visit, so switching demos keeps it.
let chosen = null
const listeners = new Set()
const subscribeChoice = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setPreviewDevice(device) {
  chosen = device
  listeners.forEach((listener) => listener())
}

/**
 * The preview device for a demo that supports `supported` devices. Returns the visitor's class,
 * the selectable `options` (largest first) and the active `device`, which defaults to the
 * largest option and falls back to it when the visitor's class no longer allows the choice.
 */
export function usePreviewDevice(supported = DEVICES) {
  const viewer = useViewerDevice()
  const choice = useSyncExternalStore(subscribeChoice, () => chosen, () => null)
  const allowed = DEVICES.filter((device) => RANK[device] <= RANK[viewer] && supported.includes(device))
  const options = allowed.length ? allowed : [supported[supported.length - 1]]
  const device = options.includes(choice) ? choice : options[0]
  return { viewer, device, options, setDevice: setPreviewDevice }
}
