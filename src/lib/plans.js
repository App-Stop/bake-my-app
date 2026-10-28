import { useEffect, useState } from 'react'
import { ROUTES } from '../router'
import { api } from './api'

export const INTERVAL = { monthly: 'month', yearly: 'year' } // the site's toggle -> the API
export const CHECKOUT_PLANS = ['startup', 'growth'] // plans that can be bought online
export const DEFAULT_TRIAL_DAYS = 30 // shown in copy until the API answers

// Kept for the whole visit, so navigating does not refetch; one request is shared by every caller.
let cache = null
let pending = null

const isCents = (value) => Number.isInteger(value) && value >= 0

/** Keeps only well-formed prices, so a bad row can never be shown or sent to checkout. */
function normalize(data) {
  if (!Array.isArray(data)) throw new Error('Unexpected plans response')
  const plans = {}
  for (const plan of data) {
    if (!plan || typeof plan.key !== 'string') continue
    const prices = (Array.isArray(plan.prices) ? plan.prices : []).filter(
      (price) =>
        (price?.interval === 'month' || price?.interval === 'year') &&
        typeof price.currency === 'string' &&
        isCents(price.amount) &&
        isCents(price.monthlyEquivalent) &&
        isCents(price.trialDays),
    )
    plans[plan.key] = { ...plan, prices }
  }
  return plans
}

function loadPlans() {
  pending ??= api
    .get('/v1/plans')
    .then(({ data }) => (cache = normalize(data)))
    .finally(() => {
      pending = null
    })
  return pending
}

/** `{ plans, failed }`: plans keyed by `key` once loaded, `failed` when the API could not be read. */
export function usePlans() {
  const [state, setState] = useState({ plans: cache, failed: false })

  useEffect(() => {
    if (cache) return undefined
    let active = true
    loadPlans().then(
      (plans) => active && setState({ plans, failed: false }),
      () => active && setState({ plans: null, failed: true }),
    )
    return () => {
      active = false
    }
  }, [])

  return state
}

// billing is the toggle value: 'monthly' | 'yearly'
export const priceFor = (plans, key, billing) => priceForInterval(plans, key, INTERVAL[billing])

// interval is the API value: 'month' | 'year'
export const priceForInterval = (plans, key, interval) =>
  plans?.[key]?.prices.find((price) => price.interval === interval) ?? null

/** Link for a plan button: checkout unless the API failed or says the price can't be bought online. */
export function planHref({ plans, failed }, key, interval) {
  const price = priceForInterval(plans, key, interval)
  const unavailable = failed || (plans && !price?.purchasable)
  return !CHECKOUT_PLANS.includes(key) || unavailable
    ? ROUTES.contact
    : `${ROUTES.checkout}?plan=${key}&interval=${interval}`
}

/** `exact` always shows cents ("$0.00"), as on the checkout summary; otherwise whole amounts drop them ("$99"). */
export const formatMoney = (cents, currency = 'usd', exact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: exact || cents % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100)

/** "November 23, 2026" for today plus `days`. */
export const formatDaysFromNow = (days) =>
  new Date(Date.now() + days * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
