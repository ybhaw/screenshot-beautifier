export interface ThemeOption {
  id: string
  label: string
  description?: string
  // Visual properties
  barHeight: number
  barColor: string
  barColorDark?: string // For themes with light/dark variants
  controlsPosition: 'left' | 'right'
  controls: ThemeControl[]
}

export interface ThemeControl {
  type: 'circle' | 'square' | 'icon'
  color: string
  size: number
  spacing?: number
}

export interface ThemeSection {
  id: string
  label: string
  options: ThemeOption[]
}

export const themeSections: ThemeSection[] = [
  {
    id: 'none',
    label: 'None',
    options: [
      {
        id: 'none',
        label: 'None',
        description: 'No frame',
        barHeight: 0,
        barColor: 'transparent',
        controlsPosition: 'left',
        controls: [],
      },
    ],
  },
  {
    id: 'browser',
    label: 'Browser',
    options: [
      {
        id: 'browser-light',
        label: 'Light',
        description: 'Light browser chrome',
        barHeight: 36,
        barColor: '#f1f3f4',
        controlsPosition: 'left',
        controls: [
          { type: 'circle', color: '#ff5f56', size: 12 },
          { type: 'circle', color: '#ffbd2e', size: 12 },
          { type: 'circle', color: '#27ca40', size: 12 },
        ],
      },
      {
        id: 'browser-dark',
        label: 'Dark',
        description: 'Dark browser chrome',
        barHeight: 36,
        barColor: '#202124',
        controlsPosition: 'left',
        controls: [
          { type: 'circle', color: '#ff5f56', size: 12 },
          { type: 'circle', color: '#ffbd2e', size: 12 },
          { type: 'circle', color: '#27ca40', size: 12 },
        ],
      },
    ],
  },
  {
    id: 'macos',
    label: 'macOS',
    options: [
      {
        id: 'macos-light',
        label: 'Light',
        description: 'macOS window light',
        barHeight: 28,
        barColor: '#e8e8e8',
        controlsPosition: 'left',
        controls: [
          { type: 'circle', color: '#ff5f56', size: 12 },
          { type: 'circle', color: '#ffbd2e', size: 12 },
          { type: 'circle', color: '#27ca40', size: 12 },
        ],
      },
      {
        id: 'macos-dark',
        label: 'Dark',
        description: 'macOS window dark',
        barHeight: 28,
        barColor: '#3a3a3c',
        controlsPosition: 'left',
        controls: [
          { type: 'circle', color: '#ff5f56', size: 12 },
          { type: 'circle', color: '#ffbd2e', size: 12 },
          { type: 'circle', color: '#27ca40', size: 12 },
        ],
      },
    ],
  },
  {
    id: 'windows',
    label: 'Windows',
    options: [
      {
        id: 'windows-light',
        label: 'Light',
        description: 'Windows 11 light',
        barHeight: 32,
        barColor: '#f3f3f3',
        controlsPosition: 'right',
        controls: [
          { type: 'icon', color: '#000000', size: 10 }, // minimize
          { type: 'icon', color: '#000000', size: 10 }, // maximize
          { type: 'icon', color: '#000000', size: 10 }, // close
        ],
      },
      {
        id: 'windows-dark',
        label: 'Dark',
        description: 'Windows 11 dark',
        barHeight: 32,
        barColor: '#202020',
        controlsPosition: 'right',
        controls: [
          { type: 'icon', color: '#ffffff', size: 10 },
          { type: 'icon', color: '#ffffff', size: 10 },
          { type: 'icon', color: '#ffffff', size: 10 },
        ],
      },
    ],
  },
  {
    id: 'terminal',
    label: 'Terminal',
    options: [
      {
        id: 'terminal-macos',
        label: 'macOS',
        description: 'macOS Terminal',
        barHeight: 28,
        barColor: '#e8e8e8',
        controlsPosition: 'left',
        controls: [
          { type: 'circle', color: '#ff5f56', size: 12 },
          { type: 'circle', color: '#ffbd2e', size: 12 },
          { type: 'circle', color: '#27ca40', size: 12 },
        ],
      },
      {
        id: 'terminal-ubuntu',
        label: 'Ubuntu',
        description: 'Ubuntu Terminal',
        barHeight: 32,
        barColor: '#300a24',
        controlsPosition: 'right',
        controls: [
          { type: 'circle', color: '#f46c6c', size: 12 },
          { type: 'circle', color: '#f4c66c', size: 12 },
          { type: 'circle', color: '#6cf46c', size: 12 },
        ],
      },
      {
        id: 'terminal-windows',
        label: 'Windows',
        description: 'Windows Terminal',
        barHeight: 32,
        barColor: '#0c0c0c',
        controlsPosition: 'right',
        controls: [
          { type: 'icon', color: '#ffffff', size: 10 },
          { type: 'icon', color: '#ffffff', size: 10 },
          { type: 'icon', color: '#ffffff', size: 10 },
        ],
      },
      {
        id: 'terminal-vscode',
        label: 'VS Code',
        description: 'VS Code integrated terminal',
        barHeight: 32,
        barColor: '#1e1e1e',
        controlsPosition: 'right',
        controls: [
          { type: 'icon', color: '#858585', size: 10 },
          { type: 'icon', color: '#858585', size: 10 },
          { type: 'icon', color: '#858585', size: 10 },
        ],
      },
    ],
  },
  {
    id: 'code-editor',
    label: 'Code Editor',
    options: [
      {
        id: 'vscode-dark',
        label: 'VS Code Dark',
        description: 'Visual Studio Code dark',
        barHeight: 32,
        barColor: '#323233',
        controlsPosition: 'right',
        controls: [
          { type: 'icon', color: '#858585', size: 10 },
          { type: 'icon', color: '#858585', size: 10 },
          { type: 'icon', color: '#858585', size: 10 },
        ],
      },
      {
        id: 'vscode-light',
        label: 'VS Code Light',
        description: 'Visual Studio Code light',
        barHeight: 32,
        barColor: '#dddddd',
        controlsPosition: 'right',
        controls: [
          { type: 'icon', color: '#444444', size: 10 },
          { type: 'icon', color: '#444444', size: 10 },
          { type: 'icon', color: '#444444', size: 10 },
        ],
      },
      {
        id: 'sublime',
        label: 'Sublime Text',
        description: 'Sublime Text editor',
        barHeight: 28,
        barColor: '#3c3c3c',
        controlsPosition: 'left',
        controls: [
          { type: 'circle', color: '#ff5f56', size: 12 },
          { type: 'circle', color: '#ffbd2e', size: 12 },
          { type: 'circle', color: '#27ca40', size: 12 },
        ],
      },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    options: [
      {
        id: 'ios-status',
        label: 'iOS Status Bar',
        description: 'iPhone status bar',
        barHeight: 44,
        barColor: '#000000',
        controlsPosition: 'left',
        controls: [], // Special rendering for iOS status bar
      },
      {
        id: 'android-status',
        label: 'Android Status',
        description: 'Android status bar',
        barHeight: 24,
        barColor: '#000000',
        controlsPosition: 'left',
        controls: [], // Special rendering for Android status bar
      },
    ],
  },
]

// Get all theme IDs for type safety
export const getAllThemeIds = (): string[] => {
  return themeSections.flatMap((section) => section.options.map((opt) => opt.id))
}

// Find theme by ID
export const getThemeById = (id: string): ThemeOption | undefined => {
  for (const section of themeSections) {
    const found = section.options.find((opt) => opt.id === id)
    if (found) return found
  }
  return undefined
}

// Get section for a theme ID
export const getSectionForTheme = (id: string): ThemeSection | undefined => {
  return themeSections.find((section) => section.options.some((opt) => opt.id === id))
}
