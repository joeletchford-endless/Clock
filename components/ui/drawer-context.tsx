"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  primaryColor: string
  quantity: number
}

interface DrawerContextType {
  // About drawer (for Navigation)
  isAboutOpen: boolean
  toggleAbout: () => void
  openAbout: () => void
  closeAbout: () => void
  // Cart drawer
  isCartOpen: boolean
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  // Cart items
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  cartTotal: number
  cartCount: number
  // Legacy aliases for backward compatibility
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // About drawer controls
  const toggleAbout = () => setIsAboutOpen(!isAboutOpen)
  const openAbout = () => setIsAboutOpen(true)
  const closeAbout = () => setIsAboutOpen(false)

  // Cart drawer controls
  const toggleCart = () => setIsCartOpen(!isCartOpen)
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    openCart()
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems(prev => 
      prev.map(i => i.id === id ? { ...i, quantity } : i)
    )
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <DrawerContext.Provider value={{ 
      // About drawer
      isAboutOpen,
      toggleAbout,
      openAbout,
      closeAbout,
      // Cart drawer
      isCartOpen,
      toggleCart,
      openCart,
      closeCart,
      // Cart items
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      cartTotal,
      cartCount,
      // Legacy aliases (point to About drawer for backward compatibility)
      isOpen: isAboutOpen,
      toggle: toggleAbout,
      open: openAbout,
      close: closeAbout,
    }}>
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
