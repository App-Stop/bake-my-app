import { useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SmartPhone01Icon,
  ComputerIcon,
  Cancel01Icon,
  CroissantIcon,
  Search01Icon,
  ShoppingBasket03Icon,
  StarIcon,
} from '@hugeicons/core-free-icons'
import { extractPalette, normalizeHex, readableTextOn } from '../../lib/color'
import { HomeScreen } from '../../preview/HomeScreen'
import { getStoreSummary } from '../../preview/storeSummary'

const PRESETS = [
  { name: 'Pink', hex: '#ff1fad' },
  { name: 'Violet', hex: '#903bff' },
  { name: 'Green', hex: '#00c064' },
  { name: 'Cyan', hex: '#00c9c6' },
  { name: 'Red', hex: '#f30000' },
  { name: 'Orange', hex: '#f96c00' },
  { name: 'Blue', hex: '#0095ff' },
  { name: 'Yellow', hex: '#edba00' },
]

const DEFAULT_SUGGESTIONS = ['#efbb00', '#a7921b', '#8fa200']

export function EditBrandColorModal({
  isOpen,
  initialColor = '#c15400',
  shop = {},
  state = {},
  onSave,
  onClose,
}) {
  const [draftColor, setDraftColor] = useState(initialColor)
  const [hexInput, setHexInput] = useState(initialColor.replace('#', '').toUpperCase())
  const [prevColor, setPrevColor] = useState(initialColor)
  const [device, setDevice] = useState('mobile')
  const [logoColors, setLogoColors] = useState(DEFAULT_SUGGESTIONS)
  const colorPickerRef = useRef(null)

  if (prevColor !== initialColor) {
    setPrevColor(initialColor)
    setDraftColor(initialColor)
    setHexInput(initialColor.replace('#', '').toUpperCase())
  }

  useEffect(() => {
    if (!shop.logo) return
    let cancelled = false
    extractPalette(shop.logo, 3).then((colors) => {
      if (!cancelled && colors && colors.length > 0) {
        setLogoColors(colors)
      }
    })
    return () => {
      cancelled = true
    }
  }, [shop.logo])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelectColor = (hex) => {
    const norm = normalizeHex(hex)
    if (norm) {
      setDraftColor(norm)
      setHexInput(norm.replace('#', '').toUpperCase())
    }
  }

  const handleHexChange = (e) => {
    const val = e.target.value.replace('#', '').toUpperCase().slice(0, 6)
    setHexInput(val)
    const norm = normalizeHex(val)
    if (norm && val.length === 6) {
      setDraftColor(norm)
    }
  }

  const isCurrent = (hex) => hex.toLowerCase() === draftColor.toLowerCase()

  const summary = getStoreSummary({
    ...state,
    shop: { ...state.shop, ...shop },
    brandColor: draftColor,
  })

  const previewVars = {
    '--brand': draftColor,
    '--brand-light': `color-mix(in oklab, ${draftColor} 10%, white)`,
    '--on-brand': readableTextOn(draftColor),
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/45 backdrop-blur-[2px] animate-fadeIn">
      <div
        className="relative flex flex-col md:flex-row w-full max-w-[920px] max-h-[92vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_10px_40px_0px_rgba(0,0,0,0.16)] border border-[#e8e8e8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button on Mobile / Top Corner */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="md:hidden absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-full bg-[#f5f5f5] text-ink hover:bg-[#e8e8e8] transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>

        {/* Left Column: Color Controls */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink">Edit Brand Color</h2>
              <p className="text-sm text-muted">
                Your brand color applies throughout your website &amp; app
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-col gap-2.5">
              <p className="text-sm sm:text-base font-medium text-ink">Presets</p>
              <div className="grid grid-cols-4 gap-2.5 max-w-[310px]">
                {PRESETS.map((preset) => {
                  const selected = isCurrent(preset.hex)
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      aria-label={`${preset.name} color`}
                      onClick={() => handleSelectColor(preset.hex)}
                      style={{ backgroundColor: preset.hex }}
                      className={`size-14 sm:size-[68px] rounded-[10px] transition-transform hover:scale-105 cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        selected ? 'border-2 border-ink ring-2 ring-black/10' : ''
                      }`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Suggested color based from your logo */}
            <div className="flex flex-col gap-2.5">
              <p className="text-sm sm:text-base font-medium text-ink">
                Suggested color based from your logo
              </p>
              <div className="flex flex-wrap gap-2.5">
                {logoColors.map((hex, idx) => {
                  const selected = isCurrent(hex)
                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Suggested color ${hex}`}
                      onClick={() => handleSelectColor(hex)}
                      style={{ backgroundColor: hex }}
                      className={`size-14 sm:size-[68px] rounded-[10px] transition-transform hover:scale-105 cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        selected ? 'border-2 border-ink ring-2 ring-black/10' : ''
                      }`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Custom Hex & Native Picker */}
            <div className="flex flex-col gap-2.5">
              <p className="text-sm sm:text-base font-medium text-ink">Custom</p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  aria-label="Pick custom color"
                  onClick={() => colorPickerRef.current?.click()}
                  style={{ backgroundColor: draftColor }}
                  className="relative size-14 sm:size-[68px] shrink-0 rounded-[10px] border-2 border-ink shadow-xs cursor-pointer hover:scale-105 transition-transform"
                >
                  <input
                    ref={colorPickerRef}
                    type="color"
                    value={draftColor}
                    onChange={(e) => handleSelectColor(e.target.value)}
                    className="pointer-events-none absolute inset-0 size-full opacity-0"
                  />
                </button>

                <div className="flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3.5 py-2 w-[180px] sm:w-[200px] shadow-xs focus-within:border-brand">
                  <span className="text-xs font-medium text-muted">Hex Code</span>
                  <div className="flex items-center text-ink text-base font-normal">
                    <span className="text-muted mr-0.5">#</span>
                    <input
                      type="text"
                      maxLength={6}
                      value={hexInput}
                      onChange={handleHexChange}
                      onBlur={() => {
                        const norm = normalizeHex(hexInput)
                        if (norm) {
                          setDraftColor(norm)
                          setHexInput(norm.replace('#', '').toUpperCase())
                        } else {
                          setHexInput(draftColor.replace('#', '').toUpperCase())
                        }
                      }}
                      className="w-full bg-transparent uppercase outline-none font-medium"
                      placeholder="C15400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0ece9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e8e8e8] bg-white px-6 py-2.5 sm:py-3 text-sm font-semibold text-ink hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(draftColor)
                onClose()
              }}
              style={{
                backgroundColor: draftColor,
                color: readableTextOn(draftColor),
              }}
              className="rounded-full px-6 py-2.5 sm:py-3 text-sm font-semibold hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Column: Live Storefront Preview */}
        <div className="w-full md:w-[450px] lg:w-[491px] bg-[#f5f5f5] p-5 sm:p-8 flex flex-col items-center justify-start shrink-0 relative overflow-hidden border-t md:border-t-0 md:border-l border-[#f0ece9]">
          {/* Header Preview bar */}
          <div className="flex items-center justify-center gap-4 mb-4 z-10">
            <span className="text-base font-medium text-ink">Preview</span>
            <div className="flex items-center rounded-full border border-[#dcdcdc] bg-[#e8e8e8] p-0.5">
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                aria-label="Mobile preview"
                className={`flex w-14 items-center justify-center rounded-full py-1.5 transition-colors cursor-pointer ${
                  device === 'mobile' ? 'bg-white text-ink shadow-xs' : 'text-body hover:text-ink'
                }`}
              >
                <HugeiconsIcon icon={SmartPhone01Icon} size={18} />
              </button>
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                aria-label="Desktop preview"
                className={`flex w-14 items-center justify-center rounded-full py-1.5 transition-colors cursor-pointer ${
                  device === 'desktop' ? 'bg-white text-ink shadow-xs' : 'text-body hover:text-ink'
                }`}
              >
                <HugeiconsIcon icon={ComputerIcon} size={18} />
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas with Draft Brand Variables */}
          <div
            className="brand-scope relative flex items-center justify-center size-full min-h-[460px]"
            style={previewVars}
          >
            {device === 'mobile' ? (
              <div
                className="transform transition-transform origin-top select-none"
                style={{
                  transform: 'scale(0.84)',
                  width: '241.2px',
                  height: '524.4px',
                }}
              >
                <HomeScreen summary={summary} logo={shop.logo} />
              </div>
            ) : (
              /* Mini Desktop Preview Window */
              <div className="w-full max-w-[420px] rounded-xl bg-white shadow-md border border-[#e8e8e8] overflow-hidden flex flex-col animate-fadeIn select-none">
                {/* Browser top chrome */}
                <div className="bg-[#f0ece9] px-3 py-2 flex items-center gap-1.5 border-b border-[#e5e0dc]">
                  <div className="size-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="size-2.5 rounded-full bg-[#27c93f]" />
                  <div className="mx-auto rounded bg-white/70 px-3 py-0.5 text-[10px] text-muted font-sans truncate max-w-[200px]">
                    https://{shop.name ? shop.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'rossbakers'}.cozy.app
                  </div>
                </div>

                {/* Desktop Storefront Content */}
                <div className="p-4 flex flex-col gap-3.5 bg-white">
                  {/* Navbar */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#f5f5f5]">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-brand text-on-brand shadow-xs">
                        {shop.logo ? (
                          <img src={shop.logo} alt="" className="size-full object-contain p-1" />
                        ) : (
                          <HugeiconsIcon icon={CroissantIcon} size={16} />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-ink">
                        {shop.name || 'Ross Bakers Co.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[10px] text-muted">
                        <HugeiconsIcon icon={Search01Icon} size={11} />
                        <span>Search fresh items...</span>
                      </div>
                      <div className="flex size-6 items-center justify-center rounded-full bg-brand-light text-brand">
                        <HugeiconsIcon icon={ShoppingBasket03Icon} size={13} />
                      </div>
                    </div>
                  </div>

                  {/* Hero Banner with Brand tint */}
                  <div className="rounded-lg bg-brand-light p-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-brand">Fresh From The Oven</span>
                      <span className="text-[9px] text-muted">Order warm pastries for same-day delivery</span>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-brand px-2.5 py-1 text-[9px] font-semibold text-on-brand shadow-xs"
                    >
                      Order Now
                    </button>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 text-[9px]">
                    <span className="rounded-full bg-brand px-2.5 py-0.5 font-medium text-on-brand">
                      Croissants
                    </span>
                    <span className="rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-muted hover:text-ink">
                      Cakes
                    </span>
                    <span className="rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-muted hover:text-ink">
                      Coffee
                    </span>
                    <span className="rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-muted hover:text-ink">
                      Bread
                    </span>
                  </div>

                  {/* Mini Product Cards */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex flex-col gap-1 rounded-lg border border-[#f0ece9] p-2 hover:border-brand transition-colors">
                      <div className="h-14 rounded bg-[#fdf6ee] flex items-center justify-center text-brand">
                        <HugeiconsIcon icon={CroissantIcon} size={28} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-ink truncate">Signature Croissant</span>
                        <div className="flex items-center text-brand text-[9px]">
                          <HugeiconsIcon icon={StarIcon} size={10} color="currentColor" />
                          <span className="ml-0.5">4.9</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] font-bold text-ink">$5.40</span>
                        <button
                          type="button"
                          className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-medium text-on-brand"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 rounded-lg border border-[#f0ece9] p-2 hover:border-brand transition-colors">
                      <div className="h-14 rounded bg-[#fdf6ee] flex items-center justify-center text-brand">
                        <HugeiconsIcon icon={CroissantIcon} size={28} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-ink truncate">Chocolate Swirl</span>
                        <div className="flex items-center text-brand text-[9px]">
                          <HugeiconsIcon icon={StarIcon} size={10} color="currentColor" />
                          <span className="ml-0.5">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] font-bold text-ink">$6.50</span>
                        <button
                          type="button"
                          className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-medium text-on-brand"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
