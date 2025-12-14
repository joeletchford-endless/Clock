"use client"

import { useDrawer, CartItem } from "./drawer-context"
import { colors } from "@/lib/colors"
import { products } from "./product-section"

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useDrawer()

  return (
    <div 
      className="flex gap-4 p-4"
      style={{ 
        border: `1px solid ${colors.border.light}`,
      }}
    >
      {/* Product Image Placeholder */}
      <div 
        className="flex items-center justify-center shrink-0"
        style={{ 
          width: 80, 
          height: 80, 
          background: item.primaryColor,
        }}
      >
        <span 
          className="text-xs font-bold uppercase"
          style={{ color: colors.olive.black }}
        >
          {item.name.split(' ').map(w => w[0]).join('')}
        </span>
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h4 
            className="text-sm font-bold"
            style={{ color: colors.olive.black }}
          >
            {item.name}
          </h4>
          <p 
            className="text-sm"
            style={{ color: colors.olive.black }}
          >
            ${item.price.toFixed(2)}
          </p>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 flex items-center justify-center text-xs transition-opacity hover:opacity-70"
            style={{ 
              border: `1px solid ${colors.border.mid}`,
              color: colors.olive.black,
            }}
          >
            −
          </button>
          <span 
            className="text-sm w-4 text-center"
            style={{ color: colors.olive.black }}
          >
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 flex items-center justify-center text-xs transition-opacity hover:opacity-70"
            style={{ 
              border: `1px solid ${colors.border.mid}`,
              color: colors.olive.black,
            }}
          >
            +
          </button>
          <button
            onClick={() => removeFromCart(item.id)}
            className="ml-auto text-xs transition-opacity hover:opacity-70"
            style={{ color: colors.olive.light }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

function RecommendedProductCard({ product }: { product: typeof products[0] }) {
  const { addToCart } = useDrawer()

  return (
    <div 
      className="flex gap-3 p-3"
      style={{ 
        border: `1px solid ${colors.border.light}`,
        minWidth: 200,
      }}
    >
      {/* Product Badge as Image */}
      <div 
        className="flex items-center justify-center shrink-0"
        style={{ 
          width: 60, 
          height: 60, 
          background: product.primaryColor,
        }}
      >
        <span 
          className="text-xs font-bold uppercase text-center p-1"
          style={{ color: colors.olive.black, fontSize: 8 }}
        >
          {product.name.split(' ').slice(1).join(' ')}
        </span>
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h5 
            className="text-xs font-bold"
            style={{ color: colors.olive.black }}
          >
            {product.name}
          </h5>
          <p 
            className="text-xs"
            style={{ color: colors.olive.black }}
          >
            ${product.price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            primaryColor: product.primaryColor,
          })}
          className="text-xs text-left transition-opacity hover:opacity-70"
          style={{ color: colors.olive.light }}
        >
          + Add to Cart
        </button>
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, cartTotal, cartCount } = useDrawer()

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          opacity: isCartOpen ? 1 : 0,
          pointerEvents: isCartOpen ? "auto" : "none",
          background: "rgba(47, 51, 36, 0.1)",
          backdropFilter: isCartOpen ? "blur(8px)" : "blur(0px)",
          WebkitBackdropFilter: isCartOpen ? "blur(8px)" : "blur(0px)",
        }}
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div
        className="fixed z-[70] flex flex-col transition-all duration-300 ease-out"
        style={{
          top: 24,
          right: 24,
          bottom: 24,
          width: "min(420px, 90vw)",
          background: colors.bg.primary,
          transform: isCartOpen ? "scale(1)" : "scale(0.95)",
          transformOrigin: "bottom right",
          opacity: isCartOpen ? 1 : 0,
          pointerEvents: isCartOpen ? "auto" : "none",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between shrink-0"
          style={{ 
            padding: "20px 24px",
            borderBottom: `1px solid ${colors.border.light}`,
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="text-base font-bold uppercase"
              style={{ color: colors.olive.black }}
            >
              Your Cart
            </span>
            {cartCount > 0 && (
              <span 
                className="flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                style={{ 
                  background: colors.olive.black,
                  color: colors.bg.primary,
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
          
          {/* Close Button */}
          <button
            onClick={closeCart}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ 
              width: 32, 
              height: 32,
              color: colors.olive.black,
            }}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{ padding: 24 }}
        >
          {cartItems.length === 0 ? (
            <div 
              className="flex flex-col items-center justify-center text-center"
              style={{ paddingTop: 48 }}
            >
              <p 
                className="text-sm"
                style={{ color: colors.olive.light }}
              >
                Your cart is empty
              </p>
              <p 
                className="text-xs mt-2"
                style={{ color: colors.olive.light }}
              >
                Add some delicious coffee to get started
              </p>
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: 16 }}>
              {/* Cart Items */}
              {cartItems.map(item => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Recommended Products Section - show products not in cart */}
        {cartItems.length > 0 && (() => {
          const cartItemIds = cartItems.map(item => item.id)
          const recommendedProducts = products.filter(p => !cartItemIds.includes(p.id))
          
          if (recommendedProducts.length === 0) return null
          
          return (
            <div 
              className="shrink-0"
              style={{ 
                padding: "16px 24px",
                borderTop: `1px solid ${colors.border.light}`,
              }}
            >
              <h4 
                className="text-sm mb-3"
                style={{ color: colors.olive.black }}
              >
                You might also like
              </h4>
              <div 
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ marginRight: -24, paddingRight: 24 }}
              >
                {recommendedProducts.map(product => (
                  <RecommendedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })()}

        {/* Footer - Subtotal & Checkout */}
        <div 
          className="shrink-0"
          style={{ 
            padding: 24,
            borderTop: `1px solid ${colors.border.light}`,
          }}
        >
          {/* Subtotal */}
          <div className="flex items-center justify-between mb-4">
            <span 
              className="text-base font-bold"
              style={{ color: colors.olive.black }}
            >
              Subtotal
            </span>
            <span 
              className="text-base font-bold"
              style={{ color: colors.olive.black }}
            >
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          
          {/* Checkout Button */}
          <button
            className="w-full flex items-center justify-center p-3 transition-all duration-300 disabled:opacity-50"
            style={{ 
              background: colors.olive.black,
              border: `0.5px solid ${colors.olive.black}`,
              color: colors.bg.primary,
            }}
            disabled={cartItems.length === 0}
          >
            <span className="text-base" style={{ color: colors.bg.primary }}>Checkout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default CartDrawer

