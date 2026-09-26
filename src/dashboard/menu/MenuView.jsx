import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  Clock01Icon,
  DragDropVerticalIcon,
  PencilEdit02Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'

import flakyButterCroissantImg from '../../assets/menu/flaky-butter-croissant.png'
import almondFrangipaneCroissantImg from '../../assets/menu/almond-frangipane-croissant.png'
import doubleChocolateCroissantImg from '../../assets/menu/double-chocolate-croissant.png'
import matchaCreamCruffinImg from '../../assets/menu/matcha-cream-cruffin.png'
import savoryHamCheeseCroissantImg from '../../assets/menu/savory-ham-cheese-croissant.png'
import donutImg from '../../assets/menu/donut.png'
import macchiatoImg from '../../assets/dashboard/macchiato.png'

import { CategoryIcon } from './CategoryIcon'
import { AddCategoryModal } from './AddCategoryModal'
import { EditCategoryModal } from './EditCategoryModal'
import { AddItemModal } from './AddItemModal'
import { EditItemModal } from './EditItemModal'
import { ToggleSwitch } from '../branches/ToggleSwitch'

const INITIAL_CATEGORIES = [
  {
    id: 'croissants',
    name: 'Croissants',
    icon: 'croissant',
    items: [
      {
        id: 1,
        name: 'Flaky Butter Croissant',
        price: '$2.50',
        prepTime: '10 min',
        desc: 'Pan-seared salmon with lemon butter and cap...',
        image: flakyButterCroissantImg,
        inStock: true,
      },
      {
        id: 2,
        name: 'Almond Frangipane Croissant',
        price: '$3.50',
        prepTime: '10 min',
        desc: 'Twice-baked croissant filled with rich almond c...',
        image: almondFrangipaneCroissantImg,
        inStock: true,
      },
      {
        id: 3,
        name: 'Double Chocolate Croissant',
        price: '$3.00',
        prepTime: '10 min',
        desc: 'Croissant filled with 2x chocolate cream.',
        image: doubleChocolateCroissantImg,
        inStock: true,
      },
      {
        id: 4,
        name: 'Matcha Cream Cruffin',
        price: '$4.50',
        prepTime: '10 min',
        desc: 'Slow-roasted tomato soup with basil and crèm...',
        image: matchaCreamCruffinImg,
        inStock: false,
      },
      {
        id: 5,
        name: 'Savory Ham & Cheese Croissant',
        price: '$4.00',
        prepTime: '10 min',
        desc: 'Braised short ribs in red wine with root vegetabl...',
        image: savoryHamCheeseCroissantImg,
        inStock: true,
      },
    ],
  },
  {
    id: 'donuts',
    name: 'Donuts',
    icon: 'donut',
    items: [
      {
        id: 6,
        name: 'Regular Donut',
        price: '$10.00',
        prepTime: '25min',
        desc: 'Classic donut for your snacks',
        image: donutImg,
        inStock: true,
      },
    ],
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: 'coffee',
    items: [
      {
        id: 7,
        name: 'Iced Caramel Macchiato',
        price: '$5.40',
        prepTime: '5 min',
        desc: 'Freshly pulled espresso with caramel drizzle and chilled milk.',
        image: macchiatoImg,
        inStock: true,
      },
      {
        id: 8,
        name: 'Vanilla Bean Cold Brew',
        price: '$4.80',
        prepTime: '3 min',
        desc: 'Smooth steeped cold brew with vanilla bean infusion.',
        image: macchiatoImg,
        inStock: true,
      },
    ],
  },
  {
    id: 'bread',
    name: 'Bread',
    icon: 'bread',
    items: [
      {
        id: 9,
        name: 'Sourdough Country Loaf',
        price: '$6.50',
        prepTime: '15 min',
        desc: 'Naturally fermented artisanal sourdough loaf with crispy crust.',
        image: flakyButterCroissantImg,
        inStock: true,
      },
    ],
  },
  {
    id: 'pastries',
    name: 'Pastries',
    icon: 'cupcake',
    items: [
      {
        id: 10,
        name: 'Cinnamon Swirl Bun',
        price: '$3.80',
        prepTime: '8 min',
        desc: 'Warm glazed cinnamon swirl with brown sugar filling.',
        image: flakyButterCroissantImg,
        inStock: true,
      },
    ],
  },
]

const STORAGE_KEY = 'bake-my-app:menu-catalog:v1'

