"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"


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
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Animate each letter path sequentially from bottom with fade
    if (svgRef.current) {
      const letterPaths = svgRef.current.querySelectorAll('path')
      
      // Set initial state - hidden and below
      gsap.set(letterPaths, { 
        autoAlpha: 0, 
        y: 30
      })
      
      // Animate in with fade and slide up
      gsap.to(letterPaths, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.07,
        delay: 0.2
      })
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
      {/* Large ENDLESS SVG - letter paths animated */}
      <div className="px-6 w-full overflow-hidden" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <svg 
          ref={svgRef}
          viewBox="0 0 1392 249" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          style={{ overflow: "visible" }}
        >
          {/* E */}
          <path d="M0 243.434V5.00208H180.741V53.6888H59.0243V96.373H163.401V142.392H59.0243V193.413H182.742V243.434H0Z" fill="black"/>
          {/* N */}
          <path d="M190.176 243.434V5.00208H249.534L320.229 124.718C323.898 131.387 336.57 155.064 336.57 155.064H337.236C337.236 155.064 336.57 126.385 336.57 118.049V5.00208H394.26V243.434H334.902L264.873 125.385C260.872 119.049 247.866 93.3718 247.866 93.3718H247.199C247.199 93.3718 247.866 124.051 247.866 132.388V243.434H190.176Z" fill="black"/>
          {/* D */}
          <path d="M460.718 193.746H495.399C534.082 193.746 554.09 169.403 554.09 125.718C554.09 82.3673 533.082 54.3557 496.066 54.3557H460.718V193.746ZM401.694 243.434V5.00208H503.403C569.43 5.00208 613.781 52.6884 613.781 125.718C613.781 167.736 599.109 201.416 572.431 221.758C553.757 235.764 529.747 243.434 499.734 243.434H401.694Z" fill="black"/>
          {/* L */}
          <path d="M620.153 243.434V5.00208H679.178V193.413H786.222V243.434H620.153Z" fill="black"/>
          {/* E */}
          <path d="M793.656 243.434V5.00208H974.397V53.6888H852.68V96.373H957.056V142.392H852.68V193.413H976.398V243.434H793.656Z" fill="black"/>
          {/* S */}
          <path d="M1085.96 248.436C1022.6 248.436 980.918 220.424 979.584 167.736H1038.94C1041.61 191.746 1057.28 201.75 1085.63 201.75C1104.97 201.75 1123.98 194.747 1123.98 176.739C1123.98 157.732 1104.64 153.73 1071.96 145.727C1030.6 136.056 986.92 123.384 986.92 73.3635C986.92 22.3425 1028.27 0 1081.63 0C1133.31 0 1173.33 23.3429 1175.66 73.3635H1117.97C1115.64 55.0227 1101.63 44.6851 1079.62 44.6851C1058.95 44.6851 1045.28 53.6888 1045.28 67.0276C1045.28 83.7011 1063.62 87.7028 1099.3 95.7061C1143.65 106.044 1183.67 119.716 1183.67 170.737C1183.67 220.758 1140.98 248.436 1085.96 248.436Z" fill="black"/>
          {/* S */}
          <path d="M1294.29 248.436C1230.93 248.436 1189.25 220.424 1187.92 167.736H1247.27C1249.94 191.746 1265.61 201.75 1293.96 201.75C1313.3 201.75 1332.31 194.747 1332.31 176.739C1332.31 157.732 1312.97 153.73 1280.29 145.727C1238.94 136.056 1195.25 123.384 1195.25 73.3635C1195.25 22.3425 1236.6 0 1289.96 0C1341.65 0 1381.66 23.3429 1384 73.3635H1326.31C1323.97 55.0227 1309.97 44.6851 1287.96 44.6851C1267.28 44.6851 1253.61 53.6888 1253.61 67.0276C1253.61 83.7011 1271.95 87.7028 1307.63 95.7061C1351.98 106.044 1392 119.716 1392 170.737C1392 220.758 1349.32 248.436 1294.29 248.436Z" fill="black"/>
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
