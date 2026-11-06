import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDown01Icon,
  Bread04Icon,
  CakeIcon,
  Clock05Icon,
  Coffee02Icon,
  CroissantIcon,
  DonutIcon,
  Logout03Icon,
  MenuRestaurantIcon,
  PackagingIcon,
  Scooter02Icon,
  Search01Icon,
  ShoppingBasket03Icon,
} from '@hugeicons/core-free-icons'
import { Link } from '../../components/Link'
import { ROUTES } from '../../router'
import { DemoLogo } from './DemoLogo'
import { WEBSITE_PRODUCTS } from './storefrontCatalog'
import { ToggleSwitch } from '../../dashboard/branches/ToggleSwitch'
import flakyButterCroissant from '../../assets/menu/flaky-butter-croissant.webp'
import almondFrangipaneCroissant from '../../assets/menu/almond-frangipane-croissant.webp'
import doubleChocolateCroissant from '../../assets/menu/double-chocolate-croissant.webp'
import matchaCreamCruffin from '../../assets/menu/matcha-cream-cruffin.webp'
import savoryHamCheeseCroissant from '../../assets/menu/savory-ham-cheese-croissant.webp'

/*
 * Staff portal order console (Figma "branch-main", 1308 × 819.2 at 1×). Sample orders move through
 * Preparing → Ready → Dispatched (delivery) → Completed as staff press the action button.
 */

const ADDRESS = 'Sunset Blvrd Road, Main Street, Texas, US'

const INITIAL_ORDERS = [
  {
    id: 'ORD-123', number: '#2493', customer: 'Sarah Jenkins', phone: '+1 (555) 321-9876',
    address: '415 Sourdough Lane, Apt 3B, Austin TX', type: 'Delivery', ago: '12 min ago', received: '10:14 AM',
    status: 'Preparing', payment: 'Cash', deliveryFee: 2.5, tax: 1.5,
    items: [
      { name: 'Artisanal Sourdough Loaf', qty: 2, total: 12 },
      { name: 'Flaky Butter Croissant', qty: 1, total: 2.5 },
      { name: 'Vanilla Bean Pastry Cup', qty: 1, total: 4 },
    ],
  },
  {
    id: 'ORD-124', number: '#2494', customer: 'Michael Smith', phone: '+1 (555) 214-7781',
    type: 'Pickup', ago: '10 min ago', received: '10:16 AM', status: 'Ready', payment: 'Card', tax: 1.25,
    items: [
      { name: 'Almond Croissant', qty: 2, total: 11.5 },
      { name: 'Iced Caramel Macchiato', qty: 1, total: 6 },
    ],
  },
  {
    id: 'ORD-125', number: '#2495', customer: 'Emily Johnson', phone: '+1 (555) 908-1142',
    address: '88 Rye Street, Austin TX', type: 'Delivery', ago: '5 min ago', received: '10:21 AM',
    status: 'Dispatched', payment: 'Card', deliveryFee: 2.5, tax: 2,
    items: [
      { name: 'Black Forest Gateau', qty: 1, total: 22 },
      { name: 'Classic Butter Croissant', qty: 3, total: 3.5 },
    ],
  },
  {
    id: 'ORD-126', number: '#2496', customer: 'David Brown', phone: '+1 (555) 660-3021',
    type: 'Pickup', ago: '2 min ago', received: '10:24 AM', status: 'Ready', payment: 'Cash', tax: 1,
    items: [
      { name: 'Pistachio Croissant', qty: 2, total: 14 },
    ],
  },
]

const STATUS_STYLE = {
  Preparing: { pill: 'bg-surface text-[#777]', bar: 'bg-[#777]' },
  Ready: { pill: 'bg-primary-light text-primary', bar: 'bg-primary' },
  Dispatched: { pill: 'bg-[#e6f6ff] text-[#0095ff]', bar: 'bg-[#0095ff]' },
  Completed: { pill: 'bg-[#ebf7e5] text-[#39ab00]', bar: 'bg-[#39ab00]' },
}

// The next status and the button that moves an order there.
const NEXT = {
  Preparing: () => ({ status: 'Ready', label: 'Mark as Ready' }),
  Ready: (o) => (o.type === 'Delivery' ? { status: 'Dispatched', label: 'Dispatch Order' } : { status: 'Completed', label: 'Mark as Collected' }),
  Dispatched: () => ({ status: 'Completed', label: 'Mark as Delivered' }),
}

