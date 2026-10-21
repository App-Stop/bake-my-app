import { useSyncExternalStore } from 'react'
import { readableTextOn } from '../../lib/color'
import { STORAGE_KEY } from '../../onboarding/useOnboardingState'

// Bake my App purple, for visitors who haven't been through the setup form.
export const DEMO_BRAND_COLOR = '#554cf1'

/*
 * One brand (color + logo) shared by all four demos. It is read from the setup form's saved answers,
 * so a logo and color picked there show up in every demo, and color picks on the demo rail are
 * written back so switching demos (or returning to setup) keeps the same color.
 */
const listeners = new Set()
let snapshot = null

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function read() {
  const saved = readSaved()
  return { color: saved.brandColor ?? DEMO_BRAND_COLOR, logo: saved.shop?.logo ?? null }
}

function getSnapshot() {
  snapshot ??= read()
  return snapshot
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY) return
    snapshot = read()
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
    // Re-read on the next visit: the setup form may have changed the saved answers meanwhile.
    if (!listeners.size) snapshot = null
  }
}

export function setDemoBrandColor(color) {
  snapshot = { ...getSnapshot(), color }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readSaved(), brandColor: color }))
  } catch {
    // Storage unavailable: the demos still share the color for this visit.
  }
  listeners.forEach((listener) => listener())
}

/** CSS variables that theme a demo (storefront `--brand*` and the demo chrome's primary) in `color`. */
export function brandTheme(color) {
  const light = `color-mix(in oklab, ${color} 8%, white)`
  return {
    '--brand': color,
    '--brand-light': light,
    '--on-brand': readableTextOn(color),
    '--color-primary': color,
    '--color-primary-light': light,
  }
}

/** `{ color, logo }` for the demos; `logo` is the uploaded data URL, or null for the default logo. */
export function useDemoBrand() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
