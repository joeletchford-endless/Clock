// Global layout tokens - responsive spacing system
// Fluid approach: values scale smoothly between mobile (375px) and desktop (1024px)

// Helper function to create fluid clamp value
const fluid = (mobile: number, desktop: number): string => 
  `clamp(${mobile}px, calc(${mobile}px + (${desktop} - ${mobile}) * ((100vw - 375px) / (1024 - 375))), ${desktop}px)`

export const layout = {
  // Horizontal padding (page margins)
  padding: {
    x: {
      mobile: 16,  // px-4
      desktop: 24, // sm:px-6
      class: "px-4 sm:px-6",
      fluid: fluid(16, 24),
    },
    // Vertical section padding
    section: {
      mobile: 40,  // py-10
      desktop: 64, // sm:py-16
      class: "py-10 sm:py-16",
      fluid: fluid(40, 64),
    },
  },
  
  // Gap/spacing tokens
  gap: {
    xs: {
      mobile: 8,
      desktop: 12,
      class: "gap-2 sm:gap-3",
      fluid: fluid(8, 12),
    },
    sm: {
      mobile: 12,
      desktop: 16,
      class: "gap-3 sm:gap-4",
      fluid: fluid(12, 16),
    },
    md: {
      mobile: 16,
      desktop: 24,
      class: "gap-4 sm:gap-6",
      fluid: fluid(16, 24),
    },
    lg: {
      mobile: 24,
      desktop: 32,
      class: "gap-6 sm:gap-8",
      fluid: fluid(24, 32),
    },
    xl: {
      mobile: 32,
      desktop: 64,
      class: "gap-8 sm:gap-16",
      fluid: fluid(32, 64),
    },
  },

  // Padding tokens (internal spacing)
  space: {
    xs: {
      mobile: 8,
      desktop: 12,
      class: "p-2 sm:p-3",
      fluid: fluid(8, 12),
    },
    sm: {
      mobile: 12,
      desktop: 16,
      class: "p-3 sm:p-4",
      fluid: fluid(12, 16),
    },
    md: {
      mobile: 16,
      desktop: 24,
      class: "p-4 sm:p-6",
      fluid: fluid(16, 24),
    },
    lg: {
      mobile: 24,
      desktop: 32,
      class: "p-6 sm:p-8",
      fluid: fluid(24, 32),
    },
    xl: {
      mobile: 32,
      desktop: 64,
      class: "p-8 sm:p-16",
      fluid: fluid(32, 64),
    },
  },

  // Section-specific tokens
  section: {
    // Full section wrapper
    wrapper: "px-4 sm:px-6 pt-16 pb-10 sm:pt-24 sm:pb-16",
    // Header/title top and bottom margin
    headerBottom: "py-0",
    // Spacing between sections
    spacing: "mb-8 lg:mb-16",
  },

  // Card tokens
  card: {
    padding: "p-0 sm:p-6",
    gap: "gap-4 sm:gap-6",
    fluidPadding: fluid(0, 24),
    fluidGap: fluid(16, 24),
  },

  // Grid tokens
  grid: {
    gap: "gap-4 sm:gap-6",
    fluidGap: fluid(16, 24),
  },

  // Fluid spacing values for inline styles (use with style={{ padding: layout.fluid.md }})
  fluid: {
    xs: fluid(8, 12),
    sm: fluid(12, 16),
    md: fluid(16, 24),
    lg: fluid(24, 32),
    xl: fluid(32, 64),
    '2xl': fluid(40, 80),
    '3xl': fluid(48, 96),
  },
} as const

// Helper function to get responsive inline style (for custom values)
export function getResponsiveSpacing(mobile: number, desktop: number): string {
  return fluid(mobile, desktop)
}

