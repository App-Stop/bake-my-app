import { useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, Cancel01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'

export function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !order) return null

  const isDelivery = order.type === 'Delivery'

  const handleNextAction = () => {
    if (order.status === 'Preparing') {
      onUpdateStatus(order.id, 'Ready')
    } else if (order.status === 'Ready') {
      if (isDelivery) {
        onUpdateStatus(order.id, 'En Route')
      } else {
        onUpdateStatus(order.id, 'Delivered')
      }
    } else if (order.status === 'En Route') {
      onUpdateStatus(order.id, 'Delivered')
    }
  }

  // Timeline step statuses
  const isPreparingDone = ['Ready', 'En Route', 'Delivered'].includes(order.status)
  const isReadyDone = ['Ready', 'En Route', 'Delivered'].includes(order.status)
  const isDispatchDone = ['En Route', 'Delivered'].includes(order.status)
  const isDeliveredDone = order.status === 'Delivered'
  const steps = [
    { label: 'Received', done: true, time: order.timeline?.received || order.timeReceived },
    { label: 'Preparing', done: isPreparingDone, time: order.timeline?.preparing || '10:13 AM' },
    { label: 'Ready', done: isReadyDone, time: order.timeline?.ready || '10:21 AM' },
    ...(isDelivery ? [{ label: 'Dispatch', done: isDispatchDone, time: order.timeline?.dispatch || '10:22 AM' }] : []),
    { label: isDelivery ? 'Delivered' : 'Collected', done: isDeliveredDone, time: order.timeline?.delivered || '10:52 AM' },
  ]
  // Preparing has started when the ticket arrives; later steps are current once the previous one is done.
  const currentIndex = order.status === 'Cancelled' ? -1 : steps.findIndex((step) => !step.done)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        className="fixed top-2 bottom-2 right-2 sm:top-4 sm:bottom-4 sm:right-4 z-50 flex w-[calc(100%-16px)] sm:w-[420px] flex-col justify-between rounded-[20px] bg-white p-5 sm:p-6 shadow-[0px_0px_50px_rgba(0,0,0,0.2)] border border-[#f0ece9] overflow-hidden animate-slideInRight max-sm:inset-0 max-sm:w-full max-sm:justify-start max-sm:overflow-y-auto max-sm:rounded-none max-sm:border-0 max-sm:bg-[#f5f5f5] max-sm:p-0 max-sm:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center gap-3 px-4 pt-3 pb-6 sm:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to orders"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-ink"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} />
          </button>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold leading-tight text-ink">Order {order.id}</h2>
            <p className="text-xs text-muted">Received at {order.timeReceived || '10:14 AM'}</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between max-sm:mx-4 max-sm:mb-6 max-sm:flex-none max-sm:rounded-[20px] max-sm:bg-white max-sm:p-4">
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 max-sm:flex-none max-sm:overflow-visible max-sm:pr-0 max-sm:gap-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-[#f0ece9] max-sm:hidden">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-semibold text-ink leading-tight">
                Order {order.id}
              </h2>
              <p className="text-xs text-muted">
                Received at {order.timeReceived || '10:14 AM'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="flex size-8 items-center justify-center rounded-full bg-[#f5f5f5] text-ink hover:bg-[#e8e8e8] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </div>

          {/* Delivery / Pickup Details Card */}
          <div className="flex flex-col gap-2 rounded-xl bg-[#f5f5f5] p-4 text-[13px] leading-normal max-sm:gap-3">
            <span className="font-semibold text-ink">
              {isDelivery ? 'Delivery Details' : 'Pickup Details'}
            </span>
            <div className="flex flex-col gap-1 max-sm:gap-2">
              <span className="font-semibold text-ink text-sm max-sm:text-[15px]">{order.customer}</span>
              <span className="text-muted">{order.phone}</span>
              {isDelivery && <span className="text-muted">{order.address}</span>}
              <span className="text-xs text-muted/80 mt-0.5 max-sm:hidden">Branch: {order.branch}</span>
            </div>
          </div>

          {/* Items Section */}
          <div className="flex flex-col gap-2.5 text-[13px]">
            <span className="font-semibold text-muted">Items</span>
            <div className="flex flex-col gap-2 text-ink max-sm:gap-3 max-sm:text-sm">
              {order.items?.map((it, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2">
                  <span className="font-normal">
                    {it.qty}x {it.name}
                  </span>
                  <span className="font-medium shrink-0">
                    ${(it.total || it.price * it.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-[#f0ece9]" />

          {/* Breakdown / Total */}
          <div className="flex flex-col gap-2 text-[13px] max-sm:gap-3 max-sm:text-sm">
            <div className="flex items-center justify-between text-muted">
              <span>Subtotal</span>
              <span className="text-ink font-normal">${order.subtotal?.toFixed(2) || '18.50'}</span>
            </div>
            <div className="flex items-center justify-between text-muted">
              <span>Delivery Fee</span>
              <span className="text-ink font-normal">
                ${order.deliveryFee?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex items-center justify-between text-muted">
              <span>Tax</span>
              <span className="text-ink font-normal">${order.tax?.toFixed(2) || '1.50'}</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm font-semibold text-ink">
              <span>Total</span>
              <span className="text-brand text-base">
                ${order.total?.toFixed(2) || '22.50'} ({order.payment})
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-[#f0ece9]" />

          {/* Timeline */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-[13px] text-muted">Timeline</span>
            <div className="flex flex-col gap-3 relative pl-1 max-sm:gap-4">
              {steps.map((step, index) => {
                const current = index === currentIndex
                return (
                  <div key={step.label} className="flex items-center gap-3 relative">
                    <span
                      className={`size-2 rounded-full shrink-0 ${
                        step.done ? 'bg-[#39ab00]' : current ? 'bg-brand' : 'bg-[#dcdcdc]'
                      }`}
                    />
                    <span className={`text-[13px] text-ink max-sm:text-sm ${current ? 'font-semibold' : step.done ? 'font-normal' : 'font-normal max-sm:text-muted'}`}>
                      {step.label}
                    </span>
                    <span className={`ml-auto text-xs text-muted ${current ? 'font-semibold max-sm:text-ink/70' : ''}`}>
                      {step.done ? step.time : current && order.status === 'Preparing' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="pt-3 border-t border-[#f0ece9] mt-2 max-sm:mt-4 max-sm:border-0 max-sm:pt-0">
          {order.status === 'Preparing' && (
            <button
              type="button"
              onClick={handleNextAction}
              className="w-full rounded-full bg-brand py-3 text-center text-sm font-semibold max-sm:py-3.5 max-sm:text-base text-on-brand shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              Mark as Ready
            </button>
          )}

          {order.status === 'Ready' && (
            <button
              type="button"
              onClick={handleNextAction}
              className={`w-full rounded-full py-3 text-center text-sm font-semibold max-sm:py-3.5 max-sm:text-base text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer ${
                isDelivery ? 'bg-[#0095ff]' : 'bg-[#39ab00]'
              }`}
            >
              {isDelivery ? 'Dispatch Order' : 'Mark as Received'}
            </button>
          )}

          {order.status === 'En Route' && (
            <button
              type="button"
              onClick={handleNextAction}
              className="w-full rounded-full bg-[#39ab00] py-3 text-center text-sm font-semibold max-sm:py-3.5 max-sm:text-base text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              Mark as Delivered
            </button>
          )}

          {order.status === 'Delivered' && (
            <div className="flex items-center justify-center gap-2 py-2.5 text-center text-sm font-semibold text-muted select-none">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-[#39ab00]" />
              <span>Complete</span>
            </div>
          )}

          {order.status === 'Cancelled' && (
            <div className="py-2.5 text-center text-sm font-semibold text-[#f30000] select-none">
              Order Cancelled
            </div>
          )}
        </div>
        </div>
      </aside>
    </>
  )
}
