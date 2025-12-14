/**
 * ENDLESS COFFEE COLOR TOKEN SYSTEM
 * 
 * A comprehensive color palette with light, mid, and dark tones
 * for each primary color in the system.
 */

export const colors = {
  // ============================================
  // CORAL — Soft coral (warm accent)
  // ============================================
  coral: {
    DEFAULT: '#E07A5F',
    light: '#F2AFA0',      // 30% lighter
    lighter: '#FAD9D1',    // 60% lighter
    mid: '#C4614A',        // 15% darker
    dark: '#A84835',       // 30% darker
  },

  // ============================================
  // LIME — Chartreuse lime (energy)
  // ============================================
  lime: {
    DEFAULT: '#C5D92D',
    light: '#DBEA6E',      // 30% lighter
    lighter: '#EEF5B5',    // 60% lighter
    mid: '#A8B926',        // 15% darker
    dark: '#859509',       // 30% darker - AA accessible
  },

  // ============================================
  // EUCALYPTUS — Eucalyptus gray (cool balance)
  // ============================================
  eucalyptus: {
    DEFAULT: '#8FA6A0',
    light: '#B5C5C1',      // 30% lighter
    lighter: '#DAE4E1',    // 60% lighter
    mid: '#728B84',        // 15% darker
    dark: '#576E68',       // 30% darker
  },

  // ============================================
  // BACKGROUNDS
  // ============================================
  bg: {
    primary: '#F4F1E8',    // Warm off-white
    secondary: '#D9CBB8',  // Clay beige
    tertiary: '#EBE8DF',   // Between primary and secondary
  },

  // ============================================
  // LEAF — Muted leaf green (ties lime to earth)
  // ============================================
  leaf: {
    DEFAULT: '#6F8F4A',
    light: '#9AB87A',      // 30% lighter
    lighter: '#C5DBB0',    // 60% lighter
    mid: '#5C783D',        // 15% darker
    dark: '#4A6130',       // 30% darker
  },

  // ============================================
  // TEAL — Deep green-teal (structure, UI, headings)
  // ============================================
  teal: {
    DEFAULT: '#4E6A63',
    light: '#7A9A92',      // 30% lighter
    lighter: '#A9C2BC',    // 60% lighter
    mid: '#3F5650',        // 15% darker
    dark: '#31433E',       // 30% darker
  },

  // ============================================
  // OLIVE — Near-black olive (text / grounding)
  // ============================================
  olive: {
    black: '#2F3324',      // Primary text
    mid: '#4A5139',        // Secondary text
    light: '#6B7355',      // Tertiary text
  },

  // ============================================
  // SEMANTIC TOKENS
  // ============================================
  text: {
    primary: '#2F3324',
    secondary: '#4A5139',
    tertiary: '#6B7355',
    inverse: '#F4F1E8',
  },

  surface: {
    primary: '#F4F1E8',
    secondary: '#D9CBB8',
    dark: '#2F3324',
  },

  accent: {
    warm: '#E07A5F',
    energy: '#C5D92D',
    cool: '#8FA6A0',
    nature: '#6F8F4A',
    structure: '#4E6A63',
  },

  border: {
    light: 'rgba(47, 51, 36, 0.1)',
    mid: 'rgba(47, 51, 36, 0.2)',
    dark: 'rgba(47, 51, 36, 0.4)',
  },
} as const

// Type exports for TypeScript support
export type ColorToken = typeof colors
export type CoralShade = keyof typeof colors.coral
export type LimeShade = keyof typeof colors.lime
export type EucalyptusShade = keyof typeof colors.eucalyptus
export type LeafShade = keyof typeof colors.leaf
export type TealShade = keyof typeof colors.teal

/**
 * Get a color value by path
 * @example getColor('coral', 'light') => '#F2AFA0'
 * @example getColor('bg', 'primary') => '#F4F1E8'
 */
export function getColor(category: keyof typeof colors, shade?: string): string {
  const colorGroup = colors[category]
  if (typeof colorGroup === 'string') return colorGroup
  if (shade && typeof colorGroup === 'object' && shade in colorGroup) {
    return (colorGroup as Record<string, string>)[shade]
  }
  if ('DEFAULT' in colorGroup) return colorGroup.DEFAULT
  return Object.values(colorGroup)[0]
}

/**
 * Generate hover color (darker variant for AA accessibility)
 * @param baseColor - The base hex color
 * @param darkenPercent - Percentage to darken (default 25)
 */
export function getHoverColor(baseColor: string, darkenPercent: number = 25): string {
  const hex = baseColor.replace('#', '')
  const num = parseInt(hex, 16)
  const r = Math.max(0, (num >> 16) - Math.round(255 * darkenPercent / 100))
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * darkenPercent / 100))
  const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * darkenPercent / 100))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

/**
 * Generate light tint of a color
 * @param baseColor - The base hex color
 * @param lightenPercent - Percentage to lighten (default 85)
 */
export function getLightTint(baseColor: string, lightenPercent: number = 85): string {
  const hex = baseColor.replace('#', '')
  const num = parseInt(hex, 16)
  const r = Math.min(255, (num >> 16) + Math.round((255 - (num >> 16)) * lightenPercent / 100))
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * lightenPercent / 100))
  const b = Math.min(255, (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * lightenPercent / 100))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

