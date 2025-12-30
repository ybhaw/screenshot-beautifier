import {
  defaultSettings,
  paddingValues,
  radiusValues,
  borderWidthValues,
  zoomOptions,
} from '../src/types'

describe('types and constants', () => {
  describe('defaultSettings', () => {
    it('has all required properties', () => {
      expect(defaultSettings).toHaveProperty('proportion')
      expect(defaultSettings).toHaveProperty('theme')
      expect(defaultSettings).toHaveProperty('padding')
      expect(defaultSettings).toHaveProperty('backgroundTheme')
      expect(defaultSettings).toHaveProperty('bgColor1')
      expect(defaultSettings).toHaveProperty('bgColor2')
      expect(defaultSettings).toHaveProperty('gradientAngle')
      expect(defaultSettings).toHaveProperty('innerRadius')
      expect(defaultSettings).toHaveProperty('position')
      expect(defaultSettings).toHaveProperty('shadow')
      expect(defaultSettings).toHaveProperty('screenshotBorder')
      expect(defaultSettings).toHaveProperty('imageBorder')
    })

    it('has valid default values', () => {
      expect(defaultSettings.proportion).toBe('auto')
      expect(defaultSettings.position).toBe('center')
      expect(defaultSettings.padding).toBe('medium')
      expect(defaultSettings.shadow).toBe('medium')
    })
  })

  describe('paddingValues', () => {
    it('has correct values for each size preset', () => {
      expect(paddingValues.none).toBe(0)
      expect(paddingValues.small).toBe(40)
      expect(paddingValues.medium).toBe(80)
      expect(paddingValues.large).toBe(120)
    })
  })

  describe('radiusValues', () => {
    it('has correct values for each size preset', () => {
      expect(radiusValues.none).toBe(0)
      expect(radiusValues.small).toBe(8)
      expect(radiusValues.medium).toBe(16)
      expect(radiusValues.large).toBe(24)
    })
  })

  describe('borderWidthValues', () => {
    it('has correct values for each size preset', () => {
      expect(borderWidthValues.none).toBe(0)
      expect(borderWidthValues.small).toBe(2)
      expect(borderWidthValues.medium).toBe(4)
      expect(borderWidthValues.large).toBe(6)
    })
  })

  describe('zoomOptions', () => {
    it('has all expected zoom levels', () => {
      const ids = zoomOptions.map(opt => opt.id)
      expect(ids).toContain('fit')
      expect(ids).toContain('50')
      expect(ids).toContain('100')
      expect(ids).toContain('200')
      expect(ids).toContain('match-width')
    })

    it('has labels and descriptions for all options', () => {
      zoomOptions.forEach(option => {
        expect(option.label).toBeTruthy()
        expect(option.description).toBeTruthy()
      })
    })
  })
})
