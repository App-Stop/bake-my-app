import { useCallback, useEffect, useRef, useState } from 'react'
import { PhoneFrame } from '../../preview/phone'
import { mobileAssets } from './mobileAssets'
import { Action, Glyph, Sheet } from './MobileUI'
import { WEBSITE_PRODUCTS } from './storefrontCatalog'
import './mobile-storefront.css'
import './mobile-motion.css'
import { MobileCheckout, PlacingOrder, OrderTracking } from './MobileOrderScreens'

const H = mobileAssets.home
const D = mobileAssets.detail
const C = mobileAssets['230:1283']
const A = mobileAssets['230:3170']
const money = (n) => `$${(n / 100).toFixed(2)}`
const PRODUCTS = [
  ['Signature Croissant', 1759, H.imgImage2],
  ['Chocolate Croissant', 2000, H.imgImage3],
  ['Lotus Croissant', 2200, H.imgImage4],
  ['Almond Croissant', 3400, H.imgImage5],
  ['Matcha Croissant', 3200, H.imgImage6],
].map(([name, price, image], i) => ({ name, price, image, category: 'Croissants', flip: [1, 2, 3].includes(i), zoom: i === 1, isNew: i === 4 }))
const OTHER_PRODUCTS = WEBSITE_PRODUCTS.filter((p) => p.category !== 'Croissants').map((p) => ({ ...p, price: Math.round(p.price * 100) }))
const CATEGORIES = [['Croissants', H.imgCroissant], ['Cakes', H.imgCake], ['Coffee', H.imgCoffee02], ['Bread', H.imgBread04], ['Cupcakes', H.imgCupcake02], ['Cookies', H.imgBiscuit]]
const ROLLING_ICONS = [H.imgCroissant1, H.imgDonut, H.imgBiscuit1, H.imgCupcake3, H.imgCake1, H.imgCoffee3, H.imgBread5, H.imgCroissant1]
const ADDONS = [
  { name: 'Chocolate Syrup', price: 300, image: D.imgImage2 },
  { name: 'Caramel Sauce', price: 250, image: D.imgImage3 },
  { name: 'Whipped Cream', price: 150, image: D.imgImage4 },
]

function ProductImage({ item, className = '' }) {
  return <span className={`ma-photo ${item.flip ? 'ma-photo-flipped' : ''} ${item.zoom ? 'ma-photo-zoomed' : ''} ${className}`}><img src={item.image} alt="" /></span>
}

function SwipeItem({ item, signedIn, change, remove }) {
  const [revealed, setRevealed] = useState(false)
  const start = useRef(null)
  return <div className={`ma-swipe ${revealed ? 'ma-revealed' : ''}`} onPointerDown={(e) => { start.current = { x: e.clientX, y: e.clientY } }} onPointerUp={(e) => {
    if (!start.current) return
    const dx = e.clientX - start.current.x, dy = e.clientY - start.current.y
    if (Math.abs(dx) > 25 && Math.abs(dx) > Math.abs(dy)) setRevealed(dx < 0)
    start.current = null
  }}>
    <Action className="ma-delete ma-round" tabIndex={revealed ? 0 : -1} aria-hidden={!revealed} aria-label={`Delete ${item.name}`} onClick={() => remove(item.name)}><Glyph src={mobileAssets['230:2533'].imgDelete01} /></Action>
    <article className="ma-cart-item">
      <ProductImage className="ma-cart-image" item={item} />
      <div className="ma-cart-info"><strong>{item.name}</strong><div className="ma-cart-line"><span>{money(item.price)}</span>{item.category === 'Croissants' && <><s>{money(Math.round(item.price / .8))}</s><small>20% OFF</small></>}
        <div className="ma-quantity"><Action aria-label={`Decrease ${item.name} quantity`} onClick={() => item.qty === 1 ? setRevealed(!revealed) : change(item.name, -1)}>{item.qty === 1 ? <Glyph src={C.imgDelete02} /> : '−'}</Action><output aria-label={`${item.name} quantity`}>{item.qty}</output><Action aria-label={`Increase ${item.name} quantity`} onClick={() => change(item.name, 1)}><Glyph src={C.imgPlus} /></Action></div>
      </div>{signedIn && item.category === 'Croissants' && <p className="ma-nudge">{item.qty < 3 ? <>Add {3 - item.qty} more to <span>get 10% off</span></> : <span>10% quantity discount applied</span>}</p>}</div>
    </article>
  </div>
}

