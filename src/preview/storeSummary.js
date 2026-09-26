import almondCroissant from '../assets/products/almond-croissant.png'
import chocolateCroissant from '../assets/products/chocolate-croissant.png'
import lotusCroissant from '../assets/products/lotus-croissant.png'
import matchaCroissant from '../assets/products/matcha-croissant.png'
import signatureCroissant from '../assets/products/signature-croissant.png'
import { formatMoney, parseAmount } from '../onboarding/useOnboardingState'

// Fallbacks mirror the sample content in the Figma preview.
const DEFAULT_DELIVERY_FEE = 1.2
const DEFAULT_TAX_RATE = 2.5

const SAMPLE_PRODUCTS = [
  { name: 'Signature Croissant', price: 17.59, image: signatureCroissant },
  { name: 'Chocolate Croissant', price: 20, image: chocolateCroissant, zoomed: true, flipped: true },
  { name: 'Lotus Croissant', price: 22, image: lotusCroissant, flipped: true },
  { name: 'Almond Croissant', price: 34, image: almondCroissant, flipped: true },
  { name: 'Matcha Croissant', price: 32, image: matchaCroissant, isNew: true },
]

const SAMPLE_CART = [
  { name: 'Almond Croissant', price: 22, compareAt: 62, qty: 1, image: almondCroissant, nudge: 1 },
  { name: 'Chocolate Croissant', price: 20, compareAt: 62, qty: 1, image: chocolateCroissant, zoomed: true, nudge: 2 },
]

/** Derives everything the phone preview and review step display from the onboarding answers. */
export function getStoreSummary(state) {
  const { menu, delivery } = state
  const item = menu.item

  const userProduct = item.name.trim()
    ? {
        name: item.name.trim(),
        price: parseAmount(item.price) ?? 0,
        image: item.image ?? signatureCroissant,
        isUserItem: true,
      }
    : null

  const products = userProduct ? [userProduct, ...SAMPLE_PRODUCTS.slice(1)] : SAMPLE_PRODUCTS

  const cartItems = userProduct
    ? [
        {
          ...userProduct,
          compareAt: Math.round((userProduct.price / 0.8) * 100) / 100,
          qty: 1,
          nudge: 1,
        },
        SAMPLE_CART[1],
      ]
    : SAMPLE_CART

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const fee = parseAmount(delivery.fee) ?? DEFAULT_DELIVERY_FEE
  const freeAbove = parseAmount(delivery.freeAbove)
  const freeDelivery = freeAbove !== null && subtotal >= freeAbove
  const deliveryCharge = freeDelivery ? 0 : fee
  const taxRate = parseAmount(delivery.taxRate) ?? DEFAULT_TAX_RATE
  const tax = (subtotal * taxRate) / 100

  return {
    categoryLabel: menu.category.trim() || 'Croissants',
    products,
    cartItems,
    subtotal,
    deliveryCharge,
    freeDelivery,
    deliveryFeeLabel: formatMoney(fee),
    deliveryEta: delivery.estimatedTime,
    allowPickup: delivery.allowPickup,
    taxRate,
    taxLabel: delivery.taxLabel,
    tax,
    total: subtotal + deliveryCharge + tax,
  }
}
