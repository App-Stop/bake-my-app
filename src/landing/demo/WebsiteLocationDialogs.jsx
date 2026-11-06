import { BrandImage } from './BrandImage'
import { useState } from 'react'
import './website-location-dialogs.css'

/*
 * Website "Deliver to" / "Track your order" dialogs (Figma cozy: Deliver 1:8375, Pickup 1:8840,
 * Track your order 1:8944). Drawn at Figma 1× inside the 1920px .ws-modal-scale layer.
 */

const A = '/figma/customer-website/'
const RIDER = '/assets/mobile/f4a92.png'
const SHOP = A + '966b9.png'
const TRACK = A + 'b15f0.png'

const PICKUP_SHOPS = {
  Texas: ['The Cozy Cafe, 23 Eve, Texas', '742 Bake Cafe, Texas', 'Main Street Bakery, 125 Main Street, Texas'],
  California: ['Sunset Bakery, 18 Ocean Ave, California', 'Golden Crust, 402 Pine St, California'],
  'New York': ['Hudson Bakehouse, 77 Bleecker St, New York', 'Brooklyn Rise, 12 Bedford Ave, New York'],
}
const stateOf = (shop) => Object.keys(PICKUP_SHOPS).find((state) => PICKUP_SHOPS[state].includes(shop)) ?? 'Texas'

function DialogFrame({ title, hero, heroClass = '', close, children }) {
  return <div className="ws-modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) close() }}>
    <section className="wl-dialog" role="dialog" aria-modal="true" aria-labelledby="wl-title">
      <div className="wl-head">
        <div><BrandImage className={`wl-hero brand-illustration ${heroClass}`} src={hero} alt="" /><h2 id="wl-title">{title}</h2></div>
        <button type="button" className="wl-close" aria-label={`Close ${title}`} onClick={close}><BrandImage src={A + '1f81d.svg'} alt="" /></button>
      </div>
      <div className="wl-body">{children}</div>
    </section>
  </div>
}

function ModeTabs({ mode, setMode }) {
  return <div className="wl-modes">
    {[['delivery', 'Delivery', RIDER, 'wl-mode-rider'], ['pickup', 'Pickup', SHOP, 'wl-mode-shop']].map(([id, label, image, imageClass]) =>
      <button key={id} type="button" aria-pressed={mode === id} className={mode === id ? 'wl-mode-active' : ''} onClick={() => setMode(id)}>
        <BrandImage className={`brand-illustration ${imageClass}`} src={image} alt="" />{label}
      </button>)}
  </div>
}

function DeliveryOptions({ addresses, setAddresses, address, chooseAddress }) {
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const save = (event) => {
    event.preventDefault()
    const value = draft.trim()
    if (!value) return
    setAddresses((items) => editing === 'new' ? [...items, value] : items.map((item, i) => i === editing ? value : item))
    setEditing(null)
    chooseAddress(value)
  }
  const editor = <form className="wl-edit" onSubmit={save}>
    <input autoFocus aria-label="Street address" placeholder="Street address, city" value={draft} onChange={(event) => setDraft(event.target.value)} />
    <button type="submit">Save</button>
    <button type="button" onClick={() => setEditing(null)}>Cancel</button>
  </form>
  return <div className="wl-addresses">
    <button type="button" className="wl-row wl-current" onClick={() => chooseAddress(addresses[0], 'Using your current location: ' + addresses[0])}>
      <span><BrandImage src={A + '8d049.svg'} alt="" />Use my current location</span>
    </button>
    {addresses.map((value, i) => editing === i ? <div key={i}>{editor}</div> : <div className="wl-row" key={i}>
      <label><input type="radio" name="wl-address" checked={address === value} onChange={() => chooseAddress(value)} />{value}</label>
      <button type="button" className="wl-edit-button" aria-label={`Edit ${value}`} onClick={() => { setEditing(i); setDraft(value) }}><BrandImage src={A + 'd7e91.svg'} alt="" /></button>
    </div>)}
    {editing === 'new' ? editor : <button type="button" className="wl-secondary" onClick={() => { setEditing('new'); setDraft('') }}>Add new address</button>}
  </div>
}

function PickupOptions({ pickupAddress, saveShop }) {
  const [state, setState] = useState(() => stateOf(pickupAddress))
  const [shop, setShop] = useState(() => PICKUP_SHOPS[stateOf(pickupAddress)].includes(pickupAddress) ? pickupAddress : PICKUP_SHOPS.Texas[0])
  return <>
    <div className="wl-pickup">
      <div className="wl-fields">
        <label className="wl-field"><span>State</span>
          <select value={state} onChange={(event) => { setState(event.target.value); setShop(PICKUP_SHOPS[event.target.value][0]) }}>
            {Object.keys(PICKUP_SHOPS).map((name) => <option key={name}>{name}</option>)}
          </select><BrandImage src={A + '6e7c8.svg'} alt="" />
        </label>
        <label className="wl-field"><span>Shop</span>
          <select value={shop} onChange={(event) => setShop(event.target.value)}>
            {PICKUP_SHOPS[state].map((name) => <option key={name}>{name}</option>)}
          </select><BrandImage src={A + '6e7c8.svg'} alt="" />
        </label>
      </div>
      <BrandImage className="wl-map" src={A + '326b9.png'} alt={`Map showing ${shop}`} />
    </div>
    <button type="button" className="wl-primary" onClick={() => saveShop(shop)}>Save changes</button>
  </>
}

function TrackOrder({ order, onTrack }) {
  const [value, setValue] = useState(order?.id ?? '')
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const id = value.trim().toUpperCase()
    if (!order) return setError('No orders yet. Place an order, then track it here.')
    if (!id || ![order.id.toUpperCase(), order.id.replace('DEMO-', '')].includes(id.replace(/^#/, ''))) return setError('We couldn’t find an order with that ID.')
    onTrack()
  }
  return <form className="wl-track" onSubmit={submit}>
    <label className="wl-field wl-field-shadow"><span>Order ID</span><input value={value} placeholder="ORDER-213213" aria-describedby="wl-track-help" onChange={(event) => { setValue(event.target.value); setError('') }} /></label>
    <p id="wl-track-help" className={error ? 'wl-error' : ''} role={error ? 'alert' : undefined}>{error || 'Check your SMS or Email for the Order ID'}</p>
    <button type="submit" className="wl-primary">Track</button>
  </form>
}

/** `type` is 'delivery', 'pickup' or 'track'; switching the mode tabs swaps between the first two. */
export function LocationDialog({ type, setType, close, addresses, setAddresses, address, chooseAddress, pickupAddress, saveShop, order, onTrack }) {
  if (type === 'track') return <DialogFrame title="Track your order" hero={TRACK} heroClass="wl-flip" close={close}><TrackOrder order={order} onTrack={onTrack} /></DialogFrame>
  const pickup = type === 'pickup'
  return <DialogFrame title={pickup ? 'Select a shop' : 'Where to deliver?'} hero={pickup ? SHOP : RIDER} heroClass={pickup ? 'wl-flip wl-bottom' : 'wl-flip'} close={close}>
    <ModeTabs mode={type} setMode={setType} />
    {pickup ? <PickupOptions pickupAddress={pickupAddress} saveShop={saveShop} /> : <DeliveryOptions {...{ addresses, setAddresses, address, chooseAddress }} />}
  </DialogFrame>
}
