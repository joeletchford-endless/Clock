"use client"

import { useState } from "react"
import { colors } from "@/lib/colors"
import { useDrawer } from "./drawer-context"

interface Product {
  id: string
  name: string
  price: number
  process: string
  tasteProfile: string
  variety: string
  altitude: string
  producer: string
  region: string
  country: string
  details: string
  primaryColor: string // Badge color
  hoverColor: string // Darker variant for hover (AA accessible)
  cardHoverColor: string // Light background for card hover
}

// Helper to darken a hex color for AA accessibility (darker by ~30%)
function darkenColor(hex: string, percent: number = 30): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - Math.round(255 * percent / 100))
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * percent / 100))
  const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * percent / 100))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

// Helper to lighten a hex color for card background
function lightenColor(hex: string, percent: number = 85): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + Math.round((255 - (num >> 16)) * percent / 100))
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * percent / 100))
  const b = Math.min(255, (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * percent / 100))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

export const products: Product[] = [
  {
    id: "finca-el-diviso",
    name: "Finca El Diviso",
    price: 25.00,
    process: "Double Anaerobic Mossto Washed",
    tasteProfile: "Lyche, Honeysuckle, Green Apple",
    variety: "Caturra",
    altitude: "1,820",
    producer: "Nestor Lasso",
    region: "Huila",
    country: "Colombia",
    details: "Finca El Diviso is located in the city of Bruselas in Huila, Colombia, and is a smallholder owned coffee farm that focuses on producing specialty coffee that reveals the full character of the region's terroir. El Diviso is run by Nestor, who decided to help his dad run the family farm after finishing high school, he started working directly alongside his father on the farm. He wanted to create better opportunities in coffee, so he convinced his father to plant other varieties and start producing high-quality coffees, which led to global acclaim and recognition of their hard work.",
    primaryColor: colors.lime.DEFAULT,      // Chartreuse lime (energy)
    hoverColor: colors.lime.dark,           // AA accessible dark lime
    cardHoverColor: colors.lime.lighter     // Light lime tint
  },
  {
    id: "finca-la-esperanza",
    name: "Finca La Esperanza",
    price: 25.00,
    process: "Black Berry Co-Ferment",
    tasteProfile: "Strawberry, Raspberry, Chocolate",
    variety: "Caturra",
    altitude: "1,800",
    producer: "Sebastian Ramirez",
    region: "Cauca",
    country: "Colombia",
    details: "The Black Berry Co-Fermented process is a unique technique that blends the flavor of blackberries with coffee in a perfectly balanced way. This coffee stands out for its tartaric acidity, achieved through controlled fermentation, where the temperature is carefully regulated. After the coffee is depulped, a thermal shock with hot water is applied to halt the fermentation process and lock in the flavors developed up to that point.",
    primaryColor: colors.coral.DEFAULT,     // Soft coral (warm accent)
    hoverColor: colors.coral.dark,          // AA accessible dark coral
    cardHoverColor: colors.coral.lighter    // Light coral tint
  }
]

