import { BrandImage } from './BrandImage'
import { useEffect, useRef, useState } from 'react'
import { Action, Glyph } from './MobileUI'
import { checkoutAssets } from './mobileCheckoutAssets'
import './mobile-order-screens.css'
import './mobile-order-motion.css'

const CHECKOUT = checkoutAssets['230:2111']
const PLACING = checkoutAssets['230:2213']
const PREPARING = checkoutAssets['230:2247']
const TRANSIT = checkoutAssets['230:2381']
const ARRIVAL = checkoutAssets['230:2459']
const DELIVERED = checkoutAssets['230:2673']
const money = (cents) => `$${(cents / 100).toFixed(2)}`

function FocusScreen({ children, className = '', label }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  return <section ref={ref} tabIndex={-1} aria-label={label} className={`mo-screen ${className}`}>{children}</section>
}

function SummaryItems({ items }) {
  return items.map((item) => <p className="mo-summary-row" key={item.name}>
    <span>{item.qty}x {item.name}</span><span>{money(item.qty * item.price)}</span>
  </p>)
}

function Divider({ checkout = false }) {
  return <div className="mo-divider"><BrandImage src={checkout ? CHECKOUT.imgVector2 : PLACING.imgVector2} alt="" /></div>
}

function OrderSummary({ order, payment = true }) {
  return <section className="mo-card mo-order-summary">
    <h3>Your order</h3>
    <SummaryItems items={order.items} />
    <Divider />
    <p className="mo-summary-row"><span>Total</span><span>{money(order.total)}{payment ? ' (Cash)' : ''}</span></p>
  </section>
}

function AddressCard({ order }) {
  return <section className="mo-card"><h3>{order.mode === 'Delivery' ? 'Delivery address' : 'Pickup address'}</h3><p>{order.address}</p></section>
}

function OrderHero({ kind, title, subtitle }) {
  const assets = kind === 'placing' ? PLACING : kind === 'delivered' ? DELIVERED : PREPARING
  const image = assets.imgImage9 || assets.imgImage10
  return <header className={`mo-hero mo-${kind}`}>
    {kind === 'delivered' ? <div className="mo-delivered-glow"><BrandImage src={assets.imgBgGlow} alt="" /></div> : <>
      <div className="mo-glow-large"><BrandImage src={assets.imgBgGlow} alt="" /></div>
      <div className="mo-glow-small"><BrandImage src={assets.imgBgGlow1} alt="" /></div>
    </>}
    <div className="mo-hero-image"><div className="mo-hero-motion"><BrandImage src={image} alt="" /></div></div>
    <div className="mo-hero-title"><h2>{title}</h2><p>{subtitle}</p></div>
  </header>
}

