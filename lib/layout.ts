// Global layout tokens - responsive spacing system
// Mobile-first approach: base values for mobile, sm: prefix for tablet+

export const layout = {
  // Horizontal padding (page margins)
  padding: {
    x: {
      mobile: 16,  // px-4
      desktop: 24, // sm:px-6
      class: "px-4 sm:px-6",
    },
    // Vertical section padding
    section: {
      mobile: 40,  // py-10
      desktop: 64, // sm:py-16
      class: "py-10 sm:py-16",
    },
  },
  
  // Gap/spacing tokens
  gap: {
    xs: {
      mobile: 8,
      desktop: 12,
      class: "gap-2 sm:gap-3",
    },
    sm: {
      mobile: 12,
      desktop: 16,
      class: "gap-3 sm:gap-4",
    },
    md: {
      mobile: 16,
      desktop: 24,
      class: "gap-4 sm:gap-6",
    },
    lg: {
      mobile: 24,
      desktop: 32,
      class: "gap-6 sm:gap-8",
    },
    xl: {
      mobile: 32,
      desktop: 64,
      class: "gap-8 sm:gap-16",
    },
  },

  // Padding tokens (internal spacing)
  space: {
    xs: {
      mobile: 8,
      desktop: 12,
      class: "p-2 sm:p-3",
    },
    sm: {
      mobile: 12,
      desktop: 16,
      class: "p-3 sm:p-4",
    },
    md: {
      mobile: 16,
      desktop: 24,
      class: "p-4 sm:p-6",
    },
    lg: {
      mobile: 24,
      desktop: 32,
      class: "p-6 sm:p-8",
    },
    xl: {
      mobile: 32,
      desktop: 64,
      class: "p-8 sm:p-16",
    },
  },

  // Section-specific tokens
  section: {
    // Full section wrapper
    wrapper: "px-4 sm:px-6 py-10 sm:py-16",
    // Header/title bottom margin
    headerBottom: "pb-8 sm:pb-16",
  },

  // Card tokens
  card: {
    padding: "p-0 sm:p-6",
    gap: "gap-4 sm:gap-6",
  },

  // Grid tokens
  grid: {
    gap: "gap-4 sm:gap-6",
  },
} as const

// Helper function to get responsive inline style
export function getResponsiveSpacing(mobile: number, desktop: number): string {
  return `clamp(${mobile}px, calc(${mobile}px + (${desktop} - ${mobile}) * ((100vw - 375px) / (1024 - 375))), ${desktop}px)`
}

