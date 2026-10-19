import { createContext, useContext } from 'react'

export const ModalsContext = createContext(null)

/** Shared landing, demo, and onboarding dialogs. */
export function useModals() {
  return useContext(ModalsContext)
}
