import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardCircleIcon,
  MenuRestaurantIcon,
  Store03Icon,
  ShoppingBasket03Icon,
  UserGroup02Icon,
  MarketingIcon,
  AnalyticsUpIcon,
  Setting07Icon,
  ArrowRight02Icon,
  Store04Icon,
  PaintBoardIcon,
  DiscountIcon,
  CroissantIcon,
  ArrowLeft02Icon,
  SmartPhone01Icon,
} from '@hugeicons/core-free-icons'

import userAvatarImg from '../assets/dashboard/user-avatar.png'
import croissantImg from '../assets/dashboard/croissant.png'
import macchiatoImg from '../assets/dashboard/macchiato.png'
import almondCroissantImg from '../assets/products/almond-croissant.png'
import chocolateCroissantImg from '../assets/products/chocolate-croissant.png'
import { BranchesView } from './branches/BranchesView'
import { MenuView } from './menu/MenuView'
import { CustomersView } from './customers/CustomersView'
import { PromotionsView } from './promotions/PromotionsView'

const TIME_RANGES = ['Today', '7d', '30d', '6mo', '1y']

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: DashboardCircleIcon },
  { id: 'menu', label: 'Menu', icon: MenuRestaurantIcon },
  { id: 'branches', label: 'Branches', icon: Store03Icon },
  { id: 'orders', label: 'Orders', icon: ShoppingBasket03Icon },
  { id: 'customers', label: 'Customers', icon: UserGroup02Icon },
  { id: 'promo', label: 'Promo & Discounts', icon: MarketingIcon },
  { id: 'analytics', label: 'Analytics', icon: AnalyticsUpIcon },
  { id: 'settings', label: 'Settings', icon: Setting07Icon },
]

