import { Composite, CtaPair, Deco, HeartItem } from '../ui'
import { CONTAINER, GAP, TYPE, asset } from '../styles'

function CustomerApp() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start">
      <div className={`flex flex-col lg:mt-[calc(57*var(--u))] lg:w-[49.39%] ${GAP[40]}`}>
        <div className={`flex flex-col text-ink ${GAP[30]}`}>
          <h2 className={TYPE.h2}>customer mobile app</h2>
          <p className={TYPE.body}>
            Your customers download your cafe&apos;s icon directly from the App Store and Google Play. They order
            ahead to skip lines, accumulate loyalty stamps, and receive push notifications when cinnamon rolls come
            fresh out of the oven.
          </p>
        </div>
        <ul className={`flex flex-col ${GAP[30]}`}>
          <HeartItem title=" 1-Tap Apple & Google Pay">Friction-free checkout without typing long card numbers.</HeartItem>
          <HeartItem title="Built-in Loyalty Points">
            Custom reward tiers like &quot;100 pts = Free morning pastry&quot;.
          </HeartItem>
          <HeartItem title="Fully Customization">Customize your menu, app icon, navigation, and brand palette.</HeartItem>
        </ul>
        <CtaPair label="Get your App" />
      </div>
      <Composite
        src={asset('mobile-app.png')}
        alt="Customer ordering app with product cards"
        box={{ w: 672.44, h: 700 }}
        art={{ x: 0, y: -120, w: 672, h: 960 }}
        className="mx-auto mt-[clamp(96px,calc(160*var(--u)),160px)] w-full max-w-[672px] lg:mt-0 lg:ml-[6.28%] lg:w-[41%] lg:max-w-none"
      />
    </div>
  )
}

function CustomerWebsite() {
  return (
    <div className="flex flex-col-reverse lg:flex-row lg:items-start">
      <Composite
        src={asset('website.png')}
        alt="Customer ordering website on your own domain"
        box={{ w: 664, h: 607.67 }}
        art={{ x: -120, y: -44, w: 904, h: 702 }}
        className="mx-auto mt-[clamp(56px,calc(100*var(--u)),100px)] w-full max-w-[664px] lg:mt-0 lg:w-[40.49%] lg:max-w-none"
      />
      <div className={`flex flex-col lg:mt-[calc(15*var(--u))] lg:ml-[10.12%] lg:w-[49.39%] ${GAP[40]}`}>
        <div className={`flex flex-col text-ink ${GAP[30]}`}>
          <h2 className={TYPE.h2}>customer website</h2>
          <p className={TYPE.body}>
            Your customers download your cafe&apos;s icon directly from the App Store and Google Play. They order
            ahead to skip lines, accumulate loyalty stamps, and receive push notifications when cinnamon rolls come
            fresh out of the oven.
          </p>
        </div>
        <ul className={`flex flex-col ${GAP[30]}`}>
          <HeartItem title="You custom domain link">Let customers place orders directly from your website.</HeartItem>
          <HeartItem title="Built-in Loyalty Points">
            Custom reward tiers like &quot;100 pts = Free morning pastry&quot;.
          </HeartItem>
          <HeartItem title="Fully customizable">
            Customize your menu, hero banner, navigation, and brand palette.
          </HeartItem>
        </ul>
        <CtaPair label="Get your Website" />
      </div>
    </div>
  )
}

function KitchenStation() {
  return (
    <section
      aria-labelledby="kitchen-title"
      className="relative mt-[clamp(64px,calc(153*var(--u)),153px)] overflow-hidden"
    >
      {/* Photo export already includes the 20% brand-purple overlay from Figma. */}
      <img
        src={asset('kitchen-bg.jpg')}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <div className="relative mx-auto max-w-[1920px]">
        <img
          src={asset('kitchen-staff.png')}
          alt="Barista using the kitchen order station"
          className="absolute top-[calc(97*var(--u))] left-[55.104%] hidden h-auto w-[37.604%] lg:block"
        />
        <div
          className={`relative ${CONTAINER} pt-[clamp(72px,calc(233*var(--u)),233px)] pb-[clamp(56px,calc(180*var(--u)),180px)]`}
        >
          <div className={`flex flex-col text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] lg:max-w-[59.7%] ${GAP[30]}`}>
            <h2 id="kitchen-title" className={TYPE.h2}>
              Kitchen order station
            </h2>
            <p className={TYPE.body}>
              All orders from your app, website, and counter show up on one screen for your bakers and baristas—no
              more lost or messy tickets.
            </p>
            <CtaPair label="Get your Order Station" tone="photo" demoClassName="backdrop-blur-[10px]" />
          </div>

          <div className="relative mt-[clamp(32px,calc(60*var(--u)),60px)] flex flex-col gap-5 drop-shadow-[0_10px_60px_rgba(85,76,241,0.1)] md:flex-row">
            <img
              src={asset('kitchen-orders.png')}
              alt="Order station: live order queue with order details"
              loading="lazy"
              className="h-auto w-full min-w-0 md:flex-1"
            />
            <img
              src={asset('kitchen-menu.png')}
              alt="Order station: menu stock toggles"
              loading="lazy"
              className="h-auto w-full min-w-0 md:flex-1"
            />
            <img
              src={asset('kitchen-note-stock.svg')}
              alt=""
              aria-hidden="true"
              className="absolute top-[80.11%] left-[78.23%] hidden h-auto w-[17.01%] lg:block"
            />
            <img
              src={asset('kitchen-note-orders.svg')}
              alt=""
              aria-hidden="true"
              className="absolute top-[103.17%] left-[29.19%] hidden h-auto w-[22.32%] lg:block"
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
      <section id="solution" className="relative mt-[clamp(64px,calc(201*var(--u)),201px)] scroll-mt-10">
        <Deco src="deco-croissant.svg" x={58} y={-142} />
        <Deco src="deco-donut.svg" x={1163} y={-184} />
        <Deco src="deco-biscuit.svg" x={1703} y={700} />
        <Deco src="deco-bread.svg" x={204.18} y={730} size={100.19} rotate={12.5} />
        <div className={`relative flex flex-col gap-[clamp(80px,calc(174*var(--u)),174px)] ${CONTAINER}`}>
          <CustomerApp />
          <CustomerWebsite />
        </div>
      </section>
      <KitchenStation />
    </>
  )
}
