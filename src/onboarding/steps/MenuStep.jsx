import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import avoid1 from '../../assets/guidelines/avoid-1.png'
import avoid2 from '../../assets/guidelines/avoid-2.png'
import avoid3 from '../../assets/guidelines/avoid-3.png'
import { SectionLabel, TextField, UploadBox } from '../../components/form'
import { StepShell } from '../StepShell'

const AVOID_EXAMPLES = [
  { src: avoid1, alt: 'Busy background behind the product' },
  { src: avoid2, alt: 'Several products in one shot' },
  { src: avoid3, alt: 'Product cropped or partially hidden' },
]

function ImageGuidelines() {
  return (
    <div className="flex min-w-0 flex-col justify-center gap-2.5">
      <div className="flex flex-col gap-1">
        <p className="text-xs leading-normal font-medium text-muted">Guidelines:</p>
        <ol className="list-decimal text-sm leading-normal text-ink">
          <li className="ms-[21px]">Product image must have a transparent background</li>
          <li className="ms-[21px]">Only the product must be visible in the image</li>
        </ol>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs leading-normal font-medium text-muted">What to avoid:</p>
        <ul className="flex gap-2.5">
          {AVOID_EXAMPLES.map(({ src, alt }) => (
            <li
              key={src}
              className="relative flex size-[54px] shrink-0 items-end justify-end rounded-[10px] border border-black/20 p-1"
            >
              <img src={src} alt={alt} className="absolute inset-0 size-full rounded-[10px] object-cover" />
              <span className="relative flex size-4 items-center justify-center rounded-full bg-white/90 text-primary">
                <HugeiconsIcon icon={Cancel01Icon} size={10} strokeWidth={4.8} color="currentColor" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function MenuStep({ state, actions, onBack, onNext }) {
  const { category, item } = state.menu
  const set = (key) => (e) => actions.updateItem({ [key]: e.target.value })
  const itemCount = item.name.trim() ? 1 : 0

  return (
    <StepShell
      step={2}
      title="Add your first menu items"
      description="Get started by adding a category and a few products. You can add more from your dashboard later."
      onBack={onBack}
      onNext={onNext}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Category</SectionLabel>
          <TextField
            label="Category Name"
            placeholder="Croissants"
            value={category}
            onChange={(e) => actions.setCategory(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <SectionLabel>Items ({itemCount})</SectionLabel>
          <div className="flex flex-col gap-5 overflow-clip rounded-[10px] bg-surface p-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap gap-2.5">
                <TextField
                  className="min-w-[180px] flex-1"
                  label="Item Name"
                  placeholder="Chocolate Croissant"
                  value={item.name}
                  onChange={set('name')}
                />
                <div className="flex min-w-[220px] flex-1 gap-2.5">
                  <TextField
                    className="min-w-0 flex-1"
                    label="Price"
                    placeholder="$10.00"
                    inputMode="decimal"
                    value={item.price}
                    onChange={set('price')}
                  />
                  <TextField
                    className="min-w-0 flex-1"
                    label="Time to prepare"
                    placeholder="25min"
                    value={item.prepTime}
                    onChange={set('prepTime')}
                  />
                </div>
              </div>
              <TextField
                label="Description"
                placeholder="Classic chocolate coated and filled croissants."
                value={item.description}
                onChange={set('description')}
              />
            </div>

            <div className="flex flex-wrap items-start gap-5">
              <UploadBox
                className="size-40 shrink-0 bg-white"
                value={item.image}
                onChange={(image) => actions.updateItem({ image })}
                accept="image/png,image/jpeg"
                title="Upload image"
                hint="PNG or JPG"
                label="Upload product image"
              />
              <ImageGuidelines />
            </div>
          </div>
        </div>

        <p className="text-base leading-normal text-muted">
          You can add more items from the Menu section in your dashboard.
        </p>
      </div>
    </StepShell>
  )
}