function loadCategories(onboardingState) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    let categories = raw ? JSON.parse(raw) : INITIAL_CATEGORIES
    if (!Array.isArray(categories) || categories.length === 0) {
      categories = INITIAL_CATEGORIES
    }

    // Merge onboarding custom item if present and not already added
    const userCategory = onboardingState?.menu?.category?.trim()
    const userItemName = onboardingState?.menu?.item?.name?.trim()
    if (userCategory && userItemName) {
      const matchCat = categories.find(
        (c) => c.name.toLowerCase() === userCategory.toLowerCase(),
      )
      const userItemPrice = onboardingState.menu.item.price
        ? `$${parseFloat(onboardingState.menu.item.price).toFixed(2)}`
        : '$4.50'
      const userItem = {
        id: 'onboarding-item',
        name: userItemName,
        price: userItemPrice,
        prepTime: onboardingState.menu.item.prepTime || '15 min',
        desc: onboardingState.menu.item.description || 'Freshly made in house.',
        image: onboardingState.menu.item.image || flakyButterCroissantImg,
        inStock: true,
      }

      if (matchCat) {
        if (!matchCat.items.some((i) => i.name === userItemName)) {
          matchCat.items.unshift(userItem)
        }
      } else {
        categories.unshift({
          id: 'user-cat',
          name: userCategory,
          icon: 'croissant',
          items: [userItem],
        })
      }
    }

    return categories
  } catch {
    return INITIAL_CATEGORIES
  }
}

