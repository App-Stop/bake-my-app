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
import { BgGlow, Icon, PhoneFrame, TabBar, glass } from './phone'

function Star() {
  return (
    <svg width="7.2" height="7.2" viewBox="0 0 7.2 7.2" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M4.11833 1.03325L4.64627 2.09786C4.71827 2.24606 4.91024 2.38821 5.07224 2.41543L6.02912 2.57572C6.64106 2.67856 6.78506 3.12618 6.34409 3.56775L5.60018 4.31781C5.47418 4.44483 5.40521 4.68981 5.44418 4.86525L5.65718 5.79375C5.82515 6.52869 5.43818 6.813 4.79327 6.42888L3.89636 5.89356C3.73439 5.79678 3.46742 5.79678 3.30242 5.89356L2.40553 6.42888C1.7636 6.813 1.37364 6.52566 1.54163 5.79375L1.7546 4.86525C1.7936 4.68981 1.7246 4.44483 1.59862 4.31781L0.854701 3.56775C0.416749 3.12618 0.557734 2.67856 1.16966 2.57572L2.12656 2.41543C2.28554 2.38821 2.47752 2.24606 2.54951 2.09786L3.07745 1.03325C3.36542 0.455582 3.83336 0.455582 4.11833 1.03325Z"
        fill="var(--brand)"
      />
    </svg>
  )
}

function Header({ logo, address }) {
  return (
    <div className="absolute top-0 left-0 flex h-[115.2px] w-full flex-col items-center justify-end gap-[6px] overflow-clip rounded-b-[18px] bg-white px-[9.6px] pb-[9.6px]">
      <BgGlow />
      <div className="relative flex w-full items-center gap-[6px]">
        <div className="flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-[60px] bg-brand text-on-brand">
          {logo ? (
            <img src={logo} alt="" className="size-full bg-white object-contain p-[3px]" />
          ) : (
            <Icon icon={CroissantIcon} size={19.2} />
          )}
        </div>
        <div className={`flex h-[30px] min-w-px flex-1 items-center justify-center gap-[4.8px] rounded-[60px] px-[6px] text-ink ${glass}`}>
          <div className="flex flex-col items-center gap-[1.2px] leading-normal whitespace-nowrap">
            <span className="text-[6px] opacity-60">Deliver to</span>
            <span className="text-[8.4px] font-medium truncate max-w-[110px]" title={address || '742 Evergreen Terrace, Springfield'}>
              {address || '742 Evergreen Terrace, Springfield'}
            </span>
          </div>
          <Icon icon={ArrowDown01Icon} size={9.6} />
        </div>
        <div className={`flex size-[30px] shrink-0 items-center justify-center rounded-[60px] text-ink ${glass}`}>
          <Icon icon={BellIcon} size={14.4} />
        </div>
      </div>
      <div className={`relative flex h-[30px] w-full items-center justify-between rounded-[60px] px-[6px] ${glass}`}>
        <div className="flex items-center gap-[6px] text-subtle">
          <Icon icon={Search01Icon} size={14.4} />
          <span className="text-[8.4px] leading-normal whitespace-nowrap">Search croissant, cakes, fresh items</span>
        </div>
        <Icon icon={FilterVerticalIcon} size={14.4} className="text-ink" />
      </div>
    </div>
  )
}

function CategoryTabs({ firstLabel, firstCount }) {
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
    <div className="flex w-full items-center gap-[6px]">
      {tabs.map(({ icon, label, count }, i) => (
        <div
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
        </div>
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

function ProductCard({ product }) {
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
        <p className="max-w-[120px] truncate text-[9.6px] font-medium">{product.name}</p>
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
            <Star />
            4.7
            <span className="text-black opacity-40">(1.2k+)</span>
          </span>
        </div>
      </div>

      <div className={`relative flex size-[30px] items-center justify-center rounded-[60px] text-ink ${glass}`}>
        <Icon icon={ShoppingBasketAdd03Icon} size={14.4} />
      </div>

      {product.isNew && (
        <span className="absolute top-[9px] left-[93px] rounded-[3.6px] bg-brand px-[2.4px] py-[1.2px] text-center text-[6px] leading-normal font-semibold text-on-brand">
          NEW
        </span>
      )}
      <div className="absolute top-[8.4px] left-[198px] flex size-[14.4px] items-center justify-center rounded-full border-[0.3px] border-white/20 bg-white/40 text-ink backdrop-blur-[6px]">
        <Icon icon={FavouriteIcon} size={9.6} strokeWidth={1.44} />
      </div>
    </div>
  )
}

export function HomeScreen({ summary, logo, address }) {
  return (
    <PhoneFrame label="Storefront home screen preview">
      <Header logo={logo} address={address || summary?.address} />
      <div className="absolute top-[127.2px] left-[9.6px] flex w-[222px] flex-col items-start gap-[12px]">
        <CategoryTabs firstLabel={summary.categoryLabel} firstCount={summary.products.length} />
        <div className="flex w-full flex-col gap-[6px]">
          {summary.products.map((product, i) => (
            <ProductCard key={product.name + i} product={product} />
          ))}
        </div>
      </div>
      <TabBar active="home" />
    </PhoneFrame>
  )
}
