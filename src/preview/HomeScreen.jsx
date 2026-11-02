import {
  ArrowDown01Icon,
  BiscuitIcon,
  Bread04Icon,
  CakeIcon,
  Coffee02Icon,
  CroissantIcon,
  Cupcake02Icon,
  FavouriteIcon,
  FilterVerticalIcon,
  BellIcon,
  Search01Icon,
  ShoppingBasketAdd03Icon,
} from '@hugeicons/core-free-icons'
import fire from '../assets/fire.svg'
import { BgGlow, Icon, PhoneFrame, Star, TabBar, glass } from './phone'

function Header({ logo, mark, address, actions }) {
  return (
    <div className="absolute top-0 left-0 flex h-[115.2px] w-full flex-col items-center justify-end gap-[6px] overflow-clip rounded-b-[18px] bg-white px-[9.6px] pb-[9.6px]">
      <BgGlow />
      <div className="relative flex w-full items-center gap-[6px]">
        <div className="flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-[60px] bg-brand text-on-brand">
          {logo ? (
            <img src={logo} alt="" className="size-full bg-white object-contain p-[3px]" />
          ) : mark ? (
            <img src={mark} alt="" width={23.868} height={17.238} className="h-[17.238px] w-[23.868px]" />
          ) : (
            <Icon icon={CroissantIcon} size={19.2} />
          )}
        </div>
        <button type="button" onClick={() => actions?.go("address")} className={`flex h-[30px] min-w-px flex-1 items-center justify-center gap-[4.8px] rounded-[60px] px-[6px] text-ink ${glass}`}>
          <div className="flex min-w-0 flex-col items-center gap-[1.2px] leading-normal whitespace-nowrap">
            <span className="text-[6px] opacity-60">Deliver to</span>
            <span className="max-w-full truncate text-[8.4px] font-medium" title={address || '742 Evergreen Terrace, Springfield'}>
              {address || '742 Evergreen Terrace, Springfield'}
            </span>
          </div>
          <Icon icon={ArrowDown01Icon} size={9.6} />
        </button>
        <button type="button" aria-label="Notifications" onClick={() => actions?.go("notifications")} className={`flex size-[30px] shrink-0 items-center justify-center rounded-[60px] text-ink ${glass}`}>
          <Icon icon={BellIcon} size={14.4} />
        </button>
      </div>
      <div className={`relative flex h-[30px] w-full items-center justify-between rounded-[60px] px-[6px] ${glass}`}>
        <div className="flex items-center gap-[6px] text-subtle">
          <Icon icon={Search01Icon} size={14.4} />
          <input aria-label="Search menu" className="min-w-0 w-[175px] bg-transparent text-[8.4px] outline-none" placeholder="Search croissant, cakes, fresh items" onChange={(event) => actions?.setQuery(event.target.value)} />
        </div>
        <Icon icon={FilterVerticalIcon} size={14.4} className="text-ink" />
      </div>
    </div>
  )
}

function CategoryTabs({ firstLabel, firstCount, actions }) {
  const tabs = [
    { icon: CroissantIcon, label: firstLabel, count: firstCount },
    { icon: CakeIcon, label: 'Cakes', count: 8 },
    { icon: Coffee02Icon, label: 'Coffee', count: 16 },
    { icon: Bread04Icon, label: 'Bread', count: 4 },
    { icon: Cupcake02Icon, label: 'Cupcakes', count: 10 },
    { icon: BiscuitIcon, label: 'Cookies', count: 8 },
    { icon: BiscuitIcon, label: 'Donuts', count: 6 },
  ]
  return (
    <div className="flex w-full items-center gap-[6px] overflow-x-auto">
      {tabs.map(({ icon, label, count }, i) => (
        <button type="button" onClick={() => actions?.browse(label)}
          key={label + i}
          className={`flex shrink-0 items-start gap-[2.4px] rounded-[36px] px-[7.2px] py-[4.8px] ${i === 0 ? 'bg-brand-light' : ''}`}
        >
          <div className={`flex items-center gap-[2.4px] ${i === 0 ? 'text-brand' : 'text-muted'}`}>
            <Icon icon={icon} size={12} />
            <span className={`text-[9.6px] leading-normal whitespace-nowrap ${i === 0 ? 'font-medium' : ''}`}>
              {label}
            </span>
          </div>
          <span className="text-[6px] leading-normal text-black opacity-40">{count}</span>
        </button>
      ))}
    </div>
  )
}

