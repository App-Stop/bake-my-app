import { useEffect, useRef } from 'react';
import './delivery-panels.css';
const ASSETS = '/figma/customer-website/';
const money = value => `$${value.toFixed(2)}`;
const image = (file, alt = '', props = {}) => <img src={ASSETS + file} alt={alt} {...props} />;
const EXTRAS = [{
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
}];
export const DELIVERY_STAGES = ['preparing', 'enroute', 'arrived', 'delivered'];
export const PICKUP_STAGES = ['preparing', 'ready', 'complete'];
export const PICKUP_DELAYS = {
  preparing: 8000,
  ready: 10000
};
export const DELIVERY_DELAYS = {
  preparing: 8000,
  enroute: 12000,
  arrived: 10000
};

// The sample sidebar offers 10% off croissants when two of the same item are added.
// Keep the offer on the item so add-ons and other categories retain their usual prices.
export function cartOffer(item) {
  return item.bulkOffer ?? (/croissant/i.test(item.name) ? {
    quantity: 2,
    percent: 10
  } : null);
}

// Use cents throughout so every surface shows the same submitted amount.
export function deliveryTotals(cart, priority, promoApplied, fulfillment = 'delivery') {
  const subtotal = cart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0);
  const quantityDiscount = cart.reduce((sum, item) => {
    const offer = cartOffer(item);
    return sum + (offer && item.qty >= offer.quantity ? Math.round(Math.round(item.price * 100) * item.qty * offer.percent / 100) : 0);
  }, 0);
  const promoDiscount = promoApplied ? Math.round((subtotal - quantityDiscount) * .2) : 0;
  const discount = quantityDiscount + promoDiscount;
  const delivery = fulfillment === 'pickup' ? 0 : cart.length ? priority ? 320 : 120 : 0;
  const vat = Math.round((subtotal - discount) * .025);
  return {
    subtotal: subtotal / 100,
    discount: discount / 100,
    delivery: delivery / 100,
    vat: vat / 100,
    total: (subtotal - discount + delivery + vat) / 100
  };
}
export function DeliverySummary({
  fulfillment = 'delivery',
  cart,
  totals,
  priority,
  promo,
  setPromo,
  applyPromo,
  error,
  ui
}) {
  const {
    asset
  } = ui;
  return <section className="dv-summary">
    {cart && <div className="dv-summary-items">{cart.map(item => <p key={item.name}><span>{item.qty}x {item.name}</span><span>{money(item.price * item.qty)}</span></p>)}</div>}
    <p><span>Subtotal</span><span>{money(totals.subtotal)}</span></p>
    {fulfillment === 'delivery' && <p><span>Delivery Fee ({priority ? 'Priority' : 'Standard'})</span><span>{money(totals.delivery)}</span></p>}
    <p><span>VAT</span><span>{money(totals.vat)} (2.5%)</span></p>
    {totals.discount > 0 && <p><span>Discount</span><span>−{money(totals.discount)}</span></p>}
    <div className="ws-promo-code"><input aria-label="Promo code" placeholder="Enter promo code" value={promo} onChange={event => setPromo(event.target.value)} /><button type="button" onClick={applyPromo}>Apply</button></div>
    {error && <small className="dv-promo-error" role="status">{error}</small>}
    {totals.discount > 0 && <div className="ws-savings">{asset('32187.svg')}You’ve saved {money(totals.discount)} with discounts</div>}
  </section>;
}
export function DeliveryCheckout({
  fulfillment = 'delivery',
  setFulfillment,
  pickupAddress,
  setPickupAddress,
  cart,
  totals,
  address,
  setAddress,
  customer,
  setCustomer,
  instructions,
  setInstructions,
  priority,
  setPriority,
  leave,
  setLeave,
  promo,
  setPromo,
  applyPromo,
  promoError,
  placeOrder,
  ui
}) {
  const {
    asset,
    AppPromo
  } = ui;
  const pickup = fulfillment === 'pickup';
  return <main className={`ws-checkout ${pickup ? 'pu-checkout' : ''}`}><h1>Checkout</h1>
    <form className="ws-two-columns" onSubmit={event => {
      event.preventDefault();
      placeOrder();
    }}>
      <div className="ws-checkout-left">
        <section><h3>Your information</h3>
          <label className="ws-field ws-shadow"><span>Name</span><input required name="name" autoComplete="name" value={customer.name} onChange={event => setCustomer({
              ...customer,
              name: event.target.value
            })} /></label>
          <label className="ws-field ws-shadow"><span>Phone</span><div className="dv-phone"><span aria-hidden="true">🇺🇸</span><input required type="tel" name="phone" autoComplete="tel" value={customer.phone} onChange={event => setCustomer({
                ...customer,
                phone: event.target.value
              })} /></div></label>
        </section>
        <section><div className="ws-section-heading"><h3>{pickup ? 'Pickup options' : 'Delivery options'}</h3><button type="button" onClick={() => setFulfillment(pickup ? 'delivery' : 'pickup')}>{pickup ? 'Deliver Instead' : 'Pickup instead'}</button></div>
          <div className="ws-shadow ws-delivery"><label className={`ws-address-label ${pickup ? 'pu-pickup-location' : ''}`}>{pickup ? image('pickup-store.png') : asset('f4a92.png')}<span><small>{pickup ? 'Pickup from' : 'Deliver to'}</small><input aria-label={pickup ? 'Pickup location' : 'Delivery address'} autoComplete={pickup ? 'off' : 'street-address'} required value={pickup ? pickupAddress : address} onChange={event => pickup ? setPickupAddress(event.target.value) : setAddress(event.target.value)} /></span>{asset('378c3.svg')}</label>
            <label className="ws-field ws-instructions"><span>Instructions (Optional)</span><input name="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} /></label>
          </div>
          {pickup ? <div className="pu-timing">{image('pickup-timing.png')}<span>Pickup timings: Anytime now</span></div> : <>
            <label className="ws-shadow ws-option">{asset('ba908.png')}<span>Leave at the door</span><input type="checkbox" role="switch" checked={leave} onChange={event => setLeave(event.target.checked)} /></label>
            {['Standard', 'Priority'].map(name => <label className="ws-shadow ws-option" key={name}><input type="radio" name="delivery" checked={priority === (name === 'Priority')} onChange={() => setPriority(name === 'Priority')} /><b>{name}{name === 'Priority' && asset('d449c.svg')}</b><small>{name === 'Priority' ? '15-25 min' : '30-40 min'}</small>{name === 'Priority' && <span className="ws-option-end">+$2</span>}</label>)}
          </>}
        </section>
        <section><h3>Payment method</h3><div className="ws-shadow ws-payment">{asset('74b7e.png')}<span><b>Cash</b><small>Pay {money(totals.total)} in cash {pickup ? 'at the counter' : 'to the rider'}</small></span>{pickup && <span className="pu-payment-arrow">{asset('378c3.svg')}</span>}</div></section>
      </div>
      <div className="ws-checkout-right">
        <section className="dv-checkout-summary"><h3>Order summary</h3><DeliverySummary {...{
            fulfillment,
            cart,
            totals,
            priority,
            promo,
            setPromo,
            applyPromo,
            ui
          }} error={promoError} /><small>By placing the order, I agree to all <b>terms &amp; conditions</b></small></section>
        <div className="ws-place-order"><p>Total <strong>{money(totals.total)}</strong></p><button className="ws-button" disabled={!cart.length} type="submit">Place order</button></div>
        <AppPromo />
      </div>
    </form>
  </main>;
}
export function DeliveryCart({
  fulfillment = 'delivery',
  pickupAddress,
  setPickupAddress,
  cart,
  count,
  address,
  setAddress,
  changeQuantity,
  remove,
  add,
  totals,
  priority,
  promo,
  setPromo,
  applyPromo,
  promoError,
  close,
  checkout,
  browse,
  ui
}) {
  const {
    Button,
    asset,
    ProductImage
  } = ui;
  const addressRef = useRef(null);
  return <div className="dv-drawer-backdrop" onClick={event => {
    if (event.target === event.currentTarget) close();
  }}>
    <section className="dv-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="dv-cart-title">
      <div className="dv-cart-scroll">
        <div className="dv-cart-top"><div className="dv-cart-heading"><h2 id="dv-cart-title">Cart ({count})</h2><button autoFocus className="dv-close" aria-label="Close cart" onClick={close}>{image('cart-panel-close.svg')}</button></div>
          <div className="dv-cart-address">{image(fulfillment === 'pickup' ? 'pickup-store.png' : 'cart-delivery.png')}<label><span>{fulfillment === 'pickup' ? 'Pickup from' : 'Deliver to'}</span><input ref={addressRef} aria-label={fulfillment === 'pickup' ? 'Cart pickup location' : 'Cart delivery address'} value={fulfillment === 'pickup' ? pickupAddress : address} onChange={event => fulfillment === 'pickup' ? setPickupAddress(event.target.value) : setAddress(event.target.value)} /></label><button className="dv-small-button" onClick={() => addressRef.current?.focus()}>Change</button></div>
          <div className="dv-cart-items">{cart.map(item => {
              const offer = cartOffer(item);
              const remaining = offer ? Math.max(0, offer.quantity - item.qty) : 0;
              return <article className="dv-cart-item ws-shadow" key={item.name}>
              <div className="dv-cart-item-main"><ProductImage product={item} /><div><h3>{item.name}</h3><div className="dv-item-bottom"><p>{money(item.price)}{item.originalPrice > item.price && <><del>{money(item.originalPrice)}</del><small>{Math.round((1 - item.price / item.originalPrice) * 100)}% OFF</small></>}</p><div className="dv-cart-quantity"><button aria-label={item.qty === 1 ? `Remove ${item.name}` : `Decrease ${item.name} quantity`} onClick={() => item.qty === 1 ? remove(item.name) : changeQuantity(item.name, item.qty - 1)}>{item.qty === 1 ? image('cart-delete.svg') : '−'}</button><output aria-label={`${item.name} quantity`}>{item.qty}</output><button aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(item.name, item.qty + 1)}>{image('cart-plus.svg')}</button></div></div></div></div>
              {offer && <p className="dv-quantity-offer">{remaining > 0 ? <>Add {remaining} more to <span>get {offer.percent}% off</span></> : <span>{offer.percent}% quantity discount applied</span>}</p>}
            </article>;
            })}
            {!cart.length && <p className="dv-empty-cart">Your cart is empty. Add something freshly baked to get started.</p>}
            <button className="dv-add-more ws-shadow" onClick={browse}>{image('cart-add.svg')}Add more items</button>
          </div>
          <section className="dv-cart-extras"><h3>Frequently bought together</h3>{EXTRAS.map(extra => <div key={extra.name}>{asset(extra.file)}<span>{extra.name}</span><b>+{money(extra.price).replace('.00', '')}</b><button aria-label={`Add ${extra.name}`} onClick={() => add({
                ...extra,
                image: ui.extraImage(extra.file)
              })}>{asset('08df2.svg')}</button></div>)}</section>
        </div>
        <div className="dv-cart-summary"><DeliverySummary {...{
            fulfillment,
            totals,
            priority,
            promo,
            setPromo,
            applyPromo,
            ui
          }} error={promoError} /></div>
      </div>
      <div className="dv-cart-footer"><p>Total <strong>{money(totals.total)}</strong></p><Button disabled={!cart.length} onClick={checkout}>Checkout{image('checkout-arrow.svg')}</Button></div>
    </section>
  </div>;
}
function RiderTip({
  amount,
  hidden,
  setAmount,
  setHidden,
  ui
}) {
  const {
    asset
  } = ui;
  if (hidden) return <button className="dv-show-tip ws-shadow" onClick={() => setHidden(false)}>{image('rider-tip.png')}Tip your rider</button>;
  return <section className="dv-rider-tip ws-shadow"><div className="dv-tip-heading"><div>{image('rider-tip.png')}<h3>Would you like to tip the rider?</h3><p>Your tips directly goes to the rider’s account</p></div><button className="dv-small-button" onClick={() => setHidden(true)}>Hide</button></div>
    <div className="dv-tip-options" aria-label="Rider tip">{[1, 2, 5, 10, 15, 20, 25, 30, 50].map(value => <button aria-pressed={amount === value} key={value} onClick={() => setAmount(amount === value ? 0 : value)}>${value}</button>)}</div>
    <div className="dv-tip-payment">{asset('74b7e.png')}<div><b>Cash</b><small>{amount ? `Pay ${money(amount).replace('.00', '')} tip in cash to the rider` : 'No tip selected'}</small></div></div>
  </section>;
}
export function DeliveryTracking({
  order,
  address,
  advance,
  tip,
  tipHidden,
  setTip,
  setTipHidden,
  reopenDelivered,
  ui,
  ...actions
}) {
  const {
    Button,
    Glow,
    OrderLines,
    AppPromo,
    ProductCard
  } = ui;
  const stage = order?.stage || 'preparing';
  const pickup = order?.fulfillment === 'pickup';
  const finished = pickup ? stage === 'complete' : stage === 'delivered';
  return <main className="ws-tracking ws-two-columns"><div className="ws-tracking-left">
    {!order ? <section className="dv-no-order ws-shadow"><h1>No orders yet</h1><p>Place a delivery order to track it here.</p><Button onClick={() => actions.browse()}>Browse menu</Button></section> : stage === 'preparing' ? <button type="button" className="ws-preparing ws-shadow dv-stage-button" onClick={advance} aria-label={pickup ? 'Preparing your order. Advance demo to ready for pickup' : 'Preparing your order. Advance demo to delivery route'}><Glow tracking />{image('edec3.png', '', {
          className: 'ws-bag'
        })}<h1 aria-live="polite">Preparing your order</h1><p>Takes about 2-3 minutes</p></button> : finished ? <button className="ws-preparing ws-shadow dv-stage-button" onClick={reopenDelivered} aria-label={pickup ? 'Order complete. View pickup feedback' : 'Delivered. View delivery and feedback'}><Glow tracking />{image('delivered-check.png', '', {
          className: 'dv-delivered-check'
        })}<h1>{pickup ? 'Order complete' : 'Delivered'}</h1><p>Enjoy your freshly baked meal</p></button> : <button className={`dv-delivery-map ws-shadow dv-stage-button ${stage === 'arrived' || pickup ? 'dv-arrived' : ''}`} onClick={advance} aria-label={pickup ? 'Your order is ready. Confirm pickup in demo' : stage === 'arrived' ? 'Rider is at your address. Confirm delivery in demo' : 'Rider is on the way. Advance demo to rider at your address'}>
      {image('delivery-map.png', pickup ? 'Pickup location map' : 'Delivery map', {
          className: 'dv-map-image'
        })}<span className="dv-map-shade" />
      {stage === 'enroute' ? <span className="dv-map-route">{image('delivery-route.svg')}</span> : <><span className="dv-home-marker">{image('delivery-home.svg')}</span><span className="dv-scooter-marker">{image('rider-scooter.svg')}</span><span className="dv-arrival-card"><span><strong aria-live="polite">{pickup ? 'Your order is ready!' : 'Rider is at your address'}</strong><small>{pickup ? 'Pickup from the shop' : 'Collect your order from the rider'}</small></span>{image('rider-arrived.png')}</span></>}
    </button>}
    {order && <div className="ws-tracking-info"><section className="ws-shadow"><h3>{pickup ? 'Pickup from' : 'Delivery address'}</h3><p>{pickup ? order.pickupAddress : order.address || address}</p></section>
      {!pickup && (stage === 'enroute' || stage === 'arrived') && <RiderTip amount={tip} hidden={tipHidden} setAmount={setTip} setHidden={setTipHidden} ui={ui} />}
      <section className="ws-shadow"><h3>Your order</h3><OrderLines cart={order.cart} subtotal={order.subtotal} total={order.total} payment={order.payment} compact /></section>
    </div>}
  </div><div className="ws-tracking-right"><section className="ws-support ws-shadow"><div><h3>Need support?</h3><p>Report or see general solutions to your problem.</p></div><Button secondary onClick={() => actions.go('support')}>Help Center</Button></section><section><h2>You may also love</h2><div className="ws-recommendations">{ui.recommendations.map(product => <ProductCard key={product.name} product={product} compact {...actions} />)}</div></section><AppPromo /></div></main>;
}
export function DeliveredDialog({
  order,
  rating,
  setRating,
  comment,
  setComment,
  backHome,
  ui
}) {
  const {
    Button,
    OrderLines
  } = ui;
  const pickup = order.fulfillment === 'pickup';
  return <div className="ws-modal-backdrop dv-delivered-backdrop"><section className={`dv-delivered ${pickup ? 'pu-complete' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dv-delivered-title">
    <header className="dv-delivered-header"><div className="dv-delivered-glow">{image('delivered-glow.svg')}</div>{image('delivered-check.png', '', {
          className: 'dv-delivered-check'
        })}<h2 id="dv-delivered-title">{pickup ? 'Order complete' : 'Delivered'}</h2><p>Enjoy your freshly baked meal</p></header>
    <div className="dv-delivered-body">{pickup ? <section className="pu-points-claim"><div><h3>You got <span>{image('pickup-points.svg')}</span>+50 Cozy Points!</h3><p>Scan the QR code to download the app and claim the cozy points!</p></div>{image('delivered-qr.png', 'Scan to download the app and claim Cozy Points', {
            className: 'dv-delivered-qr'
          })}</section> : <><div className="dv-points"><span>{image('points-purple.svg')}</span><b>+50</b>Cozy Points</div>
      <section className="dv-app-points ws-shadow"><div><h3>Get <span className="dv-extra-points"><i>{image('points-white.svg')}</i>+30</span> more on our app</h3><p>Scan and download now!</p></div>{image('delivered-qr.png', 'Scan to download the app', {
              className: 'dv-delivered-qr'
            })}</section></>}
      <section className="dv-review ws-shadow"><h3>How was your experience?</h3><div className="dv-rating" role="group" aria-label="Rate your experience">{[1, 2, 3, 4, 5].map(value => <button key={value} aria-label={`Rate ${value} ${value === 1 ? 'star' : 'stars'}`} aria-pressed={rating === value} onClick={() => setRating(value)}>{image(value <= rating ? 'rating-filled.svg' : 'rating-empty.svg')}</button>)}</div><label className="ws-field ws-instructions"><span>Add a comment (Optional)</span><textarea aria-label={pickup ? 'Pickup experience comment' : 'Delivery experience comment'} value={comment} onChange={event => setComment(event.target.value)} rows={1} /></label></section>
      <section className="dv-delivered-order ws-shadow"><h3>Your order</h3><OrderLines cart={order.cart} subtotal={order.subtotal} total={order.total} payment={order.payment} compact /></section>
      <Button secondary onClick={backHome} autoFocus>Back to home</Button>
    </div>
  </section></div>;
}

/** Keep keyboard focus in the active delivery dialog and restore its opener. */
export function useDeliveryDialogFocus(type, ref, dismiss) {
  const dismissRef = useRef(dismiss);
  dismissRef.current = dismiss;
  useEffect(() => {
    if (!type) return;
    const active = document.activeElement;
    const modal = ref.current;
    const getControls = () => Array.from(modal?.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]') || []);
    getControls()[0]?.focus();
    const onKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismissRef.current();
      }
      if (event.key !== 'Tab') return;
      const controls = getControls();
      const first = controls[0],
        last = controls[controls.length - 1];
      if (!first) return;
      if (event.shiftKey && (document.activeElement === first || !modal?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modal?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (active?.isConnected) active.focus();
    };
  }, [type, ref]);
}