// Flexible oval badge component - uses HTML/CSS grid for center content + SVG for oval and curved text
function ProductBadge({ product, isHovered = false }: { product: Product; isHovered?: boolean }) {
  // Split name into lines (first word on line 1, rest on line 2)
  const nameParts = product.name.toUpperCase().split(' ')
  const nameLine1 = nameParts[0] // "FINCA"
  const nameLine2 = nameParts.slice(1).join(' ') // "EL DIVISO"

  return (
    <div 
      className="relative w-full h-full"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* SVG for oval background and curved text */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 315 246"
        preserveAspectRatio="none"
      >
        {/* Background ellipse - fills the viewBox with small edge margin */}
        <ellipse 
          cx="157.5" 
          cy="123" 
          rx="153" 
          ry="119" 
          fill={product.primaryColor}
          className="transition-colors duration-300"
        />
        
        <defs>
          {/* Top arc - curves down, text reads left to right */}
          {/* 19px padding from background ellipse (rx=153-19=134, ry=119-19=100) */}
          <path
            id={`topArc-${product.id}`}
            d="M 23.5 123 A 134 100 0 0 1 291.5 123"
            fill="none"
          />
          {/* Bottom arc - curves down, text reads left to right (not upside down) */}
          {/* Larger radii to visually match top arc curvature */}
          <path
            id={`bottomArc-${product.id}`}
            d="M 15.5 123 A 142 108 0 0 0 299.5 123"
            fill="none"
          />
        </defs>
        
        {/* Process text on top arc - centered */}
        <text fontSize="10" fontWeight="700" fill={colors.olive.black} letterSpacing="0.05em">
          <textPath href={`#topArc-${product.id}`} startOffset="50%" textAnchor="middle">
            {product.process.toUpperCase()}
          </textPath>
        </text>
        
        {/* Taste profile text on bottom arc - centered and readable */}
        <text fontSize="10" fontWeight="700" fill={colors.olive.black} letterSpacing="0.05em">
          <textPath href={`#bottomArc-${product.id}`} startOffset="50%" textAnchor="middle">
            {product.tasteProfile.toUpperCase()}
          </textPath>
        </text>
      </svg>
      
      {/* HTML content with flexbox - 3 equal sections, 0px gap */}
      <div 
        className="absolute inset-0 flex flex-col text-center text-black uppercase font-bold"
        style={{ padding: '15% 20px', gap: 20, justifyContent: 'stretch', alignItems: 'stretch' }}
      >
        {/* Row 1: Variety - flex: 1 to stretch equally */}
        <div 
          className="flex flex-col items-center justify-center"
          style={{ flex: 1, fontSize: 12, lineHeight: 1.1 }}
        >
          <span>{product.variety.toUpperCase()}</span>
          <span>VARIETY</span>
        </div>
        
        {/* Row 2: Region | Farm Name | Country - flex: 1 to stretch equally */}
        <div 
          className="grid grid-cols-3 items-center"
          style={{ flex: 1 }}
        >
          {/* Left: Region */}
          <div className="flex items-center justify-center" style={{ fontSize: 12 }}>
            {product.region.toUpperCase()}
          </div>
          
          {/* Center: Farm Name */}
          <div className="flex flex-col justify-center items-center" style={{ fontSize: 24, lineHeight: 1.1 }}>
            <span>{nameLine1}</span>
            <span>{nameLine2}</span>
          </div>
          
          {/* Right: Country */}
          <div className="flex items-center justify-center" style={{ fontSize: 12 }}>
            {product.country.toUpperCase()}
          </div>
        </div>
        
        {/* Row 3: Altitude - flex: 1 to stretch equally */}
        <div 
          className="flex flex-col items-center justify-center"
          style={{ flex: 1, fontSize: 12, lineHeight: 1.1 }}
        >
          <span>{product.altitude}</span>
          <span>METERS</span>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const { addToCart } = useDrawer()

  // Dynamic colors based on product
  const badgeContainerDefault = lightenColor(product.primaryColor, 90)
  const badgeContainerHover = product.hoverColor
  
  // Button colors: darken further when button itself is hovered
  const buttonBgColor = isButtonHovered 
    ? darkenColor(product.hoverColor, 15) 
    : isHovered 
      ? product.hoverColor 
      : colors.olive.black

  return (
    <div 
      className="flex-1 flex flex-col transition-colors duration-300 cursor-pointer"
      style={{ 
        border: "0.5px solid rgba(0, 0, 0, 0.15)",
        height: "auto",
        padding: 24,
        gap: 24,
        background: isHovered ? product.cardHoverColor : "transparent"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Oval Badge - flexible container that maintains aspect ratio (315:246 from Figma) */}
      <div 
        className="w-full flex items-center justify-center transition-colors duration-300"
        style={{ 
          background: isHovered ? badgeContainerHover : badgeContainerDefault, 
          paddingTop: 32,
          paddingBottom: 32,
          paddingLeft: 24,
          paddingRight: 24
        }}
      >
        <div style={{ width: '100%', maxWidth: 350, aspectRatio: '315 / 246' }}>
          <ProductBadge product={product} isHovered={isHovered} />
        </div>
      </div>

      {/* Content Grid - 2 columns */}
      <div className="grid grid-cols-2" style={{ gap: 16 }}>
                    {/* Title & Price - spans both columns */}
                    <div className="col-span-2 flex items-center" style={{ gap: 16 }}>
                      <h3 className="text-base font-bold uppercase" style={{ color: colors.olive.black }}>
                        {product.name}
                      </h3>
                      <span className="text-base font-bold" style={{ color: colors.olive.black }}>
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

        {/* Left Column - Description */}
        <div className="flex flex-col" style={{ gap: 3 }}>
          <div 
            className="overflow-hidden"
            style={{ 
              maxHeight: expanded ? "500px" : "93px",
              transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
                        <p 
                          className="text-xs"
                          style={{ color: colors.olive.black, lineHeight: "1.1" }}
                        >
                          {product.details}
                        </p>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-left hover:opacity-70 transition-opacity"
            style={{ color: "rgba(0, 0, 0, 0.25)" }}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        </div>

        {/* Right Column - Specs Grid (2 cols x 3 rows) */}
        <div className="grid grid-cols-2" style={{ gap: 8 }}>
                      <div className="flex flex-col" style={{ gap: 0, justifyContent: 'flex-start', alignItems: 'flex-start', height: 'fit-content' }}>
                        <p className="text-xs" style={{ color: colors.olive.light }}>Process</p>
                        <p className="text-xs" style={{ color: colors.olive.black }}>{product.process}</p>
                      </div>
                      <div className="flex flex-col" style={{ gap: 0, justifyContent: 'flex-start', alignItems: 'flex-start', height: 'fit-content' }}>
                        <p className="text-xs" style={{ color: colors.olive.light }}>Taste Profile</p>
                        <p className="text-xs" style={{ color: colors.olive.black }}>{product.tasteProfile}</p>
                      </div>
                      <div className="flex flex-col" style={{ gap: 0, justifyContent: 'flex-start', alignItems: 'flex-start', height: 'fit-content' }}>
                        <p className="text-xs" style={{ color: colors.olive.light }}>Producer</p>
                        <p className="text-xs" style={{ color: colors.olive.black }}>{product.producer}</p>
                      </div>
                      <div className="flex flex-col" style={{ gap: 0, justifyContent: 'flex-start', alignItems: 'flex-start', height: 'fit-content' }}>
                        <p className="text-xs" style={{ color: colors.olive.light }}>Variety</p>
                        <p className="text-xs" style={{ color: colors.olive.black }}>{product.variety}</p>
                      </div>
                      <div className="flex flex-col" style={{ gap: 0, justifyContent: 'flex-start', alignItems: 'flex-start', height: 'fit-content' }}>
                        <p className="text-xs" style={{ color: colors.olive.light }}>Altitude</p>
                        <p className="text-xs" style={{ color: colors.olive.black }}>{product.altitude} m</p>
                      </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-auto">
        <button 
          className="w-full flex items-center justify-center p-3 transition-all duration-300"
          style={{ 
            background: buttonBgColor, 
            border: `0.5px solid ${buttonBgColor}`, 
            gap: 8 
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={() => addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            primaryColor: product.primaryColor,
          })}
        >
          <span style={{ color: colors.bg.primary }} className="text-base">Add to cart</span>
          <span style={{ color: colors.bg.primary }} className="text-base">${product.price.toFixed(2)}</span>
        </button>
      </div>
    </div>
  )
}

export function ProductSection() {
  return (
    <section 
      className="w-full"
      style={{ 
        background: "#F4F1E8",
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 24,
        paddingRight: 24
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-center" style={{ paddingBottom: 64 }}>
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-center max-w-2xl"
          style={{ color: colors.olive.black }}
        >
          <span>Pre-orders </span>
          <span style={{ color: colors.olive.light }}>for the 2026 launch </span>
          <span>now open</span>
        </h2>
      </div>

      {/* Product Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductSection

