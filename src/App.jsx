import { useEffect } from 'react'
import { readableTextOn } from './lib/color'
import { OnboardingScreen } from './onboarding/OnboardingScreen'
import { useOnboardingState } from './onboarding/useOnboardingState'
import { PreviewPanel } from './preview/PreviewPanel'
import { DashboardScreen } from './dashboard/DashboardScreen'

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
    <div className="brand-scope flex h-full min-w-[1024px]" style={brandVars}>
      <main className="h-full min-w-0 flex-1 overflow-y-auto">
        <OnboardingScreen state={state} actions={actions} />
      </main>
      <PreviewPanel state={state} />
    </div>
  )
}

export default App
