import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  Search01Icon,
  TriangleAlertIcon,
} from '@hugeicons/core-free-icons'
import { AddBranchModal } from './AddBranchModal'
import { EditBranchModal } from './EditBranchModal'
import { DeleteBranchModal } from './DeleteBranchModal'

const INITIAL_BRANCHES = [
  {
    id: 1,
    name: 'Downtown Bakery',
    code: 'DT-01',
    phone: '(555) 234 5678',
    address: '14 Market St.',
    username: 'downtown_staff',
    password: 'dtb8888',
    active: true,
    pickupOrders: true,
    deliveryOrders: true,
    sales: '$221.45',
    activeOrders: 13,
    performance: 98,
    performanceWarning: false,
  },
  {
    id: 2,
    name: 'West End Branch',
    code: 'WE-02',
    phone: '(555) 876 5432',
    address: '14 Mall Road',
    username: 'westend_staff',
    password: 'web7777',
    active: true,
    pickupOrders: true,
    deliveryOrders: false,
    sales: '$221.45',
    activeOrders: 13,
    performance: 65,
    performanceWarning: true,
  },
  {
    id: 3,
    name: 'Downtown Bakery',
    code: 'DT-02',
    phone: '(555) 345 6789',
    address: '14 Market Street',
    username: 'downtown2_staff',
    password: 'dt26666',
    active: true,
    pickupOrders: true,
    deliveryOrders: true,
    sales: '$221.45',
    activeOrders: 13,
    performance: 98,
    performanceWarning: false,
  },
  {
    id: 4,
    name: 'West End Bakery',
    code: 'WE-03',
    phone: '(555) 987 6543',
    address: '14 Mall Road, London',
    username: 'westend2_staff',
    password: 'we25555',
    active: true,
    pickupOrders: true,
    deliveryOrders: true,
    sales: '$221.45',
    activeOrders: 13,
    performance: 98,
    performanceWarning: false,
  },
]

const STORAGE_KEY = 'bake-my-app:branches:v1'

function loadBranches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_BRANCHES
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BRANCHES
  } catch {
    return INITIAL_BRANCHES
  }
}

export function BranchesView({ onNavigateToOrders }) {
  const [branches, setBranches] = useState(loadBranches)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'active' | 'inactive'
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [deletingBranch, setDeletingBranch] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const saveBranches = (newBranches) => {
    setBranches(newBranches)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBranches))
    } catch {
      // storage quota or disabled
    }
  }

  // Branch CRUD actions
  const handleAddBranch = (newBranch) => {
    const updated = [newBranch, ...branches]
    saveBranches(updated)
    showToast(`Branch "${newBranch.name}" created successfully`)
  }

  const handleUpdateBranch = (updatedBranch) => {
    const updated = branches.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
    saveBranches(updated)
    setEditingBranch(null)
    showToast(`Branch "${updatedBranch.name}" updated`)
  }

  const handleDeleteBranch = (id) => {
    const target = branches.find((b) => b.id === id)
    const updated = branches.filter((b) => b.id !== id)
    saveBranches(updated)
    setDeletingBranch(null)
    setEditingBranch(null)
    showToast(`Branch "${target?.name || ''}" deleted`)
  }

  // Filter & Search
  const totalCount = branches.length
  const activeCount = branches.filter((b) => b.active).length
  const inactiveCount = branches.filter((b) => !b.active).length

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      if (activeTab === 'active' && !b.active) return false
      if (activeTab === 'inactive' && b.active) return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesName = b.name.toLowerCase().includes(query)
        const matchesAddress = b.address?.toLowerCase().includes(query)
        const matchesCode = b.code?.toLowerCase().includes(query)
        return matchesName || matchesAddress || matchesCode
      }
      return true
    })
  }, [branches, activeTab, searchQuery])

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-7">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Branches</h1>
          <p className="text-sm text-muted">
            Manage your bakery locations and employee access credentials.
          </p>
        </div>

        {/* Add Branch Button */}
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} color="currentColor" />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Branches */}
        <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-medium text-muted">Total Branches</p>
          <p className="text-[28px] font-semibold text-ink leading-tight">{totalCount}</p>
        </div>

        {/* Active Branches */}
        <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-medium text-muted">Active</p>
          <p className="text-[28px] font-semibold text-ink leading-tight">{activeCount}</p>
        </div>

        {/* Avg Revenue / Branch */}
        <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-medium text-muted">Avg. Revenue / Branch</p>
          <p className="text-[28px] font-semibold text-ink leading-tight">$1,247.50/d</p>
        </div>

        {/* Most Earning Branch */}
        <div className="flex flex-col gap-3 rounded-[16px] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-medium text-muted">Most Earning Branch</p>
          <p className="text-base font-semibold leading-5 text-ink">
            {branches[0]?.name ? `${branches[0].name} Main` : 'Downtown Main Branch'}
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#dcdcdc]">
          {/* All */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'border-b-2 border-brand text-brand'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span>All</span>
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                activeTab === 'all' ? 'bg-brand text-white' : 'bg-[#e8e8e8] text-[#848484]'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Active */}
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'border-b-2 border-brand text-brand'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span>Active</span>
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                activeTab === 'active' ? 'bg-brand text-white' : 'bg-[#e8e8e8] text-[#848484]'
              }`}
            >
              {activeCount}
            </span>
          </button>

          {/* Inactive */}
          <button
            type="button"
            onClick={() => setActiveTab('inactive')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'inactive'
                ? 'border-b-2 border-brand text-brand'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span>Inactive</span>
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                activeTab === 'inactive' ? 'bg-brand text-white' : 'bg-[#e8e8e8] text-[#848484]'
              }`}
            >
              {inactiveCount}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="flex w-80 items-center gap-2 rounded-full border border-[#f0ece9] bg-white px-3.5 py-2.5 shadow-sm focus-within:border-brand">
          <HugeiconsIcon icon={Search01Icon} size={18} className="text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search branch..."
            className="w-full text-xs font-normal text-ink outline-none placeholder:text-muted"
          />
        </div>
      </div>

      {/* Branches Grid */}
      {filteredBranches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-white p-12 text-center shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
          <p className="text-base font-semibold text-ink">No branches found</p>
          <p className="text-sm text-muted mt-1">Try adjusting your search query or tab filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredBranches.map((branch) => {
            const hasWarning = branch.performanceWarning || branch.performance < 70
            return (
              <div
                key={branch.id}
                className="flex flex-col gap-5 rounded-[20px] bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/80"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
                    <h3 className="truncate text-base font-semibold text-ink leading-tight">
                      {branch.name}
                    </h3>
                    <p className="truncate text-sm text-muted">{branch.address}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold shrink-0 ${
                      branch.active
                        ? 'bg-[#effce8] text-[#39ab00]'
                        : 'bg-[#f5f5f5] text-[#848484]'
                    }`}
                  >
                    {branch.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Mini Stats Row */}
                <div className="flex gap-2.5">
                  {/* Sales */}
                  <div className="flex flex-1 flex-col gap-2 rounded-[10px] bg-[#f5f5f5] p-3.5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-medium text-muted">Sales</span>
                    <span className="text-base font-semibold text-ink leading-tight">
                      {branch.sales || '$221.45'}
                    </span>
                  </div>

                  {/* Active Orders */}
                  <div className="flex flex-1 flex-col gap-2 rounded-[10px] bg-[#f5f5f5] p-3.5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-medium text-muted">Active Orders</span>
                    <span className="text-base font-semibold text-ink leading-tight">
                      {branch.activeOrders ?? 13}
                    </span>
                  </div>

                  {/* Performance */}
                  <div
                    className={`flex flex-1 flex-col gap-2 rounded-[10px] p-3.5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] ${
                      hasWarning ? 'bg-[#fdf0e6]' : 'bg-[#f5f5f5]'
                    }`}
                  >
                    <span className="text-xs font-medium text-muted">Performance</span>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-base font-semibold leading-tight ${
                          hasWarning ? 'text-[#f96c00]' : 'text-ink'
                        }`}
                      >
                        {branch.performance}%
                      </span>
                      {hasWarning && (
                        <HugeiconsIcon
                          icon={TriangleAlertIcon}
                          size={16}
                          color="#f96c00"
                          className="shrink-0"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToOrders) {
                        onNavigateToOrders(branch)
                      } else {
                        showToast(`Viewing active orders for ${branch.name}`)
                      }
                    }}
                    className="flex-1 rounded-full bg-[#e8e8e8] py-2.5 px-4 text-center text-sm font-semibold text-ink transition-colors hover:bg-[#dcdcdc] cursor-pointer"
                  >
                    View Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBranch(branch)}
                    className="flex-1 rounded-full bg-brand py-2.5 px-4 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    Manage Branch
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Branch Modal */}
      <AddBranchModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddBranch}
      />

      {/* Edit Branch Modal */}
      {editingBranch && (
        <EditBranchModal
          key={editingBranch.id}
          branch={editingBranch}
          isOpen={!deletingBranch}
          onClose={() => setEditingBranch(null)}
          onSave={handleUpdateBranch}
          onDeleteClick={(b) => setDeletingBranch(b)}
        />
      )}

      {/* Delete Branch Confirmation Modal */}
      <DeleteBranchModal
        branch={deletingBranch}
        onCancel={() => setDeletingBranch(null)}
        onConfirm={handleDeleteBranch}
      />
    </div>
  )
}
