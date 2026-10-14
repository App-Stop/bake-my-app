import { DashboardScreen } from '../../dashboard/DashboardScreen'
import { readableTextOn } from '../../lib/color'
import { INITIAL_STATE, useOnboardingState } from '../../onboarding/useOnboardingState'
import { ROUTES, navigate } from '../../router'
import { DemoPage, DemoWindow } from './DemoShell'

// A launched sample store in Bake my App purple; the demo never reads or writes the visitor's own
// onboarding progress.
const DEMO_STATE = { ...INITIAL_STATE, brandColor: '#554cf1', launched: true }

const BRAND_VARS = {
  '--brand': DEMO_STATE.brandColor,
  '--brand-light': `color-mix(in oklab, ${DEMO_STATE.brandColor} 10%, white)`,
  '--on-brand': readableTextOn(DEMO_STATE.brandColor),
}

/**
 * Admin portal demo (Figma "Landing" 123:4792): the real dashboard in a 1310×822 window — Figma
 * shows the 1440-wide dashboard scaled down to fit, so it renders at 1440 here too.
 */
export function AdminDemo() {
  const [state, actions] = useOnboardingState({ persist: false, initial: DEMO_STATE })

  return (
    <DemoPage title="Bakery admin portal demo" active="Admin Portal" top={81} height={822}>
      <DemoWindow width={1310} height={822} contentWidth={1440}>
        <div className="brand-scope size-full" style={BRAND_VARS}>
          <DashboardScreen
            state={state}
            actions={actions}
            onEdit={() => navigate(ROUTES.app)}
            onStartOver={actions.reset}
            className="h-full"
          />
        </div>
      </DemoWindow>
    </DemoPage>
  )
}
