import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface DropdownSection<T> {
  id: string
  label: string
  options: T[]
}

interface DropdownProps<T extends { id: string; label: string; description?: string }> {
  sections: DropdownSection<T>[]
  value: string
  onChange: (value: string, option: T) => void
  getSelectedDisplay: () => ReactNode
  renderOption?: (option: T, isActive: boolean) => ReactNode
  customSection?: ReactNode
  searchPlaceholder?: string
  filterFn?: (option: T, section: DropdownSection<T>, search: string) => boolean
}

export function Dropdown<T extends { id: string; label: string; description?: string }>({
  sections,
  value,
  onChange,
  getSelectedDisplay,
  renderOption,
  customSection,
  searchPlaceholder = 'Search...',
  filterFn,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearch('')
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }

  const defaultFilterFn = (option: T, section: DropdownSection<T>, searchTerm: string) => {
    if (searchTerm === '') return true
    const term = searchTerm.toLowerCase()
    return (
      option.label.toLowerCase().includes(term) ||
      option.description?.toLowerCase().includes(term) ||
      section.label.toLowerCase().includes(term)
    )
  }

  const filter = filterFn || defaultFilterFn

  const filteredSections = sections
    .map(section => ({
      ...section,
      options: section.options.filter(option => filter(option, section, search))
    }))
    .filter(section => section.options.length > 0)

  const defaultRenderOption = (option: T, _isActive: boolean) => (
    <>
      <span className="proportion-option-label">{option.label}</span>
      {option.description && (
        <span className="proportion-option-desc">{option.description}</span>
      )}
    </>
  )

  return (
    <div className="proportion-dropdown" ref={dropdownRef}>
      <button className="proportion-dropdown-trigger" onClick={handleToggle}>
        <span className="proportion-selected">
          {getSelectedDisplay()}
        </span>
        <span className={`proportion-arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </button>
      {isOpen && (
        <div className="proportion-dropdown-menu">
          <div className="proportion-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {customSection && (search === '' || 'custom'.includes(search.toLowerCase())) && customSection}

          {filteredSections.map(section => (
            <div key={section.id} className="proportion-section">
              <div className="proportion-section-header">{section.label}</div>
              {section.options.map(option => (
                <button
                  key={option.id}
                  className={`proportion-option ${value === option.id ? 'active' : ''}`}
                  onClick={() => {
                    onChange(option.id, option)
                    setIsOpen(false)
                  }}
                >
                  {renderOption ? renderOption(option, value === option.id) : defaultRenderOption(option, value === option.id)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
