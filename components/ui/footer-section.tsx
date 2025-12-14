"use client"

import { useState, useRef, useEffect } from "react"
import { OrbitalClock } from "./orbital-clock"
import { HourDayClock } from "./hour-day-clock"
import { AnimatedLink } from "./animated-link"
import { colors } from "@/lib/colors"
import { layout } from "@/lib/layout"

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
              fill={colors.olive.black}
              opacity={0.6}
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
            color: colors.olive.black,
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
        background: colors.bg.primary,
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
      }}
    >
      {/* Clock Section - 3 Column Grid on desktop, 2 on tablet, 1 on mobile */}
      <div 
        className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${layout.padding.section.class} pb-16 ${layout.grid.gap}`}
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

      {/* Bottom Content - 2 column on mobile/tablet, 12 column grid on desktop */}
      <div 
        className="w-full flex md:grid md:grid-cols-12 py-4 sm:py-6"
        style={{ gap: 24 }}
      >
        {/* Left Column - Content (mobile/tablet) / spans cols 1-10 on desktop */}
        <div className="flex-1 md:col-span-10 flex flex-col md:flex-row md:justify-between gap-4 md:gap-6">
          {/* Tagline */}
          <div className="md:flex-1" style={{ fontSize: 14, lineHeight: 1.1 }}>
            <p>
              <span style={{ color: colors.olive.black }}>Endless is </span>
              <span style={{ color: colors.olive.light }}>the hope that our passion resonates with anyone who values</span>
              <span style={{ color: colors.olive.black }}> coffee made with care.</span>
            </p>
          </div>

          {/* Email Signup */}
          <div className="flex flex-col md:flex-1">
            <form onSubmit={handleSubmit} className="flex items-baseline border-b" style={{ borderColor: colors.olive.light, paddingBottom: 4 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Sign up for our email list"
                className="bg-transparent outline-none flex-1"
                style={{ 
                  fontSize: 14, 
                  lineHeight: 1.1,
                  color: colors.olive.black,
                }}
              />
              <button 
                type="submit"
                className="text-left group relative inline-block overflow-hidden"
                style={{ fontSize: 14, lineHeight: 1.1, height: '1.1em' }}
              >
                <span className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
                  <span style={{ color: colors.olive.black }}>
                    {submitted ? "Thanks!" : isSubmitting ? "..." : "Submit"}
                  </span>
                  <span style={{ color: colors.coral.DEFAULT }}>
                    {submitted ? "Thanks!" : isSubmitting ? "..." : "Submit"}
                  </span>
                </span>
              </button>
            </form>
          </div>

          {/* Address + Copyright */}
          <div className="md:flex-1" style={{ fontSize: 14, lineHeight: 1.1, color: colors.olive.light }}>
            <p style={{ color: colors.olive.black }}>1024 9th Ave,</p>
            <p style={{ color: colors.olive.black }}>Oakland, CA 94606</p>
            <p style={{ color: colors.olive.light }}>© 2025 Endless Coffee Co.</p>
          </div>
        </div>

        {/* Right Column - Links (single column on mobile, two columns on tablet+) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 text-sm" style={{ gap: 4 }}>
          <AnimatedLink href="https://instagram.com/endlesscoffee_co" className="text-sm" external>Instagram</AnimatedLink>
          <AnimatedLink href="https://www.roastwith444.com/" className="text-sm" external>444</AnimatedLink>
          <AnimatedLink href="#" className="text-sm">Contact</AnimatedLink>
          <AnimatedLink href="https://instagram.com/endlesscoffee_co" className="text-sm" external>Instagram</AnimatedLink>
          <AnimatedLink href="#" className="text-sm">Substack</AnimatedLink>
          <AnimatedLink href="#" className="text-sm">Contact</AnimatedLink>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
