import { DEFAULT_COLOR, presetColor } from '../../lib/brandPalette'
import { useState } from 'react'


export const DEFAULT_BRAND_COLOR = DEFAULT_COLOR

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
  launched: false,
  shop: {
    name: 'Ross Bakers Co.',
    tagline: 'Freshly baked goods',
    logo: null, // data URL
    address: '742 Evergreen Terrace, Springfield',
    phone: '3141 Texas, US',
    email: 'contact@rossbakers.com',
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

/** In-memory sample store used by the admin demo. */
export function useDemoState({ initial = INITIAL_STATE } = {}) {
  const [state, setState] = useState(initial)

  const actions = {
    updateShop: (patch) => setState((s) => ({ ...s, shop: { ...s.shop, ...patch } })),
    setBrandColor: (brandColor) => setState((s) => ({ ...s, brandColor: presetColor(brandColor) })),
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
    reset: () => setState(initial),
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