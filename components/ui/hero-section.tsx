"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

// Images from Figma - these will expire after 7 days, replace with your own
const imgEndless1 = "https://www.figma.com/api/mcp/asset/681398fa-3c94-4bb5-853b-d9e11082c6a8"
const imgEndless2 = "https://www.figma.com/api/mcp/asset/a627ab6d-b9b1-428c-bc7a-f80bdbe31d3c"

const paragraphs = [
  "Endless is the shared creation of Izzy (roaster) and Joe (designer) built from a desire to bring their personal expression into the world of specialty coffee. What began as a private ritual between two friends evolved into a practice shaped by curiosity, care, and the belief that coffee can carry the emotional depth of an art form.",
  "Our offerings are born from instinct rather than trends: small batches roasted with the sensitivity of a craftsperson and presented through a visual language guided purely by joy and intuition. Endless isn't designed to fill a market gap; it exists because this is the coffee we want on our counters in the morning.",
  "From the start, Endless has been defined by the interplay between two distinct sensibilities. Izzy approaches roasting with a precise, exploratory spirit & Joe's visual world which resists convention in favor of intuition and the things that feel true. Together, their work forms a collection of coffees intended not only to be tasted, but to be felt.",
  "Endless is small by design—intentional, personal, and guided by the hope that the care behind every roast and every detail resonates with those who value coffee as much as we do."
]

// Text scramble animation class
class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{from: string, to: string, start: number, end: number, char?: string}>
  frame: number
  frameRequest: number
  resolve: () => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => {
      this.resolve = resolve
    })
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span style="opacity:0.5">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update())
      this.frame++
    }
  }

  randomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

function AnimatedParagraph({ text, delay }: { text: string; delay: number }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const scrambleRef = useRef<TextScramble | null>(null)

  useEffect(() => {
    if (!ref.current) return

    // Initialize with empty or scrambled text
    ref.current.innerText = ''
    scrambleRef.current = new TextScramble(ref.current)

    // Start animation after delay
    const timeout = setTimeout(() => {
      scrambleRef.current?.setText(text)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <p 
      ref={ref}
      className="text-xs leading-tight"
      style={{ color: "#000000", minHeight: "1em" }}
    />
  )
}

export function HeroSection() {
  const imagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate images after text
    if (imagesRef.current) {
      gsap.fromTo(
        imagesRef.current,
        { 
          opacity: 0,
          y: 30
        },
        { 
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 2.5 // After text animations complete
        }
      )
    }
  }, [])

  return (
    <section 
      className="w-full flex flex-col"
      style={{ 
        background: "#f4f4ed",
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif"
      }}
    >
      {/* Text Columns with scramble animation */}
      <div className="pt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paragraphs.map((text, index) => (
            <AnimatedParagraph 
              key={index} 
              text={text} 
              delay={index * 400} // Stagger each column
            />
          ))}
        </div>
      </div>

      {/* Large ENDLESS Images - locked aspect ratio */}
      <div 
        ref={imagesRef}
        className="pt-6 px-6 w-full"
        style={{ opacity: 0 }}
      >
        <div 
          className="flex items-end w-full"
          style={{ 
            gap: "6px",
            aspectRatio: "1385.6 / 248.4"
          }}
        >
          <div 
            className="h-full"
            style={{ 
              width: "44.3%",
              aspectRatio: "613.78 / 238.43"
            }}
          >
            <img 
              src={imgEndless1} 
              alt="ENDLESS" 
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />
          </div>
          <div 
            className="h-full"
            style={{ 
              width: "55.7%",
              aspectRatio: "771.85 / 248.44"
            }}
          >
            <img 
              src={imgEndless2} 
              alt="ENDLESS continued" 
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
