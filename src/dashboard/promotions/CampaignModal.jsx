import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  CalendarDaysIcon,
  Search01Icon,
  CheckmarkCircle02Icon,
  CroissantIcon,
  DonutIcon,
  Coffee02Icon,
  Bread04Icon,
  CakeIcon,
  Cupcake02Icon,
} from '@hugeicons/core-free-icons'

import flakyButterCroissantImg from '../../assets/menu/flaky-butter-croissant.png'
import almondFrangipaneCroissantImg from '../../assets/menu/almond-frangipane-croissant.png'
import doubleChocolateCroissantImg from '../../assets/menu/double-chocolate-croissant.png'
import matchaCreamCruffinImg from '../../assets/menu/matcha-cream-cruffin.png'
import savoryHamCheeseCroissantImg from '../../assets/menu/savory-ham-cheese-croissant.png'
import donutImg from '../../assets/menu/donut.png'
import macchiatoImg from '../../assets/dashboard/macchiato.png'

const CATEGORIES = [
  { id: 'croissants', name: 'Croissants', icon: CroissantIcon },
  { id: 'donuts', name: 'Donuts', icon: DonutIcon },
  { id: 'coffee', name: 'Coffee', icon: Coffee02Icon },
  { id: 'bread', name: 'Bread', icon: Bread04Icon },
  { id: 'cakes', name: 'Cakes', icon: CakeIcon },
  { id: 'pastries', name: 'Pastries', icon: Cupcake02Icon },
]

const ALL_ITEMS = [
  { id: 1, name: 'Flaky Butter Croissant', price: '$2.50', categoryId: 'croissants', image: flakyButterCroissantImg },
  { id: 2, name: 'Almond Frangipane Croissant', price: '$3.50', categoryId: 'croissants', image: almondFrangipaneCroissantImg },
  { id: 3, name: 'Double Chocolate Croissant', price: '$3.00', categoryId: 'croissants', image: doubleChocolateCroissantImg },
  { id: 4, name: 'Matcha Cream Cruffin', price: '$4.50', categoryId: 'croissants', image: matchaCreamCruffinImg },
  { id: 5, name: 'Savory Ham & Cheese Croissant', price: '$4.00', categoryId: 'croissants', image: savoryHamCheeseCroissantImg },
  { id: 6, name: 'Classic Glazed Donut', price: '$2.20', categoryId: 'donuts', image: donutImg },
  { id: 7, name: 'Chocolate Sprinkle Donut', price: '$2.80', categoryId: 'donuts', image: donutImg },
  { id: 8, name: 'Caramel Macchiato', price: '$4.50', categoryId: 'coffee', image: macchiatoImg },
  { id: 9, name: 'Espresso', price: '$3.00', categoryId: 'coffee', image: macchiatoImg },
  { id: 10, name: 'Artisan Sourdough Loaf', price: '$6.50', categoryId: 'bread', image: flakyButterCroissantImg },
  { id: 11, name: 'Baguette Tradition', price: '$4.00', categoryId: 'bread', image: flakyButterCroissantImg },
  { id: 12, name: 'Red Velvet Cake Slice', price: '$5.50', categoryId: 'cakes', image: donutImg },
  { id: 13, name: 'Cinnamon Roll', price: '$3.80', categoryId: 'pastries', image: flakyButterCroissantImg },
]

