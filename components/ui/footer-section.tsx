"use client"

import { useState, useRef, useEffect } from "react"
import { OrbitalClock } from "./orbital-clock"
import { HourDayClock } from "./hour-day-clock"
import { AnimatedLink } from "./animated-link"

// Responsive clock wrapper that scales content to fit container
function ResponsiveClockWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        setScale(containerWidth / 700) // 700 is the clock's native size
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ aspectRatio: '1 / 1' }}
    >
      <div 
        className="absolute"
        style={{ 
          width: 700,
          height: 700,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Center element with circular tick marks and company name
function CenterClockElement() {
  // Match OrbitalClock size (700px with 310 outer radius)
  const size = 700
  const center = size / 2
  const radius = 310
  const tickCount = 60

  // Create arc path for text on circle
  const createCirclePath = (r: number) => {
    return `
      M ${center + r} ${center}
      A ${r} ${r} 0 1 1 ${center - r} ${center}
      A ${r} ${r} 0 1 1 ${center + r} ${center}
    `
  }

  return (
    <div 
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* SVG for circular tick marks using | character */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif" }}
      >
        <defs>
          <path
            id="centerTickCircle"
            d={createCirclePath(radius)}
            fill="none"
          />
        </defs>

        {/* Circular tick marks using | character on path */}
        {Array.from({ length: tickCount }).map((_, i) => {
          // Path starts at 3 o'clock, so 75% is 12 o'clock (top)
          const offsetPercent = (75 + (i / tickCount) * 100) % 100
          
          return (
            <text
              key={`tick-${i}`}
              fontSize="36"
              fontWeight="600"
              fill="white"
              opacity={0.8}
            >
              <textPath
                href="#centerTickCircle"
                startOffset={`${offsetPercent}%`}
                textAnchor="middle"
              >
                |
              </textPath>
            </text>
          )
        })}
      </svg>
      
      {/* Center text */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ left: -5, top: -1 }}
      >
        <p 
          className="font-bold uppercase tracking-[0.02em] text-center"
          style={{ 
            color: "#ffffff",
            fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
            fontSize: 36,
            lineHeight: '36px'
          }}
        >
          Endless Coffee
          <br />
          Roasting Company
        </p>
      </div>
    </div>
  )
}

export function FooterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    // Simulate submission - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setIsSubmitting(false)
    setEmail("")
  }

  return (
    <footer 
      className="w-full flex flex-col"
      style={{ 
        background: "#000000",
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
        paddingLeft: 24,
        paddingRight: 24
      }}
    >
      {/* Clock Section - 3 Column Grid on desktop, 2 Column on tablet */}
      <div 
        className="w-full grid grid-cols-2 lg:grid-cols-3"
        style={{ paddingTop: 36, paddingBottom: 36, gap: 24 }}
      >
        {/* Left Clock - Hours & Days of Week */}
        <ResponsiveClockWrapper>
          <HourDayClock />
        </ResponsiveClockWrapper>
        
        {/* Center Element - Hidden on tablet */}
        <div className="hidden lg:block">
          <ResponsiveClockWrapper>
            <CenterClockElement />
          </ResponsiveClockWrapper>
        </div>
        
        {/* Right Clock - Calendar Clock */}
        <ResponsiveClockWrapper>
          <OrbitalClock />
        </ResponsiveClockWrapper>
      </div>

      {/* Bottom Content - 12 Column Grid */}
      <div 
        className="w-full grid grid-cols-4 md:grid-cols-12"
        style={{ gap: 24, paddingTop: 24, paddingBottom: 24 }}
      >
        {/* Address + Copyright (cols 1-2) */}
        <div className="col-span-2 md:col-span-2 flex flex-col justify-between text-sm leading-relaxed">
          <div style={{ color: "#f4f4ed" }}>
            <p>1024 9th Ave,</p>
            <p>Oakland, CA 94606</p>
          </div>
          <p className="mt-4 md:mt-0" style={{ color: "rgba(244, 244, 237, 0.35)" }}>
            © 2025 Endless Coffee Co.
          </p>
        </div>

        {/* Tagline (cols 3-5) */}
        <div className="col-span-2 md:col-span-3 text-sm leading-relaxed" style={{ color: "#f2f2f7" }}>
          <p>
            <span style={{ color: "#f4f4ed" }}>Endless is </span>
            <span style={{ color: "rgba(244, 244, 237, 0.5)" }}>the hope that our passion resonates with anyone who values</span>
            <span style={{ color: "#f4f4ed" }}> coffee made with care.</span>
          </p>
        </div>

        {/* Spacer for mobile */}
        <div className="hidden md:block md:col-span-1" />

        {/* Email Signup (cols 7-10) */}
        <div className="col-span-2 md:col-span-4 flex flex-col gap-1">
          <p className="text-sm leading-relaxed" style={{ color: "rgba(244, 244, 237, 0.5)" }}>
            Sign up for our email list and know when new drops are coming
          </p>
          <form onSubmit={handleSubmit}>
            <button 
              type="submit"
              className="text-sm hover:opacity-70 transition-opacity text-left"
              style={{ color: "#f4f4ed" }}
            >
              {submitted ? "Thanks!" : isSubmitting ? "..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Links (cols 11-12) */}
        <div className="col-span-2 md:col-span-2 flex gap-6 justify-end">
          <div className="flex flex-col gap-1 text-sm" style={{ color: "#f4f4ed" }}>
            <AnimatedLink href="https://instagram.com/endlesscoffee_co" className="text-sm" external>Instagram</AnimatedLink>
            <AnimatedLink href="https://www.roastwith444.com/" className="text-sm" external>444</AnimatedLink>
            <AnimatedLink href="#" className="text-sm">Contact</AnimatedLink>
          </div>
          <div className="flex flex-col gap-1 text-sm" style={{ color: "#f4f4ed" }}>
            <AnimatedLink href="https://instagram.com/endlesscoffee_co" className="text-sm" external>Instagram</AnimatedLink>
            <AnimatedLink href="#" className="text-sm">Substack</AnimatedLink>
            <AnimatedLink href="#" className="text-sm">Contact</AnimatedLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
