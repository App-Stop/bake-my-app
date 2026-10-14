import { createContext, useContext } from 'react'

export const ModalsContext = createContext(null)

/** `openPromo()` shows the first-month-free popup, `openDemo()` the "preview a demo" picker. */
export function useModals() {
  return useContext(ModalsContext)
}
