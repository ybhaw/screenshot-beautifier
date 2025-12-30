export interface BackgroundOption {
  id: string
  label: string
  description?: string
  bgColor1: string
  bgColor2: string
  gradientAngle: number
}

export interface BackgroundSection {
  id: string
  label: string
  options: BackgroundOption[]
}

export const backgroundSections: BackgroundSection[] = [
  {
    id: 'vibrant',
    label: 'Vibrant',
    options: [
      {
        id: 'pink-purple',
        label: 'Pink Purple',
        description: 'Default gradient',
        bgColor1: '#ec4899',
        bgColor2: '#8b5cf6',
        gradientAngle: 135,
      },
      {
        id: 'orange-pink',
        label: 'Orange Pink',
        description: 'Warm sunset',
        bgColor1: '#f97316',
        bgColor2: '#ec4899',
        gradientAngle: 135,
      },
      {
        id: 'cyan-blue',
        label: 'Cyan Blue',
        description: 'Ocean wave',
        bgColor1: '#06b6d4',
        bgColor2: '#3b82f6',
        gradientAngle: 135,
      },
      {
        id: 'green-cyan',
        label: 'Green Cyan',
        description: 'Tropical',
        bgColor1: '#10b981',
        bgColor2: '#06b6d4',
        gradientAngle: 135,
      },
      {
        id: 'yellow-orange',
        label: 'Yellow Orange',
        description: 'Sunshine',
        bgColor1: '#facc15',
        bgColor2: '#f97316',
        gradientAngle: 135,
      },
      {
        id: 'red-pink',
        label: 'Red Pink',
        description: 'Rose',
        bgColor1: '#ef4444',
        bgColor2: '#ec4899',
        gradientAngle: 135,
      },
    ],
  },
  {
    id: 'pastel',
    label: 'Pastel',
    options: [
      {
        id: 'pastel-pink',
        label: 'Soft Pink',
        description: 'Light pink gradient',
        bgColor1: '#fce7f3',
        bgColor2: '#fbcfe8',
        gradientAngle: 135,
      },
      {
        id: 'pastel-blue',
        label: 'Soft Blue',
        description: 'Light blue gradient',
        bgColor1: '#dbeafe',
        bgColor2: '#bfdbfe',
        gradientAngle: 135,
      },
      {
        id: 'pastel-green',
        label: 'Soft Green',
        description: 'Light green gradient',
        bgColor1: '#dcfce7',
        bgColor2: '#bbf7d0',
        gradientAngle: 135,
      },
      {
        id: 'pastel-purple',
        label: 'Soft Purple',
        description: 'Light purple gradient',
        bgColor1: '#f3e8ff',
        bgColor2: '#e9d5ff',
        gradientAngle: 135,
      },
      {
        id: 'pastel-peach',
        label: 'Soft Peach',
        description: 'Light peach gradient',
        bgColor1: '#ffedd5',
        bgColor2: '#fed7aa',
        gradientAngle: 135,
      },
      {
        id: 'pastel-mint',
        label: 'Soft Mint',
        description: 'Light mint gradient',
        bgColor1: '#d1fae5',
        bgColor2: '#a7f3d0',
        gradientAngle: 135,
      },
    ],
  },
  {
    id: 'dark',
    label: 'Dark',
    options: [
      {
        id: 'dark-purple',
        label: 'Dark Purple',
        description: 'Deep purple',
        bgColor1: '#1e1b4b',
        bgColor2: '#312e81',
        gradientAngle: 135,
      },
      {
        id: 'dark-blue',
        label: 'Dark Blue',
        description: 'Deep blue',
        bgColor1: '#0c1929',
        bgColor2: '#1e3a5f',
        gradientAngle: 135,
      },
      {
        id: 'dark-green',
        label: 'Dark Green',
        description: 'Deep green',
        bgColor1: '#022c22',
        bgColor2: '#064e3b',
        gradientAngle: 135,
      },
      {
        id: 'dark-red',
        label: 'Dark Red',
        description: 'Deep red',
        bgColor1: '#450a0a',
        bgColor2: '#7f1d1d',
        gradientAngle: 135,
      },
      {
        id: 'charcoal',
        label: 'Charcoal',
        description: 'Dark gray',
        bgColor1: '#171717',
        bgColor2: '#262626',
        gradientAngle: 135,
      },
      {
        id: 'midnight',
        label: 'Midnight',
        description: 'Black to dark blue',
        bgColor1: '#000000',
        bgColor2: '#1e3a5f',
        gradientAngle: 135,
      },
    ],
  },
  {
    id: 'sunset',
    label: 'Sunset',
    options: [
      {
        id: 'sunset-orange',
        label: 'Golden Hour',
        description: 'Warm sunset',
        bgColor1: '#fbbf24',
        bgColor2: '#f97316',
        gradientAngle: 180,
      },
      {
        id: 'sunset-pink',
        label: 'Dusk',
        description: 'Pink evening',
        bgColor1: '#f472b6',
        bgColor2: '#9333ea',
        gradientAngle: 180,
      },
      {
        id: 'sunset-fire',
        label: 'Fire Sky',
        description: 'Red orange',
        bgColor1: '#ef4444',
        bgColor2: '#f97316',
        gradientAngle: 180,
      },
      {
        id: 'sunset-mango',
        label: 'Mango',
        description: 'Yellow red',
        bgColor1: '#fde047',
        bgColor2: '#ef4444',
        gradientAngle: 180,
      },
      {
        id: 'sunset-purple',
        label: 'Twilight',
        description: 'Purple pink',
        bgColor1: '#a855f7',
        bgColor2: '#ec4899',
        gradientAngle: 180,
      },
    ],
  },
  {
    id: 'ocean',
    label: 'Ocean',
    options: [
      {
        id: 'ocean-deep',
        label: 'Deep Ocean',
        description: 'Dark blue',
        bgColor1: '#0369a1',
        bgColor2: '#0c4a6e',
        gradientAngle: 180,
      },
      {
        id: 'ocean-tropical',
        label: 'Tropical',
        description: 'Teal cyan',
        bgColor1: '#14b8a6',
        bgColor2: '#0891b2',
        gradientAngle: 135,
      },
      {
        id: 'ocean-wave',
        label: 'Wave',
        description: 'Blue cyan',
        bgColor1: '#3b82f6',
        bgColor2: '#06b6d4',
        gradientAngle: 135,
      },
      {
        id: 'ocean-lagoon',
        label: 'Lagoon',
        description: 'Light teal',
        bgColor1: '#2dd4bf',
        bgColor2: '#22d3ee',
        gradientAngle: 135,
      },
      {
        id: 'ocean-midnight',
        label: 'Midnight Sea',
        description: 'Dark teal',
        bgColor1: '#134e4a',
        bgColor2: '#164e63',
        gradientAngle: 180,
      },
    ],
  },
  {
    id: 'nature',
    label: 'Nature',
    options: [
      {
        id: 'forest',
        label: 'Forest',
        description: 'Green gradient',
        bgColor1: '#166534',
        bgColor2: '#15803d',
        gradientAngle: 135,
      },
      {
        id: 'spring',
        label: 'Spring',
        description: 'Fresh green',
        bgColor1: '#84cc16',
        bgColor2: '#22c55e',
        gradientAngle: 135,
      },
      {
        id: 'autumn',
        label: 'Autumn',
        description: 'Fall colors',
        bgColor1: '#ea580c',
        bgColor2: '#ca8a04',
        gradientAngle: 135,
      },
      {
        id: 'lavender',
        label: 'Lavender',
        description: 'Purple field',
        bgColor1: '#a78bfa',
        bgColor2: '#c4b5fd',
        gradientAngle: 135,
      },
      {
        id: 'cherry',
        label: 'Cherry Blossom',
        description: 'Soft pink',
        bgColor1: '#f9a8d4',
        bgColor2: '#f472b6',
        gradientAngle: 135,
      },
    ],
  },
  {
    id: 'gradient-mesh',
    label: 'Modern',
    options: [
      {
        id: 'mesh-purple',
        label: 'Purple Haze',
        description: 'Purple to pink',
        bgColor1: '#7c3aed',
        bgColor2: '#db2777',
        gradientAngle: 45,
      },
      {
        id: 'mesh-blue',
        label: 'Blue Shift',
        description: 'Blue to purple',
        bgColor1: '#2563eb',
        bgColor2: '#7c3aed',
        gradientAngle: 45,
      },
      {
        id: 'mesh-green',
        label: 'Northern Lights',
        description: 'Green to blue',
        bgColor1: '#059669',
        bgColor2: '#0284c7',
        gradientAngle: 45,
      },
      {
        id: 'mesh-orange',
        label: 'Lava',
        description: 'Orange to red',
        bgColor1: '#ea580c',
        bgColor2: '#dc2626',
        gradientAngle: 45,
      },
      {
        id: 'mesh-pink',
        label: 'Cotton Candy',
        description: 'Pink to blue',
        bgColor1: '#ec4899',
        bgColor2: '#8b5cf6',
        gradientAngle: 90,
      },
    ],
  },
  {
    id: 'solid',
    label: 'Solid',
    options: [
      {
        id: 'solid-white',
        label: 'White',
        description: 'Pure white',
        bgColor1: '#ffffff',
        bgColor2: '#ffffff',
        gradientAngle: 0,
      },
      {
        id: 'solid-black',
        label: 'Black',
        description: 'Pure black',
        bgColor1: '#000000',
        bgColor2: '#000000',
        gradientAngle: 0,
      },
      {
        id: 'solid-gray',
        label: 'Gray',
        description: 'Neutral gray',
        bgColor1: '#6b7280',
        bgColor2: '#6b7280',
        gradientAngle: 0,
      },
      {
        id: 'solid-blue',
        label: 'Blue',
        description: 'Solid blue',
        bgColor1: '#3b82f6',
        bgColor2: '#3b82f6',
        gradientAngle: 0,
      },
      {
        id: 'solid-green',
        label: 'Green',
        description: 'Solid green',
        bgColor1: '#22c55e',
        bgColor2: '#22c55e',
        gradientAngle: 0,
      },
      {
        id: 'solid-red',
        label: 'Red',
        description: 'Solid red',
        bgColor1: '#ef4444',
        bgColor2: '#ef4444',
        gradientAngle: 0,
      },
    ],
  },
]

// Get all background IDs for type safety
export const getAllBackgroundIds = (): string[] => {
  return backgroundSections.flatMap((section) => section.options.map((opt) => opt.id))
}

// Find background by ID
export const getBackgroundById = (id: string): BackgroundOption | undefined => {
  for (const section of backgroundSections) {
    const found = section.options.find((opt) => opt.id === id)
    if (found) return found
  }
  return undefined
}

// Get section for a background ID
export const getSectionForBackground = (id: string): BackgroundSection | undefined => {
  return backgroundSections.find((section) => section.options.some((opt) => opt.id === id))
}
