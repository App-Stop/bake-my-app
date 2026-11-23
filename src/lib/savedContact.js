// Read legacy setup contact details for returning landing visitors. The panel now runs separately.
import { INITIAL_STATE } from '../landing/demo/useDemoState'
const STORAGE_KEY = 'bake-my-app:onboarding:v1'

export function readSavedContact() {
  let shop = {}
  try {
    shop = JSON.parse(localStorage.getItem(STORAGE_KEY))?.shop ?? {}
  } catch {
    // Unavailable or corrupt storage: nothing to pre-fill.
  }
  const pick = (field) => {
    const value = typeof shop[field] === 'string' ? shop[field].trim() : ''
    return value === INITIAL_STATE.shop[field] ? '' : value
  }
  return { email: pick('email'), businessName: pick('name'), phone: pick('phone') }
}