export function CampaignModal({
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  isOpen,
  onClose,
  onSave,
}) {
  const [step, setStep] = useState(1)

  // Step 1 state
  const [title, setTitle] = useState(initialData?.title || '')
  const [type, setType] = useState(initialData?.type || 'Percentage Discount')
  const [discountValue, setDiscountValue] = useState(initialData?.discountValue || '20')
  const [minOrderValue, setMinOrderValue] = useState(initialData?.minOrderValue || '$10.00')
  const [validFrom, setValidFrom] = useState(initialData?.validFrom || 'Oct 1, 2024')
  const [validTo, setValidTo] = useState(initialData?.validTo || 'Oct 15, 2024')
  const [description, setDescription] = useState(
    initialData?.description || 'Get 20% off all delicious hand-crafted croissants for two weeks!',
  )

  // Step 2 state
  const [targetType, setTargetType] = useState(initialData?.targetType || 'CATEGORY') // 'CATEGORY' | 'ITEM'
  const [selectedCategories, setSelectedCategories] = useState(initialData?.selectedCategories || ['Croissants'])
  const [selectedItemIds, setSelectedItemIds] = useState(initialData?.selectedItems || [1, 2])
  const [activeItemCategoryId, setActiveItemCategoryId] = useState('croissants')
  const [itemSearchQuery, setItemSearchQuery] = useState('')

  // Step 3 state
  const [channel, setChannel] = useState(initialData?.channel || 'Push Notification')

  if (!isOpen) return null

  const isEdit = mode === 'edit'

  const toggleCategorySelection = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.length > 1
          ? prev.filter((c) => c !== categoryName)
          : prev
        : [...prev, categoryName],
    )
  }

  const toggleItemSelection = (itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.length > 1
          ? prev.filter((id) => id !== itemId)
          : prev
        : [...prev, itemId],
    )
  }

  // Filter items in active category for Step 2
  const visibleItems = ALL_ITEMS.filter((item) => {
    const matchCategory = item.categoryId === activeItemCategoryId
    if (!matchCategory) return false
    if (!itemSearchQuery.trim()) return true
    return item.name.toLowerCase().includes(itemSearchQuery.toLowerCase().trim())
  })

  // Selected items objects for review
  const selectedItemObjects = ALL_ITEMS.filter((item) => selectedItemIds.includes(item.id))

  const handleFinalSubmit = () => {
    const payload = {
      ...(initialData || {}),
      title: title.trim() || 'Untitled Campaign',
      type,
      discountValue: discountValue.trim() || '10',
      minOrderValue: minOrderValue.trim() || '$0.00',
      validFrom,
      validTo,
      description: description.trim(),
      targetType,
      selectedCategories,
      selectedItems: selectedItemIds,
      channel,
      audience: initialData?.audience || '458 members',
      timeInfo: isEdit ? initialData?.timeInfo || 'Sent Oct 10' : `Starts ${validFrom}`,
      openRate: initialData?.openRate || '-',
      clickRate: initialData?.clickRate || '-',
      status: initialData?.status || 'Active',
    }
    onSave(payload)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white rounded-[20px] p-5 sm:p-8 max-w-[800px] w-full shadow-2xl flex flex-col gap-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <h2 className="text-lg sm:text-xl font-semibold text-ink">
              {isEdit ? 'Edit Campaign' : 'Create a campaign'}
            </h2>
            <span className="rounded-full bg-[var(--brand-light,#fdf6ee)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand,#c15400)]">
              STEP {step} OF 3
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-neutral-100 hover:text-ink transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        {/* 3-Step Progress Bar */}
        <div className="flex items-center gap-2.5 w-full">
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-[var(--brand,#c15400)]' : 'bg-ink/20'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-[var(--brand,#c15400)]' : 'bg-ink/20'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step >= 3 ? 'bg-[var(--brand,#c15400)]' : 'bg-ink/20'
            }`}
          />
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Campaign Title */}
            <div className="flex flex-col gap-1 rounded-[10px] border border-[#e8e8e8] bg-white px-3.5 py-2.5 focus-within:border-brand transition-colors">
              <label className="text-xs font-medium text-muted">Campaign Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Cookie Sale"
                className="text-sm sm:text-base font-normal text-ink outline-none"
              />
            </div>

            {/* Campaign Type Segmented Control */}
            <div className="flex flex-col gap-2">
              <span className="text-sm sm:text-base font-medium text-ink">Campaign Type</span>
              <div className="flex items-center rounded-full border border-[#dcdcdc] bg-[#e8e8e8] p-0.5">
                {['Percentage Discount', 'Fix Price OFF', 'Buy 1 Get 1'].map((t) => {
                  const isSelected = type === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 rounded-full py-2 px-2 text-center text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-white text-ink shadow-[0px_1px_3px_rgba(16,24,40,0.1)]'
                          : 'text-body hover:text-ink'
                      }`}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Discount Value & Min Order Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-1 rounded-[10px] border border-[#e8e8e8] bg-white px-3.5 py-2.5 focus-within:border-brand transition-colors">
                <label className="text-xs font-medium text-muted">
                  {type === 'Fix Price OFF'
                    ? 'Discount Amount ($)'
                    : type === 'Buy 1 Get 1'
                    ? 'Benefit Code'
                    : 'Discount Value %'}
                </label>
                <input
                  type="text"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={type === 'Buy 1 Get 1' ? 'BOGO' : '20'}
                  className="text-sm sm:text-base font-normal text-ink outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 rounded-[10px] border border-[#e8e8e8] bg-white px-3.5 py-2.5 focus-within:border-brand transition-colors">
                <label className="text-xs font-medium text-muted">
                  Minimum Order Value (Optional)
                </label>
                <input
                  type="text"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  placeholder="$10.00"
                  className="text-sm sm:text-base font-normal text-ink outline-none"
                />
              </div>
            </div>

            {/* Date Range Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="relative flex flex-col gap-1 rounded-[10px] border border-[#e8e8e8] bg-white px-3.5 py-2.5 focus-within:border-brand transition-colors">
                <label className="text-xs font-medium text-muted">Valid From</label>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    placeholder="Oct 1, 2024"
                    className="w-full text-sm sm:text-base font-normal text-ink outline-none pr-8"
                  />
                  <HugeiconsIcon
                    icon={CalendarDaysIcon}
                    size={18}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  />
                </div>
              </div>

              <div className="relative flex flex-col gap-1 rounded-[10px] border border-[#e8e8e8] bg-white px-3.5 py-2.5 focus-within:border-brand transition-colors">
                <label className="text-xs font-medium text-muted">Valid To</label>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    placeholder="Oct 15, 2024"
                    className="w-full text-sm sm:text-base font-normal text-ink outline-none pr-8"
                  />
                  <HugeiconsIcon
                    icon={CalendarDaysIcon}
                    size={18}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Description */}
            <div className="flex flex-col gap-1 rounded-[10px] border border-[#e8e8e8] bg-white px-3.5 py-2.5 focus-within:border-brand transition-colors">
              <label className="text-xs font-medium text-muted">Campaign Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Get 20% off all delicious hand-crafted croissants for two weeks!"
                className="text-sm sm:text-base font-normal text-ink outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Target Type Toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-sm sm:text-base font-medium text-ink">Apply Discount on</span>
              <div className="flex items-center rounded-full border border-[#dcdcdc] bg-[#e8e8e8] p-0.5">
                <button
                  type="button"
                  onClick={() => setTargetType('CATEGORY')}
                  className={`flex-1 rounded-full py-2 px-4 text-center text-xs font-medium transition-all ${
                    targetType === 'CATEGORY'
                      ? 'bg-white text-ink shadow-[0px_1px_3px_rgba(16,24,40,0.1)]'
                      : 'text-body hover:text-ink'
                  }`}
                >
                  CATEGORY
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('ITEM')}
                  className={`flex-1 rounded-full py-2 px-4 text-center text-xs font-medium transition-all ${
                    targetType === 'ITEM'
                      ? 'bg-white text-ink shadow-[0px_1px_3px_rgba(16,24,40,0.1)]'
                      : 'text-body hover:text-ink'
                  }`}
                >
                  ITEM
                </button>
              </div>
            </div>

            {/* Target Mode: CATEGORY */}
            {targetType === 'CATEGORY' ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.name)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategorySelection(cat.name)}
                        className={`flex flex-col items-center justify-center gap-2.5 py-4 px-3 rounded-[12px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--brand-light,#fdf6ee)] border-2 border-[var(--brand,#c15400)] text-[var(--brand,#c15400)]'
                            : 'bg-white border border-[#e8e8e8] text-body hover:border-neutral-300'
                        }`}
                      >
                        <HugeiconsIcon
                          icon={cat.icon}
                          size={28}
                          className={isSelected ? 'text-[var(--brand,#c15400)]' : 'text-body'}
                        />
                        <span
                          className={`text-sm ${
                            isSelected ? 'font-semibold text-[var(--brand,#c15400)]' : 'font-normal'
                          }`}
                        >
                          {cat.name}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Selected categories pills */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <span className="text-sm font-medium text-ink">Selected</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((catName) => (
                      <span
                        key={catName}
                        className="rounded-full bg-[#f5f5f5] px-4 py-2 text-xs sm:text-sm font-medium text-ink"
                      >
                        {catName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Target Mode: ITEM */
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start w-full">
                  {/* Category sidebar */}
                  <div className="flex sm:flex-col gap-1 w-full sm:w-44 shrink-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                    {CATEGORIES.map((cat) => {
                      const isActive = activeItemCategoryId === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setActiveItemCategoryId(cat.id)
                            setItemSearchQuery('')
                          }}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-left transition-colors whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-[var(--brand-light,#fdf6ee)] font-semibold text-[var(--brand,#c15400)]'
                              : 'text-body hover:bg-neutral-50 hover:text-ink font-normal'
                          }`}
                        >
                          <span>{cat.name}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Items list & search */}
                  <div className="flex flex-1 flex-col gap-2.5 min-w-0 w-full">
                    {/* Header + Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink capitalize">
                        {CATEGORIES.find((c) => c.id === activeItemCategoryId)?.name}
                      </span>
                      <div className="flex items-center gap-2 rounded-full border border-[#f0ece9] bg-white px-3 py-1.5 shadow-2xs focus-within:border-brand w-full sm:w-60">
                        <HugeiconsIcon icon={Search01Icon} size={16} className="text-muted shrink-0" />
                        <input
                          type="text"
                          value={itemSearchQuery}
                          onChange={(e) => setItemSearchQuery(e.target.value)}
                          placeholder="Search an item..."
                          className="w-full text-xs font-normal text-ink outline-none placeholder:text-muted"
                        />
                      </div>
                    </div>

                    {/* Products list scrollable */}
                    <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
                      {visibleItems.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted">
                          No items in this category
                        </div>
                      ) : (
                        visibleItems.map((item) => {
                          const isSelected = selectedItemIds.includes(item.id)
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleItemSelection(item.id)}
                              className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[var(--brand-light,#fdf6ee)]'
                                  : 'hover:bg-neutral-50'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded-lg object-cover border border-[#e8e8e8] shrink-0"
                              />
                              <div className="flex flex-1 flex-col min-w-0">
                                <span className="text-xs sm:text-sm font-normal text-ink truncate">
                                  {item.name}
                                </span>
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-ink w-16 shrink-0">
                                {item.price}
                              </span>
                              {isSelected ? (
                                <HugeiconsIcon
                                  icon={CheckmarkCircle02Icon}
                                  size={22}
                                  className="text-[var(--brand,#c15400)] shrink-0"
                                />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-[#dcdcdc] shrink-0" />
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected count */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <span className="text-sm font-medium text-ink">Selected</span>
                  <div className="flex">
                    <span className="rounded-full bg-[#f5f5f5] px-4 py-2 text-xs sm:text-sm font-medium text-ink">
                      {selectedItemIds.length} item{selectedItemIds.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            {/* Delivery Channels */}
            <div className="flex flex-col gap-2">
              <span className="text-sm sm:text-base font-medium text-ink">Delivery Channels</span>
              <div className="flex flex-wrap gap-2.5">
                {['In-App Offer', 'Push Notification', 'SMS'].map((ch) => {
                  const isSelected = channel === ch
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannel(ch)}
                      className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--brand,#c15400)] text-white'
                          : 'bg-[#f5f5f5] text-ink hover:bg-neutral-200'
                      }`}
                    >
                      {ch}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Review Box */}
            <div className="flex flex-col gap-2">
              <span className="text-sm sm:text-base font-medium text-ink">Review</span>
              <div className="flex flex-col gap-2.5 rounded-xl bg-[#f5f5f5] p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-ink">
                  {title.trim() || 'Untitled Campaign'}
                </h3>
                <p className="text-xs sm:text-sm text-muted">
                  {validFrom} – {validTo}
                </p>
                <p className="text-xs sm:text-sm text-muted">
                  Audience: {initialData?.audience || '634 members'} ({channel})
                </p>

                {/* Scope Summary */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#e8e8e8]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {targetType === 'CATEGORY'
                      ? `Target Categories (${selectedCategories.length}):`
                      : `Target Items (${selectedItemObjects.length}):`}
                  </span>

                  {targetType === 'CATEGORY' ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((c) => (
                        <span
                          key={c}
                          className="rounded-md bg-white border border-[#e8e8e8] px-2.5 py-1 text-xs font-medium text-ink"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedItemObjects.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-1.5 rounded-md bg-white border border-[#e8e8e8] pl-1 pr-2.5 py-1"
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="h-6 w-6 rounded object-cover"
                          />
                          <span className="text-xs font-normal text-ink">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#f0ece9]">
          {/* Left: Save Changes button in Edit mode */}
          {isEdit ? (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="rounded-full bg-[var(--brand,#c15400)] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save Changes
            </button>
          ) : (
            <div />
          )}

          {/* Right: Step navigation buttons */}
          <div className="flex items-center gap-2.5">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#e8e8e8] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full border border-[#e8e8e8] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-full bg-[var(--brand,#c15400)] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="rounded-full bg-[var(--brand,#c15400)] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                {isEdit ? 'Save Changes' : 'Launch Campaign'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
