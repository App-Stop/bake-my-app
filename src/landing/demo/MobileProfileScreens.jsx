import { BrandImage } from './BrandImage'
import { useState } from 'react'
import { Action, Glyph } from './MobileUI'
import { profileAssets as P } from './mobileProfileAssets'
import './mobile-profile-screens.css'

const money = (cents) => `$${(cents / 100).toFixed(2)}`
/** "-$20" / "+$4.56": whole dollars drop the cents, as in the Figma transaction list. */
const signedMoney = (cents) => {
  const abs = Math.abs(cents)
  return `${cents < 0 ? '-' : '+'}$${abs % 100 ? (abs / 100).toFixed(2) : abs / 100}`
}
const BADGE_ICONS = { lg: P.croissant24, md: P.croissant18, sm: P.croissant15 }
const EARN_WAYS = [
  ['Complete weekly streaks', 'Every week, complete the streak to gain +100 cozy points', P.streak, 'mp-earn-flip'],
  ['Scratch card', 'We send some scratch cards to some of our orders, be sure to check them out 😉', P.scratchCard, ''],
  ['Or simply, just order', 'On most orders, you get rewarded with cozy points', P.order, 'mp-earn-crop'],
]

function Chevron() { return <Glyph className="mp-chevron" src={P.chevron} /> }

/** Brand-colored "Cozy Points" croissant badge (Figma sizes 32 / 24 / 20). */
function PointsBadge({ size }) { return <span className={`mp-badge mp-badge-${size}`}><Glyph src={BADGE_ICONS[size]} /></span> }

function TopBar({ title, light = false, onBack, onInfo }) {
  return <div className="mp-topbar">
    <Action className="mp-back" aria-label="Back" onClick={onBack}><Glyph src={P.arrowLeft} /></Action>
    <Action className="mp-title" aria-label={`About ${title}`} onClick={onInfo}><h2>{title}</h2><Glyph src={light ? P.infoLight : P.infoDark} /></Action>
  </div>
}

function HistoryRow({ item, reward = false }) {
  return <div className="mp-history-row">
    <span><Glyph src={P.invoice} /><span><strong>{item.label}</strong><small>{item.date}</small></span></span>
    {reward ? <span className="mp-reward"><PointsBadge size="sm" />+{item.points}</span> : <span>{signedMoney(item.amount)}</span>}
  </div>
}

/** Figma "Profile" (230:1555). */
export function ProfileScreen({ name, email, balance, onEditProfile, onOrders, onFavorites, onWallet, onAddresses, onPayment, onNotifications, onHelp, onLogout }) {
  const rows = [['Addresses', P.location, onAddresses], ['Payment Method', P.money, onPayment], ['Notifications', P.notification, onNotifications]]
  return <>
    <header className="mp-profile-header">
      <div className="mp-profile-glow" aria-hidden="true" />
      <div className="mp-user"><div><h2>{name}</h2><p>{email}</p></div><Action className="mp-pill ma-glass" onClick={onEditProfile}>Edit profile</Action></div>
    </header>
    <main className="mp-scroll mp-profile-scroll">
      <div className="mp-tiles">
        <Action className="mp-tile" onClick={onOrders}><Glyph src={P.invoice} />My Orders</Action>
        <Action className="mp-tile" onClick={onFavorites}><Glyph src={P.favourite} />Favourites</Action>
      </div>
      <section className="mp-section"><h3>Loyalty Wallet</h3>
        <Action className="mp-card" onClick={onWallet}>
          <span className="mp-card-main"><span className="mp-wallet-art"><BrandImage src={P.wallet} alt="" /></span><span className="mp-card-text"><strong>{money(balance)}</strong><span>Available balance</span></span></span>
          <Chevron />
        </Action>
      </section>
      <div className="mp-divider"><BrandImage src={P.divider} alt="" /></div>
      <section className="mp-section"><h3>Manage</h3>
        {rows.map(([label, icon, onClick]) => <Action key={label} className="mp-row" onClick={onClick}><span><Glyph src={icon} />{label}</span><Chevron /></Action>)}
      </section>
      <section className="mp-section"><h3>More</h3>
        <Action className="mp-row" onClick={onHelp}><span><Glyph src={P.help} />Help &amp; Support</span><Chevron /></Action>
        <Action className="mp-row mp-logout" onClick={onLogout}><span><Glyph src={P.logout} />Log out</span></Action>
      </section>
    </main>
  </>
}

/** Figma "Loyalty Wallet" (230:1660). */
export function LoyaltyWallet({ balance, points, transactions, onBack, onInfo, onPoints, onTopUp, onPayment }) {
  const [showAll, setShowAll] = useState(false)
  const shown = showAll ? transactions : transactions.slice(0, 6)
  return <>
    <header className="mp-wallet-header">
      <TopBar title="Loyalty Wallet" light onBack={onBack} onInfo={onInfo} />
      <div className="mp-balance"><strong>{money(balance)}</strong><span>Available Balance</span></div>
    </header>
    <main className="mp-scroll mp-wallet-scroll">
      <div className="mp-tiles">
        <Action className="mp-tile mp-points-tile" onClick={onPoints}>
          <span><span className="mp-points-line"><PointsBadge size="md" />{points}</span>Bake Points</span>
          <Chevron />
        </Action>
        <Action className="mp-tile" onClick={onTopUp}><Glyph src={P.addMoney} />Top up wallet</Action>
      </div>
      <section className="mp-section"><h3>Payment method</h3>
        <Action className="mp-card" onClick={onPayment}>
          <span className="mp-card-main"><BrandImage className="mp-card-logo" src={P.mastercard} alt="" /><span className="mp-card-text"><strong>Mastercard</strong><span>**** 2134</span></span></span>
          <Chevron />
        </Action>
      </section>
      <section className="mp-section">
        <div className="mp-section-head"><h3>Recent transactions</h3>{transactions.length > 6 && <Action className="mp-pill ma-glass" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? 'Show less' : 'View all'}</Action>}</div>
        {shown.map((item) => <HistoryRow key={item.id} item={item} />)}
      </section>
    </main>
  </>
}

/** Figma "Bake Points" (230:1783). */
export function BakePoints({ points, rewards, onBack, onInfo, onWithdraw }) {
  return <>
    <div className="mp-points-topbar"><TopBar title="Bake Points" onBack={onBack} onInfo={onInfo} /></div>
    <main className="mp-scroll mp-points-scroll">
      <div className="mp-points-summary">
        <div><span className="mp-points-line"><PointsBadge size="lg" />{points}</span>Bake Points</div>
        <Action className="mp-withdraw" disabled={!points} onClick={onWithdraw}>Withdraw to wallet</Action>
      </div>
      <section className="mp-section"><h3>How to earn?</h3>
        {EARN_WAYS.map(([title, text, image, variant]) => <div key={title} className="mp-earn"><span className={`mp-earn-art ${variant}`}><BrandImage src={image} alt="" /></span><span><strong>{title}</strong><p>{text}</p></span></div>)}
      </section>
      <section className="mp-section"><h3>Recent rewards</h3>
        {rewards.map((item) => <HistoryRow key={item.id} item={item} reward />)}
      </section>
    </main>
  </>
}