export function MobileCheckout({ cart, account, info, onInfoChange, mode, onModeChange, address, onAddress, subtotal, discount, fee, tax, total, promo, onPromoChange, appliedPromo, onApplyPromo, onBack, onPlace, onPayment, onTerms }) {
  const update = (key, value) => onInfoChange((previous) => ({ ...previous, [key]: value }))
  return <FocusScreen label="Checkout" className="mo-checkout">
    <form id="mobile-checkout-form" className="mo-checkout-scroll" onSubmit={(event) => { event.preventDefault(); if (cart.length) onPlace() }}>
      <header className="mo-checkout-header">
        <Action className="ma-round ma-glass" aria-label="Back to cart" onClick={onBack}><Glyph src={CHECKOUT.imgArrowLeft01} /></Action><h2>Checkout</h2>
      </header>
      <section className="mo-checkout-section">
        <h3>Your information</h3>
        <label className="mo-field mo-card"><span>Name</span><input required name="name" aria-label="Your name" value={info.name} placeholder={account || 'John Doe'} onChange={(e) => update('name', e.target.value)} autoComplete="off" pattern=".*\S.*" /></label>
        <label className="mo-field mo-card"><span>Phone</span><span className="mo-phone"><span aria-hidden="true">🇺🇸</span><input required type="tel" name="phone" aria-label="Phone number" value={info.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="off" pattern={String.raw`[+]?[0-9][0-9\s\(\)\-]{6,}`} /></span></label>
      </section>
      <section className="mo-checkout-section">
        <div className="mo-section-title"><h3>{mode === 'Delivery' ? 'Delivery options' : 'Pickup options'}</h3><Action onClick={() => onModeChange(mode === 'Delivery' ? 'Pickup' : 'Delivery')}>{mode === 'Delivery' ? 'Pickup instead' : 'Delivery instead'}</Action></div>
        <div className="mo-card mo-delivery-options">
          <Action className="mo-address-button" aria-label={mode === 'Delivery' ? 'Change delivery address' : 'Change pickup shop'} onClick={onAddress}>
            <BrandImage className="mo-small-illustration mo-flipped" src={CHECKOUT.imgCreatingDeliveryBoyIcon2K2026090211211} alt="" /><span><small>{mode === 'Delivery' ? 'Deliver to' : 'Pickup from'}</small><span>{address}</span></span><Glyph src={CHECKOUT.imgArrowDown01} className="mo-chevron" />
          </Action>
          <label className="mo-field mo-instructions"><span>Instructions (Optional)</span><input aria-label="Delivery instructions" value={info.instructions} onChange={(e) => update('instructions', e.target.value)} placeholder="Please ring the bell twice" /></label>
        </div>
        {mode === 'Delivery' ? <>
          <div className="mo-card mo-leave-door"><BrandImage className="mo-small-illustration" src={CHECKOUT.imgCreatingDeliveryBoyIcon2K2026090211212} alt="" /><span>Leave at the door</span><Action role="switch" aria-label="Leave at the door" aria-checked={info.leaveAtDoor} className={`mo-switch ${info.leaveAtDoor ? 'mo-switch-on' : ''}`} onClick={() => update('leaveAtDoor', !info.leaveAtDoor)}><span /></Action></div>
          <div className="mo-delivery-speeds" role="radiogroup" aria-label="Delivery speed">
            {[false, true].map((priority) => <label className="mo-card mo-speed" key={String(priority)}><input type="radio" name="delivery-speed" checked={info.priority === priority} onChange={() => update('priority', priority)} /><strong>{priority ? 'Priority' : 'Standard'}</strong>{priority && <Glyph src={CHECKOUT.imgZap} />}<span>{priority ? '15–25 min' : '30–40 min'}</span>{priority && <b>+$2</b>}</label>)}
          </div>
        </> : <p className="mo-pickup-note">Collect from the bakery in 20–30 minutes.</p>}
      </section>
      <section className="mo-checkout-section"><h3>Payment method</h3><Action className="mo-card mo-payment" onClick={onPayment}><BrandImage className="mo-small-illustration" src={CHECKOUT.imgCreatingDeliveryBoyIcon2K2026090211213} alt="" /><span><strong>Cash</strong><small>Pay {money(total)} {mode === 'Delivery' ? 'in cash to the rider' : 'at pickup'}</small></span><Glyph src={CHECKOUT.imgArrowDown01} className="mo-chevron" /></Action></section>
      <section className="mo-checkout-section mo-checkout-summary"><h3>Order summary</h3><SummaryItems items={cart} /><Divider checkout />
        <p className="mo-summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></p>
        {discount > 0 && <p className="mo-summary-row"><span>Discount</span><span>−{money(discount)}</span></p>}
        <p className="mo-summary-row"><span>{mode === 'Delivery' ? `Delivery Fee (${info.priority ? 'Priority' : 'Standard'})` : 'Pickup'}</span><span>{fee ? money(fee) : 'Free'}</span></p>
        <p className="mo-summary-row"><span>VAT</span><span>{money(tax)} (2.5%)</span></p>
        <div className="ma-promo"><input aria-label="Promo code" placeholder="Enter promo code" value={promo} onChange={(e) => onPromoChange(e.target.value)} /><Action onClick={onApplyPromo}>{appliedPromo ? 'Applied' : 'Apply'}</Action></div>
        <div className="ma-savings ma-savings-active"><Glyph src={CHECKOUT.imgDiscount} /><span>{discount > 0 ? `You’ve saved ${money(discount)} with discounts` : 'Use BAKE10 for 10% off your demo order'}</span></div>
      </section>
      <p className="mo-terms">By placing the order, I agree to all <Action onClick={onTerms}>terms &amp; conditions</Action></p>
    </form>
    <footer className="ma-cart-footer mo-checkout-footer"><div><span>Total</span><strong>{money(total)}</strong></div><button className="ma-primary" type="submit" form="mobile-checkout-form" disabled={!cart.length}>Place order</button></footer>
  </FocusScreen>
}

export function PlacingOrder({ order, onChange, onConfirm }) {
  const [seconds, setSeconds] = useState(5)
  useEffect(() => {
    const interval = setInterval(() => setSeconds((previous) => Math.max(0, previous - 1)), 1000)
    const complete = setTimeout(onConfirm, 5000)
    return () => { clearInterval(interval); clearTimeout(complete) }
  }, [onConfirm])
  return <FocusScreen label="Placing order" className="mo-placing-screen">
    <OrderHero kind="placing" title="Placing order..." subtitle="Make sure everything looks right" />
    <div className="mo-progress" role="progressbar" aria-label="Placing order progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={5 - seconds}><span /></div>
    <div className="mo-review-cards"><AddressCard order={order} /><section className="mo-card"><h3>Payment method</h3><p>Cash</p></section><OrderSummary order={order} payment={false} /></div>
    <div className="mo-bottom-action"><Action className="ma-soft-button" onClick={onChange}>I would like to change ({seconds})</Action></div>
  </FocusScreen>
}

export function OrderTracking({ order, stage, onNext, onBack, onHelp, onUpdate }) {
  const [hideTips, setHideTips] = useState(false)
  const delivery = order.mode === 'Delivery'
  const map = delivery && (stage === 1 || stage === 2)
  const arrived = stage === 2
  const delivered = stage === 3
  const mapAssets = arrived ? ARRIVAL : TRANSIT
  const title = delivered ? 'Delivered' : stage === 0 ? 'Preparing your order' : delivery ? arrived ? 'Rider is at your address' : 'Rider is on the way' : 'Your order is ready'
  const subtitle = delivered ? 'Enjoy your freshly baked meal' : stage === 0 ? 'Takes about 2–3 minutes' : delivery ? arrived ? 'Collect your order from the rider' : `Reaching in ${order.priority ? '15–25' : '30–40'} minutes` : 'Collect your order from the bakery'
  const nextLabel = stage === 0 ? 'Preview rider on the way' : stage === 1 && delivery ? 'Preview rider arrival' : 'Mark order delivered'
  return <FocusScreen label="Order tracking" className={`mo-tracking ${map ? `mo-map-tracking ${arrived ? 'mo-arrival' : 'mo-transit'}` : delivered ? 'mo-complete' : 'mo-preparation'}`}>
    <main className="mo-tracking-scroll">
      {map ? <header className="mo-map-header">
        <BrandImage className="mo-map" src={mapAssets.imgHeader} alt="Demo delivery map" /><div className="mo-map-fade" />
        {!arrived && <div className="mo-route"><Glyph src={TRANSIT.imgVector2} /></div>}
        <div className="mo-scooter"><Glyph src={mapAssets.imgScooter02} /></div>
        <div className="mo-map-home"><Glyph src={mapAssets.imgLocation02} /></div>
        <Action className="mo-map-title mo-card" aria-label={nextLabel} onClick={onNext}><span><h2>{title}</h2><p>{subtitle}</p></span><span className={arrived ? '' : 'mo-rider-motion'}><BrandImage className="mo-map-illustration mo-flipped" src={mapAssets.imgImage9} alt="" /></span></Action>
      </header> : <OrderHero kind={delivered ? 'delivered' : 'preparing'} title={title} subtitle={subtitle} />}
      <div className="mo-tracking-cards">
        {!delivered && <AddressCard order={order} />}
        {map && <section className="mo-card mo-tip-card">
          <div className="mo-tip-heading"><BrandImage src={TRANSIT.imgCreatingDeliveryBoyIcon2K2026090211211} alt="" /><Action className="ma-glass" aria-expanded={!hideTips} onClick={() => setHideTips(!hideTips)}>{hideTips ? 'Show tips' : 'Hide'}</Action></div>
          {!hideTips && <><div><h3>Would you like to tip the rider?</h3><p>Your tips go directly to the rider.</p></div><div className="mo-tip-options" aria-label="Rider tip">{[1, 2, 5, 10, 15, 20, 25, 30, 50].map((value) => <Action key={value} aria-label={`Tip $${value}`} aria-pressed={order.tip === value * 100} className={order.tip === value * 100 ? 'mo-tip-selected' : ''} onClick={() => onUpdate({ tip: order.tip === value * 100 ? 0 : value * 100 })}>${value}</Action>)}</div><Action className="mo-tip-payment" onClick={onHelp}><BrandImage className="mo-small-illustration" src={TRANSIT.imgCreatingDeliveryBoyIcon2K2026090211212} alt="" /><span><strong>Cash</strong><small>{order.tip ? `Pay ${money(order.tip)} tip in cash to the rider` : 'Select an optional cash tip'}</small></span><Glyph className="mo-chevron" src={TRANSIT.imgArrowDown01} /></Action></>}
        </section>}
        {delivered && <><div className="mo-points"><span><Glyph src={DELIVERED.imgCroissant} /></span><strong>+50</strong> Bake Points</div><section className="mo-card mo-rating"><h3>How was your experience?</h3><div role="radiogroup" aria-label="Rate your order" className="mo-stars" onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
          event.preventDefault()
          const direction = ['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1
          const next = Math.min(5, Math.max(1, (order.rating || 1) + direction))
          onUpdate({ rating: next })
          event.currentTarget.querySelectorAll('button')[next - 1]?.focus()
        }}>{[1, 2, 3, 4, 5].map((value) => <Action role="radio" aria-checked={order.rating === value} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} key={value} onClick={() => onUpdate({ rating: value })}><Glyph src={value <= order.rating ? DELIVERED.imgStar : DELIVERED.imgStar1} /></Action>)}</div><label className="mo-field mo-instructions"><span>Add a comment (Optional)</span><textarea aria-label="Order feedback" value={order.comment} placeholder="Really loved the croissant!" onChange={(e) => onUpdate({ comment: e.target.value })} /></label></section></>}
        <OrderSummary order={order} />
      </div>
      {delivered && <div className="mo-complete-action"><Action className="ma-soft-button" onClick={onBack}>Back to home</Action></div>}
    </main>
    {!delivered && <Action className="ma-round ma-glass mo-back" aria-label="Back to home" onClick={onBack}><Glyph src={PREPARING.imgArrowLeft01} /></Action>}
    <Action className="ma-glass mo-help" onClick={onHelp}>Help</Action>
  </FocusScreen>
}
