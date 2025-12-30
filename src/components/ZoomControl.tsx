import { useState, useRef, useEffect } from 'react'
import { zoomOptions } from '../types'
import type { ZoomOption } from '../types'

interface ZoomControlProps {
  value: ZoomOption['id']
  onChange: (value: ZoomOption['id']) => void
}

export function ZoomControl({ value, onChange }: ZoomControlProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentOption = zoomOptions.find((z) => z.id === value)

  return (
    <div className="zoom-overlay" ref={dropdownRef}>
      <button className="zoom-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="zoom-icon">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <span className="zoom-label">{currentOption?.label}</span>
        <span className={`zoom-arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </button>
      {isOpen && (
        <div className="zoom-dropdown-menu">
          {zoomOptions.map((option) => (
            <button
              key={option.id}
              className={`zoom-option ${value === option.id ? 'active' : ''}`}
              onClick={() => {
                onChange(option.id)
                setIsOpen(false)
              }}
            >
              <span className="zoom-option-label">{option.label}</span>
              <span className="zoom-option-desc">{option.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
