"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface DrawerContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <DrawerContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawer() {
  const context = useContext(DrawerContext)
  if (context === undefined) {
    throw new Error("useDrawer must be used within a DrawerProvider")
  }
  return context
}