const TABS = [
  { id: 'active', label: 'All Active', match: (o) => o.status !== 'Completed' },
  { id: 'pickup', label: 'Pickup', match: (o) => o.status !== 'Completed' && o.type === 'Pickup' },
  { id: 'delivery', label: 'Delivery', match: (o) => o.status !== 'Completed' && o.type === 'Delivery' },
  { id: 'completed', label: 'Completed', match: (o) => o.status === 'Completed' },
]

const money = (n) => `$${n.toFixed(2)}`
const subtotal = (o) => o.items.reduce((sum, i) => sum + i.total, 0)
const total = (o) => subtotal(o) + (o.deliveryFee ?? 0) + o.tax

function Icon({ icon, size = 16, className = '' }) {
  return <HugeiconsIcon icon={icon} size={size} color="currentColor" className={`shrink-0 ${className}`} />
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return {
    time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^(\w+) /, '$1, '),
  }
}

function TopBar({ screen, onNavigate }) {
  const { time, date } = useClock()
  return (
    <header className="flex w-full items-center gap-8 border-[0.8px] border-[#f0ece9] bg-white p-4">
      <div className="flex min-w-px flex-1">
        <DemoLogo className="h-[38.307px] w-[53.04px]" />
      </div>
      <nav className="flex w-[480px] items-center justify-center gap-[6.4px] text-[11.2px] leading-normal">
        <button type="button" onClick={() => onNavigate("orders")} aria-pressed={screen === "orders"} className={`flex min-w-px flex-1 items-center justify-center gap-[9.6px] rounded-[9.6px] p-[9.6px] font-medium ${screen === "orders" ? "bg-primary-light text-primary" : "text-body"}`}>
          <Icon icon={ShoppingBasket03Icon} />
          Orders
        </button>
        <button type="button" onClick={() => onNavigate("menu")} aria-pressed={screen === "menu"} className={`flex min-w-px flex-1 items-center justify-center gap-[9.6px] rounded-[9.6px] p-[9.6px] ${screen === "menu" ? "bg-primary-light text-primary" : "text-body"}`}>
          <Icon icon={MenuRestaurantIcon} />
          Menu
        </button>
      </nav>
      <div className="flex min-w-px flex-1 items-center gap-4">
        <div className="flex min-w-px flex-1 flex-col items-end gap-[3.2px] text-right leading-normal">
          <p className="w-full text-[12.8px] font-semibold text-ink">{time}</p>
          <p className="w-full text-[9.6px] text-muted">{date}</p>
        </div>
        <Link to={ROUTES.home} aria-label="Log out" className="rounded-[9.6px] p-[9.6px] text-[#ea0101] transition hover:bg-[#fdecec]">
          <Icon icon={Logout03Icon} />
        </Link>
      </div>
    </header>
  )
}

