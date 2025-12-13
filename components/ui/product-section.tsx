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
}

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
    details: "This lot is Andrés' apple co-ferment, an innovative experiment where he combines his coffee cherries with fresh apple juice and ferments them for five days. The addition of apple juice not only intensifies the natural acidity of the cup but also contributes to a round, creamy mouthfeel that makes the profile truly distinctive. Andrés has always been known for his restless curiosity and drive to experiment. His portfolio is constantly evolving as he tests new ideas, techniques, and flavor profiles."
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
    details: "The Black Berry Co-Fermented process is a unique technique that blends the flavor of blackberries with coffee in a perfectly balanced way. This coffee stands out for its tartaric acidity, achieved through controlled fermentation, where the temperature is carefully regulated. After the coffee is depulped, a thermal shock with hot water is applied to halt the fermentation process and lock in the flavors developed up to that point."
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
      className="flex-1 flex flex-col gap-9 p-6"
      style={{ 
        border: "0.5px solid rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Product Name & Price */}
      <div className="flex flex-col gap-1">
        <h3 
          className="text-2xl md:text-[28px] font-bold uppercase"
          style={{ color: "#000000" }}
        >
          {product.name}
        </h3>
        <p className="text-base" style={{ color: "#000000" }}>
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-16">
        {/* Specs Table */}
        <div className="flex flex-col gap-4">
          {/* Specs Grid */}
          <div className="flex gap-6">
            {/* Labels */}
            <div className="flex flex-col gap-1 w-[140px] md:w-[210px]" style={{ color: "#000000" }}>
              <p className="text-base">Process</p>
              <p className="text-base">Taste Profile</p>
              <p className="text-base">Variety</p>
              <p className="text-base">Altitude</p>
              <p className="text-base">Producer</p>
            </div>
            {/* Values */}
            <div className="flex-1 flex flex-col gap-1" style={{ color: "#000000" }}>
              <p className="text-base">{product.process}</p>
              <p className="text-base">{product.tasteProfile}</p>
              <p className="text-base">{product.variety}</p>
              <p className="text-base">{product.altitude}</p>
              <p className="text-base">{product.producer}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex gap-6">
            <div className="w-[140px] md:w-[210px]">
              <p className="text-base" style={{ color: "#000000" }}>Details</p>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p 
                className={`text-base ${expanded ? "" : "line-clamp-4"}`}
                style={{ color: "#000000" }}
              >
                {product.details}
              </p>
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-base text-left hover:opacity-70 transition-opacity"
                style={{ color: "rgba(0, 0, 0, 0.25)" }}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            </div>
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            {/* Decrease Button */}
            <button 
              onClick={decreaseQuantity}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors group overflow-hidden"
              style={{ 
                background: quantity > 1 ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.05)",
                color: quantity > 1 ? "#000000" : "rgba(0, 0, 0, 0.3)"
              }}
              disabled={quantity <= 1}
            >
              <span className="relative w-full h-full block overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                  –
                </span>
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  –
                </span>
              </span>
            </button>

            {/* Quantity Display */}
            <span 
              className="text-base font-medium w-8 text-center"
              style={{ color: "#000000" }}
            >
              {quantity}
            </span>

            {/* Increase Button */}
            <button 
              onClick={increaseQuantity}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors group overflow-hidden hover:bg-black/20"
              style={{ 
                background: "rgba(0, 0, 0, 0.1)",
                color: "#000000"
              }}
            >
              <span className="relative w-full h-full block overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                  +
                </span>
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  +
                </span>
              </span>
            </button>
          </div>

          {/* Add to Cart Button */}
          <button 
            className="flex-1 flex items-center justify-center gap-2 backdrop-blur-[2px] py-3 px-4 text-base font-medium rounded-full border border-black/10 bg-black/5 hover:bg-black/10 transition-colors group overflow-hidden"
            style={{ color: "#000000" }}
          >
            <span className="relative block overflow-hidden" style={{ height: "1.25em" }}>
              <span className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
                <span>Add to cart</span>
                <span>Add to cart</span>
              </span>
            </span>
            <span className="relative w-5 h-5 block overflow-hidden">
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                →
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                →
              </span>
            </span>
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
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif"
      }}
    >
      <div style={{ padding: 25 }}>
        {/* Header */}
        <div className="flex items-center justify-center py-24 md:py-36 lg:py-44">
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
        <div className="flex flex-col lg:flex-row gap-6 pb-24 md:pb-36 lg:pb-44">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductSection

