import { CROISSANTS, CAKES } from '../landing/demo/storefrontCatalog'
import {
  ArrowDown01Icon,
  BiscuitIcon,
  Bread04Icon,
  CakeIcon,
  Coffee02Icon,
  CroissantIcon,
  Cupcake02Icon,
  DonutIcon,
  Facebook01Icon,
  FavouriteIcon,
  FilterVerticalIcon,
  Globe02Icon,
  Gps01Icon,
  InstagramIcon,
  Location01Icon,
  Mail01Icon,
  Search01Icon,
  ShoppingBasket03Icon,
  ShoppingBasketAdd03Icon,
  TwitterIcon,
} from '@hugeicons/core-free-icons'
import fire from '../assets/fire.svg'
import brandFilm from '../assets/desktop/brand-film.webp'
import hero from '../assets/desktop/hero.webp'
import logoFooter from '../assets/desktop/logo-footer.svg'
import logoNav from '../assets/desktop/logo-nav.svg'
import qr from '../assets/desktop/qr.webp'
import storeApple from '../assets/desktop/store-apple.svg'
import storePlay from '../assets/desktop/store-play.svg'
import storePlayWordmark from '../assets/desktop/store-play-wordmark.svg'
import { Icon, Star } from './phone'

/*
 * Storefront website preview (Figma "Home", the desktop variant of the preview panel): a 1440px
 * site drawn at 641.2 × 457.57, so every length below is the Figma value at that scale. It scrolls
 * inside its window like the prototype and is themed by --brand like the phones.
 */
export const DESKTOP_WIDTH = 641.2
export const DESKTOP_HEIGHT = 457.57

const FLIP = 'scaleX(-1)'

const HERO_SHADE =
  'linear-gradient(270deg, rgba(0,0,0,0) 45.158%, rgba(0,0,0,0.006) 51.623%, rgba(0,0,0,0.023) 56.885%, rgba(0,0,0,0.049) 61.128%, rgba(0,0,0,0.084) 64.537%, rgba(0,0,0,0.127) 67.298%, rgba(0,0,0,0.176) 69.595%, rgba(0,0,0,0.23) 71.615%, rgba(0,0,0,0.287) 73.542%, rgba(0,0,0,0.348) 75.562%, rgba(0,0,0,0.41) 77.86%, rgba(0,0,0,0.472) 80.621%, rgba(0,0,0,0.533) 84.03%, rgba(0,0,0,0.592) 88.273%, rgba(0,0,0,0.648) 93.534%, rgba(0,0,0,0.7) 100%)'
// Radial vignette over the brand film (Figma: 50% black fading out, layer at 80% opacity).
const FILM_SHADE = 'radial-gradient(41.74% 50% at 50% 50%, rgba(0,0,0,0.5) 40.373%, rgba(0,0,0,0) 100%)'

const money = (n) => `$${n.toFixed(2)}`

const PILL_TEXT = 'text-[5.343px] leading-normal font-semibold whitespace-nowrap'
const HEADLINE =
  'text-[21.373px] leading-normal font-medium tracking-[-0.6679px] text-white [text-shadow:0_0_33.396px_black]'

