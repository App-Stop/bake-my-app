import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDown01Icon,
  Search01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'
import { INITIAL_ORDERS } from './mockOrders'
import { OrderDetailsDrawer } from './OrderDetailsDrawer'

const TIME_RANGES = ['Today', '7d', '30d', '6mo', '1y']

const STATUS_OPTIONS = ['All Statuses', 'Preparing', 'Ready', 'En Route', 'Delivered', 'Cancelled']
const BRANCH_OPTIONS = ['All Branches', 'Downtown Main Branch', 'West End Branch']

function ScooterIcon({ className = 'size-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 15h6.5l3.5-7h3" />
      <path d="M13.5 9l-2 6" />
      <path d="M19 6h-3" />
    </svg>
  )
}

function PackagingIcon({ className = 'size-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export function OrdersView() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [activeTab, setActiveTab] = useState('Active') // 'Active' | 'Completed' | 'Cancelled' | 'All Orders'
  const [selectedOrderId, setSelectedOrderId] = useState('#2493')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTimeRange, setActiveTimeRange] = useState('7d')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [branchFilter, setBranchFilter] = useState('All Branches')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const itemsPerPage = 8

  const showNotification = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3200)
  }

  // Status transitions
  const handleUpdateOrderStatus = (orderId, nextStatus) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const updatedTimeline = { ...o.timeline }
        if (nextStatus === 'Ready') updatedTimeline.ready = nowStr
        if (nextStatus === 'En Route') updatedTimeline.dispatch = nowStr
        if (nextStatus === 'Delivered') updatedTimeline.delivered = nowStr

        return {
          ...o,
          status: nextStatus,
          timeline: updatedTimeline,
        }
      }),
    )

    if (nextStatus === 'Ready') {
      showNotification(`Order ${orderId} marked as Ready!`)
    } else if (nextStatus === 'En Route') {
      showNotification(`Order ${orderId} dispatched for delivery!`)
    } else if (nextStatus === 'Delivered') {
      showNotification(`Order ${orderId} marked as Delivered!`)
    }
  }

  // Counts for tabs
  const activeCount = useMemo(
    () => orders.filter((o) => ['Preparing', 'Ready', 'En Route'].includes(o.status)).length,
    [orders],
  )
  const completedCount = useMemo(
    () => orders.filter((o) => o.status === 'Delivered').length,
    [orders],
  )
  const cancelledCount = useMemo(
    () => orders.filter((o) => o.status === 'Cancelled').length,
    [orders],
  )
  const allCount = orders.length

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === 'Active' && !['Preparing', 'Ready', 'En Route'].includes(order.status)) {
        return false
      }
      if (activeTab === 'Completed' && order.status !== 'Delivered') {
        return false
      }
      if (activeTab === 'Cancelled' && order.status !== 'Cancelled') {
        return false
      }

      // Status dropdown filter
      if (statusFilter !== 'All Statuses' && order.status !== statusFilter) {
        return false
      }

      // Branch filter
      if (branchFilter !== 'All Branches' && order.branch !== branchFilter) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = order.id.toLowerCase().includes(q)
        const matchCust = order.customer.toLowerCase().includes(q)
        const matchItems = order.itemsSummary.toLowerCase().includes(q)
        const matchPhone = order.phone?.toLowerCase().includes(q)
        if (!matchId && !matchCust && !matchItems && !matchPhone) return false
      }

      return true
    })
  }, [orders, activeTab, statusFilter, branchFilter, searchQuery])

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(start, start + itemsPerPage)
  }, [filteredOrders, currentPage])

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || orders[0],
    [orders, selectedOrderId],
  )

  const handleRowClick = (order) => {
    setSelectedOrderId(order.id)
    setIsDrawerOpen(true)
  }

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-7 pb-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-ink text-white px-5 py-3 shadow-xl animate-fadeIn">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-[#39ab00]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-ink">
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Live ticket stream, processing and delivery timeline manager.
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
                className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60">
          <p className="text-sm font-medium text-muted">Total Revenue</p>
          <div className="flex items-center justify-between">
            <p className="text-[28px] font-semibold text-ink leading-tight">$1,247.50</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60">
          <p className="text-sm font-medium text-muted">Order per Branch</p>
          <div className="flex items-center justify-between">
            <p className="text-[28px] font-semibold text-ink leading-tight">14</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-medium text-muted">Most ordered branch</p>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-ink leading-snug">
              Downtown Main Branch
            </p>
          </div>
        </div>
      </div>

      {/* Order Tabs & Controls Bar */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center border-b border-[#dcdcdc] overflow-x-auto no-scrollbar gap-1 sm:gap-2">
            {[
              { id: 'Active', count: activeCount },
              { id: 'Completed', count: completedCount },
              { id: 'Cancelled', count: cancelledCount },
              { id: 'All Orders', count: allCount },
            ].map(({ id, count }) => {
              const isSelected = activeTab === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveTab(id)
                    setCurrentPage(1)
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] ${
                    isSelected
                      ? 'border-brand text-brand font-semibold'
                      : 'border-transparent text-muted font-medium hover:text-ink'
                  }`}
                >
                  <span>{id}</span>
                  <span
                    className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                      isSelected
                        ? 'bg-brand text-on-brand'
                        : 'bg-[#e8e8e8] text-[#848484]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right Filter Dropdowns & Search */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-end min-w-[280px]">
            {/* Status Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="appearance-none rounded-full border border-[#f0ece9] bg-white pl-4 pr-9 py-2.5 text-[13px] text-ink shadow-xs outline-none cursor-pointer hover:border-[#dcdcdc] transition-colors"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'All Statuses' ? 'Status' : opt}
                  </option>
                ))}
              </select>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
              />
            </div>

            {/* Branch Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by branch"
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="appearance-none rounded-full border border-[#f0ece9] bg-white pl-4 pr-9 py-2.5 text-[13px] text-ink shadow-xs outline-none cursor-pointer hover:border-[#dcdcdc] transition-colors"
              >
                {BRANCH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
              />
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 rounded-full border border-[#f0ece9] bg-white px-3.5 py-2 text-[13px] text-muted shadow-xs flex-1 max-w-[260px] focus-within:border-brand">
              <HugeiconsIcon icon={Search01Icon} size={16} className="text-muted shrink-0" />
              <input
                type="text"
                placeholder="Search order #, customer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-transparent text-ink placeholder:text-[#848484] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Orders Stream Table Card */}
        <div className="rounded-[20px] bg-white px-3 sm:px-4 py-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/60 flex flex-col gap-4">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[940px]">
              {/* Table Header */}
              <div className="flex items-center px-3 pb-3 text-xs font-semibold text-[#848484] border-b border-[#f0ece9]">
                <span className="w-[75px] shrink-0">Order</span>
                <span className="w-[140px] shrink-0">Customer</span>
                <span className="flex-1 min-w-[200px] pr-2">Items</span>
                <span className="w-[110px] shrink-0">Type</span>
                <span className="w-[125px] shrink-0">Date &amp; Time</span>
                <span className="w-[85px] shrink-0">Total</span>
                <span className="w-[75px] shrink-0">Payment</span>
                <span className="w-[85px] shrink-0">Status</span>
                <span className="w-[125px] shrink-0 text-center">Action</span>
              </div>

              {/* Table Body */}
              <div className="flex flex-col divide-y divide-[#f5f5f5]">
                {paginatedOrders.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted">
                    No orders found matching the current filters.
                  </div>
                ) : (
                  paginatedOrders.map((order) => {
                    const isSelected = selectedOrderId === order.id && isDrawerOpen
                    return (
                      <div
                        key={order.id}
                        onClick={() => handleRowClick(order)}
                        className={`group relative flex items-center px-3 py-3.5 text-[13px] text-ink transition-colors cursor-pointer hover:bg-[#faf8f7] ${
                          isSelected ? 'bg-[#fdf9f6]' : ''
                        }`}
                      >
                        {/* Selected vertical indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[26px] w-1 rounded-r bg-brand" />
                        )}

                        {/* Order ID */}
                        <span className="w-[75px] font-medium text-ink shrink-0">
                          {order.id}
                        </span>

                        {/* Customer */}
                        <span className="w-[140px] font-medium text-ink truncate pr-2 shrink-0">
                          {order.customer}
                        </span>

                        {/* Items */}
                        <span
                          className="flex-1 min-w-[200px] text-muted truncate pr-3"
                          title={order.itemsSummary}
                        >
                          {order.itemsSummary}
                        </span>

                        {/* Type: Delivery or Pickup */}
                        <div className="w-[110px] flex items-center gap-1.5 shrink-0">
                          {order.type === 'Delivery' ? (
                            <>
                              <ScooterIcon className="size-4 text-ink" />
                              <span className="font-medium text-ink">Delivery</span>
                            </>
                          ) : (
                            <>
                              <PackagingIcon className="size-4 text-ink" />
                              <span className="font-medium text-ink">Pickup</span>
                            </>
                          )}
                        </div>

                        {/* Date & Time */}
                        <span className="w-[125px] text-muted text-xs shrink-0">
                          {order.date}
                        </span>

                        {/* Total */}
                        <span className="w-[85px] font-medium text-ink shrink-0">
                          ${order.total.toFixed(2)}
                        </span>

                        {/* Payment */}
                        <span className="w-[75px] font-medium text-ink shrink-0">
                          {order.payment}
                        </span>

                        {/* Status Badge */}
                        <div className="w-[85px] shrink-0">
                          {order.status === 'Preparing' && (
                            <span className="inline-block rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[11px] font-semibold text-[#777]">
                              Preparing
                            </span>
                          )}
                          {order.status === 'Ready' && (
                            <span className="inline-block rounded-full bg-[#fdf6ee] px-2.5 py-1 text-[11px] font-semibold text-brand">
                              Ready
                            </span>
                          )}
                          {order.status === 'En Route' && (
                            <span className="inline-block rounded-full bg-[#e6f6ff] px-2.5 py-1 text-[11px] font-semibold text-[#0095ff]">
                              En Route
                            </span>
                          )}
                          {order.status === 'Delivered' && (
                            <span className="inline-block rounded-full bg-[#effce8] px-2.5 py-1 text-[11px] font-semibold text-[#39ab00]">
                              Delivered
                            </span>
                          )}
                          {order.status === 'Cancelled' && (
                            <span className="inline-block rounded-full bg-[#fff0f0] px-2.5 py-1 text-[11px] font-semibold text-[#f30000]">
                              Cancelled
                            </span>
                          )}
                        </div>

                        {/* Action Button */}
                        <div
                          className="w-[125px] flex items-center justify-center shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {order.status === 'Preparing' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'Ready')}
                              className="rounded-full bg-brand px-3.5 py-1.5 text-[11px] font-semibold text-on-brand shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                            >
                              Mark as Ready
                            </button>
                          )}

                          {order.status === 'Ready' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  order.type === 'Delivery' ? 'En Route' : 'Delivered',
                                )
                              }
                              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
                                order.type === 'Delivery' ? 'bg-[#0095ff]' : 'bg-[#39ab00]'
                              }`}
                            >
                              {order.type === 'Delivery' ? 'Dispatch' : 'Received'}
                            </button>
                          )}

                          {order.status === 'En Route' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                              className="rounded-full bg-[#39ab00] px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                            >
                              Delivered
                            </button>
                          )}

                          {order.status === 'Delivered' && (
                            <span className="text-[11px] font-medium text-muted">
                              Completed
                            </span>
                          )}

                          {order.status === 'Cancelled' && (
                            <span className="text-[11px] font-medium text-[#f30000]">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <span className="text-muted">
              Showing {filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
              {filteredOrders.length} {activeTab.toLowerCase()} orders
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-[#e8e8e8] bg-white px-3 py-1.5 font-semibold text-ink shadow-xs transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-[#e8e8e8] bg-white px-3 py-1.5 font-semibold text-ink shadow-xs transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  )
}
