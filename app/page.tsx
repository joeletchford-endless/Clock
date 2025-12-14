import { HeroSection } from "@/components/ui/hero-section"
import { Navigation } from "@/components/ui/navigation"
import { ProductSection } from "@/components/ui/product-section"
import { FooterSection } from "@/components/ui/footer-section"
import { DrawerProvider } from "@/components/ui/drawer-context"
import { CartDrawer } from "@/components/ui/cart-drawer"

export default function Home() {
  return (
    <DrawerProvider>
      <main className="w-full">
        {/* Hero Section with intro text and ENDLESS images */}
        <div style={{ background: "#F4F1E8" }}>
          <HeroSection />
          <Navigation variant="light" />
        </div>
        
        <ProductSection />
        <FooterSection />
      </main>
      <CartDrawer />
    </DrawerProvider>
  )
}
