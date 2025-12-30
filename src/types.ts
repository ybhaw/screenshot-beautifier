export interface Settings {
  proportion: string
  theme: string
  padding: 'none' | 'small' | 'medium' | 'large'
  backgroundTheme: string
  bgColor1: string
  bgColor2: string
  gradientAngle: number
  innerRadius: 'none' | 'small' | 'medium' | 'large'
  position: 'center' | 'top-left' | 'top' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right'
  shadow: 'none' | 'small' | 'medium' | 'large'
  screenshotBorder: 'none' | 'small' | 'medium' | 'large'
  imageBorder: 'none' | 'small' | 'medium' | 'large'
}

export type SizePreset = 'none' | 'small' | 'medium' | 'large'
export type Position = Settings['position']

export interface DropdownOption {
  id: string
  label: string
  description?: string
}

export interface DropdownSection<T extends DropdownOption = DropdownOption> {
  id: string
  label: string
  options: T[]
}

export interface ZoomOption {
  id: 'fit' | '50' | '100' | '200' | 'match-width'
  label: string
  description: string
}

export const defaultSettings: Settings = {
  proportion: 'auto',
  theme: 'none',
  padding: 'medium',
  backgroundTheme: 'pink-purple',
  bgColor1: '#ec4899',
  bgColor2: '#8b5cf6',
  gradientAngle: 135,
  innerRadius: 'small',
  position: 'center',
  shadow: 'medium',
  screenshotBorder: 'none',
  imageBorder: 'none',
}

export const paddingValues: Record<SizePreset, number> = { none: 0, small: 40, medium: 80, large: 120 }
export const radiusValues: Record<SizePreset, number> = { none: 0, small: 8, medium: 16, large: 24 }
export const borderWidthValues: Record<SizePreset, number> = { none: 0, small: 2, medium: 4, large: 6 }

export const zoomOptions: ZoomOption[] = [
  { id: 'fit', label: 'Fit', description: 'Shrink to fit' },
  { id: '50', label: '50%', description: 'Half size' },
  { id: '100', label: '100%', description: 'Actual size' },
  { id: '200', label: '200%', description: 'Double size' },
  { id: 'match-width', label: 'Match Width', description: 'Fill width' },
]
