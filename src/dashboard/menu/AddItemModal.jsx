import { useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, Image01Icon } from '@hugeicons/core-free-icons'
import avoid1 from '../../assets/guidelines/avoid-1.png'
import avoid2 from '../../assets/guidelines/avoid-2.png'
import avoid3 from '../../assets/guidelines/avoid-3.png'
import { ToggleSwitch } from '../branches/ToggleSwitch'

const AVOID_EXAMPLES = [
  { src: avoid1, alt: 'Busy background behind the product' },
  { src: avoid2, alt: 'Several products in one shot' },
  { src: avoid3, alt: 'Product cropped or partially hidden' },
]

export function AddItemModal({ isOpen, onClose, onAdd, categoryName }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [inStock, setInStock] = useState(true)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!name.trim()) return

    const formattedPrice = price.trim()
      ? price.trim().startsWith('$')
        ? price.trim()
        : `$${parseFloat(price.replace(/[^0-9.]/g, '') || '0').toFixed(2)}`
      : '$3.50'

    onAdd({
      id: Date.now(),
      name: name.trim(),
      price: formattedPrice,
      prepTime: prepTime.trim() || '10 min',
      desc: description.trim(),
      image,
      inStock,
    })

    setName('')
    setPrice('')
    setPrepTime('')
    setDescription('')
    setImage(null)
    setInStock(true)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-item-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-[1px] overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex w-full max-w-[540px] flex-col gap-4 sm:gap-5 lg:gap-6 rounded-[16px] lg:rounded-[20px] bg-white p-5 sm:p-6 lg:p-8 shadow-[0px_10px_20px_rgba(0,0,0,0.16)] max-h-[90vh] overflow-y-auto my-auto">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <h2 id="add-item-title" className="text-lg font-semibold text-ink">
            Add New Item
          </h2>
          <p className="text-sm text-muted">
            Add an item {categoryName ? `to ${categoryName}` : 'in this category'}.
          </p>
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
              placeholder="e.g. Regular Donut"
              className="w-full text-base font-normal text-ink outline-none"
              autoFocus
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
                placeholder="$10.00"
                className="w-full text-base font-normal text-ink outline-none"
              />
            </label>

            <label className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#e8e8e8] bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-brand">
              <span className="text-xs font-medium text-muted">Time to prepare</span>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="25min"
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
              placeholder="Classic donut for your snacks"
              className="w-full resize-none text-base font-normal text-ink outline-none"
            />
          </label>
        </div>

        {/* Image Upload & Guidelines */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full sm:w-[150px] md:w-[160px] h-[120px] sm:h-[135px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#cfcfcf] bg-white p-2.5 text-center transition-colors hover:border-brand"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files?.[0])}
            />
            {image ? (
              <img src={image} alt="" className="size-full object-contain rounded-xl" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <HugeiconsIcon icon={Image01Icon} size={28} className="text-muted" />
                <span className="text-sm font-medium text-ink">Upload image</span>
                <span className="text-xs text-muted">PNG or JPG</span>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="flex flex-1 flex-col gap-2 text-xs">
            <div className="flex flex-col gap-0.5">
              <p className="font-medium text-muted">Guidelines:</p>
              <ol className="list-decimal pl-4 leading-relaxed text-ink">
                <li>Product image must have a transparent background</li>
                <li>Only the product must be visible in the image</li>
              </ol>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-muted">What to avoid:</p>
              <ul className="flex gap-2">
                {AVOID_EXAMPLES.map(({ src, alt }) => (
                  <li
                    key={src}
                    className="relative flex size-12 shrink-0 items-end justify-end overflow-hidden rounded-[10px] border border-black/10"
                  >
                    <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
                    <span className="relative m-0.5 flex size-3.5 items-center justify-center rounded-full bg-white/90 text-[#f30000]">
                      <HugeiconsIcon icon={Cancel01Icon} size={8} strokeWidth={4} color="currentColor" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
            Add Item
          </button>
        </div>
      </div>
    </div>
  )
}
