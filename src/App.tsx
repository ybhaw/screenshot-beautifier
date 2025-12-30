import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { proportionSections, getProportionById, getSectionForProportion } from './proportions.config'
import { themeSections, getThemeById, getSectionForTheme } from './theme.config'
import { backgroundSections, getBackgroundById, getSectionForBackground } from './background.config'
import type { BackgroundOption } from './background.config'
import { defaultSettings, paddingValues, radiusValues, borderWidthValues } from './types'
import type { Settings, SizePreset, ZoomOption } from './types'
import { Dropdown, ButtonGroup, PositionGrid, ZoomControl, DropZone, ToastContainer } from './components'
import { useImageLoader } from './hooks/useImageLoader'

const sizePresets: readonly SizePreset[] = ['none', 'small', 'medium', 'large'] as const

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error'
}

function App() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [customRatio, setCustomRatio] = useState({ width: 16, height: 9 })
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<ZoomOption['id']>('fit')
  const [canvasReady, setCanvasReady] = useState(0)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewAreaRef = useRef<HTMLDivElement>(null)

  const { image, isDragging, loadImage, handleDrop, handleDragOver, handleDragLeave } = useImageLoader()

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  // Canvas rendering
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
      if (settings.position === 'center') {
        canvasWidth = imgWidth + padding * 2
        canvasHeight = imgHeight + padding * 2
      } else {
        canvasWidth = imgWidth + padding * 3
        canvasHeight = imgHeight + padding * 3
      }
    } else if (ratio === 1) {
      canvasWidth = canvasHeight = Math.max(imgWidth, imgHeight) + padding * 2
    } else if (ratio) {
      canvasWidth = imgWidth + padding * 2
      canvasHeight = canvasWidth / ratio
      if (canvasHeight < imgHeight + padding * 2) {
        canvasHeight = imgHeight + padding * 2
        canvasWidth = canvasHeight * ratio
      }
    } else {
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
        imgX = padding; imgY = padding; break
      case 'top':
        imgX = (canvasWidth - imgWidth) / 2; imgY = padding; break
      case 'top-right':
        imgX = canvasWidth - imgWidth - padding; imgY = padding; break
      case 'left':
        imgX = padding; imgY = (canvasHeight - imgHeight) / 2; break
      case 'right':
        imgX = canvasWidth - imgWidth - padding; imgY = (canvasHeight - imgHeight) / 2; break
      case 'bottom-left':
        imgX = padding; imgY = canvasHeight - imgHeight - padding; break
      case 'bottom':
        imgX = (canvasWidth - imgWidth) / 2; imgY = canvasHeight - imgHeight - padding; break
      case 'bottom-right':
        imgX = canvasWidth - imgWidth - padding; imgY = canvasHeight - imgHeight - padding; break
      default:
        imgX = (canvasWidth - imgWidth) / 2; imgY = (canvasHeight - imgHeight) / 2
    }

    // Draw shadow
    if (settings.shadow !== 'none') {
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = settings.shadow === 'small' ? 10 : settings.shadow === 'medium' ? 25 : 50
      ctx.shadowOffsetY = settings.shadow === 'small' ? 4 : settings.shadow === 'medium' ? 10 : 20
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
              ctx.fillStyle = control.color
              ctx.font = `${control.size}px Arial`
              const icons = ['\u2212', '\u25A1', '\u00D7']
              ctx.fillText(icons[i] || '\u2212', controlX - 4, controlStartY + 4)
            }
          })
        } else {
          themeConfig.controls.forEach((control, i) => {
            const controlX = imgX + imgWidth - 20 - (themeConfig.controls.length - 1 - i) * (controlSpacing + 26)
            if (control.type === 'circle') {
              ctx.beginPath()
              ctx.arc(controlX, controlStartY, control.size / 2, 0, Math.PI * 2)
              ctx.fillStyle = control.color
              ctx.fill()
            } else if (control.type === 'icon') {
              ctx.fillStyle = control.color
              ctx.font = `${control.size + 2}px Arial`
              const icons = ['\u2212', '\u25A1', '\u00D7']
              ctx.fillText(icons[i] || '\u2212', controlX - 4, controlStartY + 4)
            }
          })
        }
      }
    }

    // Draw the image
    ctx.drawImage(image, imgX, imgY + themeBarHeight)
    ctx.restore()

    // Draw screenshot border
    const screenshotBorderWidth = borderWidthValues[settings.screenshotBorder]
    if (screenshotBorderWidth > 0) {
      ctx.save()
      ctx.strokeStyle = settings.bgColor1
      ctx.lineWidth = screenshotBorderWidth
      ctx.beginPath()
      ctx.roundRect(
        imgX + screenshotBorderWidth / 2,
        imgY + screenshotBorderWidth / 2,
        imgWidth - screenshotBorderWidth,
        imgHeight - screenshotBorderWidth,
        Math.max(0, innerRadius - screenshotBorderWidth / 2)
      )
      ctx.stroke()
      ctx.restore()
    }

    // Draw image border
    const imageBorderWidth = borderWidthValues[settings.imageBorder]
    if (imageBorderWidth > 0) {
      ctx.save()
      ctx.strokeStyle = settings.bgColor2
      ctx.lineWidth = imageBorderWidth
      ctx.beginPath()
      ctx.roundRect(
        imageBorderWidth / 2,
        imageBorderWidth / 2,
        canvasWidth - imageBorderWidth,
        canvasHeight - imageBorderWidth,
        Math.max(0, innerRadius - imageBorderWidth / 2)
      )
      ctx.stroke()
      ctx.restore()
    }

    setCanvasReady(prev => prev + 1)
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

  // Window resize
  useEffect(() => {
    const handleResize = () => setCanvasReady(prev => prev + 1)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sidebar resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      setSidebarWidth(Math.max(newWidth, 250))
      setCanvasReady(prev => prev + 1)
    }
    const handleMouseUp = () => setIsResizing(false)

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvasRef.current!.toBlob((b) => resolve(b!), 'image/png')
      )
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      showToast('Copied to clipboard')
    } catch {
      showToast('Failed to copy', 'error')
    }
  }

  const saveImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'beautified-screenshot.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
    showToast('Image saved')
  }

  const reset = () => setSettings(defaultSettings)

  const getZoomStyle = (): React.CSSProperties => {
    void canvasReady
    const canvas = canvasRef.current
    const previewArea = previewAreaRef.current

    if (!canvas || !previewArea || canvas.width === 0 || canvas.height === 0) {
      return {}
    }

    const containerWidth = previewArea.clientWidth - 32
    const containerHeight = previewArea.clientHeight - 32

    switch (zoomLevel) {
      case 'fit': {
        const scaleX = containerWidth / canvas.width
        const scaleY = containerHeight / canvas.height
        const scale = Math.min(scaleX, scaleY, 1)
        if (scale < 1) {
          return { maxWidth: 'none', transform: `scale(${scale})`, transformOrigin: 'center center' }
        }
        return { maxWidth: 'none', transform: 'none' }
      }
      case '50':
        return { maxWidth: 'none', transform: 'scale(0.5)', transformOrigin: 'top left' }
      case '100':
        return { maxWidth: 'none', transform: 'none' }
      case '200':
        return { maxWidth: 'none', transform: 'scale(2)', transformOrigin: 'top left' }
      case 'match-width': {
        const scale = containerWidth / canvas.width
        return { maxWidth: 'none', transform: `scale(${scale})`, transformOrigin: 'top left' }
      }
      default:
        return {}
    }
  }

  return (
    <div className="app">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="main-content">
        <div
          ref={previewAreaRef}
          className={`preview-area ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!image ? (
            <DropZone onFileSelect={loadImage} />
          ) : (
            <>
              <div className={`canvas-container ${zoomLevel === 'fit' ? 'zoom-fit' : 'zoom-active'}`}>
                <canvas ref={canvasRef} style={getZoomStyle()} />
              </div>
              <ZoomControl value={zoomLevel} onChange={setZoomLevel} />
            </>
          )}
        </div>

        <div className="sidebar-wrapper" style={{ width: sidebarWidth }}>
          <div className="resize-handle" onMouseDown={() => setIsResizing(true)} />
          <div className="controls">
            <div className="controls-header">
              <h2>Settings</h2>
              <button className="reset-btn" onClick={reset}>Reset</button>
            </div>

            {/* Proportion */}
            <div className="control-group">
              <label>Proportion</label>
              <Dropdown
                sections={proportionSections}
                value={settings.proportion}
                onChange={(id) => updateSetting('proportion', id)}
                getSelectedDisplay={() => {
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
                }}
                customSection={
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
                        onClick={() => updateSetting('proportion', 'custom')}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Window Frame */}
            <div className="control-group">
              <label>Window Frame</label>
              <Dropdown
                sections={themeSections}
                value={settings.theme}
                onChange={(id) => updateSetting('theme', id)}
                getSelectedDisplay={() => {
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
                }}
              />
            </div>

            {/* Padding */}
            <div className="control-group">
              <label>Padding</label>
              <ButtonGroup
                options={sizePresets}
                value={settings.padding}
                onChange={(v) => updateSetting('padding', v)}
              />
            </div>

            {/* Background */}
            <div className="control-group">
              <label>Background</label>
              <Dropdown
                sections={backgroundSections}
                value={settings.backgroundTheme}
                onChange={(id, option) => {
                  const bgOption = option as BackgroundOption
                  updateSetting('backgroundTheme', id)
                  updateSetting('bgColor1', bgOption.bgColor1)
                  updateSetting('bgColor2', bgOption.bgColor2)
                  updateSetting('gradientAngle', bgOption.gradientAngle)
                }}
                getSelectedDisplay={() => {
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
                      {section && <span className="proportion-section-tag">{section.label}</span>}
                    </>
                  ) : 'Select...'
                }}
                renderOption={(option) => {
                  const bgOption = option as BackgroundOption
                  return (
                    <>
                      <span
                        className="background-option-preview"
                        style={{
                          background: `linear-gradient(${bgOption.gradientAngle}deg, ${bgOption.bgColor1}, ${bgOption.bgColor2})`
                        }}
                      ></span>
                      <span className="proportion-option-label">{option.label}</span>
                      {option.description && (
                        <span className="proportion-option-desc">{option.description}</span>
                      )}
                    </>
                  )
                }}
                customSection={
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
                }
              />
            </div>

            {/* Corner Radius */}
            <div className="control-group">
              <label>Corner Radius</label>
              <ButtonGroup
                options={sizePresets}
                value={settings.innerRadius}
                onChange={(v) => updateSetting('innerRadius', v)}
              />
            </div>

            {/* Shadow */}
            <div className="control-group">
              <label>Shadow</label>
              <ButtonGroup
                options={sizePresets}
                value={settings.shadow}
                onChange={(v) => updateSetting('shadow', v)}
              />
            </div>

            {/* Screenshot Border */}
            <div className="control-group">
              <label>Screenshot Border</label>
              <ButtonGroup
                options={sizePresets}
                value={settings.screenshotBorder}
                onChange={(v) => updateSetting('screenshotBorder', v)}
              />
            </div>

            {/* Image Border */}
            <div className="control-group">
              <label>Image Border</label>
              <ButtonGroup
                options={sizePresets}
                value={settings.imageBorder}
                onChange={(v) => updateSetting('imageBorder', v)}
              />
            </div>

            {/* Position */}
            <div className="control-group">
              <label>Position</label>
              <PositionGrid
                value={settings.position}
                onChange={(v) => updateSetting('position', v)}
              />
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
    </div>
  )
}

export default App
