import { useState } from 'react'
import { BrandImage } from './BrandImage'
import { ProfileScreen, LoyaltyWallet, BakePoints } from './MobileProfileScreens'
import { CROISSANTS, WEBSITE_PRODUCTS } from './storefrontCatalog'
import { deliveryTotals } from './DeliveryPanels'
import './website-account.css'

const money = value => `$${value.toFixed(2)}`
const INITIAL_TRANSACTIONS = [20, 15, 30, 25, 30, 20].map((amount, i) => ({ id: `transaction-${i}`, label: 'Order', date: `1-${i + 9}-2026`, amount: -amount * 100 }))
const REWARDS = INITIAL_TRANSACTIONS.map(item => ({ ...item, points: 50 }))
// Sample history is local demo data; new orders use the shared checkout totals and feedback.
const SAMPLE_ORDERS = [2, 1, 3, 1, 2].map((qty, i) => {
  const cart = [{ ...CROISSANTS[i], qty }]
  const totals = deliveryTotals(cart, false, false)
  return { id: `231SHA-${i + 1}`, label: '231SHA', cart, totals, total: totals.total, date: '1-9-2026', feedback: { rating: [0, 4, 5, 5, 0][i], comment: '' } }
})

function Stars({ value, onChange, size = 'small' }) {
  return <div className={`wa-stars wa-stars-${size}`} role="group" aria-label="Order rating">{[1, 2, 3, 4, 5].map(star => <button key={star} aria-label={`Rate order ${star} ${star === 1 ? 'star' : 'stars'}`} aria-pressed={star === value} onClick={() => onChange(star)}><BrandImage src={`/figma/customer-website/${star <= value ? 'rating-filled.svg' : 'rating-empty.svg'}`} alt="" /></button>)}</div>
}

function RecentOrders({ orders, feedback, updateFeedback, selectOrder, reorder }) {
  return <section className="wa-recent"><h3>Recent orders</h3><div>{orders.map(item => {
    const rating = feedback[item.id]?.rating ?? item.feedback?.rating ?? 0
    return <article className="wa-order ws-shadow" key={item.id}>
      <button className="wa-order-heading" onClick={() => selectOrder(item.id)} aria-label={`View order ${item.label || item.id}`}><span>Order #{item.label || item.id.replace('DEMO-', '')}</span><span>{money(item.total)}</span></button>
      <p>{item.cart.reduce((sum, product) => sum + product.qty, 0)} items | {item.date || 'Today'}</p>
      <div className="wa-order-actions">{rating ? <span>You rated {rating} <BrandImage src="/figma/customer-website/mobile/708cc.svg" alt="stars" /></span> : <span>Rate <Stars value={0} onChange={rating => updateFeedback(item.id, { rating })} /></span>}<button className="ws-button" onClick={() => reorder(item.cart)}>Reorder</button></div>
    </article>
  })}</div></section>
}

