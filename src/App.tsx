import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { proportionSections, getProportionById, getSectionForProportion } from './proportions.config'
import { themeSections, getThemeById, getSectionForTheme } from './theme.config'
import { backgroundSections, getBackgroundById, getSectionForBackground } from './background.config'

interface Settings {
  proportion: string
  theme: string
  padding: 'none' | 'small' | 'medium' | 'large'
  backgroundTheme: string
  bgColor1: string
  bgColor2: string
  gradientAngle: number
  outerRadius: 'none' | 'small' | 'medium' | 'large'
  innerRadius: 'none' | 'small' | 'medium' | 'large'
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  shadow: 'none' | 'small' | 'medium' | 'large'
}

const defaultSettings: Settings = {
  proportion: 'auto',
  theme: 'none',
  padding: 'medium',
  backgroundTheme: 'pink-purple',
  bgColor1: '#ec4899',
  bgColor2: '#8b5cf6',
  gradientAngle: 135,
  outerRadius: 'medium',
  innerRadius: 'small',
  position: 'center',
  shadow: 'medium',
}

const paddingValues = { none: 0, small: 40, medium: 80, large: 120 }
const radiusValues = { none: 0, small: 8, medium: 16, large: 24 }

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isDragging, setIsDragging] = useState(false)
  const [proportionDropdownOpen, setProportionDropdownOpen] = useState(false)
  const [proportionSearch, setProportionSearch] = useState('')
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const [themeSearch, setThemeSearch] = useState('')
  const [backgroundDropdownOpen, setBackgroundDropdownOpen] = useState(false)
  const [backgroundSearch, setBackgroundSearch] = useState('')
  const [customRatio, setCustomRatio] = useState({ width: 16, height: 9 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const proportionDropdownRef = useRef<HTMLDivElement>(null)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const backgroundDropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const themeSearchInputRef = useRef<HTMLInputElement>(null)
  const backgroundSearchInputRef = useRef<HTMLInputElement>(null)

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleImageLoad = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => setImage(img)
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) handleImageLoad(file)
        break
      }
    }
  }, [handleImageLoad])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) {
      handleImageLoad(file)
    }
  }, [handleImageLoad])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (proportionDropdownRef.current && !proportionDropdownRef.current.contains(e.target as Node)) {
        setProportionDropdownOpen(false)
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false)
      }
      if (backgroundDropdownRef.current && !backgroundDropdownRef.current.contains(e.target as Node)) {
        setBackgroundDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = paddingValues[settings.padding]
    const innerRadius = radiusValues[settings.innerRadius]
    const themeConfig = getThemeById(settings.theme)
    const themeBarHeight = themeConfig?.barHeight ?? 0

    // Calculate dimensions
    let canvasWidth: number
    let canvasHeight: number
    const imgWidth = image.width
    const imgHeight = image.height + themeBarHeight

    const proportionConfig = getProportionById(settings.proportion)
    const ratio = settings.proportion === 'custom'
      ? customRatio.width / customRatio.height
      : proportionConfig?.ratio

    if (settings.proportion !== 'custom' && (ratio === null || ratio === undefined)) {
      // Auto mode - fit to image
      if (settings.position === 'center') {
        canvasWidth = imgWidth + padding * 2
        canvasHeight = imgHeight + padding * 2
      } else {
        // Add extra space for non-center positions
        canvasWidth = imgWidth + padding * 3
        canvasHeight = imgHeight + padding * 3
      }
    } else if (ratio === 1) {
      // Square
      canvasWidth = canvasHeight = Math.max(imgWidth, imgHeight) + padding * 2
    } else if (ratio) {
      // Custom aspect ratio
      canvasWidth = imgWidth + padding * 2
      canvasHeight = canvasWidth / ratio
      if (canvasHeight < imgHeight + padding * 2) {
        canvasHeight = imgHeight + padding * 2
        canvasWidth = canvasHeight * ratio
      }
    } else {
      // Fallback to auto
      canvasWidth = imgWidth + padding * 2
      canvasHeight = imgHeight + padding * 2
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Draw gradient background
    const angle = (settings.gradientAngle * Math.PI) / 180
    const x1 = canvasWidth / 2 - Math.cos(angle) * canvasWidth
    const y1 = canvasHeight / 2 - Math.sin(angle) * canvasHeight
    const x2 = canvasWidth / 2 + Math.cos(angle) * canvasWidth
    const y2 = canvasHeight / 2 + Math.sin(angle) * canvasHeight
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
    gradient.addColorStop(0, settings.bgColor1)
    gradient.addColorStop(1, settings.bgColor2)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Calculate image position
    let imgX: number
    let imgY: number
    switch (settings.position) {
      case 'top-left':
        imgX = padding
        imgY = padding
        break
      case 'top-right':
        imgX = canvasWidth - imgWidth - padding
        imgY = padding
        break
      case 'bottom-left':
        imgX = padding
        imgY = canvasHeight - imgHeight - padding
        break
      case 'bottom-right':
        imgX = canvasWidth - imgWidth - padding
        imgY = canvasHeight - imgHeight - padding
        break
      default: // center
        imgX = (canvasWidth - imgWidth) / 2
        imgY = (canvasHeight - imgHeight) / 2
    }

    // Draw shadow
    if (settings.shadow !== 'none') {
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = settings.shadow === 'small' ? 10 : settings.shadow === 'medium' ? 25 : 50
      ctx.shadowOffsetY = settings.shadow === 'small' ? 4 : settings.shadow === 'medium' ? 10 : 20

      // Draw shadow shape
      ctx.beginPath()
      ctx.roundRect(imgX, imgY, imgWidth, imgHeight, innerRadius)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fill()
      ctx.restore()
    }

    // Clip to rounded rectangle
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(imgX, imgY, imgWidth, imgHeight, innerRadius)
    ctx.clip()

    // Draw theme bar if enabled
    if (themeConfig && themeBarHeight > 0) {
      ctx.fillStyle = themeConfig.barColor
      ctx.fillRect(imgX, imgY, imgWidth, themeBarHeight)

      // Draw window controls
      if (themeConfig.controls.length > 0) {
        const controlSpacing = 20
        const controlStartY = imgY + themeBarHeight / 2

        if (themeConfig.controlsPosition === 'left') {
          themeConfig.controls.forEach((control, i) => {
            const controlX = imgX + 20 + i * controlSpacing
            if (control.type === 'circle') {
              ctx.beginPath()
              ctx.arc(controlX, controlStartY, control.size / 2, 0, Math.PI * 2)
              ctx.fillStyle = control.color
              ctx.fill()
            } else if (control.type === 'icon') {
              // Draw simple window control icons (minimize, maximize, close)
              ctx.fillStyle = control.color
              ctx.font = `${control.size}px Arial`
              const icons = ['−', '□', '×']
              ctx.fillText(icons[i] || '−', controlX - 4, controlStartY + 4)
            }
          })
        } else {
          // Right-aligned controls (Windows style)
          themeConfig.controls.forEach((control, i) => {
            const controlX = imgX + imgWidth - 20 - (themeConfig.controls.length - 1 - i) * (controlSpacing + 26)
            if (control.type === 'circle') {
              ctx.beginPath()
              ctx.arc(controlX, controlStartY, control.size / 2, 0, Math.PI * 2)
              ctx.fillStyle = control.color
              ctx.fill()
            } else if (control.type === 'icon') {
              // Draw Windows-style controls
              ctx.fillStyle = control.color
              ctx.font = `${control.size + 2}px Arial`
              const icons = ['−', '□', '×']
              ctx.fillText(icons[i] || '−', controlX - 4, controlStartY + 4)
            }
          })
        }
      }
    }

    // Draw the image
    ctx.drawImage(image, imgX, imgY + themeBarHeight)
    ctx.restore()

  }, [image, settings, customRatio])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && image) {
        e.preventDefault()
        copyToClipboard()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && image) {
        e.preventDefault()
        saveImage()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [image])

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvasRef.current!.toBlob((b) => resolve(b!), 'image/png')
      )
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      alert('Image copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const saveImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'beautified-screenshot.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const reset = () => {
    setSettings(defaultSettings)
  }

  return (
    <div className="app">
      <div className="main-content">
        <div
          className={`preview-area ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!image ? (
            <div className="drop-zone">
              <div className="drop-icon">+</div>
              <p>Paste (Cmd/Ctrl+V), drag & drop, or</p>
              <button onClick={() => fileInputRef.current?.click()}>
                Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageLoad(e.target.files[0])}
                hidden
              />
            </div>
          ) : (
            <div className="canvas-container">
              <canvas ref={canvasRef} />
            </div>
          )}
        </div>

        <div className="controls">
          <div className="controls-header">
            <h2>Settings</h2>
            <button className="reset-btn" onClick={reset}>Reset</button>
          </div>

          <div className="control-group">
            <label>Proportion</label>
            <div className="proportion-dropdown" ref={proportionDropdownRef}>
              <button
                className="proportion-dropdown-trigger"
                onClick={() => {
                  setProportionDropdownOpen(!proportionDropdownOpen)
                  if (!proportionDropdownOpen) {
                    setProportionSearch('')
                    setTimeout(() => searchInputRef.current?.focus(), 0)
                  }
                }}
              >
                <span className="proportion-selected">
                  {(() => {
                    if (settings.proportion === 'custom') {
                      return (
                        <>
                          <span className="proportion-label">{customRatio.width}:{customRatio.height}</span>
                          <span className="proportion-section-tag">Custom</span>
                        </>
                      )
                    }
                    const prop = getProportionById(settings.proportion)
                    const section = getSectionForProportion(settings.proportion)
                    return prop ? (
                      <>
                        <span className="proportion-label">{prop.label}</span>
                        {section && section.id !== 'common' && (
                          <span className="proportion-section-tag">{section.label}</span>
                        )}
                      </>
                    ) : 'Select...'
                  })()}
                </span>
                <span className={`proportion-arrow ${proportionDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              {proportionDropdownOpen && (
                <div className="proportion-dropdown-menu">
                  <div className="proportion-search">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={proportionSearch}
                      onChange={(e) => setProportionSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Custom ratio section */}
                  {(proportionSearch === '' || 'custom'.includes(proportionSearch.toLowerCase())) && (
                    <div className="proportion-section">
                      <div className="proportion-section-header">Custom</div>
                      <div className="proportion-custom">
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          value={customRatio.width}
                          onChange={(e) => setCustomRatio(prev => ({ ...prev, width: Math.max(1, parseInt(e.target.value) || 1) }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span>:</span>
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          value={customRatio.height}
                          onChange={(e) => setCustomRatio(prev => ({ ...prev, height: Math.max(1, parseInt(e.target.value) || 1) }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          className={`proportion-custom-apply ${settings.proportion === 'custom' ? 'active' : ''}`}
                          onClick={() => {
                            updateSetting('proportion', 'custom')
                            setProportionDropdownOpen(false)
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Filtered sections */}
                  {proportionSections
                    .map(section => ({
                      ...section,
                      options: section.options.filter(option =>
                        proportionSearch === '' ||
                        option.label.toLowerCase().includes(proportionSearch.toLowerCase()) ||
                        option.description?.toLowerCase().includes(proportionSearch.toLowerCase()) ||
                        section.label.toLowerCase().includes(proportionSearch.toLowerCase())
                      )
                    }))
                    .filter(section => section.options.length > 0)
                    .map(section => (
                      <div key={section.id} className="proportion-section">
                        <div className="proportion-section-header">{section.label}</div>
                        {section.options.map(option => (
                          <button
                            key={option.id}
                            className={`proportion-option ${settings.proportion === option.id ? 'active' : ''}`}
                            onClick={() => {
                              updateSetting('proportion', option.id)
                              setProportionDropdownOpen(false)
                            }}
                          >
                            <span className="proportion-option-label">{option.label}</span>
                            {option.description && (
                              <span className="proportion-option-desc">{option.description}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="control-group">
            <label>Window Frame</label>
            <div className="proportion-dropdown" ref={themeDropdownRef}>
              <button
                className="proportion-dropdown-trigger"
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen)
                  if (!themeDropdownOpen) {
                    setThemeSearch('')
                    setTimeout(() => themeSearchInputRef.current?.focus(), 0)
                  }
                }}
              >
                <span className="proportion-selected">
                  {(() => {
                    const theme = getThemeById(settings.theme)
                    const section = getSectionForTheme(settings.theme)
                    return theme ? (
                      <>
                        <span className="proportion-label">{theme.label}</span>
                        {section && section.id !== 'none' && (
                          <span className="proportion-section-tag">{section.label}</span>
                        )}
                      </>
                    ) : 'Select...'
                  })()}
                </span>
                <span className={`proportion-arrow ${themeDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              {themeDropdownOpen && (
                <div className="proportion-dropdown-menu">
                  <div className="proportion-search">
                    <input
                      ref={themeSearchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={themeSearch}
                      onChange={(e) => setThemeSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Filtered sections */}
                  {themeSections
                    .map(section => ({
                      ...section,
                      options: section.options.filter(option =>
                        themeSearch === '' ||
                        option.label.toLowerCase().includes(themeSearch.toLowerCase()) ||
                        option.description?.toLowerCase().includes(themeSearch.toLowerCase()) ||
                        section.label.toLowerCase().includes(themeSearch.toLowerCase())
                      )
                    }))
                    .filter(section => section.options.length > 0)
                    .map(section => (
                      <div key={section.id} className="proportion-section">
                        <div className="proportion-section-header">{section.label}</div>
                        {section.options.map(option => (
                          <button
                            key={option.id}
                            className={`proportion-option ${settings.theme === option.id ? 'active' : ''}`}
                            onClick={() => {
                              updateSetting('theme', option.id)
                              setThemeDropdownOpen(false)
                            }}
                          >
                            <span className="proportion-option-label">{option.label}</span>
                            {option.description && (
                              <span className="proportion-option-desc">{option.description}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="control-group">
            <label>Padding</label>
            <div className="button-group">
              {(['none', 'small', 'medium', 'large'] as const).map(p => (
                <button
                  key={p}
                  className={settings.padding === p ? 'active' : ''}
                  onClick={() => updateSetting('padding', p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Background</label>
            <div className="proportion-dropdown" ref={backgroundDropdownRef}>
              <button
                className="proportion-dropdown-trigger"
                onClick={() => {
                  setBackgroundDropdownOpen(!backgroundDropdownOpen)
                  if (!backgroundDropdownOpen) {
                    setBackgroundSearch('')
                    setTimeout(() => backgroundSearchInputRef.current?.focus(), 0)
                  }
                }}
              >
                <span className="proportion-selected">
                  {(() => {
                    if (settings.backgroundTheme === 'custom') {
                      return (
                        <>
                          <span className="proportion-label">Custom</span>
                          <span className="background-preview-colors">
                            <span className="color-dot" style={{ background: settings.bgColor1 }}></span>
                            <span className="color-dot" style={{ background: settings.bgColor2 }}></span>
                          </span>
                        </>
                      )
                    }
                    const bg = getBackgroundById(settings.backgroundTheme)
                    const section = getSectionForBackground(settings.backgroundTheme)
                    return bg ? (
                      <>
                        <span className="proportion-label">{bg.label}</span>
                        {section && (
                          <span className="proportion-section-tag">{section.label}</span>
                        )}
                      </>
                    ) : 'Select...'
                  })()}
                </span>
                <span className={`proportion-arrow ${backgroundDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              {backgroundDropdownOpen && (
                <div className="proportion-dropdown-menu">
                  <div className="proportion-search">
                    <input
                      ref={backgroundSearchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={backgroundSearch}
                      onChange={(e) => setBackgroundSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Custom background section */}
                  {(backgroundSearch === '' || 'custom'.includes(backgroundSearch.toLowerCase())) && (
                    <div className="proportion-section">
                      <div className="proportion-section-header">Custom</div>
                      <div className="background-custom">
                        <input
                          type="color"
                          value={settings.bgColor1}
                          onChange={(e) => {
                            updateSetting('bgColor1', e.target.value)
                            updateSetting('backgroundTheme', 'custom')
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="color"
                          value={settings.bgColor2}
                          onChange={(e) => {
                            updateSetting('bgColor2', e.target.value)
                            updateSetting('backgroundTheme', 'custom')
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={settings.gradientAngle}
                          onChange={(e) => {
                            updateSetting('gradientAngle', parseInt(e.target.value))
                            updateSetting('backgroundTheme', 'custom')
                          }}
                          onClick={(e) => e.stopPropagation()}
                          title="Gradient angle"
                        />
                      </div>
                    </div>
                  )}

                  {/* Filtered sections */}
                  {backgroundSections
                    .map(section => ({
                      ...section,
                      options: section.options.filter(option =>
                        backgroundSearch === '' ||
                        option.label.toLowerCase().includes(backgroundSearch.toLowerCase()) ||
                        option.description?.toLowerCase().includes(backgroundSearch.toLowerCase()) ||
                        section.label.toLowerCase().includes(backgroundSearch.toLowerCase())
                      )
                    }))
                    .filter(section => section.options.length > 0)
                    .map(section => (
                      <div key={section.id} className="proportion-section">
                        <div className="proportion-section-header">{section.label}</div>
                        {section.options.map(option => (
                          <button
                            key={option.id}
                            className={`proportion-option background-option ${settings.backgroundTheme === option.id ? 'active' : ''}`}
                            onClick={() => {
                              updateSetting('backgroundTheme', option.id)
                              updateSetting('bgColor1', option.bgColor1)
                              updateSetting('bgColor2', option.bgColor2)
                              updateSetting('gradientAngle', option.gradientAngle)
                              setBackgroundDropdownOpen(false)
                            }}
                          >
                            <span
                              className="background-option-preview"
                              style={{
                                background: `linear-gradient(${option.gradientAngle}deg, ${option.bgColor1}, ${option.bgColor2})`
                              }}
                            ></span>
                            <span className="proportion-option-label">{option.label}</span>
                            {option.description && (
                              <span className="proportion-option-desc">{option.description}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="control-group">
            <label>Corner Radius (Outer)</label>
            <div className="button-group">
              {(['none', 'small', 'medium', 'large'] as const).map(r => (
                <button
                  key={r}
                  className={settings.outerRadius === r ? 'active' : ''}
                  onClick={() => updateSetting('outerRadius', r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Corner Radius (Inner)</label>
            <div className="button-group">
              {(['none', 'small', 'medium', 'large'] as const).map(r => (
                <button
                  key={r}
                  className={settings.innerRadius === r ? 'active' : ''}
                  onClick={() => updateSetting('innerRadius', r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Shadow</label>
            <div className="button-group">
              {(['none', 'small', 'medium', 'large'] as const).map(s => (
                <button
                  key={s}
                  className={settings.shadow === s ? 'active' : ''}
                  onClick={() => updateSetting('shadow', s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Position</label>
            <div className="position-grid">
              {(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'] as const).map(pos => (
                <button
                  key={pos}
                  className={`position-btn ${settings.position === pos ? 'active' : ''}`}
                  onClick={() => updateSetting('position', pos)}
                  title={pos}
                >
                  {pos === 'center' ? '●' : '○'}
                </button>
              ))}
            </div>
          </div>

          {image && (
            <div className="export-buttons">
              <button className="primary" onClick={copyToClipboard}>
                Copy (Cmd/Ctrl+C)
              </button>
              <button className="primary" onClick={saveImage}>
                Save (Cmd/Ctrl+S)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
