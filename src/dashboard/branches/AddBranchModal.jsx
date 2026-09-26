import { useState } from 'react'
import { ToggleSwitch } from './ToggleSwitch'

export function AddBranchModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pickupOrders, setPickupOrders] = useState(true)
  const [deliveryOrders, setDeliveryOrders] = useState(true)
  const [branchOpen, setBranchOpen] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!name.trim()) return

    const generatedCode = code.trim() || `BR-${Math.floor(10 + Math.random() * 90)}`
    const generatedUsername =
      username.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '') + '123'
    const generatedPassword = password.trim() || 'pwd' + Math.floor(1000 + Math.random() * 9000)

    onAdd({
      id: Date.now(),
      name: name.trim(),
      code: generatedCode,
      phone: phone.trim() || '(555) 000 0000',
      address: address.trim() || 'Main Street',
      username: generatedUsername,
      password: generatedPassword,
      pickupOrders,
      deliveryOrders,
      active: branchOpen,
      sales: '$0.00',
      activeOrders: 0,
      performance: 100,
      performanceWarning: false,
    })

    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-branch-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px] overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex w-full max-w-[540px] flex-col gap-6 rounded-[20px] bg-white p-8 shadow-[0px_10px_20px_rgba(0,0,0,0.16)] max-h-[92vh] overflow-y-auto my-auto">
        <h2 id="add-branch-title" className="text-lg font-semibold text-ink">
          Add Branch
        </h2>

        {/* Inputs Group */}
        <div className="flex flex-col gap-2.5">
          {/* Branch Name */}
          <label className="flex flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
            <span className="text-xs font-medium text-muted">Branch Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. West Point Branch"
              className="w-full text-base font-normal text-ink outline-none"
              required
            />
          </label>

          {/* Code & Phone Row */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-2.5">
              <label className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
                <span className="text-xs font-medium text-muted">Branch Code</span>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="WP-11"
                  className="w-full text-base font-normal text-ink outline-none"
                />
              </label>

              <label className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
                <span className="text-xs font-medium text-muted">Phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123 123213"
                  className="w-full text-base font-normal text-ink outline-none"
                />
              </label>
            </div>
            <p className="text-[11px] text-muted">Auto-generated if left empty</p>
          </div>

          {/* Address */}
          <label className="flex flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
            <span className="text-xs font-medium text-muted">Address</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="232, West Point, Texas"
              className="w-full text-base font-normal text-ink outline-none"
            />
          </label>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#f0ece9]" />

        {/* Employee Access */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-ink">Employee Access</p>
            <p className="text-xs text-muted">
              These credentials are used by branch staff to log into the Employee Portal. Auto-generated by default
            </p>
          </div>

          <div className="flex gap-2.5">
            <label className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
              <span className="text-xs font-medium text-muted">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="westpoint123"
                className="w-full text-base font-normal text-ink outline-none"
              />
            </label>

            <label className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
              <span className="text-xs font-medium text-muted">Password</span>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="wpb9999"
                className="w-full text-base font-normal text-ink outline-none"
              />
            </label>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#f0ece9]" />

        {/* Toggles */}
        <div className="flex flex-col gap-4">
          {/* Pickup Orders */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink">Pickup Orders</span>
              <span className="text-xs text-muted">Allow customers to place pickup orders at this branch</span>
            </div>
            <ToggleSwitch
              checked={pickupOrders}
              onChange={setPickupOrders}
              ariaLabel="Allow pickup orders"
            />
          </div>

          {/* Delivery Orders */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink">Delivery Orders</span>
              <span className="text-xs text-muted">Allow customers to request delivery from this branch</span>
            </div>
            <ToggleSwitch
              checked={deliveryOrders}
              onChange={setDeliveryOrders}
              ariaLabel="Allow delivery orders"
            />
          </div>

          {/* Branch Open */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink">Branch Open</span>
              <span className="text-xs text-muted">When off, this branch won't accept any new orders</span>
            </div>
            <ToggleSwitch
              checked={branchOpen}
              onChange={setBranchOpen}
              ariaLabel="Branch open status"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e8e8e8] bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-[#f5f5f5] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            Add Branch
          </button>
        </div>
      </div>
    </div>
  )
}