/** Customer app demo. All cart, account and order data stays in this mounted preview. */
export function MobileStorefront({ logo, mark }) {
  const [screen, setScreen] = useState('home')
  const [category, setCategory] = useState('Croissants')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [modal, setModal] = useState(null)
  const [product, setProduct] = useState(PRODUCTS[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [mode, setMode] = useState('Delivery')
  const [addresses, setAddresses] = useState(['742 Evergreen Terrace, Texas', '125 Main Street, Texas', '28 Oak Avenue, Texas'])
  const [address, setAddress] = useState(addresses[0])
  const [editAddress, setEditAddress] = useState(null)
  const [addressDraft, setAddressDraft] = useState('')
  const [account, setAccount] = useState('')
  const [promo, setPromo] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [message])
  const [checkoutInfo, setCheckoutInfo] = useState({ name: 'John Doe', phone: '+1 213 1231232', instructions: 'Please ring the bell twice', leaveAtDoor: false, priority: false })
  const [pendingOrder, setPendingOrder] = useState(null)
  const nextOrderId = useRef(231)
  const [order, setOrder] = useState(null)
  const [stage, setStage] = useState(0)
  const allProducts = [...PRODUCTS, ...OTHER_PRODUCTS]
  const count = cart.reduce((n, p) => n + p.qty, 0)
  const subtotal = cart.reduce((n, p) => n + p.price * p.qty, 0)
  const bulkDiscount = account ? cart.reduce((n, p) => n + (p.category === 'Croissants' && p.qty >= 3 ? Math.round(p.price * p.qty * .1) : 0), 0) : 0
  const discount = bulkDiscount + (appliedPromo ? Math.round((subtotal - bulkDiscount) * .1) : 0)
  const fee = mode === 'Delivery' && count ? 120 + (checkoutInfo.priority ? 200 : 0) : 0
  const tax = Math.round((subtotal - discount) * .025)
  const total = subtotal - discount + fee + tax
  const go = (next) => { setScreen(next); setMessage('') }
  const add = (p, qty = 1) => setCart((items) => items.some((x) => x.name === p.name) ? items.map((x) => x.name === p.name ? { ...x, qty: x.qty + qty } : x) : [...items, { ...p, qty }])
  const change = (name, delta) => setCart((items) => items.map((x) => x.name === name ? { ...x, qty: Math.max(1, x.qty + delta) } : x))
  const remove = (name) => setCart((items) => items.filter((x) => x.name !== name))
  const favorite = (name) => setFavorites((items) => items.includes(name) ? items.filter((x) => x !== name) : [...items, name])
  const openProduct = (p) => { setProduct(p); setQuantity(1); setSelectedAddons([]); setModal('product') }
  const shown = allProducts.filter((p) => (screen === 'favorites' ? favorites.includes(p.name) : p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort ? a.price - b.price : 0)
  const deliveryLabel = mode === 'Delivery' ? address : 'Main Street Bakery, Texas'
  const placeOrder = () => {
    if (!cart.length || pendingOrder) return
    setPendingOrder({ id: `${nextOrderId.current++}SHA`, items: cart.map((p) => ({ ...p })), subtotal, discount, fee, tax, total, mode, address: deliveryLabel, ...checkoutInfo, tip: 0, rating: 0, comment: '' })
    setMessage('')
    setScreen('placing')
  }
  const confirmOrder = useCallback(() => {
    if (!pendingOrder) return
    setOrder(pendingOrder)
    setPendingOrder(null)
    setStage(0)
    setCart([])
    setAppliedPromo('')
    setPromo('')
    setScreen('tracking')
  }, [pendingOrder])
  const orderId = order?.id
  useEffect(() => {
    if (!orderId || stage !== 0) return
    const timer = setTimeout(() => setStage(1), 6000)
    return () => clearTimeout(timer)
  }, [orderId, stage])
  const advanceOrder = () => setStage((previous) => order?.mode === 'Pickup' && previous === 1 ? 3 : Math.min(3, previous + 1))
  const updateOrder = (changes) => setOrder((previous) => previous ? { ...previous, ...changes } : previous)
  const applyPromo = () => {
    if (['BAKE10', 'WELCOME10'].includes(promo.trim().toUpperCase())) {
      setAppliedPromo(promo.trim().toUpperCase())
      setMessage('10% promo discount applied')
    } else setMessage('Try BAKE10 for 10% off your demo order.')
  }
  const orderTitle = stage === 0 ? 'Preparing your order' : stage === 1 ? order?.mode === 'Delivery' ? 'Rider is on the way' : 'Your order is ready' : stage === 2 ? 'Rider is at your location' : 'Order completed'
  const orderSubtitle = stage === 0 ? 'Takes about 2–3 minutes' : stage === 1 ? order?.mode === 'Delivery' ? `Arriving in ${order.priority ? '15–25' : '30–40'} minutes` : 'Collect your order' : stage === 2 ? 'Collect your order' : 'Thank you for your order!'
  const deliveryHeader = <div className="ma-delivery-row"><img className="ma-rider" src={mode === 'Delivery' ? A.imgCreatingDeliveryBoyIcon2K2026090211211 : A.imgCreatingDeliveryBoyIcon2K2026090211212} alt="" /><div><span>{mode === 'Delivery' ? 'Deliver to' : 'Pickup from'}</span><p>{deliveryLabel}</p></div><Action className="ma-glass" onClick={() => setModal('delivery')}>Change</Action></div>
  const addons = (detail = false) => <section className="ma-addons"><h3>Frequently bought together</h3>{ADDONS.map((p) => <div className="ma-addon" key={p.name}><img src={p.image} alt="" /><span>{p.name}</span><strong>+{money(p.price)}</strong><Action className="ma-round" aria-label={`${detail && selectedAddons.includes(p.name) ? 'Remove' : 'Add'} ${p.name}`} aria-pressed={detail ? selectedAddons.includes(p.name) : undefined} onClick={() => detail ? setSelectedAddons((items) => items.includes(p.name) ? items.filter((n) => n !== p.name) : [...items, p.name]) : add(p)}>{detail && selectedAddons.includes(p.name) ? '✓' : <Glyph src={D.imgPlus} />}</Action></div>)}</section>
  const totals = <div className="ma-totals"><p><span>Subtotal</span><span>{money(subtotal)}</span></p>{discount > 0 && <p><span>Discount</span><span>−{money(discount)}</span></p>}<p><span>{mode === 'Delivery' ? 'Delivery Fee (Standard)' : 'Pickup'}</span><span>{fee ? money(fee) : 'Free'}</span></p><p><span>VAT</span><span>{money(tax)} (2.5%)</span></p></div>
  const bottomNav = <nav className="ma-nav" aria-label="Customer app navigation">{[['home', 'Home', H.imgCroissant1, C.imgStore01], ['cart', 'Cart', C.imgShoppingBasket03, H.imgShoppingBasket03], ['account', 'Me', H.imgHappy01, H.imgHappy01]].map(([id, label, activeIcon, inactiveIcon]) => <Action key={id} className={screen === id || (id === 'home' && screen === 'favorites') ? 'ma-nav-active' : ''} aria-label={label === 'Cart' ? `Cart, ${count} items` : label} aria-current={screen === id ? 'page' : undefined} onClick={() => go(id)}><>{id === 'home' && screen === 'home' ? <span className="ma-roll-window"><span className="ma-roll-icons">{ROLLING_ICONS.map((src, i) => <Glyph key={i} src={src} />)}</span></span> : <Glyph src={screen === id ? activeIcon : inactiveIcon} />}{screen === id && <span>{label}</span>}</>{id === 'cart' && count > 0 && screen !== 'cart' && <i />}</Action>)}</nav>

  return <PhoneFrame interactive label="Interactive bakery customer app"><div className="mobile-app"><div className="ma-ui" inert={modal ? true : undefined}>
    {(screen === 'home' || screen === 'favorites') && <>
      <header className="ma-header"><div className="ma-header-glow"><img src={H.imgBgGlow} alt="" /></div><div className="ma-header-row"><div className="ma-logo">{logo ? <img src={logo} alt="Bakery" /> : <img src={mark || H.imgGroup27} alt="Bakery" />}</div><Action className="ma-address ma-glass" onClick={() => setModal('delivery')}><span><small>{mode === 'Delivery' ? 'Deliver to' : 'Pickup from'}</small><span>{deliveryLabel}</span></span><Glyph src={H.imgArrowDown01} /></Action><Action className="ma-round ma-glass" aria-label="Notifications" onClick={() => setModal('notifications')}><Glyph src={H.imgBell} /></Action></div><div className="ma-search ma-glass"><Glyph src={H.imgSearch01} /><input aria-label="Search menu" placeholder="Search croissant, cakes, fresh items" value={query} onChange={(e) => setQuery(e.target.value)} /><Action aria-label="Sort menu by price" aria-pressed={sort} onClick={() => setSort(!sort)}><Glyph src={H.imgFilterVertical} /></Action></div></header>
      <main className="ma-home-scroll" key={screen}><div className="ma-categories" aria-label="Menu categories">{CATEGORIES.map(([label, icon]) => <Action key={label} className={category === label ? 'ma-category-active' : ''} onClick={() => { setCategory(label); if (screen === 'favorites') go('home') }}><Glyph src={icon} />{label}<sup>{allProducts.filter((p) => p.category === label).length}</sup></Action>)}</div>{screen === 'favorites' && <h2>Favorites</h2>}{shown.map((p) => <article key={p.name} className="ma-product"><ProductImage className="ma-product-glow" item={p} /><button type="button" className="ma-product-open" aria-label={`View ${p.name}`} onClick={() => openProduct(p)}><ProductImage className="ma-product-image" item={p} /><span className="ma-product-text"><strong>{p.name}</strong><span>{money(p.price)} <small>/piece</small></span><span className="ma-product-stats"><Glyph src={H.imgFire} />60kCal <Glyph src={H.imgStar} />4.7 <small>(1.2k+)</small></span></span></button>{p.isNew && <b className="ma-new">NEW</b>}<Action className="ma-add ma-round ma-glass" aria-label={`Add ${p.name} to cart`} onClick={() => add(p)}><Glyph src={H.imgShoppingBasketAdd03} /></Action><Action className={`ma-favorite ${favorites.includes(p.name) ? 'ma-saved' : ''}`} aria-label={`Save ${p.name}`} aria-pressed={favorites.includes(p.name)} onClick={() => favorite(p.name)}><Glyph src={H.imgFavourite} /></Action></article>)}{!shown.length && <p className="ma-no-results">{screen === 'favorites' ? 'Save your favorites with the heart button.' : 'No matching items. Try another search.'}</p>}</main>
      {(count > 0 || order) && <div className="ma-home-banner"><img src={order ? stage >= 2 ? mobileAssets.arrived.imgImage8 : mobileAssets.rider.imgImage8 : mobileAssets['230:4925'].imgImage8} alt="" /><div><strong>{order ? orderTitle : `${count} ${count === 1 ? 'item' : 'items'} in cart`}</strong><span>{order ? orderSubtitle : money(subtotal)}</span></div><Action className="ma-glass" onClick={() => order ? go('tracking') : go('cart')}>{order ? 'View' : 'View Cart'}</Action></div>}
    </>}
    {screen === 'cart' && <>
      <main className={`ma-cart-scroll ${!count ? 'ma-empty-scroll' : ''}`}><header><h2>Cart{count > 0 ? ` (${cart.length})` : ''}</h2>{deliveryHeader}</header>{!count ? <div className="ma-empty"><img src={mobileAssets['230:1237'].imgImage9} alt="" /><h2>Looks empty here</h2><p>You haven’t added anything to your cart</p><Action className="ma-soft-button" onClick={() => go('home')}>Order Now <Glyph src={mobileAssets['230:1237'].imgArrowRight02} /></Action></div> : <><section className="ma-cart-items">{cart.map((p) => <SwipeItem key={p.name} item={p} signedIn={!!account} change={change} remove={remove} />)}<Action className="ma-more ma-card-shadow" onClick={() => go('home')}><Glyph src={C.imgPlus1} />Add more items</Action></section>{addons()}<section>{totals}<form className="ma-promo" onSubmit={(e) => { e.preventDefault(); if (['BAKE10', 'WELCOME10'].includes(promo.trim().toUpperCase())) { setAppliedPromo(promo.trim().toUpperCase()); setMessage('10% promo discount applied') } else setMessage('Try BAKE10 for 10% off your demo order.') }}><input aria-label="Promo code" placeholder="Enter promo code" value={promo} onChange={(e) => setPromo(e.target.value)} /><button type="submit">{appliedPromo ? 'Applied' : 'Apply'}</button></form><div className={`ma-savings ${account || discount ? 'ma-savings-active' : ''}`}><Glyph src={C.imgDiscount} /><span>{discount ? `You’ve saved ${money(discount)} with discounts` : account ? 'Add 3 of an item to get 10% off' : 'You can save 10% with discounts'}</span>{!account && <Action onClick={() => setModal('signup')}>Sign up</Action>}</div></section></>}</main>{count > 0 && <div className="ma-cart-footer ma-card-shadow"><div><span>Total</span><strong>{money(total)}</strong></div><Action className="ma-primary" onClick={() => go('checkout')}>Checkout <Glyph src={C.imgArrowRight02} /></Action></div>}
    </>}
    {screen === 'account' && <main className="ma-account"><h2>{account ? `Hello, ${account}` : 'Welcome to your bakery'}</h2><p>Your favorites, addresses and orders, all in one place.</p>{!account && <Action className="ma-primary" onClick={() => setModal('signup')}>Create demo account</Action>}<Action className="ma-list-button" onClick={() => go('favorites')}>♡ Favorites <span>›</span></Action><Action className="ma-list-button" onClick={() => setModal('delivery')}>Delivery address <span>›</span></Action><Action className="ma-list-button" onClick={() => order ? go('tracking') : setModal('order')}>My orders <span>›</span></Action>{account && <Action className="ma-soft-button" onClick={() => setAccount('')}>Log out</Action>}</main>}
    {screen === 'checkout' && <MobileCheckout cart={cart} account={account} info={checkoutInfo} onInfoChange={setCheckoutInfo} mode={mode} onModeChange={setMode} address={deliveryLabel} onAddress={() => setModal('delivery')} subtotal={subtotal} discount={discount} fee={fee} tax={tax} total={total} promo={promo} onPromoChange={setPromo} appliedPromo={appliedPromo} onApplyPromo={applyPromo} onBack={() => go('cart')} onPlace={placeOrder} onPayment={() => setModal('payment')} onTerms={() => setModal('terms')} />}
    {screen === 'placing' && pendingOrder && <PlacingOrder order={pendingOrder} onConfirm={confirmOrder} onChange={() => { setPendingOrder(null); go('checkout') }} />}
    {screen === 'tracking' && order && <OrderTracking key={order.id} order={order} stage={stage} onNext={advanceOrder} onUpdate={updateOrder} onBack={() => go('home')} onHelp={() => setModal('order-help')} />}
    {['home', 'favorites', 'cart', 'account'].includes(screen) && bottomNav}</div>
    {message && !modal && <div className="ma-toast" role="status">{message}<Action aria-label="Dismiss message" onClick={() => setMessage('')}>×</Action></div>}
    {modal && <Sheet title={modal === 'product' ? product.name : modal === 'delivery' ? 'Delivery options' : modal === 'signup' ? 'Create demo account' : modal === 'order' ? 'My orders' : modal === 'order-help' ? 'Order help' : modal === 'payment' ? 'Payment method' : modal === 'terms' ? 'Demo checkout' : 'Notifications'} onClose={() => setModal(null)} className={modal === 'product' ? 'ma-detail' : ''}>
      {modal === 'product' && <><div className="ma-detail-scroll"><div className="ma-detail-hero"><img src={product.image} alt={product.name} /></div><div className="ma-detail-body"><section><h2>{product.name}</h2><p>Savor our {product.name}, a buttery masterpiece with a flaky exterior and soft interior. Handcrafted with premium ingredients, it’s perfect fresh from the oven, whether paired with rich chocolate spread or creamy butter. Ideal for breakfast or a delightful snack!</p><div className="ma-badges"><span><Glyph src={D.imgFire} />60kCal</span><span><Glyph src={D.imgStar} />4.7 <small>(1.2k+)</small></span></div></section>{addons(true)}<section><h3>Ingredients</h3><p>50g white wheat<br />20ml mineral water<br />10ml cow milk<br />1 whole egg</p></section><section><h3>Allergens</h3><div className="ma-allergens">{[['Gluten', D.imgWheat], ['Eggs', D.imgEggs], ['Milk', D.imgMilkBottle]].map(([label, src]) => <span key={label}><Glyph src={src} />{label}</span>)}</div></section></div></div><footer className="ma-detail-footer"><div><span><strong>{money(product.price)}</strong> <small>/piece</small></span><div className="ma-quantity"><Action disabled={quantity === 1} aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Glyph src={D.imgMinusSign} /></Action><output aria-label="Quantity">{quantity}</output><Action aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Glyph src={D.imgPlus1} /></Action></div></div><Action className="ma-primary" onClick={() => { add(product, quantity); ADDONS.filter((p) => selectedAddons.includes(p.name)).forEach((p) => add(p, quantity)); setModal(null); setMessage('Added to cart') }}>Add to cart</Action></footer></>}
      {modal === 'delivery' && <div className="ma-delivery-sheet"><img className="ma-delivery-hero" src={mode === 'Delivery' ? A.imgCreatingDeliveryBoyIcon2K2026090211211 : A.imgCreatingDeliveryBoyIcon2K2026090211212} alt="" /><h2>{mode === 'Delivery' ? 'Where to deliver?' : 'Select a shop'}</h2><div className="ma-mode">{['Delivery', 'Pickup'].map((name) => <Action key={name} aria-pressed={mode === name} className={mode === name ? 'ma-mode-active' : ''} onClick={() => setMode(name)}><img src={name === 'Delivery' ? A.imgCreatingDeliveryBoyIcon2K2026090211211 : A.imgCreatingDeliveryBoyIcon2K2026090211212} alt="" />{name}</Action>)}</div>{mode === 'Delivery' ? <><Action className="ma-location" onClick={() => { setAddress(addresses[0]); setModal(null); setMessage('Using the demo location: ' + addresses[0]) }}><Glyph src={A.imgLocation01} />Use my current location</Action><div className="ma-addresses">{addresses.map((value, i) => <div key={i}><label><input type="radio" name="delivery-address" checked={address === value} onChange={() => { setAddress(value); setModal(null) }} /><span>{value}</span></label><Action aria-label={`Edit ${value}`} onClick={() => { setEditAddress(i); setAddressDraft(value) }}><Glyph src={A.imgEdit02} /></Action></div>)}</div>{editAddress !== null ? <form className="ma-form" onSubmit={(e) => { e.preventDefault(); const value = addressDraft.trim(); if (!value) return; setAddresses((items) => editAddress === 'new' ? [...items, value] : items.map((x, i) => i === editAddress ? value : x)); setAddress(value); setEditAddress(null); setModal(null) }}><label>Street address<input autoFocus required value={addressDraft} onChange={(e) => setAddressDraft(e.target.value)} /></label><button className="ma-primary">Save address</button></form> : <Action className="ma-soft-button" onClick={() => { setEditAddress('new'); setAddressDraft('') }}><Glyph src={A.imgPlus} />Add new address</Action>}</> : <><p className="ma-shop">Main Street Bakery<br /><small>125 Main Street, Texas · Ready in 20–30 min</small></p><Action className="ma-primary" onClick={() => setModal(null)}>Select this shop</Action></>}</div>}
      {modal === 'signup' && <div className="ma-simple-sheet"><h2>Create demo account</h2><p>Try the signed-in cart and quantity discounts with a sample name.</p><form className="ma-form" onSubmit={(e) => { e.preventDefault(); const name = new FormData(e.currentTarget).get('name').trim(); setAccount(name); setCheckoutInfo((previous) => ({ ...previous, name })); setModal(null) }}><label>Demo name<input name="name" placeholder="Alex" required pattern=".*\S.*" /></label><button className="ma-primary">Create account</button></form></div>}
      {modal === 'order' && <div className="ma-simple-sheet"><h2>My orders</h2><p>You have no orders yet.</p><Action className="ma-soft-button" onClick={() => { setModal(null); go('home') }}>Browse menu</Action></div>}
      {modal === 'payment' && <div className="ma-simple-sheet"><h2>Payment method</h2><p>Cash {mode === 'Delivery' ? 'on delivery' : 'at pickup'} is available for this demo.</p><label className="mo-card mo-speed"><input type="radio" checked readOnly name="payment-method" />Cash</label><p>No payment is collected in the preview.</p><Action className="ma-primary" onClick={() => setModal(null)}>Done</Action></div>}
      {modal === 'terms' && <div className="ma-simple-sheet"><h2>Demo checkout</h2><p>Orders are simulated in this preview. No payment is collected and no delivery is requested.</p><Action className="ma-primary" onClick={() => setModal(null)}>Back to checkout</Action></div>}
      {modal === 'order-help' && <div className="ma-simple-sheet mo-help-content"><h2>Order help</h2><p>Order #{order?.id} · {orderTitle}</p><p>This is a demo delivery. Preview the next status to explore the remaining screens.</p>{stage < 3 && <Action className="ma-primary" onClick={() => { advanceOrder(); setModal(null) }}>{stage === 0 ? 'Preview rider on the way' : stage === 1 && order?.mode === 'Delivery' ? 'Preview rider arrival' : 'Mark order delivered'}</Action>}<Action className="ma-soft-button" onClick={() => setModal(null)}>Back to tracking</Action></div>}
      {modal === 'notifications' && <div className="ma-simple-sheet"><h2>Notifications</h2><p>{order ? 'Your order is confirmed. Follow its progress below.' : 'You’re all caught up. Order updates will appear here.'}</p>{order && <Action className="ma-primary" onClick={() => { setModal(null); go('tracking') }}>View order</Action>}</div>}
    </Sheet>}
  </div></PhoneFrame>
}
