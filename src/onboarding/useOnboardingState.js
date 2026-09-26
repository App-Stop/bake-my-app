import { useEffect, useState } from 'react'

const STORAGE_KEY = 'bake-my-app:onboarding:v1'

export const DEFAULT_BRAND_COLOR = '#554cf1'

export const INITIAL_STATE = {
  step: 0,
  launched: false,
  shop: {
    name: '',
    tagline: '',
    logo: null, // data URL
    address: '',
    phone: '',
    email: '',
  },
  brandColor: DEFAULT_BRAND_COLOR,
  menu: {
    category: '',
    item: {
      name: '',
      price: '',
      prepTime: '',
      description: '',
      image: null, // data URL
    },
  },
  delivery: {
    fee: '',
    freeAbove: '',
    estimatedTime: '20-30 minutes',
    allowPickup: false,
    taxRate: '',
    taxLabel: 'VAT',
  },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE
    const saved = JSON.parse(raw)
    return {
      ...INITIAL_STATE,
      ...saved,
      shop: { ...INITIAL_STATE.shop, ...saved.shop },
      menu: {
        ...INITIAL_STATE.menu,
        ...saved.menu,
        item: { ...INITIAL_STATE.menu.item, ...saved.menu?.item },
      },
      delivery: { ...INITIAL_STATE.delivery, ...saved.delivery },
    }
  } catch {
    return INITIAL_STATE
  }
}

/** Onboarding answers, persisted to localStorage so a refresh doesn't lose progress. */
export function useOnboardingState() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage full (large images) or unavailable — the flow still works in memory.
    }
  }, [state])

  const actions = {
    goTo: (step) => setState((s) => ({ ...s, step })),
    updateShop: (patch) => setState((s) => ({ ...s, shop: { ...s.shop, ...patch } })),
    setBrandColor: (brandColor) => setState((s) => ({ ...s, brandColor })),
    setCategory: (category) => setState((s) => ({ ...s, menu: { ...s.menu, category } })),
    updateItem: (patch) =>
      setState((s) => ({ ...s, menu: { ...s.menu, item: { ...s.menu.item, ...patch } } })),
    updateDelivery: (patch) =>
      setState((s) => ({ ...s, delivery: { ...s.delivery, ...patch } })),
    launch: () => setState((s) => ({ ...s, launched: true })),
    unlaunch: () => setState((s) => ({ ...s, launched: false })),
    reset: () => setState(INITIAL_STATE),
  }

  return [state, actions]
}

/** Parses "$1.25", "1.25" or "12%" into a number, or null when empty/invalid. */
export function parseAmount(value) {
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : null
}

export function formatMoney(n) {
  return `$${n.toFixed(2)}`
}
