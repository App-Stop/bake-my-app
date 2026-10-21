import { DashboardScreen } from '../../dashboard/DashboardScreen'
import { INITIAL_STATE, useOnboardingState } from '../../onboarding/useOnboardingState'
import { ROUTES, navigate } from '../../router'
import { setDemoBrandColor, useDemoBrand } from './demoBrand'
import { DemoLogo } from './DemoLogo'
import { DemoPage, DemoWindow } from './DemoShell'

// A launched sample store; the demo keeps its own copy of the onboarding answers in memory.
const DEMO_STATE = { ...INITIAL_STATE, launched: true }

/**
 * Admin portal demo (Figma "Landing" 123:4792): the real dashboard in a 1310×822 window — Figma
 * shows the 1440-wide dashboard scaled down to fit, so it renders at 1440 here too.
 */
export function AdminDemo() {
  const [state, actions] = useOnboardingState({ persist: false, initial: DEMO_STATE })
  const { color, logo } = useDemoBrand()

  // Brand color and logo come from the shared demo brand; color edits in the dashboard's settings
  // go back to it, so every demo follows them.
  const brandState = { ...state, brandColor: color, shop: { ...state.shop, logo: state.shop.logo ?? logo } }
  const brandActions = {
    ...actions,
    setBrandColor: setDemoBrandColor,
    saveAllSettings: ({ brandColor, ...updates }) => {
      actions.saveAllSettings(updates)
      if (brandColor) setDemoBrandColor(brandColor)
    },
  }

  return (
    <DemoPage title="Bakery admin portal demo" active="Admin Portal" top={81} height={822}>
      <DemoWindow width={1310} height={822} contentWidth={1440}>
        <div className="brand-scope size-full">
          <DashboardScreen
            state={brandState}
            actions={brandActions}
            onEdit={() => navigate(ROUTES.app)}
            onStartOver={actions.reset}
            className="h-full"
            sidebarLogo={<DemoLogo className="h-[59px] w-[81px]" />}
          />
        </div>
      </DemoWindow>
    </DemoPage>
  )
}
