import { OrbitalClock } from "@/components/ui/orbital-clock"

export default function Home() {
  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        background: "linear-gradient(135deg, #1a2f1a 0%, #0f1f0f 25%, #1a3020 50%, #0d1a0d 75%, #152515 100%)",
      }}
    >
      {/* Animated background blur elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(34,197,94,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(34,197,94,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)
          `,
        }}
      />
      
      {/* Diagonal streaks effect like the Figma design */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.02) 2px,
            rgba(255,255,255,0.02) 4px
          )`,
        }}
      />

      <div className="z-10">
        <OrbitalClock />
      </div>
    </main>
  )
}
