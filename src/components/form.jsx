import { useId, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, Cancel01Icon, Image01Icon } from '@hugeicons/core-free-icons'

const fieldShell =
  'relative flex flex-col justify-center gap-1 rounded-[10px] border border-line bg-white px-3 pt-2.5 pb-3 transition-colors focus-within:border-primary'

const fieldLabel = 'text-xs leading-normal font-medium text-muted'

const fieldInput =
  'w-full min-w-0 bg-transparent text-base leading-normal text-ink outline-none placeholder:text-placeholder'

/** Section heading above a group of fields ("Company Logo", "Presets", …). */
export function SectionLabel({ children, as: Tag = 'p' }) {
  return <Tag className="text-base leading-normal font-medium text-ink">{children}</Tag>
}

export function TextField({ label, className = '', inputMode, ...inputProps }) {
  const id = useId()
  return (
    <div className={`${fieldShell} ${className}`}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <input id={id} className={fieldInput} inputMode={inputMode} {...inputProps} />
    </div>
  )
}

export function SelectField({ label, options, className = '', ...selectProps }) {
  const id = useId()
  return (
    <div className={`${fieldShell} pr-10 ${className}`}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <select id={id} className={`${fieldInput} appearance-none`} {...selectProps}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={20}
        color="currentColor"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink"
      />
    </div>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex w-[50px] shrink-0 items-center rounded-[60px] p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        checked ? 'bg-primary' : 'bg-line-strong'
      }`}
    >
      <span
        className={`h-5 w-7 rounded-[60px] bg-white transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

/** Reads an image file and downsizes it so it fits comfortably in localStorage. */
function readImage(file, maxSize = 512) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      if (file.type === 'image/svg+xml') return resolve(reader.result)
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

/** Dashed drop zone from the design; shows the uploaded image once one is picked. */
export function UploadBox({ value, onChange, title, hint, accept, className = '', label }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = async (files) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    onChange(await readImage(file))
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label ?? title}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-5 overflow-clip rounded-[20px] border border-dashed px-5 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        dragging ? 'border-primary bg-primary-light' : 'border-dash hover:border-subtle'
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {value ? (
        <>
          <img src={value} alt="" className="max-h-[calc(100%-16px)] max-w-full object-contain" />
          <button
            type="button"
            aria-label="Remove image"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
            className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(0,0,0,0.12)] hover:bg-surface"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" />
          </button>
        </>
      ) : (
        <>
          <HugeiconsIcon icon={Image01Icon} size={30} color="currentColor" className="text-subtle" />
          <div className="flex w-full flex-col gap-1.5 text-center leading-normal">
            <p className="text-sm text-body">{title}</p>
            <p className="text-xs text-muted">{hint}</p>
          </div>
        </>
      )}
    </div>
  )
}
