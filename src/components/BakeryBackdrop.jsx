import { useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Pen01Icon } from '@hugeicons/core-free-icons'

const DECORATIONS = [
  { src: '/landing/demo/deco-croissant.svg', className: 'left-[calc(41*var(--d))] top-[calc(68.4*var(--d))] size-[calc(84*var(--d))]' },
  { src: '/landing/demo/deco-cake.svg', className: 'left-[calc(90%-50*var(--d))] top-[calc(140*var(--d))] size-[calc(84*var(--d))] rotate-[27.5deg]' },
  { src: '/landing/demo/deco-bread.svg', className: 'left-[calc(10%+158*var(--d))] top-[calc(543*var(--d))] size-[calc(58.8*var(--d))] rotate-[12.5deg]' },
  { src: '/landing/demo/deco-donut.svg', className: 'left-[calc(70%+37*var(--d))] top-[calc(488*var(--d))] size-[calc(58.8*var(--d))]' },
  { src: '/landing/demo/deco-biscuit.svg', className: 'left-[calc(90%-50*var(--d))] top-[calc(800*var(--d))] size-[calc(84*var(--d))]' },
]

const DEMO_COLORS = ['#ff1fad', '#903bff', '#00c064', '#00c9c6', '#f30000', '#f96c00', '#0095ff']
const LOGO_COLORS = ['#efbb00', '#a7921b', '#8fa200']

export function BakeryDecorations({ setup = false }) {
  const setupClasses = [
    'left-[2.85%] top-[6.7%] size-[5.84%]',
    'right-[0.2%] top-[6.1%] size-[5.84%] rotate-[27.5deg]',
    'left-[11.8%] top-[48.8%] size-[4.1%] rotate-[12.5deg]',
    'right-[14.2%] top-[45%] size-[3.3%]',
    'right-[6.8%] top-[75.2%] size-[5.84%]',
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {DECORATIONS.map((item, index) => (
        <img key={item.src} src={item.src} alt="" className={`absolute ${setup ? setupClasses[index] : item.className}`} />
      ))}
      {setup && <img src="/landing/demo/deco-cupcake.svg" alt="" className="absolute bottom-[4.1%] left-[5.1%] size-[5.84%] -rotate-[14deg]" />}
    </div>
  )
}

function Swatch({ color, active, onChange }) {
  return (
    <button
      type="button"
      aria-label={`Use ${color} as the preview color`}
      aria-pressed={active}
      onClick={() => onChange(color)}
      className={`size-[calc(40*var(--d))] rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? 'ring-[calc(3*var(--d))] ring-white ring-offset-[calc(2*var(--d))] ring-offset-primary' : ''}`}
      style={{ backgroundColor: color }}
    />
  )
}

export function CustomizationRail({ color, onChange }) {
  const inputRef = useRef(null)

  return (
    <div className="absolute inset-y-0 left-0 z-20 hidden lg:block">
      <div className="absolute left-[calc(10*var(--d))] top-1/2 flex -translate-y-1/2 flex-col items-center gap-[calc(30*var(--d))] rounded-[calc(80*var(--d))] bg-white px-[calc(30*var(--d))] py-[calc(34*var(--d))] shadow-[0_calc(10*var(--d))_calc(60*var(--d))_rgba(85,76,241,0.1)]">
        <div className="flex flex-col gap-[calc(10*var(--d))]">
          {DEMO_COLORS.map((swatch) => <Swatch key={swatch} color={swatch} active={color === swatch} onChange={onChange} />)}
        </div>
        <span className="h-[calc(3*var(--d))] w-[calc(16*var(--d))] rounded-full bg-primary/20" />
        <div className="flex flex-col gap-[calc(10*var(--d))]">
          {LOGO_COLORS.map((swatch) => <Swatch key={swatch} color={swatch} active={color === swatch} onChange={onChange} />)}
        </div>
        <span className="h-[calc(3*var(--d))] w-[calc(16*var(--d))] rounded-full bg-primary/20" />
        <button
          type="button"
          aria-label="Choose a custom preview color"
          onClick={() => inputRef.current?.click()}
          className="relative flex size-[calc(40*var(--d))] items-center justify-center rounded-full text-white"
          style={{ background: 'conic-gradient(#ff00a6, #6600ff, #006fff, #00e78b, #99db00, #ff7b00, #ff0000, #ff00a6)' }}
        >
          <HugeiconsIcon icon={Pen01Icon} size={20} color="currentColor" />
          <input ref={inputRef} type="color" value={color} onChange={(event) => onChange(event.target.value)} className="pointer-events-none absolute opacity-0" tabIndex={-1} />
        </button>
      </div>
      <div className="absolute left-[calc(28*var(--d))] top-[calc(945*var(--d))] w-[calc(108*var(--d))] rotate-[15.8deg] text-center font-malibu text-[length:calc(18*var(--d))] tracking-[calc(.32*var(--d))] text-primary">Customize</div>
      <img src="/landing/demo/customize-arrow.svg" alt="" className="absolute left-[calc(65*var(--d))] top-[calc(950*var(--d))] h-[calc(79*var(--d))] w-[calc(64*var(--d))] -scale-x-100 rotate-[44deg]" />
    </div>
  )
}
