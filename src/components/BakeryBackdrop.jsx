import { BRAND_COLORS } from '../lib/brandPalette'
const DECORATIONS = [
  {
    src: "/landing/demo/deco-croissant.svg",
    className:
      "left-[calc(41*var(--d))] top-[calc(68.4*var(--d))] size-[calc(84*var(--d))]",
  },
  {
    src: "/landing/demo/deco-cake.svg",
    className:
      "left-[calc(90%-50*var(--d))] top-[calc(140*var(--d))] size-[calc(84*var(--d))] rotate-[27.5deg]",
  },
  {
    src: "/landing/demo/deco-bread.svg",
    className:
      "left-[calc(10%+158*var(--d))] top-[calc(543*var(--d))] size-[calc(58.8*var(--d))] rotate-[12.5deg]",
  },
  {
    src: "/landing/demo/deco-donut.svg",
    className:
      "left-[calc(70%+37*var(--d))] top-[calc(488*var(--d))] size-[calc(58.8*var(--d))]",
  },
  {
    src: "/landing/demo/deco-biscuit.svg",
    className:
      "left-[calc(90%-50*var(--d))] top-[calc(800*var(--d))] size-[calc(84*var(--d))]",
  },
];

export function BakeryDecorations({ setup = false }) {
  const setupClasses = [
    "left-[2.85%] top-[6.7%] w-[5.84%] aspect-square",
    "right-[0.2%] top-[6.1%] w-[5.84%] aspect-square rotate-[27.5deg]",
    "left-[11.8%] top-[48.8%] w-[4.1%] aspect-square rotate-[12.5deg]",
    "right-[14.2%] top-[45%] w-[3.3%] aspect-square",
    "right-[6.8%] top-[75.2%] w-[5.84%] aspect-square",
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {DECORATIONS.map((item, index) => (
        <img
          key={item.src}
          src={item.src}
          alt=""
          className={`absolute ${setup ? setupClasses[index] : item.className}`}
        />
      ))}
      {setup && (
        <img
          src="/landing/demo/deco-cupcake.svg"
          alt=""
          className="absolute bottom-[4.1%] left-[5.1%] w-[5.84%] aspect-square -rotate-[14deg]"
        />
      )}
    </div>
  );
}

function Swatch({ color, active, onChange }) {
  return (
    <button
      type="button"
      aria-label={`Use ${color} as the preview color`}
      aria-pressed={active}
      onClick={() => onChange(color)}
      className={`size-[calc(40*var(--d))] rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "ring-[calc(3*var(--d))] ring-white ring-offset-[calc(2*var(--d))] ring-offset-primary" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

export function CustomizationRail({ color, onChange }) {


  return (
    <div className="absolute inset-y-0 left-0 z-20 hidden lg:block">
      <div className="absolute left-[calc(10*var(--d))] top-1/2 flex -translate-y-1/2 flex-col items-center gap-[calc(30*var(--d))] rounded-[calc(80*var(--d))] bg-white px-[calc(30*var(--d))] py-[calc(34*var(--d))] shadow-[0_calc(10*var(--d))_calc(60*var(--d))_rgba(85,76,241,0.1)]">
        <div className="flex flex-col gap-[calc(10*var(--d))]">
          {BRAND_COLORS.map(({ hex: swatch }) => (
            <Swatch
              key={swatch}
              color={swatch}
              active={color === swatch}
              onChange={onChange}
            />
          ))}
        </div>

      </div>
      <img
        src="/landing/demo/customize-arrow.svg"
        alt="Customize Arrow"
        className="relative top-[79%]"
      />
    </div>
  );
}
