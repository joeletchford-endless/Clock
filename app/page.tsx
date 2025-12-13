import { HeroSection } from "@/components/ui/hero-section"
import { Navigation } from "@/components/ui/navigation"
import { ProductSection } from "@/components/ui/product-section"
import { FooterSection } from "@/components/ui/footer-section"
import { DrawerProvider } from "@/components/ui/drawer-context"

export default function Home() {
  return (
    <DrawerProvider>
      <main className="w-full">
        {/* Hero Section with intro text and ENDLESS images */}
        <div style={{ background: "#f4f4ed" }}>
          <HeroSection />
          <Navigation variant="light" cartCount={0} />
        </div>
        
        <ProductSection />
        <FooterSection />
      </main>
    </DrawerProvider>
  )
}
