import { Composite, CtaPair, Deco, HeartItem } from '../ui'
import { CONTAINER, GAP, TYPE, asset } from '../styles'

function CustomerApp() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start">
      <div className={`flex flex-col lg:mt-[calc(57*var(--u))] lg:w-[49.39%] ${GAP[40]}`}>
        <div className={`flex flex-col text-ink ${GAP[30]}`}>
          <h2 className={TYPE.h2}>your cafe, right on their home screen</h2>
          <p className={TYPE.body}>
            Your regulars search for your name on the App Store or Google Play, tap your icon, and order ahead. No
            line, no wait. They earn points every visit and get a ping when the cinnamon rolls come out of the oven.
          </p>
        </div>
        <ul className={`flex flex-col ${GAP[30]}`}>
          <HeartItem title="1-tap checkout">Apple Pay and Google Pay, so nobody has to type in a card.</HeartItem>
          <HeartItem title="Loyalty that brings them back">
            Set your own rewards, like 100 points for a free morning pastry.
          </HeartItem>
          <HeartItem title="Yours, top to bottom">Your logo, colors, icon and menu.</HeartItem>
        </ul>
        <CtaPair label="Put my cafe in the App Store" />
      </div>
      <Composite
        src={asset('mobile-app.webp')}
        alt="Customer ordering app with product cards"
        box={{ w: 672.44, h: 700 }}
        art={{ x: 0, y: -120, w: 672, h: 960 }}
        className="mx-auto mt-[max(96*var(--m),160*var(--u))] w-full max-w-[calc(672*var(--px))] lg:mt-0 lg:ml-[6.28%] lg:w-[41%] lg:max-w-none"
      />
    </div>
  )
}

function CustomerWebsite() {
  return (
    <div className="flex flex-col-reverse lg:flex-row lg:items-start">
      <Composite
        src={asset('website.webp')}
        alt="Customer ordering website on your own domain"
        box={{ w: 664, h: 607.67 }}
        art={{ x: -120, y: -44, w: 904, h: 702 }}
        className="mx-auto mt-[max(56*var(--m),100*var(--u))] w-full max-w-[calc(664*var(--px))] lg:mt-0 lg:w-[40.49%] lg:max-w-none"
      />
      <div className={`flex flex-col lg:mt-[calc(15*var(--u))] lg:ml-[10.12%] lg:w-[49.39%] ${GAP[40]}`}>
        <div className={`flex flex-col text-ink ${GAP[30]}`}>
          <h2 className={TYPE.h2}>Free setup. No contracts. We do the techy part.</h2>
          <p className={TYPE.body}>
            Customers who don&apos;t want to download anything can still order from your own domain, with the same
            menu, rewards and checkout. Every order lands in the same place.
          </p>
        </div>
        <ul className={`flex flex-col ${GAP[30]}`}>
          <HeartItem title="Your domain, your orders">No marketplace sits between you and your customer.</HeartItem>
          <HeartItem title="Same points, everywhere">
            Rewards carry over between the website and the app.
          </HeartItem>
          <HeartItem title="Fully customizable">
            Change the menu, banner and colors whenever you like.
          </HeartItem>
        </ul>
        <CtaPair label="Take orders on my own site" demoLabel="Try a live bakery website" />
      </div>
    </div>
  )
}

function KitchenStation() {
  return (
    <section
      aria-labelledby="kitchen-title"
      data-nav-theme="dark"
      className="relative mt-[max(64*var(--m),153*var(--u))] overflow-hidden"
    >
      {/* Photo export already includes the 20% brand-purple overlay from Figma. */}
      <img
        src={asset('kitchen-bg.webp')}
        alt=""
        aria-hidden="true"
        width={3840}
        height={2688}
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <div className="relative mx-auto max-w-[1920px]">
        <img
          src={asset('kitchen-staff.webp')}
          alt="Barista using the kitchen order station"
          width={722}
          height={538}
          loading="lazy"
          className="absolute top-[calc(97*var(--u))] left-[55.104%] hidden h-auto w-[37.604%] lg:block"
        />
        <div
          className={`relative ${CONTAINER} pt-[max(72*var(--m),233*var(--u))] pb-[max(56*var(--m),180*var(--u))]`}
        >
          <div className={`flex flex-col text-white lg:max-w-[59.7%] ${GAP[30]}`}>
            <h2 id="kitchen-title" className={`${TYPE.h2} drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]`}>
              one screen, zero lost tickets
            </h2>
            <p className={`${TYPE.body} drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]`}>
              Orders from your app, website and counter all show up on one screen your bakers and baristas can read
              at a glance. It runs on any iPad, Android tablet or touchscreen you already have.
            </p>
            <CtaPair
              label="End the ticket chaos"
              demoLabel="Try a live kitchen station"
              tone="photo"
              demoClassName="!border !border-white/20 !bg-white/20 !shadow-none backdrop-blur-[10px]"
            />
          </div>

          <div className="relative mt-[max(32*var(--m),60*var(--u))] flex flex-col gap-5 drop-shadow-[0_10px_60px_rgba(85,76,241,0.1)] md:flex-row">
            <img
              src={asset('kitchen-orders.webp')}
              alt="Order station: live order queue with order details"
              width={1624}
              height={1214}
              loading="lazy"
              className="h-auto w-full min-w-0 md:flex-1"
            />
            <img
              src={asset('kitchen-menu.webp')}
              alt="Order station: menu stock toggles"
              width={1624}
              height={1214}
              loading="lazy"
              className="h-auto w-full min-w-0 md:flex-1"
            />
            <img
              src={asset('kitchen-note-stock.svg')}
              alt=""
              aria-hidden="true"
              width={280}
              height={113}
              loading="lazy"
              className="absolute top-[73.11%] left-[78.23%] hidden h-auto w-[17.01%] lg:block"
            />
            <img
              src={asset('kitchen-note-orders.svg')}
              alt=""
              aria-hidden="true"
              width={366}
              height={134}
              loading="lazy"
              className="absolute top-[95.17%] left-[29.19%] hidden h-auto w-[22.32%] lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Solutions() {
  return (
    <>
      <section id="solution" className="relative mt-[max(64*var(--m),201*var(--u))] scroll-mt-10">
        <Deco src="deco-croissant.svg" x={58} y={-142} />
        <Deco src="deco-donut.svg" x={1163} y={-184} />
        <Deco src="deco-biscuit.svg" x={1703} y={700} />
        <Deco src="deco-bread.svg" x={204.18} y={830} size={100.19} rotate={12.5} />
        <div className={`relative flex flex-col gap-[max(80*var(--m),174*var(--u))] ${CONTAINER}`}>
          <CustomerApp />
          <CustomerWebsite />
        </div>
      </section>
      <KitchenStation />
    </>
  )
}