export function MenuView({ onboardingState }) {
  const [categories, setCategories] = useState(() => loadCategories(onboardingState))
  const [selectedCategoryId, setSelectedCategoryId] = useState(() => categories[0]?.id || 'croissants')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const saveCategories = (updated) => {
    setCategories(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // quota or storage unavailable
    }
  }

  // Active Category
  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0] || null

  // Category Actions
  const handleAddCategory = (newCat) => {
    const updated = [...categories, newCat]
    saveCategories(updated)
    setSelectedCategoryId(newCat.id)
    showToast(`Category "${newCat.name}" added`)
  }

  const handleUpdateCategory = (updatedCat) => {
    const updated = categories.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    saveCategories(updated)
    setEditingCategory(null)
    showToast(`Category "${updatedCat.name}" updated`)
  }

  const handleDeleteCategory = (catId) => {
    const target = categories.find((c) => c.id === catId)
    const updated = categories.filter((c) => c.id !== catId)
    saveCategories(updated)
    if (selectedCategoryId === catId && updated.length > 0) {
      setSelectedCategoryId(updated[0].id)
    }
    setEditingCategory(null)
    showToast(`Category "${target?.name || ''}" removed`)
  }

  // Item Actions
  const handleAddItem = (newItem) => {
    if (!activeCategory) return
    const updated = categories.map((c) => {
      if (c.id === activeCategory.id) {
        return {
          ...c,
          items: [newItem, ...c.items],
        }
      }
      return c
    })
    saveCategories(updated)
    showToast(`Item "${newItem.name}" added`)
  }

  const handleUpdateItem = (updatedItem) => {
    if (!activeCategory) return
    const updated = categories.map((c) => {
      if (c.id === activeCategory.id) {
        return {
          ...c,
          items: c.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
        }
      }
      return c
    })
    saveCategories(updated)
    setEditingItem(null)
    showToast(`Item "${updatedItem.name}" updated`)
  }

  const handleDeleteItem = (itemId) => {
    if (!activeCategory) return
    const updated = categories.map((c) => {
      if (c.id === activeCategory.id) {
        return {
          ...c,
          items: c.items.filter((i) => i.id !== itemId),
        }
      }
      return c
    })
    saveCategories(updated)
    setEditingItem(null)
    showToast('Item deleted')
  }

  const handleToggleStock = (itemId, inStock) => {
    if (!activeCategory) return
    const updated = categories.map((c) => {
      if (c.id === activeCategory.id) {
        return {
          ...c,
          items: c.items.map((i) => (i.id === itemId ? { ...i, inStock } : i)),
        }
      }
      return c
    })
    saveCategories(updated)
  }

  // Filter Items
  const displayedItems = useMemo(() => {
    if (!activeCategory) return []
    if (!searchQuery.trim()) return activeCategory.items
    const q = searchQuery.toLowerCase().trim()
    return activeCategory.items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q),
    )
  }, [activeCategory, searchQuery])

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-5 lg:gap-7">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl sm:text-[26px] lg:text-[28px] font-semibold tracking-tight text-ink">
            Menu Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Edit your products, availability, prices, and categories in real-time.
          </p>
        </div>

        {/* Search */}
        <div className="flex w-full sm:w-64 md:w-72 lg:w-80 items-center gap-2 rounded-full border border-[#f0ece9] bg-white px-3.5 py-2 shadow-sm focus-within:border-brand">
          <HugeiconsIcon icon={Search01Icon} size={16} className="text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full text-xs font-normal text-ink outline-none placeholder:text-muted"
          />
        </div>
      </div>

      {/* Main 2-Column Catalog Layout */}
      <div className="grid grid-cols-1 items-start gap-4 lg:gap-6 md:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
        {/* Left Column: Categories Panel */}
        <div className="flex flex-col gap-3 sm:gap-4 rounded-[16px] lg:rounded-[20px] bg-white p-4 lg:p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/80">
          <h2 className="text-sm lg:text-base font-semibold text-ink">Categories</h2>

          {/* Categories List */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            {categories.map((category) => {
              const isSelected = activeCategory?.id === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`flex w-full items-center justify-between rounded-xl p-2 sm:p-2.5 lg:p-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-brand-light text-brand font-medium'
                      : 'text-ink hover:bg-[#f5f5f5]'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-2.5 truncate">
                    <HugeiconsIcon
                      icon={DragDropVerticalIcon}
                      size={15}
                      className="text-muted shrink-0"
                    />
                    <span className="truncate text-xs sm:text-sm font-medium">{category.name}</span>
                  </div>

                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                      isSelected ? 'bg-brand text-white' : 'bg-[#f5f5f5] text-[#848484]'
                    }`}
                  >
                    {category.items.length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Add Category Button */}
          <button
            type="button"
            onClick={() => setIsAddCategoryOpen(true)}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#e8e8e8] py-2 lg:py-2.5 text-xs sm:text-sm font-semibold text-ink transition-colors hover:bg-[#dcdcdc] cursor-pointer"
          >
            <HugeiconsIcon icon={Add01Icon} size={15} color="currentColor" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Right Column: Category Items */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 rounded-[16px] lg:rounded-[20px] bg-white p-4 sm:p-5 lg:p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]/80">
          {activeCategory ? (
            <>
              {/* Category Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-[#f0ece9] pb-4 lg:pb-5">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex size-9 sm:size-10 lg:size-11 items-center justify-center rounded-full bg-brand-light text-brand shadow-sm">
                    <CategoryIcon icon={activeCategory.icon} size={20} color="var(--brand)" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-base sm:text-lg font-semibold text-ink leading-tight">
                      {activeCategory.name}
                    </h2>
                    <span className="text-[11px] sm:text-xs text-muted">
                      {activeCategory.items.length} item{activeCategory.items.length === 1 ? '' : 's'} in this category
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Edit Category */}
                  <button
                    type="button"
                    onClick={() => setEditingCategory(activeCategory)}
                    className="flex items-center gap-1.5 rounded-full border border-[#e8e8e8] bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-ink transition-colors hover:bg-[#f5f5f5] cursor-pointer"
                  >
                    <HugeiconsIcon icon={PencilEdit02Icon} size={15} color="currentColor" />
                    <span>Edit Category</span>
                  </button>

                  {/* Add Item */}
                  <button
                    type="button"
                    onClick={() => setIsAddItemOpen(true)}
                    className="flex items-center gap-1.5 rounded-full bg-brand px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Add01Icon} size={15} color="currentColor" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              {displayedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[#fafafa] p-8 sm:p-12 text-center">
                  <p className="text-sm sm:text-base font-semibold text-ink">No items found</p>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    {searchQuery.trim()
                      ? `No results match "${searchQuery}".`
                      : 'This category is empty. Add your first item above.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddItemOpen(true)}
                    className="mt-4 flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90"
                  >
                    <HugeiconsIcon icon={Add01Icon} size={15} color="currentColor" />
                    <span>Add New Item</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-[14px] lg:rounded-[16px] border border-[#f0ece9] p-3 sm:p-3.5 lg:p-4 transition-colors hover:bg-[#fdfcfb]"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3 lg:gap-3.5 min-w-0 flex-1">
                        <div className="flex size-12 sm:size-13 lg:size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e8e8e8] bg-white p-1">
                          <img
                            src={item.image || flakyButterCroissantImg}
                            alt=""
                            className="size-full object-contain"
                          />
                        </div>

                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <h3 className="truncate text-xs sm:text-sm font-semibold text-ink leading-tight">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted">
                            <span className="flex items-center gap-1 font-medium shrink-0">
                              <HugeiconsIcon icon={Clock01Icon} size={12} className="text-muted" />
                              {item.prepTime}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[140px] sm:max-w-[200px] md:max-w-[180px] lg:max-w-[260px] xl:max-w-[340px]">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price, In Stock Toggle & Edit Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 lg:gap-5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#f5f5f5]">
                        <span className="text-xs sm:text-sm font-semibold text-ink min-w-[50px] text-left sm:text-right">
                          {item.price}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] sm:text-xs font-semibold ${
                              item.inStock ? 'text-[#39ab00]' : 'text-muted'
                            }`}
                          >
                            {item.inStock ? 'In Stock' : 'Sold Out'}
                          </span>
                          <ToggleSwitch
                            checked={item.inStock}
                            onChange={(val) => handleToggleStock(item.id, val)}
                            ariaLabel={`Toggle stock for ${item.name}`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="rounded-lg border border-[#e8e8e8] bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-[#f5f5f5] cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted">
              Select or add a category to view items.
            </div>
          )}
        </div>
      </div>

      {/* Add New Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAdd={handleAddCategory}
      />

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          key={editingCategory.id}
          category={editingCategory}
          isOpen={true}
          onClose={() => setEditingCategory(null)}
          onSave={handleUpdateCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={handleAddItem}
        categoryName={activeCategory?.name}
      />

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          key={editingItem.id}
          item={editingItem}
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  )
}
