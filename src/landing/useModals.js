import { createContext, useContext } from 'react'

export const ModalsContext = createContext(null)

/** Shared landing and demo dialogs. */
export function useModals() {
  return useContext(ModalsContext)
}