function ProductImage({ product, className }) {
  const { image, zoomed, flipped } = product
  return (
    <div className={`${className} ${flipped ? '-scale-x-100' : ''}`}>
      {zoomed ? (
        <div className="absolute inset-0 overflow-hidden">
          <img src={image} alt="" className="absolute top-[-17.98%] left-[-17.98%] size-[135.96%] max-w-none" />
        </div>
      ) : (
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      )}
    </div>
  )
}

function ProductCard({ product, actions }) {
  return (
    <div className="relative flex h-[96px] w-full shrink-0 flex-col items-start justify-between overflow-clip rounded-[12px] bg-brand-light p-[8.4px]">
      <ProductImage
        product={product}
        className="pointer-events-none absolute top-[calc(50%+0.6px)] left-[calc(50%+82.8px)] size-[164.4px] -translate-x-1/2 -translate-y-1/2 opacity-50 blur-[30px]"
      />
      <ProductImage
        product={product}
        className="pointer-events-none absolute top-1/2 left-[calc(50%+61.8px)] size-[96px] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative flex w-full flex-col items-start gap-[3.6px] leading-normal text-ink">
        <button type="button" onClick={() => actions?.openProduct(product)} className="max-w-[120px] truncate text-[9.6px] font-medium">{product.name}</button>
        <p className="flex items-center gap-[2.4px] whitespace-nowrap">
          <span className="text-[9.6px]">${Number.isInteger(product.price) ? product.price : product.price.toFixed(2)}</span>
          <span className="text-[8.4px] opacity-40">/piece</span>
        </p>
        <div className="flex items-start gap-[6px] text-[6px] whitespace-nowrap">
          <span className="flex items-center gap-[1.2px]">
            <img src={fire} alt="" width={7.2} height={7.2} className="size-[7.2px]" />
            60kCal
          </span>
          <span className="flex items-center gap-[1.2px]">
            <Star size={7.2} />
            4.7
            <span className="text-black opacity-40">(1.2k+)</span>
          </span>
        </div>
      </div>

      <button type="button" aria-label={`Add ${product.name} to cart`} onClick={() => actions?.add(product)} className={`relative flex size-[30px] items-center justify-center rounded-[60px] text-ink ${glass}`}>
        <Icon icon={ShoppingBasketAdd03Icon} size={14.4} />
      </button>

      {product.isNew && (
        <span className="absolute top-[9px] left-[93px] rounded-[3.6px] bg-brand px-[2.4px] py-[1.2px] text-center text-[6px] leading-normal font-semibold text-on-brand">
          NEW
        </span>
      )}
      <button type="button" aria-label={`Save ${product.name}`} aria-pressed={actions?.favorites.includes(product.name) || false} onClick={() => actions?.toggleFavorite(product)} className="absolute top-[8.4px] left-[198px] flex size-[14.4px] items-center justify-center rounded-full border-[0.3px] border-white/20 bg-white/40 text-ink backdrop-blur-[6px]">
        <Icon icon={FavouriteIcon} size={9.6} strokeWidth={1.44} />
      </button>
    </div>
  )
}

/** `logo` is an uploaded store logo (on white); `mark` a white glyph drawn on the brand circle. */
export function HomeScreen({ summary, logo, mark, address, actions }) {
  return (
    <PhoneFrame interactive={!!actions} label="Storefront home screen preview">
      <Header actions={actions} logo={logo} mark={mark} address={address || summary?.address} />
      <div className="absolute top-[127.2px] bottom-[60px] left-[9.6px] flex w-[222px] flex-col items-start gap-[12px] overflow-y-auto">
        <CategoryTabs actions={actions} firstLabel={summary.categoryLabel} firstCount={summary.products.length} />
        <div className="flex w-full flex-col gap-[6px]">
          {summary.products.map((product, i) => (
            <ProductCard key={product.name + i} product={product} actions={actions} />
          ))}
        </div>
      </div>
      {!actions && <TabBar active="home" />}
    </PhoneFrame>
  )
}
