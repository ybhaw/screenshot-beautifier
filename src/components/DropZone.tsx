import { useRef } from 'react'

interface DropZoneProps {
  onFileSelect: (file: File) => void
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
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
        onChange={handleFileChange}
        hidden
      />
    </div>
  )
}
