import { useState } from 'react'
import { CategoryIcon } from './CategoryIcon'
import { CATEGORY_ICONS } from './categoryIcons'

export function EditCategoryModal({ category, isOpen, onClose, onSave, onDelete }) {
  const [name, setName] = useState(category?.name || '')
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || 'croissant')

  if (!isOpen || !category) return null

  const handleSave = (e) => {
    e?.preventDefault()
    if (!name.trim()) return

    onSave({
      ...category,
      name: name.trim(),
      icon: selectedIcon,
    })
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-category-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex w-full max-w-[440px] flex-col gap-6 rounded-[20px] bg-white p-8 shadow-[0px_10px_20px_rgba(0,0,0,0.16)]">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <h2 id="edit-category-title" className="text-lg font-semibold text-ink">
            Edit Category
          </h2>
          <p className="text-sm text-muted">Update category details and icon.</p>
        </div>

        {/* Input */}
        <label className="flex flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
          <span className="text-xs font-medium text-muted">Category Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-base font-normal text-ink outline-none"
            required
          />
        </label>

        {/* Category Icons Grid */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-ink">Category Icon</p>
          <div className="grid grid-cols-4 gap-3 pt-1">
            {CATEGORY_ICONS.map((item) => {
              const isSelected = selectedIcon === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIcon(item.id)}
                  title={item.label}
                  className={`flex size-12 items-center justify-center rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand text-on-brand shadow-sm scale-105'
                      : 'text-[#848484] hover:bg-[#f5f5f5]'
                  }`}
                >
                  <CategoryIcon icon={item.id} size={24} color={isSelected ? 'var(--on-brand)' : 'currentColor'} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(category.id)
                onClose()
              }}
              className="text-xs font-semibold text-[#ea0101] hover:underline cursor-pointer"
            >
              Delete Category
            </button>
          ) : <div />}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e8e8e8] bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-[#f5f5f5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
