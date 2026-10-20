import { useEffect } from 'react'
import { readableTextOn } from './lib/color'
import { OnboardingScreen } from './onboarding/OnboardingScreen'
import { useOnboardingState } from './onboarding/useOnboardingState'
import { DashboardScreen } from './dashboard/DashboardScreen'
import { BakeryDecorations } from './components/BakeryBackdrop'

function App() {
  const [state, actions] = useOnboardingState()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('dashboard')) {
      actions.launch()
    }
  }, [actions])

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
          actions={actions}
          onEdit={actions.unlaunch}
          onStartOver={actions.reset}
        />
      </div>
    )
  }

  return (
    <div className="brand-scope relative min-h-full min-w-[1024px] overflow-hidden bg-primary-light" style={brandVars}>
      <BakeryDecorations setup />
      <main className="relative z-10 h-full min-w-0 overflow-y-auto">
        <OnboardingScreen state={state} actions={actions} />
      </main>
    </div>
  )
}

export default App
