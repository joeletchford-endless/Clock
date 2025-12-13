"use client"

import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  process: string
  tasteProfile: string
  variety: string
  altitude: string
  producer: string
  details: string
  image: string
}

// Product images from Figma
const imgProduct1 = "https://www.figma.com/api/mcp/asset/3d90009a-da7d-4218-b008-9b77130a9fe2"

const products: Product[] = [
  {
    id: "izzys-lot-1",
    name: "IZZY'S LOT NO. 1",
    price: 25.00,
    process: "Semi-washed apple co-ferment",
    tasteProfile: "Vanilla, Cinnamon, Citrus",
    variety: "Colombia, Castillo",
    altitude: "1650 m",
    producer: "Andres Cardona",
    details: "This lot is Andrés' apple co-ferment, an innovative experiment where he combines his coffee cherries with fresh apple juice and ferments them for five days. The addition of apple juice not only intensifies the natural acidity of the cup but also contributes to a round, creamy mouthfeel that makes the profile truly distinctive. Andrés has always been known for his restless curiosity and drive to experiment. His portfolio is constantly evolving as he tests new ideas, techniques, and flavor profiles.",
    image: imgProduct1
  },
  {
    id: "joes-lot-1",
    name: "JOE'S LOT NO. 1",
    price: 25.00,
    process: "Black Berry Co-Ferment",
    tasteProfile: "Strawberry, Raspberry Cherry, Chocolate",
    variety: "Caturra",
    altitude: "1800 m",
    producer: "Sebastian Ramirez",
    details: "The Black Berry Co-Fermented process is a unique technique that blends the flavor of blackberries with coffee in a perfectly balanced way. This coffee stands out for its tartaric acidity, achieved through controlled fermentation, where the temperature is carefully regulated. After the coffee is depulped, a thermal shock with hot water is applied to halt the fermentation process and lock in the flavors developed up to that point.",
    image: imgProduct1
  }
]

function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [expanded, setExpanded] = useState(false)

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div 
      className="flex-1 flex flex-col gap-6 p-6"
      style={{ 
        border: "0.5px solid rgba(0, 0, 0, 0.15)",
        minHeight: "calc(100vh - 55px - 50px)"
      }}
    >
      {/* Hero Image with Product Name */}
      <div 
        className="relative w-full h-[350px] flex items-center justify-center overflow-hidden"
        style={{ background: "#f4f4ed" }}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            width: "153%",
            height: "123%",
            left: "-27%",
            top: "-11%",
            maxWidth: "none"
          }}
        />
        <h3 
          className="relative z-10 text-3xl md:text-4xl font-bold uppercase text-center px-6"
          style={{ color: "#ffffff" }}
        >
          {product.name}
        </h3>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <div 
          className="overflow-hidden"
          style={{ 
            maxHeight: expanded ? "500px" : "72px",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <p 
            className="text-sm leading-relaxed"
            style={{ color: "#000000", lineHeight: "18px" }}
          >
            {product.details}
          </p>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-left hover:opacity-70 transition-opacity"
          style={{ color: "rgba(0, 0, 0, 0.25)" }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      </div>

      {/* Specs Grid - 3 columns, 2 rows */}
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase" style={{ color: "#000000" }}>Process</p>
              <p className="text-sm pl-4" style={{ color: "#000000" }}>{product.process}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase" style={{ color: "#000000" }}>Taste Profile</p>
              <p className="text-sm pl-4" style={{ color: "#000000" }}>{product.tasteProfile}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase" style={{ color: "#000000" }}>Variety</p>
              <p className="text-sm pl-4" style={{ color: "#000000" }}>{product.variety}</p>
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase" style={{ color: "#000000" }}>Variety</p>
              <p className="text-sm pl-4" style={{ color: "#000000" }}>{product.variety}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase" style={{ color: "#000000" }}>Altitude</p>
              <p className="text-sm pl-4" style={{ color: "#000000" }}>{product.altitude}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase" style={{ color: "#000000" }}>Producer</p>
              <p className="text-sm pl-4" style={{ color: "#000000" }}>{product.producer}</p>
            </div>
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex gap-6">
          {/* Quantity Selector */}
          <div 
            className="flex items-center justify-between p-3 w-[212px]"
            style={{ border: "0.5px solid rgba(0, 0, 0, 0.25)" }}
          >
            <button 
              onClick={decreaseQuantity}
              className="text-base hover:opacity-70 transition-opacity"
              style={{ color: quantity > 1 ? "#000000" : "rgba(0, 0, 0, 0.25)" }}
              disabled={quantity <= 1}
            >
              –
            </button>
            <span className="text-base" style={{ color: "#000000" }}>
              {quantity}
            </span>
            <button 
              onClick={increaseQuantity}
              className="text-base hover:opacity-70 transition-opacity"
              style={{ color: "#000000" }}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button 
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-transparent hover:bg-black border border-black transition-all duration-300 group"
          >
            <span className="text-black group-hover:text-white transition-colors duration-300">Add to cart</span>
            <span className="text-black group-hover:text-white transition-colors duration-300">${product.price.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProductSection() {
  return (
    <section 
      className="w-full"
      style={{ 
        background: "#f4f4ed",
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
          style={{ color: "#000000" }}
        >
          <span>Pre-orders </span>
          <span style={{ color: "rgba(0, 0, 0, 0.25)" }}>for the 2026 launch </span>
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

