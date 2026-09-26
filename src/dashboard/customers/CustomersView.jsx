import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'

const INITIAL_CUSTOMERS = [
  {
    id: '#2493',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 321-9876',
    memberSince: 'Oct 2024',
    totalOrders: 23,
    loyaltyPoints: 1250,
  },
  {
    id: '#2492',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+1 (555) 432-8765',
    memberSince: 'Oct 2024',
    totalOrders: 32,
    loyaltyPoints: 1250,
  },
  {
    id: '#2488',
    name: 'Rachel Green',
    email: 'rachel.g@example.com',
    phone: '+1 (555) 543-9871',
    memberSince: 'Oct 2024',
    totalOrders: 32,
    loyaltyPoints: 1250,
  },
  {
    id: '#2487',
    name: 'Chandler Bing',
    email: 'chandler.b@example.com',
    phone: '+1 (555) 654-2109',
    memberSince: 'Oct 2024',
    totalOrders: 32,
    loyaltyPoints: 1250,
  },
  {
    id: '#2486',
    name: 'Monica Geller',
    email: 'monica.g@example.com',
    phone: '+1 (555) 765-4321',
    memberSince: 'Oct 2024',
    totalOrders: 32,
    loyaltyPoints: 1250,
  },
  {
    id: '#2489',
    name: 'Ross Geller',
    email: 'ross.g@example.com',
    phone: '+1 (555) 876-5432',
    memberSince: 'Oct 2024',
    totalOrders: 32,
    loyaltyPoints: 1250,
  },
  {
    id: '#2490',
    name: 'Phoebe Buffay',
    email: 'phoebe.b@example.com',
    phone: '+1 (555) 987-6543',
    memberSince: 'Oct 2024',
    totalOrders: 32,
    loyaltyPoints: 1250,
  },
  {
    id: '#2491',
    name: 'Joey Tribbiani',
    email: 'joey.t@example.com',
    phone: '+1 (555) 098-7654',
    memberSince: 'Oct 2024',
    totalOrders: 32,
    loyaltyPoints: 1250,
  },
  {
    id: '#2485',
    name: 'Mike Hannigan',
    email: 'mike.h@example.com',
    phone: '+1 (555) 112-3344',
    memberSince: 'Nov 2024',
    totalOrders: 19,
    loyaltyPoints: 950,
  },
  {
    id: '#2484',
    name: 'Gunther Central',
    email: 'gunther@example.com',
    phone: '+1 (555) 223-4455',
    memberSince: 'Nov 2024',
    totalOrders: 45,
    loyaltyPoints: 2100,
  },
  {
    id: '#2483',
    name: 'Janice Hosenstein',
    email: 'janice.h@example.com',
    phone: '+1 (555) 334-5566',
    memberSince: 'Dec 2024',
    totalOrders: 15,
    loyaltyPoints: 780,
  },
  {
    id: '#2482',
    name: 'Richard Burke',
    email: 'richard.b@example.com',
    phone: '+1 (555) 445-6677',
    memberSince: 'Aug 2024',
    totalOrders: 28,
    loyaltyPoints: 1420,
  },
  {
    id: '#2481',
    name: 'Carol Willick',
    email: 'carol.w@example.com',
    phone: '+1 (555) 556-7788',
    memberSince: 'Aug 2024',
    totalOrders: 21,
    loyaltyPoints: 1100,
  },
  {
    id: '#2480',
    name: 'Susan Bunch',
    email: 'susan.b@example.com',
    phone: '+1 (555) 667-8899',
    memberSince: 'Jul 2024',
    totalOrders: 24,
    loyaltyPoints: 1280,
  },
  {
    id: '#2479',
    name: 'Jack Geller',
    email: 'jack.g@example.com',
    phone: '+1 (555) 778-9900',
    memberSince: 'Jun 2024',
    totalOrders: 35,
    loyaltyPoints: 1850,
  },
  {
    id: '#2478',
    name: 'Judy Geller',
    email: 'judy.g@example.com',
    phone: '+1 (555) 889-0011',
    memberSince: 'Jun 2024',
    totalOrders: 31,
    loyaltyPoints: 1600,
  },
]

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'name-asc', label: 'Name (A to Z)' },
  { id: 'orders-desc', label: 'Total Orders (High to Low)' },
  { id: 'points-desc', label: 'Loyalty Points (High to Low)' },
]

const ITEMS_PER_PAGE = 8

export function CustomersView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter & Sort
  const filteredCustomers = useMemo(() => {
    let result = [...INITIAL_CUSTOMERS]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q),
      )
    }

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'orders-desc') {
      result.sort((a, b) => b.totalOrders - a.totalOrders)
    } else if (sortBy === 'points-desc') {
      result.sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
    }

    return result
  }, [searchQuery, sortBy])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedCustomers = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE
    return filteredCustomers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredCustomers, safePage])

  const startIndex = filteredCustomers.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(safePage * ITEMS_PER_PAGE, filteredCustomers.length)
  // Total count in mockup is 892 when not searching
  const displayTotal = searchQuery.trim() ? filteredCustomers.length : 892

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-5 lg:gap-7">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-[26px] lg:text-[28px] font-semibold tracking-tight text-ink">
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Your customer base, loyalty engagement, and contact insights.
          </p>
        </div>

        {/* Controls: Search and Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Search Input */}
          <div className="flex w-full sm:w-64 md:w-72 lg:w-80 items-center gap-2 rounded-full border border-[#f0ece9] bg-white px-3.5 py-2 shadow-sm focus-within:border-brand">
            <HugeiconsIcon icon={Search01Icon} size={18} className="text-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search customers..."
              className="w-full text-xs font-normal text-ink outline-none placeholder:text-muted"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 rounded-full border border-[#f0ece9] bg-white px-4 py-2 text-xs font-medium text-ink shadow-sm hover:bg-neutral-50 transition-colors"
            >
              <span>{sortBy === 'default' ? 'Sort' : SORT_OPTIONS.find((o) => o.id === sortBy)?.label}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className={`text-body transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-30 min-w-[200px] rounded-xl border border-[#f0ece9] bg-white p-1.5 shadow-lg">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSortBy(option.id)
                        setShowSortDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors text-left ${
                        sortBy === option.id
                          ? 'bg-[var(--brand-light,#fdf6ee)] text-[var(--brand,#c15400)]'
                          : 'text-body hover:bg-neutral-50 hover:text-ink'
                      }`}
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 w-full">
        {/* Stat Card 1: Total Customers */}
        <div className="bg-white rounded-[16px] p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9] flex flex-col gap-3">
          <p className="text-xs sm:text-sm font-medium text-muted">
            Total Customers
          </p>
          <div className="flex flex-col gap-1.5">
            <p className="text-2xl sm:text-[28px] font-semibold text-ink tracking-tight">
              892
            </p>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#effce8] text-[#39ab00] rounded-full px-2 py-0.5 text-xs font-semibold">
                +12%
              </span>
              <span className="text-[11px] text-muted">
                Than last month
              </span>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Loyalty Members */}
        <div className="bg-white rounded-[16px] p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9] flex flex-col gap-3">
          <p className="text-xs sm:text-sm font-medium text-muted">
            Loyalty Members
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2.5">
              <p className="text-2xl sm:text-[28px] font-semibold text-ink tracking-tight">
                634
              </p>
              <p className="text-2xl sm:text-[28px] font-semibold text-[#cfcfcf]">
                71%
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#effce8] text-[#39ab00] rounded-full px-2 py-0.5 text-xs font-semibold">
                +18.5%
              </span>
              <span className="text-[11px] text-muted">
                Than last month
              </span>
            </div>
          </div>
        </div>

        {/* Stat Card 3: Avg Lifetime Value */}
        <div className="bg-white rounded-[16px] p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9] flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <p className="text-xs sm:text-sm font-medium text-muted">
            Avg. Lifetime Value
          </p>
          <div className="flex flex-col gap-1.5">
            <p className="text-2xl sm:text-[28px] font-semibold text-ink tracking-tight">
              $127.40
            </p>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#effce8] text-[#39ab00] rounded-full px-2 py-0.5 text-xs font-semibold">
                +4.3%
              </span>
              <span className="text-[11px] text-muted">
                Than last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Directory Table Card */}
      <div className="bg-white rounded-[20px] p-4 sm:p-5 lg:p-6 border border-[#f0ece9] shadow-[0px_4px_10px_rgba(0,0,0,0.02)] flex flex-col gap-4 w-full">
        {/* Horizontal scroll for table responsiveness on smaller laptops and tablets */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[840px] flex flex-col">
            {/* Table Header */}
            <div className="flex items-center px-3 py-2 text-xs font-semibold text-[#848484] border-b border-[#f0ece9]">
              <span className="w-[80px] shrink-0">Order</span>
              <span className="w-[180px] sm:w-[200px] shrink-0">Name</span>
              <span className="flex-1 min-w-[180px]">Email</span>
              <span className="w-[170px] shrink-0">Phone</span>
              <span className="w-[130px] shrink-0">Member Since</span>
              <span className="w-[110px] shrink-0">Total Orders</span>
              <span className="w-[110px] shrink-0 text-right sm:text-left">Loyalty Points</span>
            </div>

            {/* Table Body */}
            {paginatedCustomers.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted">
                No customers found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="flex flex-col">
                {paginatedCustomers.map((customer) => (
                  <div
                    key={customer.id + customer.name}
                    className="flex items-center px-3 py-3.5 rounded-[12px] hover:bg-[#faf9f8] transition-colors border-b border-[#f7f5f4] last:border-b-0 text-[13px]"
                  >
                    <span className="w-[80px] shrink-0 font-medium text-ink">
                      {customer.id}
                    </span>
                    <span className="w-[180px] sm:w-[200px] shrink-0 font-medium text-ink truncate pr-2">
                      {customer.name}
                    </span>
                    <span className="flex-1 min-w-[180px] font-normal text-muted truncate pr-2">
                      {customer.email}
                    </span>
                    <span className="w-[170px] shrink-0 font-normal text-muted truncate pr-2">
                      {customer.phone}
                    </span>
                    <span className="w-[130px] shrink-0 font-medium text-ink">
                      {customer.memberSince}
                    </span>
                    <span className="w-[110px] shrink-0 font-medium text-ink">
                      {customer.totalOrders}
                    </span>
                    <span className="w-[110px] shrink-0 font-semibold text-brand text-right sm:text-left">
                      {customer.loyaltyPoints} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#f0ece9]">
          <p className="text-xs sm:text-[13px] text-muted font-normal">
            Showing {startIndex}-{endIndex} of {displayTotal} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-[8px] border border-[#e8e8e8] bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-[8px] border border-[#e8e8e8] bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
