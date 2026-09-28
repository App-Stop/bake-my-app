import { useState, useRef, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CroissantIcon,
  ArrowDown01Icon,
  CheckmarkCircle02Icon,
  ViewIcon,
  ViewOffIcon,
} from '@hugeicons/core-free-icons'
import { SettingsToggle } from './SettingsToggle'
import { EditBrandColorModal } from './EditBrandColorModal'

const SECTIONS = [
  { id: 'store-info', label: 'Store Information' },
  { id: 'business-hours', label: 'Business Hours' },
  { id: 'order-settings', label: 'Order Settings' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'account-security', label: 'Account & Security' },
]

const TAX_LABELS = ['VAT', 'Sales Tax', 'GST', 'Service Tax']

function readImage(file, maxSize = 512) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      if (file.type === 'image/svg+xml') return resolve(reader.result)
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function SettingsView({ state, actions }) {
  const [activeSection, setActiveSection] = useState('store-info')
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('Settings saved successfully!')
  const [showPassword, setShowPassword] = useState(false)

  // Local form drafts initialized from state
  const [shopDraft, setShopDraft] = useState({
    name: state.shop?.name || 'Ross Bakers Co.',
    tagline: state.shop?.tagline || 'Freshly baked goods',
    email: state.shop?.email || 'hello@rossbakers.co',
    address: state.shop?.address || '742 Evergreen Terrace, Springfield',
    phone: state.shop?.phone || '+1 555-321-8876',
    logo: state.shop?.logo || null,
  })

  const [brandColorDraft, setBrandColorDraft] = useState(state.brandColor || '#c15400')
  const [prevBrandColor, setPrevBrandColor] = useState(state.brandColor)

  if (prevBrandColor !== state.brandColor) {
    setPrevBrandColor(state.brandColor)
    setBrandColorDraft(state.brandColor || '#c15400')
  }

  const [businessHours, setBusinessHours] = useState(
    state.settings?.businessHours || [
      { day: 'Monday', from: '7:00 AM', to: '9:00 PM', open: true },
      { day: 'Tuesday', from: '7:00 AM', to: '9:00 PM', open: true },
      { day: 'Wednesday', from: '7:00 AM', to: '9:00 PM', open: true },
      { day: 'Thursday', from: '7:00 AM', to: '9:00 PM', open: true },
      { day: 'Friday', from: '7:00 AM', to: '9:00 PM', open: true },
      { day: 'Saturday', from: '8:00 AM', to: '9:00 PM', open: true },
      { day: 'Sunday', from: '--:--', to: '--:--', open: false },
    ],
  )

  const [orderSettings, setOrderSettings] = useState({
    acceptDelivery: state.settings?.orderSettings?.acceptDelivery ?? true,
    acceptPickup: state.settings?.orderSettings?.acceptPickup ?? true,
    estimatedDeliveryTime:
      state.settings?.orderSettings?.estimatedDeliveryTime ||
      state.delivery?.estimatedTime?.replace(/[^0-9]/g, '') ||
      '25',
    minOrderAmount:
      state.settings?.orderSettings?.minOrderAmount ||
      (state.delivery?.fee ? `$${state.delivery.fee}` : '$10.00'),
    deliveryRadius: state.settings?.orderSettings?.deliveryRadius || '5',
    taxRate: state.settings?.orderSettings?.taxRate || state.delivery?.taxRate || '2.5',
    taxLabel: state.settings?.orderSettings?.taxLabel || state.delivery?.taxLabel || 'VAT',
  })

  const [notifications, setNotifications] = useState({
    newOrders: state.settings?.notifications?.newOrders ?? true,
    statusUpdates: state.settings?.notifications?.statusUpdates ?? true,
    lowStock: state.settings?.notifications?.lowStock ?? true,
    dailySummary: state.settings?.notifications?.dailySummary ?? false,
    weeklyReport: state.settings?.notifications?.weeklyReport ?? true,
    customerReviews: state.settings?.notifications?.customerReviews ?? true,
  })

  const [security, setSecurity] = useState({
    loginEmail: state.settings?.security?.loginEmail || 'ross@rossbakers.co',
    password: state.settings?.security?.password || '••••••••••••••••',
    twoFactorEnabled: state.settings?.security?.twoFactorEnabled ?? false,
  })

  const logoInputRef = useRef(null)


  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec.id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const dataUrl = await readImage(file)
    setShopDraft((prev) => ({ ...prev, logo: dataUrl }))
    actions.updateShop({ logo: dataUrl })
    triggerToast('Bakery logo updated!')
  }

  const handleToggleDay = (idx) => {
    setBusinessHours((prev) =>
      prev.map((day, i) => {
        if (i !== idx) return day
        const willBeOpen = !day.open
        return {
          ...day,
          open: willBeOpen,
          from: willBeOpen ? (day.from === '--:--' ? '7:00 AM' : day.from) : '--:--',
          to: willBeOpen ? (day.to === '--:--' ? '9:00 PM' : day.to) : '--:--',
        }
      }),
    )
  }

  const handleTimeChange = (idx, field, value) => {
    setBusinessHours((prev) =>
      prev.map((day, i) => (i === idx ? { ...day, [field]: value } : day)),
    )
  }

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3200)
  }

  const handleSaveChanges = () => {
    actions.saveAllSettings({
      shop: shopDraft,
      brandColor: brandColorDraft,
      delivery: {
        allowPickup: orderSettings.acceptPickup,
        taxRate: orderSettings.taxRate,
        taxLabel: orderSettings.taxLabel,
        estimatedTime: `${orderSettings.estimatedDeliveryTime} mins`,
      },
      settings: {
        businessHours,
        orderSettings,
        notifications,
        security,
      },
    })
    triggerToast('Settings saved successfully!')
  }

  const handleSaveBrandColor = (newColor) => {
    setBrandColorDraft(newColor)
    actions.setBrandColor(newColor)
    actions.updateSettings({
      ...state.settings,
      brandColor: newColor,
    })
    triggerToast('Brand color updated successfully!')
  }

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-6 lg:gap-8 pb-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-ink text-white px-5 py-3 shadow-xl animate-fadeIn">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-[#39ab00]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-ink">
            Store Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Configure your store information, business hours, order limits, and notifications.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveChanges}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-on-brand shadow-sm transition-all hover:brightness-105 active:scale-95 cursor-pointer"
        >
          Save Changes
        </button>
      </div>

      {/* Settings Split Layout */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
        {/* Left Side Navigation */}
        <aside className="w-full lg:w-[240px] shrink-0 lg:sticky lg:top-4 bg-white rounded-[20px] p-2.5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 overflow-hidden">
          <nav className="flex flex-row lg:flex-col gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-1 lg:pb-0">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm transition-all text-left whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-brand-light text-brand font-semibold shadow-xs'
                      : 'text-body font-medium hover:bg-[#f5f5f5]'
                  }`}
                >
                  {sec.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Right Side Content Cards */}
        <div className="flex-1 flex flex-col gap-5 lg:gap-6 w-full min-w-0">
          {/* Card 1: Store Information */}
          <section
            id="store-info"
            className="rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 flex flex-col gap-6 scroll-mt-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink">Store Information</h2>
              <p className="text-[13px] text-muted">
                Update your public store details and contact credentials.
              </p>
            </div>

            {/* Logo + Fields */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo Area */}
              <div className="flex flex-col gap-2.5 items-start w-[140px] shrink-0">
                <span className="text-base font-medium text-ink">Bakery Logo</span>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-[100px] rounded-xl bg-[#f5f5f5] flex items-center justify-center overflow-hidden border border-[#e8e8e8]">
                    {shopDraft.logo ? (
                      <img
                        src={shopDraft.logo}
                        alt="Bakery logo"
                        className="size-full object-contain p-2"
                      />
                    ) : (
                      <div className="size-full bg-brand flex items-center justify-center text-on-brand">
                        <HugeiconsIcon icon={CroissantIcon} size={40} />
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="text-xs font-semibold text-brand hover:opacity-85 transition-opacity cursor-pointer"
                  >
                    Change Logo
                  </button>
                </div>
              </div>

              {/* 2x2 Grid of Inputs */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                  <span className="text-xs font-medium text-muted">Bakery Name</span>
                  <input
                    type="text"
                    value={shopDraft.name}
                    onChange={(e) => setShopDraft({ ...shopDraft, name: e.target.value })}
                    className="w-full bg-transparent text-base font-normal text-ink outline-none"
                    placeholder="Ross Bakers Co."
                  />
                </label>

                <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                  <span className="text-xs font-medium text-muted">Email Address</span>
                  <input
                    type="email"
                    value={shopDraft.email}
                    onChange={(e) => setShopDraft({ ...shopDraft, email: e.target.value })}
                    className="w-full bg-transparent text-base font-normal text-ink outline-none"
                    placeholder="hello@rossbakers.co"
                  />
                </label>

                <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                  <span className="text-xs font-medium text-muted">Physical Address</span>
                  <input
                    type="text"
                    value={shopDraft.address}
                    onChange={(e) => setShopDraft({ ...shopDraft, address: e.target.value })}
                    className="w-full bg-transparent text-base font-normal text-ink outline-none"
                    placeholder="742 Evergreen Terrace, Springfield"
                  />
                </label>

                <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                  <span className="text-xs font-medium text-muted">Phone Number</span>
                  <input
                    type="tel"
                    value={shopDraft.phone}
                    onChange={(e) => setShopDraft({ ...shopDraft, phone: e.target.value })}
                    className="w-full bg-transparent text-base font-normal text-ink outline-none"
                    placeholder="+1 555-321-8876"
                  />
                </label>
              </div>
            </div>

            {/* Brand Color Subsection */}
            <div className="flex flex-col gap-2.5 pt-2">
              <span className="text-base font-medium text-ink">Brand color</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Current brand color swatch"
                  onClick={() => setIsColorModalOpen(true)}
                  style={{ backgroundColor: brandColorDraft }}
                  className="size-[68px] shrink-0 rounded-[10px] border-2 border-ink shadow-xs cursor-pointer hover:scale-105 transition-transform"
                />
                <div className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 w-[180px] sm:w-[200px] shadow-xs">
                  <span className="text-xs font-medium text-muted">Custom Color</span>
                  <span className="text-base font-normal text-ink uppercase">
                    {brandColorDraft.replace('#', '')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsColorModalOpen(true)}
                  className="rounded-full bg-[#f5f5f5] px-4 py-2.5 text-sm font-medium text-ink hover:bg-[#ebebeb] transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          </section>

          {/* Card 2: Business Hours */}
          <section
            id="business-hours"
            className="rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 flex flex-col gap-6 scroll-mt-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink">Business Hours</h2>
              <p className="text-[13px] text-muted">
                Define times when customers can place delivery and pickup orders.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-[#f0ece9]">
              {businessHours.map((item, idx) => (
                <div
                  key={item.day}
                  className="flex flex-wrap sm:flex-nowrap items-center justify-between py-3.5 gap-3"
                >
                  <span className="w-[110px] sm:w-[120px] text-sm font-medium text-ink shrink-0">
                    {item.day}
                  </span>

                  {/* Times */}
                  <div className="flex items-center gap-2">
                    {item.open ? (
                      <>
                        <input
                          type="text"
                          value={item.from}
                          onChange={(e) => handleTimeChange(idx, 'from', e.target.value)}
                          className="w-[84px] sm:w-[92px] rounded-md border border-[#f0ece9] bg-white px-2.5 py-1.5 text-center text-[13px] font-normal text-ink shadow-xs outline-none focus:border-brand"
                        />
                        <span className="text-[13px] text-[#777]">to</span>
                        <input
                          type="text"
                          value={item.to}
                          onChange={(e) => handleTimeChange(idx, 'to', e.target.value)}
                          className="w-[84px] sm:w-[92px] rounded-md border border-[#f0ece9] bg-white px-2.5 py-1.5 text-center text-[13px] font-normal text-ink shadow-xs outline-none focus:border-brand"
                        />
                      </>
                    ) : (
                      <div className="w-[84px] sm:w-[92px] rounded-md border border-[#f0ece9] bg-[#f5f5f5] px-2.5 py-1.5 text-center text-[13px] text-[#848484]">
                        --:--
                      </div>
                    )}
                  </div>

                  {/* Toggle and Status */}
                  <div className="flex items-center justify-end gap-3 w-[100px] shrink-0">
                    <span
                      className={`text-[13px] font-medium ${
                        item.open ? 'text-[#39ab00]' : 'text-[#6a6a6a]'
                      }`}
                    >
                      {item.open ? 'Open' : 'Closed'}
                    </span>
                    <SettingsToggle
                      checked={item.open}
                      onChange={() => handleToggleDay(idx)}
                      label={`Toggle ${item.day} open or closed`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Card 3: Order Settings */}
          <section
            id="order-settings"
            className="rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 flex flex-col gap-6 scroll-mt-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink">Order Settings</h2>
              <p className="text-[13px] text-muted">
                Configure delivery capabilities, kitchen prep estimates, and order throttling.
              </p>
            </div>

            {/* Delivery Toggles */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink">Accept delivery orders</span>
                  <span className="text-xs text-muted">
                    Allow customers to request direct delivery.
                  </span>
                </div>
                <SettingsToggle
                  checked={orderSettings.acceptDelivery}
                  onChange={(val) => setOrderSettings({ ...orderSettings, acceptDelivery: val })}
                  label="Accept delivery orders"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink">Accept pickup orders</span>
                  <span className="text-xs text-muted">
                    Allow quick carryout &amp; store pickups.
                  </span>
                </div>
                <SettingsToggle
                  checked={orderSettings.acceptPickup}
                  onChange={(val) => setOrderSettings({ ...orderSettings, acceptPickup: val })}
                  label="Accept pickup orders"
                />
              </div>
            </div>

            <div className="h-px w-full bg-[#f0ece9]" />

            {/* 3 Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                <span className="text-xs font-medium text-muted">
                  Estimated delivery time for 5 miles
                </span>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={orderSettings.estimatedDeliveryTime}
                    onChange={(e) =>
                      setOrderSettings({ ...orderSettings, estimatedDeliveryTime: e.target.value })
                    }
                    className="w-full bg-transparent text-base font-normal text-ink outline-none"
                    placeholder="25"
                  />
                  <span className="text-xs text-muted font-medium ml-1">mins</span>
                </div>
              </label>

              <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                <span className="text-xs font-medium text-muted">Minimum Order Amount</span>
                <input
                  type="text"
                  value={orderSettings.minOrderAmount}
                  onChange={(e) =>
                    setOrderSettings({ ...orderSettings, minOrderAmount: e.target.value })
                  }
                  className="w-full bg-transparent text-base font-normal text-ink outline-none"
                  placeholder="$10.00"
                />
              </label>

              <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                <span className="text-xs font-medium text-muted">Delivery Radius (miles)</span>
                <input
                  type="text"
                  value={orderSettings.deliveryRadius}
                  onChange={(e) =>
                    setOrderSettings({ ...orderSettings, deliveryRadius: e.target.value })
                  }
                  className="w-full bg-transparent text-base font-normal text-ink outline-none"
                  placeholder="5"
                />
              </label>
            </div>

            <div className="h-px w-full bg-[#f0ece9]" />

            {/* 2 Fields Row: Tax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 transition-colors focus-within:border-brand shadow-xs">
                <span className="text-xs font-medium text-muted">Tax Rate (%)</span>
                <input
                  type="text"
                  value={orderSettings.taxRate}
                  onChange={(e) =>
                    setOrderSettings({ ...orderSettings, taxRate: e.target.value })
                  }
                  className="w-full bg-transparent text-base font-normal text-ink outline-none"
                  placeholder="2.5"
                />
              </label>

              <div className="relative flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 pt-2.5 pb-3 shadow-xs">
                <label htmlFor="tax-label-select" className="text-xs font-medium text-muted">
                  Tax Label
                </label>
                <select
                  id="tax-label-select"
                  value={orderSettings.taxLabel}
                  onChange={(e) =>
                    setOrderSettings({ ...orderSettings, taxLabel: e.target.value })
                  }
                  className="w-full appearance-none bg-transparent text-base font-normal text-ink outline-none cursor-pointer pr-6"
                >
                  {TAX_LABELS.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
                />
              </div>
            </div>
          </section>

          {/* Card 4: Notification Preferences */}
          <section
            id="notifications"
            className="rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 flex flex-col gap-6 scroll-mt-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink">Notification Preferences</h2>
              <p className="text-[13px] text-muted">
                Control how and when you receive sound alerts and marketing digests.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-[#f0ece9]">
              <div className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-ink">New order alerts</span>
                  <span className="text-xs text-muted">
                    Trigger high-priority chime upon incoming baker orders.
                  </span>
                </div>
                <SettingsToggle
                  checked={notifications.newOrders}
                  onChange={(val) => setNotifications({ ...notifications, newOrders: val })}
                  label="New order alerts"
                />
              </div>

              <div className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-ink">Order status updates</span>
                  <span className="text-xs text-muted">
                    Notify staff on prep state transitions.
                  </span>
                </div>
                <SettingsToggle
                  checked={notifications.statusUpdates}
                  onChange={(val) => setNotifications({ ...notifications, statusUpdates: val })}
                  label="Order status updates"
                />
              </div>

              <div className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-ink">Low stock warnings</span>
                  <span className="text-xs text-muted">
                    Receive alerts when main catalog items reach crucial thresholds.
                  </span>
                </div>
                <SettingsToggle
                  checked={notifications.lowStock}
                  onChange={(val) => setNotifications({ ...notifications, lowStock: val })}
                  label="Low stock warnings"
                />
              </div>

              <div className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-ink">Daily sales summary</span>
                  <span className="text-xs text-muted">
                    Deliver end-of-day analytics reports to owner email.
                  </span>
                </div>
                <SettingsToggle
                  checked={notifications.dailySummary}
                  onChange={(val) => setNotifications({ ...notifications, dailySummary: val })}
                  label="Daily sales summary"
                />
              </div>

              <div className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-ink">Weekly analytics report</span>
                  <span className="text-xs text-muted">
                    Receive comprehensive weekly customer performance reviews.
                  </span>
                </div>
                <SettingsToggle
                  checked={notifications.weeklyReport}
                  onChange={(val) => setNotifications({ ...notifications, weeklyReport: val })}
                  label="Weekly analytics report"
                />
              </div>

              <div className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-ink">Customer reviews</span>
                  <span className="text-xs text-muted">
                    Get notified when high-value loyalty customers post store feedback.
                  </span>
                </div>
                <SettingsToggle
                  checked={notifications.customerReviews}
                  onChange={(val) => setNotifications({ ...notifications, customerReviews: val })}
                  label="Customer reviews"
                />
              </div>
            </div>
          </section>

          {/* Card 5: Account & Security */}
          <section
            id="account-security"
            className="rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 flex flex-col gap-6 scroll-mt-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink">Account &amp; Security</h2>
              <p className="text-[13px] text-muted">
                Secure your owner dashboard login parameters and active sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-[#f5f5f5] px-3.5 pt-2.5 pb-3 shadow-xs">
                <span className="text-xs font-medium text-muted">Login Email</span>
                <input
                  type="email"
                  value={security.loginEmail}
                  onChange={(e) => setSecurity({ ...security, loginEmail: e.target.value })}
                  className="w-full bg-transparent text-base font-normal text-ink outline-none"
                  placeholder="ross@rossbakers.co"
                />
              </label>

              <div className="relative flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-[#f5f5f5] px-3.5 pt-2.5 pb-3 shadow-xs">
                <span className="text-xs font-medium text-muted">Password</span>
                <div className="flex items-center justify-between pr-8">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={security.password}
                    onChange={(e) => setSecurity({ ...security, password: e.target.value })}
                    className="w-full bg-transparent text-base font-normal text-ink outline-none tracking-widest font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f0ece9] gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-ink">Two-Factor Authentication</span>
                <span className="text-xs text-muted">
                  Require verification code during logins for maximum account safety.
                </span>
              </div>
              <SettingsToggle
                checked={security.twoFactorEnabled}
                onChange={(val) => setSecurity({ ...security, twoFactorEnabled: val })}
                label="Two-factor authentication"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Edit Brand Color Modal */}
      <EditBrandColorModal
        isOpen={isColorModalOpen}
        initialColor={brandColorDraft}
        shop={shopDraft}
        state={state}
        onSave={handleSaveBrandColor}
        onClose={() => setIsColorModalOpen(false)}
      />
    </div>
  )
}