export function WebsiteAccount({ screen, actions, customer, setCustomer, order, orders, ui, notify, reorder }) {
  const [balance, setBalance] = useState(1050)
  const [points, setPoints] = useState(456)
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [feedback, setFeedback] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [panel, setPanel] = useState(null)
  const [email, setEmail] = useState('john@gmail.com')
  const history = [...(order ? [order] : []), ...orders.filter(item => item.id !== order?.id), ...SAMPLE_ORDERS]
  const selected = history.find(item => item.id === selectedId) || history[0]
  const selectedFeedback = feedback[selected.id] ?? selected.feedback ?? { rating: 4, comment: 'Really loved the croissant!' }
  const { ProductCard, ProductImage } = ui
  function updateFeedback(id, changes) {
    setFeedback(current => ({ ...current, [id]: { ...(current[id] || history.find(item => item.id === id)?.feedback), ...changes } }))
  }
  function selectOrder(id) { setSelectedId(id); actions.go('history') }
  const recent = <RecentOrders orders={history} feedback={feedback} updateFeedback={updateFeedback} selectOrder={selectOrder} reorder={reorder} />
  const back = () => actions.go('profile')
  const info = () => notify('Earn Bake Points with your orders. 100 points adds $1 to your demo wallet.')
  return <div className={`ws-account wa-screen-${screen}`}>
    {screen === 'profile' && <ProfileScreen name={customer.name} email={email} balance={balance} headerGlow="/figma/customer-website/mobile/3f3f2.svg" onEditProfile={() => setPanel('Edit profile')} onOrders={() => actions.go('history')} onFavorites={() => actions.go('favorites')} onWallet={() => actions.go('wallet')} onAddresses={() => actions.go('address')} onPayment={() => setPanel('Payment method')} onNotifications={() => setPanel('Notifications')} onHelp={() => actions.go('support')} onLogout={() => { actions.go('login'); notify('You are logged out of the demo') }}>{recent}</ProfileScreen>}
    {screen === 'wallet' && <LoyaltyWallet balance={balance} points={points} transactions={transactions} onBack={back} onInfo={info} onPoints={() => actions.go('points')} onTopUp={() => setPanel('Top up wallet')} onPayment={() => setPanel('Payment method')} />}
    {screen === 'points' && <BakePoints points={points} rewards={REWARDS} onBack={() => actions.go('wallet')} onInfo={info} onWithdraw={() => {
      if (!points) return
      setBalance(value => value + points)
      setTransactions(items => [{ id: `points-${Date.now()}`, label: 'Bake Points', date: 'Today', amount: points }, ...items])
      setPoints(0)
      notify(`${money(points / 100)} added to your demo wallet`)
    }} />}
    {(screen === 'history' || screen === 'favorites') && <header className="wa-page-heading"><button aria-label="Back to profile" onClick={back}><BrandImage src="/figma/customer-website/mobile/d8506.svg" alt="" /></button><h1>{screen === 'history' ? 'Orders' : 'Favourites'}</h1></header>}
    {screen === 'history' && <main className="wa-history">{recent}<article className="wa-order-detail ws-shadow"><ProductImage product={selected.cart[0]} /><div className="wa-order-detail-heading"><div><h2>Order #{selected.label || selected.id.replace('DEMO-', '')}</h2><p>{selected.stage && !['delivered', 'complete'].includes(selected.stage) ? 'In progress' : 'Delivered'} {selected.date || 'Today'}</p></div><b>+50</b></div><section className="dv-review ws-shadow"><h3>How was your experience?</h3><Stars size="large" value={selectedFeedback.rating ?? 4} onChange={rating => updateFeedback(selected.id, { rating })} /><label className="ws-field ws-instructions"><span>Add a comment (Optional)</span><textarea aria-label="Order experience comment" value={selectedFeedback.comment ?? ''} placeholder="Really loved the croissant!" onChange={event => updateFeedback(selected.id, { comment: event.target.value })} /></label></section><button className="ws-button" onClick={() => reorder(selected.cart)}>Reorder</button><section className="wa-order-summary"><h3>Order summary</h3>{selected.cart.map(item => <p key={item.name}><span>{item.qty}x {item.name}</span><span>{money(item.qty * item.price)}</span></p>)}<hr />{[['Subtotal', selected.totals.subtotal], ['Delivery fee', selected.totals.delivery], ['VAT (2.5%)', selected.totals.vat], ...(selected.totals.discount ? [['Discount', -selected.totals.discount]] : []), ['Total', selected.total]].map(([label, amount]) => <p key={label}><span>{label}</span><span>{money(amount)}</span></p>)}</section></article></main>}
    {screen === 'favorites' && <main className="wa-favorites"><div className="ws-product-grid">{WEBSITE_PRODUCTS.filter(item => actions.favorites.includes(item.name)).map(item => <ProductCard key={item.name} product={item} {...actions} />)}</div>{!actions.favorites.length && <div className="wa-empty"><p>Save your favourites by tapping the heart on any product.</p><button className="ws-button" onClick={() => actions.browse()}>Browse menu</button></div>}</main>}
    {panel && <section className="wa-settings ws-shadow" aria-label={panel}><div><h2>{panel}</h2><button aria-label="Close settings" onClick={() => setPanel(null)}>×</button></div>{panel === 'Edit profile' ? <form onSubmit={event => { event.preventDefault(); setPanel(null); notify('Profile updated') }}><label className="ws-field">Name<input required value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} /></label><label className="ws-field">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} /></label><button className="ws-button">Save profile</button></form> : panel === 'Top up wallet' ? <form onSubmit={event => { event.preventDefault(); const amount = Math.round(Number(new FormData(event.currentTarget).get('amount')) * 100); setBalance(value => value + amount); setTransactions(items => [{ id: `topup-${Date.now()}`, label: 'Wallet top up', date: 'Today', amount }, ...items]); setPanel(null); notify('Demo wallet updated') }}><label className="ws-field">Amount ($)<input type="number" name="amount" required min="1" max="1000" step="0.01" defaultValue="10" /></label><button className="ws-button">Add to demo wallet</button></form> : panel === 'Notifications' ? <label><input type="checkbox" defaultChecked /> Order notifications</label> : <p>Mastercard •••• 2134<br />Orders use cash in this demo.</p>}</section>}
  </div>
}
