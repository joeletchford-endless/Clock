"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface NavigationProps {
  cartCount?: number
  variant?: "light" | "dark"
}

export function Navigation({ cartCount = 0, variant = "light" }: NavigationProps) {
  const isLight = variant === "light"
  const navRef = useRef<HTMLElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  
  const primaryColor = isLight ? "#000000" : "#f4f4ed"
  const secondaryColor = isLight ? "rgba(0, 0, 0, 0.25)" : "rgba(244, 244, 237, 0.25)"
  const bgColor = isLight ? "#f4f4ed" : "#000000"

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Get the initial position of the nav
    const navInitialTop = nav.offsetTop

    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // When scroll position passes the nav's initial position, make it sticky
      if (scrollY >= navInitialTop) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Placeholder to prevent layout jump when nav becomes fixed */}
      {isSticky && (
        <div style={{ height: navRef.current?.offsetHeight || 60 }} />
      )}
      
      <nav 
        ref={navRef}
        className={`w-full flex items-start justify-between pt-6 pb-6 px-6 z-50 transition-shadow duration-300 ${
          isSticky ? "fixed top-0 left-0 right-0 shadow-sm" : "relative"
        }`}
        style={{ 
          fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
          background: bgColor,
        }}
      >
        {/* Logo / Brand */}
        <Link href="/" className="flex flex-col gap-0.5 hover:opacity-70 transition-opacity">
          <span 
            className="text-base font-medium uppercase tracking-wider"
            style={{ color: primaryColor, letterSpacing: "0.32px" }}
          >
            Endless Coffee
          </span>
          <span 
            className="text-base font-medium uppercase tracking-wider"
            style={{ color: secondaryColor, letterSpacing: "0.32px" }}
          >
            Roasting Company
          </span>
        </Link>

        {/* Cart */}
        <Link 
          href="/cart"
          className="text-base font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
          style={{ color: primaryColor, letterSpacing: "0.32px" }}
        >
          Cart ({cartCount})
        </Link>
      </nav>
    </>
  )
}

export default Navigation
