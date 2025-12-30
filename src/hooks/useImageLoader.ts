import { useState, useCallback, useEffect } from 'react'

export function useImageLoader() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return

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
        if (file) loadImage(file)
        break
      }
    }
  }, [loadImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) {
      loadImage(file)
    }
  }, [loadImage])

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

  return {
    image,
    isDragging,
    loadImage,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  }
}