function BrandButton({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-[16.698px] items-center justify-center rounded-full bg-brand px-[6.679px] text-on-brand ${PILL_TEXT}`}>
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-[0.334px] self-stretch bg-current opacity-30" />
}

function Navbar({ logo, actions }) {
  return (
    <div className="sticky top-0 z-10 flex h-[27.162px] items-center justify-between bg-brand px-[66.792px] text-on-brand">
      <div className="flex items-center gap-[13.358px]">
        {logo ? (
          <img src={logo} alt="" className="h-[14.694px] max-w-[48px] object-contain" />
        ) : (
          // Masked so the default logo follows --on-brand (white, or dark on light brand colors).
          <span
            className="block h-[14.694px] w-[31.981px] bg-current"
            style={{ WebkitMask: `url("${logoNav}") center / contain no-repeat`, mask: `url("${logoNav}") center / contain no-repeat` }}
          />
        )}
        <div className="flex items-center gap-[3.34px]">
          <Divider />
          <button type="button" onClick={() => actions?.go("address")} className="flex items-center gap-[2.672px]">
            <Icon icon={Location01Icon} size={8.015} />
            <div className="flex flex-col gap-[0.668px] leading-normal whitespace-nowrap">
              <span className="text-[4.007px] opacity-80">Deliver to</span>
              <span className="text-[5.343px] font-semibold">{actions?.address || "Select your address"}</span>
            </div>
          </button>
          <Divider />
          <button type="button" onClick={() => actions?.go("orders")} className="flex items-center gap-[2.672px]">
            <Icon icon={Gps01Icon} size={8.015} />
            <span className={PILL_TEXT}>Track your order</span>
          </button>
        </div>
      </div>
      <div className="flex h-[16.698px] w-[120.225px] items-center justify-between rounded-full border-[0.334px] border-current bg-white/10 px-[3.34px] backdrop-blur-[3.34px]">
        <div className="flex items-center gap-[3.34px]">
          <Icon icon={Search01Icon} size={8.015} />
          <input aria-label="Search menu" className="w-[95px] bg-transparent text-[4.675px] outline-none placeholder:text-current" placeholder="Search croissant, cakes, fresh items" value={actions?.query || ""} onChange={(event) => actions?.setQuery(event.target.value)} />
        </div>
        <Icon icon={FilterVerticalIcon} size={8.015} />
      </div>
      <div className="flex items-center justify-end gap-[6.679px]">
        <div className="flex items-center gap-[2.004px]">
          <Icon icon={Globe02Icon} size={8.015} />
          <span className={PILL_TEXT}>En</span>
          <Icon icon={ArrowDown01Icon} size={5.343} />
        </div>
        <button type="button" onClick={() => actions?.go("login")} className={`flex h-[17.811px] items-center rounded-full border-[0.668px] border-current px-[6.679px] ${PILL_TEXT}`}>
          Log in
        </button>
        <button type="button" onClick={() => actions?.go("signup")} className={`flex h-[16.698px] items-center rounded-full bg-white px-[6.679px] text-brand ${PILL_TEXT}`}>
          Sign up for free delivery
        </button>
      </div>
    </div>
  )
}

function Hero({ actions }) {
  return (
    <div className="relative -mt-[1.112px] h-[267.166px] overflow-clip">
      <img src={hero} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ backgroundImage: HERO_SHADE }} />
      <div className="absolute top-1/2 left-[66.79px] flex w-[221.414px] -translate-y-1/2 flex-col items-start gap-[6.679px]">
        <p className={`whitespace-nowrap ${HEADLINE}`}>
          Oven baked freshness,
          <br />
          at your home
        </p>
        <div className="flex items-center gap-[6.679px]">
          <BrandButton onClick={() => actions?.browse()}>Browse Menu</BrandButton>
          <span className={`text-white ${PILL_TEXT}`}>or scroll down</span>
        </div>
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
    { icon: DonutIcon, label: 'Donuts', count: 6 },
  ]
  return (
    <div className="flex items-center justify-between bg-white px-[66.792px] py-[3.34px]">
      {tabs.map(({ icon, label, count }, i) => (
        <button type="button" onClick={() => actions?.browse(label)}
          key={label + i}
          className={`flex min-w-px flex-1 items-start justify-center gap-[1.336px] rounded-[20.037px] p-[4.007px] ${i === 0 ? 'bg-brand-light' : ''}`}
        >
          <div className={`flex items-center gap-[1.336px] ${i === 0 ? 'text-brand' : 'text-muted'}`}>
            <Icon icon={icon} size={8.015} />
            <span className={`max-w-[60px] truncate text-[6.679px] leading-normal ${i === 0 ? 'font-medium' : ''}`}>{label}</span>
          </div>
          <span className="text-[4.007px] leading-normal text-black opacity-40">{count}</span>
        </button>
      ))}
    </div>
  )
}

function ProductImage({ src, crop, transform, className, style }) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ transform, ...style }}>
      {crop ? (
        <img
          src={src}
          alt=""
          className="absolute max-w-none"
          style={{ width: crop.width ?? crop.size, height: crop.height ?? crop.size, left: crop.left, top: crop.top }}
        />
      ) : (
        <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
      )}
    </div>
  )
}

function ProductCard({ product, actions }) {
  const { image, crop, flip } = product
  return (
    <div className="relative flex flex-col items-center justify-center gap-[3.34px] self-start overflow-clip rounded-[6.679px] bg-brand-light px-[6.679px] pb-[6.679px]">
      <ProductImage
        src={product.glow ?? image}
        crop={product.glow ? undefined : crop}
        transform={product.glowTransform ?? (flip ? FLIP : undefined)}
        className="pointer-events-none absolute top-[calc(50%-52.19px)] left-1/2 size-[91.505px] -translate-1/2 opacity-50 blur-[16.698px]"
      />
      <button type="button" aria-label={`View ${product.name}`} onClick={() => actions?.openProduct(product)}><ProductImage src={image} crop={crop} transform={flip ? FLIP : undefined} className="pointer-events-none relative size-[53.433px] shrink-0" /></button>

      <div className="relative flex w-full items-end justify-between gap-[3.34px]">
        <div className="flex min-w-px flex-1 flex-col items-start gap-[2.004px] leading-normal text-ink">
          <p className="max-w-full truncate text-[6.679px] font-medium">{product.name}</p>
          <p className="flex items-center gap-[1.336px] whitespace-nowrap">
            <span className="text-[6.679px]">{money(product.price)}</span>
            <span className="text-[4.675px] opacity-40">/{product.unit ?? 'piece'}</span>
          </p>
          <div className="flex items-start gap-[3.34px] text-[4.675px] whitespace-nowrap">
            <span className="flex items-center gap-[0.668px]">
              <img src={fire} alt="" width={6.011} height={6.011} className="size-[6.011px]" />
              {product.kcal}kCal
            </span>
            <span className="flex items-center gap-[0.668px]">
              <Star size={6.011} />
              {product.rating}
              <span className="text-black opacity-40">({product.reviews})</span>
            </span>
          </div>
        </div>
        <button type="button" onClick={() => actions?.add(product)} className="flex h-[14.694px] w-[46.086px] shrink-0 items-center justify-center gap-[2.004px] rounded-full border-[0.334px] border-white bg-white/80 text-ink backdrop-blur-[3.34px]">
          <Icon icon={ShoppingBasketAdd03Icon} size={8.015} />
          <span className="text-[4.675px] leading-normal font-medium whitespace-nowrap">Add to cart</span>
        </button>
      </div>

      {product.isNew && (
        <span className="absolute top-[4.68px] left-[4.9px] rounded-[2.004px] bg-brand px-[1.336px] py-[0.668px] text-[4.007px] leading-normal font-semibold text-on-brand">
          NEW
        </span>
      )}
      <button type="button" aria-label={`Save ${product.name}`} aria-pressed={actions?.favorites.includes(product.name) || false} onClick={() => actions?.toggleFavorite(product)} className="absolute top-[4.68px] right-[4.79px] flex size-[14.694px] items-center justify-center rounded-full border-[0.167px] border-white/40 bg-white/40 text-ink backdrop-blur-[3.34px]">
        <Icon icon={FavouriteIcon} size={8.015} strokeWidth={1.2} />
      </button>
    </div>
  )
}

function ProductSection({ title, products, className = '', actions }) {
  return (
    <section className={`mx-[66.79px] flex flex-col gap-[6.679px] ${className}`}>
      <h3 className="text-[10.687px] leading-normal font-medium text-ink">{title}</h3>
      <div className="grid grid-cols-3 gap-[6.679px]">
        {products.map((product, i) => (
          <ProductCard key={product.name + i} product={product} actions={actions} />
        ))}
      </div>
    </section>
  )
}

function StoreBadge({ children, className }) {
  return (
    <span className={`flex items-center overflow-clip rounded-[2.004px] border-[0.334px] border-black bg-white ${className}`}>
      {children}
    </span>
  )
}

/** "Get exclusive discounts & rewards on our app." strip with store badges and a QR code. */
function AppPromo() {
  return (
    <div className="mt-[26.832px] flex bg-brand-light px-[80.15px] py-[20.037px]">
      <div className="flex min-w-px flex-1 flex-col items-start gap-[13.358px]">
        <div className="flex w-full flex-col gap-[4.675px] leading-normal">
          <p className="text-[12.022px] font-bold text-brand">Get exclusive discounts &amp; rewards on our app.</p>
          <p className="text-[6.679px] whitespace-nowrap text-ink">
            Save more with every order — download now and enjoy free delivery on your first 3 orders.
          </p>
        </div>
        <div className="flex flex-col items-start justify-center gap-[13.358px]">
          <div className="flex items-center gap-[3.34px] text-black">
            <StoreBadge className="gap-[2.338px] px-[2.672px] py-[1.67px]">
              <img src={storePlay} alt="" width={7.013} height={8.015} className="h-[8.015px] w-[7.013px]" />
              <span className="flex flex-col items-start gap-[1.002px]">
                <span className="text-[3.34px] leading-normal uppercase">Get it on</span>
                <img src={storePlayWordmark} alt="Google Play" width={24.713} height={5.009} className="h-[5.009px] w-[24.713px] -scale-y-100" />
              </span>
            </StoreBadge>
            <StoreBadge className="gap-[2.672px] px-[2.004px] py-[2.338px]">
              <img src={storeApple} alt="" width={6.679} height={8.015} className="h-[8.015px] w-[6.679px]" />
              <span className="flex w-[26.049px] flex-col items-start font-sf font-medium">
                <span className="text-[3.006px] leading-[3.006px]">Download on the</span>
                <span className="text-[6.011px] leading-none tracking-[-0.157px]">App Store</span>
              </span>
            </StoreBadge>
          </div>
          <div className="flex flex-col items-start gap-[3.34px]">
            <span className="text-[4.675px] leading-normal whitespace-nowrap text-ink opacity-40">Or scan to download</span>
            <span className="relative size-[36.401px] overflow-hidden">
              <img src={qr} alt="" className="absolute top-[-10.98%] left-[-10.98%] size-[121.95%] max-w-none" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandFilm({ actions }) {
  return (
    <div className="relative mt-[26.832px] h-[233.771px] overflow-hidden">
      <img src={brandFilm} alt="" className="absolute top-[-51.78%] left-[0.01%] h-[203.56%] w-[99.98%] max-w-none" />
      <div className="absolute inset-0 opacity-80" style={{ backgroundImage: FILM_SHADE }} />
      <div className="absolute top-1/2 left-[calc(50%+0.16px)] flex w-[221.414px] -translate-1/2 flex-col items-center gap-[6.679px]">
        <p className={`text-center ${HEADLINE}`}>Baked with precision, care and love for you</p>
        <div className="flex flex-col items-center gap-[6.679px]">
          <BrandButton onClick={() => actions?.browse()}>Order Now</BrandButton>
          <span className="text-[5.343px] leading-normal whitespace-nowrap text-white italic">Free Delivery*</span>
        </div>
      </div>
    </div>
  )
}

const FOOTER_COLUMNS = [
  { title: 'About', links: ['Our story', 'Bakery', 'Careers'] },
  { title: 'Menu', links: ['Croissants', 'Cakes', 'Coffee'] },
  { title: 'Locations', links: ['Find a bakery', 'Delivery zones', 'Pickup'] },
  { title: 'Contact', links: ['Support', 'Press', 'Partners'] },
]

function Footer({ logo }) {
  return (
    // Figma's footer is a deep brown for the orange sample brand; derived from --brand here.
    <div className="flex flex-col gap-[13.358px] bg-[color-mix(in_oklab,var(--brand)_40%,#24150f)] px-[66.792px] pt-[21.373px] pb-[13.358px] text-white">
      <div className="flex w-full items-start gap-[26.717px] text-[4.675px] leading-normal">
        <div className="flex w-[120.225px] shrink-0 flex-col items-start gap-[5.343px]">
          {logo ? (
            <img src={logo} alt="" className="h-[17.633px] max-w-[48px] object-contain" />
          ) : (
            <img src={logoFooter} alt="" width={24.446} height={17.633} className="h-[17.633px] w-[24.446px]" />
          )}
          <p className="leading-[1.5] opacity-90">
            Freshly baked, delivered to your door. From classic butter to seasonal specials — every bite is made with care.
          </p>
          <div className="flex items-center gap-[4.007px]">
            {[InstagramIcon, Facebook01Icon, TwitterIcon].map((icon, i) => (
              <span key={i} className="flex size-[13.358px] items-center justify-center rounded-full bg-brand-light text-brand">
                <Icon icon={icon} size={6.011} />
              </span>
            ))}
          </div>
        </div>
        <div className="flex min-w-px flex-1 items-start gap-[21.373px] whitespace-nowrap">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col items-start gap-[4.007px]">
              <p className="font-semibold">{column.title}</p>
              {column.links.map((link) => (
                <p key={link} className="opacity-90">
                  {link}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="flex w-[120.225px] shrink-0 flex-col items-start gap-[4.007px]">
          <p className="font-semibold">Newsletter</p>
          <p className="leading-[1.5] opacity-90">Get new drops, seasonal specials, and early access to limited batches.</p>
          <div className="flex w-full items-center gap-[4.007px]">
            <span className="flex h-[16.03px] min-w-px flex-1 items-center gap-[3.34px] rounded-full border-[0.334px] border-[#e5e7eb] px-[4.675px]">
              <Icon icon={Mail01Icon} size={6.011} />
              <span className="opacity-90">Email address</span>
            </span>
            <span className="flex h-[16.03px] items-center rounded-full bg-brand px-[6.011px] font-semibold text-on-brand">Subscribe</span>
          </div>
          <p className="text-[4.007px] opacity-90">By subscribing, you agree to our Terms and Privacy Policy.</p>
        </div>
      </div>
      <div className="h-[0.334px] w-full bg-white/30" />
      <div className="flex w-full items-center justify-between text-[4.341px] leading-normal whitespace-nowrap">
        <p className="opacity-90">© 2026 Bake my App. All rights reserved.</p>
        <div className="flex items-center gap-[5.343px] opacity-90">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
        </div>
      </div>
    </div>
  )
}

/** The onboarding answers replace the first croissant, like the phone preview. */
function croissantsFor(summary) {
  const first = summary?.products?.[0]
  if (!first?.isUserItem) return CROISSANTS
  return [{ ...CROISSANTS[0], name: first.name, price: first.price, image: first.image }, ...CROISSANTS.slice(1)]
}

/** `framed` draws the preview window; the website demo passes `framed={false}` and its own height. */
export function DesktopScreen({ summary, logo, height = DESKTOP_HEIGHT, framed = true, actions }) {
  return (
    <div
      role={actions ? undefined : "img"}
      aria-label="Storefront website preview"
      className={`relative overflow-hidden bg-white font-inter ${framed ? 'rounded-[15.052px] shadow-[0_3.01px_22.577px_rgba(0,0,0,0.1)]' : ''}`}
      style={{ width: DESKTOP_WIDTH, height }}
    >
      <div className="h-full overflow-x-clip overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Navbar logo={logo} actions={actions} />
        <Hero actions={actions} />
        <CategoryTabs actions={actions} firstLabel={summary?.categoryLabel ?? 'Croissants'} firstCount={summary?.products?.length ?? 5} />
        <ProductSection actions={actions} title="Original Hand-Tossed Croissants" products={croissantsFor(summary)} className="mt-[9.017px]" />
        <AppPromo />
        <ProductSection actions={actions} title="Freshly Baked Cakes" products={CAKES} className="mt-[8.126px]" />
        <BrandFilm actions={actions} />
        <Footer logo={logo} />
      </div>
      <button type="button" onClick={() => actions?.go("cart")} className="absolute top-[46.087px] right-0 flex items-center gap-[2.004px] rounded-l-full bg-white py-[4.675px] pr-[13.358px] pl-[8.015px] text-ink drop-shadow-[0_0_13.358px_rgba(0,0,0,0.25)]">
        <Icon icon={ShoppingBasket03Icon} size={10.687} />
        <span className="text-[6.679px] leading-normal font-medium whitespace-nowrap">Cart ({actions ? actions.count : 2})</span>
      </button>
    </div>
  )
}
