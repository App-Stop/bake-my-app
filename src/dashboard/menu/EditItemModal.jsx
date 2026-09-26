import { useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon, Image01Icon } from '@hugeicons/core-free-icons'
import { ToggleSwitch } from '../branches/ToggleSwitch'

export function EditItemModal({ item, isOpen, onClose, onSave, onDelete }) {
  const [name, setName] = useState(item?.name || '')
  const [price, setPrice] = useState(item?.price || '')
  const [prepTime, setPrepTime] = useState(item?.prepTime || '')
  const [description, setDescription] = useState(item?.desc || '')
  const [image, setImage] = useState(item?.image || null)
  const [inStock, setInStock] = useState(item?.inStock ?? true)
  const fileInputRef = useRef(null)

  if (!isOpen || !item) return null

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = (e) => {
    e?.preventDefault()
    if (!name.trim()) return

    const formattedPrice = price.trim()
      ? price.trim().startsWith('$')
        ? price.trim()
        : `$${parseFloat(price.replace(/[^0-9.]/g, '') || '0').toFixed(2)}`
      : '$3.50'

    onSave({
      ...item,
      name: name.trim(),
      price: formattedPrice,
      prepTime: prepTime.trim() || '10 min',
      desc: description.trim(),
      image,
      inStock,
    })

    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-item-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-[1px] overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex w-full max-w-[540px] flex-col gap-4 sm:gap-5 lg:gap-6 rounded-[16px] lg:rounded-[20px] bg-white p-5 sm:p-6 lg:p-8 shadow-[0px_10px_20px_rgba(0,0,0,0.16)] max-h-[90vh] overflow-y-auto my-auto">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <h2 id="edit-item-title" className="text-lg font-semibold text-ink">
            Edit Item
          </h2>
          <p className="text-sm text-muted">Modify your item.</p>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-2.5">
          {/* Item Name */}
          <label className="flex flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
            <span className="text-xs font-medium text-muted">Item Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-base font-normal text-ink outline-none"
              required
            />
          </label>

          {/* Price & Prep Time */}
          <div className="flex gap-2.5">
            <label className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
              <span className="text-xs font-medium text-muted">Price</span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-base font-normal text-ink outline-none"
              />
            </label>

            <label className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
              <span className="text-xs font-medium text-muted">Time to prepare</span>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full text-base font-normal text-ink outline-none"
              />
            </label>
          </div>

          {/* Description */}
          <label className="flex flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
            <span className="text-xs font-medium text-muted">Description</span>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none text-base font-normal text-ink outline-none"
            />
          </label>
        </div>

        {/* Image Preview & Change */}
        <div className="flex items-center gap-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageFile(e.target.files?.[0])}
          />
          {image ? (
            <div className="flex size-[100px] sm:size-[120px] lg:size-[130px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[#e8e8e8] bg-white p-2">
              <img src={image} alt="" className="size-full object-contain" />
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex size-[100px] sm:size-[120px] lg:size-[130px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#cfcfcf] bg-white p-2 text-center hover:border-brand"
            >
              <HugeiconsIcon icon={Image01Icon} size={28} className="text-muted" />
              <span className="mt-1 text-xs font-medium text-ink">Upload image</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl bg-[#f5f5f5] px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-[#e8e8e8] cursor-pointer"
            >
              <HugeiconsIcon icon={Image01Icon} size={18} color="currentColor" />
              <span>Change</span>
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                title="Remove image"
                className="flex size-10 items-center justify-center rounded-full bg-[#ffecec] text-[#ea0101] transition-colors hover:bg-[#ffd5d5] cursor-pointer"
              >
                <HugeiconsIcon icon={Delete02Icon} size={18} color="currentColor" />
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#f0ece9]" />

        {/* In Stock Availability */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ink">In Stock Availability</span>
            <span className="text-xs text-muted">Allow customers to order this product immediately</span>
          </div>
          <ToggleSwitch
            checked={inStock}
            onChange={setInStock}
            ariaLabel="In stock availability"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(item.id)
                onClose()
              }}
              className="text-xs font-semibold text-[#ea0101] hover:underline cursor-pointer"
            >
              Delete Item
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
