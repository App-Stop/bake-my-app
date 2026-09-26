import { useEffect, useRef } from 'react'
import { readableTextOn } from './lib/color'
import { BrandColorStep } from './onboarding/steps/BrandColorStep'
import { DeliveryStep } from './onboarding/steps/DeliveryStep'
import { MenuStep } from './onboarding/steps/MenuStep'
import { ReviewStep } from './onboarding/steps/ReviewStep'
import { ShopDetailsStep } from './onboarding/steps/ShopDetailsStep'
import { useOnboardingState } from './onboarding/useOnboardingState'
import { PreviewPanel } from './preview/PreviewPanel'
import { DashboardScreen } from './dashboard/DashboardScreen'

const STEPS = [ShopDetailsStep, BrandColorStep, MenuStep, DeliveryStep, ReviewStep]

function App() {
  const [state, actions] = useOnboardingState()
  const scrollRef = useRef(null)
  const Step = STEPS[state.step] ?? ShopDetailsStep

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [state.step, state.launched])

  const brandVars = {
    '--brand': state.brandColor,
    '--brand-light': `color-mix(in oklab, ${state.brandColor} 10%, white)`,
    '--on-brand': readableTextOn(state.brandColor),
  }

  if (state.launched) {
    return (
      <div className="brand-scope h-full w-full" style={brandVars}>
        <DashboardScreen
          state={state}
          onEdit={actions.unlaunch}
          onStartOver={actions.reset}
        />
      </div>
    )
  }

  return (
    <div className="brand-scope flex h-full min-w-[1024px]" style={brandVars}>
      <main ref={scrollRef} className="h-full min-w-0 flex-1 overflow-y-auto">
        <div className="w-full max-w-[700px] p-[30px] min-[1600px]:mx-auto">
          <Step
            state={state}
            actions={actions}
            onBack={state.step > 0 ? () => actions.goTo(state.step - 1) : undefined}
            onNext={() => actions.goTo(state.step + 1)}
          />
        </div>
      </main>
      <PreviewPanel state={state} />
    </div>
  )
}

export default App
