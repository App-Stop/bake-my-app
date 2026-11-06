import { BrandImage } from './BrandImage'
import { useEffect, useRef, useState } from 'react';
import { DesktopScreen, DESKTOP_WIDTH } from '../../preview/DesktopScreen';
import { CROISSANTS, CAKES, WEBSITE_PRODUCTS } from './storefrontCatalog';
import { brandIllustrationProps } from './brandIllustrations';
import { DemoLogo } from './DemoLogo';
import chocolateSyrup from '../../assets/addons/chocolate-syrup.webp';
import caramelSauce from '../../assets/addons/caramel-sauce.webp';
import whippedCream from '../../assets/addons/whipped-cream.webp';
import qr from '../../assets/desktop/qr.webp';
import film from '../../assets/desktop/brand-film.webp';
import play from '../../assets/desktop/store-play.svg';
import playWordmark from '../../assets/desktop/store-play-wordmark.svg';
import apple from '../../assets/desktop/store-apple.svg';
import './website-storefront.css';
import { LocationDialog } from './WebsiteLocationDialogs';
import { DeliveryCheckout, DeliveryTracking, DeliveryCart, DeliveredDialog, DELIVERY_STAGES, DELIVERY_DELAYS, PICKUP_STAGES, PICKUP_DELAYS, deliveryTotals, useDeliveryDialogFocus } from './DeliveryPanels';
const A = '/figma/customer-website/';
const SCALE = DESKTOP_WIDTH / 1920;
const money = value => `$${value.toFixed(2)}`;
const signature = {
  ...CROISSANTS[0],
  name: 'Signature Croissant',
  price: 17.59,
  kcal: 60,
  rating: 4.7,
  reviews: '1.2k+'
};
const existingAssets = {
  'b64da.png': chocolateSyrup,
  '1848d.png': caramelSauce,
  '3e048.png': whippedCream,
  '6965d.png': qr,
  '1bd10.png': film
};
const asset = (name, alt = '', props = {}) => <BrandImage src={existingAssets[name] || A + name} alt={alt} {...brandIllustrationProps(name, props)} />;
function Button({
  children,
  secondary,
  className = '',
  ...props
}) {
  return <button type="button" className={`ws-button ${secondary ? 'ws-secondary' : ''} ${className}`} {...props}>{children}</button>;
}
function ProductImage({
  product,
  className = ''
}) {
  const crop = product.crop;
  return <div className={`ws-product-image ${className}`} style={{
    transform: product.flip ? 'scaleX(-1)' : undefined
  }}><BrandImage src={product.image} alt={product.name} style={crop ? {
      width: crop.width ?? crop.size,
      height: crop.height ?? crop.size,
      left: crop.left,
      top: crop.top
    } : undefined} /></div>;
}
function Header({
  logo,
  go,
  browse,
  query,
  setQuery,
  locationLabel
}) {
  return <header className="ws-header">
    <div className="ws-header-left"><button onClick={() => go('home')} aria-label="Store home">{logo ? <BrandImage className="ws-logo" src={logo} alt="Bakery" /> : <DemoLogo className="ws-logo" />}</button><div className="ws-location"><button onClick={() => go('address')}>{asset('d72bf.svg')}<span><small>{locationLabel.small}</small><b>{locationLabel.text}</b></span></button><button onClick={() => go('tracking')}>{asset('8d074.svg')}<b>Track your order</b></button></div></div>
    <form className="ws-search" onSubmit={event => {
      event.preventDefault();
      browse();
    }}>{asset('cca3c.svg')}<input aria-label="Search menu" placeholder="Search croissant, cakes, fresh items" value={query} onChange={event => setQuery(event.target.value)} /><button aria-label="Browse menu" type="submit">{asset('c00b1.svg')}</button></form>
    <div className="ws-header-right"><span className="ws-language">{asset('6b514.svg')}En{asset('5e68d.svg')}</span><Button className="ws-login" onClick={() => go('login')}>Log in</Button><Button className="ws-signup" onClick={() => go('signup')}>Sign up for free delivery</Button></div>
  </header>;
}
const columns = {
  About: ['Our story', 'Bakery', 'Careers'],
  Menu: ['Croissants', 'Cakes', 'Coffee'],
  Locations: ['Find a bakery', 'Delivery zones', 'Pickup'],
  Contact: ['Support', 'Press', 'Partners']
};
function Footer({
  logo,
  browse,
  go,
  notify
}) {
  return <footer className="ws-footer"><div className="ws-footer-top"><div className="ws-footer-brand">{logo ? <BrandImage className="ws-logo" src={logo} alt="Bakery" /> : <DemoLogo className="ws-logo" tint="bg-white" />}<p>Freshly baked, delivered to your door. From classic butter to seasonal specials — every bite is made with care.</p><div className="ws-social">{['80d03.svg', 'b0d7a.svg', '48f8a.svg'].map((src, i) => <span key={src} aria-label={['Instagram', 'Facebook', 'Twitter'][i]}>{asset(src)}</span>)}</div></div><div className="ws-footer-links">{Object.entries(columns).map(([title, links]) => <div key={title}><b>{title}</b>{links.map(link => <button key={link} onClick={() => title === 'Menu' ? browse(link) : go(title === 'Locations' ? 'address' : 'support')}>{link}</button>)}</div>)}</div><div className="ws-newsletter"><b>Newsletter</b><p>Get new drops, seasonal specials, and early access to limited batches.</p><form onSubmit={event => {
          event.preventDefault();
          notify('Thanks for subscribing to our demo newsletter.');
        }}><label>{asset('a4efb.svg')}<input type="email" required placeholder="Email address" aria-label="Newsletter email address" /></label><Button className="ws-subscribe" onClick={event => event.currentTarget.form.requestSubmit()}>Subscribe</Button></form><small>By subscribing, you agree to our Terms and Privacy Policy.</small></div></div><div className="ws-footer-bottom"><span>© 2026 Bake My App. All rights reserved.</span><div>{['Privacy', 'Terms', 'Cookies'].map(label => <button key={label} onClick={() => go('support')}>{label}</button>)}</div></div></footer>;
}
function AppPromo({
  wide = false
}) {
  if (wide) return <aside className="ws-wide-promo"><div><h2>Get exclusive discounts &amp; rewards on our app.</h2><p>Save more with every order — download now and enjoy free delivery on your first 3 orders.</p><div className="ws-store-badges"><span><BrandImage src={play} alt="" /><div><small>GET IT ON</small><BrandImage className="ws-play-wordmark" src={playWordmark} alt="Google Play" /></div></span><span><BrandImage src={apple} alt="" /><div><small>Download on the</small><strong>App Store</strong></div></span></div><div className="ws-wide-qr"><small>Or scan to download</small><div>{asset('6965d.png', 'Scan to download the app')}</div></div></div><div className="ws-phone-hand">{asset('app-phone-hand.png')}</div></aside>;
  return <aside className="ws-app-promo"><h3>Get 20% OFF on the app</h3><p>Save more with every order — download now and enjoy free delivery on your first 3 orders.</p><div className="ws-qr"><div>{asset('6965d.png', 'Scan to download the app')}</div><span>SCAN TO DOWNLOAD!</span></div><div className="ws-phone-hand">{asset('checkout-phone-hand.png')}</div></aside>;
}
function ProductCard({
  product,
  compact,
  add,
  openProduct,
  favorites,
  toggleFavorite
}) {
  return <article className={`ws-card ${compact ? 'ws-compact' : ''}`}><div className="ws-card-glow"><ProductImage product={{
        ...product,
        image: product.glow || product.image
      }} /></div><button aria-label={`View ${product.name}`} onClick={() => openProduct(product)}><ProductImage product={product} /></button><div className="ws-card-bottom"><div><button className="ws-product-title" onClick={() => openProduct(product)}>{product.name}</button><p>{money(product.price)} <span>/{product.unit || 'piece'}</span></p>{!compact && <div className="ws-card-stats">{asset('f3b69.svg')}{product.kcal}kCal {asset('b9e64.svg')}{product.rating}<span>({product.reviews})</span></div>}</div><Button secondary onClick={() => add(product)}>{asset('b1c88.svg')}Add to cart</Button></div>{product.isNew && <span className="ws-new">NEW</span>}<button className="ws-heart" aria-label={`Save ${product.name}`} aria-pressed={favorites.includes(product.name)} onClick={() => toggleFavorite(product)}>{asset(favorites.includes(product.name) ? '6ff4e.svg' : '8ff2b.svg')}</button></article>;
}
function ProductSection({
  title,
  products,
  ...actions
}) {
  return <section className="ws-product-section"><h2>{title}</h2><div className="ws-product-grid">{products.map(product => <ProductCard key={product.name} product={product} {...actions} />)}</div></section>;
}
function Quantity({
  value,
  onChange
}) {
  return <div className="ws-quantity"><button aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))}>{asset('c0dfc.svg')}</button><output aria-label="Quantity">{value}</output><button aria-label="Increase quantity" onClick={() => onChange(value + 1)}>{asset('1474a.svg')}</button></div>;
}
function ProductDetail({
  product,
  quantity,
  setQuantity,
  extras,
  setExtras,
  ...actions
}) {
  return <><section className="ws-detail"><ProductImage className="ws-detail-image" product={product} /><div className="ws-detail-info"><div><h1>{product.name}</h1><p className="ws-description">Savor our {product.name}, a buttery masterpiece with a flaky exterior and soft interior. Handcrafted with premium ingredients, it’s perfect fresh from the oven, whether paired with rich chocolate spread or creamy butter. Ideal for breakfast or a delightful snack!</p></div><div className="ws-badges"><span>{asset('bff8b.svg')}{product.kcal}kCal</span><span>{asset('a2d88.svg')}{product.rating} <em>({product.reviews})</em></span></div><div className="ws-buy"><div><p>{money(product.price)} <span>/{product.unit || 'piece'}</span></p><Quantity value={quantity} onChange={setQuantity} /></div><div><Button onClick={() => {
              actions.add(product, quantity);
              extras.forEach(extra => actions.add(extra, quantity));
            }}>Add to cart</Button><button className="ws-detail-heart" aria-label="Save product" aria-pressed={actions.favorites.includes(product.name)} onClick={() => actions.toggleFavorite(product)}>{asset('29c53.svg')}</button></div></div><div><h3>Frequently bought together</h3><div className="ws-extras">{[{
              name: 'Chocolate Syrup',
              price: 3,
              file: 'b64da.png'
            }, {
              name: 'Caramel Sauce',
              price: 2.5,
              file: '1848d.png'
            }, {
              name: 'Whipped Cream',
              price: 1.5,
              file: '3e048.png'
            }].map(extra => <div className="ws-extra" key={extra.name}>{asset(extra.file)}<p>{extra.name}</p><b>+{money(extra.price).replace('.00', '')}</b><button aria-label={`Add ${extra.name}`} aria-pressed={extras.some(item => item.name === extra.name)} onClick={() => setExtras(items => items.some(item => item.name === extra.name) ? items.filter(item => item.name !== extra.name) : [...items, {
                ...extra,
                image: existingAssets[extra.file] || A + extra.file
              }])}>{extras.some(item => item.name === extra.name) ? '✓' : asset('08df2.svg')}</button></div>)}</div></div><div className="ws-ingredients"><h3>Ingredients</h3>{['50g white wheat', '20ml mineral water', '10ml cow milk', '1 whole egg'].map(text => <p key={text}>{text}</p>)}</div><div><h3>Allergens</h3><div className="ws-allergens">{[['f990a.svg', 'Glutten'], ['e92c1.svg', 'Eggs'], ['6e1d2.svg', 'Milk']].map(([src, label]) => <div key={label}>{asset(src)}<span>{label}</span></div>)}</div></div></div></section><ProductSection title="More like this" products={CROISSANTS} {...actions} /><AppPromo wide /><ProductSection title="You may also want to try" products={CAKES.slice(0, 6)} {...actions} /><section className="ws-film">{asset('1bd10.png')}<div><h2>Baked with precision, care and love for you</h2><Button onClick={() => actions.browse()}>Order Now</Button><i>Free Delivery*</i></div></section></>;
}
function OrderLines({
  cart,
  subtotal,
  total,
  payment,
  compact = false
}) {
  return <div className="ws-order-lines">{cart.map(item => <p key={item.name}><span>{item.qty}x {item.name}</span><span>{money(item.price * item.qty)}</span></p>)}<hr /><p><span>{compact ? 'Total' : 'Subtotal'}</span><span>{compact ? `${money(total)}${payment ? ` (${payment})` : ''}` : money(subtotal)}</span></p></div>;
}
function Glow({
  tracking
}) {
  return <div className="ws-glows" aria-hidden="true"><div className="ws-glow-one">{asset(tracking ? '6252b.svg' : '6a563.svg')}</div><div className="ws-glow-two">{asset(tracking ? '70bc1.svg' : 'a4fb5.svg')}</div></div>;
}
function PlacingOrder({
  fulfillment = 'delivery',
  cart,
  address,
  payment,
  subtotal,
  total,
  seconds,
  cancel
}) {
  return <div className="ws-modal-backdrop"><section className="ws-placing" role="dialog" aria-modal="true" aria-labelledby="ws-placing-title"><div className="ws-placing-header"><Glow /><div className="ws-placing-title">{asset('13cd8.png', '', {
            className: 'ws-receipt'
          })}<h2 id="ws-placing-title">Placing order...</h2><p>Make sure everything looks right</p></div><div className="ws-progress"><div /></div></div><div className="ws-placing-info"><section className="ws-shadow"><h3>{fulfillment === 'pickup' ? 'Pickup from' : 'Delivery address'}</h3><p>{address}</p></section><section className="ws-shadow"><h3>Payment method</h3><p>{payment}</p></section><section className="ws-shadow"><h3>Your order</h3><OrderLines cart={cart} subtotal={subtotal} total={total} compact /></section></div><div className="ws-placing-footer"><Button secondary onClick={cancel} autoFocus>I would like to change ({seconds})</Button></div></section></div>;
}
/** Desktop-only demo session. The mobile demo keeps its existing implementation. */
export function WebsiteStorefront({
  summary,
  logo,
  height
}) {
  const [screen, setScreen] = useState('home');
  const [product, setProduct] = useState(signature);
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Croissants');
  const [address, setAddress] = useState('742 Evergreen Terrace, Texas');
  const [addresses, setAddresses] = useState(['742 Evergreen Terrace, Texas', '125 Main Street, Texas', '28 Oak Avenue, Texas']);
  const [addressChosen, setAddressChosen] = useState(false);
  const [locationDialog, setLocationDialog] = useState(null);
  const [fulfillment, setFulfillment] = useState('delivery');
  const [pickupAddress, setPickupAddress] = useState('742 Bake Cafe, Texas');
  const [pickupInstructions, setPickupInstructions] = useState('Please give paper bag');
  const [customer, setCustomer] = useState({
    name: 'John Doe',
    phone: '+1 213 1231232'
  });
  const [instructions, setInstructions] = useState('Please ring the bell twice');
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveredOpen, setDeliveredOpen] = useState(false);
  const [riderTip, setRiderTip] = useState(10);
  const [tipHidden, setTipHidden] = useState(false);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('Really loved the croissant!');
  const [priority, setPriority] = useState(false);
  const [leave, setLeave] = useState(false);
  const payment = 'Cash';
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const [order, setOrder] = useState(null);
  const [notice, setNotice] = useState('');
  const scroll = useRef(null);
  const placingRef = useRef(null);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const totals = deliveryTotals(cart, priority, promoApplied, fulfillment);
  const {
    subtotal,
    total
  } = totals;
  function go(next) {
    if (next === 'cart') {
      setCartOpen(true);
      setNotice('');
      return;
    }
    // The navbar's "Deliver to" and "Track your order" open dialogs over the current page.
    if (next === 'address' || next === 'orders') {
      setCartOpen(false);
      setNotice('');
      setLocationDialog(next === 'orders' ? 'track' : fulfillment === 'pickup' ? 'pickup' : 'delivery');
      return;
    }
    setCartOpen(false);
    setScreen(next === 'orders' ? 'tracking' : next);
    setNotice('');
    scroll.current?.scrollTo({
      top: 0
    });
  }
  function changeQuantity(name, qty) {
    setCart(items => items.map(item => item.name === name ? {
      ...item,
      qty
    } : item).filter(item => item.qty > 0));
  }
  function applyPromo() {
    if (promo.trim().toUpperCase() === 'BAKE20') {
      setPromoApplied(true);
      setPromoError('');
    } else setPromoError('This code is not valid. Try BAKE20.');
  }
  function advanceDelivery() {
    if (!order) return;
    const stages = order.fulfillment === 'pickup' ? PICKUP_STAGES : DELIVERY_STAGES;
    const next = stages[stages.indexOf(order.stage) + 1];
    if (!next) return;
    setOrder({
      ...order,
      stage: next
    });
    if (next === 'delivered' || next === 'complete') setDeliveredOpen(true);
  }
  function saveFeedback() {
    setOrder(current => current ? {
      ...current,
      feedback: {
        rating,
        comment
      },
      ...(current.fulfillment === 'pickup' ? {} : {
        riderTip
      })
    } : current);
    setDeliveredOpen(false);
  }
  const dialog = placing ? 'placing' : deliveredOpen ? 'delivered' : cartOpen ? 'cart' : locationDialog ? 'location' : null;
  useDeliveryDialogFocus(dialog, placingRef, () => {
    if (placing) setPlacing(false);else if (deliveredOpen) saveFeedback();else if (cartOpen) setCartOpen(false);else setLocationDialog(null);
  });
  function browse(next = 'Croissants') {
    setCategory(next);
    go('menu');
  }
  function openProduct(item) {
    setProduct(item.name === CROISSANTS[0].name ? signature : item);
    setQuantity(1);
    setExtras([]);
    go('product');
  }
  function add(item, qty = 1) {
    setCart(items => items.some(entry => entry.name === item.name) ? items.map(entry => entry.name === item.name ? {
      ...entry,
      qty: entry.qty + qty
    } : entry) : [...items, {
      ...item,
      qty
    }]);
    setNotice(`${item.name} added to cart`);
  }
  function toggleFavorite(item) {
    setFavorites(items => items.includes(item.name) ? items.filter(name => name !== item.name) : [...items, item.name]);
  }
  const actions = {
    add,
    openProduct,
    toggleFavorite,
    favorites,
    count,
    address,
    locationLabel: fulfillment === 'pickup' ? {
      small: 'Pickup from',
      text: pickupAddress
    } : {
      small: 'Deliver to',
      text: addressChosen ? address : 'Select your address'
    },
    browse,
    go,
    query,
    setQuery: value => {
      setQuery(value);
      go('menu');
    }
  };
  useEffect(() => {
    if (!placing) return;
    const timer = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [placing]);
  useEffect(() => {
    if (!placing || seconds > 0) return;
    setOrder({
      cart: cart.map(item => ({
        ...item
      })),
      id: `DEMO-${Date.now()}`,
      stage: 'preparing',
      subtotal,
      total,
      address: fulfillment === 'pickup' ? pickupAddress : address,
      fulfillment,
      pickupAddress,
      payment,
      customer: {
        ...customer
      },
      instructions: fulfillment === 'pickup' ? pickupInstructions : instructions,
      leaveAtDoor: fulfillment === 'delivery' && leave,
      priority: fulfillment === 'delivery' && priority,
      totals: {
        ...totals
      }
    });
    setCart([]);
    setPlacing(false);
    setScreen('tracking');
    setPromoApplied(false);
    setPromoError('');
    setRiderTip(10);
    setTipHidden(false);
    setRating(4);
    setComment('Really loved the croissant!');
    setPromo('');
    setNotice('');
    scroll.current?.scrollTo({
      top: 0
    });
  }, [placing, seconds, cart, subtotal, total, address, payment, customer, instructions, leave, priority, fulfillment, pickupAddress, pickupInstructions]);
  useEffect(() => {
    if (!order || screen !== 'tracking' || placing || cartOpen) return;
    const stages = order.fulfillment === 'pickup' ? PICKUP_STAGES : DELIVERY_STAGES;
    const delays = order.fulfillment === 'pickup' ? PICKUP_DELAYS : DELIVERY_DELAYS;
    if (!delays[order.stage]) return;
    const {
      id,
      stage
    } = order;
    const next = stages[stages.indexOf(stage) + 1];
    const timer = setTimeout(() => {
      setOrder(current => current?.id === id && current.stage === stage ? {
        ...current,
        stage: next
      } : current);
      if (next === 'delivered' || next === 'complete') setDeliveredOpen(true);
    }, delays[stage]);
    return () => clearTimeout(timer);
  }, [order?.id, order?.stage, order?.fulfillment, screen, placing, cartOpen]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  const footerActions = {
    logo,
    go,
    browse,
    notify: setNotice
  };
  const deliveryUI = {
    Button,
    asset,
    ProductImage,
    OrderLines,
    AppPromo,
    Glow,
    ProductCard,
    extraImage: file => existingAssets[file] || A + file,
    recommendations: [CROISSANTS[0], CROISSANTS[1], CROISSANTS[2], CROISSANTS[7]]
  };
  return <div className="ws-viewport" style={{
    width: DESKTOP_WIDTH,
    height
  }}>
    <div ref={scroll} className="ws-scroll" inert={!!dialog || undefined}>
      {screen === 'home' ? <DesktopScreen summary={summary} logo={logo} height={height} framed={false} actions={actions} /> : <div className="ws-site" style={{
        zoom: SCALE
      }}><Header {...actions} logo={logo} /><nav className="ws-breadcrumb" aria-label="Breadcrumb"><button onClick={() => go('home')}>Home</button>{asset('08aa1.svg')}{screen === 'product' ? <><button onClick={() => browse()}>Croissant</button>{asset('08aa1.svg')}<span>{product.name}</span></> : <span>{screen === 'tracking' ? `Tracking　 ›　 Order#${order?.id?.replace('DEMO-', '') || '—'}` : screen[0].toUpperCase() + screen.slice(1)}</span>}</nav>
        {screen === 'product' && <ProductDetail product={product} quantity={quantity} setQuantity={setQuantity} extras={extras} setExtras={setExtras} {...actions} />}
        {screen === 'checkout' && <DeliveryCheckout {...{
          fulfillment,
          setFulfillment,
          pickupAddress,
          setPickupAddress,
          cart,
          totals,
          address,
          setAddress,
          customer,
          setCustomer,
          priority,
          setPriority,
          leave,
          setLeave,
          promo,
          setPromo,
          applyPromo,
          promoError
        }} instructions={fulfillment === 'pickup' ? pickupInstructions : instructions} setInstructions={fulfillment === 'pickup' ? setPickupInstructions : setInstructions} ui={deliveryUI} placeOrder={() => {
          if (cart.length && (fulfillment === 'pickup' ? pickupAddress.trim() : address.trim()) && customer.name.trim() && customer.phone.trim()) {
            setSeconds(5);
            setPlacing(true);
          }
        }} />}
        {screen === 'tracking' && <DeliveryTracking order={order} address={address} {...actions} ui={deliveryUI} advance={advanceDelivery} tip={riderTip} setTip={value => {
          setRiderTip(value);
          setOrder(current => current ? {
            ...current,
            riderTip: value
          } : current);
        }} tipHidden={tipHidden} setTipHidden={setTipHidden} reopenDelivered={() => setDeliveredOpen(true)} />}
        {(screen === 'menu' || screen === 'favorites') && <main className="ws-menu"><h1>{screen === 'favorites' ? 'Your favorites' : 'Our menu'}</h1>{screen === 'menu' && <div className="ws-categories">{['Croissants', 'Cakes', 'Coffee', 'Bread', 'Cupcakes', 'Cookies', 'Donuts'].map(name => <Button secondary={category !== name} key={name} onClick={() => setCategory(name)}>{name}</Button>)}</div>}<div className="ws-product-grid">{WEBSITE_PRODUCTS.filter(item => screen === 'favorites' ? favorites.includes(item.name) : item.category === category && item.name.toLowerCase().includes(query.toLowerCase())).map(item => <ProductCard key={item.name} product={item} {...actions} />)}</div>{!WEBSITE_PRODUCTS.some(item => screen === 'favorites' ? favorites.includes(item.name) : item.category === category && item.name.toLowerCase().includes(query.toLowerCase())) && <p>No items found.</p>}</main>}
        {(screen === 'login' || screen === 'signup') && <main className="ws-simple"><h1>{screen === 'login' ? 'Log in' : 'Sign up for free delivery'}</h1><form onSubmit={event => {
            event.preventDefault();
            go('home');
            setNotice('You’re signed in to the demo');
          }}>{screen === 'signup' && <label className="ws-field ws-shadow">Name<input required autoComplete="name" /></label>}<label className="ws-field ws-shadow">Email<input required type="email" autoComplete="email" /></label><label className="ws-field ws-shadow">Password<input required minLength={6} type="password" autoComplete={screen === 'signup' ? 'new-password' : 'current-password'} /></label><button className="ws-button">{screen === 'login' ? 'Log in' : 'Create demo account'}</button></form></main>}
        {screen === 'support' && <main className="ws-simple"><h1>How can we help?</h1><p>This is a local website demo. No payment is collected.</p><Button onClick={() => go('tracking')}>View your order</Button><Button secondary onClick={() => browse()}>Browse menu</Button></main>}
        {screen === 'tracking' && <button className="ws-chat" aria-label="Contact support" onClick={() => go('support')}>{asset('f1fa3.svg')}<span>1</span></button>}<Footer {...footerActions} />
      </div>}
    </div>
    {screen !== 'home' && !['checkout', 'tracking'].includes(screen) && <button className="ws-cart-tab" onClick={() => go('cart')}>{asset('cart-basket.svg')}Cart ({count})</button>}
    {notice && !dialog && <div className="ws-notice" role="status"><span>{notice}</span><button onClick={() => go('cart')}>View cart</button><button aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}
    {dialog && <div ref={placingRef} className="ws-modal-scale" style={{
      height: height / SCALE,
      transform: `scale(${SCALE})`
    }}>
      {locationDialog && !placing && !deliveredOpen && !cartOpen ? <LocationDialog type={locationDialog} setType={setLocationDialog} close={() => setLocationDialog(null)} addresses={addresses} setAddresses={setAddresses} address={address} chooseAddress={(value, message) => {
        setAddress(value);
        setAddressChosen(true);
        setFulfillment('delivery');
        setLocationDialog(null);
        setNotice(message || `Delivering to ${value}`);
      }} pickupAddress={pickupAddress} saveShop={shop => {
        setPickupAddress(shop);
        setFulfillment('pickup');
        setLocationDialog(null);
        setNotice(`Pickup from ${shop}`);
      }} order={order} onTrack={() => {
        setLocationDialog(null);
        go('tracking');
      }} /> : placing ? <PlacingOrder {...{
        fulfillment,
        cart,
        address,
        payment,
        subtotal,
        total,
        seconds
      }} address={fulfillment === 'pickup' ? pickupAddress : address} cancel={() => setPlacing(false)} /> : deliveredOpen ? <DeliveredDialog order={order} {...{
        rating,
        setRating,
        comment,
        setComment
      }} ui={deliveryUI} backHome={() => {
        saveFeedback();
        go('home');
      }} /> : <DeliveryCart {...{
        fulfillment,
        pickupAddress,
        setPickupAddress,
        cart,
        count,
        address,
        setAddress,
        changeQuantity,
        add,
        totals,
        priority,
        promo,
        setPromo,
        applyPromo,
        promoError
      }} ui={deliveryUI} remove={name => setCart(items => items.filter(item => item.name !== name))} close={() => setCartOpen(false)} checkout={() => go('checkout')} browse={() => browse(category)} />}
    </div>}
  </div>;
}
