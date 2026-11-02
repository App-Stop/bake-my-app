import almondCroissant from '../../assets/products/almond-croissant.webp'
import chocolateCroissant from '../../assets/products/chocolate-croissant.webp'
import lotusCroissant from '../../assets/products/lotus-croissant.webp'
import matchaCroissant from '../../assets/products/matcha-croissant.webp'
import signatureCroissant from '../../assets/products/signature-croissant.webp'
import cake0672a from '../../assets/desktop/cake-0672a.webp'
import cake0c45c from '../../assets/desktop/cake-0c45c.webp'
import cake2bcfb from '../../assets/desktop/cake-2bcfb.webp'
import cake37d97 from '../../assets/desktop/cake-37d97.webp'
import cake5b259 from '../../assets/desktop/cake-5b259.webp'
import cake616ba from '../../assets/desktop/cake-616ba.webp'
import cake7b605 from '../../assets/desktop/cake-7b605.webp'
import cake7edde from '../../assets/desktop/cake-7edde.webp'
import cakeA01fd from '../../assets/desktop/cake-a01fd.webp'
import cakeB23a4 from '../../assets/desktop/cake-b23a4.webp'
import cakeB52a7 from '../../assets/desktop/cake-b52a7.webp'
import cakeB6b25 from '../../assets/desktop/cake-b6b25.webp'
import cakeCcc58 from '../../assets/desktop/cake-ccc58.webp'
import cakeD3a5c from '../../assets/desktop/cake-d3a5c.webp'
import cakeD8067 from '../../assets/desktop/cake-d8067.webp'
import coffee from '../../assets/dashboard/macchiato.webp'
import bread from '../../assets/menu/bread.svg'
import cupcake from '../../assets/menu/cupcake.svg'
import cookie from '../../assets/menu/biscuit.svg'
import donut from '../../assets/menu/donut.webp'

const FLIP = 'scaleX(-1)'
const ZOOM = { size: '135.96%', left: '-17.98%', top: '-17.98%' }
const WIDE = { width: '150%', height: '100%', left: '-28.21%', top: '0' }

export const CROISSANTS = [
  { name: 'Classic Butter Croissant', price: 4.5, kcal: 272, rating: 4.8, reviews: '2.1k+', image: signatureCroissant },
  { name: 'Chocolate Croissant', price: 5.25, kcal: 310, rating: 4.9, reviews: '3.4k+', image: chocolateCroissant, crop: ZOOM, flip: true },
  { name: 'Almond Croissant', price: 5.75, kcal: 420, rating: 4.7, reviews: '1.8k+', image: lotusCroissant, flip: true },
  { name: 'Ham & Cheese Croissant', price: 6.5, kcal: 385, rating: 4.6, reviews: '980+', image: almondCroissant, flip: true },
  { name: 'Pistachio Croissant', price: 6.95, kcal: 395, rating: 4.9, reviews: '2.7k+', image: matchaCroissant, isNew: true },
  { name: 'Matcha White Choc Croissant', price: 7.25, kcal: 365, rating: 4.5, reviews: '640+', image: signatureCroissant, flip: true },
  { name: 'Plain Croissant', price: 3.75, kcal: 240, rating: 4.4, reviews: '5.2k+', image: chocolateCroissant, crop: ZOOM, flip: true },
  { name: 'Raspberry Croissant', price: 5.5, kcal: 335, rating: 4.7, reviews: '1.5k+', image: lotusCroissant, flip: true },
  { name: 'Cinnamon Crème Croissant', price: 5.95, kcal: 350, rating: 4.8, reviews: '2.3k+', image: almondCroissant, flip: true },
]

// The blurred glow behind each cake is sometimes a different shot than the cake itself.
export const CAKES = [
  { name: 'Black Forest Gateau', price: 38, unit: 'whole', kcal: 450, rating: 4.8, reviews: '2.1k+', image: cake5b259, glow: cake5b259, glowTransform: 'scaleY(-1)' },
  { name: 'Funfetti Birthday Cake', price: 42, unit: 'whole', kcal: 380, rating: 4.9, reviews: '3.4k+', image: cake0672a, glow: cake0672a, glowTransform: 'rotate(180deg)', flip: true },
  { name: 'Strawberry Mousse Cake', price: 45, unit: 'whole', kcal: 320, rating: 4.7, reviews: '1.8k+', image: cakeB52a7, glow: cakeB52a7, glowTransform: 'rotate(180deg)', crop: WIDE, flip: true },
  { name: 'Chocolate Ganache Cake', price: 32.99, kcal: 450, rating: 4.9, reviews: '3.2k+', image: cakeCcc58, glow: cake7edde, glowTransform: 'scaleY(-1)' },
  { name: 'Vanilla Bean Cheesecake', price: 26.99, kcal: 320, rating: 4.7, reviews: '1.9k+', image: cakeB23a4, glow: cakeA01fd, glowTransform: FLIP, flip: true },
  { name: 'Strawberry Shortcake', price: 24.99, kcal: 290, rating: 4.6, reviews: '2.3k+', image: cake37d97, glow: cake2bcfb, glowTransform: 'rotate(180deg)', crop: WIDE, flip: true },
  { name: 'Red Velvet Layer Cake', price: 28.5, kcal: 380, rating: 4.8, reviews: '2.7k+', image: cakeD3a5c, glow: cake7b605, glowTransform: 'scaleY(-1)' },
  { name: 'Tiramisu Layer Cake', price: 34.5, kcal: 410, rating: 4.9, reviews: '4.1k+', image: cake0c45c, glow: cake616ba, glowTransform: 'rotate(180deg)', flip: true },
  { name: 'Lemon Drizzle Cake', price: 22.5, kcal: 260, rating: 4.8, reviews: '1.5k+', image: cakeD8067, glow: cakeB6b25, glowTransform: 'rotate(180deg)', crop: WIDE, flip: true },
]

export const WEBSITE_PRODUCTS = [
  ...CROISSANTS.map((item) => ({ ...item, category: 'Croissants' })),
  ...CAKES.map((item) => ({ ...item, category: 'Cakes' })),
  { name: 'Cappuccino', price: 4.5, image: coffee, category: 'Coffee' },
  { name: 'Artisan Sourdough', price: 7, image: bread, category: 'Bread' },
  { name: 'Vanilla Cupcake', price: 3.5, image: cupcake, category: 'Cupcakes' },
  { name: 'Chocolate Chip Cookie', price: 2.5, image: cookie, category: 'Cookies' },
  { name: 'Glazed Donut', price: 3, image: donut, category: 'Donuts' },
]
