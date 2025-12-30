export interface ProportionOption {
  id: string
  label: string
  ratio: number | null  // width/height ratio, null for auto
  description?: string
}

export interface ProportionSection {
  id: string
  label: string
  options: ProportionOption[]
}

export const proportionSections: ProportionSection[] = [
  {
    id: 'common',
    label: 'Common',
    options: [
      { id: 'auto', label: 'Auto', ratio: null, description: 'Fit to image' },
      { id: '1:1', label: '1:1', ratio: 1, description: 'Square' },
      { id: '16:9', label: '16:9', ratio: 16/9, description: 'Widescreen' },
      { id: '9:16', label: '9:16', ratio: 9/16, description: 'Vertical' },
      { id: '4:3', label: '4:3', ratio: 4/3, description: 'Standard' },
      { id: '3:2', label: '3:2', ratio: 3/2, description: 'Classic Photo' },
      { id: '21:9', label: '21:9', ratio: 21/9, description: 'Ultrawide' },
      { id: '2:1', label: '2:1', ratio: 2, description: 'Panoramic' },
    ]
  },
  {
    id: 'facebook',
    label: 'Facebook',
    options: [
      { id: 'fb-post', label: 'Feed Post', ratio: 1.91, description: '1200x630' },
      { id: 'fb-square', label: 'Square Post', ratio: 1, description: '1200x1200' },
      { id: 'fb-story', label: 'Story', ratio: 9/16, description: '1080x1920' },
      { id: 'fb-cover', label: 'Cover Photo', ratio: 820/312, description: '820x312' },
      { id: 'fb-event', label: 'Event Cover', ratio: 16/9, description: '1920x1080' },
      { id: 'fb-group', label: 'Group Cover', ratio: 1640/856, description: '1640x856' },
      { id: 'fb-profile', label: 'Profile Photo', ratio: 1, description: '170x170' },
    ]
  },
  {
    id: 'instagram',
    label: 'Instagram',
    options: [
      { id: 'ig-square', label: 'Square Post', ratio: 1, description: '1080x1080' },
      { id: 'ig-portrait', label: 'Portrait Post', ratio: 4/5, description: '1080x1350' },
      { id: 'ig-landscape', label: 'Landscape Post', ratio: 1.91, description: '1080x566' },
      { id: 'ig-story', label: 'Story/Reels', ratio: 9/16, description: '1080x1920' },
      { id: 'ig-profile', label: 'Profile Photo', ratio: 1, description: '320x320' },
    ]
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    options: [
      { id: 'tw-post', label: 'Feed Image', ratio: 16/9, description: '1200x675' },
      { id: 'tw-header', label: 'Header Photo', ratio: 3, description: '1500x500' },
      { id: 'tw-card', label: 'Card Image', ratio: 1.91, description: '800x418' },
      { id: 'tw-profile', label: 'Profile Photo', ratio: 1, description: '400x400' },
    ]
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    options: [
      { id: 'li-post', label: 'Feed Image', ratio: 1.91, description: '1200x627' },
      { id: 'li-cover', label: 'Cover Photo', ratio: 4, description: '1584x396' },
      { id: 'li-profile', label: 'Profile Photo', ratio: 1, description: '400x400' },
      { id: 'li-logo', label: 'Company Logo', ratio: 1, description: '300x300' },
    ]
  },
  {
    id: 'youtube',
    label: 'YouTube',
    options: [
      { id: 'yt-thumbnail', label: 'Thumbnail', ratio: 16/9, description: '1280x720' },
      { id: 'yt-banner', label: 'Channel Banner', ratio: 16/9, description: '2560x1440' },
      { id: 'yt-icon', label: 'Channel Icon', ratio: 1, description: '800x800' },
      { id: 'yt-shorts', label: 'Shorts', ratio: 9/16, description: '1080x1920' },
    ]
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    options: [
      { id: 'tt-video', label: 'Video', ratio: 9/16, description: '1080x1920' },
      { id: 'tt-profile', label: 'Profile Photo', ratio: 1, description: '200x200' },
    ]
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    options: [
      { id: 'pin-standard', label: 'Standard Pin', ratio: 2/3, description: '1000x1500' },
      { id: 'pin-long', label: 'Long Pin', ratio: 1/2.1, description: '1000x2100' },
      { id: 'pin-square', label: 'Square Pin', ratio: 1, description: '1000x1000' },
      { id: 'pin-profile', label: 'Profile Photo', ratio: 1, description: '165x165' },
    ]
  },
  {
    id: 'appstore',
    label: 'App Store (iOS)',
    options: [
      { id: 'ios-67', label: 'iPhone 6.7"', ratio: 1290/2796, description: '1290x2796' },
      { id: 'ios-65', label: 'iPhone 6.5"', ratio: 1242/2688, description: '1242x2688' },
      { id: 'ios-55', label: 'iPhone 5.5"', ratio: 1242/2208, description: '1242x2208' },
      { id: 'ios-ipad-129', label: 'iPad Pro 12.9"', ratio: 2048/2732, description: '2048x2732' },
      { id: 'ios-ipad-11', label: 'iPad Pro 11"', ratio: 1668/2388, description: '1668x2388' },
    ]
  },
  {
    id: 'playstore',
    label: 'Play Store (Android)',
    options: [
      { id: 'android-phone', label: 'Phone', ratio: 9/16, description: '1080x1920' },
      { id: 'android-7', label: '7" Tablet', ratio: 1200/1920, description: '1200x1920' },
      { id: 'android-10', label: '10" Tablet', ratio: 1920/1200, description: '1920x1200' },
      { id: 'android-feature', label: 'Feature Graphic', ratio: 1024/500, description: '1024x500' },
      { id: 'android-icon', label: 'App Icon', ratio: 1, description: '512x512' },
    ]
  },
  {
    id: 'chromestore',
    label: 'Chrome Web Store',
    options: [
      { id: 'chrome-screenshot', label: 'Screenshot', ratio: 1280/800, description: '1280x800' },
      { id: 'chrome-tile', label: 'Small Tile', ratio: 440/280, description: '440x280' },
      { id: 'chrome-marquee', label: 'Marquee', ratio: 1400/560, description: '1400x560' },
      { id: 'chrome-icon', label: 'Store Icon', ratio: 1, description: '128x128' },
    ]
  },
  {
    id: 'msstore',
    label: 'Microsoft Store',
    options: [
      { id: 'ms-screenshot', label: 'Screenshot', ratio: 1366/768, description: '1366x768' },
      { id: 'ms-poster', label: 'Poster Art', ratio: 720/1080, description: '720x1080' },
      { id: 'ms-hero', label: 'Hero Art', ratio: 1920/1080, description: '1920x1080' },
      { id: 'ms-icon', label: 'App Icon', ratio: 1, description: '300x300' },
    ]
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    options: [
      { id: 'dribbble-shot', label: 'Shot', ratio: 4/3, description: '1600x1200' },
      { id: 'dribbble-hd', label: 'HD Shot', ratio: 16/9, description: '1920x1080' },
    ]
  },
  {
    id: 'behance',
    label: 'Behance',
    options: [
      { id: 'behance-project', label: 'Project Cover', ratio: 808/632, description: '808x632' },
      { id: 'behance-module', label: 'Module', ratio: 1400/788, description: '1400x788' },
    ]
  },
  {
    id: 'presentation',
    label: 'Presentations',
    options: [
      { id: 'pres-16-9', label: 'Widescreen (16:9)', ratio: 16/9, description: '1920x1080' },
      { id: 'pres-4-3', label: 'Standard (4:3)', ratio: 4/3, description: '1024x768' },
      { id: 'pres-16-10', label: 'Wide (16:10)', ratio: 16/10, description: '1920x1200' },
    ]
  },
  {
    id: 'wallpaper',
    label: 'Wallpapers',
    options: [
      { id: 'wall-fhd', label: 'Full HD', ratio: 16/9, description: '1920x1080' },
      { id: 'wall-2k', label: '2K / QHD', ratio: 16/9, description: '2560x1440' },
      { id: 'wall-4k', label: '4K / UHD', ratio: 16/9, description: '3840x2160' },
      { id: 'wall-ultra', label: 'Ultrawide', ratio: 21/9, description: '3440x1440' },
      { id: 'wall-mobile', label: 'Mobile', ratio: 9/19.5, description: '1080x2340' },
    ]
  },
]

// Get all proportion IDs for type safety
export const getAllProportionIds = (): string[] => {
  return proportionSections.flatMap(section => section.options.map(opt => opt.id))
}

// Find proportion by ID
export const getProportionById = (id: string): ProportionOption | undefined => {
  for (const section of proportionSections) {
    const found = section.options.find(opt => opt.id === id)
    if (found) return found
  }
  return undefined
}

// Get section for a proportion ID
export const getSectionForProportion = (id: string): ProportionSection | undefined => {
  return proportionSections.find(section =>
    section.options.some(opt => opt.id === id)
  )
}
