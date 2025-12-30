import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

interface Settings {
  proportion: 'auto' | 'square' | '16:9' | '4:3'
  browserTheme: 'none' | 'light' | 'dark'
  padding: 'none' | 'small' | 'medium' | 'large'
  bgColor1: string
  bgColor2: string
  gradientAngle: number
  outerRadius: 'none' | 'small' | 'medium' | 'large'
  innerRadius: 'none' | 'small' | 'medium' | 'large'
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  shadow: 'none' | 'small' | 'medium' | 'large'
  noise: boolean
}

const defaultSettings: Settings = {
  proportion: 'auto',
  browserTheme: 'none',
  padding: 'medium',
  bgColor1: '#667eea',
  bgColor2: '#764ba2',
  gradientAngle: 135,
  outerRadius: 'medium',
  innerRadius: 'small',
  position: 'center',
  shadow: 'medium',
  noise: false,
}

const paddingValues = { none: 0, small: 40, medium: 80, large: 120 }
const radiusValues = { none: 0, small: 8, medium: 16, large: 24 }
const shadowValues = {
  none: 'none',
  small: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  medium: '0 10px 25px rgba(0,0,0,0.2), 0 6px 10px rgba(0,0,0,0.1)',
  large: '0 25px 50px rgba(0,0,0,0.3), 0 12px 24px rgba(0,0,0,0.15)',
}

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = paddingValues[settings.padding]
    const innerRadius = radiusValues[settings.innerRadius]
    const browserBarHeight = settings.browserTheme !== 'none' ? 36 : 0

    // Calculate dimensions
    let canvasWidth: number
    let canvasHeight: number
    const imgWidth = image.width
    const imgHeight = image.height + browserBarHeight

    switch (settings.proportion) {
      case 'square':
        canvasWidth = canvasHeight = Math.max(imgWidth, imgHeight) + padding * 2
        break
      case '16:9':
        canvasWidth = imgWidth + padding * 2
        canvasHeight = canvasWidth * (9 / 16)
        if (canvasHeight < imgHeight + padding * 2) {
          canvasHeight = imgHeight + padding * 2
          canvasWidth = canvasHeight * (16 / 9)
        }
        break
      case '4:3':
        canvasWidth = imgWidth + padding * 2
        canvasHeight = canvasWidth * (3 / 4)
        if (canvasHeight < imgHeight + padding * 2) {
          canvasHeight = imgHeight + padding * 2
          canvasWidth = canvasHeight * (4 / 3)
        }
        break
      default: // auto
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

    // Add noise if enabled
    if (settings.noise) {
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20
        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
      }
      ctx.putImageData(imageData, 0, 0)
    }

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

    // Draw browser bar if enabled
    if (settings.browserTheme !== 'none') {
      const barColor = settings.browserTheme === 'light' ? '#f1f3f4' : '#202124'
      const dotColors = ['#ff5f56', '#ffbd2e', '#27ca40']

      ctx.fillStyle = barColor
      ctx.fillRect(imgX, imgY, imgWidth, browserBarHeight)

      // Draw traffic light dots
      dotColors.forEach((color, i) => {
        ctx.beginPath()
        ctx.arc(imgX + 20 + i * 20, imgY + browserBarHeight / 2, 6, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })
    }

    // Draw the image
    ctx.drawImage(image, imgX, imgY + browserBarHeight)
    ctx.restore()

  }, [image, settings])

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
      <header className="header">
        <h1>Screenshot Beautifier</h1>
        <p className="subtitle">Paste, drop, or upload a screenshot to beautify it</p>
      </header>

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
            <div className="button-group">
              {(['auto', 'square', '16:9', '4:3'] as const).map(p => (
                <button
                  key={p}
                  className={settings.proportion === p ? 'active' : ''}
                  onClick={() => updateSetting('proportion', p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Browser Theme</label>
            <div className="button-group">
              {(['none', 'light', 'dark'] as const).map(t => (
                <button
                  key={t}
                  className={settings.browserTheme === t ? 'active' : ''}
                  onClick={() => updateSetting('browserTheme', t)}
                >
                  {t}
                </button>
              ))}
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
            <div className="color-inputs">
              <input
                type="color"
                value={settings.bgColor1}
                onChange={(e) => updateSetting('bgColor1', e.target.value)}
              />
              <input
                type="color"
                value={settings.bgColor2}
                onChange={(e) => updateSetting('bgColor2', e.target.value)}
              />
              <input
                type="range"
                min="0"
                max="360"
                value={settings.gradientAngle}
                onChange={(e) => updateSetting('gradientAngle', parseInt(e.target.value))}
                title="Gradient angle"
              />
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
            <label>
              <input
                type="checkbox"
                checked={settings.noise}
                onChange={(e) => updateSetting('noise', e.target.checked)}
              />
              Add Noise Texture
            </label>
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

      <footer className="footer">
        <p>Use Cmd/Ctrl+C to copy or Cmd/Ctrl+S to save the image</p>
      </footer>
    </div>
  )
}

export default App
