import { useState } from 'react'
import { DesktopScreen } from '../../preview/DesktopScreen'
import { WEBSITE_PRODUCTS } from './storefrontCatalog'
import { HomeScreen } from '../../preview/HomeScreen'
import { PhoneFrame } from '../../preview/phone'
import './storefront-demo.css'

const money = (value) => `$${value.toFixed(2)}`
const DEMO_CATEGORIES = ['Croissants', 'Cakes', 'Coffee', 'Bread', 'Cupcakes', 'Cookies', 'Donuts']

/** A local demo session: no payments or customer data leave the browser. */
export function StorefrontDemo({ mobile = false, summary, logo, mark, height }) {
  const [screen, setScreen] = useState('home')
  const [category, setCategory] = useState('Croissants')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [fulfillment, setFulfillment] = useState('Delivery')
  const [address, setAddress] = useState('742 Evergreen Terrace, Texas')
  const [orders, setOrders] = useState([])
  const [account, setAccount] = useState(null)
  const [notice, setNotice] = useState('')
  const products = WEBSITE_PRODUCTS
  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0) / 100
  const fee = fulfillment === 'Delivery' && subtotal > 0 ? 2.5 : 0
  const tax = Math.round(subtotal * 2.5) / 100
  const total = Math.round((subtotal + fee + tax) * 100) / 100
  const go = (next) => { setScreen(next); setNotice('') }
  const add = (item, qty = 1) => {
    setCart((items) => items.some((entry) => entry.name === item.name)
      ? items.map((entry) => entry.name === item.name ? { ...entry, qty: entry.qty + qty } : entry)
      : [...items, { ...item, qty }])
    setNotice(`${item.name} added to cart`)
  }
  const toggleFavorite = (item) => setFavorites((items) => items.includes(item.name) ? items.filter((name) => name !== item.name) : [...items, item.name])
  const changeQty = (name, delta) => setCart((items) => items.map((item) => item.name === name ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0))
  const openProduct = (item) => { setProduct(item); setQuantity(1); go('product') }
  const browse = (next = category) => { setCategory(next); go('menu') }
  const actions = {
    add, openProduct, toggleFavorite, favorites, count, address,
    browse, go, query, setQuery: (value) => { setQuery(value); setScreen('menu') },
  }
  const shown = products.filter((item) => item.category === category && item.name.toLowerCase().includes(query.toLowerCase()))
  const button = (label, onClick, extra = '') => <button type="button" className={`sd-button ${extra}`} onClick={onClick}>{label}</button>
  const card = (item) => <article className="sd-card" key={item.name}>
    <button type="button" className="sd-product" onClick={() => openProduct(item)}><img src={item.image} alt={item.name} /><strong>{item.name}</strong><span>{money(item.price)} / {item.unit || 'piece'}</span></button>
    <div className="sd-row">{button('Add to cart', () => add(item))}{button(favorites.includes(item.name) ? '♥' : '♡', () => toggleFavorite(item), 'sd-secondary')}</div>
  </article>
  const totals = <div className="sd-totals"><p>Subtotal <span>{money(subtotal)}</span></p><p>Delivery <span>{money(fee)}</span></p><p>Tax (2.5%) <span>{money(tax)}</span></p><p><strong>Total</strong><strong>{money(total)}</strong></p></div>
  const content = <div className={`storefront-demo ${mobile ? 'sd-mobile' : 'sd-desktop'}`} style={{ width: mobile ? 241.2 : 641.2, height: mobile ? 524.4 : height }}>
    {screen === 'home' ? mobile
      ? <HomeScreen summary={{ ...summary, products: products.filter((item) => item.category === 'Croissants') }} logo={logo} mark={mark} address={address} actions={actions} />
      : <DesktopScreen summary={summary} logo={logo} height={height} framed={false} actions={actions} />
      : <div className="sd-page">
        <header className="sd-header">{button('‹ Home', () => go('home'), 'sd-secondary')}<strong>{screen === 'menu' ? 'Our menu' : screen === 'product' ? 'Fresh from the oven' : screen === 'account' ? 'My account' : screen === 'address' ? 'Delivery address' : screen === 'login' || screen === 'signup' ? 'Welcome to your bakery' : screen === 'success' ? 'Order confirmed' : screen[0].toUpperCase() + screen.slice(1)}</strong>{button(`Cart (${count})`, () => go('cart'))}</header>
        <main className="sd-main">
          {screen === 'menu' && <><label className="sd-label">Search our menu<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cakes, croissants…" /></label><div className="sd-categories">{DEMO_CATEGORIES.map((name) => button(name, () => setCategory(name), name === category ? '' : 'sd-secondary'))}</div><div className="sd-grid">{shown.map(card)}</div>{!shown.length && <p>No matching items. Try another search or category.</p>}</>}
          {screen === 'product' && product && <div className="sd-detail"><img src={product.image} alt={product.name} /><div><h2>{product.name}</h2><p>Freshly baked with carefully selected ingredients, prepared to order.</p><p>★ {product.rating || '4.8'} · {product.kcal || 272} kCal</p><p>Contains wheat, milk and eggs. Ask the bakery about allergens.</p><h3>{money(product.price)}</h3><div className="sd-row">{button('−', () => setQuantity(Math.max(1, quantity - 1)), 'sd-secondary')}<output aria-label="Quantity">{quantity}</output>{button('+', () => setQuantity(quantity + 1), 'sd-secondary')}</div>{button(`Add ${quantity} to cart · ${money(product.price * quantity)}`, () => add(product, quantity))}{button(favorites.includes(product.name) ? 'Remove from favorites' : 'Save to favorites', () => toggleFavorite(product), 'sd-secondary')}</div></div>}
          {screen === 'cart' && <>{cart.length ? <>{cart.map((item) => <article className="sd-cart-item" key={item.name}><img src={item.image} alt="" /><div><strong>{item.name}</strong><p>{money(item.price * item.qty)}</p><div className="sd-row">{button('−', () => changeQty(item.name, -1), 'sd-secondary')}<output aria-label={`${item.name} quantity`}>{item.qty}</output>{button('+', () => changeQty(item.name, 1), 'sd-secondary')}{button('Remove', () => setCart((items) => items.filter((entry) => entry.name !== item.name)), 'sd-secondary')}</div></div></article>)}{totals}{button('Continue to checkout', () => go('checkout'))}</> : <><h2>Your cart is empty</h2><p>Add something freshly baked to get started.</p>{button('Browse menu', () => browse())}</>}</>}
          {screen === 'checkout' && <form onSubmit={(event) => { event.preventDefault(); if (!cart.length) return; const order = { id: `BMA-${1001 + orders.length}`, items: cart.map((item) => ({ ...item })), total, fulfillment, address }; setOrders((items) => [order, ...items]); setCart([]); go('success') }}><p>This is a demo order. No payment will be collected.</p><div className="sd-row">{['Delivery', 'Pickup'].map((name) => button(name, () => setFulfillment(name), fulfillment === name ? '' : 'sd-secondary'))}</div><label className="sd-label">Your name<input required autoComplete="name" defaultValue={account?.name} /></label><label className="sd-label">Phone number<input required type="tel" autoComplete="tel" /></label>{fulfillment === 'Delivery' ? <label className="sd-label">Delivery address<input required value={address} onChange={(event) => setAddress(event.target.value)} /></label> : <p>Pickup at our Main Street bakery. Ready in 20–30 minutes.</p>}<label className="sd-label">Order notes<textarea placeholder="Anything we should know?" /></label><p>Payment: {fulfillment === 'Delivery' ? 'Cash on delivery' : 'Pay at pickup'}</p>{totals}<button className="sd-button" disabled={!cart.length}>Place demo order</button></form>}
          {screen === 'success' && <><h2>Thank you! Your order is in the oven.</h2><p>Order {orders[0]?.id} · {money(orders[0]?.total || 0)}</p><p>{orders[0]?.fulfillment} · Estimated 20–30 minutes</p>{button('Track your order', () => go('orders'))}{button('Continue shopping', () => browse(), 'sd-secondary')}</>}
          {screen === 'orders' && <>{orders.length ? orders.map((order) => <article className="sd-card" key={order.id}><h3>{order.id} · Preparing</h3><p>{order.fulfillment} · {money(order.total)}</p>{order.items.map((item) => <p key={item.name}>{item.qty} × {item.name}</p>)}<ol><li>Order received ✓</li><li>Preparing your order</li><li>{order.fulfillment === 'Delivery' ? 'Out for delivery' : 'Ready for pickup'}</li><li>Completed</li></ol><p>Estimated 20–30 minutes</p></article>) : <><p>No orders yet. Place a demo order to see it here.</p>{button('Browse menu', () => browse())}</>}</>}
          {screen === 'favorites' && <><div className="sd-grid">{products.filter((item) => favorites.includes(item.name)).map(card)}</div>{!favorites.length && <p>Save items with the heart button to find them here.</p>}</>}
          {screen === 'account' && <><h2>{account ? `Hello, ${account.name}` : 'Welcome to your bakery'}</h2>{!account && <div className="sd-row">{button('Log in', () => go('login'))}{button('Sign up', () => go('signup'), 'sd-secondary')}</div>}{button('My orders', () => go('orders'))}{button('Favorites', () => go('favorites'), 'sd-secondary')}{button('Delivery address', () => go('address'), 'sd-secondary')}{account && button('Log out', () => { setAccount(null); go('home') }, 'sd-secondary')}</>}
          {(screen === 'login' || screen === 'signup') && <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setAccount({ name: data.get('name') || data.get('email').split('@')[0] }); go('account') }}><p>Try a local demo account with sample details.</p>{screen === 'signup' && <label className="sd-label">Name<input name="name" required autoComplete="name" /></label>}<label className="sd-label">Email<input name="email" type="email" required autoComplete="email" /></label><label className="sd-label">Password<input type="password" minLength={6} required autoComplete="off" /></label><button className="sd-button">{screen === 'signup' ? 'Create demo account' : 'Log in'}</button>{button(screen === 'signup' ? 'Already have an account? Log in' : 'Create an account', () => go(screen === 'signup' ? 'login' : 'signup'), 'sd-secondary')}</form>}
          {screen === 'address' && <form onSubmit={(event) => { event.preventDefault(); go('home') }}><label className="sd-label">Street address<input required value={address} onChange={(event) => setAddress(event.target.value)} /></label><button className="sd-button">Save address</button></form>}
          {screen === 'notifications' && <><h2>You’re all caught up</h2><p>Your order updates and bakery offers will appear here.</p>{button('My orders', () => go('orders'))}</>}
        </main>
      </div>}
    {notice && <div className="sd-notice" role="status">{notice}{button('View cart', () => go('cart'))}{button('×', () => setNotice(''), 'sd-secondary')}</div>}
    <nav className="sd-nav" aria-label="Store navigation">{button('Home', () => go('home'), 'sd-secondary')}{button('Menu', () => browse(), 'sd-secondary')}{button(`Cart (${count})`, () => go('cart'), 'sd-secondary')}{button('Me', () => go('account'), 'sd-secondary')}</nav>
  </div>
  return mobile && screen !== 'home' ? <PhoneFrame interactive label="Interactive customer app demo">{content}</PhoneFrame> : content
}