export function DashboardScreen({ state, onEdit, onStartOver }) {
  const [activeNav, setActiveNav] = useState('overview')
  const [activeTimeRange, setActiveTimeRange] = useState('7d')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const shopName = state.shop?.name?.trim() || 'Ross Bakers Co.'
  const shopTagline = state.shop?.tagline?.trim() || 'Freshly baked goods'
  const ownerName = state.shop?.name?.trim() || 'Ross Bakers'

  // If user entered a custom menu item during onboarding, feature it
  const userItemName = state.menu?.item?.name?.trim()
  const userItemPrice = state.menu?.item?.price ? `$${parseFloat(state.menu.item.price).toFixed(2)}` : null
  const userItemImage = state.menu?.item?.image

  const products = [
    ...(userItemName
      ? [
          {
            name: userItemName,
            price: userItemPrice || '$5.50',
            sold: 52,
            sales: '$286.00',
            image: userItemImage || croissantImg,
            status: 'In Stock',
            isUserItem: true,
          },
        ]
      : []),
    {
      name: 'Classic Butter Croissant',
      price: '$5.40',
      sold: 43,
      sales: '$345.80',
      image: croissantImg,
      status: 'In Stock',
    },
    {
      name: 'Almond Croissant',
      price: '$6.00',
      sold: 30,
      sales: '$180.00',
      image: almondCroissantImg,
      status: 'In Stock',
    },
    {
      name: 'Chocolate Croissant',
      price: '$6.50',
      sold: 25,
      sales: '$162.50',
      image: chocolateCroissantImg,
      status: 'In Stock',
    },
    {
      name: 'Ham and Cheese Croissant',
      price: '$7.00',
      sold: 20,
      sales: '$140.00',
      image: croissantImg,
      status: 'In Stock',
    },
    {
      name: 'Iced Caramel Macchiato',
      price: '$5.40',
      sold: 43,
      sales: '$345.80',
      image: macchiatoImg,
      status: 'In Stock',
    },
  ].slice(0, 5)

  return (
    <div className="brand-scope flex h-screen w-full overflow-hidden bg-[#f5f5f5] font-sans text-ink">
      {/* Sidebar */}
      <aside className="flex w-[230px] lg:w-[260px] min-w-[230px] lg:min-w-[260px] flex-col justify-between border-r border-[#f0ece9] bg-white px-3.5 lg:px-5 py-5 lg:py-8 shrink-0">
        <div className="flex flex-col gap-6 lg:gap-10">
          {/* Shop branding */}
          <div className="flex w-full items-center gap-2.5">
            <div className="flex size-10 lg:size-[46px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-on-brand shadow-sm">
              {state.shop?.logo ? (
                <img src={state.shop.logo} alt="" className="size-full object-contain p-1.5" />
              ) : (
                <HugeiconsIcon icon={CroissantIcon} size={28} color="currentColor" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-base font-semibold leading-tight text-ink" title={shopName}>
                {shopName}
              </p>
              <p className="truncate text-xs text-muted" title={shopTagline}>
                {shopTagline}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                    isActive
                      ? 'bg-brand-light text-brand font-medium'
                      : 'text-body hover:bg-[#f5f5f5] font-normal'
                  }`}
                >
                  <HugeiconsIcon
                    icon={Icon}
                    size={20}
                    color={isActive ? 'var(--brand)' : 'currentColor'}
                    className="shrink-0"
                  />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* User Capsule */}
        <div className="relative flex flex-col gap-4 border-t border-[#f0ece9] pt-5">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex w-full items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-[#f5f5f5]"
          >
            <div className="size-9 shrink-0 overflow-hidden rounded-full bg-[#f0ece9]">
              <img
                src={state.shop?.logo || userAvatarImg}
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <p className="truncate text-sm font-semibold text-ink">{ownerName}</p>
              <p className="text-xs text-brand font-normal">Owner account</p>
            </div>
          </button>

          {/* User Popover / Store controls */}
          {showUserMenu && (
            <div className="absolute bottom-[65px] left-0 w-full rounded-xl border border-[#e8e8e8] bg-white p-2 shadow-xl z-20">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false)
                  onEdit?.()
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink hover:bg-[#f5f5f5]"
              >
                <HugeiconsIcon icon={SmartPhone01Icon} size={16} />
                <span>Storefront Preview & Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false)
                  onStartOver?.()
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#f30000] hover:bg-[#fff0f0]"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
                <span>Start New Store</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
        {activeNav === 'menu' ? (
          <MenuView onboardingState={state} />
        ) : activeNav === 'branches' ? (
          <BranchesView onNavigateToOrders={() => setActiveNav('orders')} />
        ) : activeNav === 'customers' ? (
          <CustomersView />
        ) : activeNav === 'promo' ? (
          <PromotionsView />
        ) : activeNav === 'overview' ? (
          <div className="mx-auto flex max-w-[1360px] flex-col gap-7">
            {/* Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-[28px] font-semibold tracking-tight text-ink">Good morning</h1>
              <p className="text-sm text-muted">
                Here’s what is happening with your digital storefront today.
              </p>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center gap-1 rounded-[10px] border border-[#dcdcdc] bg-[#e8e8e8] p-1">
              {TIME_RANGES.map((range) => {
                const isSelected = activeTimeRange === range
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setActiveTimeRange(range)}
                    className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-ink shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]'
                        : 'text-body hover:text-ink'
                    }`}
                  >
                    {range}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {/* Stat 1: Gross Revenue */}
            <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <p className="text-sm font-medium text-muted">Gross Revenue</p>
              <div className="flex flex-col">
                <p className="text-[28px] font-semibold text-ink leading-tight">$1,247.50</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-[#effce8] px-1.5 py-0.5 text-xs font-medium text-[#39ab00]">
                    +18.5%
                  </span>
                  <span className="text-[11px] text-muted">Than last month</span>
                </div>
              </div>
            </div>

            {/* Stat 2: Orders & Avg Ticket */}
            <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <p className="text-sm font-medium text-muted">Orders & Avg Ticket</p>
              <div className="flex flex-col">
                <p className="text-[28px] font-semibold text-ink leading-tight">24</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-[#effce8] px-1.5 py-0.5 text-xs font-medium text-[#39ab00]">
                    +12%
                  </span>
                  <span className="text-[11px] text-muted">Than last month</span>
                </div>
              </div>
            </div>

            {/* Stat 3: Branch Fleet Health */}
            <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <p className="text-sm font-medium text-muted">Branch Fleet Health</p>
              <div className="flex flex-col">
                <p className="text-[28px] font-semibold text-ink leading-tight">4/4</p>
                <div className="mt-1 flex items-center">
                  <span className="rounded bg-[#effce8] px-1.5 py-0.5 text-xs font-medium text-[#39ab00]">
                    100% Operational
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 4: Fulfilment Velocity (Avg.) */}
            <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <p className="text-sm font-medium text-muted">Fulfilment Velocity (Avg.)</p>
              <div className="flex flex-col">
                <p className="text-[28px] font-semibold text-ink leading-tight">14.8m</p>
                <div className="mt-1 flex items-center">
                  <span className="rounded bg-[#effce8] px-1.5 py-0.5 text-xs font-medium text-[#39ab00]">
                    &lt;18m ahead
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 1: Bestsellers + Category Share */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_400px]">
            {/* Left: Product Velocity & Bestsellers Table */}
            <div className="flex flex-col gap-5 rounded-[20px] bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Product Velocity & Bestsellers</h2>
                <button
                  type="button"
                  onClick={() => setActiveNav('menu')}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-brand hover:opacity-85"
                >
                  <span>View Menu</span>
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} color="currentColor" />
                </button>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px]">
                  {/* Table Header */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#f0ece9] text-xs font-semibold text-[#848484]">
                    <span className="flex-1">Customer</span>
                    <span className="w-20 text-left">Price</span>
                    <span className="w-20 text-left">Units Sold</span>
                    <span className="w-20 text-left">Gross Sales</span>
                    <span className="w-[70px] text-center">Status</span>
                  </div>

                  {/* Table Rows */}
                  <div className="flex flex-col divide-y divide-[#f5f5f5]">
                    {products.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 py-2.5 text-[13px] text-ink">
                        <div className="flex flex-1 items-center gap-2.5 min-w-0 pr-2">
                          <img
                            src={p.image}
                            alt=""
                            className="size-11 shrink-0 rounded-lg border border-[#e8e8e8] object-cover"
                          />
                          <span className="truncate font-medium" title={p.name}>
                            {p.name}
                          </span>
                        </div>
                        <span className="w-20 font-medium">{p.price}</span>
                        <span className="w-20 font-medium">{p.sold}</span>
                        <span className="w-20 font-medium">{p.sales}</span>
                        <div className="flex w-[70px] justify-center">
                          <span className="rounded-full bg-[#effce8] px-2 py-0.5 text-[11px] font-semibold text-[#39ab00]">
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Category Share & Fulfillment Mix */}
            <div className="flex flex-col justify-between gap-6 rounded-[20px] bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <h2 className="text-lg font-semibold text-ink">Category Share & Fulfillment Mix</h2>

              {/* Category Stacked Bar */}
              <div className="flex flex-col gap-4">
                <div className="flex h-5 w-full gap-1 overflow-hidden rounded">
                  <div className="h-full rounded bg-brand" style={{ width: '38%' }} title="Croissants: 38%" />
                  <div className="h-full rounded bg-[#e0cfc2]" style={{ width: '24%' }} title="Cakes: 24%" />
                  <div className="h-full rounded bg-[#111111]" style={{ width: '18%' }} title="Coffee: 18%" />
                  <div className="h-full rounded bg-[#6a6a6a]" style={{ width: '12%' }} title="Bread: 12%" />
                  <div className="h-full rounded bg-[#a09895]" style={{ width: '8%' }} title="Pastries: 8%" />
                </div>

                {/* Categories Legend */}
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-[2px] bg-brand" />
                      <span className="text-muted">Croissants</span>
                    </div>
                    <span className="font-semibold text-ink">38%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-[2px] bg-[#e0cfc2]" />
                      <span className="text-muted">Cakes</span>
                    </div>
                    <span className="font-semibold text-ink">24%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-[2px] bg-[#111111]" />
                      <span className="text-muted">Coffee</span>
                    </div>
                    <span className="font-semibold text-ink">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-[2px] bg-[#6a6a6a]" />
                      <span className="text-muted">Bread</span>
                    </div>
                    <span className="font-semibold text-ink">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-[2px] bg-[#a09895]" />
                      <span className="text-muted">Pastries</span>
                    </div>
                    <span className="font-semibold text-ink">8%</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-[#f0ece9]" />

              {/* Fulfillment Stacked Bar */}
              <div className="flex flex-col gap-4">
                <div className="flex h-5 w-full gap-1 overflow-hidden rounded">
                  <div className="h-full rounded bg-[#5eb6d1]" style={{ width: '76%' }} title="Delivery: 76%" />
                  <div className="h-full rounded bg-[#ff75ba]" style={{ width: '24%' }} title="Pickup: 24%" />
                </div>

                {/* Fulfillment Legend */}
                <div className="flex items-center gap-7 text-[13px]">
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-[2px] bg-[#5eb6d1]" />
                      <span className="text-muted">Delivery</span>
                    </div>
                    <span className="font-semibold text-ink">76%</span>
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-[2px] bg-[#ff75ba]" />
                      <span className="text-muted">Pickup</span>
                    </div>
                    <span className="font-semibold text-ink">24%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 2: Operational Audit Timeline + Quick Access */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_400px]">
            {/* Left: Operational Audit Timeline */}
            <div className="flex flex-col gap-5 rounded-[20px] bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <h2 className="text-lg font-semibold text-ink">Operational Audit Timeline</h2>

              <div className="flex flex-col divide-y divide-[#f0ece9]">
                {/* Event 1 */}
                <div className="flex flex-col gap-1.5 py-3 first:pt-0">
                  <p className="text-sm text-ink leading-tight">
                    <span className="font-bold">Downtown Flagship</span> opened morning shift (7:00 AM)
                  </p>
                  <p className="text-xs text-muted">Today at 07:00 AM • Branch Downtown Flagship</p>
                </div>

                {/* Event 2 */}
                <div className="flex flex-col gap-1.5 py-3">
                  <p className="text-sm text-ink leading-tight">
                    Promo code <span className="font-bold">WELCOME10</span> redeemed across 4 orders
                  </p>
                  <p className="text-xs text-muted">18 minutes ago • Promo &amp; Discounts</p>
                </div>

                {/* Event 3 */}
                <div className="flex flex-col gap-1.5 py-3">
                  <p className="text-sm text-ink leading-tight">
                    Product <span className="font-bold">{userItemName || 'Pistachio Croissant'}</span> added to live storefront menu
                  </p>
                  <p className="text-xs text-muted">2 hours ago • Menu</p>
                </div>

                {/* Event 4 */}
                <div className="flex flex-col gap-1.5 py-3 last:pb-0">
                  <p className="text-sm text-ink leading-tight">
                    <span className="font-bold">West End Branch</span> enabled high-volume pickup surge threshold
                  </p>
                  <p className="text-xs text-muted">3 hours ago • Operations</p>
                </div>
              </div>
            </div>

            {/* Right: Quick Access */}
            <div className="flex flex-col justify-between gap-5 rounded-[20px] bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
              <h2 className="text-lg font-semibold text-ink">Quick Access</h2>

              <div className="grid grid-cols-2 gap-3">
                {/* Tile 1: Menu & Stock */}
                <button
                  type="button"
                  onClick={() => setActiveNav('menu')}
                  className="flex flex-col items-center gap-3.5 rounded-xl border border-[#dcdcdc] p-4 text-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] transition-all hover:border-brand hover:shadow-md cursor-pointer group"
                >
                  <div className="flex size-10 items-center justify-center rounded bg-brand-light text-brand group-hover:scale-105 transition-transform">
                    <HugeiconsIcon icon={MenuRestaurantIcon} size={20} color="var(--brand)" />
                  </div>
                  <span className="text-sm font-medium leading-snug text-ink">
                    Menu &amp; Stock Management
                  </span>
                </button>

                {/* Tile 2: Branch Management */}
                <button
                  type="button"
                  onClick={() => setActiveNav('branches')}
                  className="flex flex-col items-center gap-3.5 rounded-xl border border-[#dcdcdc] p-4 text-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] transition-all hover:border-[#e04f6e] hover:shadow-md cursor-pointer group"
                >
                  <div className="flex size-10 items-center justify-center rounded bg-[#fcecf0] text-[#e04f6e] group-hover:scale-105 transition-transform">
                    <HugeiconsIcon icon={Store04Icon} size={20} color="currentColor" />
                  </div>
                  <span className="text-sm font-medium leading-snug text-ink">
                    Branch Management
                  </span>
                </button>

                {/* Tile 3: Customize your Cafe */}
                <button
                  type="button"
                  onClick={onEdit}
                  title="Click to customize your cafe brand colors & settings"
                  className="flex flex-col items-center gap-3.5 rounded-xl border border-[#dcdcdc] p-4 text-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] transition-all hover:border-[#2b9fd9] hover:shadow-md cursor-pointer group"
                >
                  <div className="flex size-10 items-center justify-center rounded bg-[#e6f6ff] text-[#2b9fd9] group-hover:scale-105 transition-transform">
                    <HugeiconsIcon icon={PaintBoardIcon} size={20} color="currentColor" />
                  </div>
                  <span className="text-sm font-medium leading-snug text-ink">
                    Customize your Cafe
                  </span>
                </button>

                {/* Tile 4: Create Promotion / Offer */}
                <button
                  type="button"
                  onClick={() => setActiveNav('promo')}
                  className="flex flex-col items-center gap-3.5 rounded-xl border border-[#dcdcdc] p-4 text-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] transition-all hover:border-[#39ab00] hover:shadow-md cursor-pointer group"
                >
                  <div className="flex size-10 items-center justify-center rounded bg-[#effce8] text-[#39ab00] group-hover:scale-105 transition-transform">
                    <HugeiconsIcon icon={DiscountIcon} size={20} color="currentColor" />
                  </div>
                  <span className="text-sm font-medium leading-snug text-ink">
                    Create a promotion / offer
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-center gap-4 rounded-[20px] bg-white p-16 text-center shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-semibold capitalize text-ink">{activeNav}</h2>
          <p className="text-sm text-muted">This section is coming soon. You can explore Overview or Branches.</p>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setActiveNav('overview')}
              className="rounded-full bg-brand-light px-5 py-2.5 text-sm font-semibold text-brand cursor-pointer hover:opacity-90"
            >
              Go to Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('branches')}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white cursor-pointer hover:opacity-90"
            >
              Go to Branches
            </button>
          </div>
        </div>
      )}
      </main>
    </div>
  )
}
