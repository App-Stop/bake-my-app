import { ArrowRight02Icon, Delete02Icon, DiscountIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import caramelSauce from '../assets/addons/caramel-sauce.png'
import chocolateSyrup from '../assets/addons/chocolate-syrup.png'
import whippedCream from '../assets/addons/whipped-cream.png'
import deliveryRider from '../assets/delivery-rider.png'
import { formatMoney } from '../onboarding/useOnboardingState'
import { Icon, PhoneFrame, TabBar, glass } from './phone'

const ADD_ONS = [
  { name: 'Chocolate Syrup', price: '+$3', image: chocolateSyrup, contain: true },
  { name: 'Caramel Sauce', price: '+$2.50', image: caramelSauce },
  { name: 'Whipped Cream', price: '+$1.50', image: whippedCream },
]

const price = (n) => (Number.isInteger(n) ? `$${n}` : formatMoney(n))

function CartItem({ item }) {
  return (
    <div className="flex w-full flex-col items-end justify-center gap-[2.4px] rounded-[12px] bg-white p-[8.4px]">
      <div className="flex w-full items-center gap-[12px]">
        <div className="relative size-[31.2px] shrink-0 overflow-hidden">
          {item.zoomed ? (
            <img src={item.image} alt="" className="absolute top-[-17.98%] left-[-17.98%] size-[135.96%] max-w-none" />
          ) : (
            <img src={item.image} alt="" className="absolute inset-0 size-full object-cover" />
          )}
        </div>
        <div className="flex min-w-px flex-1 flex-col items-start gap-[2.4px] leading-normal">
          <p className="w-full truncate text-[9.6px] font-medium text-ink">{item.name}</p>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[3.6px] whitespace-nowrap">
              <span className="text-[9.6px] font-medium text-ink">{price(item.price)}</span>
              <span className="text-[8.4px] text-strike line-through">{price(item.compareAt)}</span>
              <span className="rounded-[3.6px] bg-brand-light px-[2.4px] py-[1.2px] text-[6px] font-semibold text-brand">
                20% OFF
              </span>
            </div>
            <div className="flex items-center justify-center gap-[3.6px] rounded-[60px] bg-surface px-[6px] py-[3.6px] text-ink">
              <Icon icon={Delete02Icon} size={10.8} />
              <span className="w-[12px] text-center text-[7.2px] font-semibold">{item.qty}</span>
              <Icon icon={PlusSignIcon} size={10.8} />
            </div>
          </div>
        </div>
      </div>
      <p className="text-[6px] leading-normal font-medium whitespace-nowrap text-ink">
        Add {item.nudge} more to <span className="text-brand">get 10% off</span>
      </p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex w-full items-start justify-between text-[8.4px] leading-normal whitespace-nowrap">
      <span className="text-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

export function CartScreen({ summary }) {
  const { cartItems } = summary

  return (
    <PhoneFrame label="Storefront cart screen preview">
      <div className="absolute top-[43.2px] left-0 flex w-full flex-col items-start gap-[18px]">
        <div className="flex w-full flex-col items-start gap-[6px] px-[9.6px] leading-normal">
          <p className="text-[14.4px] font-semibold text-ink">Cart ({cartItems.length})</p>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[3.6px]">
              <img src={deliveryRider} alt="" className="size-[19.2px] -scale-x-100 object-cover" />
              <div className="flex flex-col gap-[2.4px] font-medium whitespace-nowrap">
                <span className="text-[7.2px] text-muted">
                  {summary.allowPickup ? 'Deliver to · Pickup available' : 'Deliver to'}
                </span>
                <span className="text-[8.4px] text-ink">742 Evergreen Terrace, Texas</span>
              </div>
            </div>
            <span
              className={`flex h-[19.2px] items-center justify-center rounded-[60px] px-[6px] text-[8.4px] font-medium text-ink shadow-[0_0_24px_rgba(0,0,0,0.1)] ${glass}`}
            >
              Change
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[6px] px-[9.6px] drop-shadow-[0_2.4px_9px_rgba(0,0,0,0.1)]">
          {cartItems.map((item, i) => (
            <CartItem key={item.name + i} item={item} />
          ))}
          <div className="flex w-full items-center justify-center gap-[6px] rounded-[12px] bg-white px-[8.4px] py-[6px] text-ink">
            <Icon icon={PlusSignIcon} size={12} />
            <span className="text-[8.4px] leading-normal font-medium">Add more items</span>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[6px] px-[9.6px] leading-normal">
          <p className="text-[9.6px] font-semibold text-ink">Frequently bought together</p>
          {ADD_ONS.map((addOn) => (
            <div key={addOn.name} className="flex w-full items-center gap-[6px] bg-white">
              <img
                src={addOn.image}
                alt=""
                className={`size-[19.2px] shrink-0 ${addOn.contain ? 'object-contain' : 'object-cover'}`}
              />
              <span className="min-w-px flex-1 text-[8.4px] text-ink">{addOn.name}</span>
              <span className="text-[8.4px] font-medium text-ink">{addOn.price}</span>
              <span className="flex size-[20px] items-center justify-center rounded-[60px] bg-surface text-ink">
                <Icon icon={PlusSignIcon} size={12} />
              </span>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col items-start gap-[8.4px] px-[9.6px] py-[6px]">
          <Row label="Subtotal" value={summary.subtotal.toFixed(2)} />
          <Row
            label={`Delivery Fee (${summary.deliveryEta.replace('minutes', 'min')})`}
            value={summary.freeDelivery ? 'Free' : formatMoney(summary.deliveryCharge)}
          />
          <Row label={summary.taxLabel} value={`${formatMoney(summary.tax)} (${summary.taxRate}%)`} />
          <div className="flex w-full items-center justify-between rounded-[6px] border-[0.6px] border-line-strong px-[6px] py-[8.4px] text-[8.4px] leading-normal whitespace-nowrap">
            <span className="font-medium text-placeholder">Enter promo code</span>
            <span className="font-semibold text-brand">Apply</span>
          </div>
          <div className="flex w-full items-center justify-center gap-[1.2px] rounded-[3.6px] bg-brand-light px-[2.4px] py-[3.6px] text-brand">
            <Icon icon={DiscountIcon} size={10.8} />
            <span className="text-[7.2px] leading-normal font-semibold whitespace-nowrap">
              You’ve saved $15.96 with discounts
            </span>
          </div>
        </div>
      </div>

      <TabBar active="cart">
        <div className="absolute bottom-[51.3px] left-1/2 flex w-[222px] -translate-x-1/2 flex-col items-center gap-[6px] overflow-clip rounded-[18px] bg-white px-[9.6px] py-[8.4px] shadow-[0_2.4px_18px_rgba(0,0,0,0.1)]">
          <div className="flex w-full items-center justify-between leading-normal whitespace-nowrap text-ink">
            <span className="text-[9.6px]">Total</span>
            <span className="text-[14.4px] font-medium">{formatMoney(summary.total)}</span>
          </div>
          <div className="flex h-[32.4px] w-full items-center justify-center gap-[6px] rounded-[60px] bg-brand py-[8.4px] pr-[2.4px] pl-[6px] text-on-brand">
            <span className="text-[9.6px] leading-normal font-semibold">Checkout</span>
            <Icon icon={ArrowRight02Icon} size={14.4} />
          </div>
        </div>
      </TabBar>
    </PhoneFrame>
  )
}
