"use client"

import { useState } from "react"
import { OrbitalClock } from "./orbital-clock"

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
      className="w-full min-h-screen flex flex-col"
      style={{ 
        background: "#000000",
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif"
      }}
    >
      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Section - Content */}
        <div 
          className="w-full lg:w-1/2 flex flex-col"
          style={{ padding: 25 }}
        >
          {/* Top Section - H1 + Email */}
        <div>
          {/* Header Text */}
          <h1 
            className="text-4xl md:text-5xl lg:text-3xl xl:text-4xl font-bold uppercase leading-tight tracking-tight"
            style={{ color: "#f4f4ed" }}
          >
            <span>Endless is </span>
            <span style={{ color: "rgba(244, 244, 237, 0.25)" }}>
              the hope that our passion resonates with anyone who values
            </span>
            <span> coffee made with care.</span>
          </h1>

          {/* Email Signup */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div 
              className="flex items-center justify-between py-2"
              style={{ 
                borderBottom: "0.5px solid rgba(244, 244, 237, 0.25)"
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join our mailing list"
                className="bg-transparent border-none outline-none text-base w-full"
                style={{ color: "#f4f4ed" }}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="text-base font-medium transition-colors hover:opacity-100 disabled:cursor-not-allowed whitespace-nowrap ml-4"
                style={{ 
                  color: submitted ? "#00FF6F" : "rgba(244, 244, 237, 0.25)"
                }}
              >
                {submitted ? "Subscribed!" : isSubmitting ? "..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Section - Sitemap Links (floats to bottom) */}
        <div className="mt-auto pt-12 lg:pt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Shop */}
              <div className="flex flex-col gap-3">
                <h3 
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "rgba(244, 244, 237, 0.5)" }}
                >
                  Shop
                </h3>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  All Products
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Coffee
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Equipment
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Merch
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Subscriptions
                </a>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-3">
                <h3 
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "rgba(244, 244, 237, 0.5)" }}
                >
                  Company
                </h3>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  About Us
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Our Story
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Careers
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Press
                </a>
              </div>

              {/* Support */}
              <div className="flex flex-col gap-3">
                <h3 
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "rgba(244, 244, 237, 0.5)" }}
                >
                  Support
                </h3>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Contact
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  FAQ
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Shipping
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Returns
                </a>
                <a href="#" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Track Order
                </a>
              </div>

              {/* Connect */}
              <div className="flex flex-col gap-3">
                <h3 
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "rgba(244, 244, 237, 0.5)" }}
                >
                  Connect
                </h3>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Instagram
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Twitter
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  Facebook
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-base hover:opacity-70 transition-opacity" style={{ color: "#f4f4ed" }}>
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Clock Section - Bottom on mobile/tablet, Right on desktop */}
        <div 
          className="w-full lg:w-1/2 flex items-center justify-center p-8 order-last lg:order-none"
          style={{ 
            background: "#000000",
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-full max-w-[500px] lg:max-w-none aspect-square flex items-center justify-center"
              style={{ maxHeight: "90vh" }}
            >
              <div className="scale-[0.7] md:scale-[0.85] lg:scale-[0.8] xl:scale-100 origin-center">
                <OrbitalClock />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Legal Links */}
      <div 
        className="w-full flex flex-wrap items-center justify-between gap-6 py-6"
        style={{ 
          borderTop: "0.5px solid rgba(244, 244, 237, 0.1)",
          paddingLeft: 25,
          paddingRight: 25
        }}
      >
        <div className="flex flex-wrap gap-6">
          <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "rgba(244, 244, 237, 0.5)" }}>
            Privacy Policy
          </a>
          <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "rgba(244, 244, 237, 0.5)" }}>
            Terms of Service
          </a>
          <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "rgba(244, 244, 237, 0.5)" }}>
            Accessibility
          </a>
        </div>
        <span className="text-sm" style={{ color: "rgba(244, 244, 237, 0.3)" }}>
          © 2025 Endless Coffee Co.
        </span>
      </div>
    </footer>
  )
}

export default FooterSection
