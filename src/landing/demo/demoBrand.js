import { useSyncExternalStore } from 'react'
import { readableTextOn } from '../../lib/color'
import { presetColor } from '../../lib/brandPalette'
const STORAGE_KEY = 'bake-my-app:demo-brand:v1'

// Bake my App purple, for visitors who haven't been through the setup form.
export const DEMO_BRAND_COLOR = '#903BFF'

/* One independent demo brand (color + logo) shared by all four public demos. */
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
  return { color: presetColor(saved.brandColor ?? DEMO_BRAND_COLOR), logo: saved.shop?.logo ?? null }
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
    // Re-read demo customization on the next visit.
    if (!listeners.size) snapshot = null
  }
}

export function setDemoBrandColor(color) {
  color = presetColor(color)
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
