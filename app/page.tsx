import { OrbitalClock } from "@/components/ui/orbital-clock"

export default function Home() {
  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        background: "#000000",
      }}
    >
      <OrbitalClock />
    </main>
  )
}
