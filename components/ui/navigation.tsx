"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { AnimatedLink } from "./animated-link"
import { useDrawer } from "./drawer-context"

interface NavigationProps {
  cartCount?: number
  variant?: "light" | "dark"
}

const paragraphs = [
  "Endless is the shared creation of Izzy (roaster) and Joe (designer) built from a desire to bring their personal expression into the world of specialty coffee. What began as a private ritual between two friends evolved into a practice shaped by curiosity, care, and the belief that coffee can carry the emotional depth of an art form.",
  "Our offerings are born from instinct rather than trends: small batches roasted with the sensitivity of a craftsperson and presented through a visual language guided purely by joy and intuition. Endless isn't designed to fill a market gap; it exists because this is the coffee we want on our counters in the morning.",
  "From the start, Endless has been defined by the interplay between two distinct sensibilities. Izzy approaches roasting with a precise, exploratory spirit & Joe's visual world which resists convention in favor of intuition and the things that feel true. Together, their work forms a collection of coffees intended not only to be tasted, but to be felt.",
  "Endless is small by design—intentional, personal, and guided by the hope that the care behind every roast and every detail resonates with those who value coffee as much as we do."
]

export function Navigation({ cartCount = 0, variant = "light" }: NavigationProps) {
  const isLight = variant === "light"
  const wrapperRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [initialTop, setInitialTop] = useState(0)
  const { isOpen, toggle } = useDrawer()
  
  const primaryColor = isLight ? "#000000" : "#f4f4ed"
  const secondaryColor = isLight ? "rgba(0, 0, 0, 0.25)" : "rgba(244, 244, 237, 0.25)"
  const bgColor = isLight ? "#f4f4ed" : "#000000"

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // Get the initial position of the nav wrapper
    const navInitialTop = wrapper.getBoundingClientRect().top + window.scrollY
    setInitialTop(navInitialTop)

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

  // Animate drawer open/close
  useEffect(() => {
    if (drawerRef.current) {
      if (isOpen) {
        gsap.to(drawerRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        })
      } else {
        gsap.to(drawerRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        })
      }
    }
  }, [isOpen])

  return (
    <>
      {/* Placeholder to prevent layout jump when nav becomes fixed */}
      {isSticky && (
        <div style={{ height: 55 }} />
      )}
      
      <div 
        ref={wrapperRef}
        className={`w-full z-50 ${isSticky ? "fixed top-0 left-0 right-0 shadow-sm" : "relative"}`}
        style={{ background: bgColor }}
      >
        <nav 
          className="w-full flex items-center justify-between px-6 relative"
          style={{ 
            fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
            height: 55
          }}
        >
          {/* Logo / Brand */}
          <Link href="/" className="flex flex-col" style={{ gap: 0 }}>
            <span 
              className="text-base font-medium uppercase"
              style={{ color: primaryColor, lineHeight: "18px" }}
            >
              Endless Coffee
            </span>
            <span 
              className="text-base font-medium uppercase"
              style={{ color: secondaryColor, lineHeight: "18px" }}
            >
              Roasting Company
            </span>
          </Link>

          {/* About toggle - centered black dot */}
          <button
            onClick={toggle}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300"
            style={{ 
              background: isOpen ? "#00FF6F" : primaryColor,
              transform: isOpen ? "translate(-50%, -50%) scale(1.2)" : "translate(-50%, -50%) scale(1)"
            }}
            aria-label={isOpen ? "Close about" : "Open about"}
          />

          {/* Cart */}
          <AnimatedLink 
            href="/cart"
            className="text-base font-medium uppercase tracking-wider"
            defaultColor={isLight ? "rgba(0, 0, 0, 0.7)" : "rgba(244, 244, 237, 0.7)"}
            hoverColor={primaryColor}
          >
            Cart ({cartCount})
          </AnimatedLink>
        </nav>

        {/* About Drawer */}
        <div 
          ref={drawerRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paragraphs.map((text, index) => (
              <p 
                key={index}
                className="leading-tight"
                style={{ color: primaryColor, fontSize: 14 }}
              >
                {text}
              </p>
            ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