function Tabs({ tabs, tab, onChange }) {
  return (
    <div role="tablist" className="flex h-9 w-[528px] items-start gap-[6.4px] border-b-[0.8px] border-line-strong">
      {tabs.map(({ id, label, count }) => {
        const active = tab === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`flex min-w-px flex-1 items-center justify-center gap-[6.4px] px-[12.8px] py-[9.6px] text-[11.2px] leading-normal ${
              active ? 'border-b-[1.6px] border-primary font-semibold text-primary' : 'font-medium text-muted hover:text-ink'
            }`}
          >
            {label}
            <span
              className={`flex size-4 items-center justify-center rounded-full text-[8px] font-semibold ${
                active ? 'bg-primary text-white' : 'bg-line text-subtle'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function StatusPill({ status }) {
  return (
    <span className={`rounded-full px-[4.8px] py-[1.6px] text-[8.8px] leading-normal font-semibold whitespace-nowrap ${STATUS_STYLE[status].pill}`}>
      {status}
    </span>
  )
}

function OrderRow({ order, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex w-full flex-col gap-[3.2px] rounded-[9.6px] p-2 text-left leading-normal transition-colors ${
        selected ? 'bg-surface' : 'hover:bg-surface/60'
      }`}
    >
      <span className="flex w-full items-center justify-between">
        <span className="text-[12.8px] font-medium text-ink">{order.id}</span>
        <span className="text-[10.4px] text-muted">{order.ago}</span>
      </span>
      <span className="flex w-full items-center justify-between text-[12.8px] font-medium whitespace-nowrap text-ink">
        <span>{order.customer}</span>
        <span>{money(total(order))}</span>
      </span>
      <span className="flex w-full items-center justify-between">
        <span className="flex min-w-px items-center gap-[6.4px]">
          <span className="flex items-center gap-[3.2px] text-[10.4px] font-medium text-ink">
            <Icon icon={order.type === 'Delivery' ? Scooter02Icon : PackagingIcon} />
            {order.type}
          </span>
          {order.type === 'Delivery' && <span className="truncate text-[10.4px] text-muted">{ADDRESS}</span>}
        </span>
        <StatusPill status={order.status} />
      </span>
      <span className={`absolute top-1/2 left-[-1.8px] h-[24.8px] w-[3.2px] -translate-y-1/2 rounded-full ${STATUS_STYLE[order.status].bar}`} />
    </button>
  )
}

// Pickup orders skip dispatch; the step matching an order's status is the one in progress.
const stepsFor = (o) =>
  o.type === 'Delivery' ? ['Received', 'Preparing', 'Ready', 'Dispatch', 'Delivered'] : ['Received', 'Preparing', 'Ready', 'Collected']
const stepIndex = (o) => ({ Preparing: 1, Ready: 2, Dispatched: 3 })[o.status] ?? stepsFor(o).length - 1

function Timeline({ order }) {
  const current = stepIndex(order)
  const finished = order.status === 'Completed'
  return (
    <div className="flex w-full flex-col gap-[9.6px]">
      <p className="text-[10.4px] leading-normal font-semibold text-muted">Timeline</p>
      <ol className="flex w-full flex-col gap-[9.6px]">
        {stepsFor(order).map((step, i) => {
          const done = i < current || finished
          const inProgress = i === current && !finished
          return (
            <li key={step} className="flex w-full items-center gap-[9.6px] leading-normal">
              <span className={`size-[6.4px] shrink-0 rounded-full ${done ? 'bg-[#39ab00]' : inProgress ? 'bg-[#ed6c02]' : 'bg-line-strong'}`} />
              <span className={`text-[10.4px] ${done ? 'text-ink' : inProgress ? 'font-semibold text-muted' : 'text-muted'}`}>{step}</span>
              <span className={`min-w-px flex-1 text-right text-[9.6px] text-muted ${inProgress ? 'font-semibold' : ''}`}>
                {i === 0 ? order.received : done ? order.times?.[step] ?? 'Done' : inProgress ? 'In Progress' : 'Pending'}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Row({ label, value, className = '' }) {
  return (
    <div className={`flex w-full items-start justify-between ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function OrderDetails({ order, onAdvance }) {
  const next = NEXT[order.status]?.(order)
  return (
    <section className="flex h-full min-w-px flex-1 flex-col gap-4 rounded-2xl bg-white p-[19.2px]" aria-label={`Order ${order.number}`}>
      <div className="flex flex-col gap-[1.6px] leading-normal whitespace-nowrap">
        <p className="text-[14.4px] font-semibold text-ink">Order {order.number}</p>
        <p className="text-[9.6px] text-muted">Received at {order.received}</p>
      </div>
      <div className="flex w-full flex-col gap-[9.6px] rounded-[9.6px] bg-surface p-[12.8px] leading-normal whitespace-nowrap">
        <p className="text-[10.4px] font-semibold text-ink">{order.type} Details</p>
        <div className="flex flex-col gap-[3.2px] text-[10.4px] text-muted">
          <p className="text-[11.2px] font-semibold text-ink">{order.customer}</p>
          <p>{order.phone}</p>
          {order.address && <p>{order.address}</p>}
        </div>
      </div>
      <div className="flex w-full flex-col gap-[9.6px] text-[10.4px] leading-normal whitespace-nowrap">
        <p className="font-semibold text-muted">Items</p>
        <div className="flex w-full flex-col gap-[6.4px] text-ink">
          {order.items.map((item) => (
            <div key={item.name} className="flex w-full items-start justify-between">
              <span>
                {item.qty}x {item.name}
              </span>
              <span className="font-medium">{money(item.total)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[0.8px] w-full bg-line" />
      <div className="flex w-full flex-col gap-[6.4px] leading-normal whitespace-nowrap">
        <div className="flex flex-col gap-[6.4px] text-[10.4px] text-muted [&>div>span:last-child]:text-ink">
          <Row label="Subtotal" value={money(subtotal(order))} />
          {order.deliveryFee != null && <Row label="Delivery Fee" value={money(order.deliveryFee)} />}
          <Row label="Tax" value={money(order.tax)} />
        </div>
        <Row
          label="Total"
          value={`${money(total(order))} (${order.payment})`}
          className="text-[11.2px] font-semibold text-ink [&>span:last-child]:text-primary"
        />
      </div>
      <div className="h-[0.8px] w-full bg-line" />
      <Timeline order={order} />
      <div className="mt-auto w-full">
        {next ? (
          <button
            type="button"
            onClick={() => onAdvance(next.status)}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary p-[9.6px] text-[12.8px] leading-normal font-semibold text-white transition hover:brightness-110"
          >
            {next.label}
          </button>
        ) : (
          <p className="flex h-12 w-full items-center justify-center rounded-lg bg-[#ebf7e5] text-[12.8px] font-semibold text-[#39ab00]">
            Order completed
          </p>
        )}
      </div>
    </section>
  )
}

export function StaffScreen() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [screen, setScreen] = useState('orders')
  const [unavailable, setUnavailable] = useState(['Matcha Cream Cruffin'])
  const [statusFilter, setStatusFilter] = useState('all')
  const [tab, setTab] = useState('active')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(INITIAL_ORDERS[0].id)

  const q = query.trim().toLowerCase()
  const visible = orders.filter(
    (o) => TABS.find((t) => t.id === tab).match(o) && (statusFilter === "all" || o.status === statusFilter) && (!q || `${o.id} ${o.number} ${o.customer}`.toLowerCase().includes(q)),
  )
  const selected = visible.find((o) => o.id === selectedId) ?? visible[0]

  const advance = (status) => {
    const stamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setOrders((list) =>
      list.map((o) => {
        if (o.id !== selected.id) return o
        const steps = stepsFor(o)
        const times = { ...o.times, [steps[stepIndex(o)]]: stamp }
        if (status === 'Completed') times[steps[steps.length - 1]] = stamp
        return { ...o, status, times }
      }),
    )
  }

  return (
    <div className="flex size-full flex-col overflow-clip bg-surface font-sans text-ink">
      <TopBar screen={screen} onNavigate={setScreen} />
      {screen === "menu" ? <StaffMenu unavailable={unavailable} setUnavailable={setUnavailable} /> : <>
        <div className="flex min-h-px w-full flex-1 flex-col gap-4 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Tabs tabs={TABS.map((t) => ({ ...t, count: orders.filter(t.match).length }))} tab={tab} onChange={setTab} />
            <div className="flex items-center justify-end gap-2">
              <label className="flex w-64 items-center gap-[6.4px] rounded-full border-[0.8px] border-[#f0ece9] bg-white p-[9.6px] text-muted">
                <Icon icon={Search01Icon} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search order #, customer..."
                  aria-label="Search orders"
                  className="min-w-px flex-1 bg-transparent text-[10.4px] leading-normal text-ink outline-none placeholder:text-muted"
                />
              </label>
              <select aria-label="Filter orders by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-full border border-line bg-white p-[9.6px] text-[10.4px]">
                <option value="all">All statuses</option>
                {Object.keys(STATUS_STYLE).map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>
          <div className="flex min-h-px w-full flex-1 items-start gap-6">
            <div className="flex max-h-full min-w-px flex-1 flex-col gap-[4.8px] overflow-y-auto rounded-2xl bg-white p-2">
              {visible.length ? (
                visible.map((order, i) => (
                  <div key={order.id} className="flex flex-col gap-[4.8px]">
                    {i > 0 && <div className="h-[0.8px] w-full bg-line" />}
                    <OrderRow order={order} selected={order.id === selected?.id} onSelect={() => setSelectedId(order.id)} />
                  </div>
                ))
              ) : (
                <p className="p-6 text-center text-[11.2px] text-muted">No orders here right now.</p>
              )}
            </div>
            {selected && <OrderDetails order={selected} onAdvance={advance} />}
          </div>
        </div>
      </>}
    </div>
  )
}

// Staff menu (Figma "branch-menu" 68:4643), drawn at the same 0.8 scale as the order console.
const STAFF_CATEGORIES = [
  ['Croissants', CroissantIcon],
  ['Donuts', DonutIcon],
  ['Coffee', Coffee02Icon],
  ['Bread', Bread04Icon],
  ['Cakes', CakeIcon],
]
const STAFF_CROISSANTS = [
  ['Flaky Butter Croissant', 2.5, 'Golden, buttery layers laminated by hand every morning.', flakyButterCroissant],
  ['Almond Frangipane Croissant', 3.5, 'Twice-baked croissant filled with rich almond cream.', almondFrangipaneCroissant],
  ['Double Chocolate Croissant', 3, 'Croissant filled with 2x chocolate cream.', doubleChocolateCroissant],
  ['Matcha Cream Cruffin', 4.5, 'Croissant-muffin hybrid piped with whipped matcha cream.', matchaCreamCruffin],
  ['Savory Ham & Cheese Croissant', 4, 'Smoked ham and melted gruyère baked into flaky pastry.', savoryHamCheeseCroissant],
].map(([name, price, desc, image]) => ({ name, price, desc, image, prep: '10 min', category: 'Croissants' }))
const CATEGORY_DETAILS = {
  Donuts: ['5 min', 'Fried fresh and finished with a vanilla glaze.'],
  Coffee: ['3 min', 'Espresso drinks made with house-roasted beans.'],
  Bread: ['15 min', 'Slow-fermented loaf with a crisp, crackly crust.'],
  Cakes: ['20 min', 'Whole cake, decorated to order.'],
}
const STAFF_ITEMS = [
  ...STAFF_CROISSANTS,
  ...WEBSITE_PRODUCTS.filter((item) => CATEGORY_DETAILS[item.category]).map((item) => ({
    ...item, prep: CATEGORY_DETAILS[item.category][0], desc: CATEGORY_DETAILS[item.category][1],
  })),
]
const STOCK_TABS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'in', label: 'In Stock', match: (available) => available },
  { id: 'out', label: 'Out of Stock', match: (available) => !available },
]
const SORTS = {
  default: ['Filter', () => 0],
  'price-asc': ['Price: low to high', (a, b) => a.price - b.price],
  'price-desc': ['Price: high to low', (a, b) => b.price - a.price],
  name: ['Name: A–Z', (a, b) => a.name.localeCompare(b.name)],
}

function CountBadge({ active, children }) {
  return <span className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${active ? 'bg-primary text-white' : 'bg-line text-subtle'}`}>{children}</span>
}

function StaffMenu({ unavailable, setUnavailable }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Croissants')
  const [stock, setStock] = useState('all')
  const [sort, setSort] = useState('default')
  const isAvailable = (item) => !unavailable.includes(item.name)
  const stockTab = STOCK_TABS.find((t) => t.id === stock)
  const matches = STAFF_ITEMS.filter((item) => stockTab.match(isAvailable(item)) && item.name.toLowerCase().includes(query.trim().toLowerCase()))
  const visible = matches.filter((item) => item.category === category).sort(SORTS[sort][1])
  const [, CategoryGlyph] = STAFF_CATEGORIES.find(([name]) => name === category)
  const toggle = (item) => setUnavailable((names) => isAvailable(item) ? [...names, item.name] : names.filter((name) => name !== item.name))

  return (
    <section className="flex min-h-px w-full flex-1 flex-col gap-4 px-6 py-4" aria-label="Staff menu">
      <div className="flex w-full items-center justify-between">
        <Tabs tabs={STOCK_TABS.map((t) => ({ ...t, count: STAFF_ITEMS.filter((item) => t.match(isAvailable(item))).length }))} tab={stock} onChange={setStock} />
        <div className="flex items-center justify-end gap-2">
          <label className="flex w-64 items-center gap-[6.4px] rounded-full border-[0.8px] border-[#f0ece9] bg-white p-[9.6px] text-muted">
            <Icon icon={Search01Icon} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search items.." aria-label="Search menu items" className="min-w-px flex-1 bg-transparent text-[10.4px] leading-normal text-ink outline-none placeholder:text-muted" />
          </label>
          <label className="relative flex items-center gap-[6.4px] rounded-full border-[0.8px] border-[#f0ece9] bg-white py-[9.6px] pr-[9.6px] pl-[12.8px] text-[10.4px] leading-normal text-ink">
            <select aria-label="Sort menu items" value={sort} onChange={(e) => setSort(e.target.value)} className="cursor-pointer appearance-none bg-transparent pr-[22px] outline-none">
              {Object.entries(SORTS).map(([id, [label]]) => <option key={id} value={id}>{label}</option>)}
            </select>
            <Icon icon={ArrowDown01Icon} className="pointer-events-none absolute right-[9.6px]" />
          </label>
        </div>
      </div>
      <div className="flex min-h-px w-full flex-1 items-start gap-[19.2px]">
        <nav aria-label="Menu categories" className="flex w-[224px] shrink-0 flex-col gap-4 rounded-2xl bg-white px-2 py-4">
          <h2 className="px-2 text-[12.8px] leading-normal font-semibold text-ink">Categories</h2>
          <div className="flex flex-col gap-[3.2px]">
            {STAFF_CATEGORIES.map(([name, icon]) => {
              const active = name === category
              return (
                <button key={name} type="button" aria-pressed={active} onClick={() => setCategory(name)} className={`flex w-full items-center gap-[9.6px] rounded-[9.6px] py-[9.6px] pr-[9.6px] pl-[6.4px] text-left text-[11.2px] leading-normal ${active ? 'bg-primary-light font-semibold text-primary' : 'text-body hover:bg-surface'}`}>
                  <Icon icon={icon} size={19.2} className={active ? '' : 'text-muted'} />
                  <span className="min-w-px flex-1">{name}</span>
                  <CountBadge active={active}>{matches.filter((item) => item.category === name).length}</CountBadge>
                </button>
              )
            })}
          </div>
        </nav>
        <div className="flex max-h-full min-w-px flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-white px-[11.2px] py-[19.2px]">
          <div className="flex items-center gap-[11.2px] px-[9.6px]">
            <span className="flex size-[36.8px] shrink-0 items-center justify-center rounded-full border-[0.74px] border-line bg-surface text-primary"><Icon icon={CategoryGlyph} size={23.55} /></span>
            <div className="flex flex-col gap-[1.6px] leading-normal">
              <h2 className="text-[14.4px] font-semibold text-ink">{category}</h2>
              <p className="text-[9.6px] text-muted">{visible.length} {visible.length === 1 ? 'item' : 'items'} in this category</p>
            </div>
          </div>
          <div className="flex flex-col">
            {visible.map((item) => {
              const available = isAvailable(item)
              return (
                <div key={item.name} className="flex items-center gap-[12.8px] rounded-[9.6px] p-[12.8px] transition-colors hover:bg-primary-light focus-within:bg-primary-light">
                  <span className="size-[51.2px] shrink-0 overflow-hidden rounded-[6.4px] border-[0.8px] border-line bg-white">
                    <img src={item.image} alt="" className={`size-full object-cover ${available ? '' : 'opacity-60 grayscale'}`} />
                  </span>
                  <div className="flex min-w-px flex-1 flex-col gap-[3.2px] leading-normal">
                    <p className="truncate text-[11.2px] font-medium text-ink">{item.name}</p>
                    <p className="flex items-center gap-[3.2px] text-[9.6px] text-muted">
                      <Icon icon={Clock05Icon} size={12.8} />
                      <span className="shrink-0">{item.prep}</span>
                      <span aria-hidden="true" className="size-[1.6px] shrink-0 rounded-full bg-muted" />
                      <span className="min-w-px flex-1 truncate">{item.desc}</span>
                    </p>
                  </div>
                  <p className="w-16 shrink-0 text-[11.2px] leading-normal font-medium text-ink">{money(item.price)}</p>
                  <div className="flex w-24 shrink-0 items-center gap-[6.4px]">
                    <span className={`w-[50px] text-[9.6px] leading-normal font-medium ${available ? 'text-[#39ab00]' : 'text-subtle'}`}>{available ? 'In Stock' : 'Sold Out'}</span>
                    <span className="flex" style={{ zoom: 0.8 }}><ToggleSwitch checked={available} onChange={() => toggle(item)} ariaLabel={`${item.name} in stock`} /></span>
                  </div>
                </div>
              )
            })}
            {!visible.length && <p className="p-6 text-center text-[11.2px] text-muted">No items match. Try another search or tab.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
