import { useEffect, useState } from 'react'

const STORAGE_KEY = 'bake-my-app:onboarding:v1'

export const DEFAULT_BRAND_COLOR = '#c15400'

export const DEFAULT_SETTINGS = {
  businessHours: [
    { day: 'Monday', from: '7:00 AM', to: '9:00 PM', open: true },
    { day: 'Tuesday', from: '7:00 AM', to: '9:00 PM', open: true },
    { day: 'Wednesday', from: '7:00 AM', to: '9:00 PM', open: true },
    { day: 'Thursday', from: '7:00 AM', to: '9:00 PM', open: true },
    { day: 'Friday', from: '7:00 AM', to: '9:00 PM', open: true },
    { day: 'Saturday', from: '8:00 AM', to: '9:00 PM', open: true },
    { day: 'Sunday', from: '--:--', to: '--:--', open: false },
  ],
  orderSettings: {
    acceptDelivery: true,
    acceptPickup: true,
    estimatedDeliveryTime: '25',
    minOrderAmount: '$10.00',
    deliveryRadius: '5',
    taxRate: '2.5',
    taxLabel: 'VAT',
  },
  notifications: {
    newOrders: true,
    statusUpdates: true,
    lowStock: true,
    dailySummary: false,
    weeklyReport: true,
    customerReviews: true,
  },
  security: {
    loginEmail: 'ross@rossbakers.co',
    password: '••••••••••••••••',
    twoFactorEnabled: false,
  },
}

export const INITIAL_STATE = {
  step: 0,
  launched: false,
  shop: {
    name: 'Ross Bakers Co.',
    tagline: 'Freshly baked goods',
    logo: null, // data URL
    address: '742 Evergreen Terrace, Springfield',
    phone: '+1 555-321-8876',
    email: 'hello@rossbakers.co',
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
    estimatedTime: '25 mins',
    allowPickup: true,
    taxRate: '2.5',
    taxLabel: 'VAT',
  },
  settings: DEFAULT_SETTINGS,
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
      settings: {
        ...DEFAULT_SETTINGS,
        ...saved.settings,
        orderSettings: {
          ...DEFAULT_SETTINGS.orderSettings,
          ...saved.settings?.orderSettings,
        },
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...saved.settings?.notifications,
        },
        security: {
          ...DEFAULT_SETTINGS.security,
          ...saved.settings?.security,
        },
        businessHours:
          saved.settings?.businessHours && saved.settings.businessHours.length === 7
            ? saved.settings.businessHours
            : DEFAULT_SETTINGS.businessHours,
      },
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
    updateSettings: (patch) =>
      setState((s) => ({
        ...s,
        settings: {
          ...s.settings,
          ...patch,
        },
      })),
    saveAllSettings: (updates) =>
      setState((s) => ({
        ...s,
        ...(updates.shop ? { shop: { ...s.shop, ...updates.shop } } : {}),
        ...(updates.brandColor ? { brandColor: updates.brandColor } : {}),
        ...(updates.delivery ? { delivery: { ...s.delivery, ...updates.delivery } } : {}),
        ...(updates.settings ? { settings: { ...s.settings, ...updates.settings } } : {}),
      })),
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
